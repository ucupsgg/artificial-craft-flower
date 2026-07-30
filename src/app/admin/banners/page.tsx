import { prisma } from '@/lib/prisma';
import { getAdminSession } from '@/lib/session';
import { redirect } from 'next/navigation';
import BannerManagerClient from '@/components/admin/BannerManagerClient';

export const revalidate = 0;

export default async function AdminBannersPage() {
  const session = await getAdminSession();
  if (!session) redirect('/admin/login');

  let banners: any[] = [];
  try {
    banners = await prisma.banner.findMany({ orderBy: { order: 'asc' } });
  } catch (err) {
    console.error('Error fetching banners:', err);
  }

  return (
    <div className="space-y-6">
      <div className="bg-slate-800/80 p-6 rounded-3xl border border-slate-700/80">
        <h1 className="text-2xl font-black text-white">Manajemen Banner Promo & Hero</h1>
        <p className="text-slate-400 text-xs mt-1">
          Upload banner visual, atur teks hero, urutan tampil, dan status pengaktifan.
        </p>
      </div>

      <BannerManagerClient initialBanners={banners} />
    </div>
  );
}
