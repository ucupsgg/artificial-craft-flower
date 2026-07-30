import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { getAdminSession } from '@/lib/session';

export async function POST(req: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ success: false, error: 'File tidak ditemukan' }, { status: 400 });
    }

    // Validate image format
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/jpg'];
    if (!validTypes.includes(file.type.toLowerCase())) {
      return NextResponse.json(
        { success: false, error: 'Format file tidak didukung. Harap upload gambar JPG, PNG, atau WEBP.' },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create unique filename
    const ext = path.extname(file.name) || '.jpg';
    const filename = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}${ext}`;

    // Target upload dir: public/uploads
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    await mkdir(uploadDir, { recursive: true });

    const filePath = path.join(uploadDir, filename);
    await writeFile(filePath, buffer);

    const fileUrl = `/uploads/${filename}`;

    return NextResponse.json({ success: true, url: fileUrl });
  } catch (err: any) {
    console.error('Error uploading file:', err);
    return NextResponse.json(
      { success: false, error: err.message || 'Gagal mengunggah berkas gambar' },
      { status: 500 }
    );
  }
}
