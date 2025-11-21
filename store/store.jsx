import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { combineReducers } from 'redux';
import botReducer from "./reducers/botSlice";
import fileReducer from "./reducers/fileSlice";
import fileUpdateReducer from "./reducers/fileSliceUpdate";
import dataSourceSlice from "./reducers/dataSourceSlice";
import ActionsSlice from "./reducers/ActionsSlice";
import teamSlice from "./reducers/teamSlice";
import profileSlice from "./reducers/profileSlice";
import billingSlice from "./reducers/billingSlice";
import phoneAgentSlice from "./reducers/phoneAgentSlice";
import VoiceSettingSlice from "./reducers/VoiceSettingSlice";
import embedCodeSlice from "./reducers/embedCodeSlice";
import registerUserSlice from "./reducers/registerUserSlice";
import workspaceSlice from "./reducers/workspaceSlice";
import callList from "./reducers/phoneCallListSlice";
import workSpaceList from "./reducers/workSpaceListSlice";
import selectedData from "./reducers/selectedDataSlice";
import workSpaceAgentList from "./reducers/workSpaceAgentListSlice";
import pricingReducer from "./reducers/pricingReducer";
import campaignsReducer from "./reducers/campaignsSlice";

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['phoneAgent', 'selectedData'] // Only persist these reducers
};

const rootReducer = combineReducers({
  bot: botReducer,
  data: dataSourceSlice,
  actions: ActionsSlice,
  file: fileReducer,
  fileUpdate: fileUpdateReducer,
  team: teamSlice,
  profile: profileSlice,
  billing: billingSlice,
  phoneAgent: phoneAgentSlice,
  voice: VoiceSettingSlice,
  embedCode: embedCodeSlice,
  user: registerUserSlice,
  workspace: workspaceSlice,
  callList: callList,
  workSpaceList: workSpaceList,
  selectedData: selectedData,
  workSpaceAgentList: workSpaceAgentList,
  pricing: pricingReducer,
  campaigns: campaignsReducer
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoreActions: ["file/setFile", "fileUpdate/setFileUpdate", "persist/PERSIST", "persist/REHYDRATE"],
        ignoredPaths: ["file.file", "fileUpdate.file"],
      },
    }),
});

export const persistor = persistStore(store);
export default store;
