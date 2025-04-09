import { Button } from "@/components/ui/button";
import { useFormik } from "formik";
import TextInput from "@/components/ui/costum/text-input";
import { useState } from "react";
import { GedungService } from "@/apis/gedung";
import { ResCheckAvailable } from "@/interfaces/IGedung";
import AvailableRoomsDialog from "./available-rooms-dialog";

const CheckRuangan = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [availableRooms, setAvailableRooms] = useState<ResCheckAvailable[]>([]);

  const formik = useFormik({
    initialValues: {
      tanggalMulai: "",
      jamMulai: "",
    },
    validate: (values) => {
      const errors: any = {};
      if (!values.tanggalMulai) {
        errors.tanggalMulai = "Tanggal diperlukan";
      }
      if (!values.jamMulai) {
        errors.jamMulai = "Jam diperlukan";
      }
      return errors;
    },
    onSubmit: async (values) => {
      try {
        setIsLoading(true);

        const result = await GedungService.checkAvailibility(values);

        setAvailableRooms(Array.isArray(result) ? result : []);
        setShowResults(true);
      } catch (error) {
        console.error("Error checking availability:", error);
        setAvailableRooms([]);
      } finally {
        setIsLoading(false);
      }
    },
  });

  return (
    <div className="relative z-10">
      <section className="py-8">
        <h1 className="text-4xl  font-bold leading-11 bg-gradient-to-r from-[#749C73] to-[#B7F6B5] bg-clip-text text-transparent">
          Sewa Gedung dengan Mudah, Cepat, dan Praktis di Universitas Andalas{" "}
        </h1>
        <p className="text-lg leading-6 text-gray-400 mt-3">
          Jadikan acara Anda berkesan dengan ruang yang tepat – mudah diakses,
          sesuai anggaran, dan siap mendukung kesuksesan acara Anda!{" "}
        </p>
      </section>

      <section className="rounded-3xl shadow-xl p-4 space-y-4 backdrop-blur-sm bg-white/5 border border-[#ededed]/10 relative overflow-hidden">
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-[#B7F6B5]/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-[#749C73]/20 rounded-full blur-3xl"></div>

        <h3 className="text-2xl font-semibold text-[#183512]">
          Cek Ruangan Tersedia
        </h3>
        <div className="grid grid-cols-2 gap-6">
          <TextInput
            formik={formik}
            label="Tanggal"
            name="tanggalMulai"
            type="date"
            required
          />

          <TextInput
            formik={formik}
            label="Jam Mulai"
            name="jamMulai"
            type="time"
            required
          />
        </div>

        <Button
          onClick={() => formik.handleSubmit()}
          disabled={
            isLoading || !formik.values.tanggalMulai || !formik.values.jamMulai
          }
        >
          {isLoading ? (
            <span className="flex items-center justify-center">
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Memeriksa...
            </span>
          ) : (
            "Cek Ketersediaan"
          )}
        </Button>
      </section>

      <AvailableRoomsDialog
        open={showResults}
        onOpenChange={setShowResults}
        availableRooms={availableRooms}
      />
    </div>
  );
};

export default CheckRuangan;
