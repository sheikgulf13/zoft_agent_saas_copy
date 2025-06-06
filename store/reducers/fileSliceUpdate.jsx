import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  file: null,
  fileWordCounts: {},
};

const fileSliceUpdate = createSlice({
  name: "fileUpdate",
  initialState,
  reducers: {
    setFileUpdate: (state, action) => {
      state.file = action.payload;
      console.log("File saved in Redux store:", action.payload); // Debug log
    },
    setFileWordCounts: (state, action) => {
      state.fileWordCounts = action.payload;
    },
    resetFileUpdate: () => initialState,
  },
});

export const { setFileUpdate, setFileWordCounts } = fileSliceUpdate.actions;

export default fileSliceUpdate.reducer;
