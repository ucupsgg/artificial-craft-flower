'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Flower2, Menu, X, ShoppingBag, PhoneCall, Sparkles } from 'lucide-react';

interface NavbarProps {
  siteName?: string;
  whatsapp?: string;
}

export default function Navbar({ siteName = 'Artificial Craft Flower', whatsapp = '6281234567890' }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Collection', href: '/collection' },
    { name: 'Gallery', href: '/gallery' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ];

  const waLink = `https://wa.me/${whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
    'Halo Artificial Craft Flower 🌸 Saya ingin bertanya seputar koleksi buket bunga.'
  )}`;

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-rose-100/60 shadow-xs transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-rose-500 to-amber-400 p-0.5 shadow-md group-hover:scale-105 transition-transform duration-300">
              <div className="w-full h-full bg-white rounded-full flex items-center justify-center">
                <Flower2 className="w-6 h-6 text-rose-500 group-hover:rotate-45 transition-transform duration-500" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-lg sm:text-xl tracking-tight text-slate-900 group-hover:text-rose-600 transition-colors">
                Artificial Craft
              </span>
              <span className="text-[10px] uppercase font-bold tracking-widest text-rose-500 -mt-1 flex items-center gap-1">
                Flower Studio <Sparkles className="w-2.5 h-2.5 inline text-amber-500" />
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                    isActive
                      ? 'bg-rose-50 text-rose-600 shadow-xs'
                      : 'text-slate-600 hover:text-rose-600 hover:bg-slate-50'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* CTA Action Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/collection"
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-700 hover:text-rose-600 px-3.5 py-2 rounded-full border border-slate-200 hover:border-rose-300 transition-all"
            >
              <ShoppingBag className="w-4 h-4 text-rose-500" />
              Katalog
            </Link>
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-500 text-white text-xs font-bold uppercase tracking-wider px-4 py-2.5 rounded-full shadow-sm hover:shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <PhoneCall className="w-4 h-4" />
              Pesan WA
            </a>
          </div>

          {/* Mobile Hamburger Toggle */}
          <div className="flex md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-none"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white/98 border-b border-rose-100 shadow-xl px-4 pt-2 pb-6 space-y-2 animate-in slide-in-from-top duration-200">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-4 py-3 rounded-xl text-base font-semibold transition-colors ${
                  isActive ? 'bg-rose-50 text-rose-600' : 'text-slate-700 hover:bg-slate-50 hover:text-rose-600'
                }`}
              >
                {link.name}
              </Link>
            );
          })}
          <div className="pt-4 border-t border-slate-100 flex flex-col gap-2">
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 bg-emerald-600 text-white font-bold py-3 rounded-xl shadow-md text-sm"
            >
              <PhoneCall className="w-4 h-4" />
              Pesan Via WhatsApp
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
