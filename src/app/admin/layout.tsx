import { getAdminSession } from '@/lib/session';
import { redirect } from 'next/navigation';
import AdminSidebar from '@/components/admin/AdminSidebar';

export const revalidate = 0;

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getAdminSession();

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex">
      {session && <AdminSidebar user={session} />}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto max-w-7xl mx-auto">
        {children}
      </main>
    </div>
  );
}
