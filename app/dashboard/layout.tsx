'use client';

import Footer from '@/components/footer';
import Header from '@/components/header';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {Menu, X, Home, ShoppingCart, CookingPot, Salad } from 'lucide-react';

export const experimental_ppr = true;

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navItems = [
    { href: '/dashboard', icon: Home, label: 'Dashboard' },
    { href: '/dashboard/shopping-lists', icon: ShoppingCart, label: 'Shopping Lists' },
    { href: '/dashboard/meal-lists', icon: CookingPot, label: 'Meal Lists' },
    { href: '/dashboard/ingredient-lists', icon: Salad, label: 'Ingredient Lists' },
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
          <aside
            className={`w-64 border-r border-gray-200 lg:block ${
              isSidebarOpen ? 'block' : 'hidden'
            } lg:relative absolute inset-y-0 left-0 z-40 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
              isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
            }`}
          >
            <nav className="h-full overflow-y-auto">
              <Button
                className="lg:hidden"
                variant="ghost"
                size={'icon'}
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              >
                <X className="size-6" />
                <span className="sr-only">Close sidebar</span>
              </Button>
              {navItems.map((item) => (
                <Link key={item.href} href={item.href} passHref>
                  <Button
                    className={`w-full justify-start bg-base-100 p-5 ${ pathname === item.href ? 'text-primary' : ''}`}
                    onClick={() => setIsSidebarOpen(false)}
                  >
                    <item.icon className="mr-2 h-4 w-4" />
                    {item.label}
                  </Button>
                </Link>
              ))}
            </nav>
          </aside>

          {/* Main content */}
          <main className="flex-1 overflow-y-auto p-0 lg:p-4">{children}</main>
        </div>
      </main>
      <Footer />
    </section>
  );
}
