import { prisma } from '@/lib/prisma';
import { getAdminSession } from '@/lib/session';
import { redirect } from 'next/navigation';
import GalleryManagerClient from '@/components/admin/GalleryManagerClient';

export const revalidate = 0;

export default async function AdminGalleryPage() {
  const session = await getAdminSession();
  if (!session) redirect('/admin/login');

  let items: any[] = [];
  try {
    items = await prisma.gallery.findMany({ orderBy: { createdAt: 'desc' } });
  } catch (err) {
    console.error('Error fetching gallery:', err);
  }

  return (
    <div className="space-y-6">
      <div className="bg-slate-800/80 p-6 rounded-3xl border border-slate-700/80">
        <h1 className="text-2xl font-black text-white">Manajemen Galeri Buket Terbuat</h1>
        <p className="text-slate-400 text-xs mt-1">
          Upload foto hasil buket buatan toko berdasarkan kategori (Graduation, Birthday, Money Bouquet, dll).
        </p>
      </div>

      <GalleryManagerClient initialItems={items} />
    </div>
  );
}
