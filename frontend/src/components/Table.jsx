import { cn } from '../lib/utils.js';

export function Table({ children, className }) {
  return (
    <div className="bg-card border border-border rounded-md overflow-hidden">
      <table className={cn('erp-table', className)}>{children}</table>
    </div>
  );
}

export function TableHeader({ children }) {
  return <thead>{children}</thead>;
}

export function TableBody({ children }) {
  return <tbody>{children}</tbody>;
}

export function TableRow({ children, className }) {
  return <tr className={className}>{children}</tr>;
}

export function TableHead({ children, className }) {
  return <th className={className}>{children}</th>;
}

export function TableCell({ children, className }) {
  return <td className={className}>{children}</td>;
}
