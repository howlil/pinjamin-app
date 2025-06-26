import React from 'react';
import toast from 'react-hot-toast';
import { buildingManagementAPI } from '../api/buildingManagementAPI';
import { facilityManagementAPI } from '../../manageFacility/api/facilityManagementAPI';
import { buildingManagerAPI } from '../../manageBuildingManager/api/buildingManagerAPI';
import BuildingFormPage from './BuildingFormPage';

const BuildingFormContainer = () => {

    const handleCreateBuilding = async (buildingData) => {
        try {
            const response = await buildingManagementAPI.createBuilding(buildingData);

            if (response.data && response.data.status === 'success') {
                toast.success('Gedung berhasil dibuat');
                return response.data.data;
            }
        } catch (error) {
            // Error handled in apiClient
            throw error;
        }
    };

    const handleUpdateBuilding = async (id, buildingData) => {
        try {
            const response = await buildingManagementAPI.updateBuilding(id, buildingData);

            if (response.data && response.data.status === 'success') {
                toast.success('Gedung berhasil diperbarui');
                return response.data.data;
            }
        } catch (error) {
            // Error handled in apiClient
            throw error;
        }
    };

    const handleLoadFacilities = async () => {
        try {
            const response = await facilityManagementAPI.getFacilities();
            if (response.status === 'success') {
                return response.data || [];
            }
            return [];
        } catch (error) {
            // Error handled in apiClient
            return [];
        }
    };

    const handleLoadManagers = async () => {
        try {
            const response = await buildingManagerAPI.getAvailableBuildingManagers();
            if (response.status === 'success') {
                return response.data || [];
            }
            return [];
        } catch (error) {
            // Error handled in apiClient
            return [];
        }
    };

    const handleLoadBuilding = async (id) => {
        try {
            const response = await buildingManagementAPI.getAdminBuildings();
            if (response.data) {
                const building = response.data.find(b => b.id === id);
                return building || null;
            }
            return null;
        } catch (error) {
            // Error handled in apiClient
            return null;
        }
    };

    return (
        <BuildingFormPage
            onCreateBuilding={handleCreateBuilding}
            onUpdateBuilding={handleUpdateBuilding}
            onLoadFacilities={handleLoadFacilities}
            onLoadManagers={handleLoadManagers}
            onLoadBuilding={handleLoadBuilding}
        />
    );
};

export default BuildingFormContainer;
