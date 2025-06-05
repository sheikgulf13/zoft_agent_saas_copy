import { CookieManager } from "@/utility/cookie-manager";
import { getApiConfig, getApiHeaders } from "../utility/api-config";

const getWorkSpaceListApi = async () => {
  const url = process.env.url;

  let response = await fetch(`${url}/public/workspace/get_workspace`, {
    ...getApiConfig(),
    method: "GET",
    headers: new Headers({
      ...getApiHeaders(),
      "Content-Type": "application/json",
    }),
    cache: "no-cache",
  });

  if(response.status === 401) {
    return window.location.href = "/login";
  }

  if (response.status === 200) {
    response = await response.json();

    return response;
  }

  return null;
};

const getAgentsForWorkSpaceApi = async (workspaceId) => {
  const url = process.env.url;
  const formdata = new FormData();

  formdata.append("workspace_id", workspaceId);

  let response = await fetch(`${url}/public/workspace/get_agents`, {
    ...getApiConfig(),
    method: "POST",
    body: formdata,
    headers: new Headers({
      ...getApiHeaders(),
    }),
    cache: "no-cache",
  });

  const contentType = response.headers.get("content-type");

  if (response.status === 200 && contentType === "application/json") {
    response = await response.json();

    return response;
  }

  return null;
};

const deleteWorkSpaceApi = async (workspaceId) => {
  const url = process.env.url;
  const formdata = new FormData();

  formdata.append("workspace_id", workspaceId);

  let response = await fetch(`${url}/public/workspace/delete`, {
    ...getApiConfig(),
    method: "POST",
    body: formdata,
    headers: new Headers({
      ...getApiHeaders(),
    }),
    cache: "no-cache",
  });

  if (response.status === 200) {
    return true
  }

  return false;
};

export { getWorkSpaceListApi, getAgentsForWorkSpaceApi, deleteWorkSpaceApi };
