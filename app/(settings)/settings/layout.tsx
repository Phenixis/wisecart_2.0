'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Settings, Shield, Activity, Menu, X } from 'lucide-react';
import Sidebar from '@/components/sidebar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navItems = [
    // { href: '/settings', icon: Users, label: 'Team' },
    { href: '/settings/general', icon: Settings, label: 'General' },
    { href: '/settings/activity', icon: Activity, label: 'Activity' },
    { href: '/settings/security', icon: Shield, label: 'Security' },
  ];

  return (
    <div className="flex flex-col min-h-[calc(100dvh-68px)] max-w-7xl mx-auto w-full">
      {/* Mobile header */}
      <div className="lg:hidden flex items-center bg-white border-b border-gray-200 p-4">
        <Button
          className="-mr-3"
          variant="ghost"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          <Menu className="h-6 w-6" />
          <span className="sr-only">Open sidebar</span>
        </Button>
        <div className="flex items-center">
          <span className="font-medium">Menu</span>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden h-full">
        {/* Sidebar */}
        <Sidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} navItems={navItems} />

        {/* Main content */}
        <main className="flex-1 overflow-y-auto p-0 lg:p-4">{children}</main>
      </div>
    </div>
  );
}
