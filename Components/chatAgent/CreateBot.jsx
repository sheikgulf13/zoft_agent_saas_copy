import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import GradientButton from "../buttons/GradientButton";
import {
  setBotName,
  setDescription,
  setPrompt,
  setLoading,
} from "../../store/actions/botActions";
import useTheme from "next-theme";
import { useRouter } from "next/navigation";
import TickIcon from "../Icons/TickIcon";
import { OutlinedButton } from "../buttons/OutlinedButton";
import { ContainedButton } from "../buttons/ContainedButton";

const CreateBot = () => {
  const dispatch = useDispatch();
  const navigate = useRouter();
  const { theme, setTheme } = useTheme();
  const { botName, description, prompt, loading } = useSelector(
    (state) => state.bot
  );
  const [err, setErr] = useState("");
  const [progress, setprogress] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(setLoading(false));
    }, 0);

    return () => clearTimeout(timer);
  }, [dispatch]);

  const autoResizeTextarea = (textarea) => {
    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight}px`;
  };

  const handleChange = (setter) => (e) => {
    dispatch(setter(e.target.value));
    //   .trim()))
    //   .split(/ +/)
    //   .join(" ")));
    if (e.target.tagName === "TEXTAREA") {
      autoResizeTextarea(e.target);
    }
  };

  const prevHandler = () => {
    navigate.push("/workspace/agents");
  };

  const nextHandler = () => {
    if (botName === "" || description === "" || prompt === "") {
      setErr("Enter the data");
    } else navigate.push("/workspace/agents/chats/datasource");
    if (botName === "") {
      setprogress(false);
    } else {
      setprogress(true);
    }
  };

  const renderForm = () => (
    <form className="flex flex-col gap-[3vw] pb-[1vw] relative ">
      {[
        {
          label: "Bot Name*",
          type: "text",
          value: botName,
          onChange: handleChange(setBotName),
          placeholder: "Enter A Name",
          Component: "input",
          descriptionText: "Enter your chatbot name (e.g, Alex, Maya)",
        },
        {
          label: "Description*",
          type: "textarea",
          value: description,
          onChange: handleChange(setDescription),
          placeholder: "",
          Component: "textarea",
          descriptionText:
            "Enter your chatbot's description, including its main purpose and tasks.(eg. A customer support assistant that answers FAQs and resolves issues, or a travel booking helper that finds and books flights and hotels)",
        },
        {
          label: "Prompt*",
          type: "text",
          value: prompt,
          onChange: handleChange(setPrompt),
          placeholder:
            "Example: you are a sales agent, talk persuasively and respond to the answers politely.",
          Component: "textarea",
          className: "prompt-input",
          descriptionText:
            "Enter a sample prompt for your chatbot, which is a typical question or request it will handle. This helps define how the chatbot shouldrespond.For example, if your chatbot assists with booking flights, you might use 'Can you help me find a flight to New York?' or if it's for customer support, 1 need help with a billing issue.' This will give the chatbot a clear idea of the types of interactions it should manage.", //
        },
      ].map(
        (
          {
            label,
            type,
            value,
            onChange,
            placeholder,
            Component,
            className,
            descriptionText,
          },
          index
        ) => (
          <div
            key={index}
            className="flex w-full justify-between relative gap-[4vw] px-[5vw]"
          >
            <div className="flex flex-col w-1/2 h-[5vh] ">
              <label htmlFor={label} className="capitalize  font-semibold">
                {label}
                {/* {err && value === '' && label !== 'Prompt' && (
                                <span className="text-red-900 capitalize Hsm absoulte top-[-4vh] font-medium ">
                                    *Enter the data
                                </span>
                            )} */}
              </label>
              <span className="text-gray-500 Hsm">
                <i>{descriptionText}</i>
              </span>
            </div>
            {err && value === "" && label !== "Prompt" && (
              <span className="text-red-900 capitalize Hsm font-medium absolute top-[-2vh] left-[39%] ">
                *Enter the data
              </span>
            )}
            {Component === "input" ? (
              <input
                id={label}
                value={value}
                onChange={onChange}
                className={`border-[0.052vw] border-zinc-300 w-full px-[1.25vw] py-[1.2vh] rounded-[0.417vw] ${className} ${
                  theme === "dark"
                    ? "bg-[#1F222A] text-white"
                    : "bg-white text-black"
                } Hmd`}
                type={type}
                placeholder={placeholder}
                required={true}
              />
            ) : (
              <textarea
                id={label}
                value={value}
                onChange={onChange}
                className={`Hmd border-[0.052vw] w-full border-zinc-300 px-[1.25vw] pt-[1.6vh] pb-[1.6vh] rounded-[0.417vw]  overflow-hidden ${
                  theme === "dark"
                    ? "bg-[#1F222A] text-white"
                    : "bg-white text-black"
                }`}
                placeholder={placeholder}
                style={{ height: "auto", minHeight: "15.772vh" }}
              ></textarea>
            )}
          </div>
        )
      )}
    </form>
  );

  const renderSkeletonForm = () => (
    <SkeletonTheme baseColor="#f5f5f5" highlightColor="#e0e0e0">
      {[{ height: 50 }, { height: 100 }, { height: 50 }].map(
        (skeletonProps, index) => (
          <div key={index} className="flex flex-col gap-[.4vw]">
            <label className="capitalize H1 font-light">
              <Skeleton width={100} />
            </label>
            <Skeleton {...skeletonProps} />
          </div>
        )
      )}
      <Skeleton width={50} height={40} />
    </SkeletonTheme>
  );

  return (
    <div
      className={`w-full h-screen relative flex flex-col justify-center items-center ${
        theme === "dark" ? "bg-[#1D2027] text-white" : "bg-[#F2F4F7] text-black"
      }`}
    >
      <div
        className={`w-full absolute top-0 left-[50%] translate-x-[-50%] border-b-[.1vw] border-zinc-300 p-[1.5vw] h-[6vh] flex justify-center items-center ${
          theme === "dark" ? "bg-[#1A1C21] text-white" : "bg-white text-black"
        }`}
      >
        <div className="w-[50%] h-full flex items-center gap-[1vw]">
          <div className="h-full flex items-center justify-start gap-[.5vw]">
            <div className="circle Hmd border border-blue-400 text-blue-400  w-[2vw] h-[2vw] rounded-full flex justify-center items-center">
              {progress ? <TickIcon /> : 1}
            </div>
            <h2 className="capitalize font-medium Hmd">bot creation</h2>
          </div>
          <div className="h-[1px] w-[3vw] bg-zinc-300 "></div>
          <div className="circle Hmd border border-blue-400 text-blue-400  w-[2vw] h-[2vw] rounded-full flex justify-center items-center">
            {2}
          </div>
          <h2 className="capitalize font-medium Hmd">data sources</h2>

          <div className="h-[1px] w-[3vw] bg-zinc-300 "></div>

          <div className="h-full flex items-center justify-start gap-[.5vw] opacity-[.4]">
            <div className="circle border Hmd border-blue-400 text-blue-400  w-[2vw] h-[2vw] rounded-full flex justify-center items-center">
              3
            </div>
            <h2 className="capitalize font-medium Hmd">deployment</h2>
          </div>
        </div>
      </div>

      <div
        className={`w-[90%] overflow-y-auto mx-auto h-[80vh] mt-[2vh] rounded-[.9vh] shadow-xl py-[3.5vh] px-[2.7vh] relative  ${
          theme === "dark" ? "bg-[#1F222A] text-white" : "bg-white text-black"
        }`}
      >
        <h1 className="text-2xl font-semibold text-left pb-[3vh]">
          {loading ? <Skeleton width={200} /> : "Create a Bot"}
        </h1>
        {loading ? renderSkeletonForm() : renderForm()}
      </div>

      <div
        className={`w-full absolute bottom-0 h-[6.5vh] ${
          theme === "dark" ? "bg-[#1F222A] text-white" : "bg-white text-black"
        }`}
      >
        <div className="w-full h-full flex justify-end items-center gap-[2vw] px-[3vw] pr-[10%] ">
          <OutlinedButton onClick={prevHandler}>Back</OutlinedButton>
          <ContainedButton onClick={nextHandler}>Continue</ContainedButton>
        </div>
      </div>
    </div>
  );
};

export default CreateBot;
