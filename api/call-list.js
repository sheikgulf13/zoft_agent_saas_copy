import { getApiHeaders, getSessionId } from "../utility/api-config";

const getCallListApi = async (phoneAgentId) => {
  const url = process.env.url;
  const sessionId = getSessionId();
  const formData = new FormData();

  formData.append("session_id", sessionId);
  formData.append("phone_agent_id", phoneAgentId);

  let result = await fetch(`${url}/public/phone_agent/get_conversation/by_id`, {
    method: "post",
    body: formData,
    headers: new Headers({
      ...getApiHeaders(),
    }),
  });

  result = result.json();

  return result;
};

export { getCallListApi };
