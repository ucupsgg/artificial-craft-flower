import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding initial data...');

  // 1. Admin User
  const hashedPassword = await bcrypt.hash('admin123', 10);
  await prisma.user.upsert({
    where: { email: 'admin@craftflower.com' },
    update: {},
    create: {
      name: 'Admin Artificial Craft',
      email: 'admin@craftflower.com',
      password: hashedPassword,
      role: 'ADMIN',
    },
  });

  const mapsUrl = `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15951.350172675865!2d103.624812!3d-1.613089!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e2588c8868df59f%3A0x86bb6be6b8e8f813!2sTambak%20Sari%2C%20Kec.%20Jambi%20Sel.%2C%20Kota%20Jambi%2C%20Jambi!5e0!3m2!1sen!2sid!4v1700000000000!5m2!1sen!2sid`;

  // 2. Website Settings
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
      heroSubtitle: 'Abadikan momen indah tanpa layu dengan bucket bunga kustom berkualitas tinggi buatan tangan pilihan.',
      aboutText: 'Artificial Craft Flower adalah penyedia rangkaian buket bunga buatan (artificial bouquet) terpercaya. Dibuat secara presisi, indah, dan tahan selamanya untuk merayakan momen berharga seperti Wisuda, Ulang Tahun, Pernikahan, dan Acara Spesial lainnya.',
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

  // 3. Categories
  const categories = [
    { name: 'Graduation Bouquet', slug: 'graduation-bouquet' },
    { name: 'Birthday Bouquet', slug: 'birthday-bouquet' },
    { name: 'Anniversary Bouquet', slug: 'anniversary-bouquet' },
    { name: 'Wedding Bouquet', slug: 'wedding-bouquet' },
    { name: 'Money Bouquet', slug: 'money-bouquet' },
    { name: 'Custom Bouquet', slug: 'custom-bouquet' },
  ];

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
  }

  // 4. Sizes
  const sizes = [
    { name: 'Small (3-5 Tangkai)', priceAdjust: 0 },
    { name: 'Medium (6-10 Tangkai)', priceAdjust: 30000 },
    { name: 'Large (12-18 Tangkai)', priceAdjust: 60000 },
    { name: 'Extra Large (20+ Tangkai)', priceAdjust: 100000 },
  ];

  for (const s of sizes) {
    const existing = await prisma.size.findFirst({ where: { name: s.name } });
    if (!existing) {
      await prisma.size.create({ data: s });
    }
  }

  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
