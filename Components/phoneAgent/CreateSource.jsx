import React, { useEffect, useState, useCallback, useMemo, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { debounce } from "lodash";
import PropTypes from "prop-types";
import useTheme from "next-theme";

// Components
import DeleteIcon from "../Icons/DeleteIcon";
import AddFile from "../../Components/chatAgent/AddFile";
import { ContainedButton } from "@/Components/buttons/ContainedButton";

// Redux actions
import {
  setrawText,
  seturl,
  setFileCount,
} from "@/store/reducers/dataSourceSlice";

// Constants
const CONSTANTS = {
  MAX_URL_COUNT: 3,
  WORD_LIMIT: 10000,
  URL_DISPLAY_LIMIT: 45,
  TRUNCATE_LIMIT: 40,
  DEBOUNCE_DELAY: 300,
  API_TIMEOUT: 10000,
  RESIZE_DELAY: 0,
  SECTIONS: [
    { id: 0, label: "Files", key: "files" },
    { id: 1, label: "URLs", key: "urls" },
    { id: 2, label: "Raw Text", key: "rawText" }
  ]
};

const ERROR_MESSAGES = {
  EMPTY_URL: "URL cannot be empty",
  INVALID_URL: "Please enter a valid URL format",
  MAX_URLS_EXCEEDED: `You can only add up to ${CONSTANTS.MAX_URL_COUNT} URLs`,
  FETCH_ERROR: "Failed to process URL. Please try again.",
  NETWORK_ERROR: "Network error occurred. Please check your connection."
};

// Utility functions
const utils = {
  isValidURL: (url) => {
    if (!url || typeof url !== 'string') return false;
    
    const trimmedUrl = url.trim();
    
    // Check if URL starts with http:// or https://
    if (!trimmedUrl.match(/^https?:\/\//i)) {
      return false;
    }
    
    try {
      const urlObj = new URL(trimmedUrl);
      
      // Allow http and https protocols only
      if (!['http:', 'https:'].includes(urlObj.protocol)) {
        return false;
      }
      
      // Check if hostname exists and is valid
      if (!urlObj.hostname || urlObj.hostname.length === 0) {
        return false;
      }
      
      // Additional validation for hostname format
      const hostnameRegex = /^[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
      if (!hostnameRegex.test(urlObj.hostname)) {
        return false;
      }
      
      return true;
    } catch (error) {
      // If URL constructor fails, try a more lenient regex approach
      const urlRegex = /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&=]*)$/;
      return urlRegex.test(trimmedUrl);
    }
  },

  calculateWordCount: (text) => {
    if (!text || typeof text !== 'string') return 0;
    const words = text.trim().split(/\s+/).filter(word => word.length > 0);
    return words.length;
  },

  calculateCharCount: (text) => {
    if (!text || typeof text !== 'string') return 0;
    return text.replace(/\s+/g, "").length;
  },

  truncateUrl: (url, limit = CONSTANTS.TRUNCATE_LIMIT) => {
    if (!url || url.length <= limit) return url;
    return `${url.slice(0, limit)}...`;
  },

  sanitizeInput: (input) => {
    return input?.trim() || '';
  }
};

// Custom hooks
const useAutoResize = () => {
  const autoResizeTextarea = useCallback((textarea) => {
    if (!textarea) return;
    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight}px`;
  }, []);

  return { autoResizeTextarea };
};

const useApiService = () => {
  const [isLoading, setIsLoading] = useState(false);
  
  const fetchWordData = useCallback(async (url) => {
    if (!url) throw new Error(ERROR_MESSAGES.EMPTY_URL);
    
    setIsLoading(true);
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), CONSTANTS.API_TIMEOUT);

    try {
      const response = await fetch("https://api.zoft.ai/url/extract/word", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          euid: 845121, // Consider moving to environment variables
          url: url,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      // Validate response structure
      if (!data || typeof data !== 'object') {
        throw new Error('Invalid response format');
      }

      return {
        ...data,
        url,
        word_count: data.word_count || 0,
        char_count: data.char_count || 0,
      };
    } catch (error) {
      clearTimeout(timeoutId);
      
      if (error.name === 'AbortError') {
        throw new Error('Request timeout. Please try again.');
      }
      
      console.error('API Error:', error);
      throw new Error(ERROR_MESSAGES.FETCH_ERROR);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { fetchWordData, isLoading };
};

// Main component
const CreateSource = ({ className = "", onDataChange = null }) => {
  const { theme } = useTheme();
  const dispatch = useDispatch();
  const { url: reduxUrls, rawText: reduxRawText } = useSelector((state) => state.data);
  
  // State management
  const [state, setState] = useState({
    selectedSection: 0,
    inputUrl: "",
    rawText: "",
    error: "",
    isInitialized: false,
  });

  const [urlList, setUrlList] = useState([]);
  const [fileWordCounts, setFileWordCounts] = useState({});
  
  // Refs
  const textareaRef = useRef(null);
  const inputRef = useRef(null);
  
  // Custom hooks
  const { autoResizeTextarea } = useAutoResize();
  const { fetchWordData, isLoading } = useApiService();

  // Memoized calculations
  const statistics = useMemo(() => {
    const rawWordCount = utils.calculateWordCount(state.rawText);
    const rawCharCount = utils.calculateCharCount(state.rawText);
    
    const urlWordCount = urlList.reduce((total, item) => 
      total + (item.word_count || 0), 0
    );
    const urlCharCount = urlList.reduce((total, item) => 
      total + (item.char_count || 0), 0
    );
    
    const fileWordCount = Object.values(fileWordCounts).reduce((acc, count) => 
      acc + (count.wordCount || 0), 0
    );
    const fileCharCount = Object.values(fileWordCounts).reduce((acc, count) => 
      acc + (count.characterCount || 0), 0
    );

    return {
      totalWords: rawWordCount + urlWordCount + fileWordCount,
      totalChars: rawCharCount + urlCharCount + fileCharCount,
      rawWordCount,
      rawCharCount,
    };
  }, [state.rawText, urlList, fileWordCounts]);

  // Debounced handlers
  const debouncedRawTextChange = useMemo(
    () => debounce((text) => {
      dispatch(setrawText(text));
      onDataChange?.({ type: 'rawText', value: text });
    }, CONSTANTS.DEBOUNCE_DELAY),
    [dispatch, onDataChange]
  );

  // Initialize component
  useEffect(() => {
    if (state.isInitialized) return;

    setState(prev => ({
      ...prev,
      rawText: reduxRawText || "",
      isInitialized: true,
    }));
    
    setUrlList(reduxUrls || []);
  }, [reduxUrls, reduxRawText, state.isInitialized]);

  // Update Redux when fileWordCounts changes
  useEffect(() => {
    dispatch(setFileCount(fileWordCounts));
  }, [fileWordCounts, dispatch]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current && state.selectedSection === 2) {
      autoResizeTextarea(textareaRef.current);
    }
  }, [state.rawText, state.selectedSection, autoResizeTextarea]);

  // Cleanup debounced function
  useEffect(() => {
    return () => {
      debouncedRawTextChange.cancel();
    };
  }, [debouncedRawTextChange]);

  // Event handlers
  const handleSectionChange = useCallback((sectionId) => {
    setState(prev => ({ 
      ...prev, 
      selectedSection: sectionId,
      error: "" // Clear error when switching sections
    }));
  }, []);

  const handleInputChange = useCallback((field, value) => {
    setState(prev => ({
      ...prev,
      [field]: utils.sanitizeInput(value),
      error: prev.error && field === 'inputUrl' ? "" : prev.error,
    }));
  }, []);

  const validateUrl = useCallback((url) => {
    const trimmedUrl = url.trim();
    
    if (!trimmedUrl) return ERROR_MESSAGES.EMPTY_URL;
    
    // More lenient URL validation
    if (!utils.isValidURL(trimmedUrl)) return ERROR_MESSAGES.INVALID_URL;
    
    if (urlList.length >= CONSTANTS.MAX_URL_COUNT) return ERROR_MESSAGES.MAX_URLS_EXCEEDED;
    
    // Check for duplicate URLs (normalize by removing trailing slashes and converting to lowercase)
    const normalizedUrl = trimmedUrl.toLowerCase().replace(/\/+$/, '');
    const isDuplicate = urlList.some(item => {
      const existingNormalized = item.url.toLowerCase().replace(/\/+$/, '');
      return existingNormalized === normalizedUrl;
    });
    
    if (isDuplicate) return "This URL has already been added";
    
    return null;
  }, [urlList]);

  const handleUrlSubmit = useCallback(async () => {
    const url = state.inputUrl.trim();
    const validationError = validateUrl(url);
    
    if (validationError) {
      setState(prev => ({ ...prev, error: validationError }));
      return;
    }

    try {
      const urlData = await fetchWordData(url);
      const updatedUrls = [...urlList, urlData];
      
      setUrlList(updatedUrls);
      dispatch(seturl(updatedUrls));
      
      setState(prev => ({
        ...prev,
        inputUrl: "",
        error: "",
      }));
      
      onDataChange?.({ type: 'urls', value: updatedUrls });
      
      // Focus back to input
      inputRef.current?.focus();
      
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        error: error.message || ERROR_MESSAGES.FETCH_ERROR 
      }));
    }
  }, [state.inputUrl, validateUrl, fetchWordData, urlList, dispatch, onDataChange]);

  const handleKeyPress = useCallback((e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleUrlSubmit();
    }
  }, [handleUrlSubmit]);

  const handleUrlRemove = useCallback((index) => {
    const updatedUrls = urlList.filter((_, i) => i !== index);
    setUrlList(updatedUrls);
    dispatch(seturl(updatedUrls));
    onDataChange?.({ type: 'urls', value: updatedUrls });
  }, [urlList, dispatch, onDataChange]);

  const handleRawTextChange = useCallback((e) => {
    const text = e.target.value;
    setState(prev => ({ ...prev, rawText: text }));
    debouncedRawTextChange(text);
    
    if (e.target.tagName === "TEXTAREA") {
      autoResizeTextarea(e.target);
    }
  }, [debouncedRawTextChange, autoResizeTextarea]);

  const handleFormSubmit = useCallback((e) => {
    e.preventDefault();
  }, []);

  // Theme classes
  const themeClasses = {
    container: theme === "dark" ? "bg-[#1A1C22] text-white" : "bg-white text-black",
    input: theme === "dark" ? "bg-[#1F222A] text-white" : "bg-white text-black",
    urlItem: theme === "dark" ? "bg-[#1F222A]" : "bg-white",
  };

  // Render helpers
  const renderUrlList = () => (
    <div className="flex flex-col gap-3 text-base mt-6 min-w-full max-w-full">
      {urlList.map((urlObj, index) => (
        <div
          key={`${urlObj.url}-${index}`}
          className={`h-14 min-w-full max-w-full border border-zinc-300 px-4 py-2 text-sm rounded-lg flex justify-between items-center ${themeClasses.urlItem} shadow-sm hover:shadow-md transition-all duration-200`}
          role="listitem"
        >
          <span className="text-gray-800 dark:text-gray-200 flex-1 min-w-0">
            {urlObj?.url?.length > CONSTANTS.URL_DISPLAY_LIMIT ? (
              <div className="relative">
                <div className="group">
                  <span 
                    className="absolute bg-gray-800 text-white top-[-45px] w-max max-w-sm left-0 rounded-lg px-3 py-2 text-xs shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 break-all"
                    role="tooltip"
                  >
                    {urlObj?.url}
                  </span>
                  <span className="cursor-pointer group-hover:text-[#2D3377] transition-colors duration-200 truncate block">
                    {utils.truncateUrl(urlObj?.url)}
                  </span>
                </div>
              </div>
            ) : (
              <span className="truncate block">{urlObj.url}</span>
            )}
          </span>
          <span className="text-gray-600 dark:text-gray-400 font-medium whitespace-nowrap ml-2">
            {urlObj?.word_count || 0} words
          </span>
          <button 
            onClick={() => handleUrlRemove(index)}
            className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors duration-200 ml-2"
            aria-label={`Remove URL: ${urlObj.url}`}
            type="button"
          >
            <DeleteIcon />
          </button>
        </div>
      ))}
    </div>
  );

  const renderSectionContent = () => {
    switch (state.selectedSection) {
      case 0:
        return (
          <div className="w-full">
            <AddFile
              setFileWordCounts={setFileWordCounts}
              fileWordCounts={fileWordCounts}
            />
          </div>
        );
      
      case 1:
        return (
          <div className="min-w-full max-w-full flex flex-col items-center justify-start">
            <div className="min-w-full max-w-full">
              <input
                ref={inputRef}
                onChange={(e) => handleInputChange('inputUrl', e.target.value)}
                onKeyDown={handleKeyPress}
                value={state.inputUrl}
                type="url"
                id="url"
                disabled={isLoading}
                className={`text-base border w-full border-zinc-300 px-4 py-3 rounded-lg focus:ring-2 focus:ring-[#2D3377]/20 focus:border-[#2D3377] outline-none transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${themeClasses.input}`}
                placeholder="Enter URL and press Enter"
                aria-describedby="url-error"
              />
              {state.error && (
                <p id="url-error" className="text-red-500 text-sm mt-2" role="alert">
                  {state.error}
                </p>
              )}
              {isLoading && (
                <p className="text-blue-500 text-sm mt-2">
                  Processing URL...
                </p>
              )}
            </div>
            {urlList.length > 0 && (
              <div role="list" aria-label="Added URLs" className="min-w-full max-w-full">
                {renderUrlList()}
              </div>
            )}
          </div>
        );
      
      case 2:
        return (
          <div className="w-full">
            <div className="mb-4 text-base">
              <p className="text-gray-600 dark:text-gray-400">
                Words count: <span className="font-medium text-[#2D3377]">{statistics.rawWordCount}</span>
              </p>
            </div>
            <textarea
              ref={textareaRef}
              onChange={handleRawTextChange}
              value={state.rawText}
              id="rawText"
              className={`w-full text-base border p-4 border-zinc-300 rounded-lg focus:ring-2 focus:ring-[#2D3377]/20 focus:border-[#2D3377] outline-none max-h-[80%] overflow-y-auto transition-all duration-200 resize-none ${themeClasses.input}`}
              placeholder="Enter raw text"
              style={{ minHeight: "15vh" }}
              aria-describedby="rawtext-wordcount"
            />
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className={`flex flex-col justify-start items-center w-full h-full max-h-full ${className}`}>
      <div className={`flex items-start justify-start py-8 gap-8 pl-12 pr-12 ${className ? className : 'w-[80%] h-[85%] max-h-[85%]'} `}>
        {/* Main Content */}
        <div className={`flex flex-col justify-start min-h-full max-h-full w-[80%] overflow-hidden py-8 px-4 rounded-xl shadow-lg ${themeClasses.container}`}>
          <h1 className="px-10 text-xl font-semibold pb-4 text-[#2D3377]/90">
            Data Source
          </h1>
          
          <form className="flex flex-col gap-6 px-10 h-full overflow-hidden" onSubmit={handleFormSubmit}>
            <div className="flex justify-between gap-12 h-full overflow-hidden">
              {/* Navigation */}
              <nav className="flex flex-col w-[25%] text-base" role="tablist">
                {CONSTANTS.SECTIONS.map((section, index) => (
                  <React.Fragment key={section.id}>
                    {index > 0 && (
                      <div className="bg-zinc-200 min-w-full min-h-[1px]" />
                    )}
                    <button
                      type="button"
                      onClick={() => handleSectionChange(section.id)}
                      className={`${
                        section.id === state.selectedSection
                          ? "bg-[#2D3377]/10 text-[#2D3377] font-medium"
                          : "text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800"
                      } px-6 py-2.5 my-0.5 rounded-lg transition-all duration-200 w-full text-left text-base`}
                      role="tab"
                      aria-selected={section.id === state.selectedSection}
                      aria-controls={`section-${section.id}`}
                    >
                      {section.label}
                    </button>
                  </React.Fragment>
                ))}
              </nav>

              {/* Content */}
              <div 
                id={`section-${state.selectedSection}`}
                role="tabpanel"
                className={`flex-1 overflow-hidden min-w-[75%] max-w-[75%]`}
              >
                {renderSectionContent()}
              </div>
            </div>
          </form>
        </div>
        
        {/* Statistics Sidebar */}
        <aside className={`flex flex-col gap-6 justify-center items-center w-[20%] py-16 px-4 rounded-xl shadow-lg ${themeClasses.container}`}>
          <h2 className="font-semibold text-lg text-[#2D3377]">Sources</h2>
          <div className="w-full space-y-6">
            <div className="text-center">
              <h3 className="font-semibold text-base text-gray-600 dark:text-gray-400">
                Total words detected
              </h3>
              <p className="text-sm mt-2">
                <span className={`font-bold text-[#2D3377] ${statistics.totalWords > CONSTANTS.WORD_LIMIT ? 'text-red-500' : ''}`}>
                  {statistics.totalWords.toLocaleString()}
                </span>
                <span className="text-gray-500"> /{CONSTANTS.WORD_LIMIT.toLocaleString()} limit</span>
              </p>
              {statistics.totalWords > CONSTANTS.WORD_LIMIT && (
                <p className="text-red-500 text-xs mt-1">
                  Exceeds word limit
                </p>
              )}
            </div>
            <div className="text-center">
              <h3 className="font-semibold text-base text-gray-600 dark:text-gray-400">
                Approx characters
              </h3>
              <p className="text-sm mt-2 font-medium text-[#2D3377]">
                {statistics.totalChars.toLocaleString()}
              </p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

CreateSource.propTypes = {
  className: PropTypes.string,
  onDataChange: PropTypes.func,
};

export default React.memo(CreateSource);