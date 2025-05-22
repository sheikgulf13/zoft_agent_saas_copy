"use client";

import React, { useState } from "react";
import ChatAgent from "../sidebarElements/ChatAgent";
import PhoneAgentList from "../phoneAgent/PhoneAgentLists";

const Agents = (props) => {
  const { isLoading } = props;
  const [selectedAgent, setSelectedAgent] = useState("chat"); // Default to chat agents

  const templateCards = [
    {
      title: "Use Template",
      description: "Start with a pre-built template for your agent",
      icon: "📋",
      action: "Create"
    },
    {
      title: "Use Call Template",
      description: "Create an agent optimized for phone calls",
      icon: "📞",
      action: "Create"
    },
    {
      title: "Use Chat Template",
      description: "Create an agent optimized for chat conversations",
      icon: "💬",
      action: "Create"
    }
  ];

  return (
    <div className={`h-[100vh] py-[4%]`}>
      {/* Navigation Bar */}
      <div className="mb-6 ml-20">
        <div className="bg-gray-200 rounded-lg p-1 inline-block shadow-md">
          <button
            className={`px-4 py-2 rounded-md transition-colors duration-200 ${
              selectedAgent === "chat"
                ? "bg-[#702963] text-white shadow-sm"
                : "text-gray-600 hover:bg-gray-300"
            }`}
            onClick={() => setSelectedAgent("chat")}
          >
            Chat Agents
          </button>
          <button
            className={`px-4 py-2 rounded-md transition-colors duration-200 ${
              selectedAgent === "phone"
                ? "bg-[#702963] text-white shadow-sm"
                : "text-gray-600 hover:bg-gray-300"
            }`}
            onClick={() => setSelectedAgent("phone")}
          >
            Phone Agents
          </button>
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

      {/* Template Cards */}
      <div className="mt-8 px-20">
        <div className="flex gap-6">
          {templateCards.map((card, index) => (
            <div
              key={index}
              className="flex-1 bg-white rounded-xl shadow-md p-4 hover:shadow-lg transition-all duration-300 hover:scale-[1.02] cursor-pointer"
            >
              <div className="flex flex-col items-center text-center">
                <span className="text-3xl mb-2">{card.icon}</span>
                <h3 className="text-lg font-semibold text-gray-800 mb-1">{card.title}</h3>
                <p className="text-sm text-gray-600 mb-3">{card.description}</p>
                <button className="bg-[#702963] text-white px-5 py-1.5 rounded-md hover:bg-[#5a2250] transition-colors duration-200">
                  {card.action}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Agents;
