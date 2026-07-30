import { prisma } from '@/lib/prisma';
import { getAdminSession } from '@/lib/session';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Plus, Package, Edit, Tag, Sparkles } from 'lucide-react';
import ProductTableClient from '@/components/admin/ProductTableClient';

export const revalidate = 0;

export default async function AdminProductsPage() {
  const session = await getAdminSession();
  if (!session) redirect('/admin/login');

  let products: any[] = [];
  try {
    products = await prisma.product.findMany({
      include: { category: true, images: true },
      orderBy: { createdAt: 'desc' },
    });
  } catch (err) {
    console.error('Error fetching admin products:', err);
  }

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-800/80 p-6 rounded-3xl border border-slate-700/80">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <Package className="w-6 h-6 text-rose-500" /> Manajemen Produk
          </h1>
          <p className="text-slate-400 text-xs mt-1">
            Tambah, edit, sesuaikan harga, atur diskon, dan kelola status produk katalog.
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="inline-flex items-center gap-2 bg-rose-600 hover:bg-rose-700 text-white font-bold px-5 py-3 rounded-full text-xs uppercase tracking-wider shadow-lg transition-all"
        >
          <Plus className="w-4 h-4" /> Tambah Produk Baru
        </Link>
      </div>

      {/* Client Table */}
      <ProductTableClient initialProducts={products} />

    </div>
  );
}
