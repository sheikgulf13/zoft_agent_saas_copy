import { getCookie } from "cookies-next";

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
    const session_id = getCookie("session_id");

    if(session_id) {
        return session_id;
    }

    window.location = "/register";
}

export { getApiConfig, getApiHeaders, getSessionId };
