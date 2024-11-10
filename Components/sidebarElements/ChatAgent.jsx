"use client";
import React, { Suspense, useEffect, useRef, useState } from "react";
import CreateButton from "../buttons/CreateButton";
import { IoIosAdd } from "react-icons/io";
import { FaPlus } from "react-icons/fa";
import { useRouter } from "next/navigation";
import AgentList from "../chatAgent/AgentList";
import SkeletonCard from "../SkeletonCard";
import { getCookie } from "cookies-next";
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
    console.log(scrollHeight);
  }, [scrollRef?.current?.scrollHeight]);

  const replaceHandler = () => {
    dispatch(resetChatBot());
    router.push("/workspace/agents/chats/createbot");
  };

  return (
    <div className="h-[50%] overflow-hidden">
      <div
        className={`w-[88%] border-b-[.05vw] p-8 h-full border-zinc-300 mx-auto rounded-t-md relative  ${
          theme === "dark" ? "bg-[#1A1C22] text-white" : "bg-white text-black"
        }`}
      >
        <div
          className={`flex items-center justify-between  w-full pb-[25px]  ${
            theme === "dark" ? "text-[#9f9f9f]" : " text-black"
          }`}
        >
          <h1 className="text-lg font-bold">Chat Agents</h1>
        </div>

        <div
          className={`flex justify-center w-full overflow-y-auto`}
          style={{ height: "31vh" }}
        >
          <div
            ref={scrollRef}
            className={`flex flex-wrap justify-start w-full ${
              scrollHeight > 260 ? "scrollbar" : "scrollbar-none"
            } mt-4 gap-[2.5vw] transition-all ${
              theme === "dark" ? "scrollbar-dark" : "scrollbar-light"
            }`}
          >
            <CreateButton onClick={replaceHandler} Icon={FaPlus} text="" />
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
                      theme === "dark" ? " text-[#9f9f9f]" : " text-[#9f9f9f]"
                    } font-bold text-[1.1vw] w-[12vw] h-[12vw] flex items-center justify-center`}
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
