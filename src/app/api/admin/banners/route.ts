import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAdminSession } from '@/lib/session';

export async function GET() {
  const banners = await prisma.banner.findMany({ orderBy: { order: 'asc' } });
  return NextResponse.json({ success: true, banners });
}

export async function POST(req: Request) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

  try {
    const { title, subtitle, image, link, order, isActive } = await req.json();
    if (!title || !image) {
      return NextResponse.json({ success: false, error: 'Judul dan URL Gambar wajib diisi.' }, { status: 400 });
    }

    const banner = await prisma.banner.create({
      data: {
        title,
        subtitle,
        image,
        link,
        order: order ? parseInt(order) : 0,
        isActive: isActive !== undefined ? Boolean(isActive) : true,
      },
    });

    return NextResponse.json({ success: true, banner });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || 'Gagal menambah banner' }, { status: 500 });
  }
}
