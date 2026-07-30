'use client';

import { usePathname } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

interface MainLayoutWrapperProps {
  children: React.ReactNode;
  setting: any;
}

export default function MainLayoutWrapper({ children, setting }: MainLayoutWrapperProps) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith('/admin');

  if (isAdminRoute) {
    return <main className="min-h-screen bg-slate-900 text-slate-100">{children}</main>;
  }

  return (
    <div className="flex flex-col min-h-screen bg-white text-slate-900">
      <Navbar siteName={setting?.siteName} whatsapp={setting?.whatsapp} />
      <main className="flex-grow bg-white">{children}</main>
      <Footer setting={setting} />
    </div>
  );
}
