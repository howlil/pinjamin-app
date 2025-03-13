import AuthLayout from "@/components/layouts/auth-layout";
import RegisterForm from "@/components/features/auth/components/register-form";
import LoginForm from "@/components/features/auth/components/login-form";
import { useLocation, Navigate } from "react-router-dom";
import bgimage from "@/assets/bg-unand.png";

export default function AuthPage() {
  const location = useLocation();
  const path = location.pathname;

  return (
    <AuthLayout backgroundImage={bgimage}>
      {path === "/daftar" && <RegisterForm />}
      {path === "/masuk" && <LoginForm />}
      {path !== "/daftar" && path !== "/masuk" && (
        <Navigate to="/masuk" replace />
      )}
    </AuthLayout>
  );
}
