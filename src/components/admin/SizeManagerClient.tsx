'use client';

import { useState } from 'react';
import { Plus, Trash2, Maximize2 } from 'lucide-react';

interface SizeManagerClientProps {
  initialSizes: any[];
}

export default function SizeManagerClient({ initialSizes }: SizeManagerClientProps) {
  const [sizes, setSizes] = useState(initialSizes);
  const [name, setName] = useState('');
  const [priceAdjust, setPriceAdjust] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const formatRupiah = (num: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(num);
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/admin/sizes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, priceAdjust: priceAdjust || 0 }),
      });
      const data = await res.json();
      if (data.success) {
        setSizes([...sizes, data.size]);
        setName('');
        setPriceAdjust('');
      } else {
        setError(data.error || 'Gagal menambah ukuran.');
      }
    } catch (err) {
      setError('Terjadi kesalahan koneksi.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, sizeName: string) => {
    if (!confirm(`Hapus ukuran "${sizeName}"?`)) return;

    try {
      const res = await fetch(`/api/admin/sizes/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setSizes(sizes.filter((s) => s.id !== id));
      } else {
        alert(data.error || 'Gagal menghapus ukuran.');
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
          <Plus className="w-4 h-4 text-rose-500" /> Tambah Ukuran Baru
        </h2>

        {error && <div className="text-xs text-red-400 font-bold">{error}</div>}

        <form onSubmit={handleAdd} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">Nama Ukuran</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Contoh: Medium (6-10 Tangkai)"
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">
              Tambahan Harga (Rp)
            </label>
            <input
              type="number"
              value={priceAdjust}
              onChange={(e) => setPriceAdjust(e.target.value)}
              placeholder="30000"
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold py-3 rounded-xl text-xs uppercase tracking-wider transition-colors shadow-md"
          >
            {loading ? 'Menyimpan...' : 'Tambah Ukuran'}
          </button>
        </form>
      </div>

      {/* List Table */}
      <div className="lg:col-span-7 bg-slate-800/80 border border-slate-700/80 rounded-3xl overflow-hidden shadow-xl">
        <div className="p-4 border-b border-slate-700 font-bold text-sm text-white flex items-center gap-2">
          <Maximize2 className="w-4 h-4 text-rose-400" /> Daftar Ukuran ({sizes.length})
        </div>
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="bg-slate-900 text-slate-400 font-extrabold uppercase tracking-wider border-b border-slate-700">
              <th className="py-3.5 px-6">Nama Ukuran</th>
              <th className="py-3.5 px-6">Penyesuaian Harga</th>
              <th className="py-3.5 px-6 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700/60 text-slate-200">
            {sizes.map((s) => (
              <tr key={s.id} className="hover:bg-slate-700/40">
                <td className="py-3.5 px-6 font-bold text-white">{s.name}</td>
                <td className="py-3.5 px-6 font-bold text-rose-400">
                  +{formatRupiah(s.priceAdjust)}
                </td>
                <td className="py-3.5 px-6 text-right">
                  <button
                    onClick={() => handleDelete(s.id, s.name)}
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
