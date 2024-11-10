import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  workSpaceList: [],
};

const workSpaceSlice = createSlice({
  name: "workSpaceList",
  initialState,
  reducers: {
    updateWorkSpaceList: (state, action) => {
        state.workSpaceList = action.payload;
    },
  },
});

export const { updateWorkSpaceList } = workSpaceSlice.actions;
export default workSpaceSlice.reducer;
