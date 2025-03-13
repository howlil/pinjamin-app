// src/features/auth/components/LoginForm.tsx
import { useState } from "react";
import { useFormik } from "formik";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { useMutation } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { loginSchema, type LoginFormValues } from "@/lib/validations/auth";
import PasswordInput from "@/components/ui/costum/password-input";

// Placeholder for API call
const loginUserApi = async (data: LoginFormValues) => {
  // This would be your actual API call
  return await new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true, user: { id: 1, email: data.email } });
    }, 1000);
  });
};

const LoginForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loginMutation = useMutation({
    mutationFn: loginUserApi,
    onSuccess: (data) => {
      // Handle successful login
      console.log("Login successful", data);
      // Redirect user or update auth state
    },
    onError: (error) => {
      // Handle login error
      console.error("Login failed", error);
    },
    onSettled: () => {
      setIsSubmitting(false);
    },
  });

  const formik = useFormik<LoginFormValues>({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: toFormikValidationSchema(loginSchema),
    onSubmit: (values) => {
      setIsSubmitting(true);
      loginMutation.mutate(values);
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
            <label htmlFor="password" className="text-sm font-medium">
              Password<span className="text-red-500">*</span>
            </label>
            <Link
              to="/lupa-password"
              className="text-sm text-primary hover:underline"
            >
              Lupa password?
            </Link>
          </div>
          <PasswordInput formik={formik} name="password" />
        </div>

        <Button   disabled={isSubmitting}>
          {isSubmitting ? "Memproses..." : "Masuk"}
        </Button>
      </form>

      <div className="text-center  text-sm">
        Belum punya akun?{" "}
        <Link to="/daftar" className="text-primary hover:underline">
          daftar
        </Link>
      </div>
    </div>
  );
};

export default LoginForm;
