import { useState, useEffect, FormEvent, ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { AuthService } from "@/apis/auth";
import TextInput from "@/components/ui/costum/input/text-input";
import PasswordInput from "@/components/ui/costum/input/password-input";
import { ErrorMessage } from "@/components/ui/costum/error-message";
import { useAuthStore } from "@/hooks/use-auth-store";

interface LoginFormState {
  email: string;
  password: string;
}

interface FormErrors {
  email?: string;
  password?: string;
  general?: string;
}

const LoginForm = () => {
  const [formData, setFormData] = useState<LoginFormState>({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.email) {
      newErrors.email = "Email tidak boleh kosong";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Format email tidak valid";
    }

    if (!formData.password) {
      newErrors.password = "Kata sandi tidak boleh kosong";
    } else if (formData.password.length < 8) {
      newErrors.password = "Kata sandi minimal 8 karakter";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) return;
    try {
      setIsSubmitting(true);
      const response = await AuthService.login({
        email: formData.email,
        kata_sandi: formData.password,
      });

      const { pengguna, token } = response.data;
      setAuth({ pengguna, token });
      localStorage.setItem("auth-token",token)

      if (pengguna.role === "ADMIN") {
        navigate("/admin/dashboard");
      } else {
        navigate("/");
      }
    } catch (error: any) {
      console.error("Login error:", error);
      setErrors({
        general:
          error?.response?.data?.message || "Terjadi kesalahan saat login",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Masuk</h1>
        <p className="text-sm text-muted-foreground">
          Masukkan email dan kata sandi Anda untuk masuk!
        </p>
      </div>

      {errors.general && <ErrorMessage message={errors.general} />}

      <form onSubmit={handleSubmit} className="space-y-5">
        <TextInput
          name="email"
          value={formData.email}
          onChange={handleChange}
          label="Email"
          type="email"
          placeholder="Masukkan email Anda"
          required
          error={errors.email}
        />

        <PasswordInput
          name="password"
          value={formData.password}
          onChange={handleChange}
          label="Kata Sandi"
          placeholder="Masukkan kata sandi Anda"
          required
          error={errors.password}
        />

        <Button type="submit" className="w-full mt-4" disabled={isSubmitting}>
          {isSubmitting ? "Memproses..." : "Masuk"}
        </Button>
      </form>

      <div className="text-center text-sm">
        Belum punya akun?{" "}
        <Link to="/daftar" className="text-primary hover:underline">
          Daftar
        </Link>
      </div>
    </div>
  );
};

export default LoginForm;
