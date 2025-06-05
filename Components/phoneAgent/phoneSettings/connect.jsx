"use client";

import useTheme from "next-theme";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import PhoneSettingNav from "./PhoneSettingNav";
import { SiTicktick } from "react-icons/si";
import { FaClipboardList } from "react-icons/fa";
import { FaClipboardCheck } from "react-icons/fa";

const connect = () => {
  const { theme } = useTheme();
  const [phoneAgent, setPhoneAgent] = useState(null);
  const router = useRouter();
  const [copied, setCopied] = useState(false);
  const [webhook, setWebhook]= useState('https://voice.zoft.ai/outgoing-call');

  const [embedcode, setEmbedcode]= useState('Embed code here');


  const handleCopy_webhook = async () => {
    await navigator.clipboard.writeText(webhook);
    setCopied(true);
    setTimeout(() => setCopied(false), 4000); 
  };
  const handleCopy_embedcode = async () => {
    await navigator.clipboard.writeText(embedcode);
    setCopied(true);
    setTimeout(() => setCopied(false), 4000); 
  };

  useEffect(() => {
    const agent = localStorage.getItem("current_agent");
    if (agent) {
      setPhoneAgent(JSON.parse(agent));
    }
  }, []);

  return (
    <div className="flex flex-col justify-start items-start px-8 w-full h-screen">
     <div
        className={`border-b-[1px] mt-8 mb-8 flex justify-center relative w-full text-base border-zinc-300 ${
          theme === "dark" ? "text-[#9f9f9f]" : " text-black"
        }`}
      >
        <PhoneSettingNav />
      </div>

      <div className="flex flex-col w-full h-[80vh] max-h-[80vh] mt-[2vw] items-center justify-start">
        <div className={`flex flex-col w-[50%] ${
          theme === "dark" ? "bg-[#1A1C22]" : "bg-white"
        } p-[1.2vw] rounded-xl shadow-md gap-[0.8vw]`}>
          {/* Webhook Section */}
          <div className="flex flex-col space-y-[0.2vw]">
            <h5 className={`text-[1vw] font-semibold ${
              theme === "dark" ? "text-white" : "text-[#2D3377]/90"
            }`}>
              Webhook endpoint
            </h5>
            <p className="text-[0.8vw] text-gray-600">
              Send data to your agent through webhook integration
            </p>
          </div>
          
          <div className={`flex justify-between items-center rounded-lg px-[0.8vw] py-[0.5vw] ${
            theme === "dark" ? 'bg-[#1F222A] text-white' : 'bg-gray-50 text-black'
          }`}>
            <input 
              type="text" 
              value={webhook} 
              disabled 
              className="bg-transparent w-full text-[0.8vw] focus:outline-none" 
            />
            <button 
              onClick={handleCopy_webhook}
              className="p-[0.4vw] hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              {copied ? (
                <FaClipboardCheck className="text-[#2D3377] text-[0.9vw]" />
              ) : (
                <FaClipboardList className="text-[#2D3377] text-[0.9vw]" />
              )}
            </button>
          </div>

          {/* Required Fields Section */}
          <div className="flex flex-col space-y-[0.2vw]">
            <h5 className={`text-[1vw] font-semibold ${
              theme === "dark" ? "text-white" : "text-[#2D3377]/90"
            }`}>
              Required fields
            </h5>
            <p className="text-[0.8vw] text-gray-600">
              Webhook required fields mapping
            </p>
          </div>

          <div className="space-y-[0.5vw]">
            <div className="flex items-center gap-[0.5vw] p-[0.5vw] rounded-lg bg-gray-50 dark:bg-[#1F222A]">
              <SiTicktick className="text-[#2D3377] text-[0.9vw]" />
              <span className="font-medium text-[0.8vw] text-gray-800 dark:text-white">name</span>
              <p className="text-[0.8vw] text-gray-600 dark:text-gray-300">required field, field name: name, type: text</p>
            </div>

            <div className="flex items-center gap-[0.5vw] p-[0.5vw] rounded-lg bg-gray-50 dark:bg-[#1F222A]">
              <SiTicktick className="text-[#2D3377] text-[0.9vw]" />
              <span className="font-medium text-[0.8vw] text-gray-800 dark:text-white">phone_number</span>
              <p className="text-[0.8vw] text-gray-600 dark:text-gray-300">required field, field name: phone_number, type: phone number</p>
            </div>
          </div>

          {/* Optional Fields Section */}
          <div className="flex flex-col space-y-[0.2vw]">
            <h6 className={`text-[0.9vw] font-semibold ${
              theme === "dark" ? "text-white" : "text-[#2D3377]/90"
            }`}>
              Optional
            </h6>
          </div>

          <div className="space-y-[0.5vw]">
            <div className="flex items-center gap-[0.5vw] p-[0.5vw] rounded-lg bg-gray-50 dark:bg-[#1F222A]">
              <SiTicktick className="text-[#2D3377] text-[0.9vw]" />
              <span className="font-medium text-[0.8vw] text-gray-800 dark:text-white">email</span>
              <p className="text-[0.8vw] text-gray-600 dark:text-gray-300">Optional field, field name: email, type: email</p>
            </div>

            <div className="flex items-center gap-[0.5vw] p-[0.5vw] rounded-lg bg-gray-50 dark:bg-[#1F222A]">
              <SiTicktick className="text-[#2D3377] text-[0.9vw]" />
              <span className="font-medium text-[0.8vw] text-gray-800 dark:text-white">Reason</span>
              <p className="text-[0.8vw] text-gray-600 dark:text-gray-300">Optional field, field name: reason, type: text</p>
            </div>
          </div>

          {/* Separator */}
          <div className="border-t border-gray-200 dark:border-gray-700 my-[0.8vw]"></div>

          {/* Embed Code Section */}
          <div className="flex flex-col space-y-[0.2vw]">
            <h5 className={`text-[1vw] font-semibold ${
              theme === "dark" ? "text-white" : "text-[#2D3377]/90"
            }`}>
              Embed Code
            </h5>
            <p className="text-[0.8vw] text-gray-600">
              Embed your agent website on your website
            </p>
          </div>

          <div className={`flex justify-between items-center rounded-lg px-[0.8vw] py-[0.5vw] ${
            theme === "dark" ? 'bg-[#1F222A] text-white' : 'bg-gray-50 text-black'
          }`}>
            <input 
              type="text" 
              value={embedcode} 
              disabled 
              className="bg-transparent w-full text-[0.8vw] focus:outline-none" 
            />
            <button 
              onClick={handleCopy_embedcode}
              className="p-[0.4vw] hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              {copied ? (
                <FaClipboardCheck className="text-[#2D3377] text-[0.9vw]" />
              ) : (
                <FaClipboardList className="text-[#2D3377] text-[0.9vw]" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default connect;
