"use client";

import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import useTheme from "next-theme";
import { usePathname, useRouter } from "next/navigation";
import GradientButton from "../buttons/GradientButton";
import TickIcon from "../Icons/TickIcon";
import { TiArrowSortedDown } from "react-icons/ti";
import ActionForm from "./ActionForm";
import {
  removeAction,
  upsertAction,
  setPrompt,
  setScript,
  setPhoneAgentId,
} from "@/store/actions/phoneAgentActions";
import DeleteIcon from "../Icons/DeleteIcon";
import SettingIcon from "../Icons/SettingIcon";
import { v4 as uuidv4 } from "uuid";
import Modal from "../Modal";
import Link from "next/link";
import { OutlinedButton } from "../buttons/OutlinedButton";
import { ContainedButton } from "../buttons/ContainedButton";
import { IoMdInformationCircleOutline } from "react-icons/io";
import { CookieManager } from "@/utility/cookie-manager";
import { getApiConfig, getApiHeaders } from "@/utility/api-config";

import { IoMailOutline } from "react-icons/io5";
import { BsFillTelephoneForwardFill, BsTelephoneForward } from "react-icons/bs";

import {
  addMultiplePhoneActions,
  upsertAction as upsertActionPhone,
} from "@/store/reducers/phoneAgentSlice";
import { clearState as clearPhoneAgentState } from "@/store/actions/phoneAgentActions";

import { MdOutlineWebhook } from "react-icons/md";

import { LuCalendarClock } from "react-icons/lu";
import {
  clearSelectedAgents,
  clearSelectedData,
} from "@/store/reducers/selectedDataSlice";
import { showErrorToast, showSuccessToast } from "../toast/success-toast";

const promptFields = [
  {
    label: "Agent Name",
    value: "phone_agent_name",
  },
  {
    label: "Agent Purpose",
    value: "phone_agent_purpose",
  },
  {
    label: "Company's Name",
    value: "company_name",
  },
  {
    label: "Company's Business",
    value: "company_business",
  },
  {
    label: "Company's Services",
    value: "company_product_services",
  },
];

