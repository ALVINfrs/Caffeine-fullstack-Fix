'use client';

import { useAuth } from '@/context/auth-context';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import { Home, Package, Users, ShoppingCart, Calendar, Tag, LayoutDashboard, Coffee, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';

// NavItem Component for cleaner code
const NavItem = ({ href, icon: Icon, label }: { href: string; icon: React.ElementType; label: string; }) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <li>
      <Link
        href={href}
        className={`flex items-center p-3 my-1 rounded-lg transition-colors duration-200 ${isActive
            ? 'bg-amber-100/80 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300 font-semibold'
            : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200/50 dark:hover:bg-gray-700/50'
          }`}>
        <Icon className="mr-3 h-5 w-5" />
        {label}
      </Link>
    </li>
  );
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  useEffect(() => {
    if (!loading && (!user || user.role !== 'admin')) {
      router.push('/admin/login');
    }
  }, [user, loading, router]);

  if (loading || !user || user.role !== 'admin') {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <p className="flex items-center"><Coffee className="animate-pulse mr-2"/> Loading...</p>
      </div>
    );
  }

  const handleLogout = async () => {
    await logout();
    router.push('/admin/login');
  };

  return (
    <div className="flex min-h-screen bg-muted/40 dark:bg-background">
      <aside className="w-64 flex flex-col bg-card border-r dark:border-gray-800 p-4">
        <div className="flex items-center gap-3 mb-6 px-2">
            <Coffee className="h-8 w-8 text-amber-600"/>
            <h2 className="text-xl font-bold text-foreground">Caffeine Admin</h2>
        </div>
        <nav className="flex-1">
          <ul>
            <NavItem href="/admin/dashboard" icon={LayoutDashboard} label="Dashboard" />
            <NavItem href="/admin/users" icon={Users} label="Users" />
            <NavItem href="/admin/products" icon={Package} label="Products" />
            <NavItem href="/admin/orders" icon={ShoppingCart} label="Orders" />
            <NavItem href="/admin/reservations" icon={Calendar} label="Reservations" />
            <NavItem href="/admin/vouchers" icon={Tag} label="Vouchers" />
          </ul>
        </nav>
        <div className="mt-4">
            <Button onClick={() => router.push('/')} variant="outline" className="w-full mb-2"><Home className="mr-2 h-4 w-4"/>Back to Home</Button>
            <Button onClick={handleLogout} variant="destructive" className="w-full"><LogOut className="mr-2 h-4 w-4"/>Logout</Button>
        </div>
      </aside>
      <main className="flex-1 p-6 lg:p-8">
        <div className="animate-fade-in">
            {children}
        </div>
      </main>
    </div>
  );
}
