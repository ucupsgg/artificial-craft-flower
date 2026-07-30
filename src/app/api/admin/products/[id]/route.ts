import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAdminSession } from '@/lib/session';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const product = await prisma.product.findUnique({
      where: { id },
      include: { category: true, images: true, sizes: true },
    });
    if (!product) return NextResponse.json({ success: false, error: 'Produk tidak ditemukan' }, { status: 404 });
    return NextResponse.json({ success: true, product });
  } catch (err) {
    return NextResponse.json({ success: false, error: 'Gagal mengambil detail produk' }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
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

    const generatedSlug = slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    // Delete existing images & recreate if new image list provided
    if (images && Array.isArray(images)) {
      await prisma.productImage.deleteMany({ where: { productId: id } });
    }

    const updatedProduct = await prisma.product.update({
      where: { id },
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
        status: Boolean(status),
        seoTitle,
        seoDescription,
        categoryId,
        ...(images && Array.isArray(images)
          ? {
              images: {
                create: images.map((imgUrl: string, index: number) => ({
                  url: imgUrl,
                  isPrimary: index === 0,
                })),
              },
            }
          : {}),
      },
      include: { images: true, category: true },
    });

    return NextResponse.json({ success: true, product: updatedProduct });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || 'Gagal mengubah produk' }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  try {
    await prisma.product.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ success: false, error: 'Gagal menghapus produk' }, { status: 500 });
  }
}
