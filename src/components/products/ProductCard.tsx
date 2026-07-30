import Link from 'next/link';
import Image from 'next/image';
import { Tag, Sparkles, ChevronRight, Eye } from 'lucide-react';

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    discountPrice?: number | null;
    isDiscount?: boolean;
    isBestSeller?: boolean;
    isPromo?: boolean;
    category?: { name: string; slug: string };
    images?: { url: string; isPrimary: boolean }[];
  };
  isDarkTheme?: boolean;
}

export default function ProductCard({ product, isDarkTheme = false }: ProductCardProps) {
  const primaryImage =
    product.images?.find((img) => img.isPrimary)?.url ||
    product.images?.[0]?.url ||
    'https://images.unsplash.com/photo-1561181286-d3fee7d55364?q=80&w=800&auto=format&fit=crop';

  const hasDiscount = product.isDiscount && product.discountPrice && product.discountPrice < product.price;

  const formatRupiah = (num: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(num);
  };

  return (
    <div
      className={`group relative rounded-2xl overflow-hidden transition-all duration-300 flex flex-col justify-between ${
        isDarkTheme
          ? 'bg-slate-800/80 border border-slate-700/80 hover:border-rose-500/50 shadow-md'
          : 'bg-white border border-slate-200/80 hover:border-rose-300 hover:shadow-xl shadow-xs'
      }`}
    >
      <div>
        {/* Product Image Container */}
        <div className="relative aspect-[4/5] w-full overflow-hidden bg-slate-100">
          <Image
            src={primaryImage}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5 items-start">
            {hasDiscount && (
              <span className="inline-flex items-center gap-1 bg-rose-600 text-white text-[11px] font-extrabold px-2.5 py-1 rounded-full shadow-md uppercase tracking-wider">
                <Tag className="w-3 h-3" /> Promo
              </span>
            )}
            {product.isBestSeller && (
              <span className="inline-flex items-center gap-1 bg-amber-500 text-slate-900 text-[11px] font-extrabold px-2.5 py-1 rounded-full shadow-md uppercase tracking-wider">
                <Sparkles className="w-3 h-3" /> Best Seller
              </span>
            )}
          </div>

          {/* Quick Action Overlay */}
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <Link
              href={`/collection/${product.slug}`}
              className="bg-white/90 backdrop-blur-md text-slate-900 px-4 py-2.5 rounded-full font-bold text-xs shadow-lg hover:bg-rose-600 hover:text-white transition-colors flex items-center gap-2"
            >
              <Eye className="w-4 h-4" /> Lihat Detail
            </Link>
          </div>
        </div>

        {/* Product Info */}
        <div className="p-4 space-y-2">
          {product.category && (
            <span
              className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md ${
                isDarkTheme ? 'bg-slate-700 text-rose-300' : 'bg-rose-50 text-rose-600'
              }`}
            >
              {product.category.name}
            </span>
          )}

          <h3
            className={`font-bold text-sm sm:text-base line-clamp-2 transition-colors ${
              isDarkTheme ? 'text-white group-hover:text-rose-400' : 'text-slate-900 group-hover:text-rose-600'
            }`}
          >
            <Link href={`/collection/${product.slug}`}>{product.name}</Link>
          </h3>
        </div>
      </div>

      {/* Product Pricing & Detail CTA */}
      <div className="px-4 pb-4 pt-1 flex items-center justify-between border-t border-slate-100/10">
        <div>
          {hasDiscount ? (
            <div className="flex flex-col">
              <span className="text-xs text-slate-400 line-through font-medium">
                {formatRupiah(product.price)}
              </span>
              <span className="text-base sm:text-lg font-black text-rose-600">
                {formatRupiah(product.discountPrice!)}
              </span>
            </div>
          ) : (
            <span className={`text-base sm:text-lg font-black ${isDarkTheme ? 'text-white' : 'text-slate-900'}`}>
              {formatRupiah(product.price)}
            </span>
          )}
        </div>

        <Link
          href={`/collection/${product.slug}`}
          className="w-9 h-9 rounded-full bg-rose-50 hover:bg-rose-600 hover:text-white text-rose-600 flex items-center justify-center transition-colors shadow-xs"
          aria-label={`Detail ${product.name}`}
        >
          <ChevronRight className="w-5 h-5" />
        </Link>
      </div>
    </div>
  );
}
