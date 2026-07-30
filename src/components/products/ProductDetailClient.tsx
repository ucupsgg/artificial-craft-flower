'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Tag,
  Sparkles,
  PhoneCall,
  ChevronLeft,
  ShieldCheck,
  Truck,
  Plus,
  Minus,
  MessageSquare,
  User,
  MapPin,
  CreditCard,
} from 'lucide-react';

interface ProductDetailClientProps {
  product: any;
  allSizes: any[];
  whatsappNumber: string;
}

export default function ProductDetailClient({
  product,
  allSizes,
  whatsappNumber,
}: ProductDetailClientProps) {
  const images = product.images?.length
    ? product.images
    : [
        {
          id: '1',
          url: 'https://images.unsplash.com/photo-1561181286-d3fee7d55364?q=80&w=800&auto=format&fit=crop',
          isPrimary: true,
        },
      ];

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string>(
    allSizes.length ? allSizes[0].name : 'Medium'
  );
  const [quantity, setQuantity] = useState<number>(1);
  const [customerName, setCustomerName] = useState<string>('');
  const [deliveryAddress, setDeliveryAddress] = useState<string>('');
  const [notes, setNotes] = useState<string>('');

  const hasDiscount = product.isDiscount && product.discountPrice && product.discountPrice < product.price;
  const basePrice = hasDiscount ? product.discountPrice! : product.price;

  // Selected size price adjust calculation
  const currentSizeObj = allSizes.find((s) => s.name === selectedSize);
  const sizePriceAdjust = currentSizeObj?.priceAdjust || 0;
  const totalPrice = (basePrice + sizePriceAdjust) * quantity;

  const formatRupiah = (num: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(num);
  };

  // WhatsApp Message Generator with Total Price & Delivery Address
  const generateWaLink = () => {
    const cleanWa = whatsappNumber.replace(/[^0-9]/g, '');
    const formattedTotal = formatRupiah(totalPrice);

    const message = `Halo Artificial Craft Flower 🌸

Saya ingin memesan:

Nama Pemesan :
${customerName.trim() ? customerName.trim() : '-'}

Produk :
${product.name}

Ukuran :
${selectedSize}

Jumlah :
${quantity} pcs

Total Harga :
${formattedTotal}

Alamat Tujuan Pengantaran :
${deliveryAddress.trim() ? deliveryAddress.trim() : '-'}

Catatan Pemesanan :
${notes.trim() ? notes.trim() : 'Tidak ada catatan.'}

Terima kasih.`;

    return `https://wa.me/${cleanWa}?text=${encodeURIComponent(message)}`;
  };

  return (
    <div className="space-y-8">
      {/* Back Link */}
      <Link
        href="/collection"
        className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-600 hover:text-rose-600 transition-colors"
      >
        <ChevronLeft className="w-4 h-4" /> Kembali ke Katalog
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Left Column: Image Slider / Gallery */}
        <div className="lg:col-span-6 space-y-4">
          <div className="relative aspect-[4/5] w-full rounded-3xl overflow-hidden bg-slate-100 border border-slate-200 shadow-md">
            <Image
              src={images[activeImageIndex]?.url}
              alt={product.name}
              fill
              className="object-cover transition-all duration-500"
              priority
            />

            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              {hasDiscount && (
                <span className="inline-flex items-center gap-1 bg-rose-600 text-white text-xs font-black px-3 py-1 rounded-full shadow-md uppercase tracking-wider">
                  <Tag className="w-3.5 h-3.5" /> Diskon Spesial
                </span>
              )}
              {product.isBestSeller && (
                <span className="inline-flex items-center gap-1 bg-amber-500 text-slate-900 text-xs font-black px-3 py-1 rounded-full shadow-md uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5" /> Best Seller
                </span>
              )}
            </div>
          </div>

          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {images.map((img: any, idx: number) => (
                <button
                  key={img.id || idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`relative w-20 aspect-square rounded-2xl overflow-hidden border-2 transition-all ${
                    activeImageIndex === idx ? 'border-rose-600 ring-2 ring-rose-300' : 'border-slate-200 opacity-70 hover:opacity-100'
                  }`}
                >
                  <Image src={img.url} alt={`Thumbnail ${idx}`} fill className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Product Info & Order Form */}
        <div className="lg:col-span-6 space-y-6 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs">
          
          {/* Category & Name */}
          <div className="space-y-2 border-b border-slate-100 pb-4">
            {product.category && (
              <span className="text-xs font-bold text-rose-600 uppercase tracking-widest bg-rose-50 px-3 py-1 rounded-full">
                {product.category.name}
              </span>
            )}
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">
              {product.name}
            </h1>
          </div>

          {/* Pricing */}
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-black text-rose-600">
              {formatRupiah(basePrice + sizePriceAdjust)}
            </span>
            {hasDiscount && (
              <span className="text-base text-slate-400 line-through font-semibold">
                {formatRupiah(product.price + sizePriceAdjust)}
              </span>
            )}
          </div>

          {/* Description */}
          {product.description && (
            <p className="text-slate-600 text-sm leading-relaxed border-b border-slate-100 pb-4">
              {product.description}
            </p>
          )}

          {/* Size Selection */}
          <div className="space-y-2">
            <label className="text-xs font-extrabold uppercase tracking-wider text-slate-700 block">
              Pilih Ukuran Buket:
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              {allSizes.map((sizeObj) => {
                const isSelected = selectedSize === sizeObj.name;
                return (
                  <button
                    key={sizeObj.id}
                    onClick={() => setSelectedSize(sizeObj.name)}
                    className={`p-3 rounded-2xl border text-xs font-bold text-left transition-all flex flex-col justify-between ${
                      isSelected
                        ? 'border-rose-600 bg-rose-50 text-rose-700 shadow-xs ring-1 ring-rose-500'
                        : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <span>{sizeObj.name}</span>
                    {sizeObj.priceAdjust > 0 && (
                      <span className="text-[11px] text-rose-600 font-extrabold mt-1">
                        +{formatRupiah(sizeObj.priceAdjust)}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quantity Selector */}
          <div className="space-y-2">
            <label className="text-xs font-extrabold uppercase tracking-wider text-slate-700 block">
              Jumlah Buket:
            </label>
            <div className="flex items-center gap-3">
              <div className="flex items-center border border-slate-200 rounded-full bg-slate-50 p-1">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-8 h-8 rounded-full bg-white shadow-xs flex items-center justify-center hover:bg-rose-50 hover:text-rose-600 text-slate-700 font-bold"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-12 text-center text-sm font-extrabold text-slate-900">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-8 h-8 rounded-full bg-white shadow-xs flex items-center justify-center hover:bg-rose-50 hover:text-rose-600 text-slate-700 font-bold"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <span className="text-xs text-slate-500">
                Total Harga: <strong className="text-rose-600 font-extrabold text-sm">{formatRupiah(totalPrice)}</strong>
              </span>
            </div>
          </div>

          {/* Customer Name Input */}
          <div className="space-y-1.5 pt-2 border-t border-slate-100">
            <label className="text-xs font-extrabold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <User className="w-4 h-4 text-rose-500" /> Nama Pemesan:
            </label>
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="Contoh: Amanda Rian"
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:bg-white transition-all"
            />
          </div>

          {/* Delivery Address Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-extrabold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-amber-500" /> Alamat Tujuan Pengantaran:
            </label>
            <textarea
              rows={2}
              value={deliveryAddress}
              onChange={(e) => setDeliveryAddress(e.target.value)}
              placeholder="Contoh: Jl. Merdeka No. 12, Tambak Sari, Jambi Selatan..."
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:bg-white transition-all"
            />
          </div>

          {/* Custom Notes */}
          <div className="space-y-1.5">
            <label className="text-xs font-extrabold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <MessageSquare className="w-4 h-4 text-emerald-500" /> Catatan Pemesanan (Opsional):
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Contoh: Mohon warna pita biru pastel, untuk kado wisuda saudara..."
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:bg-white transition-all"
            />
          </div>

          {/* Total Price Summary Box */}
          <div className="bg-rose-50 p-4 rounded-2xl border border-rose-100 flex items-center justify-between">
            <span className="text-xs font-extrabold text-slate-800 flex items-center gap-1.5 uppercase tracking-wider">
              <CreditCard className="w-4 h-4 text-rose-600" /> Total Yang Harus Dibayar:
            </span>
            <span className="text-lg font-black text-rose-600">
              {formatRupiah(totalPrice)}
            </span>
          </div>

          {/* Order Action Button */}
          <div className="pt-2 space-y-3">
            <a
              href={generateWaLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-700 hover:to-teal-600 text-white font-extrabold py-4 px-6 rounded-full shadow-lg shadow-emerald-600/25 hover:scale-[1.01] active:scale-[0.99] transition-all uppercase tracking-wider text-sm"
            >
              <PhoneCall className="w-5 h-5" /> Pesan Sekarang via WhatsApp
            </a>
            <p className="text-[11px] text-center text-slate-400">
              *Pesanan akan otomatis dirangkai menjadi pesan WhatsApp rapi beserta Nama Pemesan, Total Harga, & Alamat Tujuan.
            </p>
          </div>

          {/* Trust Highlights */}
          <div className="pt-2 grid grid-cols-2 gap-3 text-slate-500 text-xs font-semibold">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" /> Bunga Artificial Premium
            </div>
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-rose-500" /> Packing Aman Dus & Bubble
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
