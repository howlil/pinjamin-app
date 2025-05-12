import { Prisma } from '@prisma/client';

export type PrismaToInterface<T> = {
  [P in keyof T]: T[P] extends infer U | null
    ? U | undefined
    : T[P] extends object
    ? PrismaToInterface<T[P]>
    : T[P];
};

export type PrismaPembayaran = Prisma.PembayaranGetPayload<{
  include: {
    peminjaman: {
      include: {
        pengguna: true;
        gedung: true;
      };
    };
  };
}>;

export type InterfacePembayaran = PrismaToInterface<PrismaPembayaran>;