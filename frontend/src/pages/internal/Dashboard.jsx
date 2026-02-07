import { useState, useEffect } from 'react';
import { Layout } from '../../components/Layout/Layout.jsx';
import { PageHeader } from '../../components/ui/PageHeader.jsx';
import { StatCard } from '../../components/ui/StatCard.jsx';
import { reportService } from '../../lib/services/reportService.js';
import { Users, FileText, IndianRupee, Loader2, ClipboardList, Activity, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  Legend
} from 'recharts';

// Colors for charts
const COLORS = ['#7c3aed', '#06b6d4', '#10b981', '#f59e0b', '#ef4444'];
const STATUS_COLORS = {
  Draft: '#6b7280',
  Quotation: '#f59e0b',
  Confirmed: '#3b82f6',
  Active: '#10b981',
  Closed: '#ef4444'
};

export default function InternalDashboard() {
  const [stats, setStats] = useState(null);
  const [operationalStats, setOperationalStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [dashboardStats, opStats] = await Promise.all([
          reportService.getDashboardStats(),
          reportService.getOperationalStats()
        ]);
        console.log('Dashboard Stats:', dashboardStats);
        console.log('Operational Stats:', opStats);
        setStats(dashboardStats);
        setOperationalStats(opStats);
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading) {
    return (
      <Layout type="internal">
        <PageHeader title="Dashboard" />
        <div className="flex justify-center items-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  const totalPendingWork = operationalStats?.pendingWork?.reduce((sum, item) => sum + item.count, 0) || 0;

  return (
    <Layout type="internal">
      <PageHeader title="Dashboard" />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <StatCard 
          title="Active Subscriptions" 
          value={stats?.activeSubscriptions || 0} 
          icon={<Users size={24} />} 
        />
        <StatCard 
          title="Pending Invoices" 
          value={stats?.pendingInvoices || 0} 
          icon={<FileText size={24} />} 
        />
        <StatCard 
          title="Monthly Revenue" 
          value={`₹${Number(stats?.monthlyRevenue || 0).toLocaleString('en-IN')}`} 
          icon={<IndianRupee size={24} />} 
        />
        <StatCard 
          title="Items Pending Action" 
          value={totalPendingWork} 
          icon={<AlertCircle size={24} />}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Pending Work Queue */}
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <ClipboardList className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold text-foreground">Pending Work Queue</h3>
          </div>
          {operationalStats?.pendingWork?.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={operationalStats.pendingWork} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis type="number" stroke="hsl(var(--muted-foreground))" />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  width={100}
                  stroke="hsl(var(--muted-foreground))"
                  tick={{ fontSize: 12 }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    color: 'hsl(var(--foreground))'
                  }}
                />
                <Bar 
                  dataKey="count" 
                  fill="#7c3aed" 
                  radius={[0, 4, 4, 0]}
                  name="Count"
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[250px] text-muted-foreground">
              <div className="text-center">
                <Activity className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No pending items</p>
              </div>
            </div>
          )}
        </div>

        {/* Subscription Status Distribution */}
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <Users className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold text-foreground">Subscription Status</h3>
          </div>
          {operationalStats?.statusDistribution?.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={operationalStats.statusDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="value"
                  nameKey="name"
                  label={({ name, value }) => `${name}: ${value}`}
                  labelLine={{ stroke: 'hsl(var(--muted-foreground))' }}
                >
                  {operationalStats.statusDistribution.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={STATUS_COLORS[entry.name] || COLORS[index % COLORS.length]} 
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    color: 'hsl(var(--foreground))'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[250px] text-muted-foreground">
              <div className="text-center">
                <Users className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No subscription data</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Weekly Activity Chart */}
      <div className="bg-card border border-border rounded-lg p-6 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Activity className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Weekly Activity (Last 7 Days)</h3>
        </div>
        {operationalStats?.dailyActivity?.length > 0 ? (
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={operationalStats.dailyActivity}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="day" 
                stroke="hsl(var(--muted-foreground))"
                tick={{ fontSize: 12 }}
              />
              <YAxis 
                stroke="hsl(var(--muted-foreground))"
                allowDecimals={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                  color: 'hsl(var(--foreground))'
                }}
              />
              <Legend />
              <Area
                type="monotone"
                dataKey="subscriptions"
                name="Subscriptions"
                stroke="#7c3aed"
                fill="#7c3aed"
                fillOpacity={0.3}
                strokeWidth={2}
              />
              <Area
                type="monotone"
                dataKey="invoices"
                name="Invoices"
                stroke="#06b6d4"
                fill="#06b6d4"
                fillOpacity={0.3}
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-[250px] text-muted-foreground">
            <div className="text-center">
              <Activity className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>No recent activity</p>
            </div>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h3>
        <p className="text-sm text-muted-foreground mb-4">
          As an internal user, you can manage subscriptions and invoices.
          Product and plan management is restricted to administrators.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link 
            to="/internal/subscriptions"
            className="p-4 bg-muted/50 hover:bg-muted rounded-lg transition-colors group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                <Users size={20} />
              </div>
              <div>
                <p className="font-medium text-foreground">Subscriptions</p>
                <p className="text-xs text-muted-foreground">Process subscription state changes</p>
              </div>
            </div>
          </Link>
          <Link 
            to="/internal/invoices"
            className="p-4 bg-muted/50 hover:bg-muted rounded-lg transition-colors group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                <FileText size={20} />
              </div>
              <div>
                <p className="font-medium text-foreground">Invoices</p>
                <p className="text-xs text-muted-foreground">Manage invoice confirmations and payments</p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </Layout>
  );
}
