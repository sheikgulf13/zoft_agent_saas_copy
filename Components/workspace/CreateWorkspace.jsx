"use client";

import React, { Suspense, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import useTheme from "next-theme";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  setelevenlabskey,
  setopenaikey,
  settwilioauthtoken,
  settwiliosid,
  setworkspacename,
} from "@/store/reducers/workspaceSlice";
import Modal from "../Modal";
import { GrFormEdit } from "react-icons/gr";
import { getApiConfig, getApiHeaders } from "../../utility/api-config";
import { ContainedButton } from "../../Components/buttons/ContainedButton";
import { OutlinedButton } from "../../Components/buttons/OutlinedButton";
import { PageLoader } from "../loaders/page-loader";
import { CookieManager } from "../../utility/cookie-manager";

export const dynamic = "force-dynamic";

const Content = () => {
  const dispatch = useDispatch();
  const {
    workspacename,
    twilioauthtoken,
    twiliosid,
    elevenlabskey,
    openaikey,
  } = useSelector((state) => state.workspace);
  const navigate = useRouter();
  const { theme } = useTheme();
  const searchParams = useSearchParams();
  const workspace_id = searchParams.get("workspaceId");
  const [modal, setModal] = useState(false);
  const [workspace, setWorkspace] = useState({});
  const [filteredWorkspace, setFilteredWorkspace] = useState({});
  const [err, setErr] = useState("");
  const [isLoading, setLoader] = useState(true);

  const formdata = new FormData();
  formdata.append("workspace_id", workspace_id);
  formdata.append("workspace_name", workspacename);
  formdata.append("twilio_SSID", twiliosid);
  formdata.append("twilio_auth_token", twilioauthtoken);
  formdata.append("elevenlabs_api_key", elevenlabskey);
  formdata.append("openai_api_key", openaikey);
  const url = process.env.url;

  useEffect(() => {
    const getWorkspaceList = async () => {
      try {
        const response = await fetch(`${url}/public/workspace/get_workspace`, {
          ...getApiConfig(),
          method: "GET",
          headers: new Headers({
            ...getApiHeaders(),
            "Content-Type": "application/json",
          }),
          cache: "no-cache",
        });
        const data = await response.json();
        setWorkspace(data || []);
        setLoader(false);
      } catch (error) {
        console.log("Error fetching workspace list:", error);
      }
    };
    getWorkspaceList();
  }, [url]);

  useEffect(() => {
    if (workspace.length > 0 && workspace_id) {
      // Filter out the object that matches the route id
      const matchedId = workspace.find((item) => item.id === workspace_id);
      setFilteredWorkspace(matchedId);
      console.log(matchedId);
    }
  }, [workspace, workspace_id]);

  useEffect(() => {
    if (filteredWorkspace) {
      dispatch(
        setworkspacename(filteredWorkspace?.workspace_name || workspacename)
      );
      dispatch(settwiliosid(filteredWorkspace?.twilio_SSID || ""));
      dispatch(settwilioauthtoken(filteredWorkspace?.twilio_auth_token || ""));
      dispatch(setelevenlabskey(filteredWorkspace?.elevenlabs_api_key || ""));
      dispatch(setopenaikey(filteredWorkspace?.openai_api_key || ""));
    }
  }, [filteredWorkspace, dispatch]); // Add dispatch as a dependency

  const saveHandler = async () => {
    if (workspace.find((item) => item.id === workspace_id)) {
      if (
        filteredWorkspace?.workspace_name !== workspacename ||
        filteredWorkspace?.twilio_SSID !== twiliosid ||
        filteredWorkspace?.twilio_auth_token !== twilioauthtoken ||
        filteredWorkspace?.elevenlabs_api_key !== elevenlabskey ||
        filteredWorkspace?.openai_api_key !== openaikey
      ) {
        console.log(twilioauthtoken);

        // Send updated data to the server
        const response = await fetch(`${url}/public/workspace/update`, {
          ...getApiConfig(),
          method: "POST",
          headers: new Headers({
            ...getApiHeaders(),
          }),
          body: formdata,
        });

        navigate.push("/workspace");
      }
    } else {
      const response = await fetch(`${url}/public/workspace/create_test`, {
        ...getApiConfig(),
        method: "POST",
        headers: new Headers({
          ...getApiHeaders(),
        }),
        body: formdata,
      });

      navigate.push("/workspace");
    }
  };

  if (isLoading) {
    return <PageLoader />;
  }

  return (
    <div
      className={`w-full Hmd h-screen relative flex flex-col justify-between ${
        theme === "dark" ? "bg-[#1F222A] text-white" : "bg-[#F2F4F7] text-black"
      }`}
    >
      <div className="w-full flex flex-col justify-start items-start px-[2vw]">
        <div
          className="flex w-full overflow-hidden"
          style={{ height: "calc(100vh - 90px)" }}
        >
          <div
            className={`flex flex-col w-full items-start justify-start gap-[4vw] mx-[5vw] p-[2vw] pt-[1vw] mt-[2vw] overflow-y-scroll scrollbar ${
              theme === "dark" ? "scrollbar-dark" : "scrollbar-light"
            }`}
          >
            <div
              className={`flex flex-col min-w-[90%] max-w-[90%] shadow-md rounded-lg p-[2vw] ${
                theme === "dark" ? "bg-[#2A2D36] border border-[#3A3D46]" : "bg-white border border-gray-200"
              }`}
            >
              <div
                className={`flex justify-start items-center gap-[1%] mb-[2%] rounded-lg ${
                  theme === "dark"
                    ? "bg-[#1F222A] text-white"
                    : "bg-gray-100 text-black"
                }`}
              >
                <input
                  type="text"
                  onChange={(e) => dispatch(setworkspacename(e.target.value))}
                  value={workspacename}
                  style={{ width: `${workspacename.length + 0.5}ch` }}
                  className={`${
                    theme === "dark" ? "text-white" : "text-black"
                  } bg-transparent capitalize font-semibold text-lg m-[1%] ml-[3%] outline-none focus:ring-2 focus:ring-[#4D55CC] rounded-md transition-all duration-200`}
                ></input>
                <GrFormEdit
                  className={`${
                    theme === "dark" ? "text-white" : "text-black"
                  } text-[160%] hover:scale-[130%] transition-transform duration-200`}
                />
              </div>

              <div
                className={`flex flex-col gap-[1vw] items-start justify-center rounded-lg p-[1.5vw] ${
                  theme === "dark"
                    ? "bg-[#1F222A] text-white"
                    : "bg-gray-100 text-black"
                }`}
              >
                <div>
                  <h5 className="font-bold text-lg text-[#2D3377]/90 dark:text-[#6B73E6]">
                    Twilio integration - optional
                  </h5>
                  <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                    Setup your twilio account
                  </p>
                </div>
                <div className="flex gap-[4vw] w-full">
                  <div className="flex flex-col gap-[.3vw] w-[50%]">
                    <h4 className="font-bold text-lg">SSID</h4>
                    <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                      Paste your twilio account SSID
                    </p>
                    <input
                      type="text"
                      onChange={(e) => dispatch(settwiliosid(e.target.value))}
                      value={twiliosid}
                      className={`${
                        theme === "dark"
                          ? "bg-[#1A1C22] text-white border-[#3A3D46]"
                          : "bg-white text-black border-gray-200"
                      } h-[2.5vw] p-[1vw] outline-none rounded-lg border focus:ring-2 focus:ring-[#2D3377]/90 transition-all duration-200`}
                    />
                  </div>
                  <div className="flex flex-col gap-[.3vw] w-[50%]">
                    <h4 className="font-bold text-lg">AUTH TOKEN</h4>
                    <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                      Paste your twilio AUTH TOKEN
                    </p>
                    <input
                      type="text"
                      onChange={(e) =>
                        dispatch(settwilioauthtoken(e.target.value))
                      }
                      value={twilioauthtoken}
                      className={`${
                        theme === "dark"
                          ? "bg-[#1A1C22] text-white border-[#3A3D46]"
                          : "bg-white text-black border-gray-200"
                      } h-[2.5vw] p-[1vw] outline-none rounded-lg border focus:ring-2 focus:ring-[#2D3377]/90 transition-all duration-200`}
                    />
                  </div>
                </div>
                <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                  To be able to assign our agents to a phone number you'll need
                  a twilio account. if you don't have a twilio account, you can{" "}
                  <Link
                    href={""}
                    className="underline text-[#2D3377]/90 hover:text-[#2D3377]/90 transition-colors duration-200"
                  >
                    sign-up
                  </Link>{" "}
                  for a free trial. [No credit card or monthly commitments
                  required ]
                </p>
              </div>

              <div className="w-full h-[0.1vw] bg-gray-100 dark:bg-[#3A3D46] my-[1.2vw]" />

              <div
                className={`flex flex-col gap-[1.5vw] items-start justify-center rounded-lg p-[1.5vw] ${
                  theme === "dark"
                    ? "bg-[#1F222A] text-white"
                    : "bg-gray-100 text-black"
                }`}
              >
                <div>
                  <h5 className="font-bold text-lg text-[#2D3377]/90 dark:text-[#6B73E6]">
                    Elevenlabs integration - optional
                  </h5>
                  <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                    Connect your elevenlabs account to import your voices
                  </p>
                </div>

                <div className="flex flex-col gap-[.3vw] w-[100%]">
                  <h4 className="font-bold text-lg">API Key</h4>
                  <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                    Insert your elevenlabs API
                  </p>
                  <input
                    type="text"
                    onChange={(e) => dispatch(setelevenlabskey(e.target.value))}
                    value={elevenlabskey}
                    className={`${
                      theme === "dark"
                        ? "bg-[#1A1C22] text-white border-[#3A3D46]"
                        : "bg-white text-black border-gray-200"
                    } h-[2.5vw] p-[1vw] outline-none rounded-lg border focus:ring-2 focus:ring-[#2D3377]/90 transition-all duration-200`}
                  />
                </div>
                <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                  Don't have an Elevenlabs account?{" "}
                  <Link
                    href={""}
                    className="underline text-[#2D3377]/90 hover:text-[#2D3377]/90 transition-colors duration-200"
                  >
                    Sign-up here
                  </Link>{" "}
                  for a free account and import your voices instantly into{" "}
                  <br /> Kayzen
                </p>
              </div>

              <div className="w-full h-[.1vw] bg-gray-100 dark:bg-[#3A3D46] my-[1.2vw]" />

              <div
                className={`flex flex-col gap-[1.5vw] items-start justify-center rounded-lg p-[1.5vw] ${
                  theme === "dark"
                    ? "bg-[#1F222A] text-white"
                    : "bg-gray-100 text-black"
                }`}
              >
                <div>
                  <h5 className="font-bold text-lg text-[#2D3377]/90 dark:text-[#6B73E6]">
                    OpenAI integration - optional
                  </h5>
                  <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                    Insert your own openAI key here to use a different model
                    than the default [3.5-turbo] inside your agents.
                  </p>
                </div>

                <div className="flex flex-col gap-[.3vw] w-[100%]">
                  <div className="flex gap-[.5vw]">
                    <h4 className="font-bold text-lg">API Key</h4>
                    {err && openaikey === "" && (
                      <span className="text-red-500 capitalize Hsm font-medium">
                        *API Key required
                      </span>
                    )}
                  </div>
                  <p className="text-gray-500 dark:text-gray-400 text-base font-medium">
                    Insert your OpenAI Key below
                  </p>
                  <input
                    type="text"
                    onChange={(e) => dispatch(setopenaikey(e.target.value))}
                    value={openaikey}
                    className={`${
                      theme === "dark"
                        ? "bg-[#1A1C22] text-white border-[#3A3D46]"
                        : "bg-white text-black border-gray-200"
                    } h-[2.5vw] p-[1vw] outline-none rounded-lg border focus:ring-2 focus:ring-[#2D3377]/90 transition-all duration-200`}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {modal && (
          <Modal open={modal}>
            <div
              className={`flex flex-col gap-[2vw] rounded-lg items-center w-[20vw] ${
                theme === "dark" ? "bg-[#2A2D36]" : "bg-white"
              } p-6`}
            >
              <div className="flex flex-col gap-[.5vw] items-center">
                <h4 className="text-lg font-bold text-[#4D55CC] dark:text-[#6B73E6]">
                  Are your sure you want to Delete?
                </h4>
                <p className="text-base font-medium text-center text-gray-500 dark:text-gray-400">
                  this workspace and all of its data and configuration will be
                  deleted
                </p>
              </div>
              <div className="flex items-center gap-[2vw]">
                <button
                  onClick={() => setModal(false)}
                  className="text-lg font-bold text-gray-600 dark:text-gray-300 hover:text-[#4D55CC] dark:hover:text-[#6B73E6] transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  className="bg-red-500 hover:bg-red-600 text-white text-lg font-bold px-[.5vw] py-[.25vw] rounded-lg transition-colors duration-200"
                >
                  Delete
                </button>
              </div>
            </div>
          </Modal>
        )}
      </div>
      <div className={`h-[40px] bg-white flex items-center justify-end p-7 `}>
        <div className="w-full h-full flex justify-end items-center gap-[2vw] px-[3vw] pr-[10%] py-[1vw]">
          <OutlinedButton onClick={() => navigate.push("/workspace")} borderColor="border-2 border-[#8b8b8b] text-[#8b8b8b] hover:border-[#333333] hover:text-[#333333] py-[0.3vw]">
            Cancel
          </OutlinedButton>
          <ContainedButton onClick={saveHandler} className="py-[0.35vw]">Save Changes</ContainedButton>
        </div>
      </div>
    </div>
  );
};

const CreateWorkspace = () => {
  return (
    <Suspense fallback={"Loading..."}>
      <Content />
    </Suspense>
  );
};

export default CreateWorkspace;
