import { useState, useEffect, useMemo } from 'react';
import { Layout } from '../../components/Layout/Layout.jsx';
import { PageHeader } from '../../components/ui/PageHeader.jsx';
import { StatusBadge } from '../../components/StatusBadge.jsx';
import { Button } from '../../components/ui/Button.jsx';
import { subscriptionService } from '../../lib/services/subscriptionService.js';
import { SubscriptionStatus, SUBSCRIPTION_TRANSITIONS } from '../../data/constants.js';
import { ChevronDown, Loader2, Search, Filter, X, RefreshCw, Plus } from 'lucide-react';
import { CreateSubscriptionModal } from '../../components/CreateSubscriptionModal.jsx';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../../components/ui/DropdownMenu.jsx';

export default function InternalSubscriptions() {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [refreshing, setRefreshing] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const handleSubscriptionCreated = (newSubscription) => {
    // Reload subscriptions to get the new one
    loadSubscriptions();
  };

  useEffect(() => {
    loadSubscriptions();
  }, []);

  const loadSubscriptions = async () => {
    try {
      const result = await subscriptionService.getAll();
      if (result.success && Array.isArray(result.data)) {
        setSubscriptions(result.data);
      }
    } catch (error) {
      console.error('Failed to load subscriptions:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadSubscriptions();
  };

  // Filter subscriptions based on search and status
  const filteredSubscriptions = useMemo(() => {
    return subscriptions.filter((sub) => {
      // Status filter
      if (statusFilter !== 'ALL' && sub.status !== statusFilter) {
        return false;
      }
      
      // Search filter (subscription number, customer name, plan name)
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesNumber = sub.subscriptionNo?.toLowerCase().includes(query);
        const matchesCustomer = sub.customer?.name?.toLowerCase().includes(query);
        const matchesPlan = sub.plan?.name?.toLowerCase().includes(query);
        const matchesEmail = sub.customer?.email?.toLowerCase().includes(query);
        
        if (!matchesNumber && !matchesCustomer && !matchesPlan && !matchesEmail) {
          return false;
        }
      }
      
      return true;
    });
  }, [subscriptions, searchQuery, statusFilter]);

  // Count subscriptions by status for quick filters
  const statusCounts = useMemo(() => {
    const counts = { ALL: subscriptions.length };
    Object.values(SubscriptionStatus).forEach(status => {
      counts[status] = subscriptions.filter(s => s.status === status).length;
    });
    return counts;
  }, [subscriptions]);

  const getNextActions = (status) => {
    return SUBSCRIPTION_TRANSITIONS[status] || [];
  };

  const handleStatusChange = async (subscriptionId, newStatus) => {
    try {
      const result = await subscriptionService.updateStatus(subscriptionId, newStatus);
      if (result.success) {
        setSubscriptions((prev) =>
          prev.map((sub) => (sub.id === subscriptionId ? { ...sub, status: newStatus } : sub))
        );
      }
    } catch (error) {
      console.error('Failed to update subscription status:', error);
    }
  };

  const getActionLabel = (status) => {
    const labels = {
      [SubscriptionStatus.DRAFT]: 'Move to Draft',
      [SubscriptionStatus.QUOTATION]: 'Send Quotation',
      [SubscriptionStatus.CONFIRMED]: 'Confirm',
      [SubscriptionStatus.ACTIVE]: 'Activate',
      [SubscriptionStatus.CLOSED]: 'Close',
    };
    return labels[status];
  };

  if (loading) {
    return (
      <Layout type="internal">
        <PageHeader title="Subscriptions" />
        <div className="flex justify-center items-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout type="internal">
      <PageHeader title="Subscriptions" />

      {/* Search and Filter Bar */}
      <div className="bg-card border border-border rounded-lg p-4 mb-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search Input */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <input
              type="text"
              placeholder="Search by subscription #, customer name, email, or plan..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-10 py-2 border border-border rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Status Filter Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="min-w-[150px]">
                <Filter className="w-4 h-4 mr-2" />
                {statusFilter === 'ALL' ? 'All Status' : statusFilter}
                <ChevronDown className="w-4 h-4 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={() => setStatusFilter('ALL')}>
                <span className="flex-1">All Status</span>
                <span className="text-xs text-muted-foreground">{statusCounts.ALL}</span>
              </DropdownMenuItem>
              {Object.values(SubscriptionStatus).map(status => (
                <DropdownMenuItem key={status} onClick={() => setStatusFilter(status)}>
                  <StatusBadge status={status} />
                  <span className="ml-auto text-xs text-muted-foreground">{statusCounts[status] || 0}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Refresh Button */}
          <Button variant="outline" onClick={handleRefresh} disabled={refreshing}>
            <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>

          {/* New Subscription Button */}
          <Button onClick={() => setShowCreateModal(true)}>
            <Plus className="w-4 h-4 mr-2" />
            New Subscription
          </Button>
        </div>

        {/* Quick Status Filters */}
        <div className="flex flex-wrap gap-2 mt-4">
          <button
            onClick={() => setStatusFilter('ALL')}
            className={`px-3 py-1.5 text-xs font-medium rounded-full transition-colors ${
              statusFilter === 'ALL'
                ? 'bg-primary text-white'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            All ({statusCounts.ALL})
          </button>
          {Object.values(SubscriptionStatus).map(status => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 text-xs font-medium rounded-full transition-colors ${
                statusFilter === status
                  ? 'bg-primary text-white'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              {status.charAt(0) + status.slice(1).toLowerCase()} ({statusCounts[status] || 0})
            </button>
          ))}
        </div>

        {/* Results Summary */}
        <div className="mt-3 text-sm text-muted-foreground">
          Showing {filteredSubscriptions.length} of {subscriptions.length} subscriptions
          {searchQuery && <span> matching "<strong className="text-foreground">{searchQuery}</strong>"</span>}
        </div>
      </div>

      <div className="bg-card border border-border rounded-md overflow-hidden">
        <table className="erp-table">
          <thead>
            <tr>
              <th>Number</th>
              <th>Customer</th>
              <th>Plan</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Status</th>
              <th className="w-32">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredSubscriptions.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center py-8 text-muted-foreground">
                  {subscriptions.length === 0 
                    ? 'No subscriptions found' 
                    : 'No subscriptions match your search/filter criteria'}
                </td>
              </tr>
            ) : (
              filteredSubscriptions.map((subscription) => {
                const nextActions = getNextActions(subscription.status);

                return (
                  <tr key={subscription.id}>
                    <td className="font-medium text-foreground">{subscription.subscriptionNo}</td>
                    <td>
                      <div>
                        <p className="font-medium">{subscription.customer?.name || 'N/A'}</p>
                        <p className="text-xs text-muted-foreground">{subscription.customer?.email}</p>
                      </div>
                    </td>
                    <td>{subscription.plan?.name || 'N/A'}</td>
                    <td>{subscription.startDate ? new Date(subscription.startDate).toLocaleDateString() : 'N/A'}</td>
                    <td>{subscription.expirationDate ? new Date(subscription.expirationDate).toLocaleDateString() : 'N/A'}</td>
                    <td>
                      <StatusBadge status={subscription.status} />
                    </td>
                    <td>
                      {nextActions.length > 0 ? (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm" className="h-8">
                              Actions
                              <ChevronDown size={14} className="ml-1" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {nextActions.map((action) => (
                              <DropdownMenuItem
                                key={action}
                                onClick={() => handleStatusChange(subscription.id, action)}
                              >
                                {getActionLabel(action)}
                              </DropdownMenuItem>
                            ))}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      ) : (
                        <span className="text-xs text-muted-foreground">No actions</span>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-6 p-4 bg-muted/50 rounded-md">
        <h3 className="text-sm font-medium text-foreground mb-3">Subscription Lifecycle</h3>
        <div className="flex items-center gap-2 text-xs text-muted-foreground flex-wrap">
          <StatusBadge status={SubscriptionStatus.DRAFT} />
          <span>→</span>
          <StatusBadge status={SubscriptionStatus.QUOTATION} />
          <span>→</span>
          <StatusBadge status={SubscriptionStatus.CONFIRMED} />
          <span>→</span>
          <StatusBadge status={SubscriptionStatus.ACTIVE} />
          <span>→</span>
          <StatusBadge status={SubscriptionStatus.CLOSED} />
        </div>
      </div>

      {/* Create Subscription Modal */}
      <CreateSubscriptionModal
        open={showCreateModal}
        onOpenChange={setShowCreateModal}
        onSuccess={handleSubscriptionCreated}
      />
    </Layout>
  );
}
