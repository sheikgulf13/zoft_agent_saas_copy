"use client";

import React, { useState, useEffect, useCallback } from "react";
import CampaignsList from "@/Components/campaigns/CampaignsList";
import { fetchCampaigns } from "@/services/campaigns/index";

const CampaignsPage = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const loadCampaigns = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }
      setError(null);
      
      console.log("Fetching campaigns...");
      const data = await fetchCampaigns();
      console.log("Campaigns API response:", data);
      
      // Handle different response structures
      let campaignsData = [];
      
      if (Array.isArray(data)) {
        campaignsData = data;
      } else if (data && Array.isArray(data.campaigns)) {
        campaignsData = data.campaigns;
      } else if (data && Array.isArray(data.data)) {
        campaignsData = data.data;
      } else if (data && typeof data === 'object') {
        // If it's an object, try to find an array property
        const arrayKey = Object.keys(data).find(key => Array.isArray(data[key]));
        if (arrayKey) {
          campaignsData = data[arrayKey];
        }
      }
      
      // Transform the API response to match the expected format
      const transformedCampaigns = campaignsData.map((campaign) => ({
        id: campaign.id || campaign.campaign_id || String(Math.random()),
        name: campaign.campaign_name || campaign.name || "Unnamed Campaign",
        status: campaign.status || campaign.campaign_status || "draft",
        voiceName: campaign.agent_name || campaign.voice_name || campaign.voiceName || "—",
        totalContacts: campaign.total_contacts || campaign.contacts_count || campaign.totalContacts || 0,
        scheduledFor: campaign.scheduled_at || campaign.scheduled_for || campaign.scheduledFor || null,
      }));
      
      console.log("Transformed campaigns:", transformedCampaigns);
      setCampaigns(transformedCampaigns);
    } catch (err) {
      setError(err?.message || "Failed to load campaigns. Please try again.");
      console.error("Error fetching campaigns:", err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);


  

  useEffect(() => {
    loadCampaigns(false);
  }, [loadCampaigns]);

  const handleRefresh = useCallback(() => {
    loadCampaigns(true);
  }, [loadCampaigns]);

  return (
    <CampaignsList
      campaigns={campaigns}
      isLoading={isLoading}
      isRefreshing={isRefreshing}
      error={error}
      onRefresh={handleRefresh}
    />
  );
};

export default CampaignsPage;

