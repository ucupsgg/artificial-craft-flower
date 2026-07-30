import { prisma } from '@/lib/prisma';
import ProductCard from '@/components/products/ProductCard';
import CollectionFilters from '@/components/products/CollectionFilters';

export const revalidate = 0;

interface CollectionPageProps {
  searchParams: Promise<{
    category?: string;
    search?: string;
    sort?: string;
  }>;
}

export default async function CollectionPage({ searchParams }: CollectionPageProps) {
  const params = await searchParams;
  const selectedCategory = params.category || 'all';
  const searchQuery = params.search || '';
  const sort = params.sort || 'newest';

  // Build Prisma query filter
  const whereFilter: any = {
    status: true,
  };

  if (selectedCategory !== 'all') {
    whereFilter.category = {
      slug: selectedCategory,
    };
  }

  if (searchQuery) {
    whereFilter.OR = [
      { name: { contains: searchQuery } },
      { description: { contains: searchQuery } },
    ];
  }

  // Build sort condition
  let orderBy: any = { createdAt: 'desc' };
  if (sort === 'price-low') {
    orderBy = { price: 'asc' };
  } else if (sort === 'price-high') {
    orderBy = { price: 'desc' };
  }

  let products: any[] = [];
  let categories: any[] = [];

  try {
    categories = await prisma.category.findMany({ orderBy: { name: 'asc' } });
    products = await prisma.product.findMany({
      where: whereFilter,
      orderBy,
      include: { images: true, category: true },
    });
  } catch (err) {
    console.error('Error fetching collection products:', err);
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-rose-500 to-pink-600 rounded-3xl p-8 sm:p-10 text-white shadow-lg space-y-2">
        <span className="text-xs font-bold uppercase tracking-widest text-rose-100">Katalog Lengkap</span>
        <h1 className="text-3xl sm:text-4xl font-extrabold">Koleksi Buket Bunga Artificial</h1>
        <p className="text-rose-100 text-sm max-w-2xl">
          Temukan koleksi buket bunga artificial buatan tangan terbaik untuk wisuda, ulang tahun, anniversary, hingga Money Bouquet kustom.
        </p>
      </div>

      {/* Filter Component */}
      <CollectionFilters
        categories={categories}
        selectedCategory={selectedCategory}
        searchQuery={searchQuery}
        sort={sort}
      />

      {/* Product List Grid */}
      {products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 space-y-4">
          <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto font-black text-2xl">
            🌸
          </div>
          <h3 className="text-xl font-bold text-slate-800">Tidak ada produk ditemukan</h3>
          <p className="text-slate-500 text-sm max-w-md mx-auto">
            Coba ubah kata kunci pencarian atau pilih kategori lain untuk menemukan buket bunga yang Anda cari.
          </p>
        </div>
      )}
    </div>
  );
}
