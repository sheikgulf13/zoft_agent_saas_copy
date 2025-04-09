"use client";

import React, { useEffect, useRef, useState } from "react";
import PhoneSettingNav from "./PhoneSettingNav";
import { useRouter } from "next/navigation";
import useTheme from "next-theme";
import { ContainedButton } from "@/Components/buttons/ContainedButton";
import { useSelector } from "react-redux";
import { deletePhoneAgentApi, updatePhoneAgentApi } from "@/api/agent";
import { showSuccessToast } from "../../../Components/toast/success-toast";
import {
  elevenlabsVoice,
  language_mapping_accent,
} from "../../../utility/eleven-labs-voice";
import AudioPlayer from "../../AudioPlayer";
import ConfirmationDialog from "@/Components/chatAgent/chatSettings/settings/ConfirmationDialog";

const Configure = () => {
  const { theme } = useTheme();
  const navigate = useRouter();
  const { selectedPhoneAgent, selectedWorkSpace } = useSelector(
    (state) => state.selectedData
  );

  console.log(selectedPhoneAgent);
  const audioRef = useRef(null);
  const [phoneAgentID, setPhoneAgentID] = useState(selectedPhoneAgent?.id);
  const [filteredVoiceNames, setFilteredVoiceNames] = useState([]);
  const [language, setLanguage] = useState(selectedPhoneAgent?.language);
  const [voiceUrl, setVoiceUrl] = useState("");
  const [gender, setGender] = useState(
    selectedPhoneAgent?.voice_gender?.toLowerCase()
  );
  useEffect(() => {
    console.log(selectedPhoneAgent);
    
    if (selectedPhoneAgent?.voice_id) {
      const filteredVoiceUrl = elevenlabsVoice.find(
        (item) => item.voice_id === selectedPhoneAgent?.voice_id
      );
  
      if (filteredVoiceUrl) {
        console.log(filteredVoiceUrl);
        setVoiceUrl(filteredVoiceUrl.preview_url);
      } else {
        setVoiceUrl("");
      }
    }
  }, [selectedPhoneAgent]);

  useEffect(() => {
    if (audioRef.current && voiceUrl) {
      audioRef.current.load();
    }
  }, [voiceUrl]);

  useEffect(() => {
    if (!language_mapping_accent) return;
    // console.log(language_mapping_accent[language]);

    // const filteredVoiceNames = elevenlabsVoice.filter((item) => {
    //   return (
    //     !language ||
    //     language_mapping_accent[language].includes(item.labels.accent)
    //   );
    // });
    const filteredVoiceNames = elevenlabsVoice.filter((item) => {
      return (
        (!gender || item.labels.gender === gender) &&
        (!language ||
          language_mapping_accent[language].includes(item.labels.accent))
      );
    });

    setFilteredVoiceNames(filteredVoiceNames);
  }, [language, gender, language_mapping_accent]);

  const handleVoiceChange = (e) => {
    const filteredVoiceUrl = elevenlabsVoice.find(
      (item) => item.voice_id === e.target.value
    );

    if (filteredVoiceUrl) {
      console.log(filteredVoiceUrl);
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

  // State variables for AI Assistant Configuration
  const [name, setName] = useState(selectedPhoneAgent?.phone_agent_name);
  const [purpose, setPurpose] = useState(
    selectedPhoneAgent?.conversation_purpose
  );
  const [voice, setVoice] = useState(selectedPhoneAgent?.voice_id);
  const [phoneNumber, setPhoneNumber] = useState(
    selectedPhoneAgent?.phone_number
  );
  const [countryCode, setcountryCode] = useState("+91");

  // State variables for Company Configuration
  const [companyName, setCompanyName] = useState(
    selectedPhoneAgent?.company_name
  );
  const [companyBusiness, setCompanyBusiness] = useState(
    selectedPhoneAgent?.company_business
  );
  const [companyServices, setCompanyServices] = useState(
    selectedPhoneAgent?.company_products_services
  );

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleDeleteClick = () => {
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  const handleConfirmDelete = async () => {
    // Delete chat agent from local storage and database
    if (!selectedPhoneAgent) {
      return;
    }
    await deletePhoneAgentApi(selectedPhoneAgent.id);
    navigate.push(`/workspace/agents?workspaceId=${selectedWorkSpace}`);
  };

  const updatePhoneAgent = async () => {
    let data = {
      id: selectedPhoneAgent.id,
      name,
      purpose,
      companyName,
      companyBusiness,
      companyServices,
      voiceId: voice,
      countryCode,
      phoneNumber,
      language,
    };

    await updatePhoneAgentApi(data);
  };

  // Function to auto-resize textarea
  const autoResize = (e) => {
    e.target.style.height = "auto"; // Reset the height
    e.target.style.height = `${e.target.scrollHeight}px`; // Set to scrollHeight
  };

  const purposeHandler = (e) => {
    const text = e.target.value;
    setPurpose(e.target.value);
  };
  const productsHandler = (e) => {
    const text = e.target.value;
    setCompanyServices(text);
  };

  const businessHandler = (e) => {
    const text = e.target.value;
    setCompanyBusiness(text);
  };

  const languages = Object?.keys(language_mapping_accent);

  const uniqueLanguages = [...new Set(languages)];

  // const filteredVoiceNames = elevenlabsVoice.filter(
  //   (item) => item.language_accent === language
  // );

  console.log(uniqueLanguages);
  // console.log(" PRINTING ")
  // console.log(phoneAgentID);
  return (
    <div className="flex flex-col h-screen w-full">
      {/* Header */}
      <div
        className={`border-b-[1px] flex justify-center px-8 mt-8 mb-8 w-full text-base border-zinc-300 ${
          theme === "dark" ? "text-[#9f9f9f]" : "text-black"
        }`}
      >
        <PhoneSettingNav />
      </div>

      <div className="h-full flex-1 px-8  overflow-hidden scrollbar scrollbar-light">
        <div className="w-[70%] flex flex-col justify-center gap-4 mx-auto p-5 bg-white text-gray-800 rounded-lg">
          <div className="flex justify-end">
            <ContainedButton
              backgroundColor={"rgb(239 68 68 / var(--tw-bg-opacity))"}
              onClick={handleDeleteClick}
            >
              Delete
            </ContainedButton>
          </div>
          <div
            className="overflow-y-auto"
            style={{ height: "calc(100vh - 340px)" }}
          >
            {/* AI Assistant Configuration Form */}
            <div className="bg-gray-100 rounded-lg p-6  !transition-all !duration-1000">
              <h1 className="text-2xl font-bold mb-4">
                AI Assistant Configuration
              </h1>
              <form className="flex flex-wrap md:flex-nowrap gap-6">
                {/* Left Column */}
                <div className="space-y-6 flex-1">
                  {/* Name Field */}
                  <div className="space-y-2">
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="What name will your assistant go by"
                      className="w-full text-base border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <p className="text-xs text-gray-500">
                      What name will your assistant go by
                    </p>
                  </div>

                  {/* Purpose Field */}
                  <div className="space-y-1">
                    <label
                      htmlFor="purpose"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Purpose or Goal <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="purpose"
                      value={purpose}
                      onChange={(e) => purposeHandler(e)}
                      // Call autoResize on input
                      placeholder="Describe the purpose or goal of your AI assistant"
                      rows={1} // Start with 1 row
                      className="w-full border min-h-[19.3vh] text-base border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none overflow-hidden !transition-all !duration-300"
                    />
                    <p className="text-xs text-gray-500">
                      Describe the main purpose or goal of your AI assistant
                    </p>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-6 flex-1">
                  <div className="flex gap-2">
                    <div className="space-y-2">
                      <label
                        htmlFor="gender"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Gender <span className="text-red-500">*</span>
                      </label>
                      <select
                        id="gender"
                        value={gender}
                        onChange={(e) => setGender(e.target.value)}
                        className="w-full text-base border border-gray-300 rounded-md px-3 py-2 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select Gender</option>
                        <option value="female">Female</option>
                        <option value="male">Male</option>
                      </select>
                      <p className="text-xs text-gray-500">
                        Select the Gender your agent will use
                      </p>
                    </div>
                    {/* Language Field */}
                    <div className="space-y-2">
                      <label
                        htmlFor="language"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Language <span className="text-red-500">*</span>
                      </label>
                      <select
                        id="language"
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                        className="w-full text-base border border-gray-300 rounded-md px-3 py-2 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select Language</option>
                        {uniqueLanguages.map((data) => (
                          <option value={data}>{data}</option>
                        ))}
                      </select>
                      <p className="text-xs text-gray-500">
                        Select the language your agent will use
                      </p>
                    </div>
                  </div>

                  {/* Voice Field */}
                  <div className="space-y-2">
                    <label
                      htmlFor="voice"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Voice <span className="text-red-500">*</span>
                    </label>
                    <div className="flex bg-white border border-gray-300 rounded-md p-1 justify-between">
                      <select
                        id="voice"
                        value={voice}
                        onChange={(e) => {
                          setVoice(e.target.value);
                          handleVoiceChange(e);
                        }}
                        className="w-[50%] text-base rounded-md px-3 py-2 appearance-none"
                      >
                        {filteredVoiceNames.map((data) => (
                          <option value={data.voice_id}>{data.name}</option>
                        ))}
                      </select>
                      {/* <AudioPlayer voiceUrl={voiceUrl} /> */}
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
                    </label>

                    <div className="w-full">
                      {/* Country Code Select */}
                      {/* <select
                        name="country code"
                        id="countryCode"
                        className="border-0 text-base bg-transparent focus:ring-0 focus:outline-none py-2 px-3"
                        onChange={(e) => setcountryCode(e.target.value)}
                      >
                        <option value="+91">+91</option>
                        <option value="+92">+92</option>
                        <option value="+93">+93</option>
                      </select> */}

                      {/* Phone Number Input */}
                      <select
                        className="w-full appearance-none px-2 py-1 border border-gray-300 rounded"
                        onChange={(e) => setPhoneNumber(e.target.value)}
                      >
                        <option
                          id="phone"
                          className="w-full text-base focus:ring-0 focus:outline-none px-3 py-2"
                          value={phoneNumber}
                        >
                          {phoneNumber}
                        </option>
                      </select>
                    </div>

                    <p className="text-xs text-gray-500 mt-[1px]">
                      Select your Twilio phone number
                    </p>
                  </div>
                </div>
              </form>
            </div>

            {/* Separator */}
            <div className="border-t border-gray-300 my-8"></div>

            {/* Company Configuration Form */}
            <div className="bg-gray-100 rounded-lg p-6">
              <h1 className="text-2xl font-bold mb-6">Company Configuration</h1>
              <form className="flex flex-wrap md:flex-nowrap gap-6">
                {/* Left Column */}
                <div className="space-y-6 flex-1">
                  {/* Company Name Field */}
                  <div className="space-y-2">
                    <label
                      htmlFor="companyName"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Company Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="companyName"
                      type="text"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="Enter your company name"
                      className="w-full border text-base border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                      Company Business <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="companyBusiness"
                      value={companyBusiness}
                      onChange={(e) => businessHandler(e)}
                      onInput={autoResize} // Call autoResize on input
                      placeholder="Describe your company business"
                      rows={1} // Start with 1 row
                      className="w-full text-base border min-h-[10vh] border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none overflow-hidden transition-all duration-200 ease-in-out"
                    />
                    <p className="text-xs text-gray-500">
                      Describe what your company does
                    </p>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-6 flex-1">
                  {/* Company Products Field */}
                  <div className="space-y-2">
                    <label
                      htmlFor="companyProducts"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Company Products <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="companyProducts"
                      value={companyServices}
                      onChange={(e) => productsHandler(e)}
                      onInput={autoResize} // Call autoResize on input
                      placeholder="List your company products"
                      rows={1} // Start with 1 row
                      className="w-full text-base border min-h-[22vh] border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none overflow-hidden transition-all duration-200 ease-in-out"
                    />
                    <p className="text-xs text-gray-500">
                      List the products your company offers
                    </p>
                  </div>
                </div>
              </form>
            </div>
          </div>
          <div className="flex justify-end">
            <ContainedButton onClick={updatePhoneAgent}>
              Save Changes
            </ContainedButton>
          </div>
        </div>
      </div>
      <ConfirmationDialog
        isOpen={isDialogOpen}
        onClose={handleCloseDialog}
        onConfirm={handleConfirmDelete}
        cancelClass={"border-[.2vw] border-[#702963] hover:border-opacity-[.8]"}
      />
    </div>
  );
};

export default Configure;
