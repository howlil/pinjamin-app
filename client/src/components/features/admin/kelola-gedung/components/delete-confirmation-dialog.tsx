import { FC } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { AlertTriangle } from "lucide-react";

interface DeleteConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  buildingName: string;
}

/**
 * DeleteConfirmationDialog - Confirmation dialog for deleting a building
 * with glassmorphism effect
 */
const DeleteConfirmationDialog: FC<DeleteConfirmationDialogProps> = ({
  open,
  onOpenChange,
  onConfirm,
  buildingName,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md  bg-white/80 backdrop-blur-md border border-white/20 shadow-lg">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <DialogHeader className="mb-4 flex flex-col items-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
            <DialogTitle className="text-xl font-semibold text-gray-800 text-center">
              Konfirmasi Hapus
            </DialogTitle>
          </DialogHeader>
          
          <div className="text-center mb-6 space-y-2">
            <p className="text-gray-700">
              Apakah Anda yakin ingin menghapus gedung:
            </p>
            <p className="font-semibold text-lg">{buildingName}?</p>
            <p className="text-gray-500 text-sm">
              Tindakan ini tidak dapat dibatalkan dan akan menghapus semua data terkait.
            </p>
          </div>
          
          <DialogFooter className="flex flex-wrap justify-center gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Batal
            </Button>
            <Button 
              type="button" 
              className="cursor-pointer"
              variant="destructive" 
              onClick={onConfirm}
            >
              Ya, Hapus Gedung
            </Button>
          </DialogFooter>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteConfirmationDialog;