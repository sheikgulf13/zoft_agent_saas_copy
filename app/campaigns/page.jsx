"use client";

import React, { useMemo } from "react";
import CampaignsList from "@/Components/campaigns/CampaignsList";
import useCampaigns from "@/hooks/useCampaigns";

const CampaignsPage = () => {
  const { campaigns, isLoading, isRefreshing, error, refresh } = useCampaigns({
    autoFetch: true,
    autoVoices: true,
  });

  // Dummy data for testing
  const dummyCampaigns = useMemo(
    () => [
      {
        id: "dummy-1",
        name: "Spring Product Launch",
        status: "scheduled",
        voiceName: "Steve",
        totalContacts: 1250,
        scheduledFor: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: "dummy-2",
        name: "Customer Follow-up Campaign",
        status: "launched",
        voiceName: "Nia2",
        totalContacts: 856,
        scheduledFor: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ],
    []
  );

  const displayCampaigns = campaigns.length > 0 ? campaigns : dummyCampaigns;

  return (
    <CampaignsList
      campaigns={displayCampaigns}
      isLoading={isLoading}
      isRefreshing={isRefreshing}
      error={error}
      onRefresh={refresh}
    />
  );
};

export default CampaignsPage;

