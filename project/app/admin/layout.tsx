"use client";

import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Settings, 
  ChevronLeft, 
  ChevronRight,
  LogOut,
  Package
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

interface NavItem {
  title: string;
  href: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  {
    title: 'Dashboard',
    href: '/admin',
    icon: <LayoutDashboard className="h-5 w-5" />,
  },
  {
    title: 'Produtos',
    href: '/admin/produtos',
    icon: <Package className="h-5 w-5" />,
  },
  {
    title: 'Pedidos',
    href: '/admin/pedidos',
    icon: <ShoppingBag className="h-5 w-5" />,
  },
  {
    title: 'Configurações',
    href: '/admin/configuracoes',
    icon: <Settings className="h-5 w-5" />,
  },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const adminAuth = localStorage.getItem('adminAuth');
      if (!adminAuth && pathname !== '/admin/auth') {
        router.push('/admin/auth');
      } else {
        setIsAuthenticated(true);
      }
    };

    checkAuth();
  }, [pathname, router]);

  const handleLogout = () => {
    localStorage.removeItem('adminAuth');
    router.push('/admin/auth');
  };

  if (!isAuthenticated && pathname !== '/admin/auth') {
    return null;
  }

  if (pathname === '/admin/auth') {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <div
        className={cn(
          "bg-white border-r transition-all duration-300",
          isCollapsed ? "w-16" : "w-64"
        )}
      >
        <div className="flex flex-col h-full">
          <div className="h-16 flex items-center justify-between px-4 border-b">
            {!isCollapsed && (
              <Link href="/admin" className="font-bold text-xl text-primary">
                RL Admin
              </Link>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="ml-auto"
            >
              {isCollapsed ? (
                <ChevronRight className="h-4 w-4" />
              ) : (
                <ChevronLeft className="h-4 w-4" />
              )}
            </Button>
          </div>

          <ScrollArea className="flex-1 py-4">
            <nav className="space-y-2 px-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900",
                    pathname === item.href ? "bg-gray-100 text-gray-900" : "",
                    isCollapsed ? "justify-center" : ""
                  )}
                >
                  {item.icon}
                  {!isCollapsed && <span>{item.title}</span>}
                </Link>
              ))}
            </nav>
          </ScrollArea>

          <div className="h-16 border-t flex items-center px-4">
            <Button
              variant="ghost"
              className={cn(
                "text-gray-500 hover:text-gray-900",
                isCollapsed ? "w-full justify-center" : "w-full justify-start"
              )}
              onClick={handleLogout}
            >
              <LogOut className="h-5 w-5" />
              {!isCollapsed && <span className="ml-3">Sair</span>}
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1">
        <div className="h-16 bg-white border-b flex items-center px-8">
          <h1 className="text-xl font-semibold">
            {navItems.find((item) => item.href === pathname)?.title || 'Admin'}
          </h1>
        </div>
        <main className="p-8">{children}</main>
      </div>
    </div>
  );
}