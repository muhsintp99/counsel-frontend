import { createSlice } from '@reduxjs/toolkit';

const stateSlice = createSlice({
  name: 'states',
  initialState: {
    states: [],
    stateCount: 0,
    loading: false,
    error: null,
  },
  reducers: {
    // Add
    addState: (state) => { state.loading = true; },
    addStateSuccess: (state) => {
      state.loading = false;
    },
    addStateFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Get All
    getState: (state) => { state.loading = true; },
    getStateSuccess: (state, action) => {
      state.loading = false;
      state.states = action.payload; // ✅ data array
    },
    getStateFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Count
    totalCount: (state) => { state.loading = true; },
    totalCountSuccess: (state, action) => {
      state.loading = false;
      state.stateCount = action.payload.count;
    },
    totalCountFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Update
    updateState: (state) => { state.loading = true; },
    updateStateSuccess: (state) => {
      state.loading = false;
    },
    updateStateFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Delete
    deleteState: (state) => { state.loading = true; },
    deleteStateSuccess: (state) => {
      state.loading = false;
    },
    deleteStateFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  getState,
  getStateSuccess,
  getStateFail,
  addState,
  addStateSuccess,
  addStateFail,
  totalCount,
  totalCountSuccess,
  totalCountFail,
  updateState,
  updateStateSuccess,
  updateStateFail,
  deleteState,
  deleteStateSuccess,
  deleteStateFail,
} = stateSlice.actions;

export default stateSlice.reducer;
