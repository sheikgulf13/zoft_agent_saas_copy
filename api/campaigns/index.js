import { getApiConfig, getApiHeaders } from "@/utility/api-config";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_CAMPAIGNS_API_BASE_URL ?? "http://localhost:3000";

const buildUrl = (path) =>
  `${API_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;

const buildWorkspaceUrl = (path) => {
  const workspaceBase = process.env.url;
  return `${workspaceBase}${path.startsWith("/") ? path : `/${path}`}`;
};

const GENERIC_ERROR =
  "Something went wrong while talking to campaigns service. Please try again.";

const parseJson = async (response) => {
  const text = await response.text();
  if (!response.ok) {
    throw new Error(GENERIC_ERROR);
  }

  try {
    return text ? JSON.parse(text) : {};
  } catch {
    throw new Error(GENERIC_ERROR);
  }
};

export const fetchCampaigns = async () => {
  try {
    const response = await fetch(buildUrl("/campaigns"), {
      method: "GET",
      cache: "no-store",
    });
    return await parseJson(response);
  } catch (error) {
    throw new Error(GENERIC_ERROR);
  }
};

export const fetchVoices = async () => {
  try {
    const response = await fetch(buildUrl("/voices"), {
      method: "GET",
      cache: "no-store",
    });
    return await parseJson(response);
  } catch {
    throw new Error(GENERIC_ERROR);
  }
};

export const createCampaign = async (payload) => {
  try {
    const response = await fetch(buildUrl("/campaigns"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    return await parseJson(response);
  } catch {
    throw new Error(GENERIC_ERROR);
  }
};

export const launchCampaign = async ({
  campaignName,
  campaignDescription = "",
  agentId,
  columnMap,
  scheduleType = "immediate",
  scheduledAt,
  csvFile,
}) => {
  if (!campaignName || !agentId || !csvFile) {
    throw new Error("Missing required campaign data.");
  }

  try {
    const formData = new FormData();
    formData.append("campaign_name", campaignName);
    if (campaignDescription) {
      formData.append("campaign_description", campaignDescription);
    }
    formData.append("agent_id", agentId);
    formData.append("column_map", JSON.stringify(columnMap ?? {}));
    formData.append("schedule_type", scheduleType);
    formData.append(
      "scheduled_at",
      scheduleType === "schedule" && scheduledAt ? String(scheduledAt) : ""
    );
    formData.append("csv_file", csvFile);

    const response = await fetch(
      buildWorkspaceUrl("/public/campaign/create_test"),
      {
        ...getApiConfig(),
        method: "POST",
        headers: new Headers({
          ...getApiHeaders(),
        }),
        body: formData,
        cache: "no-cache",
      }
    );
    return await parseJson(response);
  } catch {
    throw new Error(GENERIC_ERROR);
  }
};

export default {
  fetchCampaigns,
  fetchVoices,
  createCampaign,
  launchCampaign,
};

