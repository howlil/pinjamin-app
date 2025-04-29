import { useState, FormEvent, ChangeEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import PasswordInput from "@/components/ui/costum/input/password-input";
import TextInput from "@/components/ui/costum/input/text-input";
import SelectInput from "@/components/ui/costum/input/select-input";
import { ErrorMessage } from "@/components/ui/costum/error-message";
import { AuthService } from "@/apis/auth";
import { useAuthStore } from "@/hooks/use-auth-store";

// Define interface for form fields and errors
interface RegisterFormState {
  nama_lengkap: string;
  tipe_peminjam: string;
  email: string;
  kata_sandi: string;
  no_hp: string;
}

interface FormErrors {
  nama_lengkap?: string;
  tipe_peminjam?: string;
  email?: string;
  kata_sandi?: string;
  no_hp?: string;
  general?: string;
}

const RegisterForm = () => {
  // State management
  const [formData, setFormData] = useState<RegisterFormState>({
    nama_lengkap: "",
    tipe_peminjam: "INUNAND", // Default value
    email: "",
    kata_sandi: "",
    no_hp: "",
  });
  
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  
  // Hooks
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  // User type options from the requirement
  const userTypeOptions = [
    { value: "INUNAND", label: "Civitas Akademis Unand" },
    { value: "EXUNAND", label: "Non Civitas" },
  ];

  // Form input change handler for text and password inputs
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Clear error for the field being edited
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  // Form input change handler for select input
  const handleSelectChange = (name: string) => (value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Clear error for the field being edited
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  // Form validation
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    // Name validation
    if (!formData.nama_lengkap) {
      newErrors.nama_lengkap = "Nama lengkap tidak boleh kosong";
    }
    
    // Type validation
    if (!formData.tipe_peminjam) {
      newErrors.tipe_peminjam = "Tipe peminjam harus dipilih";
    }
    
    // Email validation
    if (!formData.email) {
      newErrors.email = "Email tidak boleh kosong";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Format email tidak valid";
    }
    
    // Password validation
    if (!formData.kata_sandi) {
      newErrors.kata_sandi = "Kata sandi tidak boleh kosong";
    } else if (formData.kata_sandi.length < 8) {
      newErrors.kata_sandi = "Kata sandi minimal 8 karakter";
    }
    
    // Phone validation
    if (!formData.no_hp) {
      newErrors.no_hp = "Nomor handphone tidak boleh kosong";
    } else if (!/^[0-9]{10,13}$/.test(formData.no_hp)) {
      newErrors.no_hp = "Format nomor handphone tidak valid";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Form submission handler
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      setIsSubmitting(true);
      
      const response = await AuthService.register({
        nama_lengkap: formData.nama_lengkap,
        email: formData.email,
        kata_sandi: formData.kata_sandi,
        no_hp: formData.no_hp,
        tipe_peminjam: formData.tipe_peminjam,
      });
      
      // Show success and redirect to login
      navigate("/masuk");
      
    } catch (error: any) {
      console.error("Registration error:", error);
      setErrors({
        general: error?.response?.data?.message || "Terjadi kesalahan saat mendaftar"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Daftar</h1>
        <p className="text-sm text-muted-foreground">
          Masukkan data pribadi Anda untuk mendaftar!
        </p>
      </div>

      {errors.general && <ErrorMessage message={errors.general} />}

      <form onSubmit={handleSubmit} className="space-y-4">
        <TextInput
          name="nama_lengkap"
          value={formData.nama_lengkap}
          onChange={handleChange}
          label="Nama Lengkap"
          placeholder="John Doe"
          required
          error={errors.nama_lengkap}
        />
        
        <SelectInput
          name="tipe_peminjam"
          value={formData.tipe_peminjam}
          onChange={handleSelectChange("tipe_peminjam")}
          label="Tipe Peminjam"
          options={userTypeOptions}
          placeholder="Pilih tipe peminjam"
          required
          error={errors.tipe_peminjam}
        />
        
        <TextInput
          name="email"
          value={formData.email}
          onChange={handleChange}
          label="Email"
          type="email"
          placeholder="your.email@example.com"
          required
          error={errors.email}
        />
        
        <PasswordInput
          name="kata_sandi"
          value={formData.kata_sandi}
          onChange={handleChange}
          label="Password"
          placeholder="Min. 8 characters"
          required
          minLength={8}
          error={errors.kata_sandi}
        />
        
        <TextInput
          name="no_hp"
          value={formData.no_hp}
          onChange={handleChange}
          label="Nomor Handphone"
          type="tel"
          placeholder="08xxxxxxxxxx"
          required
          error={errors.no_hp}
        />
   
        <Button type="submit" className="w-full" disabled={isSubmitting}>
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