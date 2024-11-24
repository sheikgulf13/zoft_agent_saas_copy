"use client";

import React, { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import useTheme from "next-theme";
import { useRouter } from "next/navigation";
import GradientButton from "../buttons/GradientButton";
import TickIcon from "../Icons/TickIcon";
import { TiArrowSortedDown } from "react-icons/ti";
import { removeAction, upsertAction, setPrompt, setScript } from "@/store/actions/phoneAgentActions";
import DeleteIcon from "../Icons/DeleteIcon";
import SettingIcon from "../Icons/SettingIcon";
import { v4 as uuidv4 } from "uuid";
import Modal from "../Modal";
import Link from "next/link";
import { OutlinedButton } from "../buttons/OutlinedButton";
import { ContainedButton } from "../buttons/ContainedButton";
import { IoMdInformationCircleOutline } from "react-icons/io";
import ActionForm from "../phoneAgent/ActionForm";

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
    { id: 1, name: 'Send email', fields: ['Name', 'Subject', 'Instructions', 'Content'] },
    { id: 3, name: 'Webhook', fields: ['Name', 'Webhook', 'Instructions'] },
  ];

const Actions = () => {
  const dispatch = useDispatch();
  const {
    createdActions,
    prompt,
    script,
  } = useSelector((state) => state.phoneAgent);
  const navigate = useRouter();
  const { theme, setTheme } = useTheme();
  //const [progress, setprogress] = useState(false)
  //const [openAccordion01, setOpenAccordion01] = useState(true)
  //const [openAccordion02, setOpenAccordion02] = useState(false)

  const [showForm, setShowForm] = useState(false);
  const [selectedAction, setSelectedAction] = useState(null);
  const [modal, setModal] = useState(false);
  const promptRef = useRef();
  const [progress, setprogress] = useState(false);

  const toggleForm = () => {
    setShowForm(!showForm);
    if (showForm) {
      // If form is closing, reset selected action
      setSelectedAction(null);
    }
  };

  const handleDelete = (actionId) => {
    console.log("Attempting to delete action with ID:", actionId);
    dispatch(removeAction(actionId));
  };

  const handleCreateAction = (newAction) => {
    const actionWithId = { ...newAction, id: uuidv4() }; // Generate a unique ID
    console.log(actionWithId.id);
    dispatch(upsertAction(actionWithId));
  };

  const handleEditAction = (action) => {
    setSelectedAction(action); // Set the selected action for editing
    setShowForm(true); // Show the form for editing
  };

  const nextHandler = () => {
    navigate.push("/workspace/agents/chats/deploy");
    setprogress(true);
  };

  return (
      <div className="h-full w-full flex flex-col items-center justify-start  px-[2vw] py-[2vw]">
       
          <div
            className={`flex flex-col w-full items-center justify-start gap-[1vw] mx-[5vw] p-[2vw] pt-[1vw] mt-[3%]`}
          >
            <div
              className={`flex flex-col min-w-[90%] max-w-[90%] shadow-xl rounded-lg p-[2vw] ${
                theme == "dark" ? "bg-black" : "bg-white"
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
                  theme === "dark"
                    ? "bg-[#1F222A] text-white"
                    : "bg-white text-black"
                }`}
              >
                {/* items-center */}
                <div className="flex flex-col items-start justify-center">
                  <h1 className="font-bold text-[1.1vw]">Actions</h1>
                  <p className="text-[#9f9f9f] text-[.9vw] font-semibold">
                    Instruct your agent to perform different actions during
                    calls.
                  </p>
                </div>

                {/* Render Created Actions */}
                <div className="flex flex-col items-center mt-[2%]">
                  <div
                    className={`mt-[1%] mb-[2%] w-full max-h-auto pr-[2vw]  overflow-y-scroll scrollBar ${
                      theme === "dark" ? "scrollbar-dark" : "scrollbar-light"
                    }`}
                  >
                    {createdActions?.length === 0 ? (
                      <p className="text-[#9f9f9f] text-[.9vw] text-center font-semibold my-[3%]">
                        No actions created yet.
                      </p>
                    ) : (
                      createdActions?.map((action) => (
                        <div
                          key={action.id}
                          className="rounded-lg p-[1%] mb-[1.5%] bg-white flex justify-between items-center"
                        >
                          <p> Action Type: {action.type}</p>
                          <div className="flex">
                            <button
                              onClick={() => handleEditAction(action)}
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
                  theme === "dark"
                    ? "bg-[#1F222A] text-white"
                    : "bg-white text-black"
                }`}
              >
                {showForm && (
                  <div className="fixed inset-0 bg-black bg-opacity-50 z-[10000] flex justify-center items-center">
                    <div className="bg-white w-1/4 h-[80vh] rounded-lg shadow-lg">
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