"use client";

import { OutlinedButton } from "@/Components/buttons/OutlinedButton";
import SmudgyBackground from "@/Components/SmudgyBackground";
import { getApiConfig, getApiHeaders } from "@/utility/api-config";
import { set } from "lodash";
import useTheme from "next-theme";
import { useRouter } from "next/navigation";
import React, { use, useEffect, useState } from "react";
import { HexColorPicker } from "react-colorful";
import { FaArrowLeftLong } from "react-icons/fa6";
import { useSelector } from "react-redux";
import Chatbot from "../../Chatbot";
import ChatSettingNav from "../ChatSettingNav";

const Playground = () => {
  const { theme } = useTheme();
  const router = useRouter();
  const { selectedChatAgent } = useSelector((state) => state.selectedData);
  const [selectedColor, setSelectedColor] = useState("#2D3377");
  const [selectedTextColor, setSelectedTextColor] = useState("#FFFFFF");
  const [greeting, setGreeting] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "",
  });
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [newImageChange, setNewImageChange] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const urlFetch = process.env.url;

  useEffect(() => {
    const fetchColorData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(
          `${urlFetch}/chat_agent/color_get?chat_agent_id=${selectedChatAgent.id}`,
          {
            ...getApiConfig(),
            method: "GET",
            headers: new Headers({
              ...getApiHeaders(),
            }),
          }
        );

        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }

        const data = await response.json();

        setSelectedColor(data.color_code);
        setGreeting(data.greeting);
        setImagePreview(data.logo_file_url);
        setSelectedTextColor(data.text_color);
      } catch (error) {
        console.error("Failed to fetch color data:", error);
      }
      setIsLoading(false);
    };

    fetchColorData();
  }, [selectedChatAgent, urlFetch]);

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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
    setNewImageChange(true);
  };

  const handleColorUpdate = async () => {
    try {
      setIsUpdating(true);
      setNotification({ show: false, message: "", type: "" });

      const formData = new FormData();
      formData.append("chat_agent_id", selectedChatAgent.id);
      formData.append("color_code", selectedColor);
      formData.append("text_color", selectedTextColor);
      formData.append("greeting", greeting || "");
      if (selectedImage) {
        formData.append("logo_file", selectedImage);
        formData.append("logo_file_name", selectedImage.name);
      }

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
          type: "success",
        });
      } else {
        throw new Error("Update failed");
      }
    } catch (error) {
      console.error("Error updating color:", error);
      setNotification({
        show: true,
        message: "Error updating Color & Greeting",
        type: "error",
      });
    } finally {
      setIsUpdating(false);
      setNewImageChange(false);
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

      {isLoading ? (
        <div className="relative overflow-hidden h-full w-full flex items-start justify-center pt-10">
          <div className="absolute h-[90%] w-[67%] left-[5%] bg-stone-50 dark:bg-neutral-900 rounded-lg border-[1px]">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle,_#b8b8b8_0.5px,_transparent_1px)] bg-[length:12px_12px] dark:bg-[radial-gradient(circle,_#b8b8b8_0.5px,_transparent_1px)] z-[1]"></div>
          </div>

          <div className="flex items-center justify-center p-8 w-[67%] h-full z-50">
            <div
              className={`flex rounded-xl justify-between items-center min-h-full w-full z-50 py-0 px-8 ${
                theme === "dark" ? "bg-[#1A1C22]" : ""
              }`}
            >
              {/* Left side loading */}
              <div className="w-[45%] rounded-xl overflow-hidden">
                <div className="flex flex-col gap-3 p-3 bg-white/70 backdrop-blur-sm border border-gray-200 rounded-xl shadow-sm">
                  <div className="animate-pulse space-y-4">
                    <div className="h-12 bg-gray-200 rounded-3xl"></div>
                    <div className="h-32 bg-gray-200 rounded-xl"></div>
                    <div className="h-24 bg-gray-200 rounded-xl"></div>
                    <div className="h-32 bg-gray-200 rounded-xl"></div>
                  </div>
                </div>
              </div>

              {/* Right side loading */}
              <div className="w-[45%] h-full rounded-3xl overflow-hidden">
                <div className="animate-pulse h-full bg-gray-200 rounded-3xl"></div>
              </div>
            </div>
          </div>

          {/* Right sidebar loading */}
          <div
            className={`${
              theme === "dark" ? "text-zinc-100" : "text-black"
            } flex flex-col w-[20%] border border-zinc-300 bg-white rounded-xl p-6`}
          >
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-gray-200 rounded"></div>
              <div className="h-8 bg-gray-200 rounded"></div>
              <div className="h-8 bg-gray-200 rounded"></div>
              <div className="h-8 bg-gray-200 rounded"></div>
              <div className="h-8 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      ) : (
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
                {/* Upload Button */}
                <div className="relative w-[75%] mx-auto h-12 bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-dashed border-blue-300 hover:border-blue-400 rounded-3xl shadow-sm mb-4 flex items-center justify-center transition-all duration-300 hover:shadow-md hover:from-blue-100 hover:to-indigo-100">
                  {imagePreview ? (
                    <div className="relative w-full h-full flex items-center justify-center">
                      <button
                        onClick={() => {
                          setSelectedImage(null);
                          setImagePreview(null);
                          setNewImageChange(false);
                        }}
                        className="w-full h-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-3xl px-4 py-2 font-medium text-sm transition-all duration-300 hover:shadow-md flex items-center justify-center gap-2"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                        {newImageChange ? "Cancel Upload" : "Remove Image"}
                      </button>
                    </div>
                  ) : (
                    <label className="w-full h-full flex items-center justify-center cursor-pointer group">
                      <div className="flex items-center gap-2 text-blue-600 group-hover:text-blue-700 font-medium text-sm transition-colors duration-200">
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                          />
                        </svg>
                        Upload Chatbot Image
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>

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

                  <div className="relative w-full h-[32px] flex justify-center items-center py-4 mt-3 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#13104A]/95 via-[#2D3377]/90 via-[#18103A]/85 via-[#211A55]/80 to-[#13104A]/95 backdrop-blur-sm text-white hover:opacity-[0.8] overflow-hidden rounded-lg">
               
                    <button
                      onClick={handleColorUpdate}
                      disabled={isUpdating}
                      className={`z-[50] text-xs font-medium transition-all duration-200  ${
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
                          onClick={() =>
                            setNotification({
                              show: false,
                              message: "",
                              type: "",
                            })
                          }
                          className="text-gray-400 hover:text-gray-600"
                        >
                          ×
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-col w-[45%] h-full gap-4 rounded-3xl overflow-hidden">
                <Chatbot
                  height={"65vh"}
                  width="100%"
                  chatAgent={selectedChatAgent}
                  selectedColor={selectedColor}
                  selectedTextColor={selectedTextColor}
                  greeting={greeting}
                  botImage={imagePreview}
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
      )}
    </div>
  );
};

export default Playground;
