import { prisma } from '@/lib/prisma';
import GalleryClient from '@/components/gallery/GalleryClient';

export const revalidate = 0;

export default async function GalleryPage() {
  let galleryItems: any[] = [];
  try {
    galleryItems = await prisma.gallery.findMany({ orderBy: { createdAt: 'desc' } });
  } catch (err) {
    console.error('Error loading gallery:', err);
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-extrabold uppercase tracking-widest text-rose-600">Portofolio Buket</span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900">Galeri Hasil Karya Buket Bunga</h1>
        <p className="text-slate-500 text-sm">
          Koleksi dokumentasi buket bunga buatan (artificial) buatan tangan kami untuk berbagai acara wisuda, ulang tahun, pernikahan, hingga Money Bouquet.
        </p>
      </div>

      <GalleryClient items={galleryItems} />
    </div>
  );
}
