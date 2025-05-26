"use client";
import useTheme from "next-theme";
import { useState, useRef, useEffect } from "react";
import { v4 } from "uuid";
import { BsRobot } from "react-icons/bs";
import { getApiConfig, getApiHeaders } from '@/utility/api-config';
import { ContainedButton } from "../buttons/ContainedButton";
import {CookieManager} from "../../utility/cookie-manager"

const Chatbot = ({ width, height, chatAgent }) => {
  // State to store the messages
  const [messages, setMessages] = useState([
    { message: "Hey! how can I help you today?.", type: "bot" },
  ]);
  const [sessionUUID, setSessionUUID] = useState("");
  const urlFetch = process.env.chat_url;

  useEffect(() => {
    let uuid = CookieManager.getCookie("sessionUUID");
    if (!uuid) {
      uuid = v4();
      CookieManager.setCookie("sessionUUID", uuid);
    }
    setSessionUUID(uuid);
  }, []);

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
    
    if (!input || input === null) return
    setMessages((prevChatLog) => [...prevChatLog, { type: 'user', message: input }])
    setInput('')
    const textInput=input;
    const data = {
      "user_input": textInput,
      "conversation_id": sessionUUID,
      "chat_agent_id":  chatAgent?.chat_agent_id || chatAgent?.id ,
      "conversation_history": messages
    }
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
      className={`border border-zinc-300 rounded-xl overflow-hidden flex flex-col shadow-lg ${
        theme === "dark"
          ? "text-gray-400 bg-[#1F222A]"
          : "text-gray-800 bg-white"
      }`}
      style={{ height, width }}
    >
      {/* Header */}
      <div className="w-full border-b border-zinc-300 flex items-center justify-between p-4 bg-white dark:bg-[#1A1C22]">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 flex items-center justify-center rounded-full overflow-hidden bg-[#2D3377]/10">
            <BsRobot className="text-xl text-[#2D3377]" />
          </div>
          <h6
            className={`text-xl font-semibold ${
              theme === "dark" ? "text-white" : "text-gray-800"
            }`}
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
            colors={`${theme === "dark" ? "#fff" : "#000"}`}
            style={{ height: "24px", width: "24px" }}
          ></lord-icon>
        </button>
      </div>

      {/* Messages Section */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`p-4 rounded-xl text-base max-w-[15vw] w-fit shadow-sm ${
              message.type === "user"
                ? "bg-gray-100 text-gray-800 ml-auto hover:bg-gray-200 transition-colors duration-200"
                : "bg-[#2D3377] text-white mr-auto hover:bg-[#2D3377]/90 transition-colors duration-200"
            }`}
          >
            {message.message}
          </div>
        ))}
        {/* Add a div with ref to scroll into view */}
        <div ref={messageEndRef} />
      </div>

      {/* Input Section */}
      <div className="w-full flex items-center gap-3 border-t border-zinc-300 p-4 bg-white dark:bg-[#1A1C22]">
        <input
          type="text"
          placeholder="Type a message..."
          className={`flex-1 h-12 px-4 text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D3377] focus:border-transparent transition-all ${
            theme === "dark" 
              ? "bg-[#1F222A] text-white border-gray-600" 
              : "bg-gray-50 text-gray-800 border-gray-300"
          }`}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit(e)}
        />
        <ContainedButton
          onClick={handleSubmit}
          className="h-12 px-6 bg-[#2D3377] hover:bg-[#2D3377]/90 transition-all duration-200"
        >
          Send
        </ContainedButton>
      </div>
    </div>
  );
};

export default Chatbot;
