"use client";
import useTheme from "next-theme";
import { useState, useRef, useEffect } from "react";
import { v4 } from "uuid";
import { BsRobot } from "react-icons/bs";
import { getApiConfig, getApiHeaders } from "@/utility/api-config";
import { ContainedButton } from "../buttons/ContainedButton";
import { CookieManager } from "../../utility/cookie-manager";
import SmudgyBackground from "../SmudgyBackground";
import { FaTelegramPlane } from "react-icons/fa";

const Chatbot = ({
  width,
  height,
  chatAgent,
  selectedColor,
  selectedTextColor,
  greeting,
}) => {
  // State to store the messages
  const [messages, setMessages] = useState([
    { message: "Hey! how can I help you today?.", type: "bot" },
  ]);
  const [sessionUUID, setSessionUUID] = useState("");
  const urlFetch = process.env.chat_url;
  const audioSendRef = useRef(null);
  const audioReceiveRef = useRef(null);

  useEffect(() => {
    let uuid = CookieManager.getCookie("sessionUUID");
    if (!uuid) {
      uuid = v4();
      CookieManager.setCookie("sessionUUID", uuid);
    }
    setSessionUUID(uuid);
  }, []);

  useEffect(() => {
    if (audioReceiveRef.current) {
      audioReceiveRef.current.currentTime = 0;
      audioReceiveRef.current.play().catch((e) => {
        console.warn("Audio playback failed", e);
      });
    }
    const initialMessage = {
      type: "bot",
      message: greeting ? greeting : "👋 Hi!, How can i help you?",
    };
    setMessages(() => [initialMessage]);
  }, [greeting]);

  const messageEndRef = useRef(null);

  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const clearMessages = () => {
    setMessages(useState([]));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (audioSendRef.current) {
      audioSendRef.current.play().catch((e) => {
        console.warn("Audio playback failed", e);
      });
    }

    if (!input || input === null) return;
    setMessages((prevChatLog) => [
      ...prevChatLog,
      { type: "user", message: input },
    ]);
    setInput("");
    const textInput = input;
    const data = {
      user_input: textInput,
      conversation_id: sessionUUID,
      chat_agent_id: chatAgent?.chat_agent_id || chatAgent?.id,
      conversation_history: messages,
    };
    await fetch(`${urlFetch}/tester/chat`, {
      ...getApiConfig(),
      method: "POST",
      headers: new Headers({
        ...getApiHeaders(),
        "Content-Type": "application/json",
      }),
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res) {
          if (audioReceiveRef.current) {
            audioReceiveRef.current.play().catch((e) => {
              console.warn("Audio playback failed", e);
            });
          }
        }
        setMessages((pre) => [...pre, { type: "bot", message: res.response }]);
      });
  };

  // State for the current input
  const [input, setInput] = useState("");
  const { theme } = useTheme();

  // Function to handle sending a new message
  const handleSendMessage = () => {
    if (input.trim()) {
      setMessages([...messages, { type: "user", message: input }]);
      setInput(""); // Clear input after sending

      // Simulate bot response (this is just an example, replace with real logic)
      setTimeout(() => {
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            message: "Thanks for your message! We'll get back to you shortly.",
            type: "bot",
          },
        ]);
      }, 1000);
    }
  };

  return (
    <div
      className={`relative rounded-3xl overflow-hidden max-w-[350px] flex flex-col shadow-md p-1 ${
        theme === "dark"
          ? "text-gray-400 bg-[#1F222A]"
          : "text-gray-800 bg-white"
      }`}
      style={{ height, width }}
    >
      <SmudgyBackground
        colorHex={selectedColor ? selectedColor : "#2D3377"}
        noiseDensity={10}
        layerCount={25}
        baseOpacity={0.15}
        opacityStep={0.05}
        fogOpacity={0.2}
        zIndex={1}
      />

      <audio
        ref={audioSendRef}
        src="/sounds/message-receive.mp3"
        preload="auto"
      />
      <audio
        ref={audioReceiveRef}
        src="/sounds/message-send.mp3"
        preload="auto"
      />

      {/* Header */}
      <div className="w-full z-[5] flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 flex items-center justify-center rounded-full overflow-hidden bg-[#2D3377]/10">
            <BsRobot
              className={`text-xl `}
              style={{
                color: selectedTextColor ? selectedTextColor : "#ffffff",
              }}
            />
          </div>
          <h6
            className={`text-xl font-semibold`}
            style={{ color: selectedTextColor ? selectedTextColor : "#ffffff" }}
          >
            {chatAgent?.bot_name}
          </h6>
        </div>
        <button
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors duration-200"
          onClick={clearMessages}
        >
          <lord-icon
            src="https://cdn.lordicon.com/ogkflacg.json"
            trigger="hover"
            colors={`${theme === "dark" ? "#fff" : "#fff"}`}
            style={{ height: "24px", width: "24px" }}
          ></lord-icon>
        </button>
      </div>

      <div className="flex flex-col w-full h-full justify-between rounded-3xl overflow-hidden bg-white z-[5]">
        {/* Messages Section */}
        <div className="flex-1 z-[5] overflow-y-scroll p-2 py-4 space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`p-2 rounded-xl text-xs max-w-[75%] w-fit shadow-sm ${
                message.type === "user"
                  ? "bg-gray-50 text-[#333333] ml-auto hover:bg-gray-100 transition-colors duration-200 rounded-br-none"
                  : "bg-gray-100 text-[#333333] mr-auto hover:bg-gray-200 transition-colors duration-200 rounded-bl-none"
              }`}
            >
              {message.message}
            </div>
          ))}
          {/* Add a div with ref to scroll into view */}
          <div ref={messageEndRef} />
        </div>

        {/* Input Section */}
        <div className="w-full z-[5] flex items-center gap-3 p-4">
          <input
            type="text"
            placeholder="Type a message..."
            className={`flex-1 h-12 px-4 text-base shadow-sm rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#2D3377] focus:border-transparent transition-all ${
              theme === "dark"
                ? "bg-[#1F222A] text-white border-gray-600"
                : "bg-gray-100 text-gray-800"
            }`}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit(e)}
          />
          <ContainedButton
            onClick={handleSubmit}
            className="relative h-12 !rounded-xl transition-all duration-200 overflow-hidden"
            bgColor={"#ffffff"}
          >
            <SmudgyBackground
              colorHex={selectedColor ? selectedColor : "#2D3377"}
              noiseDensity={10}
              layerCount={20}
              baseOpacity={0.15}
              opacityStep={0.05}
              fogOpacity={0.2}
              zIndex={1}
            />
            <FaTelegramPlane
              className={`text-3xl opacity-[0.85] hover:opacity-[1] z-[5]`}
              style={{
                color: selectedTextColor ? selectedTextColor : "#ffffff",
              }}
            />
          </ContainedButton>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
