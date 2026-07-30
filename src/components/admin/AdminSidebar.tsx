'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  Layers,
  Maximize2,
  Image as ImageIcon,
  Camera,
  MessageSquare,
  HelpCircle,
  Settings,
  LogOut,
  Flower2,
  ExternalLink,
} from 'lucide-react';

interface AdminSidebarProps {
  user: {
    name: string;
    email: string;
  };
}

export default function AdminSidebar({ user }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  // If on login page, don't show sidebar
  if (pathname === '/admin/login') return null;

  const menuItems = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Produk', href: '/admin/products', icon: Package },
    { name: 'Kategori', href: '/admin/categories', icon: Layers },
    { name: 'Ukuran', href: '/admin/sizes', icon: Maximize2 },
    { name: 'Banner', href: '/admin/banners', icon: ImageIcon },
    { name: 'Gallery', href: '/admin/gallery', icon: Camera },
    { name: 'Testimoni', href: '/admin/testimonials', icon: MessageSquare },
    { name: 'FAQ', href: '/admin/faqs', icon: HelpCircle },
    { name: 'Website Setting', href: '/admin/settings', icon: Settings },
  ];

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push('/admin/login');
    router.refresh();
  };

  return (
    <aside className="w-64 bg-slate-950 border-r border-slate-800 flex flex-col justify-between shrink-0 hidden md:flex">
      <div className="p-6 space-y-6">
        
        {/* Brand */}
        <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-500 to-amber-400 p-0.5 shadow-md">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Flower2 className="w-5 h-5 text-rose-400" />
            </div>
          </div>
          <div>
            <h2 className="font-extrabold text-sm text-white leading-tight">Admin Panel</h2>
            <p className="text-[11px] text-rose-400 font-semibold">Artificial Craft</p>
          </div>
        </div>

        {/* Links */}
        <nav className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-rose-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* View Public Website Link */}
        <div className="pt-2 border-t border-slate-800">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-amber-400 hover:text-amber-300 transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" /> Lihat Website Publik
          </Link>
        </div>

      </div>

      {/* User Info & Logout */}
      <div className="p-4 border-t border-slate-800 bg-slate-900/50 space-y-3">
        <div className="px-2">
          <p className="text-xs font-extrabold text-white truncate">{user.name}</p>
          <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
        </div>

        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 bg-slate-800 hover:bg-red-600/80 text-slate-300 hover:text-white py-2 rounded-xl text-xs font-bold transition-all"
        >
          <LogOut className="w-3.5 h-3.5" /> Logout
        </button>
      </div>
    </aside>
  );
}
