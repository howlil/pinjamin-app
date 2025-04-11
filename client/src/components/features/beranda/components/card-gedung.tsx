import { FC } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Gedung } from "@/interfaces/IGedung";

const CardGedung: FC<{ gedung: Gedung }> = ({ gedung }) => {
  const navigate = useNavigate();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID").format(price);
  };

  console.log(`${import.meta.env.VITE_API_URL}/foto/${gedung.foto_gedung}`);
  return (
    <motion.div
      className="rounded-lg overflow-hidden border border-white/10 bg-white/30 backdrop-blur-md shadow-sm hover:shadow-2xl transition-all duration-300"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -3, backgroundColor: "rgba(255, 255, 255, 0.4)" }}
      transition={{ duration: 0.2 }}
    >
      <div className="h-64 overflow-hidden relative">
        <img
          src={`${import.meta.env.VITE_API_URL}/foto/${gedung.foto_gedung}`}
          alt={gedung.nama_gedung}
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent h-1/3"></div>
      </div>

      <div className="p-2 space-y-4">
        <div className="">
          <h3 className="text-lg font-semibold text-[#749C73] line-clamp-1">
            {gedung.nama_gedung}
          </h3>
          <p className="text-[#545454]  text-md whitespace-nowrap">
            Rp {formatPrice(gedung.harga_sewa)}
          </p>
        </div>

        <Button onClick={() => navigate(`/gedung/${gedung.id}`)}>
          Lihat Detail →
        </Button>
      </div>
    </motion.div>
  );
};

export default CardGedung;
