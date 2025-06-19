import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Auth Store
export const useAuthStore = create(
    persist(
        (set, get) => ({
            user: null,
            token: null,
            isAuthenticated: false,

            // Actions
            login: (userData, token) => {
                set({
                    user: userData,
                    token,
                    isAuthenticated: true
                });
            },

            logout: () => {
                set({
                    user: null,
                    token: null,
                    isAuthenticated: false
                });
            },

            updateUser: (userData) => {
                set({ user: userData });
            },

            // Higher order function for protected actions
            withAuth: (callback) => {
                const { isAuthenticated } = get();
                if (isAuthenticated) {
                    return callback();
                } else {
                    throw new Error('Authentication required');
                }
            },
        }),
        {
            name: 'auth-storage',
            partialize: (state) => ({
                user: state.user,
                token: state.token,
                isAuthenticated: state.isAuthenticated,
            }),
        }
    )
);

// UI Store
export const useUiStore = create((set) => ({
    isLoading: false,
    sidebarOpen: false,
    activeModal: null,

    // Actions
    setLoading: (loading) => set({ isLoading: loading }),
    toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
    openModal: (modalName) => set({ activeModal: modalName }),
    closeModal: () => set({ activeModal: null }),
}));

// Data Store (example for general data management)
export const useDataStore = create((set, get) => ({
    data: [],
    filteredData: [],
    searchQuery: '',
    currentPage: 1,
    itemsPerPage: 10,

    // Actions
    setData: (newData) => {
        set({ data: newData });
        get().applyFilters();
    },

    setSearchQuery: (query) => {
        set({ searchQuery: query, currentPage: 1 });
        get().applyFilters();
    },

    setCurrentPage: (page) => set({ currentPage: page }),

    // Higher order function for data filtering
    applyFilters: () => {
        const { data, searchQuery } = get();
        const filtered = data.filter(item =>
            item.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.description?.toLowerCase().includes(searchQuery.toLowerCase())
        );
        set({ filteredData: filtered });
    },

    // Higher order function for pagination
    getPaginatedData: () => {
        const { filteredData, currentPage, itemsPerPage } = get();
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return {
            data: filteredData.slice(startIndex, endIndex),
            totalPages: Math.ceil(filteredData.length / itemsPerPage),
            totalItems: filteredData.length,
        };
    },
})); 