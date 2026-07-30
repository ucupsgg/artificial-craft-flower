'use client';

import { useState } from 'react';
import { Plus, Trash2, Layers } from 'lucide-react';

interface CategoryManagerClientProps {
  initialCategories: any[];
}

export default function CategoryManagerClient({ initialCategories }: CategoryManagerClientProps) {
  const [categories, setCategories] = useState(initialCategories);
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/admin/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      });
      const data = await res.json();
      if (data.success) {
        setCategories([...categories, data.category]);
        setName('');
      } else {
        setError(data.error || 'Gagal menambah kategori.');
      }
    } catch (err) {
      setError('Terjadi kesalahan koneksi.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, catName: string) => {
    if (!confirm(`Hapus kategori "${catName}"?`)) return;

    try {
      const res = await fetch(`/api/admin/categories/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setCategories(categories.filter((c) => c.id !== id));
      } else {
        alert(data.error || 'Gagal menghapus kategori.');
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
          <Plus className="w-4 h-4 text-rose-500" /> Tambah Kategori Baru
        </h2>

        {error && <div className="text-xs text-red-400 font-bold">{error}</div>}

        <form onSubmit={handleAdd} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">Nama Kategori</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Contoh: Graduation Bouquet"
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold py-3 rounded-xl text-xs uppercase tracking-wider transition-colors shadow-md"
          >
            {loading ? 'Menyimpan...' : 'Tambah Kategori'}
          </button>
        </form>
      </div>

      {/* List Table */}
      <div className="lg:col-span-7 bg-slate-800/80 border border-slate-700/80 rounded-3xl overflow-hidden shadow-xl">
        <div className="p-4 border-b border-slate-700 font-bold text-sm text-white flex items-center gap-2">
          <Layers className="w-4 h-4 text-rose-400" /> Daftar Kategori ({categories.length})
        </div>
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="bg-slate-900 text-slate-400 font-extrabold uppercase tracking-wider border-b border-slate-700">
              <th className="py-3.5 px-6">Nama Kategori</th>
              <th className="py-3.5 px-6">Slug</th>
              <th className="py-3.5 px-6 text-center">Jumlah Produk</th>
              <th className="py-3.5 px-6 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700/60 text-slate-200">
            {categories.map((c) => (
              <tr key={c.id} className="hover:bg-slate-700/40">
                <td className="py-3.5 px-6 font-bold text-white">{c.name}</td>
                <td className="py-3.5 px-6 text-slate-400">{c.slug}</td>
                <td className="py-3.5 px-6 text-center font-bold text-rose-400">
                  {c._count?.products || 0}
                </td>
                <td className="py-3.5 px-6 text-right">
                  <button
                    onClick={() => handleDelete(c.id, c.name)}
                    className="p-2 rounded-lg bg-slate-700 hover:bg-red-600 text-white transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
