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
  const [webhook, setWebhook]= useState('https://phone.zoft.ai/start-call');

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
      <div className={`border-b-[.1vw] flex justify-center px-8 mt-8 relative w-full text-base border-zinc-300 ${
        theme === "dark" ? "text-[#9f9f9f]" : "text-black"
      }`}>
        <PhoneSettingNav />
      </div>

      <div className="flex flex-col w-full h-[calc(100vh-140px)] mt-1 items-center justify-start">
        <div className={`flex flex-col w-[50%] ${
          theme === "dark" ? "bg-[#1A1C22]" : "bg-white"
        } p-6 rounded-xl shadow-lg gap-4`}>
          {/* Webhook Section */}
          <div className="flex flex-col space-y-1">
            <h5 className={`text-lg font-semibold ${
              theme === "dark" ? "text-white" : "text-[#2D3377]/90"
            }`}>
              Webhook endpoint
            </h5>
            <p className="text-sm text-gray-600">
              Send data to your agent through webhook integration
            </p>
          </div>
          
          <div className={`flex justify-between items-center rounded-lg px-3 py-2 ${
            theme === "dark" ? 'bg-[#1F222A] text-white' : 'bg-gray-50 text-black'
          }`}>
            <input 
              type="text" 
              value={webhook} 
              disabled 
              className="bg-transparent w-full text-sm focus:outline-none" 
            />
            <button 
              onClick={handleCopy_webhook}
              className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              {copied ? (
                <FaClipboardCheck className="text-[#2D3377]" />
              ) : (
                <FaClipboardList className="text-[#2D3377]" />
              )}
            </button>
          </div>

          {/* Required Fields Section */}
          <div className="flex flex-col space-y-1">
            <h5 className={`text-lg font-semibold ${
              theme === "dark" ? "text-white" : "text-[#2D3377]/90"
            }`}>
              Required fields
            </h5>
            <p className="text-sm text-gray-600">
              Webhook required fields mapping
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 p-2 rounded-lg bg-gray-50 dark:bg-[#1F222A]">
              <SiTicktick className="text-[#2D3377] text-base" />
              <span className="font-medium text-sm text-gray-800 dark:text-white">name</span>
              <p className="text-sm text-gray-600 dark:text-gray-300">required field, field name: name, type: text</p>
            </div>

            <div className="flex items-center gap-2 p-2 rounded-lg bg-gray-50 dark:bg-[#1F222A]">
              <SiTicktick className="text-[#2D3377] text-base" />
              <span className="font-medium text-sm text-gray-800 dark:text-white">phone_number</span>
              <p className="text-sm text-gray-600 dark:text-gray-300">required field, field name: phone_number, type: phone number</p>
            </div>
          </div>

          {/* Optional Fields Section */}
          <div className="flex flex-col space-y-1">
            <h6 className={`text-base font-semibold ${
              theme === "dark" ? "text-white" : "text-[#2D3377]/90"
            }`}>
              Optional
            </h6>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 p-2 rounded-lg bg-gray-50 dark:bg-[#1F222A]">
              <SiTicktick className="text-[#2D3377] text-base" />
              <span className="font-medium text-sm text-gray-800 dark:text-white">email</span>
              <p className="text-sm text-gray-600 dark:text-gray-300">Optional field, field name: email, type: email</p>
            </div>

            <div className="flex items-center gap-2 p-2 rounded-lg bg-gray-50 dark:bg-[#1F222A]">
              <SiTicktick className="text-[#2D3377] text-base" />
              <span className="font-medium text-sm text-gray-800 dark:text-white">Reason</span>
              <p className="text-sm text-gray-600 dark:text-gray-300">Optional field, field name: reason, type: text</p>
            </div>
          </div>

          {/* Separator */}
          <div className="border-t border-gray-200 dark:border-gray-700 my-3"></div>

          {/* Embed Code Section */}
          <div className="flex flex-col space-y-1">
            <h5 className={`text-lg font-semibold ${
              theme === "dark" ? "text-white" : "text-[#2D3377]/90"
            }`}>
              Embed Code
            </h5>
            <p className="text-sm text-gray-600">
              Embed your agent website on your website
            </p>
          </div>

          <div className={`flex justify-between items-center rounded-lg px-3 py-2 ${
            theme === "dark" ? 'bg-[#1F222A] text-white' : 'bg-gray-50 text-black'
          }`}>
            <input 
              type="text" 
              value={embedcode} 
              disabled 
              className="bg-transparent w-full text-sm focus:outline-none" 
            />
            <button 
              onClick={handleCopy_embedcode}
              className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              {copied ? (
                <FaClipboardCheck className="text-[#2D3377]" />
              ) : (
                <FaClipboardList className="text-[#2D3377]" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default connect;
