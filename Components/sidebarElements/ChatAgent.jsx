"use client";
import React, { Suspense, useEffect, useRef, useState } from "react";
import CreateButton from "../buttons/CreateButton";
import { IoIosAdd } from "react-icons/io";
import { FaPlus } from "react-icons/fa";
import { useRouter } from "next/navigation";
import AgentList from "../chatAgent/AgentList";
import SkeletonCard from "../SkeletonCard";
import useTheme from "next-theme";
import { TfiReload } from "react-icons/tfi";
import { ContainedButton } from "../buttons/ContainedButton";
import { useDispatch, useSelector } from "react-redux";
import { resetChatBot } from "../../store/actions/botActions";
import Modal from "../Modal";

const ChatAgent = (props) => {
  const router = useRouter();
  const { theme } = useTheme();
  const scrollRef = useRef();
  const [scrollHeight, setScrollHeight] = useState();
  const { workSpaceAgentList } = useSelector(
    (state) => state.workSpaceAgentList
  );
  const { isLoading, isLimitReached } = props;
  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const scrollHeight = scrollRef?.current?.scrollHeight;
    setScrollHeight(scrollHeight);
  }, [scrollRef?.current?.scrollHeight]);

  const replaceHandler = () => {
    dispatch(resetChatBot());
    setShowModal(true);
  };
  const createHandler = () => {
    setShowModal(false);
    dispatch(resetChatBot());
    router.push("/workspace/agents/chats/createbot");
  };

  return (
    <>
      <div className="h-[90%] overflow-hidden">
        <div
          className={`w-[88%] p-8 pt-4 h-[95%] overflow-hidden mx-auto rounded-xl relative shadow-md ${
            theme === "dark" ? "bg-[#1A1C22] text-white" : "bg-white text-black"
          }`}
        >
          <div
            className={`flex items-center justify-between gap-5 w-full pb-[5px] ${
              theme === "dark" ? " text-[#9f9f9f]" : " text-black"
            }`}
          >
            <div className="flex gap-5 items-center">
              <h1 className="text-lg font-bold">Chat Agents</h1>
              <span className="text-sm font-medium text-[#211C84] bg-gradient-to-r from-[#4D55CC]/10 to-[#211C84]/10 px-3 py-1.5 rounded-full border border-[#4D55CC]/20 shadow-sm">
                {workSpaceAgentList?.chat_agents?.length || 0} Agents
              </span>
            </div>
            {workSpaceAgentList?.chat_agents?.length && (
              <CreateButton
                onClick={replaceHandler}
                Icon={FaPlus}
                text="Create a new Chat Agent"
                className={`hover:scale-105 transition-transform duration-300`}
                isClickable={`${isLimitReached ? 'none' : 'auto'}`}
              />
            )}
          </div>

          {workSpaceAgentList?.chat_agents?.length && (
            <div className="w-full flex justify-between items-center px-8 py-2 mt-4 relative group">
              <h3
                className={`font-semibold text-sm min-w-[45%] max-w-[45%] text-left overflow-hidden text-ellipsis ${
                  theme === "dark" ? "text-gray-200" : "text-[#8b8b8b]"
                }`}
              >
                Name
              </h3>

              <h3
                className={`font-semibold text-sm min-w-[20%] max-w-[20%] text-left overflow-hidden text-ellipsis ${
                  theme === "dark" ? "text-gray-200" : "text-[#8b8b8b]"
                }`}
              >
                Actions
              </h3>

              <h3
                className={`font-semibold text-sm min-w-[20%] max-w-[20%] text-left overflow-hidden text-ellipsis ${
                  theme === "dark" ? "text-gray-200" : "text-[#8b8b8b]"
                }`}
              >
                Created at
              </h3>

              <h3
                className={`font-semibold text-sm min-w-[15%] max-w-[15%] text-right pr-[1.5vw] overflow-hidden text-ellipsis ${
                  theme === "dark" ? "text-gray-200" : "text-[#8b8b8b]"
                }`}
              >
                Settings
              </h3>
            </div>
          )}

          <div
            className={`flex justify-start w-full overflow-y-auto`}
            style={{ height: "calc(70vh - 50px)" }}
          >
            <div
              ref={scrollRef}
              className={`flex flex-col justify-start w-full ${
                scrollHeight > 260 ? "scrollbar" : "scrollbar-none"
              } gap-[1vw] p-4 transition-all ${
                theme === "dark" ? "scrollbar-dark" : "scrollbar-light"
              } [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar]:bg-[#f2f0ef] [&::-webkit-scrollbar-track]:bg-[#f2f0ef] [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[#4D55CC]/30 hover:[&::-webkit-scrollbar-thumb]:bg-[#4D55CC]/50`}
            >
              {isLoading ? (
                <>
                  <SkeletonCard />
                  <SkeletonCard />
                </>
              ) : (
                <>
                  {workSpaceAgentList?.chat_agents?.length ? (
                    <>
                      {workSpaceAgentList.chat_agents.map((agent, index) => (
                        <AgentList key={index} agent={agent} />
                      ))}
                    </>
                  ) : (
                    <div className="flex flex-col w-full h-full items-center justify-center gap-[2vw]">
                      <div
                        className={`${
                          theme === "dark" ? "text-[#9f9f9f]" : "text-[#8b8b8b]"
                        } font-bold text-[1.1vw] w-[300px] h-[40px] flex items-center justify-center`}
                      >
                        No agents created
                      </div>

                      <CreateButton
                        onClick={replaceHandler}
                        Icon={FaPlus}
                        text="Create a new Chat Agent"
                        className="hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {showModal && (
        <Modal open={showModal} onClose={() => setShowModal(false)}>
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center animate-fadeIn">
            <div className=" max-w-[75vw] bg-white rounded-xl p-10 animate-slideIn">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Create New Chat Agent</h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-500 hover:text-gray-700 transition-colors duration-200 group"
                >
                  <svg
                    className="w-6 h-6 transform group-hover:rotate-90 transition-transform duration-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
              <div className="flex gap-10 justify-between">
                <CreateButton
                  onClick={createHandler}
                  Icon={FaPlus}
                  text="Create from scratch"
                  className="hover:-translate-y-1 hover:scale-[1.02] transition-all duration-300"
                  width="250px"
                  height="200px"
                />

                <div className="w-[280px] bg-gray-50 rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-[1.02]">
                  <div className="h-full flex flex-col justify-between">
                    <div>
                      <h3 className="text-xl font-semibold mb-3">
                        Use Template
                      </h3>
                      <p className="text-gray-600 mb-4">
                        Use a pre-built template to get started quickly
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setShowModal(false);
                        router.push("/workspace/agents/chats/templates");
                      }}
                      className="w-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#13104A]/95 via-[#2D3377]/90 via-[#18103A]/85 via-[#211A55]/80 to-[#13104A]/95 text-white py-3 px-4 rounded-lg hover:opacity-90 transition-all duration-300 hover:scale-[1.02]"
                    >
                      Use Template
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
};

export default ChatAgent;
