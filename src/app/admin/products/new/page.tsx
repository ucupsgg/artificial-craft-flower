import { prisma } from '@/lib/prisma';
import { getAdminSession } from '@/lib/session';
import { redirect } from 'next/navigation';
import ProductFormClient from '@/components/admin/ProductFormClient';

export const revalidate = 0;

export default async function AdminNewProductPage() {
  const session = await getAdminSession();
  if (!session) redirect('/admin/login');

  let categories: any[] = [];
  try {
    categories = await prisma.category.findMany({ orderBy: { name: 'asc' } });
  } catch (err) {
    console.error('Error fetching categories for new product:', err);
  }

  return (
    <div className="space-y-6">
      <div className="bg-slate-800/80 p-6 rounded-3xl border border-slate-700/80">
        <h1 className="text-2xl font-black text-white">Tambah Produk Buket Baru</h1>
        <p className="text-slate-400 text-xs mt-1">
          Lengkapi informasi produk, atur harga & diskon promo, upload foto, serta konfigurasi SEO.
        </p>
      </div>

      <ProductFormClient categories={categories} />
    </div>
  );
}
