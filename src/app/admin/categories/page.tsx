import { prisma } from '@/lib/prisma';
import { getAdminSession } from '@/lib/session';
import { redirect } from 'next/navigation';
import CategoryManagerClient from '@/components/admin/CategoryManagerClient';

export const revalidate = 0;

export default async function AdminCategoriesPage() {
  const session = await getAdminSession();
  if (!session) redirect('/admin/login');

  let categories: any[] = [];
  try {
    categories = await prisma.category.findMany({
      include: { _count: { select: { products: true } } },
      orderBy: { name: 'asc' },
    });
  } catch (err) {
    console.error('Error fetching categories:', err);
  }

  return (
    <div className="space-y-6">
      <div className="bg-slate-800/80 p-6 rounded-3xl border border-slate-700/80">
        <h1 className="text-2xl font-black text-white">Manajemen Kategori Buket</h1>
        <p className="text-slate-400 text-xs mt-1">
          Kelola kategori produk seperti Graduation, Birthday, Anniversary, Money Bouquet, dll.
        </p>
      </div>

      <CategoryManagerClient initialCategories={categories} />
    </div>
  );
}
