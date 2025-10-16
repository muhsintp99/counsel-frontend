import { createSlice } from '@reduxjs/toolkit';

const internationalCollegeSlice = createSlice({
  name: 'internationalColleges',
  initialState: {
    colleges: [],
    selectedCollege: null,
    collegeCount: 0,
    pagination: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => { state.error = null; },
    clearSelectedCollege: (state) => { state.selectedCollege = null; },
    addCollege: (state) => { state.loading = true; },
    addCollegeSuccess: (state, action) => {
      state.loading = false;
      if (action.payload) state.colleges.unshift(action.payload);
    },
    addCollegeFail: (state, action) => { state.loading = false; state.error = action.payload; },
    getColleges: (state) => { state.loading = true; },
    getCollegesSuccess: (state, action) => {
      state.loading = false;
      const { colleges, pagination } = action.payload;
      state.colleges = colleges || [];
      state.pagination = pagination || null;
    },
    getCollegesFail: (state, action) => { state.loading = false; state.error = action.payload; },
    getCollegeById: (state) => { state.loading = true; },
    getCollegeByIdSuccess: (state, action) => {
      state.loading = false;
      state.selectedCollege = action.payload;
    },
    getCollegeByIdFail: (state, action) => { state.loading = false; state.error = action.payload; },
    totalCount: (state) => { state.loading = true; },
    totalCountSuccess: (state, action) => {
      state.loading = false;
      state.collegeCount = action.payload.count || 0;
    },
    totalCountFail: (state, action) => { state.loading = false; state.error = action.payload; },
    updateCollege: (state) => { state.loading = true; },
    updateCollegeSuccess: (state, action) => {
      state.loading = false;
      const updated = action.payload;
      if (updated && updated._id) {
        const index = state.colleges.findIndex(item => item._id === updated._id);
        if (index !== -1) state.colleges[index] = updated;
        if (state.selectedCollege?._id === updated._id) state.selectedCollege = updated;
      }
    },
    updateCollegeFail: (state, action) => { state.loading = false; state.error = action.payload; },
    deleteCollege: (state) => { state.loading = true; },
    deleteCollegeSuccess: (state, action) => {
      state.loading = false;
      state.colleges = state.colleges.filter(c => c._id !== action.payload);
    },
    deleteCollegeFail: (state, action) => { state.loading = false; state.error = action.payload; },
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
} = internationalCollegeSlice.actions;

export default internationalCollegeSlice.reducer;
