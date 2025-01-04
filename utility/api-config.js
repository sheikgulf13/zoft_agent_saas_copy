import { CookieManager } from "../utility/cookie-manager"

const getApiConfig = () => {
    return  {
        mode: "cors",
        credentials:'omit',
    }
};

const getApiHeaders = () => {
    return {
        "ngrok-skip-browser-warning": "true"
    }
}

const getSessionId = () => {
    const session_id = CookieManager.getCookie("session_id");

    if(session_id) {
        return session_id;
    }

    if(typeof window !== "undefined") {
        window.location = "/register";
    }
}

export { getApiConfig, getApiHeaders, getSessionId };
