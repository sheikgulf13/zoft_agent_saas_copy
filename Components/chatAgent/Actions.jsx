"use client";

import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import useTheme from "next-theme";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import GradientButton from "../buttons/GradientButton";
import TickIcon from "../Icons/TickIcon";
import { TiArrowSortedDown } from "react-icons/ti";
import {
  clearState,
  removeAction,
  upsertAction,
} from "@/store/actions/actionActions";
import DeleteIcon from "../Icons/DeleteIcon";
import SettingIcon from "../Icons/SettingIcon";
import { v4 as uuidv4 } from "uuid";
import Modal from "../Modal";
import Link from "next/link";
import { OutlinedButton } from "../buttons/OutlinedButton";
import { ContainedButton } from "../buttons/ContainedButton";
import { IoMdInformationCircleOutline } from "react-icons/io";
import ActionForm from "../phoneAgent/ActionForm";
import { IoMailOutline } from "react-icons/io5";
import { MdOutlineWebhook } from "react-icons/md";
import { LuCalendarClock } from "react-icons/lu";
import { addMultipleActions } from "@/store/reducers/ActionsSlice";
import { getApiConfig, getApiHeaders } from "@/utility/api-config";
import {showSuccessToast, showErrorToast } from "../toast/success-toast";

import {
  clearSelectedAgents,
  clearSelectedData,
} from "../../store/actions/selectedDataActions";
import { BsTelephoneForward } from "react-icons/bs";

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

const actions = [
  {
    id: 1,
    name: "Send email",
    fields: ["Name", "Subject", "Instructions", "Content"],
  },
  { id: 3, name: "Webhook", fields: ["Name", "Webhook", "Instructions"] },
];

