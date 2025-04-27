import { getApiHeaders } from "@/utility/api-config";
import { showSuccessToast } from "../Components/toast/success-toast";

const getIntegrationList = async () => {
  //   const session_id = CookieManager.getCookie("session_id");

  try {
    const url = process.env.url;

    let response = await fetch(`${url}/public/integration`, {
      headers: new Headers({
        ...getApiHeaders(),
      }),
    });

    if(response.status === 401) {
      return window.location.href = "/register";
    }

    if (response.status === 200) {
      response = await response.json();
      return response;
    }

    throw new Error("Failed to fetch integration list");
  } catch (error) {
    console.error("Error fetching agent list:", error);
  }
};

const removeIntegrationApi = async (type) => {
  try {
    const url = process.env.url;

    let response = await fetch(
      `${url}/public/integration?app_integration=${type}`,
      {
        headers: new Headers({
          ...getApiHeaders(),
        }),
        method: "DELETE",
      }
    );

    if (response.status === 200) {
      response = await response.json();

      showSuccessToast("Integration has been removed");

      return response;
    }

    throw new Error("Failed to remove the integration");
  } catch (error) {
    console.error("Error removing integration:", error);
  }
};

export { getIntegrationList, removeIntegrationApi };
