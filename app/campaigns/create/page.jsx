"use client";

import React, { useState } from "react";
import useTheme from "next-theme";

import CampaignForm from "@/Components/campaigns/CampaignForm";
import CsvPreview from "@/Components/campaigns/CsvPreview";

const CreateCampaignPage = () => {
  const { theme } = useTheme();
  const [csvPreview, setCsvPreview] = useState({ headers: [], rows: [] });

  return (
    <div className={`min-h-screen w-full ${theme === "dark" ? "bg-[#0B0E15]" : "bg-white"}`}>
      <div
        className={`w-full px-[1vw] py-[.8vw] border-b ${
          theme === "dark"
            ? "border-[#151A23] bg-[#0E121C] text-white"
            : "border-gray-200 bg-gray-50 text-gray-900"
        }`}
      >
        <h1 className="text-[1vw] font-semibold">Create Campaign</h1>
      </div>
      <div className="flex min-h-[calc(100vh-80px)]">
        <div className="w-1/2 h-full">
          <CampaignForm onCsvParsed={setCsvPreview} />
        </div>
        <div className="w-1/2 h-full">
          <CsvPreview headers={csvPreview.headers} rows={csvPreview.rows} />
        </div>
      </div>
    </div>
  );
};

export default CreateCampaignPage;

