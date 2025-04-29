import CheckRuangan from "./components/cek-ruangan";
import TodayRent from "./components/today-rent";

export default function HeroSection() {
  return (
    <section className="py-8 lg:py-16 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
      <CheckRuangan />
      <TodayRent/>
    </section>
  );
}
