import { FC, useState, useEffect, ChangeEvent, FormEvent } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import TextInput from "@/components/ui/costum/input/text-input";
import TextAreaInput from "@/components/ui/costum/input/text-area-input";
import SelectInput, { SelectOption } from "@/components/ui/costum/input/select-input";
import { GedungExtended, extendGedung ,GedungCreate, GedungUpdate } from "@/apis/interfaces/IGedung";
import { Upload, X } from "lucide-react";
import { motion } from "framer-motion";
import { TipeGedung } from "@/apis/interfaces/ITipeGedung";

interface GedungFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: GedungCreate | GedungUpdate) => void;
  initialData?: GedungExtended | null;
  title: string;
  buildingTypes: TipeGedung[];
}

interface FormErrors {
  [key: string]: string;
}

/**
 * GedungFormDialog - Dialog form with glassmorphism effect
 * for creating and editing buildings
 */
const GedungFormDialog: FC<GedungFormDialogProps> = ({
  open,
  onOpenChange,
  onSubmit,
  initialData,
  title,
  buildingTypes,
}) => {
  const isEditMode = !!initialData;
  
  // Form state
  const [formData, setFormData] = useState<GedungCreate | GedungUpdate>({
    nama_gedung: "",
    deskripsi: "",
    harga_sewa: 0,
    kapasitas: 0,
    foto_gedung: null,
    lokasi: "",
    tipe_gedung_id: "",
    penanggung_jawab_gedung: [{ nama_penangguang_jawab: "", no_hp: "" }],
    fasilitas_gedung: [{ nama_fasilitas: "", icon_url: "" }],
  });
  
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  // Initialize form data with existing data in edit mode
  useEffect(() => {
    if (isEditMode && initialData) {
      const extended = initialData;
      
      setFormData({
        nama_gedung: extended.nama_gedung || "",
        deskripsi: extended.deskripsi || "",
        harga_sewa: extended.harga_sewa || 0,
        kapasitas: extended.kapasitas || 0,
        foto_gedung: extended.foto_gedung || null,
        lokasi: extended.lokasi || "",
        tipe_gedung_id: extended.tipe_gedung_id || "",
        penanggung_jawab_gedung: extended.penganggung_jawab_gedung?.map(pj => ({
          nama_penangguang_jawab: pj.nama_penangguang_jawab,
          no_hp: pj.no_hp
        })) || [{ nama_penangguang_jawab: "", no_hp: "" }],
        fasilitas_gedung: extended.FasilitasGedung?.map(f => ({
          nama_fasilitas: f.nama_fasilitas,
          icon_url: f.icon_url || ""
        })) || [{ nama_fasilitas: "", icon_url: "" }]
      });
      
      if (extended.foto_gedung) {
        setImagePreview(`${import.meta.env.VITE_API_URL}/foto/${extended.foto_gedung}`);
      }
    }
  }, [initialData, isEditMode]);
  
  // Handle text input changes
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    // Handle number inputs
    if (type === 'number') {
      setFormData({
        ...formData,
        [name]: value === '' ? 0 : Number(value)
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };
  
  // Handle select input changes
  const handleSelectChange = (name: string) => (value: string) => {
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };
  
  // Handle file uploads
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    
    if (file) {
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      
      // Handle file upload logic
      // For the purpose of this demo, we'll just update the form data
      // In a real app, you'd handle the file upload separately
      setFormData({
        ...formData,
        foto_gedung: file.name
      });
    }
  };
  
  // Form validation
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    // Required fields
    if (!formData.nama_gedung) {
      newErrors.nama_gedung = "Nama gedung harus diisi";
    }
    
    if (!formData.deskripsi) {
      newErrors.deskripsi = "Deskripsi harus diisi";
    }
    
    if (!formData.lokasi) {
      newErrors.lokasi = "Lokasi harus diisi";
    }
    
    if (!formData.tipe_gedung_id) {
      newErrors.tipe_gedung_id = "Tipe gedung harus dipilih";
    }
    
    if (formData.harga_sewa <= 0) {
      newErrors.harga_sewa = "Harga sewa harus lebih dari 0";
    }
    
    if (formData.kapasitas <= 0) {
      newErrors.kapasitas = "Kapasitas harus lebih dari 0";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Handle form submission
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    // Clean up empty fields and prepare for submission
    const submissionData = {
      ...formData,
      penanggung_jawab_gedung: [
        {
          nama_penangguang_jawab: formData.penanggung_jawab_gedung?.[0]?.nama_penangguang_jawab || "",
          no_hp: formData.penanggung_jawab_gedung?.[0]?.no_hp || ""
        }
      ],
      fasilitas_gedung: [
        {
          nama_fasilitas: formData.fasilitas_gedung?.[0]?.nama_fasilitas || "",
          icon_url: formData.fasilitas_gedung?.[0]?.icon_url || ""
        }
      ]
    };
    
    onSubmit(submissionData);
    
    // Reset submission state after brief delay to see the loading state
    setTimeout(() => {
      setIsSubmitting(false);
      onOpenChange(false);
    }, 500);
  };
  
  // Convert building types to select options
  const buildingTypeOptions: SelectOption[] = buildingTypes.map(type => ({
    value: type.id,
    label: type.nama_tipe_gedung
  }));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto bg-white/50 backdrop-blur-md border border-white/20 shadow-lg">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <DialogHeader className="mb-4">
            <DialogTitle className="text-xl font-semibold text-gray-800">
              {title}
            </DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <TextInput
              name="nama_gedung"
              value={formData.nama_gedung || ""}
              onChange={handleChange}
              label="Nama Gedung"
              placeholder="Masukkan nama gedung"
              required
              error={errors.nama_gedung}
            />
            
            <TextAreaInput
              name="deskripsi"
              value={formData.deskripsi || ""}
              onChange={handleChange}
              label="Deskripsi"
              placeholder="Masukkan deskripsi gedung"
              required
              error={errors.deskripsi}
              rows={3}
            />
            
            <TextInput
              name="penanggungjawab"
              value={formData.penanggung_jawab_gedung?.[0]?.nama_penangguang_jawab || ""}
              onChange={(e) => {
                const value = e.target.value;
                setFormData(prev => ({
                  ...prev,
                  penanggung_jawab_gedung: [{
                    nama_penangguang_jawab: value,
                    no_hp: prev.penanggung_jawab_gedung?.[0]?.no_hp || ""
                  }]
                }));
              }}
              label="Penanggung Jawab"
              placeholder="Masukkan nama penanggung jawab"
            />
            
            <TextInput
              name="no_hp"
              value={formData.penanggung_jawab_gedung?.[0]?.no_hp || ""}
              onChange={(e) => {
                const value = e.target.value;
                setFormData(prev => ({
                  ...prev,
                  penanggung_jawab_gedung: [{
                    nama_penangguang_jawab: prev.penanggung_jawab_gedung?.[0]?.nama_penangguang_jawab || "",
                    no_hp: value
                  }]
                }));
              }}
              label="Nomor HP Penanggung Jawab"
              placeholder="Masukkan nomor HP"
            />
            
            <TextInput
              name="fasilitas"
              value={formData.fasilitas_gedung?.[0]?.nama_fasilitas || ""}
              onChange={(e) => {
                const value = e.target.value;
                setFormData(prev => ({
                  ...prev,
                  fasilitas_gedung: [{
                    nama_fasilitas: value,
                    icon_url: prev.fasilitas_gedung?.[0]?.icon_url || ""
                  }]
                }));
              }}
              label="Fasilitas Gedung"
              placeholder="Masukkan fasilitas gedung"
            />
            
            <div className="grid grid-cols-2 gap-4">
              <TextInput
                name="harga_sewa"
                value={String(formData.harga_sewa || 0)}
                onChange={handleChange}
                label="Harga Sewa (Rp)"
                type="number"
                placeholder="Masukkan harga sewa"
                required
                error={errors.harga_sewa}
              />
              
              <TextInput
                name="kapasitas"
                value={String(formData.kapasitas || 0)}
                onChange={handleChange}
                label="Kapasitas"
                type="number"
                placeholder="Masukkan kapasitas"
                required
                error={errors.kapasitas}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <TextInput
                name="lokasi"
                value={formData.lokasi || ""}
                onChange={handleChange}
                label="Lokasi"
                placeholder="Masukkan lokasi"
                required
                error={errors.lokasi}
              />
              
              <SelectInput
                name="tipe_gedung_id"
                value={formData.tipe_gedung_id || ""}
                onChange={handleSelectChange("tipe_gedung_id")}
                label="Tipe Gedung"
                options={buildingTypeOptions}
                placeholder="Pilih tipe gedung"
                required
                error={errors.tipe_gedung_id}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Foto Gedung</label>
              
              <div className="flex items-center gap-4">
                <div 
                  className="w-32 h-32 border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50/50"
                  onClick={() => document.getElementById("foto_gedung")?.click()}
                >
                  <input
                    id="foto_gedung"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                  
                  {imagePreview ? (
                    <div className="relative w-full h-full">
                      <img 
                        src={imagePreview} 
                        alt="Preview" 
                        className="w-full h-full object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                        onClick={(e) => {
                          e.stopPropagation();
                          setImagePreview(null);
                          setFormData({
                            ...formData,
                            foto_gedung: null
                          });
                        }}
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ) : (
                    <>
                      <Upload className="w-6 h-6 text-gray-400 mb-1" />
                      <span className="text-xs text-gray-500">Upload</span>
                    </>
                  )}
                </div>
                
                {!imagePreview && (
                  <div className="text-xs text-gray-500">
                    Klik untuk upload foto gedung
                  </div>
                )}
              </div>
            </div>
            
            <DialogFooter className="mt-6 flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                Batal
              </Button>
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="bg-main-green hover:bg-green-800"
              >
                {isSubmitting ? "Menyimpan..." : "Simpan Data"}
              </Button>
            </DialogFooter>
          </form>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};

export default GedungFormDialog;