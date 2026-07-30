import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAdminSession } from '@/lib/session';

export async function GET() {
  const items = await prisma.gallery.findMany({ orderBy: { createdAt: 'desc' } });
  return NextResponse.json({ success: true, items });
}

export async function POST(req: Request) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

  try {
    const { title, image, category } = await req.json();
    if (!title || !image || !category) {
      return NextResponse.json({ success: false, error: 'Judul, Gambar, dan Kategori wajib diisi.' }, { status: 400 });
    }

    const item = await prisma.gallery.create({
      data: { title, image, category },
    });

    return NextResponse.json({ success: true, item });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || 'Gagal menambah item galeri' }, { status: 500 });
  }
}
