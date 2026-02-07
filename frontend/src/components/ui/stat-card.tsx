import React from 'react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({ title, value, icon, className }) => {
  return (
    <div className={cn('stat-card', className)}>
      <div className="flex items-start justify-between">
        <div>
          <p className="stat-card-value">{value}</p>
          <p className="stat-card-label">{title}</p>
        </div>
        {icon && (
          <div className="p-2 bg-primary/10 rounded-md text-primary">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
};
