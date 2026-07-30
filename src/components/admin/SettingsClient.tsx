'use client';

import { useState } from 'react';
import { Save, Settings, CheckCircle2 } from 'lucide-react';

interface SettingsClientProps {
  initialSetting: any;
}

export default function SettingsClient({ initialSetting }: SettingsClientProps) {
  const [siteName, setSiteName] = useState(initialSetting?.siteName || 'Artificial Craft Flower');
  const [heroTitle, setHeroTitle] = useState(initialSetting?.heroTitle || 'Rangkaian Bunga Artificial Premium & Elegan');
  const [heroSubtitle, setHeroSubtitle] = useState(
    initialSetting?.heroSubtitle ||
      'Abadikan momen indah dengan bucket bunga kustom berkualitas tinggi yang tahan selamanya.'
  );
  const [aboutText, setAboutText] = useState(initialSetting?.aboutText || '');
  const [address, setAddress] = useState(initialSetting?.address || '');
  const [whatsapp, setWhatsapp] = useState(initialSetting?.whatsapp || '6281234567890');
  const [email, setEmail] = useState(initialSetting?.email || 'info@artificialcraftflower.com');
  const [instagram, setInstagram] = useState(initialSetting?.instagram || '');
  const [tiktok, setTiktok] = useState(initialSetting?.tiktok || '');
  const [facebook, setFacebook] = useState(initialSetting?.facebook || '');
  const [googleMaps, setGoogleMaps] = useState(initialSetting?.googleMaps || '');
  const [footerText, setFooterText] = useState(initialSetting?.footerText || '');

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    const payload = {
      siteName,
      heroTitle,
      heroSubtitle,
      aboutText,
      address,
      whatsapp,
      email,
      instagram,
      tiktok,
      facebook,
      googleMaps,
      footerText,
    };

    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        setMessage('Pengaturan website berhasil diperbarui!');
      } else {
        setError(data.error || 'Gagal memperbarui pengaturan.');
      }
    } catch (err) {
      setError('Terjadi kesalahan koneksi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-slate-800/80 p-8 rounded-3xl border border-slate-700/80 shadow-xl max-w-4xl">
      {message && (
        <div className="bg-emerald-500/10 border border-emerald-500/40 p-4 rounded-2xl text-emerald-400 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" /> {message}
        </div>
      )}

      {error && (
        <div className="bg-red-500/10 border border-red-500/40 p-4 rounded-2xl text-red-400 text-xs font-bold">
          {error}
        </div>
      )}

      <div className="space-y-4">
        <h2 className="text-sm font-bold text-white border-b border-slate-700 pb-2">Informasi Umum Website</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">Nama Website / Toko</label>
            <input
              type="text"
              required
              value={siteName}
              onChange={(e) => setSiteName(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">Nomor WhatsApp Admin (tanpa +)</label>
            <input
              type="text"
              required
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              placeholder="6281234567890"
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
          </div>
        </div>
      </div>

      {/* Hero Section Banner Content */}
      <div className="space-y-4 pt-4 border-t border-slate-700">
        <h2 className="text-sm font-bold text-white border-b border-slate-700 pb-2">Teks Banner Landing Page</h2>
        <div className="space-y-3">
          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">Hero Title</label>
            <input
              type="text"
              required
              value={heroTitle}
              onChange={(e) => setHeroTitle(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">Hero Subtitle</label>
            <textarea
              rows={2}
              value={heroSubtitle}
              onChange={(e) => setHeroSubtitle(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
          </div>
        </div>
      </div>

      {/* About & Contact */}
      <div className="space-y-4 pt-4 border-t border-slate-700">
        <h2 className="text-sm font-bold text-white border-b border-slate-700 pb-2">Tentang Toko & Alamat</h2>
        <div className="space-y-3">
          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">Deskripsi Singkat Toko (About)</label>
            <textarea
              rows={3}
              value={aboutText}
              onChange={(e) => setAboutText(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Email Toko</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Alamat Studio Toko</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Social Media Links */}
      <div className="space-y-4 pt-4 border-t border-slate-700">
        <h2 className="text-sm font-bold text-white border-b border-slate-700 pb-2">Tautan Media Sosial</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">URL Instagram</label>
            <input
              type="text"
              value={instagram}
              onChange={(e) => setInstagram(e.target.value)}
              placeholder="https://instagram.com/..."
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">URL TikTok</label>
            <input
              type="text"
              value={tiktok}
              onChange={(e) => setTiktok(e.target.value)}
              placeholder="https://tiktok.com/..."
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">URL Facebook</label>
            <input
              type="text"
              value={facebook}
              onChange={(e) => setFacebook(e.target.value)}
              placeholder="https://facebook.com/..."
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
          </div>
        </div>
      </div>

      {/* Footer Text */}
      <div className="pt-4 border-t border-slate-700">
        <label className="text-xs font-bold text-slate-300 block mb-1">Teks Hak Cipta Footer</label>
        <input
          type="text"
          value={footerText}
          onChange={(e) => setFooterText(e.target.value)}
          className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="inline-flex items-center gap-2 bg-rose-600 hover:bg-rose-700 text-white font-extrabold px-8 py-3.5 rounded-full text-xs uppercase tracking-wider shadow-lg transition-all"
      >
        <Save className="w-4 h-4" /> {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
      </button>
    </form>
  );
}
