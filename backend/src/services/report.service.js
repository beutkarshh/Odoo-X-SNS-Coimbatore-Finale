const { prisma } = require('../config/db');
const { SubscriptionStatus, InvoiceStatus } = require('@prisma/client');

exports.getDashboardStats = async () => {
  const [totalProducts, activeSubscriptions, paidInvoices, pendingInvoices] = await Promise.all([
    prisma.product.count(),
    prisma.subscription.count({ where: { status: SubscriptionStatus.ACTIVE } }),
    prisma.invoice.findMany({
      where: { status: InvoiceStatus.PAID },
      select: { total: true }
    }),
    prisma.invoice.count({ where: { status: { not: InvoiceStatus.PAID } } })
  ]);

  // Convert Decimal strings to numbers before summing
  const monthlyRevenue = paidInvoices.reduce((sum, invoice) => sum + Number(invoice.total || 0), 0);

  return {
    totalProducts,
    activeSubscriptions,
    monthlyRevenue,
    pendingInvoices
  };
};

/**
 * Get monthly revenue trend for last 6 months
 */
exports.getRevenueTrend = async () => {
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
  sixMonthsAgo.setDate(1);
  sixMonthsAgo.setHours(0, 0, 0, 0);

  const invoices = await prisma.invoice.findMany({
    where: {
      status: InvoiceStatus.PAID,
      paidAt: { gte: sixMonthsAgo }
    },
    select: {
      total: true,
      paidAt: true
    }
  });

  // Group by month
  const monthlyData = {};
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  // Initialize last 6 months with 0
  for (let i = 5; i >= 0; i--) {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    const key = `${months[date.getMonth()]} ${date.getFullYear()}`;
    monthlyData[key] = 0;
  }

  // Sum revenue by month
  invoices.forEach(invoice => {
    if (invoice.paidAt) {
      const date = new Date(invoice.paidAt);
      const key = `${months[date.getMonth()]} ${date.getFullYear()}`;
      if (monthlyData.hasOwnProperty(key)) {
        monthlyData[key] += Number(invoice.total || 0);
      }
    }
  });

  // Convert to array format for charts
  return Object.entries(monthlyData).map(([month, revenue]) => ({
    month,
    revenue: Math.round(revenue)
  }));
};

/**
 * Get subscription status distribution
 */
exports.getSubscriptionDistribution = async () => {
  const statuses = Object.values(SubscriptionStatus);
  
  const counts = await Promise.all(
    statuses.map(status => 
      prisma.subscription.count({ where: { status } })
    )
  );

  return statuses.map((status, index) => ({
    name: status.charAt(0) + status.slice(1).toLowerCase(),
    value: counts[index]
  })).filter(item => item.value > 0); // Only include statuses with subscriptions
};

/**
 * Get top products by revenue
 */
exports.getTopProductsByRevenue = async () => {
  // Get all subscription lines with their products and related invoices
  const subscriptionLines = await prisma.subscriptionLine.findMany({
    include: {
      product: { select: { id: true, name: true } },
      subscription: {
        include: {
          invoices: {
            where: { status: InvoiceStatus.PAID },
            select: { total: true }
          }
        }
      }
    }
  });

  // Calculate revenue per product
  const productRevenue = {};
  
  subscriptionLines.forEach(line => {
    const productId = line.product.id;
    const productName = line.product.name;
    
    if (!productRevenue[productId]) {
      productRevenue[productId] = { name: productName, revenue: 0 };
    }
    
    // Add revenue from paid invoices
    line.subscription.invoices.forEach(invoice => {
      // Distribute invoice total proportionally (simplified: just add full amount)
      productRevenue[productId].revenue += Number(invoice.total || 0);
    });
  });

  // Sort by revenue and take top 5
  return Object.values(productRevenue)
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5)
    .map(p => ({ ...p, revenue: Math.round(p.revenue) }));
};

/**
 * Get combined chart data for dashboard
 */
exports.getChartData = async () => {
  const [revenueTrend, subscriptionDistribution, topProducts] = await Promise.all([
    exports.getRevenueTrend(),
    exports.getSubscriptionDistribution(),
    exports.getTopProductsByRevenue()
  ]);

  return {
    revenueTrend,
    subscriptionDistribution,
    topProducts
  };
};

/**
 * Get operational stats for internal users
 * Shows pending work items and recent activity
 */
exports.getOperationalStats = async () => {
  // Get pending items by status
  const [
    draftSubscriptions,
    quotationSubscriptions,
    confirmedSubscriptions,
    draftInvoices,
    confirmedInvoices
  ] = await Promise.all([
    prisma.subscription.count({ where: { status: SubscriptionStatus.DRAFT } }),
    prisma.subscription.count({ where: { status: SubscriptionStatus.QUOTATION } }),
    prisma.subscription.count({ where: { status: SubscriptionStatus.CONFIRMED } }),
    prisma.invoice.count({ where: { status: InvoiceStatus.DRAFT } }),
    prisma.invoice.count({ where: { status: InvoiceStatus.CONFIRMED } })
  ]);

  // Get daily activity for last 7 days
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  sevenDaysAgo.setHours(0, 0, 0, 0);

  const [recentInvoices, recentSubscriptions] = await Promise.all([
    prisma.invoice.findMany({
      where: { createdAt: { gte: sevenDaysAgo } },
      select: { createdAt: true, status: true }
    }),
    prisma.subscription.findMany({
      where: { createdAt: { gte: sevenDaysAgo } },
      select: { createdAt: true, status: true }
    })
  ]);

  // Group by day
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const dailyActivity = {};
  
  // Initialize last 7 days
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const key = `${days[date.getDay()]} ${date.getDate()}`;
    dailyActivity[key] = { day: key, invoices: 0, subscriptions: 0 };
  }

  // Count activity per day
  recentInvoices.forEach(inv => {
    const date = new Date(inv.createdAt);
    const key = `${days[date.getDay()]} ${date.getDate()}`;
    if (dailyActivity[key]) {
      dailyActivity[key].invoices++;
    }
  });

  recentSubscriptions.forEach(sub => {
    const date = new Date(sub.createdAt);
    const key = `${days[date.getDay()]} ${date.getDate()}`;
    if (dailyActivity[key]) {
      dailyActivity[key].subscriptions++;
    }
  });

  // Get subscription status distribution
  const subscriptionStatuses = Object.values(SubscriptionStatus);
  const statusCounts = await Promise.all(
    subscriptionStatuses.map(status => 
      prisma.subscription.count({ where: { status } })
    )
  );

  const statusDistribution = subscriptionStatuses.map((status, index) => ({
    name: status.charAt(0) + status.slice(1).toLowerCase(),
    value: statusCounts[index],
    status: status
  })).filter(item => item.value > 0);

  return {
    pendingWork: [
      { name: 'Draft Subs', count: draftSubscriptions, type: 'subscription' },
      { name: 'Quotations', count: quotationSubscriptions, type: 'subscription' },
      { name: 'To Activate', count: confirmedSubscriptions, type: 'subscription' },
      { name: 'Draft Invoices', count: draftInvoices, type: 'invoice' },
      { name: 'Pending Payment', count: confirmedInvoices, type: 'invoice' }
    ],
    dailyActivity: Object.values(dailyActivity),
    statusDistribution
  };
};

