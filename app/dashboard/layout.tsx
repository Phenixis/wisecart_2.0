'use client';

import Footer from '@/components/footer';
import Header from '@/components/header';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {Menu, Home, ShoppingCart, CookingPot, Salad } from 'lucide-react';
import Sidebar from '@/components/sidebar';

export const experimental_ppr = true;

export default function Layout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navItems = [
    { href: '/dashboard', icon: Home, label: 'Dashboard' },
    { href: '/dashboard/shopping-lists', icon: ShoppingCart, label: 'Shopping Lists' },
    { href: '/dashboard/meal-list', icon: CookingPot, label: 'Meal Lists' },
    { href: '/dashboard/ingredient-list', icon: Salad, label: 'Ingredient Lists' },
  ];

  return (
    <section className="flex flex-col min-h-screen">
      <Header />
      <main className="flex flex-col min-h-[calc(100dvh-68px)] max-w-7xl mx-auto w-full">
        {/* Mobile header */}
        <div className="lg:hidden bg-base-100 border-b border-gray-200 p-4">
            <div
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className='flex items-center w-fit'>
              <Button
                className="-mr-3"
                variant="ghost"
                >
                <Menu className="h-6 w-6" />
                <span className="sr-only">Open sidebar</span>
              </Button>
              <div className="flex items-center">
                <span className="font-medium">Menu</span>
              </div>
            </div>
        </div>

        <div className="flex flex-1 overflow-hidden h-full">
          {/* Sidebar */}
          <Sidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} navItems={navItems} />

          {/* Main content */}
          <main className="flex-1 overflow-y-auto p-0 lg:p-4">{children}</main>
        </div>
      </main>
      <Footer />
    </section>
  );
}
