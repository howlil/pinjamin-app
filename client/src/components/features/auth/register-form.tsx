import { useState } from "react";
import { useFormik } from "formik";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { registerSchema, type RegisterFormValues } from "@/validations/auth";
import PasswordInput from "@/components/ui/costum/password-input";
import TextInput from "@/components/ui/costum/text-input";
import SelectInput from "@/components/ui/costum/select-input";
import { AuthService } from "@/apis/auth";

const RegisterForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRegister = async (values: RegisterFormValues, setIsSubmitting: React.Dispatch<React.SetStateAction<boolean>>) => {
    try {
      setIsSubmitting(true);
      await AuthService.register(values);
    } catch (error) {
      throw error
    } finally {
      setIsSubmitting(false);
    }
  };

  const formik = useFormik<RegisterFormValues>({
    initialValues: {
      nama_lengkap: "",
      tipe_peminjam: "",
      no_hp: "",
      email: "",
      kata_sandi: "",
    },
    validationSchema: toFormikValidationSchema(registerSchema),
    onSubmit: (values) => handleRegister(values, setIsSubmitting),

  });

  const userTypeOptions = [
    { value: "INUNAND", label: "Civitas Academic Unand" },
    { value: "EXUNAND", label: "Non Civitas" },
  ];

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Daftar</h1>
        <p className="text-sm text-muted-foreground">
          Masukkan data pribadi Anda untuk mendaftar!
        </p>
      </div>

      <form onSubmit={formik.handleSubmit} className="space-y-4">
        <TextInput
          formik={formik}
          name="nama_lengkap"
          label="Nama Lengkap"
          placeholder="John Doe"
          required
        />

        <SelectInput
          formik={formik}
          name="tipe_peminjam"
          label="Tipe Pengguna"
          placeholder="Pilih tipe pengguna"
          options={userTypeOptions}
          required
        />

        <TextInput
          formik={formik}
          name="email"
          label="Email"
          type="email"
          placeholder="mail@example.com"
          required
        />

        <TextInput
          formik={formik}
          name="no_hp"
          label="Nomor HP"
          type="text"
          placeholder="081234567890"
          required
        />

        <PasswordInput
          formik={formik}
          name="kata_sandi"
          label="Password"
          required
        />

        <Button disabled={isSubmitting}>
          {isSubmitting ? "Memproses..." : "Daftar"}
        </Button>
      </form>

      <div className="text-center text-sm">
        Sudah punya akun?{" "}
        <Link to="/masuk" className="text-primary hover:underline">
          masuk
        </Link>
      </div>
    </div>
  );
};

export default RegisterForm;
