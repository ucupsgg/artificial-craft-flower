import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAdminSession } from '@/lib/session';

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await req.json();
    const { name, role, content, rating, avatar, status } = body;

    const testimonial = await prisma.testimonial.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(role !== undefined && { role }),
        ...(content && { content }),
        ...(rating !== undefined && { rating: Number(rating) }),
        ...(avatar !== undefined && { avatar }),
        ...(status !== undefined && { status: Boolean(status) }),
      },
    });

    return NextResponse.json({ success: true, testimonial });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await params;
    await prisma.testimonial.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
