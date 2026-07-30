import Image from 'next/image';
import { Flower2, Sparkles, ShieldCheck, Heart, Award, Clock } from 'lucide-react';
import { prisma } from '@/lib/prisma';

export const revalidate = 0;

export default async function AboutPage() {
  let setting: any = null;
  try {
    setting = await prisma.websiteSetting.findUnique({ where: { id: 'default' } });
  } catch (err) {
    console.error('Error fetching website settings on about page:', err);
  }

  const aboutText =
    setting?.aboutText ||
    'Artificial Craft Flower menghadirkan keindahan bunga buatan tangan (handcrafted artificial bouquet) kualitas tertinggi. Dibuat secara presisi, indah, dan tahan selamanya untuk merayakan setiap momen berharga Anda.';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-rose-500 via-pink-600 to-amber-500 rounded-3xl p-8 sm:p-14 text-white shadow-xl text-center space-y-4">
        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-4 h-4 text-amber-300" /> Profil & Cerita Kami
        </span>
        <h1 className="text-3xl sm:text-5xl font-black tracking-tight">Artificial Craft Flower</h1>
        <p className="text-rose-100 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
          Mengabadikan setiap senyum dan momen bahagia Anda dalam bentuk buket bunga buatan yang abadi.
        </p>
      </div>

      {/* Profile & History Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        <div className="lg:col-span-6 relative aspect-[4/3] rounded-3xl overflow-hidden shadow-lg border border-slate-200">
          <Image
            src="https://images.unsplash.com/photo-1561181286-d3fee7d55364?q=80&w=800&auto=format&fit=crop"
            alt="Handcrafting Flower Bouquet"
            fill
            className="object-cover"
          />
        </div>

        <div className="lg:col-span-6 space-y-5">
          <div className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-widest text-rose-600">
            <Flower2 className="w-4 h-4" /> Tentang Kami
          </div>
          <h2 className="text-3xl font-black text-slate-900 leading-snug">
            Dedikasi Menghadirkan Karya Buket Bunga Berkelas
          </h2>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            {aboutText}
          </p>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Kami meyakini bahwa sebuah buket bunga bukan sekadar hadiah, melainkan ungkapan perasaan, apresiasi, dan kenangan berharga. Oleh karena itu, setiap tangkai bunga buatan kami dirangkai dengan teliti, menggunakan kombinasi wrapping warna estetik, pita satin elegan, dan bahan berkualitas.
          </p>
        </div>
      </div>

      {/* Vision & Mission */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-3xl border border-rose-100 shadow-xs space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
            <Award className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">Visi Kami</h3>
          <p className="text-slate-600 text-sm leading-relaxed">
            Menjadi studio perangkai bunga artificial nomor satu yang terpercaya di Indonesia, dikenal dengan kualitas desain eksklusif, pelayanan hangat, dan inovasi buket kustom yang senantiasa mengikuti tren masa kini.
          </p>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-rose-100 shadow-xs space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
            <Heart className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">Misi Kami</h3>
          <p className="text-slate-600 text-sm leading-relaxed">
            Memberikan pengalaman pemesanan yang mudah, menyediakan produk bunga artificial tahan lama dengan harga terjangkau, serta membantu setiap pelanggan merayakan momen istimewa mereka dengan berkesan.
          </p>
        </div>
      </div>

      {/* Strengths / Advantages Grid */}
      <div className="space-y-8">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-xs font-bold text-rose-600 uppercase tracking-widest">Keunggulan</span>
          <h2 className="text-3xl font-extrabold text-slate-900">Mengapa Memilih Kami?</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs text-center space-y-3">
            <ShieldCheck className="w-10 h-10 text-emerald-600 mx-auto" />
            <h4 className="font-bold text-base text-slate-900">Tahan Selamanya</h4>
            <p className="text-slate-500 text-xs leading-relaxed">
              Bunga buatan kualitas premium yang tidak akan layu, tetap indah disimpan bertahun-tahun.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs text-center space-y-3">
            <Sparkles className="w-10 h-10 text-amber-500 mx-auto" />
            <h4 className="font-bold text-base text-slate-900">Bebas Request Kustom</h4>
            <p className="text-slate-500 text-xs leading-relaxed">
              Bebas tentukan tema warna wrapping, kombinasi bunga, hingga slot uang (Money Bouquet).
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs text-center space-y-3">
            <Clock className="w-10 h-10 text-rose-500 mx-auto" />
            <h4 className="font-bold text-base text-slate-900">Pengerjaan Cepat</h4>
            <p className="text-slate-500 text-xs leading-relaxed">
              Tim perangkai berpengalaman siap memproses buket sesuai deadline acara Anda.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs text-center space-y-3">
            <Flower2 className="w-10 h-10 text-pink-500 mx-auto" />
            <h4 className="font-bold text-base text-slate-900">Harga Terjangkau</h4>
            <p className="text-slate-500 text-xs leading-relaxed">
              Kualitas mewah berkelas dengan penawaran harga yang sangat kompetitif dan ramah kantong.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}
