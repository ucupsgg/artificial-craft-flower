import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAdminSession } from '@/lib/session';

export async function GET() {
  const setting = await prisma.websiteSetting.findUnique({ where: { id: 'default' } });
  return NextResponse.json({ success: true, setting });
}

export async function POST(req: Request) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await req.json();
    const updated = await prisma.websiteSetting.upsert({
      where: { id: 'default' },
      update: body,
      create: { id: 'default', ...body },
    });

    return NextResponse.json({ success: true, setting: updated });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || 'Gagal menyimpan pengaturan' }, { status: 500 });
  }
}
