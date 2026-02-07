import { cn } from '../lib/utils.js';
import { SubscriptionStatus, InvoiceStatus } from '../data/constants.js';

const statusStyles = {
  DRAFT: 'bg-muted text-muted-foreground',
  QUOTATION: 'bg-info/10 text-info border border-info/20',
  CONFIRMED: 'bg-warning/10 text-warning-foreground border border-warning/20',
  ACTIVE: 'bg-success/10 text-success border border-success/20',
  CLOSED: 'bg-foreground/10 text-foreground/70',
  PAID: 'bg-success/10 text-success border border-success/20',
};

const statusLabels = {
  DRAFT: 'Draft',
  QUOTATION: 'Quotation',
  CONFIRMED: 'Confirmed',
  ACTIVE: 'Active',
  CLOSED: 'Closed',
  PAID: 'Paid',
};

export function StatusBadge({ status, className }) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium',
        statusStyles[status] || 'bg-muted text-muted-foreground',
        className
      )}
    >
      {statusLabels[status] || status}
    </span>
  );
}
