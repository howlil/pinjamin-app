import { useState } from "react";
import { useFormik } from "formik";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { Link, useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { loginSchema, type LoginFormValues } from "@/validations/auth";
import PasswordInput from "@/components/ui/costum/password-input";
import { AuthService } from "@/apis/auth";

const LoginForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const formik = useFormik<LoginFormValues>({
    initialValues: {
      email: "",
      kata_sandi: "",
    },
    validationSchema: toFormikValidationSchema(loginSchema),
    onSubmit: async (values) => {
      try {
        setIsSubmitting(true);
        setError(null);
        
        const response = await AuthService.login(values);
        
        if (response.data.token) {
          localStorage.setItem("auth_token", response.data.token);
          
          // Redirect to dashboard or home page after successful login
          navigate("/dashboard");
        }
      } catch (err: any) {
        setError(err.response?.data?.message || "Login failed. Please try again.");
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Masuk</h1>
        <p className="text-sm text-muted-foreground">
          Masukkan email dan kata sandi Anda untuk masuk!
        </p>
      </div>

      {error && (
        <div className="p-3 rounded-md bg-red-50 text-red-500 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={formik.handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium">
            Email<span className="text-red-500">*</span>
          </label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="mail@example.com"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.email}
            className={
              formik.touched.email && formik.errors.email
                ? "border-red-500 focus-visible:ring-red-500"
                : ""
            }
          />
          {formik.touched.email && formik.errors.email && (
            <p className="text-sm text-red-500">{formik.errors.email}</p>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label htmlFor="kata_sandi" className="text-sm font-medium">
              Password<span className="text-red-500">*</span>
            </label>
            <Link
              to="/lupa-password"
              className="text-sm text-primary hover:underline"
            >
              Lupa password?
            </Link>
          </div>
          <PasswordInput formik={formik} name="kata_sandi" />
        </div>

        <Button type="submit" className="w-full" disabled={isSubmitting}>
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