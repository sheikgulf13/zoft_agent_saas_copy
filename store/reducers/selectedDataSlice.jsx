import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  selectedWorkSpace: null,
  selectedPhoneAgent: null,
  selectedChatAgent: null,
};

const selectedDataSlice = createSlice({
  name: "selectedData",
  initialState,
  reducers: {
    updateSelectedWorkSpace: (state, action) => {
      state.selectedWorkSpace = action.payload;
    },
    updateSelectedPhoneAgent: (state, action) => {
      state.selectedPhoneAgent = action.payload;
    },
    updateSelectedChatAgent: (state, action) => {
      state.selectedChatAgent = action.payload;
    },
  },
});

export const {
  updateSelectedWorkSpace,
  updateSelectedChatAgent,
  updateSelectedPhoneAgent,
} = selectedDataSlice.actions;
export default selectedDataSlice.reducer;
