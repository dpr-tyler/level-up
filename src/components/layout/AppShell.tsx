'use client';
import { useState } from 'react';
import { Sidebar } from './Sidebar';
import { TopNav } from './TopNav';

export function AppShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="lg:pl-64">
        <TopNav onMenuClick={() => setSidebarOpen(true)} />
        <main className="p-6 max-w-6xl mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
