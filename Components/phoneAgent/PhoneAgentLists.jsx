"use client";
import React, { useEffect, useRef, useState } from "react";
import { FaPlus } from "react-icons/fa";
import { useRouter } from "next/navigation";
import AgentCard from "./AgentCard";
import useTheme from "next-theme";
import CreateButton from "../buttons/CreateButton";
import SkeletonCard from "../SkeletonCard";
import Modal from "../Modal";
import { IoSettingsSharp } from "react-icons/io5";
import {
  clearState,
  setPhoneAgentType,
} from "../../store/actions/phoneAgentActions";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";

const PhoneAgentList = (props) => {
  const { theme } = useTheme();
  const router = useRouter();
  const scrollRef = useRef();
  const [scrollHeight, setScrollHeight] = useState();
  const [modal, setModal] = useState(false);
  const dispatch = useDispatch();
  const { isLoading } = props;
  const [showModal, setShowModal] = useState(false);
  const { workSpaceAgentList } = useSelector(
    (state) => state.workSpaceAgentList
  );

  useEffect(() => {
    const scrollHeight = scrollRef?.current?.scrollHeight;
    setScrollHeight(scrollHeight);
    console.log(scrollHeight);
  }, [scrollRef?.current?.scrollHeight]);

  const replaceHandler = (type) => {
    dispatch(setPhoneAgentType(type));
    router.push("/workspace/agents/phone/createagent");
  };

  return (
    <div className="h-[90%] overflow-hidden">
      <div
        className={`w-[88%] p-8 pt-4 h-[95%] overflow-hidden mx-auto rounded-xl relative shadow-md ${
          theme === "dark" ? "bg-[#1A1C22] text-white" : "bg-white text-black"
        }`}
      >
        <div
          className={`flex items-center justify-between gap-5  w-full pb-[5px] ${
            theme === "dark" ? " text-[#9f9f9f]" : " text-black"
          }`}
        >
          <div className="flex gap-5 items-center">
            <h1 className="text-lg font-bold">Phone Agents</h1>
            <span className="text-sm font-medium text-[#211C84] bg-gradient-to-r from-[#4D55CC]/10 to-[#211C84]/10 px-3 py-1.5 rounded-full border border-[#4D55CC]/20 shadow-sm">
              {workSpaceAgentList?.phone_agents?.length || 0} Agents
            </span>
          </div>
          {workSpaceAgentList?.phone_agents?.length && (
            <CreateButton
              onClick={() => {
                dispatch(clearState());
                setShowModal(true);
              }}
              Icon={FaPlus}
              text="Create a new Phone Agent"
              className="hover:scale-105 transition-transform duration-300"
            />
          )}
        </div>

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
            No.of Actions
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

        <div
          className={`flex justify-start w-full overflow-y-auto`}
          style={{ height: "calc(70vh - 5px)" }}
        >
          <div
            ref={scrollRef}
            className={`flex flex-col justify-start w-full ${
              scrollHeight > 260 ? "scrollbar" : "scrollbar-none"
            } gap-[1vw] p-4 ${
              theme === "dark" ? "scrollbar-dark" : "scrollbar-light"
            }`}
          >
            {isLoading ? (
              <>
                <SkeletonCard />
                <SkeletonCard />
              </>
            ) : (
              <>
                {workSpaceAgentList?.phone_agents?.length ? (
                  <>
                    {workSpaceAgentList.phone_agents.map((agent, index) => (
                      <AgentCard key={index} agent={agent} />
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
                      onClick={() => {
                        dispatch(clearState());
                        setShowModal(true);
                      }}
                      Icon={FaPlus}
                      text="Create a new Phone Agent"
                      className="hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {showModal && (
          <Modal open={showModal} onClose={() => setShowModal(false)}>
            <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center animate-fadeIn">
              <div className="max-w-[75vw] bg-white rounded-xl p-10 animate-slideIn">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">Create New Phone Agent</h2>
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
                    onClick={() => {
                      dispatch(clearState());
                      setModal(true);
                      setShowModal(false);
                    }}
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
                          router.push("/workspace/agents/phone/templates");
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

        {modal && (
          <Modal
            open={modal}
            onClose={() => setModal(false)}
            classname="!bg-transparent w-[30%] !shadow-none"
          >
            <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center animate-fadeIn">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="w-[45vw] max-w-[1200px] bg-white rounded-xl p-8 shadow-2xl animate-slideIn"
              >
                <div className="flex items-start gap-6 mb-8">
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-3 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                  >
                    <IoSettingsSharp className="w-6 h-6" />
                  </motion.button>
                  <div className="flex flex-col gap-2">
                    <h6 className="text-xl font-semibold text-gray-800">
                      Create a new agent
                    </h6>
                    <p className="text-sm text-gray-600">
                      What type of agent are you trying to create?
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-6">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    onClick={() => replaceHandler("outbound")}
                    className="group bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden border border-gray-100"
                  >
                    <div className="flex gap-6 p-6">
                      <div className="bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#13104A]/95 via-[#2D3377]/90 via-[#18103A]/85 via-[#211A55]/80 to-[#13104A]/95 min-w-[200px] min-h-[200px] rounded-lg flex items-center justify-center text-white font-semibold text-lg p-4 text-center group-hover:scale-105 transition-transform duration-300">
                        Outbound Agent
                      </div>
                      <div className="flex flex-col gap-3 py-2">
                        <h6 className="text-xl font-semibold text-gray-800 group-hover:text-[#13104A] transition-colors duration-200">
                          Outbound agent
                        </h6>
                        <p className="text-sm text-gray-600 leading-relaxed">
                          Outbound agent's are agents that call prospects that
                          signup on your optin form or are being sent to the
                          agent through a webhook integration
                        </p>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.2 }}
                    whileHover={{ scale: 1.02 }}
                    onClick={() => replaceHandler("inbound")}
                    className="group bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden border border-gray-100"
                  >
                    <div className="flex gap-6 p-6">
                      <div className="bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#13104A]/95 via-[#2D3377]/90 via-[#18103A]/85 via-[#211A55]/80 to-[#13104A]/95 min-w-[200px] min-h-[200px] rounded-lg flex items-center justify-center text-white font-semibold text-lg p-4 text-center group-hover:scale-105 transition-transform duration-300">
                        Inbound Agent
                      </div>
                      <div className="flex flex-col gap-3 py-2">
                        <h6 className="text-xl font-semibold text-gray-800 group-hover:text-[#13104A] transition-colors duration-200">
                          Inbound agent
                        </h6>
                        <p className="text-sm text-gray-600 leading-relaxed">
                          Inbound agent's are agents that respond to prospects
                          calling your twillio number through their phones or
                          "live call" embeddable widgets
                        </p>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </Modal>
        )}
      </div>
    </div>
  );
};

export default PhoneAgentList;
