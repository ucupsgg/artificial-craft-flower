import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAdminSession } from '@/lib/session';

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      include: { category: true, images: true, sizes: { include: { size: true } } },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json({ success: true, products });
  } catch (err) {
    return NextResponse.json({ success: false, error: 'Gagal mengambil data produk' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await req.json();
    const {
      name,
      slug,
      description,
      price,
      discountPrice,
      isDiscount,
      isBestSeller,
      isFeatured,
      isPromo,
      status,
      seoTitle,
      seoDescription,
      categoryId,
      images,
    } = body;

    if (!name || !price || !categoryId) {
      return NextResponse.json({ success: false, error: 'Nama, Harga, dan Kategori wajib diisi.' }, { status: 400 });
    }

    const generatedSlug = slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    const product = await prisma.product.create({
      data: {
        name,
        slug: generatedSlug,
        description,
        price: parseFloat(price),
        discountPrice: discountPrice ? parseFloat(discountPrice) : null,
        isDiscount: Boolean(isDiscount),
        isBestSeller: Boolean(isBestSeller),
        isFeatured: Boolean(isFeatured),
        isPromo: Boolean(isPromo),
        status: status !== undefined ? Boolean(status) : true,
        seoTitle,
        seoDescription,
        categoryId,
        images: {
          create: (images || []).map((imgUrl: string, index: number) => ({
            url: imgUrl,
            isPrimary: index === 0,
          })),
        },
      },
      include: { images: true, category: true },
    });

    return NextResponse.json({ success: true, product });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || 'Gagal menambah produk' }, { status: 500 });
  }
}
