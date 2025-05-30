"use client";

import React, { useEffect, useState } from "react";
import ChatSettingNav from "../ChatSettingNav";
import useTheme from "next-theme";
import Chatbot from "../../Chatbot";
import { useRouter } from "next/navigation";
import { FaArrowLeftLong } from "react-icons/fa6";
import { OutlinedButton } from "@/Components/buttons/OutlinedButton";
import { useSelector } from "react-redux";
import { HexColorPicker } from "react-colorful";
import SmudgyBackground from "@/Components/SmudgyBackground";
import { getApiConfig, getApiHeaders } from "@/utility/api-config";

const Playground = () => {
  const { theme } = useTheme();
  const router = useRouter();
  const { selectedChatAgent } = useSelector((state) => state.selectedData);
  const [selectedColor, setSelectedColor] = useState("#2D3377");
  const [selectedTextColor, setSelectedTextColor] = useState("#FFFFFF");
  const [greeting, setGreeting] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: "", type: "" });
  const urlFetch = process.env.url;

  const predefinedColors = [
    "#6C5CE7",
    "#FAB1A0",
    "#55EFC4",
    "#81ECEC",
    "#FF7675",
    "#74B9FF",
    "#FFEAA7",
    "#A29BFE",
    "#E17055",
    "#00B894",
  ];

  const predefinedGreetings = [
    "Hi there! How can I assist you today?",
    "Hello! Need help with something?",
  ];

  const handleColorUpdate = async () => {
    try {
      setIsUpdating(true);
      setNotification({ show: false, message: "", type: "" });

      const formData = new FormData();
      formData.append("chat_agent_id", selectedChatAgent.id);
      formData.append("color_code", selectedColor);
      formData.append("text_color", selectedTextColor);
      formData.append("greeting", greeting || "");

      const response = await fetch(`${urlFetch}/chat_agent/color`, {
        ...getApiConfig(),
        method: "POST",
        headers: new Headers({
          ...getApiHeaders(),
        }),
        body: formData,
      });

      if (response.ok) {
        setNotification({
          show: true,
          message: "Color & Greeting update successful",
          type: "success"
        });
      } else {
        throw new Error("Update failed");
      }
    } catch (error) {
      console.error("Error updating color:", error);
      setNotification({
        show: true,
        message: "Error updating Color & Greeting",
        type: "error"
      });
    } finally {
      setIsUpdating(false);
      // Auto hide notification after 3 seconds
      setTimeout(() => {
        setNotification({ show: false, message: "", type: "" });
      }, 3000);
    }
  };

  return (
    <div
      className={`flex flex-col justify-between items-center px-8 w-full h-[100vh] bg-white`}
    >
      <div
        className={`border-b-[.1vw] flex justify-center relative w-full mt-[2vw] pt-[.6vw] text-base border-zinc-300 ${
          theme === "dark" ? "text-[#9f9f9f]" : "text-black"
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
              "border-2 border-[#8b8b8b] text-[#8b8b8b] hover:border-[#333333] hover:text-[#333333]"
            }
          >
            <FaArrowLeftLong className="text-sm" />
            <span className="text-sm">Back to workspace</span>
          </OutlinedButton>
        </div>
        <ChatSettingNav />
      </div>

      <div className="relative overflow-hidden h-full w-full flex items-start justify-center pt-10">
        <div class="absolute h-[90%] w-[67%] left-[5%] bg-stone-50 dark:bg-neutral-900 rounded-lg border-[1px] ">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle,_#b8b8b8_0.5px,_transparent_1px)] bg-[length:12px_12px] dark:bg-[radial-gradient(circle,_#b8b8b8_0.5px,_transparent_1px)] z-[1]"></div>
        </div>

        <div className="flex items-center justify-center p-8 w-[67%] h-full z-50">
          <div
            className={`flex rounded-xl justify-between items-center min-h-full w-full z-50 py-0 px-8 ${
              theme === "dark" ? "bg-[#1A1C22]" : ""
            }`}
          >
            <div className="w-[45%]  rounded-xl overflow-hidden">
              <div className="flex flex-col gap-3 p-3 bg-white/70 backdrop-blur-sm border border-gray-200 rounded-xl shadow-sm">
                <div className="flex flex-col gap-1.5">
                  <h3 className="text-sm font-semibold text-[#333333]">
                    Color Palette
                  </h3>
                  <div className="flex flex-wrap gap-1.5">
                    {predefinedColors.map((color) => (
                      <button
                        key={color}
                        className={`w-6 h-6 rounded-full border-2 transition-all duration-200 hover:scale-105 hover:shadow-sm ${
                          selectedColor === color
                            ? "border-[#333333] scale-105 shadow-sm"
                            : "border-gray-200"
                        }`}
                        style={{ backgroundColor: color }}
                        onClick={() => setSelectedColor(color)}
                      />
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-1.5 py-2">
                  <h3 className="text-sm font-semibold text-[#333333]">
                    Select Text Color:
                  </h3>
                  <div className="flex gap-1">
                    <button
                      className={`w-4 h-4 rounded-sm border-[1px] transition-all duration-200 hover:scale-105 hover:shadow-sm ${
                        selectedTextColor === "#000000"
                          ? "border-[#333333] scale-105 shadow-sm"
                          : "border-gray-200"
                      }`}
                      style={{ backgroundColor: "#000000" }}
                      onClick={() => setSelectedTextColor("#000000")}
                    />
                    <button
                      className={`w-4 h-4 rounded-sm border-[1px] transition-all duration-200 hover:scale-105 hover:shadow-sm ${
                        selectedTextColor === "#FFFFFF"
                          ? "border-[#333333] scale-105 shadow-sm"
                          : "border-gray-200"
                      }`}
                      style={{ backgroundColor: "#FFFFFF" }}
                      onClick={() => setSelectedTextColor("#ffffff")}
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  {/*}
                  <div className="flex items-center justify-between p-1.5 bg-white rounded-lg shadow-sm">
                    <span className="text-xs font-medium text-[#333333]">
                      Selected Color
                    </span>
                    <div className="flex items-center gap-1.5">
                      <div
                        className="w-5 h-5 rounded-md border-2 border-gray-100 shadow-sm"
                        style={{ backgroundColor: selectedColor }}
                      />
                      <span className="font-mono text-xs text-[#333333] bg-gray-50 px-1.5 py-0.5 rounded">
                        {selectedColor}
                      </span>
                    </div>
                  </div>*/}

                  <div className="bg-white p-2 rounded-lg shadow-sm colorPicker">
                    <HexColorPicker
                      color={selectedColor}
                      onChange={setSelectedColor}
                      className="!w-[100%] !h-[13vh]"
                    />
                  </div>

                  <div className="flex items-center gap-1.5 p-1.5 bg-white rounded-lg shadow-sm">
                    <input
                      type="text"
                      value={selectedColor}
                      onChange={(e) => setSelectedColor(e.target.value)}
                      className="px-1.5 py-0.5 border border-gray-200 rounded w-24 font-mono text-xs text-[#333333] focus:outline-none focus:border-[#333333] transition-colors"
                      placeholder="#000000"
                    />
                    <div
                      className="w-6 h-6 rounded-md border-2 border-gray-100 shadow-sm"
                      style={{ backgroundColor: selectedColor }}
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-3 p-3 mt-3 bg-white/70 backdrop-blur-sm border border-gray-200 rounded-xl shadow-sm">
                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between items-center">
                      <h3 className="text-xs font-semibold text-[#333333]">
                        Choose a Greeting
                      </h3>
                      <span className="text-xs text-gray-500">
                        {greeting ? "Custom" : "Default"}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {predefinedGreetings.map((text, index) => (
                        <button
                          key={index}
                          onClick={() => setGreeting(text)}
                          className={`px-4 py-2 rounded-lg text-xs font-medium transition-all duration-200 ${
                            greeting === text
                              ? "bg-indigo-50 text-indigo-600 ring-2 ring-indigo-500 shadow-sm"
                              : "bg-gray-50 text-gray-600 hover:bg-gray-100 hover:shadow-sm"
                          }`}
                        >
                          {text}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Enter custom greeting"
                      value={greeting}
                      onChange={(e) => setGreeting(e.target.value)}
                      className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 placeholder:text-gray-400 text-[#333333]"
                    />
                    {greeting && (
                      <button
                        onClick={() => setGreeting("")}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        ×
                      </button>
                    )}
                  </div>
                </div>

                <div className="relative w-full h-[32px] flex justify-center items-center py-4 mt-3 bg-white overflow-hidden rounded-lg">
                  <SmudgyBackground
                    colorHex={selectedColor ? selectedColor : "#2D3377"}
                    noiseDensity={10}
                    layerCount={20}
                    baseOpacity={0.15}
                    opacityStep={0.05}
                    fogOpacity={0.2}
                    zIndex={1}
                  />
                  <button
                    onClick={handleColorUpdate}
                    disabled={isUpdating}
                    className={`z-[50] text-xs font-medium transition-all duration-200 ${
                      isUpdating
                        ? " text-gray-500 cursor-not-allowed"
                        : " text-white active:scale-95"
                    }`}
                  >
                    {isUpdating ? "Updating..." : "Update Color & Greeting"}
                  </button>
                </div>

                {notification.show && (
                  <div
                    className={`absolute top-4 right-4 px-4 py-2 rounded-lg shadow-lg transition-all duration-300 transform translate-x-0 ${
                      notification.type === "success"
                        ? "bg-green-50 text-green-700 border border-green-200"
                        : "bg-red-50 text-red-700 border border-red-200"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">
                        {notification.message}
                      </span>
                      <button
                        onClick={() => setNotification({ show: false, message: "", type: "" })}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="w-[45%] h-full rounded-3xl overflow-hidden">
              <Chatbot
                height={"65vh"}
                width="100%"
                chatAgent={selectedChatAgent}
                selectedColor={selectedColor}
                selectedTextColor={selectedTextColor}
                greeting={greeting}
              />
            </div>
          </div>
        </div>

        <div
          className={`${
            theme === "dark" ? "text-zinc-100" : "text-black"
          } flex flex-col w-[20%] border border-zinc-300 bg-white rounded-xl p-6`}
        >
          {/* Bot Name */}
          <div className="flex flex-col space-y-1 mb-4">
            <span
              className={`text-sm font-medium ${
                theme === "dark" ? "text-gray-400" : "text-gray-500"
              }`}
            >
              Chatbot Name
            </span>
            <h6 className="text-xl font-bold text-[#2D3377]/90">
              {selectedChatAgent?.bot_name}
            </h6>
          </div>

          {/* Bot ID */}
          <div className="flex flex-col space-y-1 mb-4">
            <span
              className={`text-sm font-medium ${
                theme === "dark" ? "text-gray-400" : "text-gray-500"
              }`}
            >
              Chatbot ID
            </span>
            <span className="font-mono text-sm bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-md">
              {selectedChatAgent?.id}
            </span>
          </div>

          {/* Status and Model */}
          <div className="flex gap-12 mb-4">
            <div className="flex flex-col space-y-1">
              <span
                className={`text-sm font-medium ${
                  theme === "dark" ? "text-gray-400" : "text-gray-500"
                }`}
              >
                Status
              </span>
              <span className="flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                Trained
              </span>
            </div>
            <div className="flex flex-col space-y-1">
              <span
                className={`text-sm font-medium ${
                  theme === "dark" ? "text-gray-400" : "text-gray-500"
                }`}
              >
                Model
              </span>
              <span className="text-sm font-medium bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 px-3 py-1 rounded-md">
                gpt-4o
              </span>
            </div>
          </div>

          {/* Visibility */}
          <div className="flex flex-col space-y-1 mb-4">
            <span
              className={`text-sm font-medium ${
                theme === "dark" ? "text-gray-400" : "text-gray-500"
              }`}
            >
              Visibility
            </span>
            <span className="text-sm font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-3 py-1 rounded-md w-fit">
              Private
            </span>
          </div>

          {/* Number of Tokens 
                <div className="flex flex-col space-y-1 mb-4">
                  <span
                    className={`text-sm font-medium ${
                      theme === "dark" ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    Number of Tokens
                  </span>
                  <span className="font-mono text-sm bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-md">
                    {selectedChatAgent?.total_tokens}
                  </span>
                </div>*/}

          {/* Temperature
                <div className="flex flex-col space-y-1 mb-4">
                  <span
                    className={`text-sm font-medium ${
                      theme === "dark" ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    Temperature
                  </span>
                  <span className="font-mono text-sm bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-md">
                    0
                  </span>
                </div>*/}

          {/* Last Trained */}
          <div className="flex flex-col space-y-1">
            <span
              className={`text-sm font-medium ${
                theme === "dark" ? "text-gray-400" : "text-gray-500"
              }`}
            >
              Last trained at
            </span>
            <span className="font-mono text-sm bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-md">
              {selectedChatAgent?.created_at?.substring(0, 10)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Playground;
