import { prisma } from '@/lib/prisma';
import { getAdminSession } from '@/lib/session';
import { redirect } from 'next/navigation';
import TestimonialManagerClient from '@/components/admin/TestimonialManagerClient';

export const revalidate = 0;

export default async function AdminTestimonialsPage() {
  const session = await getAdminSession();
  if (!session) redirect('/admin/login');

  let testimonials: any[] = [];
  try {
    testimonials = await prisma.testimonial.findMany({ orderBy: { createdAt: 'desc' } });
  } catch (err) {
    console.error('Error fetching testimonials:', err);
  }

  return (
    <div className="space-y-6">
      <div className="bg-slate-800/80 p-6 rounded-3xl border border-slate-700/80">
        <h1 className="text-2xl font-black text-white">Manajemen Testimoni & Ulasan Pelanggan</h1>
        <p className="text-slate-400 text-xs mt-1">
          Kelola ulasan kepuasan pelanggan, nama, rating bintang, dan avatar.
        </p>
      </div>

      <TestimonialManagerClient initialTestimonials={testimonials} />
    </div>
  );
}
