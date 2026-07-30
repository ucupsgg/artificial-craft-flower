import { prisma } from '@/lib/prisma';
import { getAdminSession } from '@/lib/session';
import { redirect } from 'next/navigation';
import SettingsClient from '@/components/admin/SettingsClient';

export const revalidate = 0;

export default async function AdminSettingsPage() {
  const session = await getAdminSession();
  if (!session) redirect('/admin/login');

  let setting: any = null;
  try {
    setting = await prisma.websiteSetting.findUnique({ where: { id: 'default' } });
  } catch (err) {
    console.error('Error fetching settings:', err);
  }

  return (
    <div className="space-y-6">
      <div className="bg-slate-800/80 p-6 rounded-3xl border border-slate-700/80">
        <h1 className="text-2xl font-black text-white">Website Setting</h1>
        <p className="text-slate-400 text-xs mt-1">
          Ubah informasi umum website, hero title, nomor WhatsApp, media sosial, dan lokasi toko.
        </p>
      </div>

      <SettingsClient initialSetting={setting} />
    </div>
  );
}
