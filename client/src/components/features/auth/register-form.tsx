// src/features/auth/components/RegisterForm.tsx
import { useState } from "react";
import { useFormik } from "formik";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { registerSchema, type RegisterFormValues } from "@/validations/auth";
import PasswordInput from "@/components/ui/costum/password-input";
import TextInput from "@/components/ui/costum/text-input";
import SelectInput from "@/components/ui/costum/select-input";

;

const RegisterForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

 

  const formik = useFormik<RegisterFormValues>({
    initialValues: {
      namaLengkap: "",
      tipePengguna: "",
      email: "",
      password: ""
    },
    validationSchema: toFormikValidationSchema(registerSchema),
    onSubmit: (values) => {
      setIsSubmitting(true);
    }
  });

  const userTypeOptions = [
    { value: "personal", label: "Personal" },
    { value: "bisnis", label: "Bisnis" },
    { value: "lainnya", label: "Lainnya" }
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
          name="namaLengkap"
          label="Nama Lengkap"
          placeholder="John Doe"
          required
        />

        <SelectInput
          formik={formik}
          name="tipePengguna"
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

        <PasswordInput
          formik={formik}
          name="password"
          label="Password"
          required
        />

        <Button 
          
          disabled={isSubmitting}
        >
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