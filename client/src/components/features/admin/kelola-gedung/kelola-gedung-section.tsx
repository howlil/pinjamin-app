import { FC, useState, useEffect, useCallback } from "react";
import { GedungService } from "@/apis/gedung";
import TipeGedungService from "@/apis/tipe-gedung";
import FasilitasGedungService from "@/apis/fasilitas-gedung";
import PenanggungJawabService from "@/apis/penanggung-jawab";
import { Gedung, GedungFilter } from "@/apis/interfaces/IGedung";
import { TipeGedung } from "@/apis/interfaces/ITipeGedung";
import { Fasilitas } from "@/apis/interfaces/IFasilitasGedung";
import { PenanggungJawabGedung } from "@/apis/interfaces/IPenanggungJawabGedung";
import { Button } from "@/components/ui/button";
import { PlusCircle, RefreshCw } from "lucide-react";
import SearchInput from "@/components/ui/costum/input/search-input";
import FilterInput from "@/components/ui/costum/input/filter-input";
import GedungTable from "./components/gedung-table";
import GedungFormDialog from "./components/gedung-form-dialog";
import DeleteConfirmationDialog from "./components/delete-confirmation-dialog";
import GedungDetailDialog from "./components/gedung-detail-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";

/**
 * KelolaGedungSection - Enhanced main component for managing buildings
 */
