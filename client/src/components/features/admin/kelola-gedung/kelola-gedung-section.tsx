// pages/KelolaGedungSection.tsx
import { FC } from "react";
import HeaderSection from "./components/header-section";
import BuildingTable from "./components/building-table";
import BuildingForm from "./components/building-form";
import { useBuildingState } from "@/hooks/use-building-state";

const KelolaGedungSection: FC = () => {
  const {
    buildings,
    formData,
    isFormOpen,
    isEditMode,
    activeDropdown,
    setIsFormOpen,
    handleFormSubmit,
    toggleDropdown,
    handleDelete,
    handleEdit,
    resetForm
  } = useBuildingState();

  const handleFormClose = () => {
    setIsFormOpen(false);
    resetForm();
  };

  return (
    <div className="">
      <HeaderSection onAddClick={() => setIsFormOpen(true)} />
      
      <BuildingTable 
        buildings={buildings}
        onEditClick={handleEdit}
        onDeleteClick={handleDelete}
        activeDropdown={activeDropdown}
        toggleDropdown={toggleDropdown}
      />
      
      <BuildingForm 
        isOpen={isFormOpen}
        onClose={handleFormClose}
        initialData={formData}
        onSubmit={handleFormSubmit}
        isEditMode={isEditMode}
      />
    </div>
  );
};

export default KelolaGedungSection;