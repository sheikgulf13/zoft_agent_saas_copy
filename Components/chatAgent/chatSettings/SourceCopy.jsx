import React, { useEffect, useState } from "react";
import DeleteIcon from "../../Icons/DeleteIcon";
import useTheme from "next-theme";
import AddFile from "../AddFile";
import { useDispatch, useSelector } from "react-redux";
import {
  setrawText,
  seturl,
  setFileCount,
} from "@/store/reducers/dataSourceSlice";
import { ContainedButton } from "@/Components/buttons/ContainedButton";

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
    console.log('pasted url', pastedUrl)
  }, [pastedUrl])

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    dispatch(setFileCount(fileWordCounts));
    console.log('file word count', fileWordCounts)
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
      console.log('data fetched', data)
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
      } else if (pastedUrl.length < 3) {
        try {
          const updatedUrl = await fetchWordData(inputUrl);
          console.log('updated url:', updatedUrl)
          updatedUrl.url = inputUrl;
          const updatedUrls = [...pastedUrl, updatedUrl];
          console.log(updatedUrl);

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
    Object.values(fileWordCounts).reduce((acc, count) => acc + count.wordCount, 0) + pastedUrl.reduce((total, item) => total + item.word_count, 0)+
    rawWordCounts;

  const charCount = rawCharCount+ pastedUrl.reduce((total, item) => total + item.char_count, 0) + Object.values(fileWordCounts).reduce((acc, count) => acc + count.characterCount, 0);
  const links = [{ label: "Files" }, { label: "URLs" }, { label: "Raw Text" }];

  const [selectedSection, setSelectedSection] = useState(0);

  const handleSectionClick = (section) => {
    setSelectedSection(section);
  };

  return (
    <div className={`flex flex-col justify-start items-start w-full h-[80%]`}>
      <div
        className={`flex items-start justify-center gap-[2vw] w-full h-full`}
      >
        <div
          className={`flex flex-col justify-start min-h-full w-[80%] py-[4vh] px-[1vw] rounded-[.5vw] ${
            theme === "dark" ? "bg-[#1A1C22] text-white" : "bg-white text-black"
          }`}
        >
          <h1 className="px-[2.5vw] text-lg font-semibold pb-[1vh]">
            Data Source
          </h1>
          <form
            className="flex flex-col gap-[1vw] px-[4vw]"
            onSubmit={handleFormSubmit}
          >
            <div className="flex justify-between items-start">
              <div className={`flex flex-col w-[15%] text-base`}>
                {links.map((link, index) => (
                  <React.Fragment key={index}>
                    {index > 0 && (
                      <div className={`bg-zinc-200 min-w-full min-h-[.1vw]`} />
                    )}
                    <button
                      onClick={() => handleSectionClick(index)}
                      className={`${
                        index === selectedSection
                          ? "bg-zinc-300 text-black"
                          : ""
                      } px-[.5vw] py-[.5vh] my-[.4vw] rounded-[0.25vw]`}
                    >
                      {link.label}
                    </button>
                  </React.Fragment>
                ))}
              </div>

              {selectedSection === 0 ? (
                <div className="w-[80%]">
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
                    className={`text-base border-[0.052vw] w-full border-zinc-300 px-[1.3vw] py-[.5vh] rounded-[.4vw] ${
                      theme === "dark"
                        ? "bg-[#1F222A] text-white"
                        : "bg-white text-black"
                    }`}
                    placeholder="Enter URLs"
                  />
                  <div className="flex flex-col gap-[.5vw] text-base mt-[2vh] w-[100%]">
                    {pastedUrl.length > 0 &&
                      pastedUrl.map((urlObj, index) => (
                        <div
                          key={index}
                          className="h-[4vh] w-full border-[1px] border-zinc-300 px-[1vw] py-[.5vh] text-sm rounded-[.4vw] flex justify-between items-center"
                        >
                          <span className="text-black">
                            {urlObj?.url?.length < 45 ? (
                              <span> {urlObj.url} </span>
                            ) : (
                              <div className="relative">
                                <div className="group">
                                  {/* Tooltip */}
                                  <span className="absolute bg-gray-500 text-white top-[-45px] w-full left-0 rounded-lg px-2 py-1 text-xs shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    {urlObj?.url}
                                  </span>

                                  {/* Truncated URL */}
                                  <span className="cursor-pointer group-hover:underline">
                                    {urlObj?.url?.slice(0, 40)}.....
                                  </span>
                                </div>
                              </div>
                            )}
                          </span>
                          <span>{urlObj?.word_count} words</span>
                          <button onClick={() => removeUrl(index)} className="">
                            <DeleteIcon />
                          </button>
                        </div>
                      ))}
                  </div>
                </div>
              ) : (
                <div className="w-[80%]">
                  <span className="text-base font-semibold">
                    Words count: {rawText.split(" ").length - 1}
                  </span>
                  <textarea
                    onChange={rawTextHandler}
                    value={RawText}
                    id="rawText"
                    className={`text-base border-[0.052vw] w-[32vw] border-zinc-300 px-[1.3vw] pb-[1.8vh] pt-[1.8vh] rounded-[.5vw] overflow-hidden ${
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
          className={`flex flex-col gap-[1vw] justify-center items-center w-[25%] py-[4vh] px-[1vw] rounded-[.5vw] ${
            theme === "dark" ? "bg-[#1A1C22] text-white" : "bg-white text-black"
          }`}
        >
          <h5 className={`font-semibold text-base`}>Sources</h5>
          <h6 className={`font-semibold text-base pt-[.7vw]`}>
            Total words detected
          </h6>
          <p className={`text-sm pb-[.7vw]`}>
            <span className={`font-semibold`}>{totalWordCount}</span> /10,000
            limit
          </p>
          <h6 className={`font-semibold text-base pt-[.7vw]`}>
            Approx character
          </h6>
          <p className={`text-sm pb-[.7vw]`}>{charCount}</p>
          {/* // <ContainedButton>Update</ContainedButton> */}
        </div>
      </div>
    </div>
  );
};

export default Source;
