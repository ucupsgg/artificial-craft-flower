import { NextResponse } from 'next/server';
import { loginAdmin } from '@/lib/session';

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) {
      return NextResponse.json({ success: false, error: 'Email dan password wajib diisi.' }, { status: 400 });
    }

    const result = await loginAdmin(email, password);
    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error }, { status: 401 });
    }

    return NextResponse.json({ success: true, user: result.user });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Server error saat login.' }, { status: 500 });
  }
}
