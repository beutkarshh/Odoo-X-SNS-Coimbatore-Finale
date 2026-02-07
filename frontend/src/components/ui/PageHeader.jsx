import { cn } from '../../lib/utils.js';

export function PageHeader({ title, action, className }) {
  return (
    <div className={cn('page-header', className)}>
      <h1 className="page-title">{title}</h1>
      {action && <div>{action}</div>}
    </div>
  );
}
