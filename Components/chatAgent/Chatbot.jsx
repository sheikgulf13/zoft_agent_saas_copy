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
    { text: "Hey! how can I help you today?.", sender: "bot" },
  ]);
  const [sessionUUID, setSessionUUID] = useState("");
  const urlFetch = process.env.url;

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
    setMessages((prevChatLog) => [...prevChatLog, { sender: 'user', text: input }])
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
      .then((res) => res.text())
      .then((res) => {
        setMessages((pre) => [...pre, { sender: "bot", text: res }]);
      });
  };

  // State for the current input
  const [input, setInput] = useState("");
  const { theme } = useTheme();

  // Function to handle sending a new message
  const handleSendMessage = () => {
    if (input.trim()) {
      setMessages([...messages, { text: input, sender: "user" }]);
      setInput(""); // Clear input after sending

      // Simulate bot response (this is just an example, replace with real logic)
      setTimeout(() => {
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            text: "Thanks for your message! We’ll get back to you shortly.",
            sender: "bot",
          },
        ]);
      }, 1000);
    }
  };

  return (
    <div
      className={`border-[1px] border-zinc-300  rounded-xl overflow-hidden flex flex-col  shadow-xl ${
        theme === "dark"
          ? "text-[#9f9f9f] bg-[#1F222A]"
          : " text-black bg-white"
      }`}
      style={{ height, width }}
    >
      {/* Header */}
      <div className="w-full border-b border-zinc-300 flex items-center justify-between p-2">
        <div className="flex items-center gap-2">
          <div className="w-[50px] h-[50px] flex items-center justify-center rounded-full overflow-hidden">
            <BsRobot className="text-lg" />
          </div>
          <h6
            className={`text-xl font-semibold ${
              theme === "dark" ? "text-[#9f9f9f]" : " text-black"
            }`}
          >
            {chatAgent?.bot_name}
          </h6>
        </div>
        <button className="cursor-pointer w-10" onClick={clearMessages}>
          <lord-icon
            src="https://cdn.lordicon.com/ogkflacg.json"
            trigger="hover"
            colors={` ${theme === "dark" ? "#fff" : "#000"}`}
            style={{ height: "20px", width: "20px" }}
          ></lord-icon>
        </button>
      </div>

      {/* Messages Section */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`p-3 rounded-lg text-base max-w-[15vw] w-fit chat-item ${
              message.sender === "user"
                ? "bg-gray-200 text-gray-800 ml-auto chat-item2"
                : "bg-[#702963] text-white mr-auto chat-item1"
            }`}
          >
            {message.text}
          </div>
        ))}
        {/* Add a div with ref to scroll into view */}
        <div ref={messageEndRef} />
      </div>

      {/* Input Section */}
      <div className="w-full flex items-center border-t border-zinc-300 p-4">
        <input
          type="text"
          placeholder="Type a message..."
          className={`flex-1 h-[40px] p-2 text-base border rounded-lg focus:outline-none focus:ring focus:border-blue-300 mr-2 ${
            theme === "dark" ? "text-[#9f9f9f]" : " text-black"
          }`}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit(e)}
        />
        <ContainedButton
          onClick={handleSubmit}
          className={`ml-2 h-[40px]`}
        >
          Send
        </ContainedButton>
      </div>
    </div>
  );
};

export default Chatbot;
