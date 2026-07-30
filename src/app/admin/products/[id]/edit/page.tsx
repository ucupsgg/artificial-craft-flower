import { prisma } from '@/lib/prisma';
import { getAdminSession } from '@/lib/session';
import { redirect, notFound } from 'next/navigation';
import ProductFormClient from '@/components/admin/ProductFormClient';

export const revalidate = 0;

interface EditProductPageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminEditProductPage({ params }: EditProductPageProps) {
  const session = await getAdminSession();
  if (!session) redirect('/admin/login');

  const { id } = await params;
  let product: any = null;
  let categories: any[] = [];

  try {
    product = await prisma.product.findUnique({
      where: { id },
      include: { images: true },
    });
    categories = await prisma.category.findMany({ orderBy: { name: 'asc' } });
  } catch (err) {
    console.error('Error fetching product for edit:', err);
  }

  if (!product) notFound();

  return (
    <div className="space-y-6">
      <div className="bg-slate-800/80 p-6 rounded-3xl border border-slate-700/80">
        <h1 className="text-2xl font-black text-white">Edit Produk: {product.name}</h1>
        <p className="text-slate-400 text-xs mt-1">
          Ubah harga, diskon promo, gambar, atau deskripsi produk.
        </p>
      </div>

      <ProductFormClient categories={categories} initialData={product} />
    </div>
  );
}
