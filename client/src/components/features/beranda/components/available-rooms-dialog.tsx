import { ResCheckAvailable } from "@/apis/interfaces/IGedung";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

interface AvailableRoomsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  availableRooms: ResCheckAvailable[];
}

const AvailableRoomsDialog = ({
  open,
  onOpenChange,
  availableRooms,
}: AvailableRoomsDialogProps) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID").format(price);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl bg-white/10 backdrop-blur-sm rounded-xl p-0 overflow-hidden">
        <div className="p-4 border-b flex mt-4 justify-between items-center">
          <DialogTitle className="text-lg font-medium">
            Gedung Tersedia
          </DialogTitle>
          <div className="text-gray-500">{availableRooms.length} Gedung</div>
        </div>

        <div className="max-h-[70vh] overflow-y-auto  p-4">
          {availableRooms.length === 0 ? (
            <div className="py-8 text-center">
              <p className="text-gray-600">
                Tidak ada gedung yang tersedia pada waktu tersebut.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {availableRooms.map((room) => (
                <div
                  key={room.id}
                  className="border rounded-lg overflow-hidden"
                >
                  <div className="flex">
                    <div className="w-28">
                      <img
                        src={`${import.meta.env.VITE_API_URL}/foto/${
                          room.foto_gedung
                        }`}
                        alt={room.foto_gedung}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex-1 p-3">
                      <h3 className="font-medium">{room.nama_gedung}</h3>
                      <p className="text-sm text-gray-500 mt-1">
                        Reference site about Lorem Ipsum, giving information on
                        its origins, as well as a random Lipsum generator.
                      </p>
                      <p className="mt-2 text-sm">
                        Rp {formatPrice(room.harga_sewa)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AvailableRoomsDialog;
