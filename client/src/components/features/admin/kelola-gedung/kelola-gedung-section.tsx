import { FC, useState, useEffect } from "react";
import { GedungService } from "@/apis/gedung";
import { Gedung, GedungFilter } from "@/apis/interfaces/IGedung";
import { TipeGedung } from "@/apis/interfaces/ITipeGedung";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import SearchInput from "@/components/ui/costum/input/search-input";
import FilterInput from "@/components/ui/costum/input/filter-input";
import GedungTable from "./components/gedung-table";
import GedungFormDialog from "./components/gedung-form-dialog";
import DeleteConfirmationDialog from "./components/delete-confirmation-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

/**
 * KelolaGedungSection - Main component for managing buildings
 * Handles CRUD operations and state management
 */
const KelolaGedungSection: FC = () => {
  // State management
  const [buildings, setBuildings] = useState<Gedung[]>([]);
  const [filteredBuildings, setFilteredBuildings] = useState<Gedung[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showCreateForm, setShowCreateForm] = useState<boolean>(false);
  const [showEditForm, setShowEditForm] = useState<boolean>(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<boolean>(false);
  const [selectedBuilding, setSelectedBuilding] = useState<Gedung | null>(null);
  const [buildingTypes, setBuildingTypes] = useState<TipeGedung[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Filter options for sorting buildings
  const filterOptions = [
    { value: "name_asc", label: "Nama (A-Z)" },
    { value: "name_desc", label: "Nama (Z-A)" },
    { value: "price_low", label: "Harga Terendah" },
    { value: "price_high", label: "Harga Tertinggi" },
    { value: "capacity", label: "Kapasitas Terbesar" },
  ];

  // Fetch buildings data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const filter: GedungFilter = {};
        const data = await GedungService.getGedung(filter);
        setBuildings(data);
        setFilteredBuildings(data);
        
        // TODO: Fetch building types from API
        // const types = await TipeGedungService.getTipeGedung();
        // setBuildingTypes(types);
        
      } catch (error) {
        console.error("Error fetching buildings:", error);
        toast.error("Gagal memuat data gedung");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle search input
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    
    if (!query.trim()) {
      setFilteredBuildings(buildings);
      return;
    }
    
    const filtered = buildings.filter((building) => 
      building.nama_gedung.toLowerCase().includes(query.toLowerCase())
    );
    
    setFilteredBuildings(filtered);
  };

  // Handle filter/sort selection
  const handleFilter = (value: string) => {
    let sorted = [...filteredBuildings];
    
    switch (value) {
      case "name_asc":
        sorted.sort((a, b) => a.nama_gedung.localeCompare(b.nama_gedung));
        break;
      case "name_desc":
        sorted.sort((a, b) => b.nama_gedung.localeCompare(a.nama_gedung));
        break;
      case "price_low":
        sorted.sort((a, b) => a.harga_sewa - b.harga_sewa);
        break;
      case "price_high":
        sorted.sort((a, b) => b.harga_sewa - a.harga_sewa);
        break;
      case "capacity":
        sorted.sort((a, b) => {
          const capA = a.kapasitas || 0;
          const capB = b.kapasitas || 0;
          return capB - capA;
        });
        break;
      default:
        break;
    }
    
    setFilteredBuildings(sorted);
  };

  // Handle creating a new building
  const handleCreate = async (newBuilding: any) => {
    try {
      setLoading(true);
      const created = await GedungService.createGedung(newBuilding);
      
      // Update state with new building
      setBuildings([created, ...buildings]);
      setFilteredBuildings([created, ...filteredBuildings]);
      
      setShowCreateForm(false);
      toast.success("Gedung berhasil ditambahkan");
    } catch (error) {
      console.error("Error creating building:", error);
      toast.error("Gagal menambahkan gedung");
    } finally {
      setLoading(false);
    }
  };

  // Handle updating a building
  const handleUpdate = async (id: string, updatedBuilding: any) => {
    try {
      setLoading(true);
      const updated = await GedungService.updateGedung(id, updatedBuilding);
      
      // Update state with updated building
      const updatedBuildings = buildings.map(building => 
        building.id === id ? updated : building
      );
      
      setBuildings(updatedBuildings);
      setFilteredBuildings(
        filteredBuildings.map(building => 
          building.id === id ? updated : building
        )
      );
      
      setShowEditForm(false);
      setSelectedBuilding(null);
      toast.success("Gedung berhasil diperbarui");
    } catch (error) {
      console.error("Error updating building:", error);
      toast.error("Gagal memperbarui gedung");
    } finally {
      setLoading(false);
    }
  };

  // Handle deleting a building
  const handleDelete = async (id: string) => {
    try {
      setLoading(true);
      await GedungService.deleteGedung(id);
      
      // Remove the deleted building from state
      const updatedBuildings = buildings.filter(building => building.id !== id);
      setBuildings(updatedBuildings);
      setFilteredBuildings(filteredBuildings.filter(building => building.id !== id));
      
      setShowDeleteConfirm(false);
      setSelectedBuilding(null);
      toast.success("Gedung berhasil dihapus");
    } catch (error) {
      console.error("Error deleting building:", error);
      toast.error("Gagal menghapus gedung");
    } finally {
      setLoading(false);
    }
  };

  // Handle edit button click
  const handleEditClick = (building: Gedung) => {
    setSelectedBuilding(building);
    setShowEditForm(true);
  };

  // Handle delete button click
  const handleDeleteClick = (building: Gedung) => {
    setSelectedBuilding(building);
    setShowDeleteConfirm(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Kelola Gedung</h1>
          <p className="text-gray-500">
            Mengelola data gedung yang tersedia untuk disewa
          </p>
        </div>
        
        <Button
          onClick={() => setShowCreateForm(true)}
          className="flex items-center gap-2"
        >
          <PlusCircle size={16} />
          <span>Tambah Gedung</span>
        </Button>
      </div>
      
      <div className="flex flex-col md:flex-row gap-4 justify-between">
        <SearchInput 
          placeholder="Cari nama gedung..." 
          onSearch={handleSearch} 
          className="w-full md:w-auto"
        />
        <FilterInput 
          options={filterOptions} 
          onFilterChange={handleFilter} 
          placeholder="Urutkan"
          className="w-full md:w-auto"
        />
      </div>
      
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="border rounded-lg overflow-hidden">
              <Skeleton className="h-48 w-full" />
              <div className="p-4 space-y-2">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-8 w-full" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <GedungTable 
          buildings={filteredBuildings} 
          onEdit={handleEditClick} 
          onDelete={handleDeleteClick}
        />
      )}
      
      {/* Create Gedung Dialog */}
      {showCreateForm && (
        <GedungFormDialog
          open={showCreateForm}
          onOpenChange={setShowCreateForm}
          onSubmit={handleCreate}
          buildingTypes={buildingTypes}
          title="Tambah Gedung Baru"
        />
      )}
      
      {/* Edit Gedung Dialog */}
      {showEditForm && selectedBuilding && (
        <GedungFormDialog
          open={showEditForm}
          onOpenChange={setShowEditForm}
          onSubmit={(data) => handleUpdate(selectedBuilding.id, data)}
          buildingTypes={buildingTypes}
          initialData={selectedBuilding}
          title="Edit Gedung"
        />
      )}
      
      {/* Delete Confirmation Dialog */}
      {showDeleteConfirm && selectedBuilding && (
        <DeleteConfirmationDialog
          open={showDeleteConfirm}
          onOpenChange={setShowDeleteConfirm}
          onConfirm={() => handleDelete(selectedBuilding.id)}
          buildingName={selectedBuilding.nama_gedung}
        />
      )}
    </div>
  );
};

export default KelolaGedungSection;