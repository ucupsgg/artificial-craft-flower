'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Star, MessageSquarePlus, X, CheckCircle2, UploadCloud, Loader2, Sparkles } from 'lucide-react';

interface Testimonial {
  id: string;
  name: string;
  role?: string | null;
  content: string;
  rating: number;
  avatar?: string | null;
}

interface TestimonialsSectionProps {
  initialTestimonials: Testimonial[];
}

export default function TestimonialsSection({ initialTestimonials }: TestimonialsSectionProps) {
  const [testimonials] = useState<Testimonial[]>(initialTestimonials);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [content, setContent] = useState('');
  const [rating, setRating] = useState(5);
  const [avatar, setAvatar] = useState('');

  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    setErrorMsg('');

    try {
      const formData = new FormData();
      formData.append('file', files[0]);

      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (data.success && data.url) {
        setAvatar(data.url);
      } else {
        throw new Error(data.error || 'Gagal mengunggah foto avatar.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Gagal mengunggah foto.');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !content.trim()) return;

    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const res = await fetch('/api/testimonials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, role, content, rating, avatar }),
      });

      const data = await res.json();
      if (data.success) {
        setSuccessMsg(data.message);
        setName('');
        setRole('');
        setContent('');
        setRating(5);
        setAvatar('');
      } else {
        setErrorMsg(data.error || 'Gagal mengirimkan ulasan.');
      }
    } catch (err) {
      setErrorMsg('Terjadi kesalahan koneksi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-rose-50/60 py-16 border-y border-rose-100 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-widest text-rose-600 mb-1 block">
              Ulasan Pelanggan
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Apa Kata Mereka?</h2>
            <p className="text-slate-500 text-sm mt-1">
              Pengalaman nyata pelanggan kami yang telah memesan buket bunga artificial.
            </p>
          </div>

          {/* Review Submission Button */}
          <button
            onClick={() => {
              setIsModalOpen(true);
              setSuccessMsg('');
              setErrorMsg('');
            }}
            className="inline-flex items-center justify-center gap-2 bg-rose-600 hover:bg-rose-700 text-white font-extrabold px-6 py-3.5 rounded-full shadow-lg shadow-rose-600/20 hover:scale-105 active:scale-95 transition-all text-xs uppercase tracking-wider"
          >
            <MessageSquarePlus className="w-4 h-4" /> Beri Ulasan Anda
          </button>
        </div>

        {/* Testimonial Cards Grid */}
        {testimonials.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div
                key={t.id}
                className="bg-white p-6 rounded-3xl shadow-xs border border-rose-100 flex flex-col justify-between space-y-4 hover:shadow-md transition-shadow"
              >
                <div className="space-y-3">
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <p className="text-slate-600 text-sm leading-relaxed italic">
                    "{t.content}"
                  </p>
                </div>

                <div className="flex items-center gap-3 pt-3 border-t border-slate-100">
                  <div className="w-11 h-11 rounded-full bg-rose-100 overflow-hidden relative shrink-0 border border-rose-200">
                    {t.avatar ? (
                      <Image src={t.avatar} alt={t.name} fill className="object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center font-black text-rose-600 text-base">
                        {t.name.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div>
                    <h4 className="text-sm font-extrabold text-slate-900">{t.name}</h4>
                    <p className="text-xs text-slate-500 font-medium">{t.role || 'Pelanggan Toko'}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white p-8 rounded-3xl text-center border border-rose-100 text-slate-500 text-sm">
            Belum ada ulasan yang disetujui. Jadilah yang pertama memberikan ulasan!
          </div>
        )}

      </div>

      {/* MODAL FORM: BERI ULASAN */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-rose-100 space-y-6 relative max-h-[90vh] overflow-y-auto">
            
            {/* Close Button */}
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Header */}
            <div className="space-y-1">
              <span className="text-xs font-extrabold text-rose-600 uppercase tracking-widest flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-500" /> Form Masukan Pelanggan
              </span>
              <h3 className="text-2xl font-black text-slate-900">Beri Ulasan Kepuasan</h3>
              <p className="text-slate-500 text-xs">
                Bagikan pengalaman Anda memesan buket bunga di Artificial Craft Flower.
              </p>
            </div>

            {/* Success Alert */}
            {successMsg ? (
              <div className="bg-emerald-50 border border-emerald-200 p-6 rounded-2xl text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                <h4 className="font-extrabold text-slate-900 text-base">Ulasan Terkirim!</h4>
                <p className="text-xs text-slate-600 leading-relaxed">{successMsg}</p>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="mt-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-2.5 rounded-full text-xs uppercase tracking-wider"
                >
                  Tutup Form
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                
                {/* Admin Approval Notice */}
                <div className="bg-amber-50 border border-amber-200 p-3.5 rounded-2xl text-amber-800 text-[11px] font-medium leading-relaxed">
                  ℹ️ <strong>Informasi:</strong> Ulasan yang Anda kirim akan masuk ke Admin terlebih dahulu untuk ditinjau & disetujui sebelum ditampilkan secara umum di website.
                </div>

                {errorMsg && (
                  <div className="bg-red-50 border border-red-200 p-3 rounded-xl text-red-600 text-xs font-bold">
                    {errorMsg}
                  </div>
                )}

                {/* Name */}
                <div className="space-y-1">
                  <label className="text-xs font-extrabold text-slate-800 block">Nama Lengkap *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Contoh: Siti Rahma"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:bg-white"
                  />
                </div>

                {/* Role / Event */}
                <div className="space-y-1">
                  <label className="text-xs font-extrabold text-slate-800 block">Peran / Momen (Opsional)</label>
                  <input
                    type="text"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    placeholder="Contoh: Wisudawati UNJA / Pembeli Gift Ultah"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:bg-white"
                  />
                </div>

                {/* Rating */}
                <div className="space-y-1">
                  <label className="text-xs font-extrabold text-slate-800 block">Rating Kepuasan *</label>
                  <div className="flex items-center gap-2 pt-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className="p-1 text-amber-400 hover:scale-125 transition-transform"
                      >
                        <Star className={`w-6 h-6 ${star <= rating ? 'fill-current text-amber-400' : 'text-slate-300'}`} />
                      </button>
                    ))}
                    <span className="text-xs font-bold text-slate-700 ml-2">{rating} dari 5 Bintang</span>
                  </div>
                </div>

                {/* Content */}
                <div className="space-y-1">
                  <label className="text-xs font-extrabold text-slate-800 block">Isi Ulasan Kepuasan *</label>
                  <textarea
                    rows={3}
                    required
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Tuliskan pengalaman Anda saat memesan buket bunga artificial..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:bg-white"
                  />
                </div>

                {/* Avatar Upload */}
                <div className="space-y-1">
                  <label className="text-xs font-extrabold text-slate-800 block">Foto Profil / Avatar (Opsional)</label>
                  <div className="relative border border-dashed border-rose-300 rounded-xl p-3 text-center bg-rose-50/50 cursor-pointer">
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/jpg"
                      onChange={handleFileUpload}
                      disabled={uploading}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <div className="flex items-center justify-center gap-2 text-xs text-slate-600 font-medium">
                      {uploading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin text-rose-600" /> Mengunggah foto...
                        </>
                      ) : (
                        <>
                          <UploadCloud className="w-4 h-4 text-rose-600" /> Pilih Foto Avatar (JPG / PNG)
                        </>
                      )}
                    </div>
                  </div>
                  {avatar && (
                    <div className="mt-2 flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full overflow-hidden relative border border-rose-300">
                        <img src={avatar} alt="Avatar Preview" className="w-full h-full object-cover" />
                      </div>
                      <span className="text-[11px] text-emerald-600 font-bold">Foto berhasil diunggah!</span>
                    </div>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading || uploading}
                  className="w-full bg-rose-600 hover:bg-rose-700 text-white font-extrabold py-3.5 rounded-full shadow-lg shadow-rose-600/25 transition-all text-xs uppercase tracking-wider mt-4"
                >
                  {loading ? 'Mengirim Ulasan...' : 'Kirim Ulasan Sekarang'}
                </button>

              </form>
            )}

          </div>
        </div>
      )}

    </section>
  );
}
