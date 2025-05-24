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
import { resetChatBot } from "../../store/actions/botActions"

const ChatAgent = (props) => {
  const router = useRouter();
  const { theme } = useTheme();
  const scrollRef = useRef();
  const [scrollHeight, setScrollHeight] = useState();
  const { workSpaceAgentList } = useSelector(
    (state) => state.workSpaceAgentList
  );
  const { isLoading } = props;
  const dispatch = useDispatch();

  useEffect(() => {
    const scrollHeight = scrollRef?.current?.scrollHeight;
    setScrollHeight(scrollHeight);
  }, [scrollRef?.current?.scrollHeight]);

  const replaceHandler = () => {
    dispatch(resetChatBot());
    router.push("/workspace/agents/chats/createbot");
  };

  return (
    <div className="h-[60%] overflow-hidden">
      <div
        className={`w-[88%] p-8 pt-4 h-[95%] overflow-hidden mx-auto rounded-xl relative shadow-md ${
          theme === "dark" ? "bg-[#1A1C22] text-white" : "bg-white text-black"
        }`}
      >
        <div
          className={`flex items-center justify-start gap-5 w-full pb-[5px] ${
            theme === "dark" ? " text-[#9f9f9f]" : " text-black"
          }`}
        >
          <h1 className="text-xl font-bold">Chat Agents</h1>
          <span className="text-sm font-medium text-[#211C84] bg-gradient-to-r from-[#4D55CC]/10 to-[#211C84]/10 px-3 py-1.5 rounded-full border border-[#4D55CC]/20 shadow-sm">
            {workSpaceAgentList?.chat_agents?.length || 0} Agents
          </span>
        </div>

        <div
          className={`flex justify-center w-full overflow-y-auto`}
          style={{ height: "calc(44vh - 5px)" }}
        >
          <div
            ref={scrollRef}
            className={`flex flex-wrap justify-start w-full ${
              scrollHeight > 260 ? "scrollbar" : "scrollbar-none"
            } gap-[1.5vw] p-4 transition-all ${
              theme === "dark" ? "scrollbar-dark" : "scrollbar-light"
            } [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar]:bg-[#f2f0ef] [&::-webkit-scrollbar-track]:bg-[#f2f0ef] [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[#4D55CC]/30 hover:[&::-webkit-scrollbar-thumb]:bg-[#4D55CC]/50`}
          >
            <CreateButton 
              onClick={replaceHandler} 
              Icon={FaPlus} 
              text="Create a new Chat Agent" 
              className="hover:scale-105 transition-transform duration-300"
            />
            {isLoading ? (
              <SkeletonCard />
            ) : (
              <>
                {workSpaceAgentList?.chat_agents?.length ? (
                  <>
                    {workSpaceAgentList.chat_agents.map((agent, index) => (
                      <AgentList key={index} agent={agent} />
                    ))}
                  </>
                ) : (
                  <div
                    className={`${
                      theme === "dark" ? "text-[#9f9f9f]" : "text-[#9f9f9f]"
                    } font-bold text-[1.1vw] w-[300px] h-[140px] flex items-center justify-center bg-gray-50 rounded-xl border border-dashed border-gray-300`}
                  >
                    No agents created
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatAgent;
