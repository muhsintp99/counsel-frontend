import { createSlice } from '@reduxjs/toolkit';

const loginSlice = createSlice({
  name: 'login',
  initialState: {
    data: {},
    loading: false,
    error: null,
    isSuccess: false,
    isError: false
  },
  reducers: {
    userLogin: (state) => {
      state.loading = true;
      state.error = null;
      state.isSuccess = false;
      state.isError = false;
    },
    loginSuccess: (state, action) => {
      state.loading = false;
      state.data = action.payload;
      state.isSuccess = true;
      state.isError = false;
    },
    loginFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.isSuccess = false;
      state.isError = true;
    }
  }
});

export const { userLogin, loginSuccess, loginFail } = loginSlice.actions;
export const selectError = (state) => state.login.error;

export default loginSlice.reducer;