const Actions = ({ editPage }) => {
  const dispatch = useDispatch();
  const {
    phoneAgentType,
    phoneAgentName,
    phoneAgentPurpose,
    language,
    gender,
    voice,
    countryCode,
    phoneNumber,
    companyName,
    companyBusiness,
    companyServices,
    createdActions,
    prompt,
    script,
  } = useSelector((state) => state.phoneAgent);

  const { selectedPhoneAgent } = useSelector((state) => state.selectedData);
  const pathname = usePathname();
  const pathSegments = pathname.split("/").filter(Boolean);
  const navigate = useRouter();
  const { theme, setTheme } = useTheme();
  //const [progress, setprogress] = useState(false)
  //const [openAccordion01, setOpenAccordion01] = useState(true)
  //const [openAccordion02, setOpenAccordion02] = useState(false)

  const [showForm, setShowForm] = useState(false);
  const [selectedAction, setSelectedAction] = useState(null);
  const [modal, setModal] = useState(false);
  const promptRef = useRef();
  const { selectedWorkSpace } = useSelector((state) => state.selectedData);
  const [tempActions, setTempActions] = useState([]);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [initialActions, setInitialActions] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const urlFetch = process.env.url;

  console.log(selectedWorkSpace);
  console.log(
    "selectedPhoneAgent",
    selectedPhoneAgent?.actions && JSON.parse(selectedPhoneAgent?.actions)
  );
  console.log("createdActions", createdActions);

  useEffect(() => {
    // Only clear selected agents if we're not in phonesetting and not in edit mode
    if (!pathSegments.includes("phonesetting") && !editPage) {
      dispatch(clearSelectedAgents());
      dispatch({ type: "phoneAgent/setCreatedActions", payload: [] });
    }
  }, []);

  useEffect(() => {
    console.log("phone agent", phoneAgentName, phoneAgentPurpose);
  }, [phoneAgentName, phoneAgentPurpose]);

  const handleClear = () => {
    //dispatch(clearPhoneAgentState());
  };

  function fromSnakeCase(input) {
    return input
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }

  useEffect(() => {
    // Only load actions if we're in edit mode and have a selected phone agent
    if (
      editPage &&
      selectedPhoneAgent?.actions &&
      !pathname.includes("/workspace/agents/phone/actions")
    ) {
      try {
        const selectedData = JSON.parse(selectedPhoneAgent?.actions);
        if (selectedData && Array.isArray(selectedData)) {
          dispatch(addMultiplePhoneActions(selectedData));
          setTempActions(selectedData);
          setInitialActions(selectedData);
        }
      } catch (error) {
        console.error("Failed to parse actions:", error);
      }
    }
  }, [selectedPhoneAgent, editPage]);

  console.log("createdActions", createdActions);

  const toggleForm = () => {
    setShowForm(!showForm);
    if (!showForm) {
      // If opening form, reset selected action
      setSelectedAction(null);
    }
  };

  const handleDelete = (actionId) => {
    console.log("Attempting to delete action with ID:", actionId);
    const updatedActions = tempActions.filter(
      (action) => action.id !== actionId
    );
    setTempActions(updatedActions);
    setHasUnsavedChanges(true);
  };

  const handleEditAction = (actionId) => {
    const editAction = tempActions.find((act) => act.id === actionId);
    if (editAction) {
      setSelectedAction(editAction);
      setShowForm(true);
    }
  };

  const handleCreateAction = (newAction) => {
    const actionWithId = { ...newAction, id: newAction.id || uuidv4() };

    // Update temporary actions
    const updatedTempActions = tempActions.map((action) =>
      action.id === actionWithId.id ? actionWithId : action
    );
    if (!tempActions.find((action) => action.id === actionWithId.id)) {
      updatedTempActions.push(actionWithId);
    }
    setTempActions(updatedTempActions);
    setHasUnsavedChanges(true);

    // Update Redux state
    dispatch(addMultiplePhoneActions(updatedTempActions));

    setShowForm(false);
    setSelectedAction(null);
  };

  const createPhoneAgent = async () => {
    const formdata = new FormData();
    formdata.append("work_space_id", selectedWorkSpace);
    formdata.append("phone_agent_type", phoneAgentType);
    formdata.append("phone_agent_name", phoneAgentName);
    formdata.append("conversation_purpose", phoneAgentPurpose);
    formdata.append("language", language);
    formdata.append("voice_id", voice);
    formdata.append("country_code", "");
    formdata.append("phone_number", phoneNumber);
    formdata.append("company_name", companyName);
    formdata.append("company_business", companyBusiness);
    formdata.append("company_products_services", companyServices);
    formdata.append("created_actions", JSON.stringify(createdActions));
    formdata.append("prompt", prompt);
    formdata.append("script", script);
    // formdata.append("use_tools", "false");
    formdata.append("voice_gender", gender);
    // formdata.append("voice_adv_setting", advancedSetting ? "true" : "false");
    // formdata.append("voice_adv_stability", stability);
    // formdata.append("voice_adv_similarity", similarity);
    // formdata.append("voice_adv_style", exaggeration);
    // formdata.append("voice_adv_speaker", speakerBoost ? "true" : "false");
    // console.log(formdata,gender,stability,similarity)
    const url = process.env.url;
    let response = await fetch(`${url}/public/phone_agent/create_test`, {
      ...getApiConfig(),
      method: "POST",
      headers: new Headers({
        ...getApiHeaders(),
      }),
      body: formdata,
    });

    console.log(response);

    if (response.status === 200) {
      response = await response.json();
      dispatch(setPhoneAgentId(response.phone_agent_id));
      navigate.push("/workspace/agents/phone/preview");
    }
  };

  const handleSaveChanges = async () => {
    setIsSaving(true);
    try {
      const formData = new FormData();
      formData.append("workspace_id", selectedWorkSpace);
      formData.append("phone_agent_id", selectedPhoneAgent.id);
      formData.append("actions", JSON.stringify(tempActions) || []);
      const response = await fetch(
        `${urlFetch}/public/phone_agent/update_actions`,
        {
          ...getApiConfig(),
          method: "POST",
          headers: new Headers({
            ...getApiHeaders(),
          }),
          body: formData,
        }
      );

      const data = await response.json();
      console.log("data", response.status);

      if (response.status === 200) {
        // First update Redux state
        dispatch(addMultiplePhoneActions(tempActions));
        // Then update local state
        setInitialActions(tempActions);
        setHasUnsavedChanges(false);
        showSuccessToast("Actions updated successfully");
      } else {
        // First update Redux state
        dispatch(addMultiplePhoneActions(initialActions));
        // Then update local state
        setTempActions(initialActions);
        setHasUnsavedChanges(false);
        showErrorToast(data.message || "Failed to update actions");
        console.error("Failed to update actions:", data.message);
      }
    } catch (error) {
      // First update Redux state
      dispatch(addMultiplePhoneActions(initialActions));
      // Then update local state
      setTempActions(initialActions);
      setHasUnsavedChanges(false);
      showErrorToast("Failed to save changes");
      console.error("Failed to save changes:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelChanges = () => {
    setTempActions(initialActions);
    dispatch(addMultiplePhoneActions(initialActions));
    setHasUnsavedChanges(false);
  };

  return (
    <div
      className={`w-full h-screen relative flex justify-between ${
        theme === "dark" ? "bg-[#1F222A] text-white" : "bg-[#F2F4F7] text-black"
      }`}
    >
      <div className="h-full w-full flex flex-col justify-start items-start px-8 pb-8">
        {!editPage && (
          <div
            className={`w-full absolute top-0 left-[50%] translate-x-[-50%] border-b border-zinc-300 p-6 h-[72px] flex justify-center items-center ${
              theme === "dark"
                ? "bg-[#1A1C21] text-white"
                : "bg-white text-black"
            }`}
          >
            <div className="w-[75%] h-full flex items-center justify-center gap-4">
              <div className="h-full flex items-center justify-start gap-2">
                <div className="w-8 h-8 rounded-full bg-green-600 flex justify-center items-center">
                  <TickIcon />
                </div>
                <h2 className="capitalize font-medium text-lg">
                  phonebot creation
                </h2>
              </div>

              <div className="h-[1px] w-12 bg-zinc-300"></div>

              <div className="h-full flex items-center justify-start gap-2">
                <div className="w-8 h-8 rounded-full border-2 border-cyan-500 text-blue-400 flex justify-center items-center">
                  2
                </div>
                <h2 className="capitalize font-medium text-lg">actions</h2>
              </div>

              <div className="h-[1px] w-12 bg-zinc-300"></div>

              <div className="h-full flex items-center justify-start gap-2 opacity-40">
                <div className="w-8 h-8 rounded-full border-2 border-cyan-500 text-blue-400 flex justify-center items-center">
                  3
                </div>
                <h2 className="capitalize font-medium text-lg">Preview</h2>
              </div>
            </div>
          </div>
        )}

        <div className="flex w-full h-[calc(100vh-85px)] pb-8 overflow-hidden">
          <div
            className={`flex flex-col w-full items-center justify-start gap-6 mx-12 p-8 pt-4 mt-12 overflow-y-auto scrollbar ${
              theme === "dark" ? "scrollbar-dark" : "scrollbar-light"
            }`}
          >
            <div
              className={`flex flex-col min-w-[90%] max-w-[90%] shadow-xl rounded-lg p-8 ${
                theme === "dark" ? "bg-black" : "bg-white"
              }`}
            >
              <div
                className={`flex flex-col justify-center rounded-lg p-8 ${
                  theme === "dark"
                    ? "bg-[#1F222A] text-white"
                    : "bg-[#F2F4F7] text-black"
                }`}
              >
                <div className="flex flex-col items-start justify-center">
                  <h1 className="font-bold text-2xl mb-2">Actions</h1>
                  <p className="text-[#9f9f9f] text-base font-semibold">
                    Instruct your agent to perform different actions during
                    calls.
                  </p>
                </div>

                {pathname === "/workspace/agents/phone/phonesetting/action" &&
                  hasUnsavedChanges && (
                    <div className="flex items-center gap-4 mt-6 justify-end w-full">
                      <OutlinedButton
                        onClick={handleCancelChanges}
                        disabled={isSaving}
                        borderColor={
                          "border-2 border-[#808080] text-[#808080] hover:border-[#b8b8b8] hover:text-[#b8b8b8]"
                        }
                      >
                        Cancel Changes
                      </OutlinedButton>
                      <ContainedButton
                        onClick={handleSaveChanges}
                        disabled={isSaving}
                      >
                        {isSaving ? "Saving..." : "Save Changes"}
                      </ContainedButton>
                    </div>
                  )}

                <div className="flex flex-col items-center mt-6">
                  <div
                    className={`mt-4 mb-6 w-full max-h-[calc(100vh-400px)] bg-white p-6 rounded-lg overflow-y-auto ${
                      theme === "dark" ? "scrollbar-dark" : "scrollbar-light"
                    }`}
                  >
                    {tempActions?.length === 0 ? (
                      <p className="text-[#9f9f9f] text-base text-center font-semibold my-8">
                        No actions created yet.
                      </p>
                    ) : (
                      tempActions?.map((action, index) => (
                        <div
                          key={action.id}
                          className={`rounded-lg p-4 mb-4 bg-white hover:bg-gray-50 transition-colors ${
                            index !== tempActions?.length - 1 &&
                            "border-b border-gray-200 pb-6"
                          } flex justify-between items-center`}
                        >
                          <div className="flex gap-3 items-center">
                            {action.action_type === "send_email" ? (
                              <IoMailOutline className="text-2xl text-[#2D3377]" />
                            ) : action.action_type === "web_hooks" ? (
                              <MdOutlineWebhook className="text-2xl text-[#2D3377]" />
                            ) : action.action_type === "booking_appointment" ? (
                              <LuCalendarClock className="text-2xl text-[#2D3377]" />
                            ) : action.action_type === "call_forwarding" ? (
                              <BsTelephoneForward className="text-2xl text-[#2D3377]" />
                            ) : (
                              <></>
                            )}

                            <p className="text-base">
                              <span className="font-bold">
                                {fromSnakeCase(action.action_type)}
                              </span>{" "}
                              : {action.action_name}
                            </p>
                          </div>
                          <div className="flex gap-3">
                            <button
                              onClick={() => handleEditAction(action.id)}
                              className="flex items-center gap-2 border bg-gray-100 hover:bg-gray-200 text-sm text-black px-5 py-2.5 rounded-lg transition-colors"
                            >
                              settings <SettingIcon />
                            </button>
                            <button
                              onClick={() => handleDelete(action.id)}
                              className="flex items-center gap-2 border bg-gray-100 hover:bg-gray-200 text-sm text-black px-5 py-2.5 rounded-lg transition-colors"
                            >
                              Delete <DeleteIcon />
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  <button
                    onClick={toggleForm}
                    className="bg-white hover:bg-gray-100 border-2 w-[450px] mt-6 h-[65px] border-dashed border-gray-400 font-bold py-2 px-4 rounded-lg transition-colors text-base"
                  >
                    {showForm ? "Cancel" : "Add a new action"}
                  </button>
                </div>
              </div>

              <div
                className={`w-full flex flex-col gap-6 items-start justify-center rounded-lg p-8 mt-6 ${
                  theme === "dark"
                    ? "bg-[#1F222A] text-white"
                    : "bg-[#F2F4F7] text-black"
                }`}
              >
                {showForm && (
                  <div className="fixed inset-0 bg-black bg-opacity-50 z-[10000] flex justify-center items-center backdrop-blur-sm">
                    <div className="bg-white min-w-[60%] max-w-[60%] h-[85vh] rounded-lg shadow-lg">
                      <ActionForm
                        show={showForm}
                        toggle={toggleForm}
                        handleCreateAction={handleCreateAction}
                        initialData={selectedAction}
                        forPhoneActions={true}
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="w-full h-[1px] bg-zinc-300 my-8" />

              <div
                className={`flex flex-col gap-6 items-start justify-center rounded-lg p-8 ${
                  theme === "dark"
                    ? "bg-[#1F222A] text-white"
                    : "bg-[#F2F4F7] text-black"
                }`}
              >
                <div className="w-full">
                  <div className="flex justify-between items-center cursor-pointer">
                    <h5 className="font-bold text-2xl mb-2">
                      Prompt or Instruction
                    </h5>
                    <span title="Please do not remove the content inside the curly braces, as it serves as a marker">
                      <IoMdInformationCircleOutline
                        size={28}
                        className="text-[#2D3377]"
                      />
                    </span>
                  </div>
                  <p className="text-[#9f9f9f] text-base font-semibold">
                    Give the instructions for your agent
                  </p>
                </div>

                <div className="flex flex-col gap-3 w-full">
                  <textarea
                    type="text"
                    value={prompt}
                    onChange={(event) =>
                      dispatch(setPrompt(event.target.value))
                    }
                    ref={promptRef}
                    className={`${
                      theme === "dark"
                        ? "bg-[#1A1C22] text-white"
                        : "bg-white text-black"
                    } h-[180px] p-5 outline-none rounded-lg border border-gray-200 focus:border-[#2D3377] transition-colors text-base`}
                  />
                  <div className="flex justify-center mt-6 gap-3">
                    {promptFields.map((field) => (
                      <OutlinedButton
                        key={field.value}
                        onClick={() => {
                          let newPrompt = prompt + ` {${field.value}} `;
                          dispatch(setPrompt(newPrompt));
                          promptRef.current.focus();
                        }}
                      >
                        {field.label}
                      </OutlinedButton>
                    ))}
                  </div>
                </div>
              </div>

              <div className="w-full h-[1px] bg-zinc-300 my-8" />

              <div
                className={`flex flex-col gap-6 items-start justify-center rounded-lg p-8 ${
                  theme === "dark"
                    ? "bg-[#1F222A] text-white"
                    : "bg-[#F2F4F7] text-black"
                }`}
              >
                <div>
                  <h5 className="font-bold text-2xl mb-2">Script</h5>
                  <p className="text-[#9f9f9f] text-base font-semibold">
                    Add script for your agent
                  </p>
                </div>

                <div className="flex flex-col gap-3 w-full">
                  <textarea
                    type="text"
                    value={script}
                    onChange={(e) => dispatch(setScript(e.target.value))}
                    className={`${
                      theme === "dark"
                        ? "bg-[#1A1C22] text-white"
                        : "bg-white text-black"
                    } h-[180px] p-5 outline-none rounded-lg border border-gray-200 focus:border-[#2D3377] transition-colors text-base`}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {modal && (
          <Modal open={modal}>
            <div className="flex flex-col gap-8 rounded-lg items-center w-[320px]">
              <div className="flex flex-col gap-2 items-center">
                <h4 className="text-xl font-bold">
                  Are your sure you want to Delete?
                </h4>
                <p className="text-sm font-medium text-center text-[#9f9f9f]">
                  this workspace and all of its data and configuration will be
                  deleted
                </p>
              </div>
              <div className="flex items-center gap-8">
                <button
                  onClick={() => setModal(false)}
                  className="text-lg font-bold hover:text-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  className="bg-red-500 hover:bg-red-600 text-white text-lg font-bold px-4 py-2 rounded-lg transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </Modal>
        )}
      </div>

      {!editPage && (
        <div
          className={`w-full absolute bottom-0 h-[78px] ${
            theme === "dark" ? "bg-[#1F222A] text-white" : "bg-white text-black"
          }`}
        >
          <div className="w-full h-full flex justify-end items-center gap-8 px-12">
            <OutlinedButton
              onClick={() =>
                navigate.push("/workspace/agents/phone/createagent")
              }
            >
              Back
            </OutlinedButton>
            <ContainedButton onClick={createPhoneAgent}>Create</ContainedButton>
          </div>
        </div>
      )}
    </div>
  );
};

export default Actions;
