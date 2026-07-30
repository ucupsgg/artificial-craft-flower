'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Flower2, Lock, Mail, ArrowRight, AlertCircle } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.error || 'Gagal login. Periksa email & password.');
      } else {
        router.push('/admin/dashboard');
        router.refresh();
      }
    } catch (err) {
      setError('Terjadi kesalahan koneksi server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      
      <div className="w-full max-w-md bg-slate-800 border border-slate-700/80 rounded-3xl p-8 shadow-2xl space-y-6">
        
        {/* Brand Logo Header */}
        <div className="text-center space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-rose-500 to-amber-400 p-0.5 mx-auto shadow-lg">
            <div className="w-full h-full bg-slate-900 rounded-[14px] flex items-center justify-center">
              <Flower2 className="w-7 h-7 text-rose-400" />
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-black text-white">Dashboard Admin</h1>
            <p className="text-slate-400 text-xs mt-1">Artificial Craft Flower Management</p>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/40 p-3.5 rounded-2xl text-red-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-300 block">Email Admin</label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
                placeholder="Masukkan email admin..."
              />
              <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-300 block">Password</label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
                placeholder="Masukkan password..."
              />
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-rose-600 hover:bg-rose-700 text-white font-extrabold py-3.5 rounded-xl shadow-lg hover:shadow-rose-600/30 transition-all flex items-center justify-center gap-2 text-sm"
          >
            {loading ? (
              <span>Memproses Login...</span>
            ) : (
              <>
                <span>Masuk Dashboard</span> <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

        </form>

      </div>

    </div>
  );
}
