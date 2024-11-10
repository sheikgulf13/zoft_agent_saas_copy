"use client";

import React from "react";
import ChatSettingNav from "../ChatSettingNav";
import ConnectNavs from "../connect/ConnectNavs";
import useTheme from "next-theme";
import { useRouter } from "next/navigation";
import { FaArrowLeftLong } from "react-icons/fa6";
import { OutlinedButton } from "../../../buttons/OutlinedButton";

const Integrations = () => {
  const { theme } = useTheme();
  const router = useRouter();

  return (
    <div
      className={`flex flex-col justify-start items-start px-8  w-full h-[100vh]`}
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
                `/workspace/agents`
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
        className={`flex items-start justify-start py-[4vw] gap-[2vw] pl-[13vw] pr-[3vw] w-full h-full`}
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
        <div className={`flex flex-col w-[50%] h-full px-[1vw]`}>
          <div className={`flex flex-col items-start gap-[1vw] w-full h-full`}>
            <div
              className={`${
                theme === "dark"
                  ? "bg-[#1A1C22] text-white"
                  : "bg-white text-black"
              } flex items-center justify-center text-base font-semibold border-[.12vw] border-zinc-300 w-full h-[7vw] rounded-md`}
            >
              Connect to Whatsapp
            </div>
            <div
              className={`${
                theme === "dark"
                  ? "bg-[#1A1C22] text-white"
                  : "bg-white text-black"
              } flex items-center justify-center text-base font-semibold border-[.12vw] border-zinc-300 w-full h-[7vw] rounded-md`}
            >
              Connect to Telegram
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Integrations;
