// src/redux/slices/serviceSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  services: [],          // list view
  selectedService: null, // detail view
  serviceCount: 0,       // total (non-deleted) docs
  loading: false,
  error: null,
};

const serviceSlice = createSlice({
  name: 'service',
  initialState,
  reducers: {
    /* ───────── GET ALL ───────── */
    getServices: state => { state.loading = true; },
    getServicesSuccess: (state, { payload }) => {
      state.loading = false;
      state.services = Array.isArray(payload) ? payload : payload?.data || [];
      state.serviceCount = state.services.length;
      state.error = null;
    },
    getServicesFail: (state, { payload }) => {
      state.loading = false;
      state.error = payload;
    },

    /* ───────── GET BY ID ─────── */
    getServiceById: state => { state.loading = true; },
    getServiceByIdSuccess: (state, { payload }) => {
      state.loading = false;
      state.selectedService = payload;
      state.error = null;
    },
    getServiceByIdFail: (state, { payload }) => {
      state.loading = false;
      state.error = payload;
    },

    /* ───────── TOTAL COUNT ───── */
    totalServiceCount: state => { state.loading = true; },
    totalServiceCountSuccess: (state, { payload }) => {
      state.loading = false;
      state.serviceCount = payload.count;
    },
    totalServiceCountFail: (state, { payload }) => {
      state.loading = false;
      state.error = payload;
    },

    /* ───────── ADD ───────────── */
    addService: state => { state.loading = true; },
    addServiceSuccess: (state, { payload }) => {
      state.loading = false;
      state.services.push(payload);
      state.serviceCount += 1;
    },
    addServiceFail: (state, { payload }) => {
      state.loading = false;
      state.error = payload;
    },

    /* ───────── UPDATE ────────── */
    updateService: state => { state.loading = true; },
    getServicesSuccess: (state, { payload }) => {
      state.loading = false;
      state.services = Array.isArray(payload)
        ? payload.filter(item => item && typeof item === 'object' && item._id)
        : payload?.data?.filter(item => item && typeof item === 'object' && item._id) || [];
      state.serviceCount = state.services.length;
      state.error = null;
    },

    updateServiceFail: (state, { payload }) => {
      state.loading = false;
      state.error = payload;
    },

    /* ───────── SOFT DELETE ───── */
    deleteService: state => { state.loading = true; },
    deleteServiceSuccess: (state, { payload: id }) => {
      state.loading = false;
      state.services = state.services.filter(s => s._id !== id);
      if (state.selectedService?._id === id) state.selectedService = null;
      state.serviceCount -= 1;
    },
    deleteServiceFail: (state, { payload }) => {
      state.loading = false;
      state.error = payload;
    },

    /* ───────── HARD DELETE ───── */
    hardDeleteService: state => { state.loading = true; },
    hardDeleteServiceSuccess: (state, { payload: id }) => {
      state.loading = false;
      state.services = state.services.filter(s => s._id !== id);
      if (state.selectedService?._id === id) state.selectedService = null;
      state.serviceCount -= 1;
    },
    hardDeleteServiceFail: (state, { payload }) => {
      state.loading = false;
      state.error = payload;
    },
  },
});

export const {
  getServices, getServicesSuccess, getServicesFail,
  getServiceById, getServiceByIdSuccess, getServiceByIdFail,
  totalServiceCount, totalServiceCountSuccess, totalServiceCountFail,
  addService, addServiceSuccess, addServiceFail,
  updateService, updateServiceSuccess, updateServiceFail,
  deleteService, deleteServiceSuccess, deleteServiceFail,
  hardDeleteService, hardDeleteServiceSuccess, hardDeleteServiceFail,
} = serviceSlice.actions;

export default serviceSlice.reducer;
