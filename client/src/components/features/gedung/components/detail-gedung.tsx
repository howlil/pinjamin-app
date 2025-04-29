import React, { useState } from "react";
import {
  Gedungs,
  TipeGedung,
  PenanggungJawabGedung,
} from "@/interfaces/IGedung";
import { motion, AnimatePresence } from "framer-motion";

interface DetailGedungProps {
  data: Gedungs;
}

export interface FasilitasGedung {
  id: string;
  nama_fasilitas: string;
  icon_url?: string;
  gedung_id: string;
  createdAt: string;
  updatedAt: string;
}

// Extend the Gedungs interface if needed
declare module "@/interfaces/IGedung" {
  interface Gedungs {
    FasilitasGedung: FasilitasGedung[];
  }
}

export default function DetailGedung({ data }: DetailGedungProps) {
  if (!data) return null;

  const [activeTab, setActiveTab] = useState<"info" | "facilities" | "contact">(
    "info"
  );

  const formatRupiah = (number: number): string => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(number);
  };

  return (
    <div className="bg-[#bfffac1d] p-4 rounded-lg">
      <div className="relative mb-4 overflow-hidden rounded-lg h-96 bg-gray-100">
        <img
          src={`${import.meta.env.VITE_API_URL}/foto/${data.foto_gedung}`}
          alt={data.nama_gedung}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
        <div className="absolute left-0 right-0 bottom-0 p-3 text-white">
          <h1 className="text-2xl font-bold">{data.nama_gedung}</h1>
          <div className="flex items-center space-x-2 mt-1">
            <span className="text-xs px-2 py-0.5 bg-white/20 rounded">
              {data.TipeGedung?.nama_tipe_gedung || "Tidak tersedia"}
            </span>
            <span className="text-xs px-2 py-0.5 bg-white/20 rounded">
              {data.kapasitas} Orang
            </span>
            <span className="text-[#FCA129] font-semibold ml-1">
              {formatRupiah(data.harga_sewa)}
            </span>
          </div>
        </div>
      </div>

      <div className="flex border-b border-gray-200 mb-4">
        <button
          onClick={() => setActiveTab("info")}
          className={`px-3 py-2 text-sm font-medium relative ${
            activeTab === "info"
              ? "text-[#749C73] border-b-2 border-[#749C73]"
              : "text-gray-500"
          }`}
        >
          Informasi
        </button>
        <button
          onClick={() => setActiveTab("facilities")}
          className={`px-3 py-2 text-sm font-medium relative ${
            activeTab === "facilities"
              ? "text-[#749C73] border-b-2 border-[#749C73]"
              : "text-gray-500"
          }`}
        >
          Fasilitas
        </button>
        <button
          onClick={() => setActiveTab("contact")}
          className={`px-3 py-2 text-sm font-medium relative ${
            activeTab === "contact"
              ? "text-[#749C73] border-b-2 border-[#749C73]"
              : "text-gray-500"
          }`}
        >
          Kontak
        </button>
      </div>

      <div className="min-h-[200px]">
        <AnimatePresence mode="wait">
          {activeTab === "info" && (
            <motion.div
              key="info"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <p className="text-sm text-gray-700 mb-4">{data.deskripsi}</p>

              <div className="bg-white/20 backdrop-blur-md p-3 rounded-lg border mb-4">
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <div>
                    <div className="text-gray-500 text-xs">Tipe</div>
                    <div className="font-medium">
                      {data.TipeGedung?.nama_tipe_gedung || "-"}
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-500 text-xs">Kapasitas</div>
                    <div className="font-medium">{data.kapasitas} Orang</div>
                  </div>
                  <div>
                    <div className="text-gray-500 text-xs">Harga</div>
                    <div className="font-medium text-[#749C73]">
                      {formatRupiah(data.harga_sewa)}
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white/20 backdrop-blur-md p-3 rounded-lg border mb-4">
                <div className="text-gray-500 text-xs mb-1">Lokasi</div>
                <div className="flex items-start">
                  <svg
                    className="w-4 h-4 text-[#749C73] mt-0.5 mr-2 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <span className="text-gray-700 text-sm">{data.lokasi}</span>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "facilities" && (
            <motion.div
              key="facilities"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="grid grid-cols-2 gap-2"
            >
              {data.FasilitasGedung &&
                data.FasilitasGedung.map(
                  (fasilitas: FasilitasGedung, index) => (
                    <motion.div
                      key={fasilitas.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{
                        opacity: 1,
                        y: 0,
                        transition: { delay: index * 0.05 },
                      }}
                      className="bg-white/20 p-3 rounded-lg border flex justify-between items-center"
                    >
                      <div className="w-7 h-7 rounded-full bg-[#749C73]/10 mr-2 flex items-center justify-center text-[#749C73]">
                        {fasilitas.icon_url ? (
                          <img
                            src={`/assets/icons/${fasilitas.icon_url}`}
                            alt={fasilitas.nama_fasilitas}
                            className="h-4 w-4"
                          />
                        ) : (
                          <svg
                            className="h-4 w-4"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            ></path>
                          </svg>
                        )}
                      </div>
                      <span className="text-xs text-gray-700">
                        {fasilitas.nama_fasilitas}
                      </span>
                    </motion.div>
                  )
                )}
            </motion.div>
          )}

          {activeTab === "contact" &&
            data.penganggung_jawab_gedung &&
            data.penganggung_jawab_gedung.length > 0 && (
              <motion.div
                key="contact"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="space-y-2"
              >
                {data.penganggung_jawab_gedung.map(
                  (pj: PenanggungJawabGedung, index) => (
                    <motion.div
                      key={pj.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{
                        opacity: 1,
                        y: 0,
                        transition: { delay: index * 0.1 },
                      }}
                      className="bg-white/20 p-3 rounded-lg border flex justify-between items-center"
                    >
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-[#749C73] rounded-full flex items-center justify-center text-white font-semibold mr-3">
                          {pj.nama_penangguang_jawab.charAt(0)}
                        </div>
                        <div>
                          <div className="font-medium text-sm">
                            {pj.nama_penangguang_jawab}
                          </div>
                          <div className="text-xs text-gray-500">
                            Penanggung Jawab
                          </div>
                        </div>
                      </div>
                      <motion.a
                        href={`tel:${pj.no_hp}`}
                        className="text-[#749C73] flex items-center text-sm"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <svg
                          className="w-4 h-4 mr-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                          ></path>
                        </svg>
                        {pj.no_hp}
                      </motion.a>
                    </motion.div>
                  )
                )}
              </motion.div>
            )}
        </AnimatePresence>
      </div>
    </div>
  );
}
