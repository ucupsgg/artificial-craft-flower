'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Tag } from 'lucide-react';

interface GalleryItem {
  id: string;
  title: string;
  image: string;
  category: string;
}

interface GalleryClientProps {
  items: GalleryItem[];
}

export default function GalleryClient({ items }: GalleryClientProps) {
  const categories = [
    'All',
    'Graduation',
    'Birthday',
    'Anniversary',
    'Wedding',
    'Money Bouquet',
    'Custom Bouquet',
  ];

  const [activeCategory, setActiveCategory] = useState('All');

  const filteredItems =
    activeCategory === 'All'
      ? items
      : items.filter(
          (item) => item.category.toLowerCase() === activeCategory.toLowerCase()
        );

  return (
    <div className="space-y-8">
      {/* Category Tabs */}
      <div className="flex items-center justify-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
              activeCategory === cat
                ? 'bg-rose-600 text-white shadow-md'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-rose-50 hover:text-rose-600'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid */}
      {filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="group relative aspect-[4/5] rounded-3xl overflow-hidden bg-slate-100 border border-slate-200 shadow-xs hover:shadow-xl transition-all"
            >
              <Image
                src={item.image}
                alt={item.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-6 flex flex-col justify-end text-white">
                <span className="inline-flex items-center gap-1 bg-rose-600 text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-full w-fit uppercase tracking-wider mb-2">
                  <Tag className="w-3 h-3" /> {item.category}
                </span>
                <h3 className="font-bold text-base leading-tight">{item.title}</h3>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 space-y-3">
          <p className="text-slate-500 font-bold text-sm">Belum ada foto galeri di kategori ini.</p>
        </div>
      )}
    </div>
  );
}
