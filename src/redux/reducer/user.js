import {createSlice} from '@reduxjs/toolkit';

const userSlice = createSlice({
  name: 'user',
  initialState: {
    isLoggedIn: false,
    accessToken: null,
    userData: null,
   
  },
  reducers: {
    setIsLoggedIn: (state, action) => {
      state.isLoggedIn = action.payload;
    },
    setAccessToken: (state, action) => {
      state.accessToken = action.payload;
    },
    setUserData: (state, action) => {
      state.userData = action.payload;
    },
   
  },
});

export const {
  setIsLoggedIn,
  setAccessToken,
  setUserData,

} = userSlice.actions;

export default userSlice.reducer;
