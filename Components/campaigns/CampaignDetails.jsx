"use client";

import React, { useEffect, useMemo, useState } from "react";
import useTheme from "next-theme";
import { useRouter } from "next/navigation";
import clsx from "clsx";
import { fetchCampaignDetails } from "@/services/campaigns";

const defaultStats = {
  totalCalls: 0,
  successfulCalls: 0,
  failedCalls: 0,
  totalDuration: 0,
};

const aggregateHistoryStats = (history = []) => {
  if (!Array.isArray(history) || history.length === 0) {
    return defaultStats;
  }

  return history.reduce(
    (acc, entry) => {
      acc.totalCalls += 1;
      const status = entry.call_status?.toLowerCase?.();
      if (status === "completed") {
        acc.successfulCalls += 1;
      } else if (status === "failed") {
        acc.failedCalls += 1;
      }

      const durationValue =
        entry.duration_in_mins ??
        entry.duration ??
        (typeof entry.duration_in_sec === "number"
          ? entry.duration_in_sec / 60
          : 0);
      const duration = Number(durationValue);
      acc.totalDuration += Number.isFinite(duration) ? duration : 0;
      return acc;
    },
    { ...defaultStats }
  );
};

const CampaignDetails = ({ campaignId }) => {
  const router = useRouter();
  const { theme } = useTheme();
  const [stats, setStats] = useState(defaultStats);
  const [callResults, setCallResults] = useState([]);
  const [campaign, setCampaign] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const normalizedStats = useMemo(
    () => ({
      totalCalls: stats.totalCalls ?? defaultStats.totalCalls,
      successfulCalls: stats.successfulCalls ?? defaultStats.successfulCalls,
      failedCalls: stats.failedCalls ?? defaultStats.failedCalls,
      totalDuration: stats.totalDuration ?? defaultStats.totalDuration,
    }),
    [stats]
  );

  const historyStats = useMemo(
    () => aggregateHistoryStats(callResults),
    [callResults]
  );
  const displayStats = callResults.length ? historyStats : normalizedStats;
  const campaignName = useMemo(() => {
    const name = campaign?.campaign_name;
    if (typeof name === "string" && name.trim()) {
      return name.trim();
    }
    return "Untitled Campaign";
  }, [campaign]);

  useEffect(() => {
    let isMounted = true;

    const loadCampaignDetails = async () => {
      if (!campaignId) {
        setError("Missing campaign identifier.");
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError("");

      try {
        const response = await fetchCampaignDetails(campaignId);
        if (!isMounted) return;

        const payload = response?.data ?? response ?? {};
        const remoteStats = payload.stats ?? payload;
        const history =
          payload.phone_agent_history ??
          payload.callResults ??
          payload.call_results ??
          payload.results ??
          [];
        const campaignData = payload.campaign ?? {};
        const campaignCounters = {
          totalCalls:
            campaignData.calls_counter_scheduled ??
            campaignData.total_calls ??
            history.length ??
            defaultStats.totalCalls,
          successfulCalls:
            campaignData.calls_counter_ended ??
            campaignData.successful_calls ??
            defaultStats.successfulCalls,
          failedCalls:
            campaignData.calls_counter_voice_mail ??
            campaignData.failed_calls ??
            defaultStats.failedCalls,
          totalDuration:
            campaignData.total_duration ??
            campaignData.totalDuration ??
            defaultStats.totalDuration,
        };

        setStats({
          totalCalls:
            remoteStats?.totalCalls ??
            remoteStats?.total_calls ??
            remoteStats?.total ??
            campaignCounters.totalCalls,
          successfulCalls:
            remoteStats?.successfulCalls ??
            remoteStats?.successful_calls ??
            remoteStats?.success ??
            campaignCounters.successfulCalls,
          failedCalls:
            remoteStats?.failedCalls ??
            remoteStats?.failed_calls ??
            remoteStats?.failed ??
            campaignCounters.failedCalls,
          totalDuration:
            remoteStats?.totalDuration ??
            remoteStats?.total_duration ??
            remoteStats?.duration ??
            campaignCounters.totalDuration,
        });
        setCallResults(Array.isArray(history) ? history : []);
        setCampaign(campaignData);
      } catch (err) {
        if (!isMounted) return;
        setError(err?.message ?? "Unable to load campaign details.");
        setStats(defaultStats);
        setCallResults([]);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadCampaignDetails();

    return () => {
      isMounted = false;
    };
  }, [campaignId]);

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
        <div className="flex flex-wrap gap-[1.2vw] items-center justify-between w-full pb-[.6vw] border-b border-zinc-200">
          <div className="flex items-center gap-[1.2vw]">
            <button
              type="button"
              onClick={() => router.push("/campaigns")}
              className={clsx(
                "text-[0.9vw] bg-gray-200 hover:bg-gray-300 rounded-[.6vw] px-[.6vw] py-[.4vw] cursor-pointer",
                theme === "dark" ? "text-gray-400" : "text-gray-600"
              )}
            >
              ← 
            </button>
            <h2 className="text-[.9vw] font-bold">Outbound Calls</h2>
          </div>
        </div>

        <div className="flex flex-col items-start gap-[0.4vw] pt-[1vw]">
          <h2 className="text-[.95vw] font-semibold text-gray-700">
            {campaignName}
          </h2>
          <h2 className="text-[.8vw] font-semibold text-gray-500">
            {campaignName}
          </h2>
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
              <p className="text-[2vw] font-semibold">
                {displayStats.totalCalls}
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
                Completed Calls
              </h4>
              <p className="text-[2vw] font-semibold text-emerald-600">
                {displayStats.successfulCalls}
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
                {displayStats.failedCalls}
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
              <p className="text-[2vw] font-semibold">
                {displayStats.totalDuration}
              </p>
            </div>
          </div>

          {/* Call Results Table */}
          <div className="overflow-x-auto">
            {error ? (
              <div className="py-[1vw] text-red-500 text-[0.9vw]">
                {error}
              </div>
            ) : null}
            <table className="w-full border-collapse">
              <thead className="text-black">
                <tr
                  className={clsx(
                    "border-b",
                    theme === "dark" ? "border-[#2A2E37]" : "border-gray-200"
                  )}
                >
                  <th className="text-left py-[1vw] px-[1.2vw] text-[0.9vw] font-semibold">
                    Call ID
                  </th>
                  <th className="text-left py-[1vw] px-[1.2vw] text-[0.9vw] font-semibold">
                    To
                  </th>
                  <th className="text-left py-[1vw] px-[1.2vw] text-[0.9vw] font-semibold">
                    Duration (mins)
                  </th>
                  <th className="text-left py-[1vw] px-[1.2vw] text-[0.9vw] font-semibold">
                    Status
                  </th>
                  <th className="text-left py-[1vw] px-[1.2vw] text-[0.9vw] font-semibold">
                    Created At
                  </th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="py-[2vw] px-[1.2vw] text-center text-[0.9vw] text-gray-500"
                    >
                      Loading campaign details...
                    </td>
                  </tr>
                ) : callResults.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="py-[2vw] px-[1.2vw] text-center text-[0.9vw] text-gray-500"
                    >
                      No call results available
                    </td>
                  </tr>
                ) : (
                  callResults.map((result, index) => {
                    const status =
                      result.call_status?.toLowerCase?.() ?? "pending";
                    const callId =
                      result.call_id?.trim?.() || "—";
                    const formattedTo =
                      result.to?.trim?.() ||
                      result.phone_number ||
                      result.phoneNumber ||
                      "—";
                    const duration =
                      typeof result.duration_in_mins === "number" &&
                      !Number.isNaN(result.duration_in_mins)
                        ? result.duration_in_mins
                        : result.duration ?? result.duration_in_sec ?? "—";
                    const createdAt = (() => {
                      if (!result.created_at) return "—";
                      const date = new Date(result.created_at);
                      return Number.isNaN(date.getTime())
                        ? "—"
                        : date.toLocaleString();
                    })();
                    return (
                      <tr
                        key={
                          result.call_id ??
                          result.id ??
                          result.twilio_call_SID ??
                          `history-${index}`
                        }
                        className={clsx(
                          "border-b transition-colors",
                          theme === "dark"
                            ? "border-[#2A2E37] hover:bg-[#2A2E37]/30"
                            : "border-gray-200 hover:bg-gray-50"
                        )}
                      >
                        <td className="py-[1.2vw] px-[1.2vw] text-[0.9vw] font-medium text-black">
                          {String(callId).slice(0, 15) + "..."}
                        </td>
                        <td className="py-[1.2vw] px-[1.2vw] text-[0.9vw] text-gray-500">
                          {formattedTo}
                        </td>
                        <td className="py-[1.2vw] px-[1.2vw] text-[0.9vw] text-gray-500">
                          {duration}
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
                          {createdAt}
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

