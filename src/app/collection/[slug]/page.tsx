import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import ProductDetailClient from '@/components/products/ProductDetailClient';

export const revalidate = 0;

interface ProductDetailPageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { slug } = await params;

  let product: any = null;
  let sizes: any[] = [];
  let websiteSetting: any = null;

  try {
    product = await prisma.product.findUnique({
      where: { slug },
      include: {
        images: true,
        category: true,
        sizes: { include: { size: true } },
      },
    });

    sizes = await prisma.size.findMany({ orderBy: { priceAdjust: 'asc' } });
    websiteSetting = await prisma.websiteSetting.findUnique({ where: { id: 'default' } });
  } catch (err) {
    console.error('Error fetching product detail:', err);
  }

  if (!product) {
    notFound();
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <ProductDetailClient
        product={product}
        allSizes={sizes}
        whatsappNumber={websiteSetting?.whatsapp || '6281234567890'}
      />
    </div>
  );
}
