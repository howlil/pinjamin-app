import { FC, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useFormik } from "formik";
import {z} from "zod";
import TextInput from "@/components/ui/costum/text-input";
import SelectInput from "@/components/ui/costum/select-input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Upload } from "lucide-react";

export interface Building {
    id: number;
    name: string;
    description: string;
    capacity: string;
    location: string;
    manager?: string;
    facilities?: string;
    price?: string;
    type?: string;
    photo?: File | null;
  }
  
  export interface BuildingFormValues {
    name: string;
    description: string;
    manager: string;
    facilities: string;
    price: string;
    capacity: string;
    location: string;
    type: string;
    photo: File | null;
  }
  
  export interface BuildingTableProps {
    buildings: Building[];
    onEditClick: (id: number) => void;
    onDeleteClick: (id: number) => void;
    activeDropdown: number | null;
    toggleDropdown: (id: number) => void;
  }
  
  export interface HeaderSectionProps {
    onAddClick: () => void;
  }
  
  export interface BuildingStateHook {
    buildings: Building[];
    formData: BuildingFormValues;
    isFormOpen: boolean;
    isEditMode: boolean;
    activeDropdown: number | null;
    setIsFormOpen: (isOpen: boolean) => void;
    setIsEditMode: (isEditMode: boolean) => void;
    handleFormSubmit: (values: BuildingFormValues) => void;
    toggleDropdown: (id: number) => void;
    handleDelete: (id: number) => void;
    handleEdit: (id: number) => void;
    resetForm: () => void;
  }
// Building type options
const buildingTypeOptions = [
  { value: "office", label: "Kantor" },
  { value: "classroom", label: "Ruang Kelas" },
  { value: "hall", label: "Aula" },
  { value: "meeting", label: "Ruang Rapat" },
  { value: "laboratory", label: "Laboratorium" },
];

interface BuildingFormProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: Building;
  onSubmit: (values: any) => void;
  isEditMode?: boolean;
}

// Define the validation schema using Yup

const BuildingSchema = z.object({
  name: z.string().min(1, { message: "Nama gedung wajib diisi" }),
  description: z.string().min(1, { message: "Deskripsi wajib diisi" }),
  manager: z.string().min(1, { message: "Penanggung jawab wajib diisi" }),
  facilities: z.string().min(1, { message: "Fasilitas gedung wajib diisi" }),
  price: z.string().min(1, { message: "Harga sewa wajib diisi" }),
  capacity: z.string().min(1, { message: "Kapasitas wajib diisi" }),
  location: z.string().min(1, { message: "Lokasi wajib diisi" }),
  type: z.string().min(1, { message: "Tipe gedung wajib diisi" }),
});

const BuildingForm: FC<BuildingFormProps> = ({
  isOpen,
  onClose,
  initialData,
  onSubmit,
  isEditMode = false,
}) => {
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  const formik = useFormik({
    initialValues: initialData || {
      name: "",
      description: "",
      manager: "",
      facilities: "",
      price: "",
      capacity: "",
      location: "",
      type: "",
      photo: null,
    },
    validationSchema: BuildingSchema,
    onSubmit: (values) => {
      onSubmit(values);
      onClose();
    },
  });

  const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.currentTarget.files?.[0];
    if (file) {
      formik.setFieldValue("photo", file);

      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClearPhoto = () => {
    formik.setFieldValue("photo", null);
    setPhotoPreview(null);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            {isEditMode ? "Edit Gedung" : "Form Tambah Gedung"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={formik.handleSubmit} className="space-y-5 py-4">
          <TextInput
            formik={formik}
            name="name"
            label="Nama Gedung"
            placeholder="Masukkan nama gedung"
            required
          />

          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium">
              Deskripsi<span className="text-red-500">*</span>
            </label>
            <Textarea
              id="description"
              name="description"
              placeholder="Masukkan deskripsi gedung"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.description}
              className={
                formik.touched.description && formik.errors.description
                  ? "border-red-500 focus-visible:ring-red-500"
                  : ""
              }
            />
            {formik.touched.description && formik.errors.description && (
              <p className="text-sm text-red-500">
                {formik.errors.description as string}
              </p>
            )}
          </div>

          <TextInput
            formik={formik}
            name="manager"
            label="Penanggung Jawab"
            placeholder="Masukkan nama penanggung jawab"
            required
          />

          <div className="space-y-2">
            <label htmlFor="facilities" className="text-sm font-medium">
              Fasilitas Gedung<span className="text-red-500">*</span>
            </label>
            <Textarea
              id="facilities"
              name="facilities"
              placeholder="Masukkan fasilitas gedung"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.facilities}
              className={
                formik.touched.facilities && formik.errors.facilities
                  ? "border-red-500 focus-visible:ring-red-500"
                  : ""
              }
            />
            {formik.touched.facilities && formik.errors.facilities && (
              <p className="text-sm text-red-500">
                {formik.errors.facilities as string}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <TextInput
              formik={formik}
              name="price"
              label="Harga Sewa"
              placeholder="Rp"
              required
            />

            <TextInput
              formik={formik}
              name="capacity"
              label="Kapasitas"
              placeholder="Orang"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <TextInput
              formik={formik}
              name="location"
              label="Lokasi"
              placeholder="Masukkan lokasi"
              required
            />

            <SelectInput
              formik={formik}
              name="type"
              label="Tipe Gedung"
              options={buildingTypeOptions}
              placeholder="Pilih tipe"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">
              Foto Gedung<span className="text-red-500">*</span>
            </label>

            {photoPreview ? (
              <div className="relative">
                <img
                  src={photoPreview}
                  alt="Preview"
                  className="w-full h-40 object-cover rounded-md"
                />
                <button
                  type="button"
                  onClick={handleClearPhoto}
                  className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full"
                >
                  ✕
                </button>
              </div>
            ) : (
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                <div className="space-y-1 text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="flex text-sm text-gray-600 justify-center">
                    <label className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none">
                      <span>Upload</span>
                      <input
                        id="photo-upload"
                        name="photo"
                        type="file"
                        className="sr-only"
                        accept="image/*"
                        onChange={handlePhotoChange}
                      />
                    </label>
                  </div>
                  <p className="text-xs text-gray-500">
                    PNG, JPG, GIF up to 10MB
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-3">
            <Button type="button" variant="outline" onClick={onClose}>
              Batal
            </Button>
            <Button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              Simpan Data
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default BuildingForm;
