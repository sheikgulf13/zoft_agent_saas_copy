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
  <div className="flex flex-col justify-center items-center px-8 w-full h-[100vh]">
      <div
        className={`border-b flex justify-center relative w-full mt-8 pt-6 text-base border-zinc-300 ${
          theme === "dark" ? "text-[#9f9f9f]" : "text-black"
        }`}
      >
        <div className="absolute left-8 top-[-.6vw]">
          <OutlinedButton
            onClick={() => router.push(`/workspace/agents`)}
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

      <div className="flex items-start justify-between p-8 sm:w-full lg:w-[80%] h-full gap-5">
        <div
          className={`flex flex-col justify-center w-[20%] py-8 px-4 rounded-xl shadow-lg ${
            theme === "dark" ? "bg-[#1A1C22] text-white" : "bg-white text-black"
          }`}
        >
          <ConnectNavs />
        </div>
        

        <div className={`w-[80%]`}>
          <div className={`flex flex-col items-center gap-[1vw] w-[90%] h-full px-10`}>
            <div
              className={`${
                theme === "dark"
                  ? "bg-[#1A1C22] text-white"
                  : "bg-white text-black"
              } flex items-center justify-center text-base font-semibold border-[.12vw] border-zinc-300 w-[80%] h-[7vw] rounded-md`}
            >
              Connect to Whatsapp
            </div>
            <div
              className={`${
                theme === "dark"
                  ? "bg-[#1A1C22] text-white"
                  : "bg-white text-black"
              } flex items-center justify-center text-base font-semibold border-[.12vw] border-zinc-300 w-[80%] h-[7vw] rounded-md`}
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
