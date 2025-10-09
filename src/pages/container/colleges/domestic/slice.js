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

    // 🔹 Add College
    addCollege: (state) => {
      state.loading = true;
      state.error = null;
    },
    addCollegeSuccess: (state, action) => {
      state.loading = false;
      if (action.payload) {
        state.colleges.unshift(action.payload);
      }
    },
    addCollegeFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // 🔹 Get Domestic Colleges (with pagination)
    getColleges: (state) => {
      state.loading = true;
      state.error = null;
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
      state.colleges = [];
    },

    // 🔹 Get All Domestic Colleges (no pagination)
    getAllColleges: (state) => {
      state.loading = true;
      state.error = null;
    },
    getAllCollegesSuccess: (state, action) => {
      state.loading = false;
      state.colleges = action.payload || [];
    },
    getAllCollegesFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.colleges = [];
    },

    // 🔹 Get College by ID
    getCollegeById: (state) => {
      state.loading = true;
      state.error = null;
    },
    getCollegeByIdSuccess: (state, action) => {
      state.loading = false;
      state.selectedCollege = action.payload;
    },
    getCollegeByIdFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.selectedCollege = null;
    },

    // 🔹 Count Domestic Colleges
    totalCount: (state) => {
      state.loading = true;
      state.error = null;
    },
    totalCountSuccess: (state, action) => {
      state.loading = false;
      state.collegeCount = action.payload.count || 0;
    },
    totalCountFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // 🔹 Update College
    updateCollege: (state) => {
      state.loading = true;
      state.error = null;
    },
    updateCollegeSuccess: (state, action) => {
      state.loading = false;
      const updated = action.payload;
      if (updated && updated._id) {
        const index = state.colleges.findIndex(item => item._id === updated._id);
        if (index !== -1) {
          state.colleges[index] = updated;
        }
        if (state.selectedCollege?._id === updated._id) {
          state.selectedCollege = updated;
        }
      }
    },
    updateCollegeFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // 🔹 Soft Delete
    softDeleteCollege: (state) => {
      state.loading = true;
      state.error = null;
    },
    softDeleteCollegeSuccess: (state, action) => {
      state.loading = false;
      const deleted = action.payload;
      if (deleted && deleted.data && deleted.data._id) {
        state.colleges = state.colleges.filter(item => item._id !== deleted.data._id);
        if (state.selectedCollege?._id === deleted.data._id) {
          state.selectedCollege = null;
        }
      }
    },
    softDeleteCollegeFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // 🔹 Hard Delete
    deleteCollege: (state) => {
      state.loading = true;
      state.error = null;
    },
    deleteCollegeSuccess: (state, action) => {
      state.loading = false;
      const deletedId = action.payload;
      if (deletedId) {
        state.colleges = state.colleges.filter(c => c._id !== deletedId);
        if (state.selectedCollege?._id === deletedId) {
          state.selectedCollege = null;
        }
        state.collegeCount = Math.max(0, state.collegeCount - 1);
      }
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
  getColleges,
  getCollegesSuccess,
  getCollegesFail,
  getAllColleges,
  getAllCollegesSuccess,
  getAllCollegesFail,
  getCollegeById,
  getCollegeByIdSuccess,
  getCollegeByIdFail,
  totalCount,
  totalCountSuccess,
  totalCountFail,
  updateCollege,
  updateCollegeSuccess,
  updateCollegeFail,
  softDeleteCollege,
  softDeleteCollegeSuccess,
  softDeleteCollegeFail,
  deleteCollege,
  deleteCollegeSuccess,
  deleteCollegeFail,
} = domesticCollegeSlice.actions;

export default domesticCollegeSlice.reducer;
