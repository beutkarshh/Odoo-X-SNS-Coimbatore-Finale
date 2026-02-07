import { useState } from 'react';
import { Sidebar } from '../Sidebar.jsx';
import { cn } from '../../lib/utils.js';

export function Layout({ children, type = 'admin' }) {
  const [sidebarOpen] = useState(true);

  return (
    <div className="min-h-screen flex w-full bg-muted/30">
      <Sidebar type={type} />
      <main className={cn('flex-1', sidebarOpen ? 'ml-64' : 'ml-16')}>
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}
