'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Plus, Trash2, Camera, UploadCloud, Loader2 } from 'lucide-react';

interface GalleryManagerClientProps {
  initialItems: any[];
}

export default function GalleryManagerClient({ initialItems }: GalleryManagerClientProps) {
  const [items, setItems] = useState(initialItems);
  const [title, setTitle] = useState('');
  const [image, setImage] = useState('');
  const [category, setCategory] = useState('Graduation');

  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const categories = [
    'Graduation',
    'Birthday',
    'Anniversary',
    'Wedding',
    'Money Bouquet',
    'Custom Bouquet',
  ];

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
      const res = await fetch('/api/admin/gallery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, image, category }),
      });
      const data = await res.json();
      if (data.success) {
        setItems([data.item, ...items]);
        setTitle('');
        setImage('');
      } else {
        setError(data.error || 'Gagal menambah item galeri.');
      }
    } catch (err) {
      setError('Terjadi kesalahan koneksi.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, gTitle: string) => {
    if (!confirm(`Hapus foto galeri "${gTitle}"?`)) return;

    try {
      const res = await fetch(`/api/admin/gallery/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setItems(items.filter((i) => i.id !== id));
      } else {
        alert(data.error || 'Gagal menghapus foto galeri.');
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
          <Plus className="w-4 h-4 text-rose-500" /> Tambah Foto Galeri
        </h2>

        {error && <div className="text-xs text-red-400 font-bold">{error}</div>}

        <form onSubmit={handleAdd} className="space-y-3">
          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">Judul Buket *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Contoh: Buket Wisuda Mawar Soft Pink"
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">Kategori Galeri *</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Upload Foto JPG/PNG */}
          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">Foto Buket (JPG / PNG) *</label>
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
                    <UploadCloud className="w-4 h-4 text-rose-400" /> Pilih Foto Galeri
                  </>
                )}
              </div>
            </div>
            {image && (
              <div className="mt-2 relative aspect-square rounded-xl overflow-hidden border border-slate-700 max-w-[150px] mx-auto">
                <img src={image} alt="Preview Galeri" className="w-full h-full object-cover" />
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading || uploading}
            className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold py-3 rounded-xl text-xs uppercase tracking-wider transition-colors shadow-md mt-2"
          >
            {loading ? 'Menyimpan...' : 'Tambah Galeri'}
          </button>
        </form>
      </div>

      {/* Grid List */}
      <div className="lg:col-span-7 bg-slate-800/80 border border-slate-700/80 rounded-3xl p-6 shadow-xl space-y-4">
        <div className="font-bold text-sm text-white flex items-center justify-between border-b border-slate-700 pb-3">
          <span className="flex items-center gap-2">
            <Camera className="w-4 h-4 text-rose-400" /> Foto Galeri ({items.length})
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {items.map((item) => (
            <div key={item.id} className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-slate-900 border border-slate-700 group">
              <Image src={item.image} alt={item.title} fill className="object-cover" />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity p-3 flex flex-col justify-between text-white">
                <span className="text-[10px] font-extrabold uppercase bg-rose-600 px-2 py-0.5 rounded-full w-fit">
                  {item.category}
                </span>
                <div className="space-y-1">
                  <p className="text-xs font-bold line-clamp-1">{item.title}</p>
                  <button
                    onClick={() => handleDelete(item.id, item.title)}
                    className="w-full py-1 bg-red-600 hover:bg-red-700 rounded-lg text-[10px] font-bold flex items-center justify-center gap-1"
                  >
                    <Trash2 className="w-3 h-3" /> Hapus
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
