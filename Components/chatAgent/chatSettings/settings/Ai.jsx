"use client";

import useTheme from "next-theme";
import React, { useEffect, useState } from "react";
import ChatSettingNav from "../ChatSettingNav";
import { useRouter, useSearchParams } from "next/navigation";
import { FaArrowLeftLong } from "react-icons/fa6";
import { getApiConfig, getApiHeaders } from "../../../../utility/api-config";
import { OutlinedButton } from "../../../buttons/OutlinedButton";
import { ContainedButton } from "@/Components/buttons/ContainedButton";
import ConfirmationDialog from "../../../../Components/chatAgent/chatSettings/settings/ConfirmationDialog";
import { deleteChatAgentApi } from "@/api/agent";
import { useDispatch, useSelector } from "react-redux";
import { showSuccessToast } from "../../../../Components/toast/success-toast";
import { updateSelectedChatAgent } from "../../../../store/actions/selectedDataActions";
import { CookieManager } from "../../../../utility/cookie-manager";
import SimpleAlert from "../../../toast/success-toast";

const Ai = () => {
  const { theme } = useTheme();
  const [chatAgent, setChatAgent] = useState(null);
  const [botName, setBotName] = useState("");
  const [des, setDes] = useState("");
  const [promt, setPrompt] = useState("");
  const [isHovered, setIsHovered] = useState(false);
  const urlFetch = process.env.url;
  const router = useRouter();
  const [toast, setToast] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { selectedChatAgent, selectedWorkSpace } = useSelector(
    (state) => state.selectedData
  );
  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const isDelete = searchParams.get('isDelete') === 'true';

  useEffect(() => {
    if(isDelete) {
      handleDeleteClick();
    }
  }, [isDelete])

  const handleDeleteClick = () => {
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  const handleConfirmDelete = async () => {
    // Delete chat agent from local storage and database
    if (!selectedChatAgent) {
      return;
    }
    await deleteChatAgentApi(selectedChatAgent.id);
    setToast("error");
    setTimeout(() => {
      setToast("");
      router.push(`/workspace/agents?workspaceId=${selectedWorkSpace}`);
    }, 3000);
  };

  const autoResizeTextarea = (textarea) => {
    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight}px`;
  };

  const descriptionHandler = (e) => {
    const text = e.target.value;
    setDes(text);
    //dispatch(setPrompt(text));  // Update Redux store on change
    if (e.target.tagName === "TEXTAREA") {
      autoResizeTextarea(e.target);
    }
  };

  const promptHandler = (e) => {
    const text = e.target.value;
    setPrompt(text);
    //dispatch(setPrompt(text));  // Update Redux store on change
    if (e.target.tagName === "TEXTAREA") {
      autoResizeTextarea(e.target);
    }
  };

  const updateDetails = async () => {
    const formData = new FormData();
    formData.append("chat_agent_id", selectedChatAgent?.id);
    formData.append("botname", botName);
    formData.append("description", des);
    formData.append("prompt", promt);
    const response = await fetch(`${urlFetch}/public/chat_agent/update`, {
      ...getApiConfig(),
      method: "POST",
      headers: new Headers({
        ...getApiHeaders(),
      }),
      body: formData,
    });

    if (response.status === 200) {
      showSuccessToast("Chatbot has been successfully updated");
      dispatch(
        updateSelectedChatAgent({
          ...selectedChatAgent,
          bot_name: botName,
          description: des,
          prompts: promt,
        })
      );
    }
  };

  useEffect(() => {
    setBotName(selectedChatAgent?.bot_name);
    setDes(selectedChatAgent?.description);
    setPrompt(selectedChatAgent?.prompts);
  }, [selectedChatAgent]);

  const handleFormSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <div
      className={`flex flex-col justify-start items-start px-8  w-full h-[100vh]`}
    >
      <ConfirmationDialog
        isOpen={isDialogOpen}
        onClose={handleCloseDialog}
        onConfirm={handleConfirmDelete}
        cancelClass={"border-[.2vw] border-[#702963] hover:border-opacity-[.8]"}
      />

      <div>
        {toast === "error" && (
          <div className="fixed top-[30px] w-[250px] h-[70px] right-[30px] z-[1000]">
            <SimpleAlert
              content={"Chatbot deleted successfully"}
              severity={"error"}
            />
          </div>
        )}
      </div>

      <div
        className={`border-b-[.1vw] flex justify-center relative w-full mt-[2vw] pt-[.6vw] mb-[.9vw] text-base border-zinc-300 ${
          theme === "dark" ? "text-[#9f9f9f]" : " text-black"
        }`}
      >
        <div className="absolute left-[2vw] top-[-.6vw]">
          <OutlinedButton
            onClick={() =>
              router.push(
                `/workspace/agents?workspaceId=${selectedChatAgent?.workspace_id}`
              )
            }
             borderColor={
              "border-2 border-[#8b8b8b] text-[#8b8b8b] hover:border-[#333333] hover:text-[#333333]"
            }
          >
            <FaArrowLeftLong className="text-sm"/>
            <span className="text-sm">Back to workspace</span>
          </OutlinedButton>
        </div>
        <ChatSettingNav />
      </div>
      <div className={`flex items-start justify-center w-full`}>
        <div
          className={`flex flex-col w-[50%] rounded-lg border-1 border-zinc-300 ${
            theme === "dark" ? "bg-[#1A1C22]" : "bg-white"
          }`}
        >
          <div
            className={`${
              theme === "dark" ? "text-zinc-100" : "text-black"
            } flex flex-col p-8 w-full gap-8 font-semibold text-base`}
          >
            <div className="flex justify-between">
              <h6 className={`font-bold text-base pb-[.5vw] `}>AI</h6>
              <ContainedButton
                onClick={handleDeleteClick}
                bgColor={'bg-red-500 hover:bg-red-600'}
              >
                Delete
              </ContainedButton>
            </div>
            <form
              className="flex flex-col gap-8 overflow-y-auto p-4"
              onSubmit={handleFormSubmit}
              style={{ height: "calc(114vh - 450px)" }}
            >
              <div className={`flex flex-col gap-[.3vw] pb-[2vw]`}>
                <div className={`flex items-center gap-[.5vw]`}>
                  <label htmlFor="rawText" className="text-base text-[#333333] font-semibold">
                    Model
                  </label>
                  <span
                    className={`text-sm font-semibold text-purple-600 bg-purple-300 px-[.4vw] py-[.2vw] rounded-md`}
                  >
                    gpt-4o is now available
                  </span>
                </div>
                <select
                  className={`px-[.4vw] py-[.5vw] rounded-[.4vw] border-[.052vw] border-zinc-300 ${
                    theme === "dark" ? "bg-[#1A1C22]" : "bg-white"
                  }`}
                >
                  <option value="gpt-4o">
                    gpt-4o is the most advanced openAi model
                  </option>
                  <option value="gpt-4o">gpt-4o: 1 credit per response</option>
                  <option value="gpt-4-turbo">
                    gpt-4-turbo: 10 credits per response
                  </option>
                  <option value="gpt-4">gpt-4: 20 credits per response</option>
                  <option value="gpt-3.5-turbo">
                    gpt-3.5-turbo: 1 credit per response
                  </option>
                </select>
              </div>
              <div className={`flex items-center gap-[2vw]`}>
                <div className={`flex flex-col w-[40%]`}>
                  <label
                    htmlFor="botname"
                    className="text-base font-semibold pt-[1vw]"
                  >
                    Bot Name
                  </label>
                  <span className={`text-xs font-normal text-[#b8b8b8]`}>
                    Enter yout Chatbot's name here <br /> eg: (Alex, Maya)
                  </span>
                </div>
                <input
                  // onChange={''}
                  // onKeyDown={''}
                  //value={''}
                  type="name"
                  id="url"
                  value={botName}
                  onChange={(e) => setBotName(e.target.value)}
                  className={`text-base border-[0.052vw] w-[80%] border-zinc-300 px-[1vw] py-2 rounded-[.4vw] ${
                    theme === "dark"
                      ? "bg-[#1F222A] text-white"
                      : "bg-white text-[#333333]"
                  }`}
                  placeholder="Enter a name"
                />
              </div>
              <div className="flex gap-[2vw]">
                <div className="flex flex-col w-[40%]">
                  <label
                    htmlFor="description"
                    className="capitalize text-base font-semibold"
                  >
                    Description
                  </label>
                  {/*err && <span className='text-red-800 capitalize text-[.7vw] font-medium '>*{err}</span>*/}
                  <span
                    className={`text-xs break-words font-normal text-[#b8b8b8]`}
                  >
                    Enter your chatbot's description, including it main purpose
                    and tasks <br /> (eg: A customer support assistant that
                    answers FAQs and resolves issues, or a travel booking helper
                    that finds and books flights and hotels)
                  </span>
                </div>
                <textarea
                  onChange={descriptionHandler}
                  // onKeyDown={''}
                  value={des}
                  type="description"
                  id="url"
                  className={`text-base resize-none overflow-hidden border-[0.052vw] w-[80%] border-zinc-300 px-[1vw] pt-[1.8vh] pb-[8vh] rounded-[.4vw] ${
                    theme === "dark"
                      ? "bg-[#1F222A] text-white"
                      : "bg-white text-[#333333]"
                  }`}
                />
              </div>
              <div className="flex gap-[2vw]">
                <div className={`flex flex-col w-[40%]`}>
                  <label htmlFor="prompt" className="text-base font-semibold">
                    Prompt
                  </label>
                  <span className={`text-xs font-normal text-[#b8b8b8]`}>
                    Enter a sample prompt for your chatbot, which is a typical
                    question or request it will handle. This helps define how
                    the chatbot should respond. <br /> For example, if your
                    chatbot assists with booking flights, you might use 'Can you
                    help me find a flight to New York?' or if it's a customer
                    support, 'I need help with a billing issue.' This will give
                    the chatbot a clear idea of the types of interactions it
                    should manage.
                  </span>
                </div>
                <textarea
                  onChange={promptHandler}
                  value={promt}
                  id="prompt"
                  className={`text-base overflow-hidden border-[0.052vw] w-[80%] border-zinc-300 px-[1vw] pb-[8vh] pt-[1.8vh] rounded-[.5vw] resize-none ${
                    theme === "dark"
                      ? "bg-[#1F222A] text-white"
                      : "bg-white text-[#333333]"
                  }`}
                  placeholder="Example: you are a sales agent, talk pursuasively and respond to the asnwers politely"
                ></textarea>
              </div>
            </form>
            <div
              className={`relative flex flex-col w-full justify-center items-end`}
            >
              <div
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              >
                <button
                  type="submit"
                  className={`text-sm text-white bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#13104A]/95 via-[#2D3377]/90 via-[#18103A]/85 via-[#211A55]/80 to-[#13104A]/95 backdrop-blur-sm rounded-lg px-[4vw] py-[10px] hover:opacity-[0.9] ${
                    selectedChatAgent?.bot_name === botName &&
                    selectedChatAgent?.description === des &&
                    selectedChatAgent?.prompts === promt &&
                    "pointer-events-none opacity-[0.4]"
                  }`}
                  onClick={updateDetails}
                >
                  Save
                </button>
              </div>
              {selectedChatAgent?.bot_name === botName &&
                selectedChatAgent?.description === des &&
                selectedChatAgent?.prompts === promt &&
                isHovered && (
                  <span
                    className={`absolute pointer-events-none transition-all duration-1000 top-[120%]  text-sm font-normal px-[1vw] py-[.2vw] rounded-md ${
                      theme === "dark"
                        ? "text-white bg-[#1F222A]"
                        : "text-black bg-[#F3F4F7]"
                    }`}
                  >
                    No changes to save
                  </span>
                )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Ai;
