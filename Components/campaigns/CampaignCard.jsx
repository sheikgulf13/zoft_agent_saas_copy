"use client";

import React from "react";
import useTheme from "next-theme";
import clsx from "clsx";

const statusStyles = {
  draft: "bg-gray-100 text-gray-700",
  scheduled: "bg-amber-100 text-amber-700",
  launched: "bg-emerald-100 text-emerald-700",
};

const CampaignCard = ({ campaign, onSelect }) => {
  const { theme } = useTheme();

  const status = campaign.status?.toLowerCase?.() ?? "draft";
  const scheduledDate = campaign.scheduledFor
    ? new Date(campaign.scheduledFor).toLocaleString()
    : "Not scheduled";

  return (
    <button
      type="button"
      onClick={() => onSelect?.(campaign)}
      className={clsx(
        "w-[180px] h-[180px] rounded-[15%] border transition-all duration-150 cursor-pointer text-left overflow-hidden p-4 flex flex-col gap-2 hover:shadow-lg hover:-translate-y-1",
        theme === "dark"
          ? "border-[#2A2E37] bg-[#1F222A] text-white"
          : "border-gray-200 bg-white text-[#111]"
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <p className="font-semibold truncate">{campaign.name}</p>
        <span
          className={clsx(
            "text-xs font-semibold px-2 py-0.5 rounded-full capitalize",
            statusStyles[status] ?? statusStyles.draft
          )}
        >
          {status}
        </span>
      </div>
      <div className="text-xs text-gray-500 flex flex-col gap-1 flex-1">
        <p>Voice: {campaign.voiceName ?? "—"}</p>
        <p>Contacts: {campaign.totalContacts ?? 0}</p>
        <p className="line-clamp-2">
          {status === "scheduled" ? "Starts" : "Updated"}: {scheduledDate}
        </p>
      </div>
      <div
        className={clsx(
          "text-xs font-medium mt-auto pt-2 border-t",
          theme === "dark" ? "border-[#2A2E37]" : "border-gray-200"
        )}
      >
        View details →
      </div>
    </button>
  );
};

export default CampaignCard;

