import {createSlice} from '@reduxjs/toolkit';

export const appSlice = createSlice({
  name: 'app',
  initialState: {
    appLoading: true,
    userEntryList: null,
  },
  reducers: {
    setAppLoading: (state, action) => {
      state.appLoading = action.payload;
    },
    setUserEntryList: (state, action) => {
      state.userEntryList = action.payload;
    },
  },
});
export const {setAppLoading, setUserEntryList} = appSlice.actions;
export default appSlice.reducer;
