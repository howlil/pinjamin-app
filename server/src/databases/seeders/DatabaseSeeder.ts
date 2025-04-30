import { PrismaClient } from "@prisma/client";
import { PenggunaSeeder } from "./PenggunaSeeder";
import { TipeGedungSeeder } from "./TipeGedungSeeder";
import { GedungSeeder } from "./GedungSeeder";
import { FasilitasSeeder } from "./FasilitasSeeder";
import { FasilitasGedungSeeder } from "./FasilitasGedungSeeder";
import { PenanggungJawabGedungSeeder } from "./PenanggungJawabGedungSeeder";
import { PeminjamanSeeder } from "./PeminjamanSeeder";
import { PembayaranSeeder } from "./PembayaranSeeder";
import { RefundSeeder } from "./RefundSeeder";
import { NotifikasiSeeder } from "./NotifikasiSeeder";

export class DatabaseSeeder {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async run(): Promise<void> {
    try {
      console.log("Starting database seeding...");

      // Run seeders in proper order to respect dependencies
      await new PenggunaSeeder(this.prisma).run();
      await new TipeGedungSeeder(this.prisma).run();
      await new GedungSeeder(this.prisma).run();
      await new FasilitasSeeder(this.prisma).run();
      await new FasilitasGedungSeeder(this.prisma).run();
      await new PenanggungJawabGedungSeeder(this.prisma).run();
      await new PeminjamanSeeder(this.prisma).run();
      await new PembayaranSeeder(this.prisma).run();
      await new RefundSeeder(this.prisma).run();
      await new NotifikasiSeeder(this.prisma).run();

      console.log("Database seeding completed successfully!");
    } catch (error) {
      console.error("Error seeding database:", error);
    } finally {
      await this.prisma.$disconnect();
    }
  }
}
