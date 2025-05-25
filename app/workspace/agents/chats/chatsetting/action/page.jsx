"use client";

import React from "react";
import Actions from "../../../../../../Components/chatAgent/Actions";
import useTheme from "next-theme";
import { OutlinedButton } from "@/Components/buttons/OutlinedButton";
import { FaArrowLeftLong } from "react-icons/fa6";
import ChatSettingNav from "@/Components/chatAgent/chatSettings/ChatSettingNav";
import { useSelector } from "react-redux";
import { Router } from "next/router";
import { useRouter } from "next/navigation";

const page = () => {
  const router = useRouter();
  const { selectedChatAgent, selectedWorkSpace } = useSelector(
    (state) => state.selectedData
  );
  const { theme } = useTheme();
  return (
    <div
      className={`flex flex-col justify-start items-center px-8  w-full h-[100vh]`}
    >
      <div
        className={`border-b-[.1vw] flex justify-center relative w-full mt-[2vw] pt-[.6vw] text-base border-zinc-300 ${
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
              "border-2 border-[#808080] text-[#808080] hover:border-[#b8b8b8] hover:text-[#b8b8b8]"
            }
          >
            <FaArrowLeftLong className="text-sm" />
            <span className="text-sm">Back to workspace</span>
          </OutlinedButton>
        </div>
        <ChatSettingNav />
      </div>
      <Actions editPage={true} />
    </div>
  );
};

export default page;
