import { prisma } from '@/lib/prisma';
import { getAdminSession } from '@/lib/session';
import { redirect } from 'next/navigation';
import {
  Package,
  CheckCircle2,
  Tag,
  Sparkles,
  Camera,
  Image as ImageIcon,
  MessageSquare,
  Layers,
  ArrowUpRight,
} from 'lucide-react';
import Link from 'next/link';

export const revalidate = 0;

export default async function AdminDashboardPage() {
  const session = await getAdminSession();
  if (!session) redirect('/admin/login');

  let stats = {
    totalProducts: 0,
    activeProducts: 0,
    discountProducts: 0,
    bestSellerProducts: 0,
    totalGallery: 0,
    totalBanners: 0,
    totalTestimonials: 0,
    totalCategories: 0,
  };

  try {
    const [
      totalProducts,
      activeProducts,
      discountProducts,
      bestSellerProducts,
      totalGallery,
      totalBanners,
      totalTestimonials,
      totalCategories,
    ] = await Promise.all([
      prisma.product.count(),
      prisma.product.count({ where: { status: true } }),
      prisma.product.count({ where: { isDiscount: true } }),
      prisma.product.count({ where: { isBestSeller: true } }),
      prisma.gallery.count(),
      prisma.banner.count(),
      prisma.testimonial.count(),
      prisma.category.count(),
    ]);

    stats = {
      totalProducts,
      activeProducts,
      discountProducts,
      bestSellerProducts,
      totalGallery,
      totalBanners,
      totalTestimonials,
      totalCategories,
    };
  } catch (err) {
    console.error('Error fetching admin overview stats:', err);
  }

  const statCards = [
    { title: 'Total Produk', value: stats.totalProducts, icon: Package, color: 'from-blue-500 to-indigo-600', link: '/admin/products' },
    { title: 'Produk Aktif', value: stats.activeProducts, icon: CheckCircle2, color: 'from-emerald-500 to-teal-600', link: '/admin/products' },
    { title: 'Produk Diskon', value: stats.discountProducts, icon: Tag, color: 'from-rose-500 to-pink-600', link: '/admin/products' },
    { title: 'Best Seller', value: stats.bestSellerProducts, icon: Sparkles, color: 'from-amber-500 to-orange-600', link: '/admin/products' },
    { title: 'Total Gallery', value: stats.totalGallery, icon: Camera, color: 'from-purple-500 to-indigo-600', link: '/admin/gallery' },
    { title: 'Total Banner', value: stats.totalBanners, icon: ImageIcon, color: 'from-cyan-500 to-blue-600', link: '/admin/banners' },
    { title: 'Total Testimoni', value: stats.totalTestimonials, icon: MessageSquare, color: 'from-yellow-500 to-amber-600', link: '/admin/testimonials' },
    { title: 'Total Kategori', value: stats.totalCategories, icon: Layers, color: 'from-fuchsia-500 to-pink-600', link: '/admin/categories' },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-rose-600 to-pink-600 rounded-3xl p-8 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2">
          <span className="text-xs font-extrabold uppercase tracking-widest text-rose-200">Dashboard Overview</span>
          <h1 className="text-3xl font-black">Selamat Datang, {session.name}! 👋</h1>
          <p className="text-rose-100 text-sm max-w-xl">
            Kelola seluruh produk, diskon promo, banner hero, galeri foto, ulasan, hingga konfigurasi toko secara mudah di satu tempat.
          </p>
        </div>
        <Link
          href="/admin/products"
          className="bg-white text-rose-600 font-extrabold px-6 py-3 rounded-full text-xs uppercase tracking-wider hover:bg-rose-50 transition-colors shadow-md shrink-0"
        >
          Kelola Produk
        </Link>
      </div>

      {/* 8 Statistic Cards */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-white">Ringkasan Statistik Sistem</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {statCards.map((card) => {
            const Icon = card.icon;
            return (
              <Link
                key={card.title}
                href={card.link}
                className="bg-slate-800/90 border border-slate-700/80 hover:border-rose-500/50 p-6 rounded-2xl shadow-md hover:shadow-xl transition-all group flex flex-col justify-between space-y-4"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-400">{card.title}</span>
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${card.color} text-white flex items-center justify-center shadow-md`}>
                    <Icon className="w-5 h-5" />
                  </div>
                </div>

                <div className="flex items-baseline justify-between">
                  <span className="text-3xl font-black text-white">{card.value}</span>
                  <span className="text-slate-500 group-hover:text-rose-400 transition-colors">
                    <ArrowUpRight className="w-5 h-5" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
