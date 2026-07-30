import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAdminSession } from '@/lib/session';

export async function GET() {
  const sizes = await prisma.size.findMany({ orderBy: { priceAdjust: 'asc' } });
  return NextResponse.json({ success: true, sizes });
}

export async function POST(req: Request) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

  try {
    const { name, priceAdjust } = await req.json();
    if (!name) return NextResponse.json({ success: false, error: 'Nama ukuran wajib diisi.' }, { status: 400 });

    const size = await prisma.size.create({
      data: { name, priceAdjust: parseFloat(priceAdjust || 0) },
    });

    return NextResponse.json({ success: true, size });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || 'Gagal menambah ukuran' }, { status: 500 });
  }
}
