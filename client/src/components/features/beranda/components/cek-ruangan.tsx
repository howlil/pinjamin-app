import { useState, FormEvent, ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import TextInput from "@/components/ui/costum/input/text-input";
import { GedungService } from "@/apis/gedung";
import { ResCheckAvailable, CheckAvailable } from "@/apis/interfaces/IGedung";
import AvailableRoomsDialog from "./available-rooms-dialog";
import { CalendarIcon, Clock } from "lucide-react";

/**
 * CheckRuangan component for checking room availability
 * Based on date and time inputs provided by the user
 */
const CheckRuangan = () => {
  // State for form fields
  const [formData, setFormData] = useState<CheckAvailable>({
    tanggalMulai: "",
    jamMulai: "",
  });

  // State for UI control
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [availableRooms, setAvailableRooms] = useState<ResCheckAvailable[]>([]);
  const [error, setError] = useState<string | null>(null);

  /**
   * Handle input change for form fields
   */
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Clear error when user is typing
    if (error) setError(null);
  };

  /**
   * Validate form inputs before submission
   */
  const validateForm = (): boolean => {
    if (!formData.tanggalMulai) {
      setError("Tanggal tidak boleh kosong");
      return false;
    }
    
    if (!formData.jamMulai) {
      setError("Waktu tidak boleh kosong");
      return false;
    }
    
    return true;
  };

  /**
   * Handle form submission to check room availability
   */
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      setIsLoading(true);
      setError(null);
      
      // Call API to check room availability
      const rooms = await GedungService.checkAvailibility(formData);
      
      // Update state with results
      setAvailableRooms(rooms);
      setShowResults(true);
      
    } catch (error) {
      console.error("Error checking availability:", error);
      setError("Terjadi kesalahan saat memeriksa ketersediaan ruangan");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative z-10">
      <section className="py-8">
        <h1 className="text-4xl font-bold leading-11 bg-gradient-to-r from-[#749C73] to-[#B7F6B5] bg-clip-text text-transparent">
          Sewa Gedung dengan Mudah, Cepat, dan Praktis di Universitas Andalas
        </h1>
        <p className="text-lg leading-6 text-gray-400 mt-3">
          Jadikan acara Anda berkesan dengan ruang yang tepat – mudah diakses,
          sesuai anggaran, dan siap mendukung kesuksesan acara Anda!
        </p>
      </section>

      <section className="rounded-xl shadow-sm p-6 space-y-5 backdrop-blur-sm bg-white/5 border border-[#ededed]/10 relative overflow-hidden">
        <h3 className="text-2xl font-semibold text-[#183512]">
          Cek Ruangan Tersedia
        </h3>
        
        {error && (
          <div className="p-3 rounded-md bg-red-50 text-red-500 text-sm">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-5">
            <div className="relative">
              <TextInput
                name="tanggalMulai"
                value={formData.tanggalMulai}
                onChange={handleInputChange}
                label="Tanggal"
                type="date"
                placeholder="mm/dd/yy"
                className="pl-10"
              />
              <CalendarIcon className="absolute left-3 top-[38px] h-4 w-4 text-gray-400" />
            </div>
            
            <div className="relative">
              <TextInput
                name="jamMulai"
                value={formData.jamMulai}
                onChange={handleInputChange}
                label="Waktu"
                type="time"
                placeholder="hr/mn"
                className="pl-10"
              />
              <Clock className="absolute left-3 top-[38px] h-4 w-4 text-gray-400" />
            </div>
          </div>
          
          <Button 
            type="submit" 
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Memeriksa...
              </span>
            ) : (
              "Cek Ketersediaan"
            )}
          </Button>
        </form>
      </section>

      <AvailableRoomsDialog
        open={showResults}
        onOpenChange={setShowResults}
        availableRooms={availableRooms}
      />
    </div>
  );
};

export default CheckRuangan;