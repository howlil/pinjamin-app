import { Seeder } from "./Seeder";
import { PrismaClient } from "@prisma/client";
import { FasilitasFactory } from "../factories/FasilitasFactory";

export class FasilitasSeeder extends Seeder {
  private factory: FasilitasFactory;

  constructor(prisma: PrismaClient) {
    super(prisma);
    this.factory = new FasilitasFactory(prisma);
  }

  async run(): Promise<void> {
    console.log("Seeding fasilitas...");

    const facilityOptions = [
      { nama: "Wi-Fi", icon: "wifi.svg" },
      { nama: "Parkir", icon: "parking.svg" },
      { nama: "AC", icon: "ac.svg" },
      { nama: "Proyektor", icon: "projector.svg" },
      { nama: "Sound System", icon: "sound.svg" },
      { nama: "Toilet", icon: "toilet.svg" },
      { nama: "Kursi", icon: "chair.svg" },
      { nama: "Meja", icon: "table.svg" },
      { nama: "Lift", icon: "elevator.svg" },
      { nama: "CCTV", icon: "cctv.svg" },
    ];

    // First create all available facility types
    for (const facility of facilityOptions) {
      await this.prisma.fasilitas.create({
        data: {
          nama_fasilitas: facility.nama,
          icon_url: facility.icon,
        },
      });
    }

    console.log("Fasilitas seeded successfully");
    
    // Now connect facilities to buildings
    console.log("Connecting facilities to buildings...");
    
    const gedungList = await this.prisma.gedung.findMany();
    const fasilitasList = await this.prisma.fasilitas.findMany();
    
    if (gedungList.length === 0) {
      console.log("No buildings found. Please run GedungSeeder first.");
      return;
    }
    
    if (fasilitasList.length === 0) {
      console.log("No facilities found. Something went wrong.");
      return;
    }
    
    for (const gedung of gedungList) {
      // Add 3-5 random facilities to each building
      const facilitiesCount = Math.floor(Math.random() * 3) + 3;
      
      // Shuffle and take random facilities
      const shuffled = [...fasilitasList].sort(() => 0.5 - Math.random());
      const selectedFacilities = shuffled.slice(0, facilitiesCount);
      
      for (const facility of selectedFacilities) {
        await this.prisma.fasilitasGedung.create({
          data: {
            fasilitas_id: facility.id,
            gedung_id: gedung.id,
          },
        });
      }
    }
    
    console.log("Facility connections seeded successfully");
  }
}