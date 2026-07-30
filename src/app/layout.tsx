import type { Metadata } from 'next';
import './globals.css';
import MainLayoutWrapper from '@/components/layout/MainLayoutWrapper';
import { prisma } from '@/lib/prisma';

export const metadata: Metadata = {
  title: 'Artificial Craft Flower | Modern Flower Bouquet Catalog & Custom Order',
  description: 'Abadikan momen indah dengan bucket bunga artificial kustom berkualitas tinggi yang tahan selamanya. Wisuda, Ulang Tahun, Anniversary, & Custom Bouquet.',
  keywords: 'artificial flower, buket bunga, buket wisuda, money bouquet, kado unik, artificial craft flower',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let setting = null;
  try {
    setting = await prisma.websiteSetting.findUnique({
      where: { id: 'default' },
    });
  } catch (error) {
    console.error('Failed to load website settings in root layout:', error);
  }

  return (
    <html lang="id">
      <body className="antialiased font-sans bg-white text-slate-900">
        <MainLayoutWrapper setting={setting}>{children}</MainLayoutWrapper>
      </body>
    </html>
  );
}
