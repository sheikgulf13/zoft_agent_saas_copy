"use client";

import React from "react";
import useTheme from "next-theme";
import { useRouter } from "next/navigation";
import clsx from "clsx";

const CampaignDetails = ({ campaignId }) => {
  const router = useRouter();
  const { theme } = useTheme();

  // Dummy data for testing - will be replaced with API call later
  const stats = {
    totalCalls: 1250,
    successfulCalls: 980,
    failedCalls: 270,
    totalDuration: 4560,
  };

  const callResults = [
    {
      id: "1",
      phoneNumber: "+61412345678",
      status: "completed",
      duration: "3:45",
      date: new Date().toLocaleString(),
      agent: "Steve",
    },
    {
      id: "2",
      phoneNumber: "+61412345679",
      status: "failed",
      duration: "0:12",
      date: new Date(Date.now() - 3600000).toLocaleString(),
      agent: "Steve",
    },
    {
      id: "3",
      phoneNumber: "+61412345680",
      status: "completed",
      duration: "5:23",
      date: new Date(Date.now() - 7200000).toLocaleString(),
      agent: "Steve",
    },
  ];

  const statusStyles = {
    completed: "bg-emerald-100 text-emerald-700",
    failed: "bg-red-100 text-red-700",
    pending: "bg-amber-100 text-amber-700",
  };

  return (
    <div
      className={`h-[100vh] overflow-hidden flex items-center justify-center ${
        theme === "dark" ? "bg-[#1F222A]" : "bg-white"
      }`}
    >
      <div
        className={`w-full h-full overflow-y-auto py-[1%] px-[2vw] ${
          theme === "dark" ? "text-white" : "text-black"
        }`}
      >
        <div className="flex flex-wrap gap-[1.2vw] items-center justify-between w-full pb-[1.2vw] border-b border-zinc-200">
          <div>
            <button
              type="button"
              onClick={() => router.push("/campaigns")}
              className={clsx(
                "text-[0.9vw] mb-[0.5vw] hover:underline",
                theme === "dark" ? "text-gray-400" : "text-gray-600"
              )}
            >
              ← 
            </button>
          </div>
        </div>

        <div className="mt-[2vw]">
          {/* Stats Cards */}
          <div className="flex gap-[1.2vw] mb-[2vw]">
            <div
              className={clsx(
                "flex-1 rounded-[0.6vw] p-[1.5vw] border shadow-sm",
                theme === "dark"
                  ? "border-[#2A2E37] bg-[#1F222A]"
                  : "border-gray-200 bg-white"
              )}
            >
              <h4 className="text-[0.9vw] font-medium mb-[0.8vw] text-gray-500">
                Total Calls
              </h4>
              <p className="text-[2vw] font-semibold">{stats.totalCalls}</p>
            </div>
            <div
              className={clsx(
                "flex-1 rounded-[0.6vw] p-[1.5vw] border shadow-sm",
                theme === "dark"
                  ? "border-[#2A2E37] bg-[#1F222A]"
                  : "border-gray-200 bg-white"
              )}
            >
              <h4 className="text-[0.9vw] font-medium mb-[0.8vw] text-gray-500">
                Successful Calls
              </h4>
              <p className="text-[2vw] font-semibold text-emerald-600">
                {stats.successfulCalls}
              </p>
            </div>
            <div
              className={clsx(
                "flex-1 rounded-[0.6vw] p-[1.5vw] border shadow-sm",
                theme === "dark"
                  ? "border-[#2A2E37] bg-[#1F222A]"
                  : "border-gray-200 bg-white"
              )}
            >
              <h4 className="text-[0.9vw] font-medium mb-[0.8vw] text-gray-500">
                Failed Calls
              </h4>
              <p className="text-[2vw] font-semibold text-red-600">
                {stats.failedCalls}
              </p>
            </div>
            <div
              className={clsx(
                "flex-1 rounded-[0.6vw] p-[1.5vw] border shadow-sm",
                theme === "dark"
                  ? "border-[#2A2E37] bg-[#1F222A]"
                  : "border-gray-200 bg-white"
              )}
            >
              <h4 className="text-[0.9vw] font-medium mb-[0.8vw] text-gray-500">
                Total Duration (mins)
              </h4>
              <p className="text-[2vw] font-semibold">{stats.totalDuration}</p>
            </div>
          </div>

          {/* Call Results Table */}
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
                    Phone Number
                  </th>
                  <th className="text-left py-[1vw] px-[1.2vw] text-[0.9vw] font-semibold">
                    Status
                  </th>
                  <th className="text-left py-[1vw] px-[1.2vw] text-[0.9vw] font-semibold">
                    Duration
                  </th>
                  <th className="text-left py-[1vw] px-[1.2vw] text-[0.9vw] font-semibold">
                    Agent
                  </th>
                  <th className="text-left py-[1vw] px-[1.2vw] text-[0.9vw] font-semibold">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody>
                {callResults.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="py-[2vw] px-[1.2vw] text-center text-[0.9vw] text-gray-500"
                    >
                      No call results available
                    </td>
                  </tr>
                ) : (
                  callResults.map((result) => {
                    const status = result.status?.toLowerCase?.() ?? "pending";
                    return (
                      <tr
                        key={result.id}
                        className={clsx(
                          "border-b transition-colors",
                          theme === "dark"
                            ? "border-[#2A2E37] hover:bg-[#2A2E37]/30"
                            : "border-gray-200 hover:bg-gray-50"
                        )}
                      >
                        <td className="py-[1.2vw] px-[1.2vw] text-[0.9vw] font-medium text-black">
                          {result.phoneNumber}
                        </td>
                        <td className="py-[1.2vw] px-[1.2vw]">
                          <span
                            className={clsx(
                              "text-[0.8vw] font-semibold px-[0.8vw] py-[0.3vw] rounded-full capitalize inline-block",
                              statusStyles[status] ?? statusStyles.pending
                            )}
                          >
                            {status}
                          </span>
                        </td>
                        <td className="py-[1.2vw] px-[1.2vw] text-[0.9vw] text-gray-500">
                          {result.duration}
                        </td>
                        <td className="py-[1.2vw] px-[1.2vw] text-[0.9vw] text-gray-500">
                          {result.agent}
                        </td>
                        <td className="py-[1.2vw] px-[1.2vw] text-[0.9vw] text-gray-500">
                          {result.date}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampaignDetails;

