import { prisma } from '@/lib/prisma';
import { getAdminSession } from '@/lib/session';
import { redirect } from 'next/navigation';
import SizeManagerClient from '@/components/admin/SizeManagerClient';

export const revalidate = 0;

export default async function AdminSizesPage() {
  const session = await getAdminSession();
  if (!session) redirect('/admin/login');

  let sizes: any[] = [];
  try {
    sizes = await prisma.size.findMany({ orderBy: { priceAdjust: 'asc' } });
  } catch (err) {
    console.error('Error fetching sizes:', err);
  }

  return (
    <div className="space-y-6">
      <div className="bg-slate-800/80 p-6 rounded-3xl border border-slate-700/80">
        <h1 className="text-2xl font-black text-white">Manajemen Ukuran Buket</h1>
        <p className="text-slate-400 text-xs mt-1">
          Kelola variasi ukuran buket (Small, Medium, Large, XL) dan penyesuaian harga tambahan.
        </p>
      </div>

      <SizeManagerClient initialSizes={sizes} />
    </div>
  );
}
