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
    clearSelectedData: () => initialState, 
    clearSelectedAgents: (state) => {
      state.selectedPhoneAgent = null;
      state.selectedChatAgent = null;
    },
  },
});

export const {
  updateSelectedWorkSpace,
  updateSelectedChatAgent,
  updateSelectedPhoneAgent,
  clearSelectedData,
  clearSelectedAgents,
} = selectedDataSlice.actions;
export default selectedDataSlice.reducer;
