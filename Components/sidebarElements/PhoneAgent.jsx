"use client";
import React, { useEffect, useRef, useState } from "react";
import GradientButton from "../buttons/GradientButton";
import { useDispatch, useSelector } from "react-redux";
import {
  setphoneAgentName,
  setphoneAgentPurpose,
  setLanguage,
  setVoice,
  setCountryCode,
  setPhoneNumber,
  setCompanyName,
  setCompanyBusiness,
  setCompanyServices,
} from "../../store/actions/phoneAgentActions";
import { useRouter } from "next/navigation";
import useTheme from "next-theme";
import TickIcon from "../Icons/TickIcon";
import { TiArrowSortedDown } from "react-icons/ti";
import { OutlinedButton } from "../buttons/OutlinedButton";
import { ContainedButton } from "../buttons/ContainedButton";
import { elevenlabsVoice } from "../../utility/eleven-labs-voice";
import { Chip } from "@mui/material";
import { fileURLToPath } from "url";

const InputField = ({
  label,
  description,
  value,
  onChange,
  placeholder,
  isTextarea = false,
  height,
  append,
  width,
}) => (
  <div
    className={`w-full mt-0 flex relative left-[13vw] items-start gap-[6vw] mb-[1vw] ${height} ${append}`}
  >
    <div className={`w-[15vw] ${append}`}>
      <h1 className={`capitalize text-[1vw] mb-[.8vh] ${append}`}>{label}</h1>
      <i>
        <h6 className="capitalize text-[.725vw] text-zinc-400">
          {description}
        </h6>
      </i>
    </div>
    {isTextarea ? (
      <textarea
        onChange={onChange}
        value={value}
        className={`text-[.95vw] mt-0 box-border border-[0.052vw] overflow-hidden border-zinc-300 px-[1vw] w-[${width}vw] pt-[1vw] pb-[3vw] resize-y rounded-[0.417vw] ${append}`}
        placeholder={placeholder}
      />
    ) : (
      <input
        onChange={onChange}
        value={value}
        type="text"
        className={`text-[.95vw] mt-0 border-[0.052vw] border-zinc-300 px-[1vw] ${height} w-[${width}vw] py-[.7vw] rounded-[0.417vw] ${append}`}
        placeholder={placeholder}
      />
    )}
  </div>
);

