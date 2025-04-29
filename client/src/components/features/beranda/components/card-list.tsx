import { FC } from "react";
import { Gedung } from "@/interfaces/IGedung";
import CardGedung from "./card-gedung";

interface IGedungListProps {
  dataGedung: Gedung[];
}

const CardListGedung: FC<IGedungListProps> = ({ dataGedung }) => {
  if (!dataGedung || dataGedung.length === 0) {
    return (
      <div className="mt-16 text-center py-12 backdrop-blur-sm bg-white/30 rounded-xl border border-[#B7F6B5]/20">
        <h3 className="text-xl font-medium text-[#749C73]">
          Tidak ada gedung yang tersedia
        </h3>
        <p className="text-gray-500 mt-2">
          Silakan coba dengan pencarian atau filter yang berbeda.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
      {dataGedung.map((gedung) => (
        <CardGedung key={gedung.id} gedung={gedung} />
      ))}
    </div>
  );
};

export default CardListGedung;
