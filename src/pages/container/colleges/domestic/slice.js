// src/container/colleges/domestic/slice.js
import { createSlice } from '@reduxjs/toolkit';

const domesticCollegeSlice = createSlice({
  name: 'domesticColleges',
  initialState: {
    colleges: [],
    selectedCollege: null,
    collegeCount: 0,
    pagination: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSelectedCollege: (state) => {
      state.selectedCollege = null;
    },

    // Add
    addCollege: (state) => {
      state.loading = true;
    },
    addCollegeSuccess: (state, action) => {
      state.loading = false;
      if (action.payload) state.colleges.unshift(action.payload);
    },
    addCollegeFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Get All
    getAllColleges: (state) => {
      state.loading = true;
    },
    getAllCollegesSuccess: (state, action) => {
      state.loading = false;
      const { colleges, pagination } = action.payload;
      state.colleges = colleges || [];
      state.pagination = pagination || null;
    },
    getAllCollegesFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    getColleges: (state) => {
      state.loading = true;
    },
    getCollegesSuccess: (state, action) => {
      state.loading = false;
      const { colleges, pagination } = action.payload;
      state.colleges = colleges || [];
      state.pagination = pagination || null;
    },
    getCollegesFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Get One
    getCollegeById: (state) => {
      state.loading = true;
    },
    getCollegeByIdSuccess: (state, action) => {
      state.loading = false;
      state.selectedCollege = action.payload;
    },
    getCollegeByIdFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Count
    totalCount: (state) => {
      state.loading = true;
    },
    totalCountSuccess: (state, action) => {
      state.loading = false;
      state.collegeCount = action.payload.count || 0;
    },
    totalCountFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Update
    updateCollege: (state) => {
      state.loading = true;
    },
    updateCollegeSuccess: (state, action) => {
      state.loading = false;
      const updated = action.payload;
      const index = state.colleges.findIndex(c => c._id === updated._id);
      if (index !== -1) state.colleges[index] = updated;
      if (state.selectedCollege?._id === updated._id) state.selectedCollege = updated;
    },
    updateCollegeFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Delete (Permanent)
    deleteCollege: (state) => {
      state.loading = true;
    },
    deleteCollegeSuccess: (state, action) => {
      state.loading = false;
      const deletedId = action.payload;
      state.colleges = state.colleges.filter(c => c._id !== deletedId);
      if (state.selectedCollege?._id === deletedId) state.selectedCollege = null;
      state.collegeCount = Math.max(0, state.collegeCount - 1);
    },
    deleteCollegeFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  clearError,
  clearSelectedCollege,
  addCollege,
  addCollegeSuccess,
  addCollegeFail,
  getAllColleges,
  getAllCollegesSuccess,
  getAllCollegesFail,
  getColleges,
  getCollegesSuccess,
  getCollegesFail,
  getCollegeById,
  getCollegeByIdSuccess,
  getCollegeByIdFail,
  totalCount,
  totalCountSuccess,
  totalCountFail,
  updateCollege,
  updateCollegeSuccess,
  updateCollegeFail,
  deleteCollege,
  deleteCollegeSuccess,
  deleteCollegeFail,
} = domesticCollegeSlice.actions;

export default domesticCollegeSlice.reducer;
