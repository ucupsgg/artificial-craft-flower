import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAdminSession } from '@/lib/session';

export async function GET() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const testimonials = await prisma.testimonial.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json({ success: true, testimonials });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { name, role, content, rating, avatar, status } = body;

    const testimonial = await prisma.testimonial.create({
      data: {
        name,
        role: role || 'Pelanggan',
        content,
        rating: Number(rating) || 5,
        avatar: avatar || null,
        status: status !== undefined ? Boolean(status) : true,
      },
    });

    return NextResponse.json({ success: true, testimonial });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
