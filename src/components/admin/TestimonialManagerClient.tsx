'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Star, Plus, Trash2, CheckCircle2, XCircle, MessageSquare, Clock, Filter } from 'lucide-react';

interface TestimonialManagerClientProps {
  initialTestimonials: any[];
}

export default function TestimonialManagerClient({
  initialTestimonials,
}: TestimonialManagerClientProps) {
  const [testimonials, setTestimonials] = useState(initialTestimonials);
  const [filter, setFilter] = useState<'ALL' | 'PENDING' | 'APPROVED'>('ALL');

  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [content, setContent] = useState('');
  const [rating, setRating] = useState('5');
  const [avatar, setAvatar] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const filteredList = testimonials.filter((t) => {
    if (filter === 'PENDING') return !t.status;
    if (filter === 'APPROVED') return t.status;
    return true;
  });

  const pendingCount = testimonials.filter((t) => !t.status).length;

  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      const res = await fetch(`/api/admin/testimonials/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: !currentStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setTestimonials(
          testimonials.map((t) => (t.id === id ? { ...t, status: !currentStatus } : t))
        );
      } else {
        alert(data.error || 'Gagal mengubah status ulasan.');
      }
    } catch (err) {
      alert('Terjadi kesalahan koneksi.');
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !content.trim()) return;
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/admin/testimonials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, role, content, rating, avatar, status: true }),
      });
      const data = await res.json();
      if (data.success) {
        setTestimonials([data.testimonial, ...testimonials]);
        setName('');
        setRole('');
        setContent('');
        setRating('5');
        setAvatar('');
      } else {
        setError(data.error || 'Gagal menambah testimoni.');
      }
    } catch (err) {
      setError('Terjadi kesalahan koneksi.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, tName: string) => {
    if (!confirm(`Hapus ulasan dari "${tName}"?`)) return;

    try {
      const res = await fetch(`/api/admin/testimonials/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setTestimonials(testimonials.filter((t) => t.id !== id));
      } else {
        alert(data.error || 'Gagal menghapus ulasan.');
      }
    } catch (err) {
      alert('Terjadi kesalahan koneksi.');
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      
      {/* Left Column: Form Manual Add by Admin */}
      <div className="lg:col-span-4 bg-slate-800/80 p-6 rounded-3xl border border-slate-700/80 shadow-xl space-y-4">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <Plus className="w-4 h-4 text-rose-500" /> Tambah Ulasan Manual
        </h2>

        {error && <div className="text-xs text-red-400 font-bold">{error}</div>}

        <form onSubmit={handleAdd} className="space-y-3">
          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">Nama Pelanggan *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Contoh: Amanda Rian"
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">Role / Momen</label>
            <input
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="Contoh: Wisudawati UNJA"
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">Rating Bintang (1-5)</label>
            <select
              value={rating}
              onChange={(e) => setRating(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
            >
              <option value="5">5 Bintang (Sangat Puas)</option>
              <option value="4">4 Bintang (Puas)</option>
              <option value="3">3 Bintang (Cukup)</option>
              <option value="2">2 Bintang (Kurang)</option>
              <option value="1">1 Bintang (Buruk)</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">Isi Ulasan *</label>
            <textarea
              rows={3}
              required
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Buket bunganya sangat bagus dan rapi..."
              className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">URL Avatar / Foto (Opsional)</label>
            <input
              type="text"
              value={avatar}
              onChange={(e) => setAvatar(e.target.value)}
              placeholder="https://..."
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold py-3 rounded-xl text-xs uppercase tracking-wider transition-colors shadow-md mt-2"
          >
            {loading ? 'Menyimpan...' : 'Tambah Testimoni'}
          </button>
        </form>
      </div>

      {/* Right Column: Manage & Approve Testimonials */}
      <div className="lg:col-span-8 bg-slate-800/80 border border-slate-700/80 rounded-3xl p-6 shadow-xl space-y-4">
        
        {/* Header & Filter Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-700 pb-4">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-rose-400" />
            <h3 className="font-bold text-base text-white">Seleksi & Moderasi Ulasan</h3>
            {pendingCount > 0 && (
              <span className="bg-amber-500 text-slate-950 font-black text-[10px] px-2 py-0.5 rounded-full animate-bounce">
                {pendingCount} Menunggu Ditinjau
              </span>
            )}
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-700">
            <button
              onClick={() => setFilter('ALL')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                filter === 'ALL' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Semua ({testimonials.length})
            </button>
            <button
              onClick={() => setFilter('PENDING')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                filter === 'PENDING' ? 'bg-amber-600 text-white' : 'text-amber-400 hover:text-white'
              }`}
            >
              Menunggu ({pendingCount})
            </button>
            <button
              onClick={() => setFilter('APPROVED')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                filter === 'APPROVED' ? 'bg-emerald-600 text-white' : 'text-emerald-400 hover:text-white'
              }`}
            >
              Tampil
            </button>
          </div>
        </div>

        {/* List of Testimonials */}
        <div className="space-y-4">
          {filteredList.length > 0 ? (
            filteredList.map((t) => (
              <div
                key={t.id}
                className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                  t.status
                    ? 'bg-slate-900/80 border-slate-700/80'
                    : 'bg-amber-950/20 border-amber-500/40 ring-1 ring-amber-500/30'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  
                  {/* User & Review Info */}
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-800 overflow-hidden relative shrink-0 border border-slate-700">
                      {t.avatar ? (
                        <Image src={t.avatar} alt={t.name} fill className="object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center font-bold text-rose-400 text-sm">
                          {t.name.charAt(0)}
                        </div>
                      )}
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-sm text-white">{t.name}</h4>
                        <span className="text-xs text-slate-400">({t.role || 'Pelanggan Toko'})</span>
                      </div>
                      
                      {/* Rating Stars */}
                      <div className="flex items-center gap-1 text-amber-400">
                        {[...Array(t.rating)].map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-current" />
                        ))}
                      </div>

                      {/* Content */}
                      <p className="text-xs text-slate-300 italic pt-1 leading-relaxed">
                        "{t.content}"
                      </p>
                    </div>
                  </div>

                  {/* Actions & Status Badge */}
                  <div className="flex flex-row sm:flex-col items-end justify-between gap-3 shrink-0">
                    
                    {/* Status Badge */}
                    {t.status ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-extrabold text-emerald-400 bg-emerald-950/80 border border-emerald-500/40 px-2.5 py-1 rounded-full whitespace-nowrap">
                        <CheckCircle2 className="w-3 h-3" /> Tampil di Website
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[10px] font-extrabold text-amber-300 bg-amber-950/80 border border-amber-500/40 px-2.5 py-1 rounded-full whitespace-nowrap animate-pulse">
                        <Clock className="w-3 h-3" /> Menunggu Seleksi
                      </span>
                    )}

                    {/* Approve Toggle & Delete Buttons */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleToggleStatus(t.id, t.status)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-extrabold transition-all ${
                          t.status
                            ? 'bg-slate-700 hover:bg-amber-600 text-amber-300 hover:text-white'
                            : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md'
                        }`}
                      >
                        {t.status ? 'Sembunyikan' : 'Setujui & Tampilkan'}
                      </button>

                      <button
                        onClick={() => handleDelete(t.id, t.name)}
                        className="p-1.5 rounded-lg bg-slate-700 hover:bg-red-600 text-white transition-colors"
                        title="Hapus Ulasan"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                  </div>

                </div>
              </div>
            ))
          ) : (
            <div className="py-8 text-center text-slate-400 text-xs font-medium">
              Tidak ada ulasan pada kategori filter ini.
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
