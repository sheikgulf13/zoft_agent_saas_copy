"use client";

import React, { useEffect, useState } from "react";
import ChatSettingNav from "../ChatSettingNav";
import ConnectNavs from "../connect/ConnectNavs";
import useTheme from "next-theme";
import { atomOneLight, CopyBlock, dracula } from "react-code-blocks";
import { useRouter } from "next/navigation";
import { FaArrowLeftLong } from "react-icons/fa6";
import { OutlinedButton } from "@/Components/buttons/OutlinedButton";
import { useSelector } from "react-redux";

const Embeds = () => {
  const { theme } = useTheme();
  const router = useRouter();
  const { selectedChatAgent } = useSelector((state) => state.selectedData);

  const text = `<script src="https://chat-embed.zoft.ai/api/chatbot-script/${selectedChatAgent?.id}">
</script>`;
  const formattedText = text.replace(/<script /g, "<script\n");

  return (
    <div className="flex flex-col justify-center items-center px-8 w-full h-[100vh]">
         <div
        className={`border-b-[.1vw] flex justify-center relative w-full mt-[2vw] pt-[.6vw] mb-[.9vw] text-base border-zinc-300 ${
          theme === "dark" ? "text-[#9f9f9f]" : " text-black"
        }`}
      >
        <div className="absolute left-[2vw] top-[-.6vw]">
          <OutlinedButton
            onClick={() => router.push(`/workspace/agents?workspaceId=${selectedChatAgent?.workspace_id}`)}
             borderColor={
              "border-2 border-[#8b8b8b] text-[#8b8b8b] hover:border-[#333333] hover:text-[#333333]"
            }
          >
            <FaArrowLeftLong className="text-sm" />
            <span className="text-sm">Back to workspace</span>
          </OutlinedButton>
        </div>
        <ChatSettingNav />
      </div>

      <div className="flex items-start justify-between p-8 sm:w-full lg:w-[80%] h-full gap-10">
        <div className={`flex flex-col justify-center w-[20%] py-8 px-4 rounded-xl shadow-lg ${
          theme === "dark" ? "bg-[#1A1C22] text-white" : "bg-white text-black"
        }`}>
          <ConnectNavs />
        </div>

        <div className="w-[80%]">
          <div className={`flex flex-col gap-8 justify-start items-start h-full py-12 w-[90%] px-10 rounded-xl border border-zinc-300 shadow-lg ${
            theme === "dark" ? "bg-[#1A1C22] text-white" : "bg-white text-black"
          }`}>
            <div className="space-y-4">
              <h5 className="text-2xl font-bold text-[#2D3377]/90">Chatbot 1</h5>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                Preview the chatbot and tune the response as per your outcome and save it
              </p>
            </div>

            <div className="flex flex-col w-full space-y-4">
              <div>
                <h6 className="text-xl font-semibold text-[#2D3377]/90">Embedded Code</h6>
                <p className="text-base text-gray-600 dark:text-gray-400 mt-1">
                  Copy the below code to your project to embed this chatbot
                </p>
              </div>
              
              <div className="mt-4 rounded-lg text-base">
                <CopyBlock
                  text={text}
                  language="html"
                  showLineNumbers={true}
                  theme={dracula}
                  wrapLongLines
                  customStyle={{
                    whiteSpace: "pre-wrap",
                    fontSize: "14px",
                    padding: "0px 30px",
                  }}
                />
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Embeds;
