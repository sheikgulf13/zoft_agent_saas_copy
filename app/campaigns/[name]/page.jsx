"use client";

import React from "react";
import CampaignDetails from "@/Components/campaigns/CampaignDetails";

const CampaignDetailsPage = ({ params }) => {
  const campaignName = decodeURIComponent(params.name);

  return <CampaignDetails campaignName={campaignName} />;
};

export default CampaignDetailsPage;

