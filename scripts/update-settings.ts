import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function updateStoreSettings() {
  console.log('Updating store settings with new contact info & location...');

  const mapsUrl = `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15951.350172675865!2d103.624812!3d-1.613089!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e2588c8868df59f%3A0x86bb6be6b8e8f813!2sTambak%20Sari%2C%20Kec.%20Jambi%20Sel.%2C%20Kota%20Jambi%2C%20Jambi!5e0!3m2!1sen!2sid!4v1700000000000!5m2!1sen!2sid`;

  await prisma.websiteSetting.upsert({
    where: { id: 'default' },
    update: {
      whatsapp: '6281617621150',
      email: 'waty2008@gmail.com',
      address: 'Tambak Sari, Kec. Jambi Sel., Kota Jambi, Jambi',
      googleMaps: mapsUrl,
      instagram: '',
      tiktok: '',
      facebook: '',
    },
    create: {
      id: 'default',
      siteName: 'Artificial Craft Flower',
      heroTitle: 'Rangkaian Bunga Artificial Premium & Elegan',
      heroSubtitle: 'Abadikan momen indah dengan bucket bunga kustom berkualitas tinggi yang tahan selamanya.',
      aboutText: 'Artificial Craft Flower menghadirkan keindahan bunga buatan tangan terbaik untuk momen spesial Anda.',
      address: 'Tambak Sari, Kec. Jambi Sel., Kota Jambi, Jambi',
      whatsapp: '6281617621150',
      email: 'waty2008@gmail.com',
      instagram: '',
      tiktok: '',
      facebook: '',
      googleMaps: mapsUrl,
      footerText: '© 2026 Artificial Craft Flower. All rights reserved.',
    },
  });

  console.log('Store settings updated successfully!');
}

updateStoreSettings()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());
