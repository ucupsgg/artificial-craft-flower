import Link from 'next/link';
import Image from 'next/image';
import { prisma } from '@/lib/prisma';
import {
  Flower2,
  Sparkles,
  ShoppingBag,
  PhoneCall,
  CheckCircle2,
  HelpCircle,
  ChevronRight,
  ShieldCheck,
  Gift,
  Truck,
} from 'lucide-react';
import ProductCard from '@/components/products/ProductCard';
import TestimonialsSection from '@/components/home/TestimonialsSection';

export const revalidate = 0; // Dynamic rendering

export default async function HomePage() {
  let settings = null;
  let banners: any[] = [];
  let featuredProducts: any[] = [];
  let bestSellers: any[] = [];
  let galleryItems: any[] = [];
  let testimonials: any[] = [];
  let faqs: any[] = [];

  try {
    settings = await prisma.websiteSetting.findUnique({ where: { id: 'default' } });
    banners = await prisma.banner.findMany({ where: { isActive: true }, orderBy: { order: 'asc' } });
    featuredProducts = await prisma.product.findMany({
      where: { isFeatured: true, status: true },
      include: { images: true, category: true },
      take: 8,
    });
    bestSellers = await prisma.product.findMany({
      where: { isBestSeller: true, status: true },
      include: { images: true, category: true },
      take: 4,
    });
    galleryItems = await prisma.gallery.findMany({ take: 6, orderBy: { createdAt: 'desc' } });
    // Fetch ONLY approved testimonials for public display
    testimonials = await prisma.testimonial.findMany({
      where: { status: true },
      take: 6,
      orderBy: { createdAt: 'desc' },
    });
    faqs = await prisma.fAQ.findMany({ where: { isActive: true }, orderBy: { order: 'asc' } });
  } catch (err) {
    console.error('Error fetching home page data:', err);
  }

  const heroTitle = settings?.heroTitle || 'Rangkaian Bunga Artificial Premium & Elegan';
  const heroSubtitle =
    settings?.heroSubtitle ||
    'Abadikan momen indah dengan bucket bunga kustom berkualitas tinggi yang tahan selamanya.';
  const waNumber = settings?.whatsapp || '6281617621150';

  const waLink = `https://wa.me/${waNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
    'Halo Artificial Craft Flower 🌸 Saya tertarik untuk membuat buket bunga kustom.'
  )}`;

  return (
    <div className="bg-white space-y-16 pb-16">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-rose-50/80 via-white to-white pt-12 pb-20 border-b border-rose-100/50">
        <div className="absolute top-10 left-1/4 w-72 h-72 bg-rose-200/40 rounded-full blur-3xl -z-10 animate-pulse" />
        <div className="absolute bottom-10 right-1/4 w-80 h-80 bg-amber-200/30 rounded-full blur-3xl -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Hero Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-100/80 border border-rose-200 text-rose-700 text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-4 h-4 text-amber-500 animate-spin" />
                Handcrafted Artificial Flower Studio
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.15]">
                {heroTitle.split('&')[0]}{' '}
                <span className="bg-gradient-to-r from-rose-600 via-pink-600 to-amber-500 bg-clip-text text-transparent">
                  & {heroTitle.split('&')[1] || 'Elegan'}
                </span>
              </h1>

              <p className="text-slate-600 text-base sm:text-lg max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                {heroSubtitle}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <Link
                  href="/collection"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold px-8 py-4 rounded-full shadow-lg shadow-rose-500/25 hover:shadow-rose-500/40 hover:-translate-y-0.5 active:translate-y-0 transition-all text-sm uppercase tracking-wider"
                >
                  <ShoppingBag className="w-4 h-4" />
                  Jelajahi Katalog
                </Link>
                <a
                  href={waLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-7 py-4 rounded-full shadow-md hover:-translate-y-0.5 active:translate-y-0 transition-all text-sm uppercase tracking-wider"
                >
                  <PhoneCall className="w-4 h-4" />
                  Pesan Kustom via WA
                </a>
              </div>

              {/* Trust Badges */}
              <div className="pt-6 grid grid-cols-3 gap-4 border-t border-rose-200/50 max-w-lg mx-auto lg:mx-0">
                <div className="flex flex-col items-center lg:items-start text-xs font-semibold text-slate-600">
                  <span className="font-extrabold text-slate-900 text-base flex items-center gap-1">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" /> 100%
                  </span>
                  Tahan Selamanya
                </div>
                <div className="flex flex-col items-center lg:items-start text-xs font-semibold text-slate-600">
                  <span className="font-extrabold text-slate-900 text-base flex items-center gap-1">
                    <Gift className="w-4 h-4 text-rose-500" /> Custom
                  </span>
                  Bebas Request
                </div>
                <div className="flex flex-col items-center lg:items-start text-xs font-semibold text-slate-600">
                  <span className="font-extrabold text-slate-900 text-base flex items-center gap-1">
                    <Truck className="w-4 h-4 text-amber-500" /> Cepat
                  </span>
                  Pengiriman Aman
                </div>
              </div>

            </div>

            {/* Hero Right Banner Image Showcase */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto w-full max-w-md aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-slate-100">
                {banners.length > 0 ? (
                  <Image
                    src={banners[0].image}
                    alt={banners[0].title || 'Artificial Craft Flower Banner'}
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-700"
                    priority
                  />
                ) : (
                  <Image
                    src="https://images.unsplash.com/photo-1561181286-d3fee7d55364?q=80&w=800&auto=format&fit=crop"
                    alt="Artificial Flower Bouquet"
                    fill
                    className="object-cover"
                    priority
                  />
                )}

                <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-white/50 shadow-lg flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-rose-500 text-white flex items-center justify-center font-black">
                      🌸
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900">Buket Terbaik Wisuda & Gift</p>
                      <p className="text-[11px] text-slate-500">Dibuat secara presisi & kustom</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2.5 py-1 rounded-full border border-rose-200">
                    Premium
                  </span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* FEATURED PRODUCTS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-rose-600 mb-1">
              <Flower2 className="w-4 h-4" /> Koleksi Pilihan
            </div>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Featured Flower Bouquets
            </h2>
          </div>
          <Link
            href="/collection"
            className="inline-flex items-center gap-1 text-sm font-bold text-rose-600 hover:text-rose-700 group"
          >
            Lihat Semua Koleksi <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* BEST SELLER & PROMO BANNER SECTION */}
      {bestSellers.length > 0 && (
        <section className="bg-gradient-to-r from-slate-900 via-rose-950 to-slate-900 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
              <span className="inline-block px-3 py-1 bg-amber-500/20 text-amber-300 rounded-full text-xs font-extrabold uppercase tracking-wider border border-amber-500/30">
                ⭐ Paling Diberi Ulasan Positif
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white">Best Seller Bouquets</h2>
              <p className="text-slate-300 text-sm">
                Produk favorit yang paling sering dipesan oleh pelanggan untuk hadiah momen spesial.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {bestSellers.map((product) => (
                <ProductCard key={product.id} product={product} isDarkTheme />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* GALLERY PREVIEW SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-10 space-y-2">
          <span className="text-xs font-bold text-rose-600 uppercase tracking-widest">Inspirasi Karya</span>
          <h2 className="text-3xl font-extrabold text-slate-900">Galeri Buket Terbuat</h2>
          <p className="text-slate-500 text-sm">
            Beberapa hasil buket bunga artificial indah yang telah kami buat untuk para pelanggan.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {galleryItems.map((item) => (
            <div
              key={item.id}
              className="relative aspect-square rounded-2xl overflow-hidden group shadow-sm hover:shadow-md transition-all border border-slate-200"
            >
              <Image src={item.image} alt={item.title} fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-3 flex flex-col justify-end text-white">
                <span className="text-[10px] uppercase font-bold text-amber-400">{item.category}</span>
                <p className="text-xs font-bold line-clamp-1">{item.title}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/gallery"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold uppercase tracking-wider transition-colors"
          >
            Lihat Lebih Banyak Galeri <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* TESTIMONIAL SECTION WITH PUBLIC REVIEW SUBMISSION FORM */}
      <TestimonialsSection initialTestimonials={testimonials} />

      {/* FAQ SECTION */}
      {faqs.length > 0 && (
        <section className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10 space-y-2">
            <span className="text-xs font-bold text-rose-600 uppercase tracking-widest">Pertanyaan Umum</span>
            <h2 className="text-3xl font-extrabold text-slate-900">FAQ Pemesanan</h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq) => (
              <div key={faq.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-2">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-rose-500 shrink-0" />
                  {faq.question}
                </h3>
                <p className="text-slate-600 text-sm pl-7 leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* FOOTER BANNER CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-rose-600 to-pink-600 rounded-3xl p-8 sm:p-12 text-white shadow-xl text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-black">Siap Membuat Buket Impian Anda?</h2>
          <p className="text-rose-100 text-base max-w-xl mx-auto">
            Konsultasikan warna, jenis bunga artificial, dan bentuk buket sesuai keinginan Anda secara gratis via WhatsApp.
          </p>
          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-white text-rose-600 font-extrabold px-8 py-4 rounded-full shadow-md hover:bg-rose-50 transition-colors uppercase tracking-wider text-sm"
          >
            <PhoneCall className="w-4 h-4" /> Hubungi Admin WhatsApp
          </a>
        </div>
      </section>

    </div>
  );
}
