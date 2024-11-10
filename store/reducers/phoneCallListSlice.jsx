import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    phoneAgentId: null,
    conversations: []
};

const callListSlice = createSlice({
  name: "callList",
  initialState,
  reducers: {
    setConversations: (state, action) => {
      state.conversations = action.payload.conversations;
      state.phoneAgentId =  action.payload.phoneAgentId;
    }
  },
});

export const {
    setConversations
} = callListSlice.actions;
export default callListSlice.reducer;
