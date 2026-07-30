import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAdminSession } from '@/lib/session';

export async function GET() {
  const categories = await prisma.category.findMany({
    include: { _count: { select: { products: true } } },
    orderBy: { name: 'asc' },
  });
  return NextResponse.json({ success: true, categories });
}

export async function POST(req: Request) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

  try {
    const { name, slug } = await req.json();
    if (!name) return NextResponse.json({ success: false, error: 'Nama kategori wajib diisi.' }, { status: 400 });

    const generatedSlug = slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    const category = await prisma.category.create({
      data: { name, slug: generatedSlug },
    });

    return NextResponse.json({ success: true, category });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || 'Gagal menambah kategori' }, { status: 500 });
  }
}
