import { FC } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { AlertTriangle, Building2 } from "lucide-react";

interface DeleteConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  buildingName: string;
}

/**
 * DeleteConfirmationDialog - Confirmation dialog for deleting a building
 * with improved visual design
 */
const DeleteConfirmationDialog: FC<DeleteConfirmationDialogProps> = ({
  open,
  onOpenChange,
  onConfirm,
  buildingName,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md flex-wrap">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2 }}
        >
          <DialogHeader className="mb-4">
            <div className="flex flex-col items-center mb-4">
              <motion.div 
                className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
              >
                <AlertTriangle className="w-8 h-8 text-red-600" />
              </motion.div>
              <DialogTitle className="text-xl font-semibold text-gray-800 text-center">
                Konfirmasi Hapus Gedung
              </DialogTitle>
            </div>
          </DialogHeader>
          
          <div className="text-center mb-6 space-y-3">
            <p className="text-gray-600">
              Apakah Anda yakin ingin menghapus gedung:
            </p>
            <div className="bg-gray-100 py-3 px-4 rounded-lg">
              <div className="flex items-center justify-center gap-2">
                <Building2 className="h-5 w-5 text-gray-500" />
                <span className="font-semibold text-lg text-gray-800">{buildingName}</span>
              </div>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed">
              Tindakan ini akan menghapus semua data terkait gedung termasuk riwayat peminjaman 
              dan tidak dapat dibatalkan.
            </p>
          </div>
          
          <DialogFooter className="flex flex-wrap gap-3 justify-center">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="min-w-[100px]"
            >
              Batal
            </Button>
            <Button 
              type="button" 
              
              variant="destructive" 
              onClick={() => {
                onConfirm();
                onOpenChange(false);
              }}
              className="min-w-[100px]"
            >
              Hapus Gedung
            </Button>
          </DialogFooter>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteConfirmationDialog;