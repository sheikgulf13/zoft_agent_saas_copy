"use client";

import React from "react";
import useTheme from "next-theme";
import { useRouter } from "next/navigation";
import { FaPlus } from "react-icons/fa";
import { TfiReload } from "react-icons/tfi";
import clsx from "clsx";

const CampaignsList = ({
  campaigns = [],
  isLoading,
  isRefreshing,
  error,
  onRefresh,
}) => {
  const router = useRouter();
  const { theme } = useTheme();

  const hasCampaigns = campaigns.length > 0;

  const handleCreate = () => router.push("/campaigns/create");

  const statusStyles = {
    draft: "bg-gray-100 text-gray-700",
    scheduled: "bg-amber-100 text-amber-700",
    launched: "bg-emerald-100 text-emerald-700",
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Not scheduled";
    try {
      return new Date(dateString).toLocaleString();
    } catch {
      return "Invalid date";
    }
  };

  return (
    <div
      className={`h-[100vh] overflow-hidden flex items-center justify-center ${
        theme === "dark" ? "bg-[#1F222A]" : "bg-white"
      }`}
    >
      <div
        className={`w-full h-full overflow-y-auto py-[2%] px-[5vw] ${
          theme === "dark" ? "text-white" : "text-black"
        }`}
      >
        <div className="flex flex-wrap gap-[1.2vw] items-center justify-between w-full pb-[1.2vw] border-b border-zinc-200">
          <div>
            <h1 className="text-[1.8vw] font-semibold">Campaigns</h1>
            <p className="text-[0.9vw] text-gray-500">
              Organize, schedule and launch your outreach campaigns.
            </p>
          </div>
          {hasCampaigns && (
            <div className="flex items-center gap-[1vw]">
              <button
                type="button"
                onClick={onRefresh}
                disabled={isRefreshing}
                className={clsx(
                  "flex items-center gap-[0.6vw] px-[1.5vw] py-[0.5vw] rounded-[0.5vw] border text-[0.9vw] h-[2.5vw]",
                  theme === "dark"
                    ? "border-[#2A2E37] text-gray-200 hover:bg-[#2A2E37]"
                    : "border-gray-300 text-gray-700 hover:bg-gray-50",
                  isRefreshing && "opacity-60 cursor-not-allowed"
                )}
              >
                <TfiReload className={isRefreshing ? "animate-spin" : ""} />
                Refresh
              </button>
              <button
                type="button"
                onClick={handleCreate}
                className={clsx(
                  "flex items-center gap-[0.6vw] px-[1.5vw] py-[0.5vw] rounded-[0.5vw] border text-[0.9vw] h-[2.5vw] font-semibold",
                  theme === "dark"
                    ? "border-[#4D55CC] text-gray-200 hover:bg-[#4D55CC]/20"
                    : "border-[#211C84] text-[#211C84] hover:bg-[#211C84]/10"
                )}
              >
                <FaPlus />
                Create campaign
              </button>
            </div>
          )}
        </div>

        <div className="mt-[2vw]">
          {error && (
            <div className="mb-[1.2vw] rounded-[0.5vw] bg-red-50 text-red-600 px-[1.5vw] py-[0.9vw]">
              {error}
            </div>
          )}
          {isLoading ? (
            <div className="mt-[2vw]">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr
                      className={clsx(
                        "border-b",
                        theme === "dark" ? "border-[#2A2E37]" : "border-gray-200"
                      )}
                    >
                      <th className="text-left py-[1vw] px-[1.2vw] text-[0.9vw] font-semibold">
                        Campaign Name
                      </th>
                      <th className="text-left py-[1vw] px-[1.2vw] text-[0.9vw] font-semibold">
                        Status
                      </th>
                      <th className="text-left py-[1vw] px-[1.2vw] text-[0.9vw] font-semibold">
                        Counts
                      </th>
                      <th className="text-left py-[1vw] px-[1.2vw] text-[0.9vw] font-semibold">
                        Date
                      </th>
                   
                    </tr>
                  </thead>
                  <tbody>
                    {Array.from({ length: 5 }).map((_, index) => (
                      <tr
                        key={index}
                        className={clsx(
                          "border-b animate-pulse",
                          theme === "dark" ? "border-[#2A2E37]" : "border-gray-200"
                        )}
                      >
                        <td className="py-[1.2vw] px-[1.2vw]">
                          <div
                            className={clsx(
                              "h-[1vw] w-[12vw] rounded",
                              theme === "dark" ? "bg-[#2A2E37]" : "bg-gray-100"
                            )}
                          />
                        </td>
                        <td className="py-[1.2vw] px-[1.2vw]">
                          <div
                            className={clsx(
                              "h-[1vw] w-[6vw] rounded",
                              theme === "dark" ? "bg-[#2A2E37]" : "bg-gray-100"
                            )}
                          />
                        </td>
                        <td className="py-[1.2vw] px-[1.2vw]">
                          <div
                            className={clsx(
                              "h-[1vw] w-[10vw] rounded",
                              theme === "dark" ? "bg-[#2A2E37]" : "bg-gray-100"
                            )}
                          />
                        </td>
                        <td className="py-[1.2vw] px-[1.2vw]">
                          <div
                            className={clsx(
                              "h-[1vw] w-[4vw] rounded",
                              theme === "dark" ? "bg-[#2A2E37]" : "bg-gray-100"
                            )}
                          />
                        </td>
                        <td className="py-[1.2vw] px-[1.2vw]">
                          <div
                            className={clsx(
                              "h-[1vw] w-[8vw] rounded",
                              theme === "dark" ? "bg-[#2A2E37]" : "bg-gray-100"
                            )}
                          />
                        </td>
                        <td className="py-[1.2vw] px-[1.2vw]">
                          <div
                            className={clsx(
                              "h-[1vw] w-[2vw] rounded ml-auto",
                              theme === "dark" ? "bg-[#2A2E37]" : "bg-gray-100"
                            )}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : hasCampaigns ? (
            <div className="mt-[2vw]">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead className="text-black">
                    <tr
                      className={clsx(
                        "border-b",
                        theme === "dark" ? "border-[#2A2E37]" : "border-gray-200"
                      )}
                    >
                      <th className="text-left py-[1vw] px-[1.2vw] text-[0.9vw] font-semibold">
                        Campaign Name
                      </th>
                      <th className="text-left py-[1vw] px-[1.2vw] text-[0.9vw] font-semibold">
                        Status
                      </th>
                     
                      <th className="text-left py-[1vw] px-[1.2vw] text-[0.9vw] font-semibold">
                        Count
                      </th>
                      <th className="text-left py-[1vw] px-[1.2vw] text-[0.9vw] font-semibold">
                        Date
                      </th>
                     
                    </tr>
                  </thead>
                  <tbody>
                    {campaigns.map((campaign) => {
                      const status = campaign.status?.toLowerCase?.() ?? "draft";
                      const isScheduled = status === "scheduled";
                      return (
                        <tr
                          key={campaign.id}
                          className={clsx(
                            "border-b transition-colors",
                            theme === "dark"
                              ? "border-[#2A2E37] hover:bg-[#2A2E37]/30"
                              : "border-gray-200 hover:bg-gray-50"
                          )}
                        >
                          <td className="py-[1.2vw] px-[1.2vw] text-[0.9vw] font-medium text-black">
                            {campaign.name}
                          </td>
                          <td className="py-[1.2vw] px-[1.2vw]">
                            <span
                              className={clsx(
                                "text-[0.8vw] font-semibold px-[0.8vw] py-[0.3vw] rounded-full capitalize inline-block",
                                statusStyles[status] ?? statusStyles.draft
                              )}
                            >
                              {status}
                            </span>
                          </td>
                        
                          <td className="py-[1.2vw] px-[1.2vw] text-[0.9vw] text-gray-500">
                            {campaign?.calls_counter_scheduled}
                          </td>
                          <td className="py-[1.2vw] px-[1.2vw] text-[0.9vw] text-gray-500">
                            {/*isScheduled ? "Starts: " : "Updated: "*/}
                            {formatDate(campaign.created_at)}
                          </td>
                          <td className="py-[1.2vw] px-[1.2vw]">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                router.push(`/campaigns/${campaign.id}`);
                              }}
                              className={clsx(
                                "ml-auto flex items-center justify-center w-[2vw] h-[2vw] rounded-[0.4vw] transition-colors",
                                theme === "dark"
                                  ? "hover:bg-[#2A2E37] text-gray-300"
                                  : "hover:bg-gray-100 text-gray-600"
                              )}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-[1.2vw] h-[1.2vw]"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M9 5l7 7-7 7"
                                />
                              </svg>
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-[60vh] gap-[1.2vw]">
              <p className="text-[1.2vw] font-medium text-gray-500">
                No campaigns created yet.
              </p>
              <button
                type="button"
                onClick={handleCreate}
                className={clsx(
                  "flex items-center gap-[0.6vw] px-[1.5vw] py-[0.5vw] rounded-[0.5vw] border text-[0.9vw] h-[2.5vw] font-semibold",
                  theme === "dark"
                    ? "border-[#4D55CC] text-gray-200 hover:bg-[#4D55CC]/20"
                    : "border-[#211C84] text-[#211C84] hover:bg-[#211C84]/10"
                )}
              >
                <FaPlus />
                Create campaign
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CampaignsList;

