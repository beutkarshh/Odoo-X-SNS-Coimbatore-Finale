import React from 'react';
import { cn } from '@/lib/utils';

interface PageHeaderProps {
  title: string;
  action?: React.ReactNode;
  className?: string;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ title, action, className }) => {
  return (
    <div className={cn('page-header', className)}>
      <h1 className="page-title">{title}</h1>
      {action && <div>{action}</div>}
    </div>
  );
};
