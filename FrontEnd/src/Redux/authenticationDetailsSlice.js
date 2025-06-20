import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  name: '',
  email: '',
  GSTIN: '',
  token: '',
  tockenExpiry: '',
};

const authenticationDetailsSlice = createSlice({
  name: 'authenticationDetails',
  initialState,
  reducers: {
    updateAuthenticationDetails: (state, action) => {
      return { ...state, ...action.payload };
    },    
    logout: () => initialState,
  },
});

export const { updateAuthenticationDetails, logout } = authenticationDetailsSlice.actions;
export default authenticationDetailsSlice.reducer;


