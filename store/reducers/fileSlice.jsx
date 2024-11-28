import { createSlice } from '@reduxjs/toolkit';

const fileSlice = createSlice({
  name: 'file',
  initialState: {
    file: [],
  },
  reducers: {
    setFile: (state, action) => {
      state.file = [...state.file, ...action.payload];
      console.log('File saved in Redux store:', action.payload); // Debug log
      console.log('file state:', state.file);
    },
  },
});

export const { setFile } = fileSlice.actions;

export default fileSlice.reducer;
