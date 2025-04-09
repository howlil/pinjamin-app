import FilterInput from "../../ui/costum/filter-input";
import SearchInput from "@/components/ui/costum/search-input";
import CardListGedung from "./components/card-list";
import { GedungService } from "@/apis/gedung";
import { Gedung, GedungFilter } from "@/interfaces/IGedung";
import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

const filterOptions = [
  { value: "price_low", label: "Harga Terendah" },
  { value: "price_high", label: "Harga Tertinggi" },
  { value: "newest", label: "Terbaru" },
  { value: "capacity", label: "Kapasitas Terbesar" },
];

export default function AllGedung() {
  const [dataGedung, setDataGedung] = React.useState<Gedung[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [filter, setFilter] = React.useState<GedungFilter>({});
  const [search, setSerach] = React.useState("");

  React.useEffect(() => {
    async function fecthDataGedung() {
      setLoading(true);
      try {
        const currentFilter = search
          ? { ...filter, nama_gedung: search }
          : filter;

        const data = await GedungService.getGedung(currentFilter);
        setDataGedung(data);
      } catch (error) {
        throw error;
      } finally {
        setLoading(false);
      }
    }
    fecthDataGedung();
  }, [filter, search]);

  const handleSearch = (value: string) => {
    setSerach(value);
  };

  const handleFilter = (value: string) => {
    switch (value) {
      case "price_low":
        setDataGedung(
          [...dataGedung].sort((a, b) => a.harga_sewa - b.harga_sewa)
        );
        break;
      case "price_high":
        setDataGedung(
          [...dataGedung].sort((a, b) => b.harga_sewa - a.harga_sewa)
        );
        break;
      case "newest":
        break;
      case "capacity":
        setDataGedung(
          [...dataGedung].sort((a, b) => {
            const capA = a.kapasitas || 0;
            const capB = b.kapasitas || 0;
            return capB - capA;
          })
        );
        break;

      case "price_range_low":
        setFilter((prev) => ({ ...prev, harga_min: 0, harga_max: 500000 }));
        break;
      case "price_range_high":
        setFilter((prev) => ({ ...prev, harga_min: 500000 }));
        break;

      default:
        break;
    }
  };
  return (
    <div className="py-12">
      <section className="mb-6 text-center space-y-2">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-[#749C73] to-[#B7F6B5] bg-clip-text text-transparent">
          Daftar Gedung Tersedia
        </h1>
        <p className="text-neutral-500 text-lg leading-5">
          Temukan gedung dengan fasilitas terbaik untuk mendukung kesuksesan
          <br />
          acara akademik maupun non-akademik Anda.
        </p>
      </section>
      <section className="flex justify-between mt-12 items-center">
        <SearchInput
          placeholder="Cari nama gedung..."
          onSearch={handleSearch}
        />
        <FilterInput options={filterOptions} onFilterChange={handleFilter} />
      </section>
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {[1, 2, 3, 4, 5, 6].map((_, index) => (
            <div key={index} className="rounded-lg border overflow-hidden">
              <Skeleton className="h-48 w-full" />
              <div className="p-4 space-y-2">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-6 w-1/3" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <CardListGedung dataGedung={dataGedung} />
      )}{" "}
    </div>
  );
}
