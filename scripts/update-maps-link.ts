import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function updateExactAddress() {
  console.log('Updating exact store address and Google Maps embed in Supabase database...');

  const fullAddress = '67 Jl. Kutilang III, Tambak Sari, Kec. Jambi Sel., Kota Jambi, Jambi';
  const mapsUrl = `https://maps.google.com/maps?q=${encodeURIComponent(fullAddress)}&z=17&output=embed`;

  await prisma.websiteSetting.upsert({
    where: { id: 'default' },
    update: {
      address: fullAddress,
      googleMaps: mapsUrl,
    },
    create: {
      id: 'default',
      siteName: 'Artificial Craft Flower',
      address: fullAddress,
      whatsapp: '6281617621150',
      email: 'waty2008@gmail.com',
      googleMaps: mapsUrl,
    },
  });

  console.log('Address and Google Maps updated successfully!');
}

updateExactAddress()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());
