import { Button } from "@/components/ui/button";
import { useFormik } from "formik";
import TextInput from "@/components/ui/costum/text-input";

const CheckRuangan = () => {
  const formik = useFormik({
    initialValues: {
      tanggal: "",
      jam: "",
    },
    onSubmit: (values) => {
        
    },
  });

  return (
    <div>
      <section className="py-6">
        <h1 className="text-3xl font-bold   leading-tight">
          Temukan & Sewa Gedung Ideal untuk Acara Anda
        </h1>
        <p className="text-base text-gray-600 mt-2">
          Mudah, Cepat, dan Praktis – Peminjaman Gedung Universitas Andalas
        </p>
      </section>

      <section className=" rounded-2xl shadow-lg p-4 space-y-6 backdrop-blur-sm bg-white/90">
        <h3 className="text-xl font-semibold">Cek Ruangan Rapat</h3>
        <div className="grid grid-cols-2 gap-2">
          <TextInput
            formik={formik}
            label="Tanggal"
            name="tanggal"
            type="date"
            required
          />

          <TextInput
            formik={formik}
            label="Jam"
            name="jam"
            type="time"
            required
          />
        </div>

        {/* Submit Button */}
        <Button onClick={() => formik.handleSubmit()}>Cek Ketersedian</Button>
      </section>
    </div>
  );
};

export default CheckRuangan;
