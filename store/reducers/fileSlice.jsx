import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  file: [],
};

const fileSlice = createSlice({
  name: "file",
  initialState,
  reducers: {
    setFile: (state, action) => {
      state.file = [...state.file, ...action.payload];
      console.log("File saved in Redux store:", action.payload); // Debug log
      console.log("file state:", state.file);
    },
    setUpdatedFile: (state, action) => {
      state.file = action.payload;
      console.log("updated File saved in Redux store:", action.payload); // Debug log
      console.log("updated file state:", state.file);
    },
    resetFile: () => initialState,
  },
});

export const { setFile, setUpdatedFile, resetFile } = fileSlice.actions;

export default fileSlice.reducer;
