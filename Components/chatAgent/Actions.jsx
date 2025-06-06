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
import { RiListCheck3 } from "react-icons/ri";
import { BsPlayCircle } from "react-icons/bs";
import { addMultipleActions } from "@/store/reducers/ActionsSlice";
import { getApiConfig, getApiHeaders } from "@/utility/api-config";
import { showSuccessToast, showErrorToast } from "../toast/success-toast";
import { setActions } from "../../store/actions/botActions";

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
  const [hasFetchedImages, setHasFetchedImages] = useState(false);
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
    console.log("tempActions", tempActions);
    console.log("selected action", selectedAction);
  }, [tempActions, selectedAction]);

  useEffect(() => {
    // Only clear selected agents if we're not in chatsetting and not in edit mode
    if (!pathname.includes("chatsetting") && !editPage) {
      dispatch(clearSelectedAgents());
      dispatch(clearState());
    }
  }, [editPage]);

  useEffect(() => {
    if (hasFetchedImages) return;

    const fetchItemsImages = async () => {
      try {
        console.log("tempActions", tempActions);
        const imageFiles = [];

        tempActions.forEach((action) => {
          const items = action?.data?.items || [];
          items.forEach((item, index) => {
            imageFiles.push(item.image);
          });
        });
        const imageFilesString = imageFiles.join(",");
        console.log("image strig", imageFiles);

        const formData = new FormData();

        formData.append("chat_agent_id", selectedChatAgent.id);
        formData.append("image_file_names", imageFilesString);

        const res = await fetch(`${urlFetch}/chat_agent/action_list/image`, {
          ...getApiConfig(),
          method: "POST",
          headers: new Headers({
            ...getApiHeaders(),
          }),
          body: formData,
        });

        if (!res.ok) {
          console.log("error getting urls");
          return;
        }

        const data = await res.json();

        console.log('data image url', data)

        setTempActions((prevActions) =>
          prevActions.map((action) => {
            const updatedItems =
              action?.data?.items?.map((item) => {
                if (item.image && data[item.image]) {
                  return {
                    ...item,
                    imageUrl: data[item.image], // replace with URL from API
                  };
                }
                return item; // unchanged
              }) || [];

            return {
              ...action,
              data: {
                ...action.data,
                items: updatedItems,
              },
            };
          })
        );

        setHasFetchedImages(true)

        console.log("res", res);
      } catch (err) {
        console.log("error getting image urls", err);
      }
    };
    fetchItemsImages();


  }, [tempActions]);

  useEffect(() => {
    console.log("seclected agent", selectedChatAgent);
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
    const updatedActions = tempActions.filter(
      (action) => action.id !== actionId
    );
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

    // Update Redux state with the correct action
    dispatch(addMultipleActions(updatedTempActions));

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
      const imageUrls = [];

      tempActions.forEach((action) => {
        const items = action?.data?.items || [];
        items.slice(0, 5).forEach((item) => {
          if (item.imageUrl) {
            imageUrls.push(item.imageUrl);
          }
        });
      });
      const formData = new FormData();
      formData.append("workspace_id", selectedChatAgent?.workspace_id);
      formData.append("chat_agent_id", selectedChatAgent?.id);
      formData.append("actions", JSON.stringify(tempActions) || []);
      formData.append(
        "action_list_image_file",
        JSON.stringify(imageUrls) || []
      );
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
      console.log("data", response.status);

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
    <div className="h-full w-full flex flex-col items-center justify-start px-8">
      <div className="flex flex-col w-full items-center justify-start gap-4 mx-20 p-6">
        <div
          className={`flex flex-col min-w-[90%] max-w-[90%] rounded-xl ${
            theme === "dark" ? "bg-black" : ""
          }`}
        >
          <div
            className={`flex flex-col justify-center rounded-t-xl p-6 ${
              theme === "dark" ? "bg-[#1F222A] text-white" : "text-black"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex flex-col items-start justify-center">
                <h1 className="text-2xl font-bold text-[#2D3377]/90">
                  Actions
                </h1>
                <p className="text-gray-600 dark:text-gray-400 text-base font-medium mt-1">
                  Instruct your agent to perform different actions during calls.
                </p>
              </div>

              {pathname === "/workspace/agents/chats/chatsetting/action" &&
                hasUnsavedChanges && (
                  <div className="flex items-center gap-4 mt-4 justify-end w-full">
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
            </div>

            <div className="flex flex-col items-center mt-2">
              <div
                className={`mt-2 mb-4 w-full max-h-[calc(100vh-400px)] overflow-y-auto bg-white p-6 rounded-lg shadow-sm ${
                  theme === "dark" ? "scrollbar-dark" : "scrollbar-light"
                }`}
              >
                {tempActions?.length === 0 || !tempActions ? (
                  <p className="text-gray-600 dark:text-gray-400 text-base text-center font-medium my-6">
                    No actions created yet.
                  </p>
                ) : (
                  tempActions?.map((action, index) => (
                    <div
                      key={action.id || index}
                      className={`rounded-lg p-4 mb-4 bg-white hover:bg-gray-50 transition-colors ${
                        index !== tempActions?.length - 1 &&
                        "border-b border-gray-200"
                      } flex justify-between items-center`}
                    >
                      <div className="flex items-center gap-3">
                        {action.action_type === "send_email" ? (
                          <IoMailOutline className="text-2xl text-[#2D3377]" />
                        ) : action.action_type === "send_api_request" ? (
                          <MdOutlineWebhook className="text-2xl text-[#2D3377]" />
                        ) : action.action_type === "booking_appointment" ? (
                          <LuCalendarClock className="text-2xl text-[#2D3377]" />
                        ) : action.action_type === "list_of_items" ? (
                          <RiListCheck3 className="text-2xl text-[#2D3377]" />
                        ) : action.action_type === "send_video" ? (
                          <BsPlayCircle className="text-2xl text-[#2D3377]" />
                        ) : (
                          <></>
                        )}

                        <p className="text-base">
                          <span className="font-semibold text-[#2D3377]">
                            {fromSnakeCase(action.action_type)}
                          </span>{" "}
                          : {action.action_name}
                        </p>
                      </div>
                      <div className="flex gap-3">
                        <button
                          onClick={() => handleEditAction(action.id)}
                          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                        >
                          Settings <SettingIcon />
                        </button>
                        <button
                          onClick={() => handleDelete(action.id)}
                          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
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
                className="w-[400px] h-[60px] mt-4 border-2 border-dashed bg-gray-200 border-gray-300 hover:border-gray-400 hover:bg-white rounded-xl font-medium text-gray-600 transition-all"
              >
                {showForm ? "Cancel" : "Add a new action"}
              </button>
            </div>
          </div>

          <div
            className={`w-full flex flex-col gap-4 items-start justify-center rounded-b-xl p-6 ${
              theme === "dark" ? "bg-[#1F222A] text-white" : "text-black"
            }`}
          >
            {showForm && (
              <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[10000] flex justify-center items-center">
                <div className="bg-white min-w-[50%] max-w-[50%] h-[85vh] rounded-xl shadow-xl">
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
          <div className="flex flex-col gap-6 rounded-xl items-center w-[400px] p-6">
            <div className="flex flex-col gap-3 items-center">
              <h4 className="text-xl font-bold text-[#2D3377]">
                Are you sure you want to Delete?
              </h4>
              <p className="text-base text-center text-gray-600 dark:text-gray-400">
                This workspace and all of its data and configuration will be
                deleted
              </p>
            </div>
            <div className="flex items-center gap-6">
              <button className="px-6 py-2 text-base font-medium text-gray-700 hover:text-gray-900 transition-colors">
                Cancel
              </button>
              <button className="px-6 py-2 text-base font-medium text-white bg-red-500 hover:bg-red-600 rounded-lg transition-colors">
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
