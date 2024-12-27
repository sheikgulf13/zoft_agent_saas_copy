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

  const text = `<iframe 
  style="position: absolute; bottom: 0; right: 0; width: 40vw; height: 110vh; border: none;" 
  src="https://embedded-chatbot-pi.vercel.app/?id=${selectedChatAgent?.id}" 
  align="right">
</iframe>`

  return (
    <div
      className={`flex flex-col justify-center items-center px-8 w-full h-[100vh]`}
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
        className={`flex items-start justify-between p-8 sm:w-[100%] lg:w-[80%] h-full`}
      >
        <div
          className={`flex flex-col justify-center w-[20%] py-[2vw] px-[1vw] rounded-lg ${
            theme === "dark" ? "bg-[#1A1C22] text-white" : "bg-white text-black"
          }`}
        >
          <div>
            <ConnectNavs />
          </div>
        </div>
        <div
          className={`flex flex-col gap-[1.5vw] justify-start items-start h-full py-[4vw] w-[70%] px-[3.5vw] rounded-lg border-[.12vw] border-zinc-300 ${
            theme === "dark" ? "bg-[#1A1C22] text-white" : "bg-white text-black"
          }`}
        >
          <div>
            <h5 className={`font-bold text-lg`}>Chatbot 1</h5>
            <p className={`text-lg pt-[.7vw]`}>
              Preview the chatbot and tune the response as per yout outcome and
              save it
            </p>
          </div>
          <div className={`flex flex-col`}>
            <h6 className={`text-lg font-semibold`}>Embedded Code</h6>
            <p className={`text-sm `}>
              Copy the below code to your project to embed this chatbot
            </p>
            <div className={`mt-4 rounded-lg text-base`}>
              <CopyBlock
                text={text}
                language="html"
                showLineNumbers={true}
                theme={dracula}
                codeBlock
                wrapLongLines
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Embeds;
