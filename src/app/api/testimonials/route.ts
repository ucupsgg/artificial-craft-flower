import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Public GET: Only returns approved testimonials
export async function GET() {
  try {
    const testimonials = await prisma.testimonial.findMany({
      where: { status: true },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json({ success: true, testimonials });
  } catch (err: any) {
    console.error('Error fetching public testimonials:', err);
    return NextResponse.json({ success: false, error: 'Gagal mengambil data ulasan' }, { status: 500 });
  }
}

// Public POST: Allows customers to submit a review (status defaults to false / pending approval)
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, role, content, rating, avatar } = body;

    if (!name || !name.trim()) {
      return NextResponse.json({ success: false, error: 'Nama pemohon ulasan wajib diisi.' }, { status: 400 });
    }

    if (!content || !content.trim()) {
      return NextResponse.json({ success: false, error: 'Isi ulasan ulasan wajib diisi.' }, { status: 400 });
    }

    const newTestimonial = await prisma.testimonial.create({
      data: {
        name: name.trim(),
        role: role?.trim() || 'Pelanggan Toko',
        content: content.trim(),
        rating: Number(rating) || 5,
        avatar: avatar || null,
        status: false, // Default: Pending Admin Selection & Approval
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Terima kasih! Ulasan Anda telah berhasil dikirim dan akan ditampilkan setelah ditinjau oleh Admin.',
      testimonial: newTestimonial,
    });
  } catch (err: any) {
    console.error('Error submitting testimonial:', err);
    return NextResponse.json(
      { success: false, error: err.message || 'Gagal mengirimkan ulasan.' },
      { status: 500 }
    );
  }
}
