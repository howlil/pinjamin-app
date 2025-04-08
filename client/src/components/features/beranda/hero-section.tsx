import CheckRuangan from "./components/cek-ruangan";
import TodayRent from "./components/today-rent";

export default function HeroSection() {
  return (
    <section className=" py-32 grid  grid-cols-2 gap-12">
      <CheckRuangan />
      <TodayRent/>
    </section>
  );
}
