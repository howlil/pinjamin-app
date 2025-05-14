import { FC, useState, useEffect, ChangeEvent, FormEvent } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TextInput from "@/components/ui/costum/input/text-input";
import TextAreaInput from "@/components/ui/costum/input/text-area-input";
import SelectInput, { SelectOption } from "@/components/ui/costum/input/select-input";
import { GedungCreate, GedungUpdate, Gedung } from "@/apis/interfaces/IGedung";
import { TipeGedung } from "@/apis/interfaces/ITipeGedung";
import { Fasilitas } from "@/apis/interfaces/IFasilitasGedung";
import { PenanggungJawabGedung } from "@/apis/interfaces/IPenanggungJawabGedung";
import { Upload, X, ChevronLeft, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";

interface GedungFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: GedungCreate | GedungUpdate) => void;
  onFileSelect: (file: File | null) => void;
  initialData?: Gedung | null;
  title: string;
  buildingTypes: TipeGedung[];
  facilities: Fasilitas[];
  responsiblePersons?: PenanggungJawabGedung[];
}

interface FormErrors {
  [key: string]: string;
}

// Define proper types for facilities and responsible persons
type FacilityItem = string | { id: string; nama_fasilitas?: string; icon_url?: string };
type ResponsiblePersonItem = string | { id: string; nama_penangguang_jawab?: string; no_hp?: string };

// Extend the Gedung interface to include the missing properties
interface ExtendedGedung extends Gedung {
  deskripsi?: string;
  lokasi?: string;
  tipe_gedung_id?: string;
  fasilitas_gedung?: FacilityItem[];
  penanggung_jawab_gedung?: ResponsiblePersonItem[];
}

/**
 * GedungFormDialog - Enhanced form dialog with tabs and better UI
 */
