import React from 'react';
import { buildingManagementAPI } from '../api/buildingManagementAPI';
import BuildingDetailPage from '../BuildingDetailPage';

const BuildingDetailContainer = () => {

    const handleLoadBuilding = async (id) => {
        try {
            const response = await buildingManagementAPI.getAdminBuildings();
            if (response.data) {
                const building = response.data.find(b => b.id === id);
                if (building) {
                    // Normalize the data structure to match the expected format
                    return {
                        ...building,
                        facilities: building.detail?.facilities || [],
                        buildingManagers: building.detail?.buildingManagers || []
                    };
                }
                return null;
            }
            return null;
        } catch (error) {
            // Error handled in apiClient
            return null;
        }
    };

    return (
        <BuildingDetailPage
            onLoadBuilding={handleLoadBuilding}
        />
    );
};

export default BuildingDetailContainer;
