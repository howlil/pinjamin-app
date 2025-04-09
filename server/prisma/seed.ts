import { PrismaClient, ROLE, TIPEUSER } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seeder...');

  await prisma.fasilitasGedung.deleteMany({});
  await prisma.penanggungJawabGedung.deleteMany({});
  await prisma.peminjaman.deleteMany({});
  await prisma.gedung.deleteMany({});
  await prisma.tipeGedung.deleteMany({});
  await prisma.token.deleteMany({});
  await prisma.notifikasi.deleteMany({});
  await prisma.pengguna.deleteMany({});

  console.log('Existing data cleaned up');

  // Create admin user
  const hashedAdminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.pengguna.create({
    data: {
      nama_lengkap: 'Administrator',
      email: 'admin@unand.ac.id',
      kata_sandi: hashedAdminPassword,
      no_hp: '08123456789',
      tipe_peminjam: TIPEUSER.INUNAND,
      role: ROLE.ADMIN
    }
  });
  console.log('Admin user created');

  // Create sample peminjam users
  const hashedUserPassword = await bcrypt.hash('user123', 10);
  const internalUser = await prisma.pengguna.create({
    data: {
      nama_lengkap: 'Mahasiswa Unand',
      email: 'mahasiswa@unand.ac.id',
      kata_sandi: hashedUserPassword,
      no_hp: '08123456780',
      tipe_peminjam: TIPEUSER.INUNAND,
      role: ROLE.PEMINJAM
    }
  });

  const externalUser = await prisma.pengguna.create({
    data: {
      nama_lengkap: 'Pengguna Eksternal',
      email: 'external@gmail.com',
      kata_sandi: hashedUserPassword,
      no_hp: '08987654321',
      tipe_peminjam: TIPEUSER.EXUNAND,
      role: ROLE.PEMINJAM
    }
  });
  console.log('Sample users created');

  // Create tipe gedung
  const tipeGedungList = await Promise.all([
    prisma.tipeGedung.create({
      data: {
        nama_tipe_gedung: 'Auditorium'
      }
    }),
    prisma.tipeGedung.create({
      data: {
        nama_tipe_gedung: 'Ruang Seminar'
      }
    }),
    prisma.tipeGedung.create({
      data: {
        nama_tipe_gedung: 'Ruang Kuliah'
      }
    }),
    prisma.tipeGedung.create({
      data: {
        nama_tipe_gedung: 'Ruang Rapat'
      }
    }),
    prisma.tipeGedung.create({
      data: {
        nama_tipe_gedung: 'Aula'
      }
    })
  ]);
  console.log('Tipe gedung created');

  // Create gedung
  const gedungList = await Promise.all([
    prisma.gedung.create({
      data: {
        nama_gedung: 'Auditorium Universitas Andalas',
        deskripsi: 'Auditorium utama Universitas Andalas dengan kapasitas besar dan fasilitas lengkap untuk berbagai acara formal.',
        harga_sewa: 2000000,
        kapasitas: 1000,
        lokasi: 'Kampus Limau Manis, Padang',
        tipe_gedung_id: tipeGedungList[0].id,
      }
    }),
    prisma.gedung.create({
      data: {
        nama_gedung: 'Ruang Seminar Fakultas Teknik',
        deskripsi: 'Ruang seminar modern dengan perlengkapan audio visual dan internet berkecepatan tinggi.',
        harga_sewa: 500000,
        kapasitas: 100,
        lokasi: 'Gedung Fakultas Teknik, Kampus Limau Manis',
        tipe_gedung_id: tipeGedungList[1].id,
      }
    }),
    prisma.gedung.create({
      data: {
        nama_gedung: 'Aula Fakultas Ekonomi',
        deskripsi: 'Aula serbaguna dengan layout yang dapat disesuaikan untuk berbagai jenis kegiatan.',
        harga_sewa: 750000,
        kapasitas: 300,
        lokasi: 'Gedung Fakultas Ekonomi, Kampus Limau Manis',
        tipe_gedung_id: tipeGedungList[4].id,
      }
    }),
    prisma.gedung.create({
      data: {
        nama_gedung: 'Ruang Rapat Rektorat',
        deskripsi: 'Ruang rapat resmi dengan fasilitas konferensi video untuk pertemuan penting.',
        harga_sewa: 300000,
        kapasitas: 30,
        lokasi: 'Gedung Rektorat, Kampus Limau Manis',
        tipe_gedung_id: tipeGedungList[3].id,
      }
    }),
    prisma.gedung.create({
      data: {
        nama_gedung: 'Ruang Kuliah Convention Center',
        deskripsi: 'Ruang kuliah kapasitas besar dengan layout theater yang cocok untuk kuliah umum.',
        harga_sewa: 400000,
        kapasitas: 200,
        lokasi: 'Convention Center, Kampus Limau Manis',
        tipe_gedung_id: tipeGedungList[2].id,
      }
    })
  ]);
  console.log('Gedung created');

  // Create fasilitas gedung
  await Promise.all([
    // Fasilitas untuk Auditorium
    prisma.fasilitasGedung.create({
      data: {
        nama_fasilitas: 'Sound System Professional',
        icon_url: 'https://example.com/icons/sound.png',
        gedung_id: gedungList[0].id,
      }
    }),
    prisma.fasilitasGedung.create({
      data: {
        nama_fasilitas: 'Proyektor HD',
        icon_url: 'https://example.com/icons/projector.png',
        gedung_id: gedungList[0].id,
      }
    }),
    prisma.fasilitasGedung.create({
      data: {
        nama_fasilitas: 'AC Sentral',
        icon_url: 'https://example.com/icons/ac.png',
        gedung_id: gedungList[0].id,
      }
    }),
    prisma.fasilitasGedung.create({
      data: {
        nama_fasilitas: 'Kursi Teater',
        icon_url: 'https://example.com/icons/chair.png',
        gedung_id: gedungList[0].id,
      }
    }),
    
    // Fasilitas untuk Ruang Seminar
    prisma.fasilitasGedung.create({
      data: {
        nama_fasilitas: 'Proyektor',
        icon_url: 'https://example.com/icons/projector.png',
        gedung_id: gedungList[1].id,
      }
    }),
    prisma.fasilitasGedung.create({
      data: {
        nama_fasilitas: 'Sound System',
        icon_url: 'https://example.com/icons/sound.png',
        gedung_id: gedungList[1].id,
      }
    }),
    prisma.fasilitasGedung.create({
      data: {
        nama_fasilitas: 'WiFi',
        icon_url: 'https://example.com/icons/wifi.png',
        gedung_id: gedungList[1].id,
      }
    }),
    
    // Fasilitas untuk gedung lainnya
    prisma.fasilitasGedung.create({
      data: {
        nama_fasilitas: 'Meja Rapat',
        icon_url: 'https://example.com/icons/table.png',
        gedung_id: gedungList[3].id,
      }
    }),
    prisma.fasilitasGedung.create({
      data: {
        nama_fasilitas: 'Video Conference',
        icon_url: 'https://example.com/icons/videoconf.png',
        gedung_id: gedungList[3].id,
      }
    })
  ]);
  console.log('Fasilitas gedung created');

  // Create penanggung jawab gedung
  await Promise.all([
    prisma.penanggungJawabGedung.create({
      data: {
        nama_penangguang_jawab: 'Dr. Ahmad',
        no_hp: '081234567890',
        gedung_id: gedungList[0].id,
      }
    }),
    prisma.penanggungJawabGedung.create({
      data: {
        nama_penangguang_jawab: 'Ir. Budi',
        no_hp: '081234567891',
        gedung_id: gedungList[1].id,
      }
    }),
    prisma.penanggungJawabGedung.create({
      data: {
        nama_penangguang_jawab: 'Prof. Cahya',
        no_hp: '081234567892',
        gedung_id: gedungList[2].id,
      }
    }),
    prisma.penanggungJawabGedung.create({
      data: {
        nama_penangguang_jawab: 'Dr. Dewi',
        no_hp: '081234567893',
        gedung_id: gedungList[3].id,
      }
    }),
    prisma.penanggungJawabGedung.create({
      data: {
        nama_penangguang_jawab: 'Ir. Eko',
        no_hp: '081234567894',
        gedung_id: gedungList[4].id,
      }
    })
  ]);
  console.log('Penanggung jawab gedung created');

  console.log('Seeding completed successfully');
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });