import { createAction, createSlice } from "@reduxjs/toolkit";

const initialState = {
  createdActions: [],
};

const ActionsSlice = createSlice({
  name: "actions",
  initialState,
  reducers: {
    upsertAction: (state, action) => {
      const { id } = action.payload; // Assume the action payload includes an id
      const existingIndex = state.createdActions.findIndex(
        (item) => item.id === id
      );

      if (existingIndex >= 0) {
        // If found, update the existing action
        state.createdActions[existingIndex] = action.payload;
      } else {
        // If not found, add a new action
        state.createdActions.push(action.payload);
      }
    },
    removeAction: (state, action) => {
      console.log("Current actions before removal:", state.createdActions);
      console.log(
        "ID to remove:",
        action.payload,
        "Type:",
        typeof action.payload
      );

      // Filter actions to remove the one with the matching ID
      const updatedActions = state.createdActions.filter(
        (item) => item.id !== action.payload
      );

      // Log the updated actions to see if the removal worked
      console.log("Actions after removal:", updatedActions);

      // Update the state with the new array (ensure you are not mutating)
      state.createdActions = updatedActions;
    },
    clearState: (state, action) => {
      state = {
        createdActions: [],
      };
    },
  },
});

export const { upsertAction, removeAction, clearState } = ActionsSlice.actions;
export default ActionsSlice.reducer;
