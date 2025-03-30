import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  plans: [],
  currentSubscription: null,
  loading: false,
  error: null
};

const pricingSlice = createSlice({
  name: 'pricing',
  initialState,
  reducers: {
    fetchPricingStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchPricingSuccess: (state, action) => {
      state.plans = action.payload;
      state.loading = false;
    },
    fetchPricingFailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    fetchSubscriptionStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchSubscriptionSuccess: (state, action) => {
      state.currentSubscription = action.payload;
      state.loading = false;
    },
    fetchSubscriptionFailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    resetPricingState: () => initialState
  }
});

export const {
  fetchPricingStart,
  fetchPricingSuccess,
  fetchPricingFailure,
  fetchSubscriptionStart,
  fetchSubscriptionSuccess,
  fetchSubscriptionFailure,
  resetPricingState
} = pricingSlice.actions;

export default pricingSlice.reducer; 