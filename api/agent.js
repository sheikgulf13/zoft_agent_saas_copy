import { showErrorToast, showSuccessToast } from "@/Components/toast/success-toast";
import { getApiConfig, getApiHeaders } from "../utility/api-config";
import { CookieManager } from "../utility/cookie-manager"

const getChatAgentList = async () => {
  const session_id = CookieManager.getCookie("session_id");

  try {
    const url = process.env.url;
    const cacheKey = `agentList_${session_id}`;
    const cachedData = localStorage.getItem(cacheKey);
    if (!cachedData) {
      const response = await fetch(`${url}/public/chat_agent/get_agents`, {
        ...getApiConfig(),
        method: "POST",
        headers: new Headers({
          ...getApiHeaders(),
          "Content-Type": "application/json",
        }),
        cache: "no-cache",
      });
      const data = await response.json();
      localStorage.setItem(cacheKey, JSON.stringify(data[0] || []));
    }
  } catch (error) {
    console.error("Error fetching agent list:", error);
  }
};

const getPhoneAgentList = async () => {
  const session_id = CookieManager.getCookie("session_id");
  try {
    const url = process.env.url;
    const cacheKey = `phoneList_${session_id}`;
    const cachedData = localStorage.getItem(cacheKey);

    if (!cachedData) {
      const response = await fetch(`${url}/public/phone_agent/get_agents`, {
        ...getApiConfig(),
        method: "POST",
        headers: new Headers({
          ...getApiHeaders(),
          "Content-Type": "application/json",
        }),
        cache: "no-cache",
      });
      const data = await response.json();
      localStorage.setItem(cacheKey, JSON.stringify(data[0] || []));
    }
  } catch (error) {
    console.error("Error fetching agent list:", error);
  }
};

const deleteChatAgentApi = async (agentId) => {
  const url = process.env.url;
  const formData = new FormData();

  formData.append("chat_agent_id", agentId);

  const result = await fetch(`${url}/public/chat_agent/delete`, {
    ...getApiConfig(),
    method: "post",
    headers: new Headers({
      ...getApiHeaders(),
    }),
    body: formData,
  });

  return result;
};

const deletePhoneAgentApi = async (agentId) => {
  const url = process.env.url;
  const formData = new FormData();

  formData.append("phone_agent_id", agentId);

  const result = await fetch(`${url}/public/phone_agent/delete`, {
    ...getApiConfig(),
    method: "post",
    headers: new Headers({
      ...getApiHeaders(),
    }),
    body: formData,
  });

  return result;
};

const updatePhoneAgentApi = async ({
  id,
  name,
  purpose,
  companyName,
  companyBusiness,
  companyServices,
  voiceId,
  countryCode,
  phoneNumber,
  language,
}) => {
  if (
    !Boolean(
      id &&
        name &&
        purpose &&
        companyName &&
        companyBusiness &&
        companyServices &&
        voiceId &&
        countryCode &&
        phoneNumber &&
        language
    )
  ) {
    return showErrorToast("Please fill all the mandatory fields");
  }

  const url = process.env.url;
  const formData = new FormData();

  formData.append("phone_agent_id", id);
  formData.append("phone_agent_name", name);
  formData.append("conversation_purpose", purpose);
  formData.append("company_name", companyName);
  formData.append("company_business", companyBusiness);
  formData.append("company_products_services", companyServices);
  formData.append("voice_id", voiceId);
  formData.append("country_code", countryCode);
  formData.append("phone_number", phoneNumber);
  formData.append("language", language);

  let result = await fetch(`${url}/public/phone_agent/update_base`, {
    ...getApiConfig(),
    method: "post",
    headers: new Headers({
      ...getApiHeaders(),
    }),
    body: formData,
  });

  if (result.status === 200) {
    showSuccessToast("The phone bot has been successfully updated");
    return true;
  }

  return false;
};

export {
  getChatAgentList,
  getPhoneAgentList,
  deleteChatAgentApi,
  deletePhoneAgentApi,
  updatePhoneAgentApi,
};
