"use client";
import React, { useEffect, useState } from "react";
import DeleteIcon from "../../Icons/DeleteIcon";
import useTheme from "next-theme";
import AddFile from "./AddFileUpdate";
import ChatSettingNav from "./ChatSettingNav";
import { useDispatch, useSelector } from "react-redux";
import { setFileWordCounts } from "@/store/reducers/fileSliceUpdate";
import { useRouter } from "next/navigation";
import { FaArrowLeftLong } from "react-icons/fa6";
import { getApiConfig, getApiHeaders } from "../../../utility/api-config";
import { ContainedButton } from "@/Components/buttons/ContainedButton";
import { OutlinedButton } from "@/Components/buttons/OutlinedButton";
import { showSuccessToast } from "@/Components/toast/success-toast";
import { CookieManager } from "@/utility/cookie-manager";

// Utility function to validate URL
function isValidURL(url) {
  try {
    new URL(url);
    return true;
  } catch (error) {
    return false;
  }
}

const Source = () => {
  const { theme } = useTheme();
  const router = useRouter();
  const dispatch = useDispatch();
  const [pastedUrl, setPastedUrl] = useState([]);
  const [inputUrl, setInputUrl] = useState("");
  const [err, setErr] = useState("");
  const [rawWordCounts, setRawWordCounts] = useState(0);
  const [rawText, setRawText] = useState("");
   const [rawCharCount, setRawCharCount] = useState(0);
  const [selectedSection, setSelectedSection] = useState(0);
  const [fileWordCounts, setFileWordCounts] = useState({});
  const [urlWordCounts, setUrlWordCounts] = useState({});
  const file = useSelector((state) => state.fileUpdate.file);
  const urlFetch = process.env.url;
  const totalWordCount =
    Object.values(fileWordCounts).reduce((acc, count) => acc + count.wordCount, 0) + pastedUrl.reduce((total, item) => total + item.word_count, 0)+
    rawWordCounts;
  const [existingFile, setExistingFile] = useState({});
  const { selectedChatAgent } = useSelector((state) => state.selectedData);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    console.log("rawwordscounts", rawWordCounts);
    console.log("filwordscouns", fileWordCounts);
    console.log("selectedAgent", selectedChatAgent);
    console.log("totalwordscounts", totalWordCount);
    
    if (selectedChatAgent?.url_word_count) {
      const urlCount = Object.values(selectedChatAgent.url_word_count).reduce((total, count) => total + count, 0);
      setUrlWordCounts(urlCount);
    } else {
      setUrlWordCounts(pastedUrl.reduce((total, item) => total + (item.url_word_count || 0), 0));
    }
  }, [pastedUrl, selectedChatAgent, rawWordCounts, fileWordCounts, totalWordCount]);

    useEffect(() => {
      setRawCharCount(rawText.replace(/\s+/g, "").length);
    }, [inputUrl, rawText]);

  // Retrieve chat agent from local storage
  useEffect(() => {
    setPastedUrl(selectedChatAgent?.urls || []);
    setRawText(selectedChatAgent?.raw_text || "");
    setRawWordCounts(selectedChatAgent?.raw_text_word_count || 0);
    
    // Set initial url word count from selectedChatAgent
    if (selectedChatAgent?.url_word_count) {
      const urlCount = Object.values(selectedChatAgent.url_word_count).reduce((total, count) => total + count, 0);
      setUrlWordCounts(urlCount);
    }

    setRawCharCount(selectedChatAgent?.raw_text?.replace(/\s+/g, "").length || 0);
    setFileWordCounts(selectedChatAgent?.file_word_count || {});
    setExistingFile(selectedChatAgent?.file_word_count || {});
  }, [selectedChatAgent]);

  useEffect(() => {
    console.log('raw char cout', rawCharCount)
  }, [rawText])

  useEffect(() => {
    const changes = DetectChanges(pastedUrl);
    setHasChanges(changes > 0);
  }, [pastedUrl, existingFile, rawText]);

  const DetectChanges = (urls) => {
    let change = 0;
    
    // Compare URLs
    const currentUrls = urls.map(url => url.url || url);
    const originalUrls = selectedChatAgent?.urls || [];
    if (JSON.stringify(currentUrls) !== JSON.stringify(originalUrls)) {
      change += 1;
    }

    // Compare files - only check if files were added or removed
    const currentFiles = Object.keys(existingFile);
    const originalFiles = Object.keys(selectedChatAgent?.file_word_count || {});
    
    // Simple check if files changed
    if (JSON.stringify(currentFiles) !== JSON.stringify(originalFiles)) {
      change += 1;
    }

    // Compare raw text
    if (rawText !== (selectedChatAgent?.raw_text || "")) {
      change += 1;
    }

    return change;
  };

  const fetchWordData = async (url) => {
    try {
      const response = await fetch("https://api.zoft.ai/url/extract/word", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          euid: 845121,
          url: url,
        }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log("data fetched", data);
      return data;
    } catch (error) {
      console.log(error);
    }
  };

  const handleUpdate = async () => {
    const formData = new FormData();
    const dict = {};
    var urls = "";
    var existingFiles = "";
    pastedUrl.forEach((url1, index) => {
      urls += url1 + ",";
      dict[url1] = 0;
    });
    Object.keys(existingFile).forEach((name, index) => {
      existingFiles += name + ",";
    });
    existingFiles = existingFiles.substring(0, existingFiles.length - 1);
    urls = urls.substring(0, urls.length - 1);
    file?.forEach((file, index) => {
      formData.append("files", file);
    });
    const changes = DetectChanges(urls, existingFiles);
    if (changes == 0) {
      setErr("No Changes Is Done");
      return;
    }
    setErr("");
    formData.append("chat_agent_id", selectedChatAgent?.id);
    formData.append("URLs", urls);
    formData.append("raw_text", rawText);
    formData.append("existing_files", existingFiles);
    formData.append("url_word_count", JSON.stringify(dict));
    formData.append("file_word_count", JSON.stringify(fileWordCounts.wordCount));
    formData.append("raw_text_word_count", rawWordCounts);
    const response = await fetch(`${urlFetch}/public/chat_agent/update_base`, {
      ...getApiConfig(),
      method: "POST",
      headers: new Headers({
        ...getApiHeaders(),
      }),
      body: formData,
    });
    const chatId = await response.text();
    const formDataUpdate = new FormData();
    formDataUpdate.append("chat_agent_id", chatId);
    const res = await fetch(`${urlFetch}/public/chat_agent/get_agent/by_id`, {
      ...getApiConfig(),
      method: "POST",
      headers: new Headers({
        ...getApiHeaders(),
      }),
      body: formData,
    });
    const data = await res.json();
    localStorage.setItem("current_agent", JSON.stringify(data[0] || []));

    showSuccessToast(
      "Training is in progress. please come back later to see the results."
    );
  };

  const urlHandler = (e) => {
    setInputUrl(e.target.value);
  };

  const autoResizeTextarea = (textarea) => {
    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight}px`;
  };

  const rawTextHandler = (e) => {
    const text = e.target.value;
    setRawText(text);
    setRawWordCounts(text.split(/[\s,]+/).filter(Boolean).length); // Update word count
    if (e.target.tagName === "TEXTAREA") {
      autoResizeTextarea(e.target);
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
  };

  const keypressHandler = async (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (!inputUrl || inputUrl.trim() === "") {
        setErr("Error: URL is empty");
      } else if (!isValidURL(inputUrl)) {
        setErr("Error: Invalid URL format");
      } else if (pastedUrl.length < 3) {
        const updatedUrl = await fetchWordData(inputUrl);
        console.log("updated url:", updatedUrl);
        updatedUrl.url = inputUrl;
        const updatedUrls = [...pastedUrl, updatedUrl];
        console.log(updatedUrl);

        setPastedUrl(updatedUrls);
        setInputUrl("");
        setErr("");
      } else {
        setErr("You can only add up to 3 URLs!");
      }
    }
  };

  const removeUrl = (index) => {
    console.log("Delete button clicked for index: ", index); // Test log
    const updatedUrl = pastedUrl.filter((_, i) => i !== index);
    setPastedUrl(updatedUrl);
  };

  const charCount = rawCharCount+ pastedUrl.reduce((total, item) => total + item.char_count, 0) + Object.values(fileWordCounts ?? {}).reduce((acc, count) => acc + count.characterCount, 0);

  const links = [{ label: "file" }, { label: "URLs" }, { label: "Raw Text" }];

  const handleSectionClick = (section) => {
    setSelectedSection(section);
  };

  console.log('pasted url', pastedUrl)

  return (
    <div
      className={`flex flex-col justify-start items-center px-8  w-full h-[100vh] overflow-hidden`}
    >
      <div
        className={`border-b-[.1vw] flex justify-center relative w-full mt-[2vw] pt-[.6vw] text-base border-zinc-300 ${
          theme === "dark" ? "text-[#9f9f9f]" : " text-black"
        }`}
      >
        <div className="absolute left-[2vw] top-[-.6vw]">
          <OutlinedButton
            onClick={() =>
              router.push(
                `/workspace/agents?workspaceId=${selectedChatAgent?.workspace_id}`
              )
            }
               borderColor={
              "border-2 border-[#8b8b8b] text-[#8b8b8b] hover:border-[#333333] hover:text-[#333333]"
            }
                    >
                      <FaArrowLeftLong className="text-sm"/>
                      <span className="text-sm">Back to workspace</span>
          </OutlinedButton>
        </div>
        <ChatSettingNav />
      </div>

      <div className="flex items-start justify-start py-8 gap-8 pl-12 pr-12 w-[80%] h-[85%] max-h-[85%]">
        <div className={`flex flex-col justify-start min-h-full max-h-full w-[80%] overflow-hidden py-8 px-4 rounded-xl shadow-lg ${
          theme === "dark" ? "bg-[#1A1C22] text-white" : "bg-white text-black"
        }`}>
          <h1 className="px-10 text-xl font-semibold pb-4 text-[#2D3377]/90">
            Data Source
          </h1>
          <form className="flex flex-col gap-6 px-10 h-full overflow-hidden" onSubmit={handleFormSubmit}>
            <div className="flex justify-between gap-12 h-full overflow-hidden">
              <div className="flex flex-col w-[25%] text-base">
                {links.map((link, index) => (
                  <React.Fragment key={index}>
                    {index > 0 && (
                      <div className="bg-zinc-200 min-w-full min-h-[1px]" />
                    )}
                    <button
                      onClick={() => handleSectionClick(index)}
                      className={`${
                        index === selectedSection
                          ? "bg-[#2D3377]/10 text-[#2D3377] font-medium"
                          : "text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800"
                      } px-6 py-2.5 my-0.5 rounded-lg transition-all duration-200 w-full text-left text-base`}
                    >
                      {link.label}
                    </button>
                  </React.Fragment>
                ))}
              </div>

              {selectedSection === 0 ? (
                <div className="w-[70%]">
                  <AddFile
                    existingFile={existingFile}
                    setExistingFile={setExistingFile}
                    setFileWordCounts={setFileWordCounts}
                    fileWordCounts={fileWordCounts}
                  />
                </div>
              ) : selectedSection === 1 ? (
                <div className="w-[80%] flex flex-col items-center justify-start">
                  <input
                    onChange={urlHandler}
                    onKeyDown={keypressHandler}
                    value={inputUrl}
                    type="url"
                    id="url"
                    className={`text-base border w-full border-zinc-300 px-4 py-3 rounded-lg focus:ring-2 focus:ring-[#2D3377]/20 focus:border-[#2D3377] outline-none transition-all duration-200 ${
                      theme === "dark"
                        ? "bg-[#1F222A] text-white"
                        : "bg-white text-black"
                    }`}
                    placeholder="Enter URLs"
                  />
                  <div className="flex flex-col gap-3 text-base mt-6 w-full">
                    {pastedUrl.length > 0 &&
                      pastedUrl.map((urlObj, index) => (
                       <div
                          key={index}
                          className="h-14 w-full border border-zinc-300 px-4 py-2 text-sm rounded-lg flex justify-between items-center bg-white dark:bg-[#1F222A] shadow-sm hover:shadow-md transition-all duration-200"
                        >
                          <span className="text-gray-800 dark:text-gray-200">
                            {urlObj?.length < 45 ? (
                              <span>{urlObj?.url}</span>
                            ) : (
                              <div className="relative">
                                <div className="group">
                                  <span className="absolute bg-gray-800 text-white top-[-45px] w-full left-0 rounded-lg px-3 py-2 text-xs shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                                    {urlObj?.url}
                                  </span>
                                  <span className="cursor-pointer group-hover:text-[#2D3377] transition-colors duration-200">
                                    {urlObj?.url?.slice(0, 40)}.....
                                  </span>
                                </div>
                              </div>
                            )}
                          </span>
                          <span className="text-gray-600 dark:text-gray-400 font-medium">
                            {selectedChatAgent?.url_word_count?.[urlObj] || urlObj?.word_count} words
                          </span>
                          <button 
                            onClick={() => removeUrl(index)} 
                            className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors duration-200"
                          >
                            <DeleteIcon />
                          </button>
                        </div>
                      ))}
                  </div>
                </div>
              ) : (
                <div className="w-[80%]">
                  <div className="mb-4 text-base">
                    <p className="text-gray-600 dark:text-gray-400">Words count: <span className="font-medium text-[#2D3377]">{rawWordCounts}</span></p>
                  </div>
                  <textarea
                    onChange={rawTextHandler}
                    value={rawText}
                    id="rawText"
                    className={`w-full text-base border p-4 border-zinc-300 rounded-lg focus:ring-2 focus:ring-[#2D3377]/20 focus:border-[#2D3377] outline-none max-h-[70%] overflow-y-scroll transition-all duration-200 ${
                      theme === "dark"
                        ? "bg-[#1F222A] text-white"
                        : "bg-white text-black"
                    }`}
                    placeholder="Enter raw text"
                    style={{ height: "auto", minHeight: "15vh" }}
                  ></textarea>
                </div>
              )}
            </div>
          </form>
        </div>
        <div className={`flex flex-col gap-6 justify-center items-center w-[20%] py-16 px-4 rounded-xl shadow-lg ${
          theme === "dark" ? "bg-[#1A1C22] text-white" : "bg-white text-black"
        }`}>
          <h5 className="font-semibold text-lg text-[#2D3377]">Sources</h5>
          <div className="w-full space-y-6">
            <div className="text-center">
              <h6 className="font-semibold text-base text-gray-600 dark:text-gray-400">Total words detected</h6>
              <p className="text-sm mt-2">
                <span className="font-bold text-[#2D3377]">{totalWordCount}</span>
                <span className="text-gray-500"> /10,000 limit</span>
              </p>
            </div>
            <div className="text-center">
              <h6 className="font-semibold text-base text-gray-600 dark:text-gray-400">Approx character</h6>
              <p className="text-sm mt-2 font-medium text-[#2D3377]">{charCount}</p>
            </div>
          </div>
          {err && (
            <span className="text-red-500 text-sm font-medium">{err}</span>
          )}
          <div className={`${!hasChanges ? 'cursor-not-allowed' : ''}`}>
            <ContainedButton 
              onClick={handleUpdate}
              disabled={!hasChanges}
              className={`w-full mt-4 font-medium py-3 px-6 rounded-lg transition-all duration-200 ${
                hasChanges 
                  ? "bg-[#2D3377] hover:bg-[#211A55] text-white cursor-pointer" 
                  : "bg-gray-200 text-gray-400 cursor-not-allowed opacity-50 pointer-events-none"
              }`}
            >
              Retrain Chatbot
            </ContainedButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Source;
