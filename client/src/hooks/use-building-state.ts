// hooks/useBuildingState.ts - Custom hook for handling building state
import { useState } from 'react';
// types/building.ts - Type definitions for building-related components


// types/building.ts
import { FormikProps } from "formik";

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

  export function useBuildingState(): BuildingStateHook {
    const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
    const [isEditMode, setIsEditMode] = useState<boolean>(false);
    const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
    const [selectedBuildingId, setSelectedBuildingId] = useState<number | null>(null);
    
    const [buildings, setBuildings] = useState<Building[]>([
      { id: 1, name: 'Ruangan Kaca 1', description: 'Ruang meeting dengan nuansa kaca yang elegan', capacity: '30', location: 'Lantai 5' },
      { id: 2, name: 'Ruangan Kaca 2', description: 'Ruang rapat dengan pemandangan kota', capacity: '20', location: 'Lantai 7' },
      { id: 3, name: 'Ruangan Kaca 3', description: 'Ruang presentasi multimedia', capacity: '50', location: 'Lantai 3' },
    ]);
    
    // Initial form data (empty form)
    const [formData, setFormData] = useState<BuildingFormValues>({
      name: '',
      description: '',
      manager: '',
      facilities: '',
      price: '',
      capacity: '',
      location: '',
      type: '',
      photo: null
    });
  
    const resetForm = () => {
      setFormData({
        name: '',
        description: '',
        manager: '',
        facilities: '',
        price: '',
        capacity: '',
        location: '',
        type: '',
        photo: null
      });
      setSelectedBuildingId(null);
      setIsEditMode(false);
    };
  
    const handleFormSubmit = (values: BuildingFormValues) => {
      if (isEditMode && selectedBuildingId) {
        // Update existing building
        setBuildings(buildings.map(building => 
          building.id === selectedBuildingId 
            ? { 
                ...building, 
                name: values.name,
                description: values.description,
                manager: values.manager,
                facilities: values.facilities,
                price: values.price,
                capacity: values.capacity,
                location: values.location,
                type: values.type,
                photo: values.photo
              } 
            : building
        ));
      } else {
        // Add new building
        const newBuilding: Building = {
          id: buildings.length > 0 ? Math.max(...buildings.map(b => b.id)) + 1 : 1,
          name: values.name,
          description: values.description,
          capacity: values.capacity,
          location: values.location,
          manager: values.manager,
          facilities: values.facilities,
          price: values.price,
          type: values.type,
          photo: values.photo
        };
        setBuildings([...buildings, newBuilding]);
      }
      
      // Reset form and close modal
      resetForm();
      setIsFormOpen(false);
    };
  
    const toggleDropdown = (id: number) => {
      if (activeDropdown === id) {
        setActiveDropdown(null);
      } else {
        setActiveDropdown(id);
      }
    };
  
    const handleDelete = (id: number) => {
      setBuildings(buildings.filter(building => building.id !== id));
      setActiveDropdown(null);
    };
  
    const handleEdit = (id: number) => {
      const buildingToEdit = buildings.find(building => building.id === id);
      if (buildingToEdit) {
        setFormData({
          name: buildingToEdit.name,
          description: buildingToEdit.description || '',
          manager: buildingToEdit.manager || '',
          facilities: buildingToEdit.facilities || '',
          price: buildingToEdit.price || '',
          capacity: buildingToEdit.capacity || '',
          location: buildingToEdit.location || '',
          type: buildingToEdit.type || '',
          photo: buildingToEdit.photo || null
        });
        setSelectedBuildingId(id);
        setIsEditMode(true);
        setIsFormOpen(true);
      }
      setActiveDropdown(null);
    };
  
    return {
      buildings,
      formData,
      isFormOpen,
      isEditMode,
      activeDropdown,
      setIsFormOpen,
      setIsEditMode,
      handleFormSubmit,
      toggleDropdown,
      handleDelete,
      handleEdit,
      resetForm
    };
  }