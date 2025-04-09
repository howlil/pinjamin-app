import { Factory } from './Factory';
import { PrismaClient, Pengguna, ROLE, TIPEUSER } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

export class PenggunaFactory extends Factory<Pengguna> {
  constructor(prisma: PrismaClient) {
    super(prisma);
  }

  definition(): Partial<Pengguna> {
    return {
      nama_lengkap: this.fakerInstance.person.fullName(),
      email: this.fakerInstance.internet.email(),
      kata_sandi: bcrypt.hashSync('password123', 10),
      no_hp: this.fakerInstance.phone.number({style:"national"}),
      tipe_peminjam: this.fakerInstance.helpers.arrayElement([TIPEUSER.INUNAND, TIPEUSER.EXUNAND]),
      role: this.fakerInstance.helpers.arrayElement([ROLE.ADMIN, ROLE.PEMINJAM]),
    };
  }

  protected async store(data: Pengguna): Promise<Pengguna> {
    return await this.prisma.pengguna.create({ data });
  }
}