import { createAction, createSlice } from "@reduxjs/toolkit";

const initialState = {
  phoneAgentId: "",
  phoneAgentType: "",
  phoneAgentName: "",
  phoneAgentPurpose: "",
  language: "",
  gender:"",
  voice: "Friendly and expressive male",
  phoneNumber: "",
  companyName: "",
  companyBusiness: "",
  companyServices: "",
  prompt: "",
  script: "",
  meetingSchedular: "",
  senderMail: "",
  priceInquiry: "",
  countryCode: "+91",
  previewNumber: "",
  createdActions: [],
};

const phoneAgentslice = createSlice({
  name: "phoneAgent",
  initialState,
  reducers: {
    setPhoneAgentId: (state, action) => {
      state.phoneAgentId = action.payload;
    },
    setPhoneAgentType: (state, action) => {
      state.phoneAgentType = action.payload;
    },
    setphoneAgentName: (state, action) => {
      state.phoneAgentName = action.payload;
    },
    setphoneAgentPurpose: (state, action) => {
      state.phoneAgentPurpose = action.payload;
    },
    setLanguage: (state, actions) => {
      state.language = actions.payload;
    },
    setGender: (state, actions) => {
      state.gender = actions.payload;
    },
    setVoice: (state, actions) => {
      state.voice = actions.payload;
    },
    setPhoneNumber: (state, actions) => {
      state.phoneNumber = actions.payload;
    },
    setCompanyName: (state, action) => {
      state.companyName = action.payload;
    },
    setCompanyBusiness: (state, action) => {
      state.companyBusiness = action.payload;
    },
    setCompanyServices: (state, action) => {
      state.companyServices = action.payload;
    },
    setPrompt: (state, action) => {
      state.prompt = action.payload;
    },
    setScript: (state, action) => {
      state.script = action.payload;
    },
    setmeetingSchedular: (state, action) => {
      state.meetingSchedular = action.payload;
    },
    setsenderMail: (state, action) => {
      state.senderMail = action.payload;
    },
    setpriceInquiry: (state, action) => {
      state.priceInquiry = action.payload;
    },
    setCountryCode: (state, action) => {
      state.countryCode = action.payload;
    },
    setPreviewNumber: (state, action) => {
      state.previewNumber = action.payload;
    },
    addMultiplePhoneActions: (state, action) => {
      const newActions = Array.isArray(action.payload)
        ? action.payload
        : [action.payload];

      newActions.forEach((item) => {
        const exists = state.createdActions.some((act) => act.id === item.id);
        if (!exists) {
          state.createdActions.push(item);
        }
      });
    },
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
    clearState: () => initialState,
  },
});

export const {
  setPhoneAgentId,
  setPhoneAgentType,
  setphoneAgentName,
  setphoneAgentPurpose,
  setLanguage,
  setGender,
  setVoice,
  setPhoneNumber,
  setCompanyName,
  setCompanyBusiness,
  setCompanyServices,
  setPrompt,
  setScript,
  setmeetingSchedular,
  setsenderMail,
  setpriceInquiry,
  setCountryCode,
  setPreviewNumber,
  addMultiplePhoneActions,
  upsertAction,
  removeAction,
  clearState
} = phoneAgentslice.actions;
export default phoneAgentslice.reducer;
