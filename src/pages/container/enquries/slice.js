import { createSlice, current } from '@reduxjs/toolkit';

const initialState = {
  enquiries: [],
  enquiryByIdData: {},
  enquiryCount: 0,
  loading: false,
  error: null,
};

const enquirySlice = createSlice({
  name: 'enquiries',
  initialState,
  reducers: {
    // Request actions
    getEnquiries: (state) => {
      state.loading = true;
      state.error = null;
    },
    getEnquiryById: (state) => {
      state.loading = true;
      state.error = null;
    },
    createEnquiry: (state) => {
      state.loading = true;
      state.error = null;
    },
    updateEnquiry: (state) => {
      state.loading = true;
      state.error = null;
    },
    deleteEnquiry: (state) => {
      state.loading = true;
      state.error = null;
    },
    getEnquiryCount: (state) => {
      state.loading = true;
      state.error = null;
    },

    // Success actions
    getEnquiriesSuccess: (state, action) => {
      state.loading = false;
      state.enquiries = action.payload.enquiry;
    },
    getEnquiryByIdSuccess: (state, action) => {
      state.loading = false;
      state.enquiryByIdData = action.payload;
    },
    createEnquirySuccess: (state, action) => {
      state.loading = false;
      state.enquiries.push(action.payload);
    },
    updateEnquirySuccess: (state, action) => {
      state.loading = false;
      const updated = action.payload;
      state.enquiries = current(state.enquiries).map((enquiry) =>
        enquiry.id === updated.id ? updated : enquiry
      );
      if (state.enquiryByIdData.id === updated.id) {
        state.enquiryByIdData = updated;
      }
    },
    deleteEnquirySuccess: (state, action) => {
      state.loading = false;
      const deletedId = action.payload;
      state.enquiries = current(state.enquiries).filter(
        (enquiry) => enquiry.id !== deletedId
      );
      if (state.enquiryByIdData.id === deletedId) {
        state.enquiryByIdData = {};
      }
    },
    getEnquiryCountSuccess: (state, action) => {
      state.loading = false;
      state.enquiryCount = action.payload.count;
    },

    // Failure action
    enquiryFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Reset action
    resetEnquiryState: () => initialState,
  },
});

// Export actions
export const {
  getEnquiries,
  getEnquiryById,
  createEnquiry,
  updateEnquiry,
  deleteEnquiry,
  getEnquiryCount,
  getEnquiriesSuccess,
  getEnquiryByIdSuccess,
  createEnquirySuccess,
  updateEnquirySuccess,
  deleteEnquirySuccess,
  getEnquiryCountSuccess,
  enquiryFailure,
  resetEnquiryState,
} = enquirySlice.actions;

export default enquirySlice.reducer;
