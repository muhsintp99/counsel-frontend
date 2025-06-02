import { createSlice } from '@reduxjs/toolkit';

const serviceSlice = createSlice({
  name: 'service',
  initialState: {
    services: [],
    selectedService: {},
    serviceCount: 0,
    loading: false,
    error: null,
  },
  reducers: {
    // Create
    addService: state => { state.loading = true; },
    addServiceSuccess: (state, action) => {
      state.loading = false;
      state.services.push(action.payload);
      state.serviceCount += 1;
    },
    addServiceFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Get all
    getServices: state => { state.loading = true; },
    getServicesSuccess: (state, action) => {
      state.loading = false;
      state.services = Array.isArray(action.payload) ? action.payload : action.payload.data || [];
      state.serviceCount = Array.isArray(action.payload) ? action.payload.length : action.payload.total || action.payload.data?.length || 0;
      state.error = null;
    },
    getServicesFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Get by ID
    getServiceById: state => { state.loading = true; },
    getServiceByIdSuccess: (state, action) => {
      state.loading = false;
      state.selectedService = action.payload;
      state.error = null;
    },
    getServiceByIdFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Total Count
    totalServiceCount: state => { state.loading = true; },
    totalServiceCountSuccess: (state, action) => {
      state.loading = false;
      state.serviceCount = action.payload.count;
    },
    totalServiceCountFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Update
    updateService: state => { state.loading = true; },
    updateServiceSuccess: (state, action) => {
      state.loading = false;
      const updated = action.payload;
      state.services = state.services.map((item) =>
        item._id === updated._id ? updated : item
      );
      if (state.selectedService?._id === updated._id) {
        state.selectedService = updated;
      }
    },
    updateServiceFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Soft Delete
    deleteService: state => { state.loading = true; },
    deleteServiceSuccess: (state, action) => {
      const deletedId = action.payload;
      state.loading = false;
      state.services = state.services.filter((s) => s._id !== deletedId);
      if (state.selectedService?._id === deletedId) {
        state.selectedService = {};
      }
      state.serviceCount -= 1;
    },
    deleteServiceFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Hard Delete
    hardDeleteService: state => { state.loading = true; },
    hardDeleteServiceSuccess: (state, action) => {
      const deletedId = action.payload;
      state.loading = false;
      state.services = state.services.filter((s) => s._id !== deletedId);
      if (state.selectedService?._id === deletedId) {
        state.selectedService = {};
      }
      state.serviceCount -= 1;
    },
    hardDeleteServiceFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  }
});

export const {
  getServices, getServicesSuccess, getServicesFail,
  addService, addServiceSuccess, addServiceFail,
  getServiceById, getServiceByIdSuccess, getServiceByIdFail,
  totalServiceCount, totalServiceCountSuccess, totalServiceCountFail,
  updateService, updateServiceSuccess, updateServiceFail,
  deleteService, deleteServiceSuccess, deleteServiceFail,
  hardDeleteService, hardDeleteServiceSuccess, hardDeleteServiceFail
} = serviceSlice.actions;

export default serviceSlice.reducer;