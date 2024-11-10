import { getApiHeaders, getSessionId } from "../utility/api-config";

const getChatListApi = async (chatAgentId) => {
  const url = process.env.url;
  const sessionId = getSessionId();
  const formData = new FormData();

  formData.append("session_id", sessionId);
  formData.append("chat_agent_id", chatAgentId);

  let result = await fetch(`${url}/public/chat_agent/get_conversation/by_id`, {
    method: "post",
    body: formData,
    headers: new Headers({
      ...getApiHeaders(),
    }),
  });

  result = result.json();

  return result;
};

export { getChatListApi };
