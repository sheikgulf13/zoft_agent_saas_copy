import { CookieManager } from "../utility/cookie-manager"

const getApiConfig = () => {
    return  {
        mode: "cors",
        credentials:'omit',
    }
};

const getApiHeaders = () => {
    const session_id = CookieManager.getCookie("session_id");

    return {
        "ngrok-skip-browser-warning": "true",
        "Authorization": `Bearer ${session_id}`
    }
}


const getSessionId = () => {
  if (typeof window === "undefined") return null;

  return CookieManager.getCookie("session_id") || null;
};

export { getApiConfig, getApiHeaders, getSessionId };
