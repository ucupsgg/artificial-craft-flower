import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedTestimonials() {
  console.log('Seeding initial testimonials with status: true...');

  const testimonials = [
    {
      name: 'Siti Rahma',
      role: 'Wisudawati UNJA',
      content:
        'Buket bunga artificial wisudanya sangat cantik & terlihat persis seperti bunga asli! Ditambah bunga ini tahan selamanya sebagai kenangan.',
      rating: 5,
      avatar:
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
      status: true,
    },
    {
      name: 'Budi Santoso',
      role: 'Pelanggan Money Bouquet',
      content:
        'Pemesanan Money Bouquet kustom sangat cepat dan hasilnya rapi sekali. Pacar saya sangat senang!',
      rating: 5,
      avatar:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
      status: true,
    },
  ];

  for (const t of testimonials) {
    const existing = await prisma.testimonial.findFirst({ where: { name: t.name } });
    if (!existing) {
      await prisma.testimonial.create({ data: t });
    } else {
      await prisma.testimonial.update({
        where: { id: existing.id },
        data: { status: true },
      });
    }
  }

  console.log('Testimonials seeded and updated successfully!');
}

seedTestimonials()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());
