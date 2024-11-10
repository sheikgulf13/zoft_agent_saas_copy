import { createSlice } from '@reduxjs/toolkit';

const fileSliceUpdate = createSlice({
  name: 'fileUpdate',
  initialState: {
    file: null,
    fileWordCounts:{}
  },
  reducers: {
    setFileUpdate: (state, action) => {
      state.file = action.payload;
      console.log('File saved in Redux store:', action.payload); // Debug log
    },
    setFileWordCounts: (state,action) => {
      state.fileWordCounts = action.payload;
    }
  },
});

export const { setFileUpdate, setFileWordCounts } = fileSliceUpdate.actions;

export default fileSliceUpdate.reducer;