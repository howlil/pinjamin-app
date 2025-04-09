import { Seeder } from './Seeder';
import { PrismaClient, ROLE, TIPEUSER } from '@prisma/client';
import { PenggunaFactory } from '../factories/PenggunaFactory';
import * as bcrypt from 'bcryptjs';

export class PenggunaSeeder extends Seeder {
  private factory: PenggunaFactory;
  
  constructor(prisma: PrismaClient) {
    super(prisma);
    this.factory = new PenggunaFactory(prisma);
  }
  
  async run(): Promise<void> {
    console.log('Seeding pengguna...');
    
    // Create admin user
    await this.prisma.pengguna.create({
      data: {
        nama_lengkap: 'Admin Sistem',
        email: 'admin@example.com',
        kata_sandi: bcrypt.hashSync('admin123', 10),
        no_hp: '082112345678',
        tipe_peminjam: TIPEUSER.INUNAND,
        role: ROLE.ADMIN,
      }
    });
    
    // Create regular peminjam user
    await this.prisma.pengguna.create({
      data: {
        nama_lengkap: 'User Demo',
        email: 'user@example.com',
        kata_sandi: bcrypt.hashSync('user123', 10),
        no_hp: '082187654321',
        tipe_peminjam: TIPEUSER.EXUNAND,
        role: ROLE.PEMINJAM,
      }
    });
    
    // Create random users
    await this.factory.createMany(10);
    
    console.log('Pengguna seeded successfully');
  }
}
