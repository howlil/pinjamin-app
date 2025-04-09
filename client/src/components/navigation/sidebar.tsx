// src/components/navigation/sidebar.tsx
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Check, Square } from "lucide-react";

export const Sidebar = () => {
  return (
    <div className="w-64 border-r p-4 space-y-2">
      <h2 className="text-xl font-bold mb-4">Pinjamin</h2>
      
      <Button variant="ghost" className="w-full justify-start" asChild>
        <Link to="/dashboard">
          <Square className="mr-2 h-4 w-4" />
          Dashboard
        </Link>
      </Button>
      
      <Button variant="ghost" className="w-full justify-start" asChild>
        <Link to="/gedung">
          <Square className="mr-2 h-4 w-4" />
          Gedung
        </Link>
      </Button>
      
      <Button variant="secondary" className="w-full justify-start" asChild>
        <Link to="/peminjaman">
          <Check className="mr-2 h-4 w-4" />
          Peminjaman
        </Link>
      </Button>
      
      <Button variant="ghost" className="w-full justify-start" asChild>
        <Link to="/transaksi">
          <Check className="mr-2 h-4 w-4" />
          Transaksi
        </Link>
      </Button>
      
      <Button variant="ghost" className="w-full justify-start" asChild>
        <Link to="/riwayat">
          <Check className="mr-2 h-4 w-4" />
          Riwayat
        </Link>
      </Button>
    </div>
  );
};