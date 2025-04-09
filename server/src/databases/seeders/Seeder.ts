import { PrismaClient } from "@prisma/client";

export abstract class Seeder {
  protected prisma: PrismaClient;

  constructor(prismaClient: PrismaClient) {
    this.prisma = prismaClient;
  }

  abstract run(): Promise<void>;
}
