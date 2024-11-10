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
  const [webhook, setWebhook]= useState('webhook endpoint here');

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
    <div
      className={`flex flex-col justify-start items-start w-full h-[100vh]`}
    >
      <div
        className={`border-b-[.1vw] flex justify-center px-8 mt-8 mb-8 relative w-full text-base border-zinc-300 ${
          theme === "dark" ? "text-[#9f9f9f]" : " text-black"
        }`}
      >
        <PhoneSettingNav />
      </div>

      <div className="flex flex-col w-full h-full items-center justify-start">
        <div
          className={`flex flex-col mt-[1vw] w-[50%] text-[#9f9f9f] ${
            theme === "dark" ? "bg-black" : "bg-white"
          } p-[1.5vw] rounded-lg shadow-lg gap-[.3vw]`}
        >
          <div className="flex flex-col">
            <h5
              className={`${
                theme === "dark" ? "text-white" : "text-black"
              } font-semibold text-lg`}
              >
              Webhook endpoint
            </h5>
            <p className="font-medium text-base">
              Send data to your agent through webhook integration
            </p>
          </div>
          
          <div className={`flex justify-between items-center rounded-md px-[1vw] py-[.5vw] ${theme === "dark" ? 'bg-[#1F222A] text-white' : 'bg-[#F3F4F7] text-black'}`}>
            <input type="text" value={webhook} disabled className="bg-transparent" />
            <button onClick={handleCopy_webhook}>
              {copied ? (
                <FaClipboardCheck />
              ) : (
                <FaClipboardList />
              )}
            </button>
          </div>

          <div className="flex flex-col">
            <h5
                className={`${
                theme === "dark" ? "text-white" : "text-black"
                } font-semibold text-lg mt-[1vw]`}
            >
                Required fields
            </h5>
            <p className="font-medium text-base">
                Webhook required fields mapping
            </p>
          </div>
          <div className="flex font-medium items-center gap-[.5vw] text-base">
            <SiTicktick
              className={`${theme === "dark" ? "text-white" : "text-black"}`}
            />
            <span
              className={`${theme === "dark" ? "text-white" : "text-black"}`}
            >
              name
            </span>
            <p>required field, field name: name, type: text</p>
          </div>
          <div className="flex font-medium items-center gap-[.5vw] text-base">
            <SiTicktick
              className={`${theme === "dark" ? "text-white" : "text-black"}`}
            />
            <span
              className={`${theme === "dark" ? "text-white" : "text-black"}`}
            >
              phone_number
            </span>
            <p>required field, field name: phone_number, type: phone number</p>
          </div>
          <h6
            className={`${
              theme === "dark" ? "text-white" : "text-black"
            } text-lg font-semibold mt-[1vw]`}
          >
            Optional
          </h6>
          <div className="flex items-center font-medium gap-[.5vw] text-base">
            <SiTicktick
              className={`${theme === "dark" ? "text-white" : "text-black"}`}
            />
            <span
              className={`${theme === "dark" ? "text-white" : "text-black"}`}
            >
              email
            </span>
            <p>Optional field, field name: email, type: email</p>
          </div>
          <div className="flex items-center font-medium gap-[.5vw] text-base">
            <SiTicktick
              className={`${theme === "dark" ? "text-white" : "text-black"}`}
            />
            <span
              className={`${theme === "dark" ? "text-white" : "text-black"}`}
            >
              Reason
            </span>
            <p>Optional field, field name: reason, type: text</p>
          </div>


          {/* Separator line */}
          <div className="border-t border-gray-300 my-8"></div>

          {/* EMbed code Options */}
          <div className="flex flex-col">
            <h5
              className={`${
                theme === "dark" ? "text-white" : "text-black"
              } font-semibold text-lg`}
              >
              Embed Code
            </h5>
            <p className="font-medium text-base">
              Embed your agent website on your website
            </p>
          </div>
          <div className={`flex justify-between items-center rounded-md px-[20px] py-[45px] ${theme === "dark" ? 'bg-[#1F222A] text-white' : 'bg-[#F3F4F7] text-black'}`}>
            <input type="text" value={embedcode} disabled className="bg-transparent" />
            <button onClick={handleCopy_embedcode}>
              {copied ? (
                <FaClipboardCheck />
              ) : (
                <FaClipboardList />
              )}
            </button>
          </div>


        </div>
      </div>

    </div>
  );
};

export default connect;
