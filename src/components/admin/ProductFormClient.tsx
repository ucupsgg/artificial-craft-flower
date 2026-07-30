'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Save,
  UploadCloud,
  Trash2,
  Tag,
  Sparkles,
  Loader2,
  CheckCircle,
} from 'lucide-react';

interface ProductFormClientProps {
  categories: any[];
  initialData?: any;
}

export default function ProductFormClient({ categories, initialData }: ProductFormClientProps) {
  const router = useRouter();
  const isEdit = Boolean(initialData);

  const [name, setName] = useState(initialData?.name || '');
  const [slug, setSlug] = useState(initialData?.slug || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [price, setPrice] = useState(initialData?.price ? String(initialData.price) : '');
  const [discountPrice, setDiscountPrice] = useState(
    initialData?.discountPrice ? String(initialData.discountPrice) : ''
  );
  const [isDiscount, setIsDiscount] = useState(initialData?.isDiscount || false);
  const [isBestSeller, setIsBestSeller] = useState(initialData?.isBestSeller || false);
  const [isFeatured, setIsFeatured] = useState(initialData?.isFeatured || false);
  const [isPromo, setIsPromo] = useState(initialData?.isPromo || false);
  const [status, setStatus] = useState(initialData?.status !== undefined ? initialData.status : true);
  const [seoTitle, setSeoTitle] = useState(initialData?.seoTitle || '');
  const [seoDescription, setSeoDescription] = useState(initialData?.seoDescription || '');
  const [categoryId, setCategoryId] = useState(
    initialData?.categoryId || (categories.length ? categories[0].id : '')
  );

  const initialImages = initialData?.images?.map((i: any) => i.url) || [
    'https://images.unsplash.com/photo-1561181286-d3fee7d55364?q=80&w=800&auto=format&fit=crop',
  ];
  const [images, setImages] = useState<string[]>(initialImages);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Handle direct file upload (JPG/PNG)
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    setError('');

    try {
      const uploadedUrls: string[] = [];

      for (let i = 0; i < files.length; i++) {
        const formData = new FormData();
        formData.append('file', files[i]);

        const res = await fetch('/api/admin/upload', {
          method: 'POST',
          body: formData,
        });

        const data = await res.json();
        if (data.success && data.url) {
          uploadedUrls.push(data.url);
        } else {
          throw new Error(data.error || `Gagal mengunggah file ${files[i].name}`);
        }
      }

      setImages([...images, ...uploadedUrls]);
    } catch (err: any) {
      setError(err.message || 'Gagal mengunggah gambar.');
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const payload = {
      name,
      slug,
      description,
      price,
      discountPrice: isDiscount ? discountPrice : null,
      isDiscount,
      isBestSeller,
      isFeatured,
      isPromo,
      status,
      seoTitle,
      seoDescription,
      categoryId,
      images,
    };

    try {
      const url = isEdit ? `/api/admin/products/${initialData.id}` : '/api/admin/products';
      const method = isEdit ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.error || 'Gagal menyimpan produk.');
      } else {
        router.push('/admin/products');
        router.refresh();
      }
    } catch (err) {
      setError('Terjadi kesalahan koneksi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <Link
          href="/admin/products"
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Kembali ke Daftar Produk
        </Link>
        <button
          type="submit"
          disabled={loading || uploading}
          className="inline-flex items-center gap-2 bg-rose-600 hover:bg-rose-700 text-white font-extrabold px-6 py-3 rounded-full text-xs uppercase tracking-wider shadow-lg transition-all"
        >
          <Save className="w-4 h-4" /> {loading ? 'Menyimpan...' : 'Simpan Produk'}
        </button>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/40 p-4 rounded-2xl text-red-400 text-xs font-bold">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Form Column */}
        <div className="lg:col-span-8 space-y-6 bg-slate-800/80 p-6 sm:p-8 rounded-3xl border border-slate-700/80 shadow-xl">
          
          <h2 className="text-lg font-bold text-white border-b border-slate-700 pb-3">
            Informasi Produk
          </h2>

          {/* Name & Slug */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300 block">Nama Produk *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (!isEdit) {
                    setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''));
                  }
                }}
                placeholder="Contoh: Luxury Rose Soft Pink Bouquet"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300 block">URL Slug</label>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="luxury-rose-soft-pink-bouquet"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>
          </div>

          {/* Category */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-300 block">Kategori Produk *</label>
            <select
              required
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-300 block">Deskripsi Produk</label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Jelaskan jenis bunga artificial, warna pita wrapping, dan keunikan buket ini..."
              className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
          </div>

          {/* Pricing & Discounts (Section 9 of RPD) */}
          <div className="pt-4 border-t border-slate-700 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Tag className="w-4 h-4 text-rose-500" /> Pengaturan Harga & Diskon Promo
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300 block">Harga Asli (Rp) *</label>
                <input
                  type="number"
                  required
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="150000"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300 block">Harga Diskon (Rp)</label>
                <input
                  type="number"
                  disabled={!isDiscount}
                  value={discountPrice}
                  onChange={(e) => setDiscountPrice(e.target.value)}
                  placeholder="120000"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white disabled:opacity-40 focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>
            </div>

            {/* Discount Toggle */}
            <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-700 flex items-center justify-between">
              <div>
                <span className="text-xs font-extrabold text-white block">Aktifkan Diskon Promo</span>
                <span className="text-[11px] text-slate-400">
                  Ketika diskon aktif, harga asli dicoret dan badge Promo ditampilkan pada katalog.
                </span>
              </div>
              <input
                type="checkbox"
                checked={isDiscount}
                onChange={(e) => setIsDiscount(e.target.checked)}
                className="w-5 h-5 accent-rose-600 rounded cursor-pointer"
              />
            </div>
          </div>

          {/* SEO Metadata */}
          <div className="pt-4 border-t border-slate-700 space-y-4">
            <h3 className="text-sm font-bold text-white">Konfigurasi SEO Produk</h3>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-300 block">SEO Meta Title</label>
                <input
                  type="text"
                  value={seoTitle}
                  onChange={(e) => setSeoTitle(e.target.value)}
                  placeholder="Judul SEO produk untuk mesin pencari..."
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-300 block">SEO Meta Description</label>
                <textarea
                  rows={2}
                  value={seoDescription}
                  onChange={(e) => setSeoDescription(e.target.value)}
                  placeholder="Deskripsi singkat produk untuk pencarian Google..."
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>
            </div>
          </div>

        </div>

        {/* Right Sidebar Column: Toggles & Local File Upload */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Status & Badge Toggles */}
          <div className="bg-slate-800/80 p-6 rounded-3xl border border-slate-700/80 shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-white border-b border-slate-700 pb-2">
              Status & Badge Highlight
            </h3>

            <div className="space-y-3">
              <label className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-700 cursor-pointer">
                <span className="text-xs font-bold text-slate-200">Status Produk Aktif</span>
                <input
                  type="checkbox"
                  checked={status}
                  onChange={(e) => setStatus(e.target.checked)}
                  className="w-4 h-4 accent-emerald-500"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-700 cursor-pointer">
                <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" /> Best Seller Badge
                </span>
                <input
                  type="checkbox"
                  checked={isBestSeller}
                  onChange={(e) => setIsBestSeller(e.target.checked)}
                  className="w-4 h-4 accent-amber-500"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-700 cursor-pointer">
                <span className="text-xs font-bold text-rose-300 flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5" /> Promo Badge
                </span>
                <input
                  type="checkbox"
                  checked={isPromo}
                  onChange={(e) => setIsPromo(e.target.checked)}
                  className="w-4 h-4 accent-rose-500"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-700 cursor-pointer">
                <span className="text-xs font-bold text-blue-300 flex items-center gap-1.5">
                  ⭐ Featured Product (Landing)
                </span>
                <input
                  type="checkbox"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="w-4 h-4 accent-blue-500"
                />
              </label>
            </div>
          </div>

          {/* Product Image File Upload (JPG/PNG) */}
          <div className="bg-slate-800/80 p-6 rounded-3xl border border-slate-700/80 shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-white border-b border-slate-700 pb-2">
              Upload Foto Produk (JPG / PNG)
            </h3>

            {/* Upload Drag/Drop Box */}
            <div className="relative border-2 border-dashed border-rose-500/40 hover:border-rose-500 rounded-2xl p-6 text-center bg-slate-900/60 transition-colors group cursor-pointer">
              <input
                type="file"
                multiple
                accept="image/jpeg,image/png,image/webp,image/jpg"
                onChange={handleFileUpload}
                disabled={uploading}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="flex flex-col items-center justify-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-rose-500/10 text-rose-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                  {uploading ? (
                    <Loader2 className="w-6 h-6 animate-spin" />
                  ) : (
                    <UploadCloud className="w-6 h-6" />
                  )}
                </div>
                <div>
                  <p className="text-xs font-bold text-white">
                    {uploading ? 'Mengunggah Berkas...' : 'Klik atau Tarik File Foto ke Sini'}
                  </p>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    Format yang didukung: JPG, PNG, WEBP (Bisa Pilih Banyak Foto)
                  </p>
                </div>
              </div>
            </div>

            {/* Previews List */}
            {images.length > 0 && (
              <div className="space-y-2 pt-2">
                <label className="text-xs font-bold text-slate-300 block">Daftar Foto Produk ({images.length})</label>
                <div className="grid grid-cols-2 gap-2">
                  {images.map((url, idx) => (
                    <div key={idx} className="relative aspect-square rounded-xl overflow-hidden bg-slate-900 border border-slate-700 group">
                      <img src={url} alt={`Foto ${idx}`} className="w-full h-full object-cover" />
                      {idx === 0 && (
                        <span className="absolute top-1 left-1 bg-rose-600 text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded shadow">
                          Foto Utama
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(idx)}
                        className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Hapus foto"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

        </div>

      </div>
    </form>
  );
}
