'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Plus, Trash2, Image as ImageIcon, UploadCloud, Loader2 } from 'lucide-react';

interface BannerManagerClientProps {
  initialBanners: any[];
}

export default function BannerManagerClient({ initialBanners }: BannerManagerClientProps) {
  const [banners, setBanners] = useState(initialBanners);
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [image, setImage] = useState('');
  const [link, setLink] = useState('');
  const [order, setOrder] = useState('0');
  const [isActive, setIsActive] = useState(true);

  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('file', files[0]);

      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (data.success && data.url) {
        setImage(data.url);
      } else {
        throw new Error(data.error || 'Gagal mengunggah gambar');
      }
    } catch (err: any) {
      setError(err.message || 'Gagal mengunggah berkas.');
    } finally {
      setUploading(false);
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !image.trim()) return;
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/admin/banners', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, subtitle, image, link, order, isActive }),
      });
      const data = await res.json();
      if (data.success) {
        setBanners([...banners, data.banner]);
        setTitle('');
        setSubtitle('');
        setImage('');
        setLink('');
        setOrder('0');
      } else {
        setError(data.error || 'Gagal menambah banner.');
      }
    } catch (err) {
      setError('Terjadi kesalahan koneksi.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, bTitle: string) => {
    if (!confirm(`Hapus banner "${bTitle}"?`)) return;

    try {
      const res = await fetch(`/api/admin/banners/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setBanners(banners.filter((b) => b.id !== id));
      } else {
        alert(data.error || 'Gagal menghapus banner.');
      }
    } catch (err) {
      alert('Terjadi kesalahan koneksi.');
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Form */}
      <div className="lg:col-span-5 bg-slate-800/80 p-6 rounded-3xl border border-slate-700/80 shadow-xl space-y-4">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <Plus className="w-4 h-4 text-rose-500" /> Tambah Banner Baru
        </h2>

        {error && <div className="text-xs text-red-400 font-bold">{error}</div>}

        <form onSubmit={handleAdd} className="space-y-3">
          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">Judul Banner *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Spesial Promo Wisuda 2026"
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">Subtitle Banner</label>
            <input
              type="text"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              placeholder="Diskon 20% untuk semua Graduation Bouquet"
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
          </div>

          {/* Upload Foto JPG/PNG */}
          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">Foto Banner (JPG / PNG) *</label>
            <div className="relative border-2 border-dashed border-rose-500/40 hover:border-rose-500 rounded-xl p-4 text-center bg-slate-900/60 cursor-pointer">
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,image/jpg"
                onChange={handleFileUpload}
                disabled={uploading}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="flex items-center justify-center gap-2 text-xs text-slate-300">
                {uploading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-rose-400" /> Mengunggah...
                  </>
                ) : (
                  <>
                    <UploadCloud className="w-4 h-4 text-rose-400" /> Pilih Foto Banner
                  </>
                )}
              </div>
            </div>
            {image && (
              <div className="mt-2 relative aspect-video rounded-xl overflow-hidden border border-slate-700">
                <img src={image} alt="Preview Banner" className="w-full h-full object-cover" />
              </div>
            )}
          </div>

          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">Tautan / Link Klik</label>
            <input
              type="text"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              placeholder="/collection?category=graduation-bouquet"
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Urutan Tampil</label>
              <input
                type="number"
                value={order}
                onChange={(e) => setOrder(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>
            <div className="flex items-center pt-5">
              <label className="flex items-center gap-2 text-xs font-bold text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="w-4 h-4 accent-emerald-500"
                />
                Aktif
              </label>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || uploading}
            className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold py-3 rounded-xl text-xs uppercase tracking-wider transition-colors shadow-md mt-2"
          >
            {loading ? 'Menyimpan...' : 'Tambah Banner'}
          </button>
        </form>
      </div>

      {/* List */}
      <div className="lg:col-span-7 bg-slate-800/80 border border-slate-700/80 rounded-3xl overflow-hidden shadow-xl">
        <div className="p-4 border-b border-slate-700 font-bold text-sm text-white flex items-center gap-2">
          <ImageIcon className="w-4 h-4 text-rose-400" /> Daftar Banner ({banners.length})
        </div>
        <div className="divide-y divide-slate-700/60">
          {banners.map((b) => (
            <div key={b.id} className="p-4 flex items-center gap-4 hover:bg-slate-700/40">
              <div className="w-20 aspect-video rounded-lg overflow-hidden bg-slate-900 relative shrink-0">
                <Image src={b.image} alt={b.title} fill className="object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-xs text-white truncate">{b.title}</h4>
                {b.subtitle && <p className="text-[11px] text-slate-400 truncate">{b.subtitle}</p>}
                <span className="text-[10px] text-rose-400 block font-mono">Urutan: {b.order}</span>
              </div>
              <button
                onClick={() => handleDelete(b.id, b.title)}
                className="p-2 rounded-lg bg-slate-700 hover:bg-red-600 text-white transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
