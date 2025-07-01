"use client";

import React, {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import PhoneSettingNav from "./PhoneSettingNav";
import { useRouter, useSearchParams } from "next/navigation";
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
import { TiArrowSortedDown } from "react-icons/ti";

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
  const searchParams = useSearchParams();
  const isDelete = searchParams.get("isDelete") === "true";
  const [gender, setGender] = useState(
    selectedPhoneAgent?.voice_gender?.toLowerCase()
  );

  useEffect(() => {
    if (isDelete) {
      handleDeleteClick();
    }
  }, [isDelete]);

  useEffect(() => {
    console.log(selectedPhoneAgent);

    if (selectedPhoneAgent?.voice_id) {
      const filteredVoiceUrl =
        elevenlabsVoice?.elevenlabs?.find(
          (item) => item?.voice_id === selectedPhoneAgent?.voice_id
        ) ||
        elevenlabsVoice?.ultravox.find(
          (item) => item?.voiceId === selectedPhoneAgent?.voice_id
        );

      if (filteredVoiceUrl) {
        console.log(filteredVoiceUrl);
        setVoiceUrl(
          filteredVoiceUrl?.preview_url || filteredVoiceUrl?.previewUrl
        );
      } else {
        setVoiceUrl("");
      }
    }
  }, [selectedPhoneAgent]);

  useEffect(() => {
    if (audioRef.current && voiceUrl) {
      audioRef.current.load();
    }
    console.log("voice url config", voiceUrl);
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
    const filteredVoiceNames = () => {
      if (!elevenlabsVoice || !language_mapping_accent) return [];

      {/*const elevenLabsVoices = elevenlabsVoice.elevenlabs.filter((item) => {
        const genderMatch = !gender || item.labels?.gender === gender;
        const languageMatch =
          !language ||
          language_mapping_accent[language]?.includes(item.labels?.accent);
        return genderMatch && languageMatch;
      });*/}

      const ultravoxVoices = elevenlabsVoice.ultravox.filter((item) => {
        const genderMatch = !gender || item?.gender === gender;
        const languageMatch =
          !language ||
          language_mapping_accent[language]?.includes(
            item.accent?.toLowerCase()
          );
        return genderMatch && languageMatch;
      });

      return [...ultravoxVoices];
    };

    setFilteredVoiceNames(filteredVoiceNames);
  }, [language, gender, language_mapping_accent]);

  const handleVoiceChange = (e) => {
    const filteredVoiceUrl =
      elevenlabsVoice?.elevenlabs?.find((item) => item.voice_id === e.target.value) ||
      elevenlabsVoice.ultravox.find((item) => item.voiceId === e.target.value);

    if (filteredVoiceUrl) {
      console.log(filteredVoiceUrl);
      setVoiceUrl(
        filteredVoiceUrl?.preview_url || filteredVoiceUrl?.previewUrl || ""
      );
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

  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    const changes = DetectChanges();
    setHasChanges(changes > 0);
  }, [
    name,
    purpose,
    voice,
    phoneNumber,
    companyName,
    companyBusiness,
    companyServices,
    language,
    gender,
  ]);

  const DetectChanges = () => {
    let change = 0;

    if (name !== selectedPhoneAgent?.phone_agent_name) change += 1;
    if (purpose !== selectedPhoneAgent?.conversation_purpose) change += 1;
    if (voice !== selectedPhoneAgent?.voice_id) change += 1;
    if (phoneNumber !== selectedPhoneAgent?.phone_number) change += 1;
    if (companyName !== selectedPhoneAgent?.company_name) change += 1;
    if (companyBusiness !== selectedPhoneAgent?.company_business) change += 1;
    if (companyServices !== selectedPhoneAgent?.company_products_services)
      change += 1;
    if (language !== selectedPhoneAgent?.language) change += 1;
    if (
      gender?.toLowerCase() !== selectedPhoneAgent?.voice_gender?.toLowerCase()
    )
      change += 1;

    return change;
  };

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

  // Custom Hooks
  const useDebounce = (value, delay) => {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
      const handler = setTimeout(() => {
        setDebouncedValue(value);
      }, delay);

      return () => clearTimeout(handler);
    }, [value, delay]);

    return debouncedValue;
  };


  return (
    <div className="flex flex-col px-8 h-screen w-full">
      {/* Header */}
      <div
        className={`border-b-[1px] mt-8 mb-8 flex justify-center relative w-full text-base border-zinc-300 ${
          theme === "dark" ? "text-[#9f9f9f]" : " text-black"
        }`}
      >
        <PhoneSettingNav />
      </div>

      <div className="h-full flex-1 px-8 overflow-hidden scrollbar scrollbar-light">
        <div className="w-[80%] flex flex-col justify-center gap-4 mx-auto p-4 bg-white text-gray-800 rounded-xl shadow-lg">
          <div className="flex justify-end">
            <ContainedButton
              bgColor="bg-red-500 hover:bg-red-600 transition-colors"
              onClick={handleDeleteClick}
            >
              Delete
            </ContainedButton>
          </div>

          <div
            className="overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent"
            style={{ height: "calc(100vh - 340px)" }}
          >
            {/* AI Assistant Configuration Form */}
            <div className="bg-gray-50 rounded-xl p-8 shadow-sm">
              <h1 className="text-2xl font-bold text-[#2D3377]/90 mb-6">
                AI Assistant Configuration
              </h1>
              <form className="flex flex-wrap md:flex-nowrap gap-8">
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
                      className="w-full text-base border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#2D3377] focus:border-transparent transition-all"
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
                      Purpose or Goal <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="purpose"
                      value={purpose}
                      onChange={(e) => purposeHandler(e)}
                      placeholder="Describe the purpose or goal of your AI assistant"
                      rows={1}
                      className="w-full border min-h-[19.3vh] text-base border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#2D3377] focus:border-transparent resize-none overflow-hidden transition-all duration-300"
                    />
                    <p className="text-xs text-gray-500">
                      Describe the main purpose or goal of your AI assistant
                    </p>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-6 flex-1">
                  <div className="flex gap-4">
                    <div className="space-y-2 flex-1">
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
                        className="w-full text-base border border-gray-300 rounded-lg px-4 py-2.5 appearance-none focus:outline-none focus:ring-2 focus:ring-[#2D3377] focus:border-transparent transition-all"
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
                    <div className="space-y-2 flex-1">
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
                        className="w-full text-base border border-gray-300 rounded-lg px-4 py-2.5 appearance-none focus:outline-none focus:ring-2 focus:ring-[#2D3377] focus:border-transparent transition-all"
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
                    <div className="flex bg-white border border-gray-300 rounded-lg p-2 gap-2 justify-between items-center">
                      <select
                        id="voice"
                        value={voice}
                        onChange={(e) => {
                          setVoice(e.target.value);
                          handleVoiceChange(e);
                        }}
                        className="w-[50%] text-base rounded-lg px-4 py-2 appearance-none focus:outline-none focus:ring-2 focus:ring-[#2D3377] focus:border-transparent transition-all"
                      >
                        {filteredVoiceNames.map((data) => (
                          <option value={data.voice_id}>{data.name}</option>
                        ))}
                      </select>
                    
                      <audio ref={audioRef} controls className="w-[45%]">
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
                      <select
                        className="w-full appearance-none px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D3377] focus:border-transparent transition-all"
                        onChange={(e) => setPhoneNumber(e.target.value)}
                      >
                        <option
                          id="phone"
                          className="w-full text-base"
                          value={phoneNumber}
                        >
                          {phoneNumber}
                        </option>
                      </select>
                    </div>
                    <p className="text-xs text-gray-500">
                      Select your Twilio phone number
                    </p>
                  </div>
                </div>
              </form>
            </div>

            {/* Separator */}
            <div className="border-t border-gray-200 my-8"></div>

            {/* Company Configuration Form */}
            <div className="bg-gray-50 rounded-xl p-8 shadow-sm">
              <h1 className="text-2xl font-bold text-[#2D3377]/90 mb-6">
                Company Configuration
              </h1>
              <form className="flex flex-wrap md:flex-nowrap gap-8">
                {/* Left Column */}
                <div className="space-y-6 flex-1">
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
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="Enter your company name"
                      className="w-full border text-base border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#2D3377] focus:border-transparent transition-all"
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
                      Company Business 
                    </label>
                    <textarea
                      id="companyBusiness"
                      value={companyBusiness}
                      onChange={(e) => businessHandler(e)}
                      onInput={autoResize}
                      placeholder="Describe your company business"
                      rows={1}
                      className="w-full text-base border min-h-[10vh] border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#2D3377] focus:border-transparent resize-none overflow-hidden transition-all duration-300"
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
                      Company Products
                    </label>
                    <textarea
                      id="companyProducts"
                      value={companyServices}
                      onChange={(e) => productsHandler(e)}
                      onInput={autoResize}
                      placeholder="List your company products"
                      rows={1}
                      className="w-full text-base border min-h-[22vh] border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#2D3377] focus:border-transparent resize-none overflow-hidden transition-all duration-300"
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
            <ContainedButton
              onClick={updatePhoneAgent}
              disabled={!hasChanges}
              className={`transition-colors ${
                hasChanges
                  ? "hover:opacity-[0.85] cursor-pointer"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed opacity-50 pointer-events-none"
              }`}
            >
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
