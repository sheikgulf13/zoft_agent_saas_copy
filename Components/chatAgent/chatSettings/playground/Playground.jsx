"use client";

import React, { useState } from "react";
import ChatSettingNav from "../ChatSettingNav";
import useTheme from "next-theme";
import Chatbot from "../../Chatbot";
import { useRouter } from "next/navigation";
import { FaArrowLeftLong } from "react-icons/fa6";
import { OutlinedButton } from "@/Components/buttons/OutlinedButton";
import { useSelector } from "react-redux";

const Playground = () => {
  const { theme } = useTheme();
  const router = useRouter();
  const { selectedChatAgent } = useSelector((state) => state.selectedData);

  return (
    <div
      className={`flex  flex-col justify-between items-center px-8  w-full h-[100vh]`}
    >
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
          >
            <FaArrowLeftLong />
            <span className="ml-2">Back to workspace</span>
          </OutlinedButton>
        </div>
        <ChatSettingNav />
      </div>
      <div
        className={`flex  items-center justify-center p-8 w-[80%] h-full`}
      >
        <div
          className={`flex rounded-xl  justify-between min-h-full w-full py-8 px-8  ${
            theme === "dark" ? "bg-[#1A1C22]" : "bg-white"
          }`}
        >
          <div
            className={`${
              theme === "dark" ? "text-zinc-100" : "text-black"
            } flex flex-col gap-[.9vw] w-[45%] h-full border-[.15vw] rounded-xl border-zinc-300 px-[.7vw] pb-[2.5vw] pt-[.3vw] mt-[2vw] font-semibold text-base`}
          >
            <div className={`flex flex-col`}>
              <span
                className={`${
                  theme === "dark" ? "text-[#9f9f9f]" : " text-zinc-400"
                }`}
              >
                Chatbot Name
              </span>
              <h6 className={`font-bold text-base pb-[.5vw] `}>
                {selectedChatAgent?.bot_name}
              </h6>
            </div>
            <div className={`flex flex-col`}>
              <span
                className={`${
                  theme === "dark" ? "text-[#9f9f9f]" : " text-zinc-400"
                }`}
              >
                Chatbot ID
              </span>
              {selectedChatAgent?.id}
            </div>
            <div className={`flex gap-[6vw]`}>
              <div className={`flex flex-col`}>
                <span
                  className={`${
                    theme === "dark" ? "text-[#9f9f9f]" : " text-zinc-400"
                  }`}
                >
                  Status
                </span>
                Trained
              </div>
              <div className={`flex flex-col`}>
                <span
                  className={`${
                    theme === "dark" ? "text-[#9f9f9f]" : " text-zinc-400"
                  }`}
                >
                  Model
                </span>
                gpt-4o
              </div>
            </div>

            <div className={`flex flex-col`}>
              <span
                className={`${
                  theme === "dark" ? "text-[#9f9f9f]" : " text-zinc-400"
                }`}
              >
                Visibility
              </span>
              Private
            </div>
            <div className={`flex flex-col`}>
              <span
                className={`${
                  theme === "dark" ? "text-[#9f9f9f]" : " text-zinc-400"
                }`}
              >
                Number of Tokens
              </span>
              {selectedChatAgent?.total_tokens}
            </div>
            <div className={`flex flex-col`}>
              <span
                className={`${
                  theme === "dark" ? "text-[#9f9f9f]" : " text-zinc-400"
                }`}
              >
                Temperature
              </span>
              0
            </div>
            <div className={`flex flex-col`}>
              <span
                className={`${
                  theme === "dark" ? "text-[#9f9f9f]" : " text-zinc-400"
                }`}
              >
                Last trained at
              </span>
              {selectedChatAgent?.created_at?.substring(0, 10)}
            </div>
          </div>

          <div className={`w-[45%]`}>
            <Chatbot height={"70vh"} width="100%" chatAgent={selectedChatAgent} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Playground;
