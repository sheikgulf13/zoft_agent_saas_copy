"use client";

import React, { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { CookieManager } from "../../../../utility/cookie-manager"
import { v4 } from "uuid";
import useTheme from "next-theme";
import Chatbot from "../../Chatbot";
import { getApiHeaders } from "@/utility/api-config";

const DemoBot = ({ chatId }) => {
  const [open, setOpen] = useState(false);
  const [visible, setVisible] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [chatLog, setChatLog] = useState([]);
  const bottomOfChatRef = useRef(null);
  const [ripples, setRipples] = useState([]);
  const [sessionUUID, setSessionUUID] = useState(""); //session
  const urlFetch = process.env.boturl;
  //Setting session
  useEffect(() => {
    let uuid = Cookie.get("sessionUUID");
    if (!uuid) {
      uuid = v4();
      CookieManager.setCookie("sessionUUID", uuid);
    }
    setSessionUUID(uuid);
  });

  //onFirst load opening
  useEffect(() => {
    setTimeout(() => {
      setChatLog(() => [{ type: "bot", message: "Hi!, How can i help you?" }]);
    }, 2600);
  }, []);

  useEffect(() => {
    if (bottomOfChatRef?.current) {
      bottomOfChatRef?.current.scrollIntoView();
    }
    console.log(chatLog);
  }, [chatLog]);

  // floating icon toggle function
  const handleToggle = (e) => {
    e.preventDefault();
    setOpen(open === false ? true : false);

    setTimeout(() => {
      setVisible(visible === false && true);
    }, 500);
    setVisible(visible === true && false);
  };

  // input submission function
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(chatId);
    

    if (!inputValue || inputValue === null) return;
    setChatLog((prevChatLog) => [
      ...prevChatLog,
      { type: "user", message: inputValue },
    ]);
    await fetch(
      `${urlFetch}/tester/chat/embed?user_input=${inputValue}&conversation_id=${sessionUUID}`,
      {
        method: "POST",
        headers: {
          "ngrok-skip-browser-warning": "true",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_input: inputValue,
          chatLog: chatLog,
          chatId: chatId,
        }),
      }
    )
      .then((res) => res.text())
      .then((res) => {
        setChatLog((pre) => [...pre, { type: "bot", message: res }]);
        console.log(chatId);
      });
    setTimeout(() => {
      setInputValue("");
    }, 1000);
  };

  const handleOptionSubmit = (value) => {
    if (!value || value === null) return;

    setChatLog((prevChatLog) => [
      ...prevChatLog,
      { type: "user", message: value },
    ]);
    setInputValue("");
  };

  {
    /*useEffect(() => {
        if(chatLog != null) {
            const includes = chatLog?.filter(message => message?.type?.includes('user'))
            setIncludesMessage(includes.length > 0 ? true : false)
        }
    }, [chatLog])*/
  }

  const handleRippleEffect = (e) => {
    const button = e.currentTarget;
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;

    const newRipple = { x, y, size };

    setRipples([...ripples, newRipple]);

    setTimeout(() => {
      setRipples((prevRipples) =>
        prevRipples.filter((ripple) => ripple !== newRipple)
      );
    }, 1000);
  };

  return (
    <>
      <div
        className={`bg-white rounded-[.8vw] flex flex-col justify-between min-w-[30vw] min-h-[65vh] max-w-[30vw] max-h-[65vh] absolute overflow-hidden`}
      >
        <Chatbot chatAgentId={chatId} />
      </div>
    </>
  );
};

export const OptionButtons = ({ options, btnAction }) => {
  const [value, setValue] = useState();

  return (
    <div className={`flex flex-col gap-[5px] mb-[10px] max-w-[70%]`}>
      {options?.map((option, index) => (
        <div
          key={index}
          className={`rounded-xl p-[1.5px] cursor-pointer bg-gradient-to-r from-indigo-500 to-blue-500 hover:opacity-[0.8] ${
            !value ? "opacity-[1]" : value != option && "opacity-[0.5]"
          }`}
        >
          <button
            type="button"
            className={`bg-white bg-opacity-[0.9] w-full h-full rounded-xl px-3 py-1 break-words text-center`}
          >
            <span
              type="button"
              onClick={(e) => {
                setValue(e.target.innerHTML);
                btnAction(e);
              }}
              className={`w-full bg-gradient-to-r from-indigo-500 to-blue-500 text-transparent inline-block bg-clip-text font-semibold`}
              dangerouslySetInnerHTML={{ __html: option }}
            ></span>
          </button>
        </div>
      ))}
    </div>
  );
};

export const CheckBox = ({ options, setValue, btnAction }) => {
  const [inputValue, setInputValue] = useState();

  return (
    <div className={`flex flex-col gap-[5px] mb-[10px] max-w-[70%]`}>
      {options?.map((option, index) => (
        <div
          key={index}
          className={`rounded-xl w-[100%] p-[1.5px] cursor-pointer bg-gradient-to-r from-indigo-500 to-blue-500 hover:opacity-[0.8] ${
            inputValue != option && "opacity-[0.5]"
          } `}
        >
          <div
            className={`bg-white bg-opacity-[0.9] w-full h-full rounded-xl px-3 py-1`}
          >
            <div
              className={`w-full bg-gradient-to-r from-indigo-500 to-blue-500 text-transparent inline-block bg-clip-text font-semibold `}
            >
              <input
                type="radio"
                name="radio"
                id={option}
                value={option}
                className="mr-[5px]"
                checked={inputValue === option}
                onChange={(e) => {
                  setInputValue(e.target.value);
                }}
                onClick={(e) => btnAction(e)}
              />
              <label htmlFor={option} className="break-words">
                {option}
              </label>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export const ReplyInput = ({ setValue, btnAction }) => {
  return (
    <div className="flex flex-col gap-[5px] mb-[10px] max-w-[70%]">
      <div
        className={`rounded-xl w-[100%] p-[1.5px] cursor-pointer bg-gradient-to-r from-indigo-500 to-blue-500 hover:opacity-[0.8]`}
      >
        <div className={`bg-white bg-opacity-[0.9] w-full h-full rounded-xl`}>
          <input
            type="text"
            onChange={(e) => setValue(e)}
            required
            className={`bg-gradient-to-r from-indigo-500 to-blue-500 text-transparent inline-block bg-clip-text font-semibold focus:outline-none rounded-full border border-1 px-4 py-2 w-full`}
          />
        </div>
      </div>
      <button
        type="submit"
        onClick={btnAction}
        className={`bg-gradient-to-r from-indigo-500 to-blue-500 text-white rounded-full px-3 py-2 font-bold border-none`}
      >
        Submit
      </button>
    </div>
  );
};

// typing animation function
const TypingAnimation = () => {
  return (
    <div className="flex items-center space-x-2">
      <div className="w-4 h-4 rounded-full bg-gradient-to-r from-indigo-400 to-indigo-600 loadingAnimation"></div>
      <div className="w-4 h-4 rounded-full bg-gradient-to-r from-indigo-400 to-indigo-600 loadingAnimation1"></div>
      <div className="w-4 h-4 rounded-full bg-gradient-to-r from-indigo-400 to-indigo-600 loadingAnimation2"></div>
    </div>
  );
};

export default DemoBot;
