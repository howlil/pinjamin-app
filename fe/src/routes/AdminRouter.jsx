import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from '../shared/components/AdminLayout';

// Admin Pages
import AdminDashboardPage from '@features/admin/dashboard/AdminDashboardPage';
import ManageBuildingPage from '@features/admin/manageBuilding/ManageBuildingPage';
import BuildingFormContainer from '@features/admin/manageBuilding/components/BuildingFormContainer';
import BuildingDetailContainer from '@features/admin/manageBuilding/components/BuildingDetailContainer';
import ManageFacilityPage from '@features/admin/manageFacility/ManageFacilityPage';
import ManageBuildingManagerPage from '@features/admin/manageBuildingManager/ManageBuildingManagerPage';
import ManageBorrowerPage from '@features/admin/manageBorrower/ManageBorrowerPage';
import HistoryBorrowerPage from '@features/admin/historyBorrower/HistoryBorrowerPage';
import HistoryTransactionPage from '@features/admin/historyTransaction/HistoryTransactionPage';

const AdminRouter = () => {
    return (
        <Routes>
            <Route path="/" element={<AdminLayout />}>
                <Route index element={<Navigate to="dashboard" replace />} />
                <Route path="dashboard" element={<AdminDashboardPage />} />
                <Route path="manage-building" element={<ManageBuildingPage />} />
                <Route path="manage-building/create" element={<BuildingFormContainer />} />
                <Route path="manage-building/edit/:id" element={<BuildingFormContainer />} />
                <Route path="manage-building/detail/:id" element={<BuildingDetailContainer />} />
                <Route path="manage-facility" element={<ManageFacilityPage />} />
                <Route path="manage-building-manager" element={<ManageBuildingManagerPage />} />
                <Route path="manage-borrower" element={<ManageBorrowerPage />} />
                <Route path="history-borrower" element={<HistoryBorrowerPage />} />
                <Route path="history-transaction" element={<HistoryTransactionPage />} />
            </Route>
        </Routes>
    );
};

export default AdminRouter; 