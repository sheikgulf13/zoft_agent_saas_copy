"use client";

import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCampaignListThunk,
  fetchVoicesThunk,
  createCampaignThunk,
  launchCampaignThunk,
  selectCampaignsState,
} from "@/store/reducers/campaignsSlice";

const useCampaigns = ({ autoFetch = false, autoVoices = false } = {}) => {
  const dispatch = useDispatch();
  const campaignsState = useSelector(selectCampaignsState);

  const refresh = useCallback(
    () => dispatch(fetchCampaignListThunk()),
    [dispatch]
  );

  const loadVoices = useCallback(
    () => dispatch(fetchVoicesThunk()),
    [dispatch]
  );

  const create = useCallback(
    (payload) => dispatch(createCampaignThunk(payload)).unwrap(),
    [dispatch]
  );

  const launch = useCallback(
    (payload) => dispatch(launchCampaignThunk(payload)).unwrap(),
    [dispatch]
  );

  useEffect(() => {
    if (autoFetch) {
      refresh();
    }
  }, [autoFetch, refresh]);

  useEffect(() => {
    if (autoVoices) {
      loadVoices();
    }
  }, [autoVoices, loadVoices]);

  return {
    ...campaignsState,
    campaigns: campaignsState.list,
    refresh,
    loadVoices,
    create,
    launch,
  };
};

export default useCampaigns;

