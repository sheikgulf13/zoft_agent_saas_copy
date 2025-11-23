"use client";

import React, { useEffect, useState } from "react";
import ChatAgent from "../sidebarElements/ChatAgent";
import PhoneAgentList from "../phoneAgent/PhoneAgentLists";
import { useSelector } from "react-redux";
import { useSubscription } from "@/context/SubscriptionContext";
import { useRouter } from "next/navigation";
import SmudgyBackground from "../SmudgyBackground";

const Agents = (props) => {
  const { isLoading } = props;
  const router = useRouter();
  const [selectedAgent, setSelectedAgent] = useState("phone");
  const { workSpaceAgentList } = useSelector(
    (state) => state.workSpaceAgentList
  );
  const {
    isSubscriptionValid,
    subscriptionDetails,
    checkPermission,
    refreshSubscription,
    loading,
    error,
  } = useSubscription();
  const isAgentLimitReached =
    workSpaceAgentList?.chat_agents?.length +
      workSpaceAgentList?.phone_agents?.length >=
    subscriptionDetails?.limits?.agentLimit;

  useEffect(() => {
    refreshSubscription();
  }, []);

  // Loading state for subscription data
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="h-[100vh] py-[2%]">
      {/* Navigation Bar */}
      <div className="mb-6 mx-20 flex justify-between items-center">
        <div className="inline-flex rounded-lg p-2 ">
          {/* Chat Button Group */}
          {/*<div className="relative inline-block">
            {/* White Button /}
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

            {/* Gradient Border Underneath /}
            {selectedAgent === "chat" && (
              <div className="absolute top-full left-0 w-full h-2 rounded-b-md z-0 mt-[-4px]">
                <div className="w-full h-full rounded-b-md bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#211C84]/95 via-[#4D55CC]/90 via-[#2A1B5D]/85 via-[#3B2B8E]/80 to-[#211C84]/95" />
              </div>
            )}
          </div>*/}

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

        {isAgentLimitReached && (
          <div className="flex items-center gap-3 mr-4">
            <p className="text-sm text-red-600 font-semibold">
              Agent limit reached
            </p>
            <div className="relative w-full py-3 bg-white text-white overflow-hidden rounded-full">
              <SmudgyBackground
                colorHex={"#2D3377"}
                noiseDensity={20}
                layerCount={15}
                baseOpacity={0.15}
                opacityStep={0.05}
                fogOpacity={0.2}
                zIndex={0}
              />
              <div className=" w-full flex items-center justify-between !z-[10]">
                <button
                  onClick={() => router.push("/settings")}
                  className="w-full text-white z-[11] text-sm font-bold text-center hover:opacity-[0.8]"
                >
                  Upgrade
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Content Area */}
      <div>
        {selectedAgent === "chat" ? (
          <ChatAgent isLoading={isLoading} isLimitReached={isAgentLimitReached} />
        ) : (
          <PhoneAgentList isLoading={isLoading} isLimitReached={isAgentLimitReached} />
        )}
      </div>
    </div>
  );
};

export default Agents;
