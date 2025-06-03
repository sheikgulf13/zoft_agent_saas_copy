"use client";
import useTheme from "next-theme";
import { useState, useRef, useEffect } from "react";
import { v4 } from "uuid";
import { BsRobot } from "react-icons/bs";
import { getApiConfig, getApiHeaders } from "@/utility/api-config";
import { ContainedButton } from "../buttons/ContainedButton";
import { CookieManager } from "../../utility/cookie-manager";
import SmudgyBackground from "../SmudgyBackground";
import { FaImage, FaTelegramPlane } from "react-icons/fa";

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
    { message: "Hey! how can I help you today?.", role: "bot" },
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
    console.log("message checking", messages);
  }, [messages]);

  useEffect(() => {
    if (audioReceiveRef.current) {
      audioReceiveRef.current.currentTime = 0;
      audioReceiveRef.current.play().catch((e) => {
        console.warn("Audio playback failed", e);
      });
    }
    const initialMessage = {
      role: "bot",
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
      { role: "user", message: input },
    ]);
    setInput("");
    const textInput = input;
    const data = {
      user_input: textInput,
      conversation_id: sessionUUID,
      chat_agent_id: chatAgent?.chat_agent_id || chatAgent?.id,
      conversation_history: messages,
    };
   try {
    const res = await fetch(`${urlFetch}/tester/chat`, {
      ...getApiConfig(),
      method: "POST",
      headers: new Headers({
        ...getApiHeaders(),
        "Content-Type": "application/json",
      }),
      body: JSON.stringify(data),
    });

    const resJson = await res.json();

    if (audioReceiveRef.current) {
      audioReceiveRef.current.play().catch((e) => {
        console.warn("Audio playback failed", e);
      });
    }


    const updatedItems =
      resJson?.items?.map((item) => ({
        ...item,
        imageUrl: resJson?.item_images?.[item.image] || item.imageUrl,
      })) || [];

    const { action_triggered, collected_params, item_images, ...cleanedMessage } = resJson;

    const botMessage = {
      role: "bot",
      message: resJson.response, 
      ...cleanedMessage,
      items: updatedItems,
    };

    setMessages((prev) => [...prev, botMessage]);
  } catch (error) {
    console.error("Failed to fetch bot response:", error);
  }

  };

  // State for the current input
  const [input, setInput] = useState("");
  const { theme } = useTheme();

  // Function to handle sending a new message
  const handleSendMessage = () => {
    if (input.trim()) {
      setMessages([...messages, { role: "user", message: input }]);
      setInput(""); // Clear input after sending

      // Simulate bot response (this is just an example, replace with real logic)
      setTimeout(() => {
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            message: "Thanks for your message! We'll get back to you shortly.",
            role: "bot",
          },
        ]);
      }, 1000);
    }
  };

  // Function to detect URLs in text
  const detectAndFormatLinks = (text) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const parts = text?.split(urlRegex);

    return parts.map((part, index) => {
      if (part.match(urlRegex)) {
        return (
          <a
            key={index}
            href={part}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 underline break-all"
          >
            {part}
          </a>
        );
      }
      return part;
    });
  };

  const getEmbedUrl = (url) => {
    // YouTube
    if (url.includes("youtube.com") || url.includes("youtu.be")) {
      const videoId = url.includes("youtu.be")
        ? url.split("youtu.be/")[1]?.split("?")[0]
        : url.split("v=")[1]?.split("&")[0];
      return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
    }

    // Dailymotion
    if (url.includes("dailymotion.com")) {
      const videoId = url.split("/video/")[1]?.split("?")[0];
      return videoId
        ? `https://www.dailymotion.com/embed/video/${videoId}`
        : null;
    }

    // Vimeo
    if (url.includes("vimeo.com")) {
      const videoId = url.split("vimeo.com/")[1]?.split("?")[0];
      return videoId ? `https://player.vimeo.com/video/${videoId}` : null;
    }

    // Loom
    if (url.includes("loom.com")) {
      const videoId = url.split("loom.com/")[1]?.split("?")[0];
      return videoId ? `https://www.loom.com/embed/${videoId}` : null;
    }

    return null;
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
            <div className="flex flex-col w-full gap-2">
              <div
                key={index}
                className={`p-2 rounded-xl text-base max-w-[75%] w-fit shadow-sm ${
                  message.role === "user"
                    ? "bg-gray-50 text-[#333333] ml-auto hover:bg-gray-100 transition-colors duration-200 rounded-br-none"
                    : "bg-gray-100 text-[#333333] mr-auto hover:bg-gray-200 transition-colors duration-200 rounded-bl-none"
                }`}
              >
                {message.role === "bot"
                  ? detectAndFormatLinks(message.message)
                  : message.message}
              </div>
              {message.type === "video" && message.url ? (
                <div className="w-[80%] aspect-video rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
                  <iframe
                    src={getEmbedUrl(message.url)}
                    title="Video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                  ></iframe>
                </div>
              ) : (
                <></>
              )}
              {message.type === "list_of_items" && message?.items ? (
                <div className="flex gap-3 overflow-x-auto pb-2 px-3 min-h-[300px] items-center scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent">
                  {message.items.map((card) => (
                    <div
                      key={card.id}
                      className={`flex-none w-48 h-[240px] max-h-[240px] bg-white dark:bg-gray-800 rounded-lg shadow-md p-2.5 cursor-pointer relative group hover:scale-105 transition-all duration-200`}
                    >
                      {card.isPlaceholder ? (
                        <div className="relative">
                          <div className="w-full h-28 rounded-lg mb-1.5 overflow-hidden bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                            {card.imageUrl ? (
                              typeof card.imageUrl === "string" &&
                              card?.imageUrl?.includes("supabase") ? (
                                <img
                                  src={card?.imageUrl}
                                  alt={card.title}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <img
                                  src={URL.createObjectURL(card?.imageUrl)}
                                  alt={card.title}
                                  className="w-full h-full object-cover"
                                />
                              )
                            ) : (
                              <div className="flex flex-col items-center gap-1">
                                <FaImage className="text-gray-400 text-lg" />
                                <span className="text-sm text-gray-500 dark:text-gray-400">
                                  No Image
                                </span>
                              </div>
                            )}
                          </div>
                          <h4 className="font-semibold mb-0.5 text-gray-800 dark:text-gray-100 text-sm">
                            {card.title}
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-300 mb-1.5 line-clamp-2">
                            {card.description}
                          </p>

                          {card.linkText && (
                            <div className="pt-1.5 border-t border-gray-100 dark:border-gray-700">
                              <span className="text-lg font-medium text-[#4D55CC] hover:text-[#3D45B8] transition-colors duration-200">
                                {card.linkText}
                              </span>
                            </div>
                          )}
                        </div>
                      ) : (
                        <>
                          <div className="w-full h-28 rounded-lg mb-1.5 overflow-hidden bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                            {card.imageUrl &&
                            typeof card.imageUrl === "string" &&
                            card?.imageUrl?.includes("supabase") ? (
                              <img
                                src={card.imageUrl}
                                alt={card.title}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="flex flex-col items-center gap-1">
                                <FaImage className="text-gray-400 text-lg" />
                                <span className="text-sm text-gray-500 dark:text-gray-400">
                                  No Image
                                </span>
                              </div>
                            )}
                          </div>
                          <h4 className="font-semibold mb-0.5 text-gray-800 dark:text-gray-100 text-sm">
                            {card.title}
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-300 mb-1.5 line-clamp-2">
                            {card.description}
                          </p>

                          {card.linkText && (
                            <div className="pt-1.5 border-t border-gray-100 dark:border-gray-700">
                              <a
                                href={`${card.url}`}
                                target="blank"
                                className="text-lg font-medium text-[#4D55CC] hover:text-[#3D45B8] transition-colors duration-200"
                              >
                                {card.linkText}
                              </a>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <></>
              )}
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