const GedungFormDialog: FC<GedungFormDialogProps> = ({
  open,
  onOpenChange,
  onSubmit,
  onFileSelect,
  initialData,
  title,
  buildingTypes,
  facilities,
  responsiblePersons = [],
}) => {
  const isEditMode = !!initialData;

  // Tabs configuration
  const tabs = ["basic", "facilities", "responsible", "photo"];
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const activeTab = tabs[activeTabIndex];

  // Form state
  const [formData, setFormData] = useState<GedungCreate>({
    nama_gedung: "",
    deskripsi: "",
    harga_sewa: 0,
    kapasitas: 0,
    foto_gedung: null,
    lokasi: "",
    tipe_gedung_id: "",
    penanggung_jawab_gedung: [],
    fasilitas_gedung: [],
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedFacilities, setSelectedFacilities] = useState<string[]>([]);
  const [selectedResponsiblePersons, setSelectedResponsiblePersons] = useState<string[]>([]);

  // Initialize form data with existing data in edit mode
  useEffect(() => {
    if (open) {
      if (isEditMode && initialData) {
        const extendedData = initialData as ExtendedGedung;
        setFormData({
          nama_gedung: extendedData.nama_gedung || "",
          deskripsi: extendedData.deskripsi || "",
          harga_sewa: extendedData.harga_sewa || 0,
          kapasitas: extendedData.kapasitas || 0,
          foto_gedung: extendedData.foto_gedung || null,
          lokasi: extendedData.lokasi || "",
          tipe_gedung_id: extendedData.tipe_gedung_id || "",
          penanggung_jawab_gedung: [],
          fasilitas_gedung: [],
        });

        // Handle facilities - check if they're IDs or objects
        if (extendedData.fasilitas_gedung && Array.isArray(extendedData.fasilitas_gedung)) {
          const facilityIds = extendedData.fasilitas_gedung.map((item: FacilityItem) => {
            if (typeof item === 'string') return item;
            if (typeof item === 'object' && item && 'id' in item) return item.id;
            return null;
          }).filter(Boolean) as string[];
          setSelectedFacilities(facilityIds);
        }

        // Handle responsible persons - check if they're IDs or objects
        if (extendedData.penanggung_jawab_gedung && Array.isArray(extendedData.penanggung_jawab_gedung)) {
          const personIds = extendedData.penanggung_jawab_gedung.map((item: ResponsiblePersonItem) => {
            if (typeof item === 'string') return item;
            if (typeof item === 'object' && item && 'id' in item) return item.id;
            return null;
          }).filter(Boolean) as string[];
          setSelectedResponsiblePersons(personIds);
        }

        if (extendedData.foto_gedung) {
          setImagePreview(`${import.meta.env.VITE_API_URL}/foto/${extendedData.foto_gedung}`);
        }
      } else {
        // Reset form for create mode
        setFormData({
          nama_gedung: "",
          deskripsi: "",
          harga_sewa: 0,
          kapasitas: 0,
          foto_gedung: null,
          lokasi: "",
          tipe_gedung_id: "",
          penanggung_jawab_gedung: [],
          fasilitas_gedung: [],
        });
        setImagePreview(null);
      }
      setErrors({});
      setActiveTabIndex(0); // Reset to first tab

      // Only reset if not in edit mode
      if (!isEditMode) {
        setSelectedFacilities([]);
        setSelectedResponsiblePersons([]);
      }
    }
  }, [initialData, isEditMode, open]);

  // Handle text input changes
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;

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
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors({ ...errors, foto_gedung: "Ukuran file maksimal 5MB" });
        return;
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        setErrors({ ...errors, foto_gedung: "File harus berupa gambar" });
        return;
      }

      onFileSelect(file);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      // Clear error
      if (errors.foto_gedung) {
        setErrors({ ...errors, foto_gedung: '' });
      }
    }
  };

  // Handle facility selection
  const handleFacilityToggle = (facilityId: string) => {
    setSelectedFacilities(prev => {
      if (prev.includes(facilityId)) {
        return prev.filter(id => id !== facilityId);
      } else {
        return [...prev, facilityId];
      }
    });
  };

  // Handle responsible person selection
  const handleResponsiblePersonToggle = (personId: string) => {
    setSelectedResponsiblePersons(prev => {
      if (prev.includes(personId)) {
        return prev.filter(id => id !== personId);
      } else {
        return [...prev, personId];
      }
    });
  };

  // Validate current tab
  const validateCurrentTab = (): boolean => {
    const newErrors: FormErrors = {};

    if (activeTab === "basic") {
      if (!formData.nama_gedung.trim()) {
        newErrors.nama_gedung = "Nama gedung harus diisi";
      }

      if (!formData.deskripsi.trim()) {
        newErrors.deskripsi = "Deskripsi harus diisi";
      }

      if (!formData.lokasi.trim()) {
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
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle tab navigation
  const goToNextTab = () => {
    if (validateCurrentTab() && activeTabIndex < tabs.length - 1) {
      setActiveTabIndex(activeTabIndex + 1);
    }
  };

  const goToPreviousTab = () => {
    if (activeTabIndex > 0) {
      setActiveTabIndex(activeTabIndex - 1);
    }
  };

  // Handle form submission
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validateCurrentTab()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare submission data with proper types
      const submissionData: GedungCreate = {
        ...formData,
        fasilitas_gedung: selectedFacilities.map(id => ({ fasilitas_id: id })),
        penanggung_jawab_gedung: selectedResponsiblePersons.map(id => ({ penanggung_jawab_id: id }))
      };

      // Remove any undefined or null values
      Object.keys(submissionData).forEach(key => {
        const typedKey = key as keyof typeof submissionData;
        if (submissionData[typedKey] === undefined || submissionData[typedKey] === null) {
          delete submissionData[typedKey];
        }
      });

      await onSubmit(submissionData);

      setTimeout(() => {
        setIsSubmitting(false);
        if (open) {
          onOpenChange(false);
        }
      }, 500);
    } catch (error) {
      console.error("Error submitting form:", error);
      setIsSubmitting(false);
    }
  };

  // Convert building types to select options
  const buildingTypeOptions: SelectOption[] = buildingTypes.map(type => ({
    value: type.id,
    label: type.nama_tipe_gedung
  }));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="mb-4">
          <DialogTitle className="text-xl font-semibold text-gray-800">{title}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <Tabs value={activeTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="basic" onClick={() => setActiveTabIndex(0)}>Informasi Dasar</TabsTrigger>
              <TabsTrigger value="facilities" onClick={() => activeTabIndex >= 1 && setActiveTabIndex(1)} disabled={activeTabIndex < 1}>Fasilitas</TabsTrigger>
              <TabsTrigger value="responsible" onClick={() => activeTabIndex >= 2 && setActiveTabIndex(2)} disabled={activeTabIndex < 2}>Penanggung Jawab</TabsTrigger>
              <TabsTrigger value="photo" onClick={() => activeTabIndex >= 3 && setActiveTabIndex(3)} disabled={activeTabIndex < 3}>Foto</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className={activeTab === "basic" ? "space-y-4 mt-4" : "hidden"}>
              <div className="grid grid-cols-2 gap-4">
                <TextInput name="nama_gedung" value={formData.nama_gedung} onChange={handleChange} label="Nama Gedung" placeholder="Masukkan nama gedung" required error={errors.nama_gedung} />
                <SelectInput name="tipe_gedung_id" value={formData.tipe_gedung_id} onChange={handleSelectChange("tipe_gedung_id")} label="Tipe Gedung" options={buildingTypeOptions} placeholder="Pilih tipe gedung" required error={errors.tipe_gedung_id} />
              </div>

              <TextAreaInput name="deskripsi" value={formData.deskripsi} onChange={handleChange} label="Deskripsi" placeholder="Masukkan deskripsi gedung" required error={errors.deskripsi} rows={3} />

              <div className="grid grid-cols-2 gap-4">
                <TextInput name="harga_sewa" value={String(formData.harga_sewa || "")} onChange={handleChange} label="Harga Sewa (Rp)" type="number" placeholder="0" required error={errors.harga_sewa} />
                <TextInput name="kapasitas" value={String(formData.kapasitas || "")} onChange={handleChange} label="Kapasitas (orang)" type="number" placeholder="0" required error={errors.kapasitas} />
              </div>

              <TextInput name="lokasi" value={formData.lokasi} onChange={handleChange} label="Lokasi" placeholder="Masukkan lokasi gedung" required error={errors.lokasi} />
            </TabsContent>

            <TabsContent value="facilities" className={activeTab === "facilities" ? "space-y-4 mt-4" : "hidden"}>
              <div>
                <h3 className="text-sm font-medium mb-3">Pilih Fasilitas</h3>
                <div className="grid grid-cols-2 gap-3 max-h-64 overflow-y-auto">
                  {facilities.map((facility) => {
                    // Check if the facility is an object with `nama_fasilitas`, or just a string
                    const facilityName = typeof facility === "string" ? facility : facility?.nama_fasilitas;

                    return (
                      <div key={facilityName} className="flex items-center space-x-2">
                        <Checkbox
                          id={facilityName}
                          checked={selectedFacilities.includes(facilityName)}
                          onCheckedChange={() => handleFacilityToggle(facilityName)}
                        />
                        <label
                          htmlFor={facilityName}
                          className="text-sm font-medium leading-none cursor-pointer peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {facilityName}
                        </label>
                      </div>
                    );
                  })}
                  {facilities.length === 0 && (
                    <p className="text-sm text-gray-500 col-span-2">Tidak ada fasilitas tersedia</p>
                  )}
                </div>
              </div>

              {selectedFacilities.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium mb-2">Fasilitas Terpilih:</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedFacilities.map(id => {
                      const facility = facilities.find(f => f.id === id);
                      return facility ? (
                        <Badge key={id} variant="secondary">
                          {facility.nama_fasilitas}
                        </Badge>
                      ) : null;
                    })}
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="responsible" className={activeTab === "responsible" ? "space-y-4 mt-4" : "hidden"}>
              <div>
                <h3 className="text-sm font-medium mb-3">Pilih Penanggung Jawab</h3>
                <div className="grid grid-cols-1 gap-3 max-h-64 overflow-y-auto">
                  {responsiblePersons.map((person) => (
                    <div key={person.id} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50">
                      <Checkbox
                        id={person.id}
                        checked={selectedResponsiblePersons.includes(person.id)}
                        onCheckedChange={() => handleResponsiblePersonToggle(person.id)}
                      />
                      <label
                        htmlFor={person.id}
                        className="flex-1 cursor-pointer"
                      >
                        <div className="font-medium text-sm">{person.nama_penangguang_jawab}</div>
                        <div className="text-sm text-gray-500">{person.no_hp}</div>
                      </label>
                    </div>
                  ))}
                  {responsiblePersons.length === 0 && (
                    <p className="text-sm text-gray-500 text-center py-8">
                      Tidak ada penanggung jawab tersedia
                    </p>
                  )}
                </div>
              </div>

              {selectedResponsiblePersons.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium mb-2">Penanggung Jawab Terpilih:</h4>
                  <div className="space-y-2">
                    {selectedResponsiblePersons.map(id => {
                      const person = responsiblePersons.find(p => p.id === id);
                      return person ? (
                        <Badge key={id} variant="secondary" className="block p-2">
                          <div className="font-medium">{person.nama_penangguang_jawab}</div>
                          <div className="text-xs">{person.no_hp}</div>
                        </Badge>
                      ) : null;
                    })}
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="photo" className={activeTab === "photo" ? "space-y-4 mt-4" : "hidden"}>
              <div className="space-y-2">
                <label className="text-sm font-medium">Foto Gedung</label>

                <div className="flex items-center gap-4">
                  <div 
                    className="relative w-48 h-48 border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50/50 transition-colors"
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
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600"
                          onClick={(e) => {
                            e.stopPropagation();
                            setImagePreview(null);
                            onFileSelect(null);
                          }}
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <>
                        <Upload className="w-8 h-8 text-gray-400 mb-2" />
                        <span className="text-sm text-gray-500">Upload foto</span>
                        <span className="text-xs text-gray-400 mt-1">Max. 5MB</span>
                      </>
                    )}
                  </div>

                  <div className="flex-1">
                    <p className="text-sm text-gray-600">
                      Upload foto gedung untuk memberikan gambaran yang lebih jelas kepada calon penyewa.
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Format yang didukung: JPG, PNG, GIF (Max. 5MB)
                    </p>
                    {errors.foto_gedung && (
                      <p className="text-xs text-red-500 mt-1">{errors.foto_gedung}</p>
                    )}
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter className="mt-6 flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Batal
            </Button>

            <div className="flex gap-2">
              {activeTabIndex > 0 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={goToPreviousTab}
                  disabled={isSubmitting}
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Sebelumnya
                </Button>
              )}

              {activeTabIndex < tabs.length - 1 ? (
                <Button
                  type="button"
                  onClick={goToNextTab}
                  disabled={isSubmitting}
                  className="bg-main-green hover:bg-green-800"
                >
                  Selanjutnya
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              ) : (
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="bg-main-green hover:bg-green-800"
                >
                  {isSubmitting ? "Menyimpan..." : isEditMode ? "Perbarui" : "Simpan"}
                </Button>
              )}
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default GedungFormDialog;
