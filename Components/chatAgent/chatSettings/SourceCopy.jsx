import { ContainedButton } from "@/Components/buttons/ContainedButton";
import {
  setFileCount,
  setrawText,
  seturl,
} from "@/store/reducers/dataSourceSlice";
import useTheme from "next-theme";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import DeleteIcon from "../../Icons/DeleteIcon";
import AddFile from "../AddFile";

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
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const { url, rawText } = useSelector((state) => state.data);
  const [pastedUrl, setPastedUrl] = useState([]);
  const [inputUrl, setInputUrl] = useState("");
  const [err, setErr] = useState("");
  const urlFetch = process.env.url;
  const [fileWordCounts, setFileWordCounts] = useState({});
  const [rawWordCounts, setRawWordCounts] = useState(0);
  const [rawCharCount, setRawCharCount] = useState(0);
  const [RawText, setRawText] = useState("");
  // const [jsonData, setJsonData] = useState({euid:"",url:""});
  // Initialize local state with values from Redux store
  useEffect(() => {
    const words = rawText ? rawText.trim().split(/\s+/) : 0;
    setRawWordCounts(words.length > 0 ? words.length : 0);

    setRawCharCount(rawText.replace(/\s+/g, "").length);
    setPastedUrl(url || []); // Default to an empty array if url is undefined
    setRawText(rawText || ""); // Default to an empty string if rawText is undefined
  }, [url, rawText]);

  useEffect(() => {
    console.log("pasted url", pastedUrl);
  }, [pastedUrl]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    dispatch(setFileCount(fileWordCounts));
    console.log("file word count", fileWordCounts);
  }, [fileWordCounts]);

  const urlHandler = (e) => {
    setInputUrl(e.target.value);
  };

  const autoResizeTextarea = (textarea) => {
    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight}px`;
  };
  const fetchWordData = async (url) => {
    try {
      const response = await fetch(`${urlFetch}/url/extract/word`, {
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

  const rawTextHandler = (e) => {
    const text = e.target.value;
    setRawText(text);
    dispatch(setrawText(text)); // Update Redux store on change
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
      } else if (pastedUrl.includes(inputUrl)) {
        setErr("Error: URL Duplicate");
      } else if (pastedUrl.length < 3) {
        try {
          const updatedUrl = await fetchWordData(inputUrl);
          console.log("updated url:", updatedUrl);
          updatedUrl.url = inputUrl;
          const updatedUrls = [...pastedUrl, updatedUrl];
          console.log("updated url" + updatedUrl);

          setPastedUrl(updatedUrls);
          dispatch(seturl(updatedUrls)); // Update Redux store with new URL list
        } catch (error) {
          alert(error);
        }

        setInputUrl("");
        setErr("");
      } else {
        setErr("You can only add up to 3 URLs!");
      }
    }
  };

  const removeUrl = (index) => {
    const updatedUrl = pastedUrl.filter((_, i) => i !== index);
    setPastedUrl(updatedUrl);
    dispatch(seturl(updatedUrl)); // Update Redux store after removing URL
  };

  const totalWordCount =
    Object.values(fileWordCounts).reduce(
      (acc, count) => acc + count.wordCount,
      0
    ) +
    pastedUrl.reduce((total, item) => total + item.word_count, 0) +
    rawWordCounts;

  const charCount =
    rawCharCount +
    pastedUrl.reduce((total, item) => total + item.char_count, 0) +
    Object.values(fileWordCounts).reduce(
      (acc, count) => acc + count.characterCount,
      0
    );
  const links = [{ label: "Files" }, { label: "URLs" }, { label: "Raw Text" }];

  const [selectedSection, setSelectedSection] = useState(0);

  const handleSectionClick = (section) => {
    setSelectedSection(section);
  };

  console.log("pasted url", pastedUrl);

  return (
    <div
      className={`flex flex-col justify-start items-start w-full h-[100%] max-h-[100%]`}
    >
      <div className="flex items-start justify-start py-8 gap-8 pl-12 pr-12 w-full h-full">
        <div
          className={`flex flex-col justify-start min-h-full max-h-full  w-[80%] overflow-hidden py-8 px-4 rounded-xl shadow-lg ${
            theme === "dark" ? "bg-[#1A1C22] text-white" : "bg-white text-black"
          }`}
        >
          <h1 className="px-10 text-xl font-semibold pb-4 text-[#2D3377]/90">
            Data Source
          </h1>
          <form
            className="flex flex-col gap-6 px-10 h-full overflow-hidden"
            onSubmit={handleFormSubmit}
          >
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
                            {urlObj?.url?.length < 45 ? (
                              <span>{urlObj.url}</span>
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
                            {urlObj?.word_count} words
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
                    <p className="text-gray-600 dark:text-gray-400">
                      Words count:{" "}
                      <span className="font-medium text-[#2D3377]">
                        {rawText.split(" ").length - 1}
                      </span>
                    </p>
                  </div>
                  <textarea
                    onChange={rawTextHandler}
                    value={RawText}
                    id="rawText"
                    className={`w-full text-base border p-4 border-zinc-300 rounded-lg focus:ring-2 focus:ring-[#2D3377]/20 focus:border-[#2D3377] outline-none max-h-[80%] overflow-y-scroll transition-all duration-200 ${
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

        <div
          className={`flex flex-col gap-6 justify-center items-center w-[20%] py-16 px-4 rounded-xl shadow-lg ${
            theme === "dark" ? "bg-[#1A1C22] text-white" : "bg-white text-black"
          }`}
        >
          <h5 className="font-semibold text-lg text-[#2D3377]">Sources</h5>
          <div className="w-full space-y-6">
            <div className="text-center">
              <h6 className="font-semibold text-base text-gray-600 dark:text-gray-400">
                Total words detected
              </h6>
              <p className="text-sm mt-2">
                <span className="font-bold text-[#2D3377]">
                  {totalWordCount}
                </span>
                <span className="text-gray-500"> /10,000 limit</span>
              </p>
            </div>
            <div className="text-center">
              <h6 className="font-semibold text-base text-gray-600 dark:text-gray-400">
                Approx character
              </h6>
              <p className="text-sm mt-2 font-medium text-[#2D3377]">
                {charCount}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Source;
