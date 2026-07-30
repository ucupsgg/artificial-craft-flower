'use client';

import { useState } from 'react';
import { Plus, Trash2, HelpCircle } from 'lucide-react';

interface FaqManagerClientProps {
  initialFaqs: any[];
}

export default function FaqManagerClient({ initialFaqs }: FaqManagerClientProps) {
  const [faqs, setFaqs] = useState(initialFaqs);
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [order, setOrder] = useState('0');
  const [isActive, setIsActive] = useState(true);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || !answer.trim()) return;
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/admin/faqs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question, answer, order, isActive }),
      });
      const data = await res.json();
      if (data.success) {
        setFaqs([...faqs, data.faq]);
        setQuestion('');
        setAnswer('');
        setOrder('0');
      } else {
        setError(data.error || 'Gagal menambah FAQ.');
      }
    } catch (err) {
      setError('Terjadi kesalahan koneksi.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, qText: string) => {
    if (!confirm(`Hapus FAQ "${qText}"?`)) return;

    try {
      const res = await fetch(`/api/admin/faqs/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setFaqs(faqs.filter((f) => f.id !== id));
      } else {
        alert(data.error || 'Gagal menghapus FAQ.');
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
          <Plus className="w-4 h-4 text-rose-500" /> Tambah FAQ Baru
        </h2>

        {error && <div className="text-xs text-red-400 font-bold">{error}</div>}

        <form onSubmit={handleAdd} className="space-y-3">
          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">Pertanyaan *</label>
            <input
              type="text"
              required
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Contoh: Apakah bunga tahan lama?"
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">Jawaban *</label>
            <textarea
              rows={3}
              required
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Ya, bunga buatan kami tahan selamanya..."
              className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
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
            disabled={loading}
            className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold py-3 rounded-xl text-xs uppercase tracking-wider transition-colors shadow-md mt-2"
          >
            {loading ? 'Menyimpan...' : 'Tambah FAQ'}
          </button>
        </form>
      </div>

      {/* List */}
      <div className="lg:col-span-7 bg-slate-800/80 border border-slate-700/80 rounded-3xl overflow-hidden shadow-xl">
        <div className="p-4 border-b border-slate-700 font-bold text-sm text-white flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-rose-400" /> Daftar FAQ ({faqs.length})
        </div>
        <div className="divide-y divide-slate-700/60 p-4 space-y-3">
          {faqs.map((f) => (
            <div key={f.id} className="p-4 bg-slate-900/80 rounded-2xl border border-slate-700 flex items-start justify-between gap-4">
              <div className="space-y-1">
                <h4 className="font-bold text-xs text-white">{f.question}</h4>
                <p className="text-xs text-slate-300">{f.answer}</p>
                <span className="text-[10px] text-rose-400 font-mono">Urutan: {f.order}</span>
              </div>

              <button
                onClick={() => handleDelete(f.id, f.question)}
                className="p-2 rounded-lg bg-slate-800 hover:bg-red-600 text-white transition-colors shrink-0"
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
