import { useState } from 'react';
import { Layout } from '../../components/Layout/Layout.jsx';
import { PageHeader } from '../../components/ui/PageHeader.jsx';
import { StatusBadge } from '../../components/StatusBadge.jsx';
import { Button } from '../../components/ui/Button.jsx';
import { getSubscriptionsWithDetails } from '../../data/mockData.js';
import { SubscriptionStatus, SUBSCRIPTION_TRANSITIONS } from '../../data/constants.js';
import { ChevronDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../../components/ui/DropdownMenu.jsx';

export default function InternalSubscriptions() {
  const [subscriptions, setSubscriptions] = useState(getSubscriptionsWithDetails());

  const getNextActions = (status) => {
    return SUBSCRIPTION_TRANSITIONS[status] || [];
  };

  const handleStatusChange = (subscriptionId, newStatus) => {
    setSubscriptions((prev) =>
      prev.map((sub) => (sub.id === subscriptionId ? { ...sub, status: newStatus } : sub))
    );
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

  return (
    <Layout type="internal">
      <PageHeader title="Subscriptions" />

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
            {subscriptions.map((subscription) => {
              const nextActions = getNextActions(subscription.status);

              return (
                <tr key={subscription.id}>
                  <td className="font-medium text-foreground">{subscription.number}</td>
                  <td>{subscription.user?.name}</td>
                  <td>{subscription.plan?.name}</td>
                  <td>{new Date(subscription.startDate).toLocaleDateString()}</td>
                  <td>{new Date(subscription.endDate).toLocaleDateString()}</td>
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
            })}
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
    </Layout>
  );
}
