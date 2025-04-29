import AllGedung from "@/components/features/beranda/all-gedung";
import HeroSection from "@/components/features/beranda/hero-section";
import MainLayout from "@/components/core/layouts/main-layout";
import { AnimatedGridPattern } from "@/components/ui/magicui/animated-grid-pattern";
import { cn } from "@/lib/utils";

export default function BerandaPage() {
  return (
    <MainLayout>

      <AnimatedGridPattern
        numSquares={60}
        maxOpacity={0.1}
        duration={3}
        repeatDelay={1}
        className={cn(
          "[mask-image:radial-gradient(500px_circle_at_center,white,transparent)]",
          "inset-x-0 inset-y-[-30%] h-[200%]"
        )}
        />

      <div className="absolute -top-20 -left-10 w-72 h-72 bg-[#B7F6B5]/40  rounded-full filter blur-[11rem]"></div>
      <div className="absolute -bottom-72 -right-[30rem] w-[800px] h-[800px] bg-[#B7F6B5]/40   bg-opacity-35 rounded-full filter blur-[20rem] -z-10"></div>
      
      <HeroSection />
      <AllGedung/>
    </MainLayout>
  );
}