const Actions = ({ editPage }) => {
  const { selectedChatAgent } = useSelector((state) => state.selectedData);

  const dispatch = useDispatch();
  const { createdActions } = useSelector((state) => state.actions);
  const pathname = usePathname();
  const navigate = useRouter();
  const { theme, setTheme } = useTheme();
  //const [progress, setprogress] = useState(false)
  //const [openAccordion01, setOpenAccordion01] = useState(true)
  //const [openAccordion02, setOpenAccordion02] = useState(false)

  const [showForm, setShowForm] = useState(false);
  const [selectedAction, setSelectedAction] = useState(null);
  const [modal, setModal] = useState(false);
  const [tempActions, setTempActions] = useState([]);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [initialActions, setInitialActions] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const promptRef = useRef();
  const [progress, setprogress] = useState(false);
    const urlFetch = process.env.url;
  // console.log(createdActions);

  // console.log(JSON.parse(selectedChatAgent?.actions));
  // console.log(
  //   "selectedChatAgent",
  //   selectedChatAgent?.actions
  // );

  // console.log("createdActions", createdActions);

  const handleClear = () => {
    dispatch(clearState());
  };

  useEffect(() => {
    // Only clear selected agents if we're not in chatsetting and not in edit mode
    if (!pathname.includes("chatsetting") && !editPage) {
      dispatch(clearSelectedAgents());
      dispatch(clearState());
    }
  }, [editPage]);

  useEffect(() => {
    console.log('seclected agent', selectedChatAgent)
    // Only load actions if we're in edit mode and have a selected chat agent
    if (
      editPage &&
      selectedChatAgent?.actions &&
      !pathname.includes("/workspace/agents/chats/createbot")
    ) {
      try {
        const selectedData = JSON.parse(selectedChatAgent?.actions);
        if (selectedData && Array.isArray(selectedData)) {
          dispatch(addMultipleActions(selectedData));
          setTempActions(selectedData);
          setInitialActions(selectedData);
        }
      } catch (error) {
        console.error("Failed to parse actions:", error);
      }
    }
  }, [selectedChatAgent, editPage]);

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
    const updatedActions = tempActions.filter(action => action.id !== actionId);
    setTempActions(updatedActions);
    setHasUnsavedChanges(true);
  };

  function fromSnakeCase(input) {
    return input
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }

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

    setShowForm(false);
    setSelectedAction(null);
  };

  const handleEditAction = (actionId) => {
    const editAction = tempActions.find((act) => act.id === actionId);
    if (editAction) {
      setSelectedAction(editAction);
      setShowForm(true);
    }
  };

  const nextHandler = () => {
    navigate.push("/workspace/agents/chats/deploy");
    setprogress(true);
  };

  const handleSaveChanges = async () => {
    setIsSaving(true);
    try {
      const formData = new FormData();
      formData.append("workspace_id", selectedChatAgent?.workspace_id);
      formData.append("chat_agent_id", selectedChatAgent?.id);
      formData.append("actions", JSON.stringify(tempActions) || []);
      const response = await fetch(
        `${urlFetch}/public/chat_agent/update_actions`,
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
      console.log('data', response.status);
      
      if (response.status === 200) {
        // First update Redux state
        dispatch(addMultipleActions(tempActions));
        // Then update local state
        setInitialActions(tempActions);
        setHasUnsavedChanges(false);
        showSuccessToast("Actions updated successfully");
      } else {
        // First update Redux state
        dispatch(addMultipleActions(initialActions));
        // Then update local state
        setTempActions(initialActions);
        setHasUnsavedChanges(false);
        showErrorToast(data.message || "Failed to update actions");
        console.error("Failed to update actions:", data.message);
      }
    } catch (error) {
      // First update Redux state
      dispatch(addMultipleActions(initialActions));
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
    dispatch(addMultipleActions(initialActions));
    setHasUnsavedChanges(false);
  };

  return (
    <div className="h-full w-full flex flex-col items-center justify-start  px-[2vw] py-[2vw]">
      <div
        className={`flex flex-col w-full items-center justify-start gap-[1vw] mx-[5vw] p-[2vw] pt-[1vw] mt-[3%]`}
      >
        <div
          className={`flex flex-col min-w-[90%] max-w-[90%] rounded-lg p-[2vw] ${
            theme == "dark" ? "bg-black" : ""
          }`}
        >
          {/* <div
                className={`flex flex-col gap-[1.5vw] items-start justify-center rounded-lg p-[1.5vw] ${
                  theme === "dark"
                    ? "bg-[#1F222A] text-white"
                    : "bg-[#F2F4F7] text-black"
                }`}
                >
                 */}
          <div
            className={`flex flex-col  justify-center rounded-t-lg p-[1.5vw] ${
              theme === "dark" ? "bg-[#1F222A] text-white" : " text-black"
            }`}
          >
            {/* items-center */}
            <div className="flex flex-col items-start justify-center">
              <h1 className="font-bold text-[1.1vw]">Actions</h1>
              <p className="text-[#9f9f9f] text-[.9vw] font-semibold">
                Instruct your agent to perform different actions during calls.
              </p>
            </div>

            {pathname === "/workspace/agents/phone/phonesetting/action" &&
              hasUnsavedChanges && (
                <div className="flex items-center gap-4 mt-4 justify-end w-full">
                  <OutlinedButton onClick={handleCancelChanges} disabled={isSaving}>
                    Cancel Changes
                  </OutlinedButton>
                  <ContainedButton onClick={handleSaveChanges} disabled={isSaving}>
                    {isSaving ? "Saving..." : "Save Changes"}
                  </ContainedButton>
                </div>
              )}

            {/* Render Created Actions */}
            <div className="flex flex-col items-center mt-[2%]">
              <div
                className={`mt-[1%] mb-[2%] w-full max-h-auto bg-white p-5 ${
                  theme === "dark" ? "scrollbar-dark" : "scrollbar-light"
                }`}
              >
                {tempActions?.length === 0 || !tempActions ? (
                  <p className="text-[#9f9f9f] text-[.9vw] text-center font-semibold my-[3%]">
                    No actions created yet.
                  </p>
                ) : (
                  tempActions?.map((action, index) => (
                    <div
                      key={action.id || index}
                      className={`rounded-lg p-[1%] mb-[1.5%] bg-white ${
                        index !== tempActions?.length - 1 &&
                        "border-b-[1px] pb-[2.5%] border-gray-300"
                      } flex justify-between items-center`}
                    >
                      <div className="flex gap-1">
                        {action.action_type === "send_email" ? (
                          <IoMailOutline className="text-2xl" />
                        ) : action.action_type === "web_hooks" ? (
                          <MdOutlineWebhook className="text-2xl" />
                        ) : action.action_type === "booking_appointment" ? (
                          <LuCalendarClock className="text-2xl" />
                        ) : action.action_type === "call_forwarding" ? (
                          <BsTelephoneForward className="text-2xl" />
                        ) : (
                          <></>
                        )}

                        <p>
                          <span className="font-bold">
                            {fromSnakeCase(action.action_type)}
                          </span>{" "}
                          : {action.action_name}
                        </p>
                      </div>
                      <div className="flex">
                        <button
                          onClick={() => handleEditAction(action.id)}
                          className="ml-4 flex items-center gap-[.5vw] border bg-gray-100 hover:bg-opacity-[.9] text-sm text-black px-[1vw] py-[.3vw] rounded capitalize"
                        >
                          settings <SettingIcon />
                        </button>
                        <button
                          onClick={() => handleDelete(action.id)}
                          className="ml-4 border flex items-center gap-[.5vw] bg-gray-100 hover:bg-opacity-[.9] text-sm text-black px-[1vw] py-[.3vw] rounded capitalize"
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
                className="bg-white hover:bg-zinc-300 border-[1.5px] w-[400px]  mt-[10px] h-[60px]  border-dashed border-zinc-400 font-bold py-[1%] px-4 rounded"
              >
                {showForm ? "Cancel" : "Add a new action"}
              </button>
            </div>
          </div>

          {/* <div className={`w-full h-[.1vw] bg-zinc-300 my-[3vw]`} /> */}

          <div
            className={`w-full flex flex-col gap-[1.5vw] items-start justify-center rounded-b-lg p-[1.5vw] ${
              theme === "dark" ? "bg-[#1F222A] text-white" : " text-black"
            }`}
          >
            {showForm && (
              <div className="fixed inset-0 bg-black bg-opacity-50 z-[10000] flex justify-center items-center">
                <div className="bg-white min-w-[40%] h-[65vh] rounded-lg shadow-lg">
                  <ActionForm
                    show={showForm}
                    toggle={toggleForm}
                    handleCreateAction={handleCreateAction}
                    initialData={selectedAction}
                    actions={actions}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {modal && (
        <Modal open={modal}>
          <div
            className={`flex flex-col gap-[2vw] rounded-lg items-center w-[20vw]`}
          >
            <div className={`flex flex-col gap-[.5vw] items-center`}>
              <h4 className="text-[1.1vw] font-bold">
                Are your sure you want to Delete?
              </h4>
              <p className="text-[.9vw] font-medium text-center text-[#9f9f9f]">
                this workspace and all of its data and configuration will be
                deleted
              </p>
            </div>
            <div className="flex items-center gap-[2vw]">
              <button
                //onClick={() => setModal(false)}
                className="text-[1.1vw] font-bold"
              >
                Cancel
              </button>
              <button
                //onClick={}
                className="bg-red-500 hover:bg-opacity-[0.8] text-white text-[1.1vw] font-bold px-[.5vw] py-[.25vw] rounded-lg"
              >
                Delete
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Actions;
