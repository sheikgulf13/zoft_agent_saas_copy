"use client";

import { createAsyncThunk, createSelector, createSlice } from "@reduxjs/toolkit";
import {
  fetchCampaigns as fetchCampaignsApi,
  fetchVoices as fetchVoicesApi,
  createCampaign as createCampaignApi,
  launchCampaign as launchCampaignApi,
} from "@/services/campaigns";

const initialState = {
  list: [],
  isLoading: false,
  isRefreshing: false,
  error: null,
  voices: [],
  voicesStatus: "idle",
  voicesError: null,
  createStatus: "idle",
  createError: null,
  launchStatus: "idle",
  launchError: null,
  activeCampaignId: null,
};

const rejectWithMessage = (rejectWithValue, error, fallback) =>
  rejectWithValue(error?.message ?? fallback);

export const fetchCampaignListThunk = createAsyncThunk(
  "campaigns/fetchList",
  async (_, { rejectWithValue }) => {
    try {
      return await fetchCampaignsApi();
    } catch (error) {
      return rejectWithMessage(
        rejectWithValue,
        error,
        "Unable to load campaigns."
      );
    }
  }
);

export const fetchVoicesThunk = createAsyncThunk(
  "campaigns/fetchVoices",
  async (_, { rejectWithValue }) => {
    try {
      return await fetchVoicesApi();
    } catch (error) {
      return rejectWithMessage(
        rejectWithValue,
        error,
        "Unable to load voices."
      );
    }
  }
);

export const createCampaignThunk = createAsyncThunk(
  "campaigns/create",
  async (payload, { rejectWithValue }) => {
    try {
      return await createCampaignApi(payload);
    } catch (error) {
      return rejectWithMessage(
        rejectWithValue,
        error,
        "Unable to create campaign."
      );
    }
  }
);

export const launchCampaignThunk = createAsyncThunk(
  "campaigns/launch",
  async (payload, { rejectWithValue }) => {
    try {
      return await launchCampaignApi(payload);
    } catch (error) {
      return rejectWithMessage(
        rejectWithValue,
        error,
        "Unable to launch campaign."
      );
    }
  }
);

const campaignsSlice = createSlice({
  name: "campaigns",
  initialState,
  reducers: {
    setActiveCampaign: (state, action) => {
      state.activeCampaignId = action.payload;
    },
    clearCampaignErrors: (state) => {
      state.error = null;
      state.createError = null;
      state.launchError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCampaignListThunk.pending, (state) => {
        state.error = null;
        state.isRefreshing = true;
        if (state.list.length === 0) {
          state.isLoading = true;
        }
      })
      .addCase(fetchCampaignListThunk.fulfilled, (state, action) => {
        state.list = Array.isArray(action.payload) ? action.payload : [];
        state.isLoading = false;
        state.isRefreshing = false;
      })
      .addCase(fetchCampaignListThunk.rejected, (state, action) => {
        state.error = action.payload ?? action.error?.message;
        state.isLoading = false;
        state.isRefreshing = false;
      })
      .addCase(fetchVoicesThunk.pending, (state) => {
        state.voicesStatus = "loading";
        state.voicesError = null;
      })
      .addCase(fetchVoicesThunk.fulfilled, (state, action) => {
        state.voices = Array.isArray(action.payload) ? action.payload : [];
        state.voicesStatus = "success";
      })
      .addCase(fetchVoicesThunk.rejected, (state, action) => {
        state.voicesStatus = "error";
        state.voicesError = action.payload ?? action.error?.message;
      })
      .addCase(createCampaignThunk.pending, (state) => {
        state.createStatus = "loading";
        state.createError = null;
      })
      .addCase(createCampaignThunk.fulfilled, (state, action) => {
        state.createStatus = "success";
        const newCampaign = action.payload;
        if (newCampaign) {
          state.list = [newCampaign, ...state.list];
        }
      })
      .addCase(createCampaignThunk.rejected, (state, action) => {
        state.createStatus = "error";
        state.createError = action.payload ?? action.error?.message;
      })
      .addCase(launchCampaignThunk.pending, (state) => {
        state.launchStatus = "loading";
        state.launchError = null;
      })
      .addCase(launchCampaignThunk.fulfilled, (state, action) => {
        state.launchStatus = "success";
        const updated = action.payload;
        if (updated?.id) {
          const index = state.list.findIndex((cmp) => cmp.id === updated.id);
          if (index >= 0) {
            state.list[index] = { ...state.list[index], ...updated };
          } else {
            state.list = [updated, ...state.list];
          }
        }
      })
      .addCase(launchCampaignThunk.rejected, (state, action) => {
        state.launchStatus = "error";
        state.launchError = action.payload ?? action.error?.message;
      });
  },
});

export const { setActiveCampaign, clearCampaignErrors } = campaignsSlice.actions;

export const selectCampaignsState = (state) => state.campaigns ?? initialState;
export const selectCampaigns = createSelector(
  selectCampaignsState,
  (campaignsState) => campaignsState.list
);
export const selectCampaignById = (state, campaignId) =>
  selectCampaigns(state).find((campaign) => campaign.id === campaignId) ?? null;

export default campaignsSlice.reducer;

