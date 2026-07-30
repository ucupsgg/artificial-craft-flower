'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { Search, SlidersHorizontal, Tag } from 'lucide-react';

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface CollectionFiltersProps {
  categories: Category[];
  selectedCategory: string;
  searchQuery: string;
  sort: string;
}

export default function CollectionFilters({
  categories,
  selectedCategory,
  searchQuery,
  sort,
}: CollectionFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchQuery);

  const updateQueryParams = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== 'all') {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`/collection?${params.toString()}`);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateQueryParams('search', search);
  };

  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-6">
      
      {/* Top Controls: Search Bar & Sort Dropdown */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Search Input Form */}
        <form onSubmit={handleSearchSubmit} className="relative w-full md:w-96">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari buket (misal: Rose, Wisuda, Money)..."
            className="w-full bg-slate-50 border border-slate-200 rounded-full pl-11 pr-24 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:bg-white transition-all"
          />
          <Search className="w-5 h-5 text-slate-400 absolute left-4 top-3.5" />
          <button
            type="submit"
            className="absolute right-2 top-1.5 bottom-1.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs px-4 rounded-full transition-colors"
          >
            Cari
          </button>
        </form>

        {/* Sort Dropdown */}
        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
          <SlidersHorizontal className="w-4 h-4 text-slate-500" />
          <span className="text-xs font-bold text-slate-600">Urutkan:</span>
          <select
            value={sort}
            onChange={(e) => updateQueryParams('sort', e.target.value)}
            className="bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold rounded-full px-3 py-2 focus:outline-none focus:ring-2 focus:ring-rose-500 cursor-pointer"
          >
            <option value="newest">Terbaru</option>
            <option value="price-low">Harga: Termurah</option>
            <option value="price-high">Harga: Termahal</option>
          </select>
        </div>

      </div>

      {/* Category Filter Chips */}
      <div className="pt-2 border-t border-slate-100">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <button
            onClick={() => updateQueryParams('category', 'all')}
            className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
              selectedCategory === 'all'
                ? 'bg-rose-600 text-white shadow-md'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Tag className="w-3.5 h-3.5" /> Semua Produk
          </button>

          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => updateQueryParams('category', cat.slug)}
              className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                selectedCategory === cat.slug
                  ? 'bg-rose-600 text-white shadow-md'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

    </div>
  );
}
