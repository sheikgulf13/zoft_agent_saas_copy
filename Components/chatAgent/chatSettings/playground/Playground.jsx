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
    <div className={`flex flex-col justify-between items-center px-8 w-full h-[100vh]`}>
      <div className={`border-b-[.1vw] flex justify-center relative w-full mt-[2vw] pt-[.6vw] text-base border-zinc-300 ${
        theme === "dark" ? "text-[#9f9f9f]" : "text-black"
      }`}>
        <div className="absolute left-[2vw] top-[-.6vw]">
          <OutlinedButton
            onClick={() => router.push(`/workspace/agents?workspaceId=${selectedChatAgent?.workspace_id}`)}
            borderColor="border-2 border-[#808080] text-[#808080] hover:border-[#b8b8b8] hover:text-[#b8b8b8]"
          >
            <FaArrowLeftLong className="text-sm" />
            <span className="text-sm">Back to workspace</span>
          </OutlinedButton>
        </div>
        <ChatSettingNav />
      </div>
      
      <div className="flex items-center justify-center p-8 w-[80%] h-[calc(100vh-110px)]">
        <div className={`flex rounded-xl justify-between min-h-full w-full py-8 px-8 shadow-lg ${
          theme === "dark" ? "bg-[#1A1C22]" : "bg-white"
        }`}>
          <div className={`${
            theme === "dark" ? "text-zinc-100" : "text-black"
          } flex flex-col w-[45%] h-full border border-zinc-300 rounded-xl p-6`}>
            
            {/* Bot Name */}
            <div className="flex flex-col space-y-1 mb-4">
              <span className={`text-sm font-medium ${
                theme === "dark" ? "text-gray-400" : "text-gray-500"
              }`}>
                Chatbot Name
              </span>
              <h6 className="text-xl font-bold text-[#2D3377]/90">
                {selectedChatAgent?.bot_name}
              </h6>
            </div>

            {/* Bot ID */}
            <div className="flex flex-col space-y-1 mb-4">
              <span className={`text-sm font-medium ${
                theme === "dark" ? "text-gray-400" : "text-gray-500"
              }`}>
                Chatbot ID
              </span>
              <span className="font-mono text-sm bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-md">
                {selectedChatAgent?.id}
              </span>
            </div>

            {/* Status and Model */}
            <div className="flex gap-12 mb-4">
              <div className="flex flex-col space-y-1">
                <span className={`text-sm font-medium ${
                  theme === "dark" ? "text-gray-400" : "text-gray-500"
                }`}>
                  Status
                </span>
                <span className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  Trained
                </span>
              </div>
              <div className="flex flex-col space-y-1">
                <span className={`text-sm font-medium ${
                  theme === "dark" ? "text-gray-400" : "text-gray-500"
                }`}>
                  Model
                </span>
                <span className="text-sm font-medium bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 px-3 py-1 rounded-md">
                  gpt-4o
                </span>
              </div>
            </div>

            {/* Visibility */}
            <div className="flex flex-col space-y-1 mb-4">
              <span className={`text-sm font-medium ${
                theme === "dark" ? "text-gray-400" : "text-gray-500"
              }`}>
                Visibility
              </span>
              <span className="text-sm font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-3 py-1 rounded-md w-fit">
                Private
              </span>
            </div>

            {/* Number of Tokens */}
            <div className="flex flex-col space-y-1 mb-4">
              <span className={`text-sm font-medium ${
                theme === "dark" ? "text-gray-400" : "text-gray-500"
              }`}>
                Number of Tokens
              </span>
              <span className="font-mono text-sm bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-md">
                {selectedChatAgent?.total_tokens}
              </span>
            </div>

            {/* Temperature */}
            <div className="flex flex-col space-y-1 mb-4">
              <span className={`text-sm font-medium ${
                theme === "dark" ? "text-gray-400" : "text-gray-500"
              }`}>
                Temperature
              </span>
              <span className="font-mono text-sm bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-md">
                0
              </span>
            </div>

            {/* Last Trained */}
            <div className="flex flex-col space-y-1">
              <span className={`text-sm font-medium ${
                theme === "dark" ? "text-gray-400" : "text-gray-500"
              }`}>
                Last trained at
              </span>
              <span className="font-mono text-sm bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-md">
                {selectedChatAgent?.created_at?.substring(0, 10)}
              </span>
            </div>
          </div>

          <div className="w-[45%] rounded-xl overflow-hidden shadow-lg">
            <Chatbot
              height={"70vh"}
              width="100%"
              chatAgent={selectedChatAgent}
            />
          </div>
        </div>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
          height: 4px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: ${theme === 'dark' ? '#0A0929' : '#E5E7EB'};
          border-radius: 2px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #2D3377;
          border-radius: 2px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #211A55;
        }

        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: #2D3377 ${theme === 'dark' ? '#0A0929' : '#E5E7EB'};
        }
      `}</style>
    </div>
  );
};

export default Playground;
