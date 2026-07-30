import { prisma } from '@/lib/prisma';
import { Phone, Mail, MapPin, Clock, Sparkles } from 'lucide-react';
import { InstagramIcon, FacebookIcon } from '@/components/ui/Icons';

export const revalidate = 0;

export default async function ContactPage() {
  let setting: any = null;
  try {
    setting = await prisma.websiteSetting.findUnique({ where: { id: 'default' } });
  } catch (err) {
    console.error('Error fetching contact page data:', err);
  }

  const whatsapp = setting?.whatsapp || '6281617621150';
  const email = setting?.email || 'waty2008@gmail.com';
  const address = setting?.address || '67 Jl. Kutilang III, Tambak Sari, Kec. Jambi Sel., Kota Jambi, Jambi';
  const instagram = setting?.instagram || '';
  const tiktok = setting?.tiktok || '';
  const facebook = setting?.facebook || '';
  let rawMapsUrl = setting?.googleMaps || '';
  
  // Smart Google Maps Embed formatter:
  let mapsUrl = `https://maps.google.com/maps?q=-1.613065,103.624808&z=15&output=embed`;
  
  if (rawMapsUrl) {
    if (rawMapsUrl.includes('google.com/maps/embed')) {
      mapsUrl = rawMapsUrl;
    } else if (rawMapsUrl.includes('maps.app.goo.gl') || rawMapsUrl.includes('goo.gl/maps')) {
      // Use fallback coordinates embed for short link
      mapsUrl = `https://maps.google.com/maps?q=-1.613065,103.624808&z=15&output=embed`;
    } else if (rawMapsUrl.startsWith('http')) {
      mapsUrl = rawMapsUrl;
    }
  }

  const waLink = `https://wa.me/${whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
    'Halo Artificial Craft Flower 🌸 Saya ingin bertanya atau berkonsultasi pemesanan.'
  )}`;

  const hasSocials = Boolean(instagram || tiktok || facebook);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      
      {/* Page Title */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-extrabold uppercase tracking-widest text-rose-600">Hubungi Kami</span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900">Lokasi & Kontak Toko</h1>
        <p className="text-slate-500 text-sm">
          Ingin berkonsultasi mengenai pesanan kustom buket bunga atau pertanyaan seputar pengiriman? Kami siap melayani Anda.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Contact Info Cards */}
        <div className="lg:col-span-5 space-y-6">
          
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500" /> Informasi Layanan
            </h3>

            {/* WhatsApp */}
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start gap-4 p-4 rounded-2xl bg-emerald-50 border border-emerald-100 hover:bg-emerald-100/70 transition-colors group"
            >
              <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-emerald-800">
                  WhatsApp Admin (Respon Cepat)
                </h4>
                <p className="text-sm font-black text-emerald-950 mt-0.5 group-hover:underline">
                  +{whatsapp}
                </p>
              </div>
            </a>

            {/* Email */}
            <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="w-10 h-10 rounded-full bg-rose-500 text-white flex items-center justify-center shrink-0">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-500">Email Resmi</h4>
                <p className="text-sm font-bold text-slate-800 mt-0.5">{email}</p>
              </div>
            </div>

            {/* Address */}
            <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="w-10 h-10 rounded-full bg-amber-500 text-white flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-500">Alamat Studio Toko</h4>
                <p className="text-sm font-bold text-slate-800 mt-0.5">{address}</p>
              </div>
            </div>

            {/* Operating Hours */}
            <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="w-10 h-10 rounded-full bg-slate-800 text-white flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-500">Jam Operasional</h4>
                <p className="text-sm font-bold text-slate-800 mt-0.5">Senin - Sabtu: 08.00 - 20.00 WIB</p>
              </div>
            </div>
          </div>

          {/* Social Media Links (Rendered only if filled) */}
          {hasSocials && (
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-3">
              <h3 className="text-base font-bold text-slate-900">Ikuti Media Sosial Kami</h3>
              <div className="flex items-center gap-3">
                {instagram && (
                  <a
                    href={instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-3 px-4 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-2xl text-xs font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
                  >
                    <InstagramIcon className="w-4 h-4" /> Instagram
                  </a>
                )}
                {facebook && (
                  <a
                    href={facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-3 px-4 bg-blue-600 text-white rounded-2xl text-xs font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
                  >
                    <FacebookIcon className="w-4 h-4" /> Facebook
                  </a>
                )}
              </div>
            </div>
          )}

        </div>

        {/* Google Maps Embed */}
        <div className="lg:col-span-7 bg-white p-4 rounded-3xl border border-slate-200 shadow-xs flex flex-col h-full min-h-[400px]">
          <h3 className="text-base font-bold text-slate-900 mb-3 px-2">Peta Lokasi Studio (Jambi)</h3>
          <div className="w-full h-full rounded-2xl overflow-hidden bg-slate-100 min-h-[380px]">
            <iframe
              title="Google Maps Location"
              src={mapsUrl}
              width="100%"
              height="100%"
              style={{ border: 0, minHeight: '380px' }}
              allowFullScreen={false}
              loading="lazy"
            />
          </div>
        </div>

      </div>

    </div>
  );
}
