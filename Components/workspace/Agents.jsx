"use client";

import React, { useState } from "react";
import ChatAgent from "../sidebarElements/ChatAgent";
import PhoneAgentList from "../phoneAgent/PhoneAgentLists";

const Agents = (props) => {
  const { isLoading } = props;
  const [selectedAgent, setSelectedAgent] = useState("chat");

  const templateCards = [
    {
      title: "Use Template",
      description: "Start with a pre-built template for your agent",
      icon: "📋",
      action: "Create",
    },
    {
      title: "Use Call Template",
      description: "Create an agent optimized for phone calls",
      icon: "📞",
      action: "Create",
    },
    {
      title: "Use Chat Template",
      description: "Create an agent optimized for chat conversations",
      icon: "💬",
      action: "Create",
    },
  ];

  return (
    <div className="h-[100vh] py-[2%]">
      {/* Navigation Bar */}
      <div className="mb-6 ml-20">
        <div className="inline-flex rounded-lg p-2 ">
          {/* Chat Button Group */}
          <div className="relative inline-block">
            {/* White Button */}
            <div className="relative z-10">
              <button
                className={`px-4 py-2 rounded-md transition-all duration-300  ${
                  selectedAgent === "chat"
                    ? "text-[#211C84] bg-white shadow-sm font-semibold"
                    : "text-[#8b8b8b] hover:bg-[#7A73D1]/10"
                }`}
                onClick={() => setSelectedAgent("chat")}
              >
                Chat Agents
              </button>
            </div>

            {/* Gradient Border Underneath */}
            {selectedAgent === "chat" && (
              <div className="absolute top-full left-0 w-full h-2 rounded-b-md z-0 mt-[-4px]">
                <div className="w-full h-full rounded-b-md bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#211C84]/95 via-[#4D55CC]/90 via-[#2A1B5D]/85 via-[#3B2B8E]/80 to-[#211C84]/95" />
              </div>
            )}
          </div>

          {/* Phone Button Group */}
          <div className="relative inline-block">
            <div className="relative z-10">
              <button
                className={`px-4 py-2 rounded-md transition-all duration-300   ${
                  selectedAgent === "phone"
                    ? "text-[#211C84] bg-white shadow-sm font-semibold"
                    : "text-[#8b8b8b] hover:bg-[#7A73D1]/10"
                }`}
                onClick={() => setSelectedAgent("phone")}
              >
                Phone Agents
              </button>
            </div>

            {/* Gradient Border Underneath */}
            {selectedAgent === "phone" && (
              <div className="absolute top-full left-0 w-full h-2 rounded-b-md z-0 mt-[-4px]">
                <div className="w-full h-full rounded-b-md bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#211C84]/95 via-[#4D55CC]/90 via-[#2A1B5D]/85 via-[#3B2B8E]/80 to-[#211C84]/95" />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div>
        {selectedAgent === "chat" ? (
          <ChatAgent isLoading={isLoading} />
        ) : (
          <PhoneAgentList isLoading={isLoading} />
        )}
      </div>
    </div>
  );
};

export default Agents;
