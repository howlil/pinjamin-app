
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useState } from "react";

const LoginForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);


 

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Masuk</h1>
        <p className="text-sm text-muted-foreground">
          Masukkan email dan kata sandi Anda untuk masuk!
        </p>
      </div>


      <form  className="space-y-4">
     

      
        <Button  className="w-full" >
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
