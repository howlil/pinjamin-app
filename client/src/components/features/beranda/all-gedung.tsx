import FilterInput from "../../ui/costum/filter-input";
import SearchInput from "@/components/ui/costum/search-input";
import CardListGedung from "./components/card-list";

export default function AllGedung() {
  const data = [
    {
      image: "sss",
      title: "sss",
      price: 20,
    },
  ];

  return (
    <div className="py-12">
      <section className="mb-6 text-center space-y-2">
        <h1 className="text-3xl font-bold">Daftar Gedung Tersedia</h1>
        <p className="text-neutral-500 text-md leading-5">
          Temukan gedung dengan fasilitas terbaik untuk mendukung kesuksesan
          <br />
          acara akademik maupun non-akademik Anda.
        </p>
      </section>

      <section className="flex justify-between items-center">
        <SearchInput />
        <FilterInput />
      </section>
      <CardListGedung dataGedung={data} />
    </div>
  );
}
