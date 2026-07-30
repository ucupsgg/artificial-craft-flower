import { cookies } from 'next/headers';
import { prisma } from './prisma';
import bcrypt from 'bcryptjs';

const SESSION_COOKIE_NAME = 'admin_session';

export async function loginAdmin(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return { success: false, error: 'Email atau password salah.' };
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return { success: false, error: 'Email atau password salah.' };
  }

  // Set session cookie
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, user.id, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  });

  return { success: true, user };
}

export async function logoutAdmin() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

export async function getAdminSession() {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    if (!sessionToken) return null;

    const user = await prisma.user.findUnique({
      where: { id: sessionToken },
      select: { id: true, name: true, email: true, role: true },
    });

    return user;
  } catch (error) {
    return null;
  }
}