const PhoneAgent = () => {
  const dispatch = useDispatch();
  const { theme, setTheme } = useTheme();
  const {
    phoneAgentType,
    phoneAgentName,
    phoneAgentPurpose,
    language,
    voice,
    countryCode,
    phoneNumber,
    companyName,
    companyBusiness,
    companyServices,
  } = useSelector((state) => state.phoneAgent);
  const router = useRouter();
  const promptRef = useRef();
  const [err, setErr] = useState("");
  const [progress, setprogress] = useState(false);
  const [openAccordion01, setOpenAccordion01] = useState(true);
  const [openAccordion02, setOpenAccordion02] = useState(false);
  const [openAccordion03, setOpenAccordion03] = useState(false);
  const [phoneAgentPurposeHeight, setPhoneAgentPurposeHeight] = useState(500);
  const [companyBusinessHeight, setCompanyBusinessHeight] = useState(200);
  const [companyServiceHeight, setCompanyServiceHeight] = useState(100);
  const [businessHeight, setBusinessHeight] = useState(200);
  const [productsHeight, setProductsHeight] = useState(100);
  const [attachedTo, setAttachedTo] = useState("Attached to");
  const [voiceNames, setVoiceNames] = useState([]);
  const [voiceUrl, setVoiceUrl] = useState("");
  const audioRef = useRef();

  const languages = elevenlabsVoice?.map((item) => item.language_accent);

  const uniqueLanguages = [...new Set(languages)];

  useEffect(() => {
    const filteredVoiceNames = elevenlabsVoice.filter(
      (item) => item.language_accent === language
    );
    setVoiceNames(filteredVoiceNames);
  }, [language]);

  const handleVoiceChange = (e) => {
    console.log('voice selected')
    dispatch(setVoice(e.target.value));
    console.log('voice set on redux');

    const filteredVoiceUrl = elevenlabsVoice.find(
      (item) => item.voice_id === e.target.value
    );

    if (filteredVoiceUrl) {
      console.log(filteredVoiceUrl)
      setVoiceUrl(filteredVoiceUrl.preview_url);
    } else {
      setVoiceUrl("");
    }
  };

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.load(); // This forces the audio element to reload
    }
  }, [voiceUrl]);

  // Function to auto-resize textarea
  const autoResize = (e) => {
    e.target.style.height = "auto"; // Reset the height
    e.target.style.height = `${e.target.scrollHeight}px`; // Set to scrollHeight
  };

  const accordion1Handler = () => {
    setOpenAccordion01(!openAccordion01);
    setOpenAccordion02(false);
    setOpenAccordion03(false);
  };
  const accordion2Handler = () => {
    setOpenAccordion02(!openAccordion02);
    setOpenAccordion01(false);
    setOpenAccordion03(false);
  };

  const purposeHandler = (e) => {
    const text = e.target.value;
    dispatch(setphoneAgentPurpose(text));
    //dispatch(setPrompt(text));  // Update Redux store on change
    if (e.target.tagName === "TEXTAREA") {
      autoResize(e);
      setPhoneAgentPurposeHeight(e.target.scrollHeight + 320);
    }
  };
  const productsHandler = (e) => {
    const text = e.target.value;
    dispatch(setCompanyServices(text));
    //dispatch(setphoneAgentPurpose(text));  // Update Redux store on change
    if (e.target.tagName === "TEXTAREA") {
      autoResize(e);
      setProductsHeight(e.target.scrollHeight - 50);
    }
  };

  const businessHandler = (e) => {
    const text = e.target.value;
    dispatch(setCompanyBusiness(text));
    //dispatch(setcompanyBusiness(text))  // Update Redux store on change
    if (e.target.tagName === "TEXTAREA") {
      autoResize(e);
      setBusinessHeight(e.target.scrollHeight + 130);
    }
  };

  const prevHandler = () => {
    router.push("/workspace/agents");
  };

  const nextHandler = () => {
    if (
      phoneAgentName === "" ||
      phoneAgentPurpose === "" ||
      language === "" ||
      voice === "" ||
      phoneNumber === ""
    ) {
      setErr("Enter the data");
      setprogress(false);
    } else {
      router.push("/workspace/agents/phone/actions");
      setprogress(true);
    }
  };

  return (
    <div
      className={`flex text-[.9vw] w-full h-screen relative ${
        theme === "dark" ? "bg-[#1F222A] text-white" : "bg-[#F2F4F7] text-black"
      }`}
    >
      <div className="flex flex-col w-full h-full">
        <div
          className={`w-full relative top-0 left-[50%] translate-x-[-50%] border-b-[.1vw] border-zinc-300 p-[1.5vw] h-[6vh] flex justify-center items-center ${
            theme === "dark" ? "bg-[#1A1C21] text-white" : "bg-white text-black"
          }`}
        >
          <div className="w-[75%] h-full flex items-center justify-center gap-[1vw]">
            <div className="h-full flex items-center justify-start gap-[.5vw]">
              <div className="circle text-blue-400  w-[2vw] h-[2vw] border-cyan-500 border-[.2vw] rounded-full flex justify-center items-center">
                {progress ? <TickIcon /> : 1}
              </div>
              <h2 className="capitalize font-medium text-[.9vw]">
                phonebot creation
              </h2>
              {/* <Chip label={phoneAgentType} color="primary" /> */}
            </div>

            <div className="h-[1px] w-[3vw] bg-zinc-300 "></div>

            <div className="h-full flex items-center justify-start gap-[.5vw] opacity-[.4]">
              <div className="circle text-blue-400  w-[2vw] h-[2vw] rounded-full border-cyan-500 border-[.2vw] flex justify-center items-center">
                2
              </div>
              <h2 className="capitalize font-medium text-[.9vw]">Actions</h2>
            </div>

            <div className="h-[1px] w-[3vw] bg-zinc-300 "></div>

            <div className="h-full flex items-center justify-start gap-[.5vw] opacity-[.4]">
              <div className="circle text-blue-400 w-[2vw] h-[2vw] rounded-full border-cyan-500 border-[.2vw] flex justify-center items-center">
                3
              </div>
              <h2 className="capitalize font-medium text-[.9vw]">Preview</h2>
            </div>
          </div>
        </div>

        <h1 className="text-[1.3vw] font-semibold py-[2%] px-[3vw]">
          Phone Agent <Chip label={phoneAgentType === "outbound" ? "Outbound" : "Inbound"} color="primary"/>
        </h1>
        

        <div className="flex w-full h-full pb-[1vw] justify-center items-start overflow-hidden">
          <div className="flex flex-col w-full items-center justify-start gap-[1.2vw]">
            <div
              className={`overflow-hidden w-[75vw] h-auto rounded-[0.625vw] transition-all duration-500 relative ${
                theme === "dark"
                  ? "bg-[#1A1C21] text-white"
                  : "bg-white text-black"
              }`}
            >
              <div className="top h-fit w-full flex flex-col transition-all duration-1000">
                <div
                  className={`${
                    openAccordion01 && theme === "dark"
                      ? "bg-[#1F222A]"
                      : openAccordion01 && "bg-[#F2F4F7]"
                  } transition-all duration-1000 flex justify-between items-center py-[1%] px-[2vw]`}
                  onClick={accordion1Handler}
                >
                  <h1 className="text-[1.1vw] capitalize">Agent Settings</h1>
                  <div
                    className="p-[.3vw] flex items-center gap-[1vw]"
                    
                  >
                    {(!openAccordion01 && err && phoneAgentName === "") ||
                    (!openAccordion01 && err && phoneAgentPurpose === "") ? (
                      <span className="text-red-900 capitalize Hsm font-medium transition-all duration-700">
                        *Data Required
                      </span>
                    ) : (
                      <></>
                    )}
                    <TiArrowSortedDown
                      className={`${
                        theme === "dark" ? "text-white" : "text-black"
                      } ${
                        openAccordion01 ? "-rotate-180" : ""
                      } transition-all duration-700 text-[2vw] cursor-pointer`}
                    />
                  </div>
                </div>

                <div
                  className={`relative w-full  px-[2vw]  transition-all duration-1000 ${
                    !openAccordion01
                      ? "pointer-events-none h-[0vh] !pt-0 my-0 overflow-hidden"
                      : "h-[53vh] overflow-y-scroll scrollBar pt-[1.5vw]"
                  }`}
                >
                  <div className="bg-gray-100 rounded-lg p-6 mb-8">
                    <h1 className="text-2xl font-bold mb-3">
                      AI Assistant Configuration
                    </h1>
                    <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Left Column */}
                      <div className="space-y-6">
                        {/* Name Field */}
                        <div className="space-y-2">
                          <label
                            htmlFor="name"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Name <span className="text-red-500">*</span>
                            {err && name === "" && (
                              <span className="text-red-900 capitalize Hsm font-medium ml-[1%] ">
                                Enter the data
                              </span>
                            )}
                          </label>
                          <input
                            id="name"
                            type="text"
                            value={phoneAgentName}
                            onChange={(e) =>
                              dispatch(setphoneAgentName(e.target.value))
                            }
                            placeholder="What name will your assistant go by"
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                          <p className="text-xs text-gray-500">
                            What name will your assistant go by
                          </p>
                        </div>

                        {/* Purpose Field */}
                        <div className="space-y-2">
                          <label
                            htmlFor="purpose"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Purpose or Goal{" "}
                            <span className="text-red-500">*</span>
                            {err && purpose === "" && (
                              <span className="text-red-900 capitalize Hsm font-medium ml-[1%] ">
                                Enter the data
                              </span>
                            )}
                          </label>
                          <textarea
                            id="purpose"
                            value={phoneAgentPurpose}
                            onChange={(e) => purposeHandler(e)}
                            onInput={autoResize} // Call autoResize on input
                            placeholder="Describe the purpose or goal of your AI assistant"
                            rows={1} // Start with 1 row
                            className="w-full border min-h-[180px] border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none overflow-hidden transition-all duration-200 ease-in-out"
                          />
                          <p className="text-xs text-gray-500">
                            Describe the main purpose or goal of your AI
                            assistant
                          </p>
                        </div>
                      </div>

                      {/* Right Column */}
                      <div className="space-y-6">
                        {/* Language Field */}
                        <div className="space-y-2">
                          <label
                            htmlFor="language"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Language <span className="text-red-500">*</span>
                            {err && language === "" && (
                              <span className="text-red-900 capitalize Hsm font-medium ml-[1%] ">
                                Enter the data
                              </span>
                            )}
                          </label>
                          <select
                            id="language"
                            value={language}
                            onChange={(e) => dispatch(setLanguage(e.target.value))}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="">Select Language</option>
                            {uniqueLanguages?.map((language, index) => (
                              <option value={language}>{language}</option>
                            ))}
                          </select>
                          <p className="text-xs text-gray-500">
                            Select the language your agent will use
                          </p>
                        </div>

                        {/* Voice Field */}
                        <div className="space-y-2">
                          <label
                            htmlFor="voice"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Voice <span className="text-red-500">*</span>
                            {err && voice === "" && (
                              <span className="text-red-900 capitalize Hsm font-medium ml-[1%] ">
                                Enter the data
                              </span>
                            )}
                          </label>
                          <div className="flex bg-white border border-gray-300 rounded-md p-1">
                            <select
                              id="voice"
                              value={voice}
                              onChange={(e) => handleVoiceChange(e)}
                              className="w-[50%] rounded-tl-md rounded-bl-md  px-3 py-1 appearance-none focus:outline-none "
                              >
                              <option value="">Choose a voice</option>
                              {voiceNames?.map((voice, index) => (
                                <option value={voice?.voice_id}>
                                  {voice?.name}
                                </option>
                              ))}
                            </select>

                            <audio ref={audioRef} controls>
                              <source src={voiceUrl} type="audio/mpeg" />
                              Your browser does not support the audio element.
                            </audio>
                          </div>
                          <p className="text-xs text-gray-500">
                            Select what voice your agent will use
                          </p>
                        </div>

                        {/* Phone Number Field */}
                        <div className="space-y-2">
                          <label
                            htmlFor="phone"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Phone number <span className="text-red-500">*</span>
                            {err && phoneNumber === "" && (
                              <span className="text-red-900 capitalize Hsm font-medium ml-[1%]">
                                Enter the data
                              </span>
                            )}
                          </label>

                          <div className="flex items-center border border-gray-300 rounded-md overflow-hidden">
                            {/* Country Code Select */}
                            <select
                              name="country code"
                              id="countryCode"
                              className="border-0 bg-transparent focus:ring-0 focus:outline-none py-2 px-3"
                              value={countryCode}
                              onChange={(e) => dispatch(setCountryCode(e.target.value))}
                            >
                              <option value="+91">+91</option>
                              <option value="+92">+92</option>
                              <option value="+93">+93</option>
                            </select>

                            {/* Phone Number Input */}
                            <input
                              id="phone"
                              type="number"
                              onChange={(e) => dispatch(setPhoneNumber(e.target.value))}
                              placeholder={countryCode}
                              value={phoneNumber}
                              className="w-full number-input border-0 focus:ring-0 focus:outline-none px-3 py-2"
                            />
                          </div>

                          <p className="text-xs text-gray-500">
                            Select your Twilio phone number
                          </p>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>

            <div
              className={`overflow-hidden w-[75vw] rounded-[0.625vw] transition-all duration-500  relative ${
                theme === "dark"
                  ? "bg-[#1A1C21] text-white"
                  : "bg-white text-black"
              }`}
            >
              <div className=" h-fit w-full">
                <div
                  className={`${
                    openAccordion02 && theme === "dark"
                      ? "bg-[#1F222A]"
                      : openAccordion02 && "bg-[#F2F4F7]"
                  } transition-all duration-1000 flex items-center justify-between py-[1%] px-[2vw]`}
                  onClick={accordion2Handler}
                >
                  <h1 className="text-[1.1vw] capitalize">
                    Agent Business Settings
                  </h1>
                  <div
                    className="p-[.3vw] flex items-center gap-[1vw]"
                    
                  >
                    <TiArrowSortedDown
                      className={`${
                        theme === "dark" ? "text-white" : "text-black"
                      } ${
                        openAccordion02 ? "-rotate-180" : ""
                      } transition-all duration-700 text-[2vw] cursor-pointer`}
                    />
                  </div>
                </div>
                <div
                  className={`relative w-full  px-[2vw]  transition-all duration-1000 ${
                    !openAccordion02
                      ? "pointer-events-none h-[0vw] pt-0 overflow-hidden"
                      : "h-[53vh] overflow-y-scroll scrollBar pt-[2vw]"
                  }`}
                >
                  <div className="bg-gray-100 rounded-lg p-6 mb-8">
                    <h1 className="text-2xl font-bold mb-6">
                      Company Configuration
                    </h1>
                    <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Left Column */}
                      <div className="space-y-6">
                        {/* Company Name Field */}
                        <div className="space-y-2">
                          <label
                            htmlFor="companyName"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Company Name
                          </label>
                          <input
                            id="companyName"
                            type="text"
                            value={companyName}
                            onChange={(e) => dispatch(setCompanyName(e.target.value))}
                            placeholder="Enter your company name"
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                          <p className="text-xs text-gray-500">
                            The official name of your company
                          </p>
                        </div>

                        {/* Company Business Field */}
                        <div className="space-y-2">
                          <label
                            htmlFor="companyBusiness"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Company Business{" "}
                          </label>
                          <textarea
                            id="companyBusiness"
                            value={companyBusiness}
                            onChange={(e) => businessHandler(e)}
                            onInput={autoResize} // Call autoResize on input
                            placeholder="Describe your company business"
                            rows={1} // Start with 1 row
                            className="w-full border min-h-[10vh] border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none overflow-hidden transition-all duration-200 ease-in-out"
                          />
                          <p className="text-xs text-gray-500">
                            Describe what your company does
                          </p>
                        </div>
                      </div>

                      {/* Right Column */}
                      <div className="space-y-6">
                        {/* Company Products Field */}
                        <div className="space-y-2">
                          <label
                            htmlFor="companyProducts"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Company Products{" "}
                          </label>
                          <textarea
                            id="companyProducts"
                            value={companyServices}
                            onChange={(e) => productsHandler(e)}
                            onInput={autoResize} // Call autoResize on input
                            placeholder="List your company products"
                            rows={1} // Start with 1 row
                            className="w-full border min-h-[206px] border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none overflow-hidden transition-all duration-200 ease-in-out"
                          />
                          <p className="text-xs text-gray-500">
                            List the products your company offers
                          </p>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          className={`w-full absolute bottom-0 h-[6.5vh] ${
            theme === "dark" ? "bg-[#1F222A] text-white" : "bg-white text-black"
          }`}
        >
          <div className="w-full h-full flex justify-end items-center gap-[2vw] px-[3vw] ">
            <OutlinedButton onClick={prevHandler}>Cancel</OutlinedButton>
            <ContainedButton onClick={nextHandler}>Continue</ContainedButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhoneAgent;
