"use client";

import React from "react";
import CampaignDetails from "@/Components/campaigns/CampaignDetails";

const CampaignDetailsPage = ({ params }) => {
  const campaignId = params.id;

  return <CampaignDetails campaignId={campaignId} />;
};

export default CampaignDetailsPage;

