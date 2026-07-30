import Link from 'next/link';
import { Flower2, Phone, Mail, MapPin, Clock, Sparkles } from 'lucide-react';
import { InstagramIcon, FacebookIcon, TikTokIcon } from '@/components/ui/Icons';

interface FooterProps {
  setting?: {
    siteName?: string | null;
    aboutText?: string | null;
    address?: string | null;
    whatsapp?: string | null;
    email?: string | null;
    instagram?: string | null;
    tiktok?: string | null;
    facebook?: string | null;
    footerText?: string | null;
  } | null;
}

export default function Footer({ setting }: FooterProps) {
  const siteName = setting?.siteName || 'Artificial Craft Flower';
  const whatsapp = setting?.whatsapp || '6281617621150';
  const email = setting?.email || 'waty2008@gmail.com';
  const address = setting?.address || '67 Jl. Kutilang III, Tambak Sari, Kec. Jambi Sel., Kota Jambi, Jambi';
  const instagram = setting?.instagram ?? '';
  const tiktok = setting?.tiktok ?? '';
  const facebook = setting?.facebook ?? '';
  const footerText = setting?.footerText || `© ${new Date().getFullYear()} Artificial Craft Flower. All rights reserved.`;

  const hasSocials = Boolean(instagram || tiktok || facebook);

  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-slate-800">
          
          {/* Col 1: Store Bio */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-rose-500 to-amber-400 p-0.5">
                <div className="w-full h-full bg-slate-900 rounded-full flex items-center justify-center">
                  <Flower2 className="w-5 h-5 text-rose-400" />
                </div>
              </div>
              <span className="font-extrabold text-xl tracking-tight text-white">
                {siteName}
              </span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">
              {setting?.aboutText ||
                'Penyedia rangkaian buket bunga buatan (artificial) berkualitas tinggi. Abadikan setiap momen berharga Anda tanpa kuatir layu.'}
            </p>
            {hasSocials && (
              <div className="flex items-center gap-3 pt-2">
                {instagram && (
                  <a
                    href={instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center hover:bg-rose-600 hover:text-white transition-colors"
                    aria-label="Instagram"
                  >
                    <InstagramIcon className="w-4 h-4" />
                  </a>
                )}
                {facebook && (
                  <a
                    href={facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center hover:bg-rose-600 hover:text-white transition-colors"
                    aria-label="Facebook"
                  >
                    <FacebookIcon className="w-4 h-4" />
                  </a>
                )}
                {tiktok && (
                  <a
                    href={tiktok}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center hover:bg-rose-600 hover:text-white transition-colors"
                    aria-label="TikTok"
                  >
                    <TikTokIcon className="w-4 h-4" />
                  </a>
                )}
              </div>
            )}
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h3 className="text-white font-bold text-base mb-4 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" /> Navigasi
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/" className="hover:text-rose-400 transition-colors">
                  Beranda (Home)
                </Link>
              </li>
              <li>
                <Link href="/collection" className="hover:text-rose-400 transition-colors">
                  Katalog Koleksi
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="hover:text-rose-400 transition-colors">
                  Galeri Hasil Buket
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-rose-400 transition-colors">
                  Tentang Kami
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-rose-400 transition-colors">
                  Hubungi Kami
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Categories */}
          <div>
            <h3 className="text-white font-bold text-base mb-4">Kategori Buket</h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/collection?category=graduation-bouquet" className="hover:text-rose-400 transition-colors">
                  Graduation Bouquet
                </Link>
              </li>
              <li>
                <Link href="/collection?category=birthday-bouquet" className="hover:text-rose-400 transition-colors">
                  Birthday Bouquet
                </Link>
              </li>
              <li>
                <Link href="/collection?category=anniversary-bouquet" className="hover:text-rose-400 transition-colors">
                  Anniversary Bouquet
                </Link>
              </li>
              <li>
                <Link href="/collection?category=money-bouquet" className="hover:text-rose-400 transition-colors">
                  Money Bouquet
                </Link>
              </li>
              <li>
                <Link href="/collection?category=custom-bouquet" className="hover:text-rose-400 transition-colors">
                  Custom Bouquet
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Contact & Hours */}
          <div className="space-y-3.5 text-sm">
            <h3 className="text-white font-bold text-base mb-4">Kontak & Lokasi</h3>
            <div className="flex items-start gap-3 text-slate-400">
              <MapPin className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
              <span>{address}</span>
            </div>
            <div className="flex items-center gap-3 text-slate-400">
              <Phone className="w-4 h-4 text-rose-500 shrink-0" />
              <a href={`https://wa.me/${whatsapp.replace(/[^0-9]/g, '')}`} className="hover:text-rose-400 transition-colors">
                +{whatsapp}
              </a>
            </div>
            <div className="flex items-center gap-3 text-slate-400">
              <Mail className="w-4 h-4 text-rose-500 shrink-0" />
              <span>{email}</span>
            </div>
            <div className="flex items-center gap-3 text-slate-400 pt-1">
              <Clock className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Senin - Sabtu: 08.00 - 20.00 WIB</span>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>{footerText}</p>
          <div className="flex items-center gap-4">
            <Link href="/admin/login" className="hover:text-slate-300 transition-colors">
              Admin Login
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
