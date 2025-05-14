import React, { useEffect, useState } from "react";
import TickIcon from "../Icons/TickIcon";
import { OutlinedButton } from "../buttons/OutlinedButton";
import { ContainedButton } from "../buttons/ContainedButton";
import Source from "./chatSettings/SourceCopy";
import { useRouter } from "next/navigation";
import Actions from "./Actions";
import CreateBot from "./CreateBot";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import useTheme from "next-theme";
import { useDispatch, useSelector } from "react-redux";
import {
  setBotName,
  setDescription,
  setPrompt,
  setLoading,
} from "../../store/actions/botActions";
import { render } from "react-dom";

const MultiStepForm = () => {
  const dispatch = useDispatch();
  const [currentStep, setCurrentStep] = useState(1);
  const router = useRouter();
  const { theme } = useTheme();
  const { botName, description, prompt, loading } = useSelector(
    (state) => state.bot
  );
  const [err, setErr] = useState("");
  const { selectedWorkSpace } = useSelector((state) => state.selectedData);
  console.log('====================================');
  console.log(selectedWorkSpace);
  console.log('====================================');

  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(setLoading(false));
    }, 0);
    return () => clearTimeout(timer);
  }, [dispatch]);

  const handleGoBack = () => {
    router.back();
  };

  const autoResizeTextarea = (textarea) => {
    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight}px`;
  };

  const handleChange = (setter) => (e) => {
    dispatch(setter(e.target.value));
    if (e.target.tagName === "TEXTAREA") autoResizeTextarea(e.target);
  };

  const nextStep = () => {
    if (
      currentStep === 1 &&
      (botName === "" || description === "" || prompt === "")
    ) {
      setErr("Enter the data");
    } else if (currentStep < 3) {
      setCurrentStep((prev) => prev + 1);
    } else if (currentStep === 3) {
      router.push("/workspace/agents/chats/deploy");
    }
  };

  const prev = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const renderStepIndicator = () => (
    <div className="w-full border-b-[.1vw] gap-[8px] border-zinc-300 p-[1.5vw] h-[6vh] flex justify-center items-center">
      {["Bot Creation", "Data Sources", "Actions"].map((stepLabel, index) => (
        <React.Fragment key={index}>
          <div
            className={`circle ${
              index < currentStep
                ? "bg-green-600"
                : "border-blue-400 border-[2px] opacity-[.4]"
            } w-[2vw] h-[2vw] rounded-full flex justify-center items-center`}
          >
            {index < currentStep ? <TickIcon /> : index + 1}
          </div>
          <h2
            className={`capitalize font-medium ${
              index < currentStep ? "" : "opacity-[.4]"
            }`}
          >
            {stepLabel}
          </h2>
          {index < 2 && <div className="h-[1px] w-[3vw] bg-zinc-300"></div>}
        </React.Fragment>
      ))}
    </div>
  );

  const renderBotCreationForm = () => (
    <form
      className={`flex flex-col gap-[3vw] pb-[1vw] relative h-[100%] w-full z-10`}
    >
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

  const renderDataSourceForm = () => <Source />;

  const renderActionsForm = () => <Actions />;

  {
    /*const renderDeployment = () => (
        <Deploy currentStep={currentStep} />
      );*/
  }

  const renderContent = () => {
    if (currentStep === 1) return renderBotCreationForm();
    if (currentStep === 2) return renderDataSourceForm();
    if (currentStep === 3) return renderActionsForm();
    //if (currentStep === 4) return renderDeployment();
  };

  return (
    <div
      className={`w-full h-screen flex justify-center items-center relative ${
        theme === "dark" ? "bg-[#1F222A] text-white" : "bg-[#F2F4F7] text-black"
      }`}
    >
      <div className="flex flex-col justify-between bg-white h-[90%] w-[90%] rounded-lg relative">
        {renderStepIndicator()}
        <div className="w-[90%] mx-auto my-[20px] h-[90%] overflow-hidden bg-[#F2F4F7]">
          <div className="w-full mx-auto h-[90%] flex justify-center p-[3.5vh] !pb-[20px] overflow-y-scroll scrollBar">
            {renderContent()}
          </div>
        </div>
        <div className="w-full absolute bottom-0 bg-white h-[7.5vh] py-[10px]">
          <div className="w-full h-full flex justify-end items-center gap-[2vw] px-[3vw] pr-[10%]">
            {currentStep === 1 && (<OutlinedButton onClick={handleGoBack}>Back</OutlinedButton>)}
            {currentStep > 1 && (
              <OutlinedButton onClick={prev}>Back</OutlinedButton>
            )}
            <ContainedButton onClick={nextStep}>
              {currentStep === 3 ? "Create" : "Continue"}
            </ContainedButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MultiStepForm;
