import { prisma } from '@/lib/prisma';
import { getAdminSession } from '@/lib/session';
import { redirect } from 'next/navigation';
import FaqManagerClient from '@/components/admin/FaqManagerClient';

export const revalidate = 0;

export default async function AdminFaqsPage() {
  const session = await getAdminSession();
  if (!session) redirect('/admin/login');

  let faqs: any[] = [];
  try {
    faqs = await prisma.fAQ.findMany({ orderBy: { order: 'asc' } });
  } catch (err) {
    console.error('Error fetching FAQs:', err);
  }

  return (
    <div className="space-y-6">
      <div className="bg-slate-800/80 p-6 rounded-3xl border border-slate-700/80">
        <h1 className="text-2xl font-black text-white">Manajemen FAQ Website</h1>
        <p className="text-slate-400 text-xs mt-1">
          Kelola pertanyaan umum, jawaban, dan urutan tampil untuk calon pelanggan.
        </p>
      </div>

      <FaqManagerClient initialFaqs={faqs} />
    </div>
  );
}
