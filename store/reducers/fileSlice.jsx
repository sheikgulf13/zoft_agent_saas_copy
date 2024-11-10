import { createSlice } from '@reduxjs/toolkit';

const fileSlice = createSlice({
  name: 'file',
  initialState: {
    file: null,
  },
  reducers: {
    setFile: (state, action) => {
      state.file = action.payload;
      console.log('File saved in Redux store:', action.payload); // Debug log
    },
  },
});

export const { setFile } = fileSlice.actions;

export default fileSlice.reducer;
