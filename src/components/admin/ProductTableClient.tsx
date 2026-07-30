'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Edit, Trash2, Tag, Sparkles, Search, CheckCircle, XCircle } from 'lucide-react';

interface ProductTableClientProps {
  initialProducts: any[];
}

export default function ProductTableClient({ initialProducts }: ProductTableClientProps) {
  const [products, setProducts] = useState(initialProducts);
  const [search, setSearch] = useState('');

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.category?.name.toLowerCase().includes(search.toLowerCase())
  );

  const formatRupiah = (num: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(num);
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus produk "${name}"?`)) return;

    try {
      const res = await fetch(`/api/admin/products/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setProducts(products.filter((p) => p.id !== id));
      } else {
        alert(data.error || 'Gagal menghapus produk.');
      }
    } catch (err) {
      alert('Terjadi kesalahan koneksi.');
    }
  };

  return (
    <div className="space-y-4">
      {/* Search Filter */}
      <div className="relative max-w-md">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari produk berdasarkan nama atau kategori..."
          className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl pl-10 pr-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-rose-500"
        />
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
      </div>

      {/* Table Container */}
      <div className="bg-slate-800/80 border border-slate-700/80 rounded-3xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-900/90 text-slate-400 font-extrabold uppercase tracking-wider border-b border-slate-700">
                <th className="py-4 px-6 whitespace-nowrap">Produk</th>
                <th className="py-4 px-6 whitespace-nowrap">Kategori</th>
                <th className="py-4 px-6 whitespace-nowrap">Harga Original</th>
                <th className="py-4 px-6 whitespace-nowrap">Diskon</th>
                <th className="py-4 px-6 whitespace-nowrap">Badge Highlight</th>
                <th className="py-4 px-6 text-center whitespace-nowrap">Status</th>
                <th className="py-4 px-6 text-right whitespace-nowrap">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/60 text-slate-200">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((p) => {
                  const primaryImg =
                    p.images?.find((i: any) => i.isPrimary)?.url ||
                    p.images?.[0]?.url ||
                    'https://images.unsplash.com/photo-1561181286-d3fee7d55364?q=80&w=200&auto=format&fit=crop';
                  return (
                    <tr key={p.id} className="hover:bg-slate-700/40 transition-colors">
                      {/* Product Thumbnail & Name */}
                      <td className="py-4 px-6 min-w-[220px]">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-900 relative shrink-0 border border-slate-700 shadow-xs">
                            <Image src={primaryImg} alt={p.name} fill className="object-cover" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <span className="font-bold text-sm text-white block truncate leading-snug">
                              {p.name}
                            </span>
                            <span className="text-[11px] text-slate-400 block truncate font-mono mt-0.5">
                              {p.slug}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Category Badge */}
                      <td className="py-4 px-6 whitespace-nowrap">
                        <span className="inline-block whitespace-nowrap bg-rose-950/80 text-rose-300 px-3 py-1 rounded-full font-extrabold text-[11px] border border-rose-500/30">
                          {p.category?.name || '-'}
                        </span>
                      </td>

                      {/* Original Price */}
                      <td className="py-4 px-6 whitespace-nowrap font-bold text-slate-200">
                        {formatRupiah(p.price)}
                      </td>

                      {/* Discount Price */}
                      <td className="py-4 px-6 whitespace-nowrap">
                        {p.isDiscount && p.discountPrice ? (
                          <div className="flex flex-col">
                            <span className="font-black text-rose-400 text-sm">
                              {formatRupiah(p.discountPrice)}
                            </span>
                            <span className="text-[10px] text-emerald-400 font-extrabold">
                              Aktif Promo
                            </span>
                          </div>
                        ) : (
                          <span className="text-slate-500 font-semibold">-</span>
                        )}
                      </td>

                      {/* Badges */}
                      <td className="py-4 px-6 whitespace-nowrap">
                        <div className="flex flex-wrap gap-1.5">
                          {p.isBestSeller && (
                            <span className="bg-amber-500/20 text-amber-300 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border border-amber-500/30 whitespace-nowrap">
                              Best Seller
                            </span>
                          )}
                          {p.isPromo && (
                            <span className="bg-rose-500/20 text-rose-300 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border border-rose-500/30 whitespace-nowrap">
                              Promo
                            </span>
                          )}
                          {p.isFeatured && (
                            <span className="bg-blue-500/20 text-blue-300 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border border-blue-500/30 whitespace-nowrap">
                              Featured
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-4 px-6 text-center whitespace-nowrap">
                        {p.status ? (
                          <span className="inline-flex items-center gap-1 text-emerald-400 bg-emerald-950/60 px-3 py-1 rounded-full text-[10px] font-extrabold border border-emerald-500/30">
                            <CheckCircle className="w-3 h-3" /> Aktif
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-slate-400 bg-slate-900 px-3 py-1 rounded-full text-[10px] font-extrabold border border-slate-700">
                            <XCircle className="w-3 h-3" /> Nonaktif
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-6 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/admin/products/${p.id}/edit`}
                            className="p-2 rounded-lg bg-slate-700 hover:bg-rose-600 text-white transition-colors"
                            title="Edit Produk"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </Link>
                          <button
                            onClick={() => handleDelete(p.id, p.name)}
                            className="p-2 rounded-lg bg-slate-700 hover:bg-red-600 text-white transition-colors"
                            title="Hapus Produk"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400 font-semibold">
                    Tidak ada produk ditemukan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