const KelolaGedungSection: FC = () => {
  // State management
  const [buildings, setBuildings] = useState<Gedung[]>([]);
  const [filteredBuildings, setFilteredBuildings] = useState<Gedung[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  
  // Dialog states
  const [showCreateForm, setShowCreateForm] = useState<boolean>(false);
  const [showEditForm, setShowEditForm] = useState<boolean>(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<boolean>(false);
  const [showDetailDialog, setShowDetailDialog] = useState<boolean>(false);
  const [selectedBuilding, setSelectedBuilding] = useState<Gedung | null>(null);
  
  // Reference data state
  const [buildingTypes, setBuildingTypes] = useState<TipeGedung[]>([]);
  const [facilities, setFacilities] = useState<Fasilitas[]>([]);
  const [responsiblePersons, setResponsiblePersons] = useState<PenanggungJawabGedung[]>([]);
  
  // Filter state
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<string>("");
  
  // Image file for upload
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Filter options for sorting buildings
  const filterOptions = [
    { value: "name_asc", label: "Nama (A-Z)" },
    { value: "name_desc", label: "Nama (Z-A)" },
    { value: "price_low", label: "Harga Terendah" },
    { value: "price_high", label: "Harga Tertinggi" },
    { value: "capacity", label: "Kapasitas Terbesar" },
    { value: "newest", label: "Terbaru" },
  ];

  // Fetch all reference data
  const fetchReferenceData = async () => {
    try {
      const [typesData, facilitiesData, responsibleData] = await Promise.all([
        TipeGedungService.getAllTipeGedung(),
        FasilitasGedungService.getAllFasilitas(),
        PenanggungJawabService.getAllPenanggungJawab()
      ]);
      
      setBuildingTypes(typesData);
      setFacilities(facilitiesData);
      setResponsiblePersons(responsibleData);
    } catch (error) {
      console.error("Error fetching reference data:", error);
      toast.error("Gagal memuat data referensi");
    }
  };

  // Fetch buildings data
  const fetchBuildings = async (showLoading = true) => {
    try {
      if (showLoading) setLoading(true);
      setError("");
      
      const filter: GedungFilter = {};
      const data = await GedungService.getGedung(filter);
      
      setBuildings(data);
      setFilteredBuildings(data);
      
      // Apply current filters if any
      if (searchQuery) {
        handleSearch(searchQuery);
      }
      if (sortOrder) {
        handleFilter(sortOrder);
      }
    } catch (error: any) {
      console.error("Error fetching buildings:", error);
      setError("Gagal memuat data gedung. Silakan coba lagi.");
      toast.error("Gagal memuat data gedung");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Refresh data
  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchBuildings(false);
    toast.success("Data berhasil diperbarui");
  };

  // Fetch all data on component mount
  useEffect(() => {
    const fetchAllData = async () => {
      await fetchReferenceData();
      await fetchBuildings();
    };
    
    fetchAllData();
  }, []);

  // Handle search input with debounce
  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    
    if (!query.trim()) {
      setFilteredBuildings(buildings);
      return;
    }
    
    const lowerQuery = query.toLowerCase();
    const filtered = buildings.filter((building) => 
      building.nama_gedung.toLowerCase().includes(lowerQuery) ||
      building.lokasi?.toLowerCase().includes(lowerQuery) ||
      building.deskripsi?.toLowerCase().includes(lowerQuery)
    );
    
    setFilteredBuildings(filtered);
  }, [buildings]);

  // Handle filter/sort selection
  const handleFilter = useCallback((value: string) => {
    setSortOrder(value);
    let sorted = [...filteredBuildings];
    
    switch (value) {
      case "name_asc":
        sorted.sort((a, b) => a.nama_gedung.localeCompare(b.nama_gedung));
        break;
      case "name_desc":
        sorted.sort((a, b) => b.nama_gedung.localeCompare(a.nama_gedung));
        break;
      case "price_low":
        sorted.sort((a, b) => (a.harga_sewa || 0) - (b.harga_sewa || 0));
        break;
      case "price_high":
        sorted.sort((a, b) => (b.harga_sewa || 0) - (a.harga_sewa || 0));
        break;
      case "capacity":
        sorted.sort((a, b) => (b.kapasitas || 0) - (a.kapasitas || 0));
        break;
      case "newest":
        sorted.sort((a, b) => 
          new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime()
        );
        break;
      default:
        break;
    }
    
    setFilteredBuildings(sorted);
  }, [filteredBuildings]);

  // Handle file selection for image upload
  const handleFileSelect = (file: File | null) => {
    setSelectedFile(file);
  };

  // Handle creating a new building
  const handleCreate = async (newBuilding: any) => {
    try {
      setLoading(true);
      await GedungService.createGedung(newBuilding, selectedFile || undefined);
      
      // Fetch fresh data to get all relations
      await fetchBuildings();
      
      setShowCreateForm(false);
      setSelectedFile(null);
      toast.success("Gedung berhasil ditambahkan");
    } catch (error: any) {
      console.error("Error creating building:", error);
      toast.error(error.response?.data?.message || "Gagal menambahkan gedung");
    } finally {
      setLoading(false);
    }
  };

  // Handle updating a building
  const handleUpdate = async (id: string, updatedBuilding: any) => {
    try {
      setLoading(true);
      await GedungService.updateGedung(id, updatedBuilding, selectedFile || undefined);
      
      // Fetch fresh data to get updated relations
      await fetchBuildings();
      
      setShowEditForm(false);
      setSelectedFile(null);
      setSelectedBuilding(null);
      toast.success("Gedung berhasil diperbarui");
    } catch (error: any) {
      console.error("Error updating building:", error);
      toast.error(error.response?.data?.message || "Gagal memperbarui gedung");
    } finally {
      setLoading(false);
    }
  };

  // Handle deleting a building
  const handleDelete = async (id: string) => {
    try {
      setLoading(true);
      await GedungService.deleteGedung(id);
      
      // Update state locally for faster UI response
      const updatedBuildings = buildings.filter(building => building.id !== id);
      setBuildings(updatedBuildings);
      setFilteredBuildings(filteredBuildings.filter(building => building.id !== id));
      
      setShowDeleteConfirm(false);
      setSelectedBuilding(null);
      toast.success("Gedung berhasil dihapus");
    } catch (error: any) {
      console.error("Error deleting building:", error);
      toast.error(error.response?.data?.message || "Gagal menghapus gedung");
    } finally {
      setLoading(false);
    }
  };

  // Handle view details
  const handleViewDetails = async (building: Gedung) => {
    try {
      setLoading(true);
      // Fetch detailed data with all relations
      const detailedBuilding = await GedungService.getGedungById(building.id);
      setSelectedBuilding(detailedBuilding);
      setShowDetailDialog(true);
    } catch (error) {
      console.error("Error fetching building details:", error);
      toast.error("Gagal memuat detail gedung");
    } finally {
      setLoading(false);
    }
  };

  // Handle edit button click
  const handleEditClick = (building: Gedung) => {
    setSelectedBuilding(building);
    setSelectedFile(null);
    setShowEditForm(true);
  };

  // Handle delete button click
  const handleDeleteClick = (building: Gedung) => {
    setSelectedBuilding(building);
    setShowDeleteConfirm(true);
  };

  // Render table skeleton
  const renderTableSkeleton = () => (
    <div className="rounded-md border shadow-sm overflow-hidden">
      <div className="bg-gray-50 px-6 py-3">
        <div className="flex space-x-4">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-16" />
        </div>
      </div>
      {[...Array(5)].map((_, index) => (
        <div key={index} className="border-t">
          <div className="px-6 py-4 flex space-x-4">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-36" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-8 w-8 rounded" />
          </div>
        </div>
      ))}
    </div>
  );

  // Reset all dialogs
  const resetDialogs = () => {
    setShowCreateForm(false);
    setShowEditForm(false);
    setShowDeleteConfirm(false);
    setShowDetailDialog(false);
    setSelectedBuilding(null);
    setSelectedFile(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Kelola Gedung</h1>
          <p className="text-gray-600 mt-1">
            Mengelola data gedung yang tersedia untuk disewa
          </p>
        </div>
        
        <div className="flex gap-2">
          {/* <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={refreshing || loading}
            className="flex items-center gap-2"
          >
            <RefreshCw size={16} className={refreshing ? "animate-spin" : ""} />
            <span>Refresh</span>
          </Button> */}
          
          <Button
            onClick={() => {
              resetDialogs();
              setShowCreateForm(true);
            }}
            className="flex items-center gap-2 bg-main-green hover:bg-green-700"
          >
            <PlusCircle size={16} />
            <span>Tambah Gedung</span>
          </Button>
        </div>
      </div>
      
      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertDescription>
            {error}
          </AlertDescription>
        </Alert>
      )}
      
      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-4 justify-between">
        <SearchInput 
          placeholder="Cari nama gedung, lokasi, atau deskripsi..." 
          onSearch={handleSearch} 
          className="w-full md:w-96"
          disabled={loading}
        />
        <FilterInput 
          options={filterOptions} 
          onFilterChange={handleFilter}
          value={sortOrder}
          placeholder="Urutkan"
          className="w-full md:w-48"
          disabled={loading}
        />
      </div>
      
      {/* Results count */}
      {!loading && (
        <div className="text-sm text-gray-600">
          Menampilkan {filteredBuildings.length} dari {buildings.length} gedung
          {searchQuery && ` (hasil pencarian: "${searchQuery}")`}
        </div>
      )}
      
      {/* Table */}
      {loading ? (
        renderTableSkeleton()
      ) : (
        <GedungTable 
          buildings={filteredBuildings} 
          buildingTypes={buildingTypes}
          onEdit={handleEditClick} 
          onDelete={handleDeleteClick}
          onView={handleViewDetails}
          searchQuery={searchQuery}
        />
      )}
      
      {/* Create Gedung Dialog */}
      {showCreateForm && (
        <GedungFormDialog
          open={showCreateForm}
          onOpenChange={(open) => {
            setShowCreateForm(open);
            if (!open) {
              setSelectedFile(null);
            }
          }}
          onSubmit={handleCreate}
          onFileSelect={handleFileSelect}
          buildingTypes={buildingTypes}
          facilities={facilities}
          responsiblePersons={responsiblePersons}
          title="Tambah Gedung Baru"
        />
      )}
      
      {/* Edit Gedung Dialog */}
      {showEditForm && selectedBuilding && (
        <GedungFormDialog
          open={showEditForm}
          onOpenChange={(open) => {
            setShowEditForm(open);
            if (!open) {
              setSelectedFile(null);
              setSelectedBuilding(null);
            }
          }}
          onSubmit={(data) => handleUpdate(selectedBuilding.id, data)}
          onFileSelect={handleFileSelect}
          buildingTypes={buildingTypes}
          facilities={facilities}
          responsiblePersons={responsiblePersons}
          initialData={selectedBuilding}
          title="Edit Gedung"
        />
      )}
      
      {/* View Details Dialog */}
      {showDetailDialog && selectedBuilding && (
        <GedungDetailDialog
          open={showDetailDialog}
          onOpenChange={(open) => {
            setShowDetailDialog(open);
            if (!open) {
              setSelectedBuilding(null);
            }
          }}
          building={selectedBuilding}
        />
      )}
      
      {/* Delete Confirmation Dialog */}
      {showDeleteConfirm && selectedBuilding && (
        <DeleteConfirmationDialog
          open={showDeleteConfirm}
          onOpenChange={(open) => {
            setShowDeleteConfirm(open);
            if (!open) {
              setSelectedBuilding(null);
            }
          }}
          onConfirm={() => handleDelete(selectedBuilding.id)}
          buildingName={selectedBuilding.nama_gedung}
        />
      )}
    </div>
  );
};

export default KelolaGedungSection;