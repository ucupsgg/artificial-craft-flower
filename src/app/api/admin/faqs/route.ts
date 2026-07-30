import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAdminSession } from '@/lib/session';

export async function GET() {
  const faqs = await prisma.fAQ.findMany({ orderBy: { order: 'asc' } });
  return NextResponse.json({ success: true, faqs });
}

export async function POST(req: Request) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

  try {
    const { question, answer, order, isActive } = await req.json();
    if (!question || !answer) {
      return NextResponse.json({ success: false, error: 'Pertanyaan dan Jawaban wajib diisi.' }, { status: 400 });
    }

    const faq = await prisma.fAQ.create({
      data: {
        question,
        answer,
        order: order ? parseInt(order) : 0,
        isActive: isActive !== undefined ? Boolean(isActive) : true,
      },
    });

    return NextResponse.json({ success: true, faq });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || 'Gagal menambah FAQ' }, { status: 500 });
  }
}
