import React, { useState } from 'react';
import { useFormik } from 'formik';
import { toFormikValidationSchema } from 'zod-formik-adapter';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import TextInput from '@/components/ui/costum/text-input';
import { Upload } from 'lucide-react';

// Define the Zod schema for form validation
const formSchema = z.object({
  nama_kegiatan: z.string().min(1, { message: 'Nama kegiatan wajib diisi' }),
  tanggal_mulai: z.string().min(1, { message: 'Tanggal mulai wajib diisi' }),
  tanggal_selesai: z.string().min(1, { message: 'Tanggal selesai wajib diisi' }),
  jam_mulai: z.string().min(1, { message: 'Jam mulai wajib diisi' }),
  jam_selesai: z.string().min(1, { message: 'Jam selesai wajib diisi' }),
  surat_pengajuan: z.any().refine((val) => val !== null, {
    message: 'Surat pengajuan wajib diupload',
  }),
  gedung_id: z.string().optional(),
});

interface FormPeminjamanProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: any) => void;
  gedungId?: string;
}

const FormPeminjaman: React.FC<FormPeminjamanProps> = ({ 
  isOpen, 
  onClose, 
  onSubmit,
  gedungId 
}) => {
  const [filePreview, setFilePreview] = useState<string | null>(null);

  // Initialize formik with zod validation
  const formik = useFormik({
    initialValues: {
      nama_kegiatan: '',
      tanggal_mulai: '',
      tanggal_selesai: '',
      jam_mulai: '',
      jam_selesai: '',
      surat_pengajuan: null,
      gedung_id: gedungId || '',
    },
    validationSchema: toFormikValidationSchema(formSchema),
    onSubmit: (values) => {
      onSubmit(values);
      formik.resetForm();
      setFilePreview(null);
      onClose();
    },
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.currentTarget.files?.[0];
    if (file) {
      formik.setFieldValue('surat_pengajuan', file);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setFilePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClearFile = () => {
    formik.setFieldValue('surat_pengajuan', null);
    setFilePreview(null);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Form Peminjaman
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={formik.handleSubmit} className="space-y-4 py-4">
          <TextInput
            formik={formik}
            name="nama_kegiatan"
            label="Nama Kegiatan"
            placeholder="Masukkan nama kegiatan"
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <TextInput
              formik={formik}
              name="tanggal_mulai"
              label="Tanggal Mulai Kegiatan"
              type="date"
              required
            />

            <TextInput
              formik={formik}
              name="tanggal_selesai"
              label="Tanggal Selesai Kegiatan"
              type="date"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <TextInput
              formik={formik}
              name="jam_mulai"
              label="Jam Mulai Kegiatan"
              type="time"
              required
            />

            <TextInput
              formik={formik}
              name="jam_selesai"
              label="Jam Selesai Kegiatan"
              type="time"
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="surat_pengajuan" className="text-sm font-medium">
              Surat Pengajuan<span className="text-red-500">*</span>
            </label>
            
            {filePreview ? (
              <div className="relative p-4 border border-gray-300 rounded-md">
                <p className="text-sm text-gray-600 truncate">{(formik.values.surat_pengajuan as File)?.name}</p>
                <button
                  type="button"
                  onClick={handleClearFile}
                  className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full"
                >
                  ✕
                </button>
              </div>
            ) : (
              <div className={`flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md ${
                formik.touched.surat_pengajuan && formik.errors.surat_pengajuan 
                  ? 'border-red-500' 
                  : 'border-gray-300'
              }`}>
                <div className="space-y-1 text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="flex text-sm text-gray-600">
                    <label className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none">
                      <span>Upload</span>
                      <input
                        id="surat_pengajuan"
                        name="surat_pengajuan"
                        type="file"
                        className="sr-only"
                        accept=".pdf,.doc,.docx"
                        onChange={handleFileChange}
                        onBlur={() => formik.setFieldTouched('surat_pengajuan', true)}
                      />
                    </label>
                  </div>
                  <p className="text-xs text-gray-500">PDF, DOC, DOCX hingga 10MB</p>
                </div>
              </div>
            )}
            
            {formik.touched.surat_pengajuan && formik.errors.surat_pengajuan && (
              <p className="text-sm text-red-500">{formik.errors.surat_pengajuan as string}</p>
            )}
          </div>

          <Button
            type="submit"
          >
            Pinjam
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default FormPeminjaman;