import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import PasswordInput from "@/components/ui/costum/input/password-input";
import TextInput from "@/components/ui/costum/input/text-input";
import SelectInput from "@/components/ui/costum/input/select-input";

const RegisterForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);



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

      <form  className="space-y-4">
   

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
