import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    workSpaceAgentList: [],
};

const workSpaceAgentListSlice = createSlice({
  name: "workSpaceAgentList",
  initialState,
  reducers: {
    updateWorkSpaceAgentList: (state, action) => {
        state.workSpaceAgentList = action.payload;
    },
  },
});

export const { updateWorkSpaceAgentList } = workSpaceAgentListSlice.actions;
export default workSpaceAgentListSlice.reducer;
