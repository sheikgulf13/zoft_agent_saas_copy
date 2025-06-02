"use client";
import React, { 
  useEffect, 
  useState, 
  useCallback, 
  useMemo, 
  useRef,
  memo
} from "react";
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

// ============================================================================
// CONSTANTS AND CONFIGURATIONS
// ============================================================================

const CONSTANTS = {
  MAX_URLS: 3,
  MAX_WORDS: 10000,
  MIN_URL_LENGTH: 8,
  MAX_URL_DISPLAY_LENGTH: 45,
  TRUNCATE_LENGTH: 40,
  DEBOUNCE_DELAY: 300,
  API_TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
  CHAR_COUNT_CACHE_TTL: 5 * 60 * 1000, // 5 minutes
};

const SECTIONS = Object.freeze({
  FILES: 0,
  URLS: 1,
  RAW_TEXT: 2,
});

const SECTION_LABELS = Object.freeze([
  { id: SECTIONS.FILES, label: "Files", },
  { id: SECTIONS.URLS, label: "URLs", },
  { id: SECTIONS.RAW_TEXT, label: "Raw Text", },
]);

const ERROR_MESSAGES = Object.freeze({
  EMPTY_URL: "Error: URL is empty",
  INVALID_URL: "Error: Invalid URL format",
  MAX_URLS_EXCEEDED: `You can only add up to ${CONSTANTS.MAX_URLS} URLs!`,
  NO_CHANGES: "No changes detected",
  NETWORK_ERROR: "Network error occurred. Please try again.",
  FETCH_ERROR: "Failed to fetch URL data",
  UPDATE_ERROR: "Failed to update chat agent",
  VALIDATION_ERROR: "Please check your input and try again",
});

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Advanced URL validation with comprehensive checks
 * @param {string} url - URL to validate
 * @returns {boolean} - True if valid URL
 */
const validateURL = (url) => {
  if (!url || typeof url !== 'string') return false;
  
  try {
    const urlObj = new URL(url.trim());
    const validProtocols = ['http:', 'https:'];
    const isValidProtocol = validProtocols.includes(urlObj.protocol);
    const hasValidHost = urlObj.hostname && urlObj.hostname.length > 0;
    const isNotLocalhost = !['localhost', '127.0.0.1', '0.0.0.0'].includes(urlObj.hostname);
    
    return isValidProtocol && hasValidHost && url.length >= CONSTANTS.MIN_URL_LENGTH;
  } catch (error) {
    return false;
  }
};

/**
 * Sanitize and normalize URL
 * @param {string} url - URL to sanitize
 * @returns {string} - Sanitized URL
 */
const sanitizeURL = (url) => {
  if (!url) return '';
  let sanitized = url.trim();
  if (!/^https?:\/\//.test(sanitized)) {
    sanitized = `https://${sanitized}`;
  }
  return sanitized;
};

/**
 * Calculate word count with improved accuracy
 * @param {string} text - Text to count words from
 * @returns {number} - Word count
 */
const calculateWordCount = (text) => {
  if (!text || typeof text !== 'string') return 0;
  return text
    .trim()
    .split(/[\s,\n\r\t]+/)
    .filter(word => word.length > 0 && /\S/.test(word))
    .length;
};

/**
 * Calculate character count excluding whitespace
 * @param {string} text - Text to count characters from
 * @returns {number} - Character count
 */
const calculateCharCount = (text) => {
  if (!text || typeof text !== 'string') return 0;
  return text.replace(/\s+/g, '').length;
};

/**
 * Truncate URL for display with ellipsis
 * @param {string} url - URL to truncate
 * @param {number} maxLength - Maximum length before truncation
 * @returns {string} - Truncated URL
 */
const truncateURL = (url, maxLength = CONSTANTS.MAX_URL_DISPLAY_LENGTH) => {
  if (!url || url.length <= maxLength) return url;
  return `${url.slice(0, CONSTANTS.TRUNCATE_LENGTH)}...`;
};

/**
 * Deep comparison utility for objects
 * @param {*} obj1 - First object
 * @param {*} obj2 - Second object
 * @returns {boolean} - True if objects are equal
 */
const deepEqual = (obj1, obj2) => {
  if (obj1 === obj2) return true;
  if (obj1 == null || obj2 == null) return false;
  if (typeof obj1 !== typeof obj2) return false;
  
  if (typeof obj1 === 'object') {
    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);
    if (keys1.length !== keys2.length) return false;
    
    return keys1.every(key => deepEqual(obj1[key], obj2[key]));
  }
  
  return false;
};

/**
 * Debounce function to limit API calls
 * @param {Function} func - Function to debounce
 * @param {number} delay - Delay in milliseconds
 * @returns {Function} - Debounced function
 */
const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(null, args), delay);
  };
};

/**
 * Retry mechanism for API calls
 * @param {Function} fn - Function to retry
 * @param {number} maxAttempts - Maximum retry attempts
 * @param {number} delay - Delay between retries
 * @returns {Promise} - Promise that resolves with the result
 */
const retryWithBackoff = async (fn, maxAttempts = CONSTANTS.RETRY_ATTEMPTS, delay = CONSTANTS.RETRY_DELAY) => {
  let lastError;
  
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      console.warn(`Attempt ${attempt} failed:`, error.message);
      
      if (attempt < maxAttempts) {
        const backoffDelay = delay * Math.pow(2, attempt - 1);
        await new Promise(resolve => setTimeout(resolve, backoffDelay));
      }
    }
  }
  
  throw lastError;
};

// ============================================================================
// CUSTOM HOOKS
// ============================================================================

/**
 * Custom hook for managing local storage with error handling
 * @param {string} key - Storage key
 * @param {*} defaultValue - Default value
 * @returns {Array} - [value, setValue, error]
 */
const useLocalStorage = (key, defaultValue) => {
  const [value, setValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return defaultValue;
    }
  });

  const setStoredValue = useCallback((newValue) => {
    try {
      setValue(newValue);
      window.localStorage.setItem(key, JSON.stringify(newValue));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  }, [key]);

  return [value, setStoredValue];
};

/**
 * Custom hook for managing async operations with loading and error states
 * @returns {Object} - Async operation state and methods
 */
const useAsyncOperation = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const executeAsync = useCallback(async (asyncFunction) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await asyncFunction();
      return result;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearError = useCallback(() => setError(null), []);

  return { isLoading, error, executeAsync, clearError };
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const Source = memo(() => {
  // ============================================================================
  // HOOKS AND STATE MANAGEMENT
  // ============================================================================
  
  const { theme } = useTheme();
  const router = useRouter();
  const dispatch = useDispatch();
  
  // Refs for performance optimization
  const textareaRef = useRef(null);
  const urlInputRef = useRef(null);
  const abortControllerRef = useRef(null);
  const cacheRef = useRef(new Map());
  
  // Redux state
  const file = useSelector((state) => state.fileUpdate.file);
  const { selectedChatAgent } = useSelector((state) => state.selectedData);
  
  // Core state
  const [pastedUrl, setPastedUrl] = useState([]);
  const [inputUrl, setInputUrl] = useState("");
  const [error, setError] = useState("");
  const [rawText, setRawText] = useState("");
  const [selectedSection, setSelectedSection] = useState(SECTIONS.FILES);
  const [hasChanges, setHasChanges] = useState(false);
  
  // Word and character counts
  const [rawWordCounts, setRawWordCounts] = useState(0);
  const [rawCharCount, setRawCharCount] = useState(0);
  const [fileWordCounts, setFileWordCounts] = useState({});
  const [urlWordCounts, setUrlWordCounts] = useState({});
  const [fetchedCharCounts, setFetchedCharCounts] = useState({});
  const [charCount, setCharCount] = useState(0);
  const [totalWordCount, setTotalWordCount] = useState(0);
  
  // UI state
  const [existingFile, setExistingFile] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  
  // Environment variables
  const apiBaseUrl = process.env.url;
  
  // Async operations hook
  const { isLoading, executeAsync, clearError } = useAsyncOperation();

  // ============================================================================
  // MEMOIZED VALUES
  // ============================================================================
  
  const isUpdateDisabled = useMemo(() => {
    return !hasChanges || isLoading || isProcessing || totalWordCount > CONSTANTS.MAX_WORDS;
  }, [hasChanges, isLoading, isProcessing, totalWordCount]);
  
  const wordCountProgress = useMemo(() => {
    return Math.min((totalWordCount / CONSTANTS.MAX_WORDS) * 100, 100);
  }, [totalWordCount]);
  
  const isWordCountExceeded = useMemo(() => {
    return totalWordCount > CONSTANTS.MAX_WORDS;
  }, [totalWordCount]);
  
  const processedUrls = useMemo(() => {
    return pastedUrl.map((urlObj, index) => {
      const url = typeof urlObj === 'string' ? urlObj : urlObj.url;
      const wordCount = selectedChatAgent?.url_word_count?.[url] || urlObj?.word_count || 0;
      
      return {
        id: `${url}-${index}`,
        url,
        wordCount,
        displayUrl: truncateURL(url),
        isLongUrl: url.length > CONSTANTS.MAX_URL_DISPLAY_LENGTH,
      };
    });
  }, [pastedUrl, selectedChatAgent?.url_word_count]);

  // ============================================================================
  // API FUNCTIONS
  // ============================================================================
  
  /**
   * Enhanced API call with timeout, retry, and error handling
   * @param {string} url - API endpoint URL
   * @param {Object} options - Fetch options
   * @returns {Promise} - API response
   */
  const apiCall = useCallback(async (url, options = {}) => {
    const controller = new AbortController();
    abortControllerRef.current = controller;
    
    const timeoutId = setTimeout(() => {
      controller.abort();
    }, CONSTANTS.API_TIMEOUT);
    
    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      if (error.name === 'AbortError') {
        throw new Error('Request timeout');
      }
      throw error;
    }
  }, []);
  
  /**
   * Fetch word data from URL with enhanced error handling and caching
   * @param {string} url - URL to fetch data from
   * @returns {Promise<Object>} - URL data with word and character counts
   */
  const fetchWordData = useCallback(async (url) => {
    const cacheKey = `word_data_${url}`;
    const cachedData = cacheRef.current.get(cacheKey);
    
    // Check cache validity
    if (cachedData && Date.now() - cachedData.timestamp < CONSTANTS.CHAR_COUNT_CACHE_TTL) {
      return cachedData.data;
    }
    
    const fetchData = async () => {
      const response = await apiCall("https://api.zoft.ai/url/extract/word", {
        method: "POST",
        body: JSON.stringify({
          euid: 845121,
          url: url,
        }),
      });
      
      const data = await response.json();
      
      // Validate response data
      const validatedData = {
        url: url,
        word_count: Math.max(0, parseInt(data.word_count) || 0),
        char_count: Math.max(0, parseInt(data.char_count) || 0),
        title: data.title || url,
        description: data.description || '',
        timestamp: Date.now(),
      };
      
      // Cache the result
      cacheRef.current.set(cacheKey, {
        data: validatedData,
        timestamp: Date.now(),
      });
      
      return validatedData;
    };
    
    return retryWithBackoff(fetchData);
  }, [apiCall]);
  
  /**
   * Update chat agent with enhanced error handling and validation
   * @returns {Promise<void>}
   */
  const updateChatAgent = useCallback(async () => {
    if (!selectedChatAgent?.id) {
      throw new Error('No chat agent selected');
    }
    
    const formData = new FormData();
    const urlDict = {};
    let urlsString = "";
    let existingFilesString = "";
    
    // Process URLs
    pastedUrl.forEach((url) => {
      const urlString = typeof url === 'string' ? url : url.url;
      urlsString += urlString + ",";
      urlDict[urlString] = typeof url === 'object' ? url.word_count || 0 : 0;
    });
    
    // Process existing files
    Object.keys(existingFile).forEach((name) => {
      existingFilesString += name + ",";
    });
    
    // Clean up strings
    urlsString = urlsString.slice(0, -1);
    existingFilesString = existingFilesString.slice(0, -1);
    
    // Add files to form data
    file?.forEach((file) => {
      formData.append("files", file);
    });
    
    // Add all form data
    formData.append("chat_agent_id", selectedChatAgent.id);
    formData.append("URLs", urlsString);
    formData.append("raw_text", rawText);
    formData.append("existing_files", JSON.stringify(existingFile));
    formData.append("url_word_count", JSON.stringify(urlDict));
    formData.append("file_word_count", JSON.stringify(fileWordCounts));
    formData.append("raw_text_word_count", rawWordCounts);
    
    // Update chat agent
    const response = await fetch(`${apiBaseUrl}/public/chat_agent/update_base`, {
      ...getApiConfig(),
      method: "POST",
      headers: new Headers(getApiHeaders()),
      body: formData,
    });
    
    if (!response.ok) {
      throw new Error(`Update failed with status: ${response.status}`);
    }
    
    const chatId = await response.text();
    
    // Fetch updated agent data
    const updateFormData = new FormData();
    updateFormData.append("chat_agent_id", chatId);
    
    {/*const updatedResponse = await fetch(`${apiBaseUrl}/public/chat_agent/get_agent/by_id`, {
      ...getApiConfig(),
      method: "POST",
      headers: new Headers(getApiHeaders()),
      body: updateFormData,
    });
    
    if (!updatedResponse.ok) {
      throw new Error('Failed to fetch updated agent data');
    }
    
    const updatedData = await updatedResponse.json();
    localStorage.setItem("current_agent", JSON.stringify(updatedData[0] || {}));
    
    return updatedData[0];*/}
  }, [selectedChatAgent, pastedUrl, existingFile, file, rawText, fileWordCounts, rawWordCounts, apiBaseUrl]);

  // ============================================================================
  // CHANGE DETECTION
  // ============================================================================
  
  /**
   * Enhanced change detection with deep comparison
   * @returns {boolean} - True if changes detected
   */
  const detectChanges = useCallback(() => {
    if (!selectedChatAgent) return false;
    
    let hasChanges = false;
    
    // Compare URLs
    const currentUrls = pastedUrl.map(url => typeof url === 'string' ? url : url.url);
    const originalUrls = selectedChatAgent.urls || [];
    
    if (!deepEqual(currentUrls.sort(), originalUrls.sort())) {
      hasChanges = true;
    }
    
    // Compare file word counts
    const originalFileCounts = selectedChatAgent.file_word_count || {};
    const newFileCounts = fileWordCounts || {};
    
    if (!deepEqual(originalFileCounts, newFileCounts)) {
      hasChanges = true;
    }
    
    // Compare raw text
    if (rawText !== (selectedChatAgent.raw_text || "")) {
      hasChanges = true;
    }
    
    return hasChanges;
  }, [pastedUrl, selectedChatAgent, fileWordCounts, rawText]);

  // ============================================================================
  // EVENT HANDLERS
  // ============================================================================
  
  /**
   * Handle URL input changes with validation
   * @param {Event} e - Input event
   */
  const handleUrlChange = useCallback((e) => {
    const value = e.target.value;
    setInputUrl(value);
    
    // Clear previous errors
    if (error) {
      setError("");
    }
    
    // Real-time validation feedback
    if (value && !validateURL(sanitizeURL(value))) {
      setValidationErrors(prev => ({
        ...prev,
        url: ERROR_MESSAGES.INVALID_URL
      }));
    } else {
      setValidationErrors(prev => {
        const { url, ...rest } = prev;
        return rest;
      });
    }
  }, [error]);
  
  /**
   * Handle raw text changes with debounced word count calculation
   * @param {Event} e - Textarea event
   */
  const handleRawTextChange = useCallback(
    debounce((e) => {
      const text = e.target.value;
      setRawText(text);
      setRawWordCounts(calculateWordCount(text));
      
      // Auto-resize textarea
      if (e.target.tagName === "TEXTAREA") {
        e.target.style.height = "auto";
        e.target.style.height = `${e.target.scrollHeight}px`;
      }
    }, CONSTANTS.DEBOUNCE_DELAY),
    []
  );
  
  /**
   * Handle adding URL with comprehensive validation
   * @param {KeyboardEvent} e - Keyboard event
   */
  const handleAddUrl = useCallback(async (e) => {
    if (e.key !== "Enter") return;
    
    e.preventDefault();
    
    const trimmedUrl = inputUrl.trim();
    
    // Validation checks
    if (!trimmedUrl) {
      setError(ERROR_MESSAGES.EMPTY_URL);
      return;
    }
    
    const sanitizedUrl = sanitizeURL(trimmedUrl);
    
    if (!validateURL(sanitizedUrl)) {
      setError(ERROR_MESSAGES.INVALID_URL);
      return;
    }
    
    if (pastedUrl.length >= CONSTANTS.MAX_URLS) {
      setError(ERROR_MESSAGES.MAX_URLS_EXCEEDED);
      return;
    }
    
    // Check for duplicates
    const isDuplicate = pastedUrl.some(url => {
      const existingUrl = typeof url === 'string' ? url : url.url;
      return existingUrl === sanitizedUrl;
    });
    
    if (isDuplicate) {
      setError("URL already exists");
      return;
    }
    
    try {
      setIsProcessing(true);
      setError("");
      
      const urlData = await executeAsync(() => fetchWordData(sanitizedUrl));
      
      setPastedUrl(prev => [...prev, urlData]);
      setInputUrl("");
      
    } catch (error) {
      console.error('Error adding URL:', error);
      setError(error.message || ERROR_MESSAGES.FETCH_ERROR);
    } finally {
      setIsProcessing(false);
    }
  }, [inputUrl, pastedUrl, executeAsync, fetchWordData]);
  
  /**
   * Handle URL removal with confirmation for important URLs
   * @param {number} index - Index of URL to remove
   */
  const handleRemoveUrl = useCallback((index) => {
    const urlToRemove = pastedUrl[index];
    const url = typeof urlToRemove === 'string' ? urlToRemove : urlToRemove.url;
    const wordCount = typeof urlToRemove === 'object' ? urlToRemove.word_count : 0;
    
    // Confirm removal for URLs with significant content
    if (wordCount > 100) {
      const confirmMessage = `This URL contains ${wordCount} words. Are you sure you want to remove it?`;
      if (!window.confirm(confirmMessage)) {
        return;
      }
    }
    
    setPastedUrl(prev => prev.filter((_, i) => i !== index));
  }, [pastedUrl]);
  
  /**
   * Handle section navigation
   * @param {number} sectionIndex - Section to navigate to
   */
  const handleSectionChange = useCallback((sectionIndex) => {
    setSelectedSection(sectionIndex);
    
    // Focus appropriate input when switching sections
    setTimeout(() => {
      if (sectionIndex === SECTIONS.URLS && urlInputRef.current) {
        urlInputRef.current.focus();
      } else if (sectionIndex === SECTIONS.RAW_TEXT && textareaRef.current) {
        textareaRef.current.focus();
      }
    }, 100);
  }, []);
  
  /**
   * Handle form submission and update
   */
  const handleUpdate = useCallback(async () => {
    if (isUpdateDisabled) return;
    
    try {
      setIsProcessing(true);
      setError("");
      
      await executeAsync(updateChatAgent);
      
      showSuccessToast(
        "Training is in progress. Please come back later to see the results."
      );
      
      setHasChanges(false);
      
    } catch (error) {
      console.error('Update error:', error);
      setError(error.message || ERROR_MESSAGES.UPDATE_ERROR);
    } finally {
      setIsProcessing(false);
    }
  }, [isUpdateDisabled, executeAsync, updateChatAgent]);
  
  /**
   * Handle navigation back to workspace
   */
  const handleBackToWorkspace = useCallback(() => {
    if (hasChanges) {
      const confirmMessage = "You have unsaved changes. Are you sure you want to leave?";
      if (!window.confirm(confirmMessage)) {
        return;
      }
    }
    
    router.push(`/workspace/agents?workspaceId=${selectedChatAgent?.workspace_id}`);
  }, [hasChanges, router, selectedChatAgent?.workspace_id]);

  // ============================================================================
  // EFFECTS
  // ============================================================================
  
  // Initialize component state from selected chat agent
  useEffect(() => {
    if (!selectedChatAgent) return;
    
    setPastedUrl(selectedChatAgent.urls || []);
    setRawText(selectedChatAgent.raw_text || "");
    setRawWordCounts(selectedChatAgent.raw_text_word_count || 0);
    setRawCharCount(calculateCharCount(selectedChatAgent.raw_text || ""));
    setFileWordCounts(selectedChatAgent.file_word_count || {});
    setExistingFile(selectedChatAgent.file_word_count || {});
    
    // Set URL word counts
    if (selectedChatAgent.url_word_count) {
      const urlCount = Object.values(selectedChatAgent.url_word_count).reduce(
        (total, count) => total + count,
        0
      );
      setUrlWordCounts(urlCount);
    }
  }, [selectedChatAgent]);
  
  // Update raw character count when raw text changes
  useEffect(() => {
    setRawCharCount(calculateCharCount(rawText));
  }, [rawText]);
  
  // Calculate total counts and detect changes
  useEffect(() => {
    const calculateTotalCounts = async () => {
      let urlCharCount = 0;
      let urlWordCount = 0;
      
      // Calculate URL counts
      const urlPromises = pastedUrl.map(async (item) => {
        if (typeof item === 'string') {
          const cachedData = fetchedCharCounts[item];
          if (cachedData) {
            return { chars: cachedData, words: cachedData };
          }
          
          try {
            const data = await fetchWordData(item);
            const chars = data?.char_count || 0;
            const words = data?.word_count || 0;
            
            setFetchedCharCounts(prev => ({ ...prev, [item]: chars }));
            return { chars, words };
          } catch (error) {
            console.error('Error fetching data for URL:', item, error);
            return { chars: 0, words: 0 };
          }
        } else {
          return {
            chars: item?.char_count || 0,
            words: item?.word_count || 0
          };
        }
      });
      
      const urlCounts = await Promise.all(urlPromises);
      urlCharCount = urlCounts.reduce((acc, curr) => acc + curr.chars, 0);
      urlWordCount = urlCounts.reduce((acc, curr) => acc + curr.words, 0);
      
      // Calculate file counts
      const fileCharCount = Object.values(fileWordCounts || {}).reduce(
        (acc, count) => acc + (count.characterCount || 0),
        0
      );
      
      const fileWordCount = Object.values(fileWordCounts || {}).reduce(
        (acc, count) => acc + (count.wordCount || 0),
        0
      );
      
      // Update totals
      setCharCount(rawCharCount + urlCharCount + fileCharCount);
      setTotalWordCount(rawWordCounts + urlWordCount + fileWordCount);
    };
    
    calculateTotalCounts();
  }, [pastedUrl, fileWordCounts, rawCharCount, rawWordCounts, fetchedCharCounts, fetchWordData]);
  
  // Detect changes and update hasChanges state
  useEffect(() => {
    const changes = detectChanges();
    setHasChanges(changes);
  }, [detectChanges]);
  
  // Cleanup effect
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  // ============================================================================
  // RENDER COMPONENTS
  // ============================================================================
  
  /**
   * Render navigation section
   */
  const renderNavigation = useMemo(() => (
    <div className="flex flex-col w-full text-base">
      {SECTION_LABELS.map((section, index) => (
        <React.Fragment key={section.id}>
          {index > 0 && (
            <div className="bg-zinc-200 dark:bg-zinc-700 min-w-full min-h-[1px]" />
          )}
          <button
            onClick={() => handleSectionChange(section.id)}
            className={`${
              section.id === selectedSection
                ? "bg-[#2D3377]/10 text-[#2D3377] font-medium shadow-sm"
                : "text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 dark:text-gray-300"
            } px-6 py-3 my-0.5 rounded-lg transition-all duration-200 w-full text-left text-base flex items-center gap-3`}
            aria-selected={section.id === selectedSection}
            role="tab"
          >
            <span className="text-lg">{section.icon}</span>
            <span>{section.label}</span>
          </button>
        </React.Fragment>
      ))}
    </div>
  ), [selectedSection, handleSectionChange]);
  
  /**
   * Render files section
   */
  const renderFilesSection = useMemo(() => (
    <div className="min-w-[85%] max-w-[85%]">
      <AddFile
        existingFile={existingFile}
        setExistingFile={setExistingFile}
        setFileWordCounts={setFileWordCounts}
        fileWordCounts={fileWordCounts}
      />
    </div>
  ), [existingFile, fileWordCounts]);
  
  /**
   * Render URLs section with enhanced UI
   */
  const renderUrlsSection = useMemo(() => (
    <div className="min-w-[85%] max-w-[85%] flex flex-col items-center justify-start">
      <div className="relative w-full">
        <input
          ref={urlInputRef}
          onChange={handleUrlChange}
          onKeyDown={handleAddUrl}
          value={inputUrl}
          type="url"
          id="url"
          disabled={isProcessing || pastedUrl.length >= CONSTANTS.MAX_URLS}
          className={`text-base border w-full border-zinc-300 px-4 py-3 rounded-lg focus:ring-2 focus:ring-[#2D3377]/20 focus:border-[#2D3377] outline-none transition-all duration-200 ${
            theme === "dark"
              ? "bg-[#1F222A] text-white border-zinc-600"
              : "bg-white text-black"
          } ${
            validationErrors.url ? "border-red-500 focus:ring-red-200" : ""
          } ${
            isProcessing ? "opacity-50 cursor-not-allowed" : ""
          }`}
          placeholder={
            pastedUrl.length >= CONSTANTS.MAX_URLS 
              ? `Maximum ${CONSTANTS.MAX_URLS} URLs allowed`
              : "Enter URLs (Press Enter to add)"
          }
          aria-describedby="url-help"
        />
        
        {isProcessing && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#2D3377]"></div>
          </div>
        )}
      </div>
      
      {validationErrors.url && (
        <p className="text-red-500 text-sm mt-1 w-full">{validationErrors.url}</p>
      )}
      
      <div id="url-help" className="text-xs text-gray-500 mt-1 w-full">
        Add up to {CONSTANTS.MAX_URLS} URLs. Press Enter to add each URL.
      </div>
      
      <div className="flex flex-col gap-3 text-base mt-6 w-full">
        {/*processedUrls.length > 0 && (
          <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            {processedUrls.length} of {CONSTANTS.MAX_URLS} URLs added
          </div>
        )*/}
        
        {processedUrls.map((urlData, index) => (
          <div
            key={urlData.id}
            className="min-h-[56px] w-full border border-zinc-300 dark:border-zinc-600 px-4 py-3 text-sm rounded-lg flex justify-between items-center bg-white dark:bg-[#1F222A] shadow-sm hover:shadow-md transition-all duration-200 group"
          >
            <div className="flex-1 min-w-0 mr-4">
              {urlData.isLongUrl ? (
                <div className="relative">
                  <div className="group/tooltip">
                    <span 
                      className="absolute bg-gray-800 text-white top-[-45px] left-0 rounded-lg px-3 py-2 text-xs shadow-lg opacity-0 group-hover/tooltip:opacity-100 transition-opacity duration-300 z-10 whitespace-nowrap"
                      style={{ maxWidth: '300px' }}
                    >
                      {urlData.url}
                    </span>
                    <span className="cursor-pointer group-hover/tooltip:text-[#2D3377] transition-colors duration-200 block truncate">
                      {urlData.displayUrl}
                    </span>
                  </div>
                </div>
              ) : (
                <span className="text-gray-800 dark:text-gray-200 block truncate">
                  {urlData.url}
                </span>
              )}
            </div>
            
            <div className="flex items-center gap-3 flex-shrink-0">
              <span className="text-gray-600 dark:text-gray-400 font-medium text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                {urlData.wordCount.toLocaleString()} words
              </span>
              
              <button
                onClick={() => handleRemoveUrl(index)}
                className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors duration-200 group-hover:opacity-100 opacity-70"
                aria-label={`Remove URL: ${urlData.displayUrl}`}
                title="Remove URL"
              >
                <DeleteIcon />
              </button>
            </div>
          </div>
        ))}
        
        {processedUrls.length === 0 && (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <p>No URLs added yet</p>
            <p className="text-xs">Enter a URL above and press Enter to add it</p>
          </div>
        )}
      </div>
    </div>
  ), [
    inputUrl, 
    handleUrlChange, 
    handleAddUrl, 
    isProcessing, 
    pastedUrl.length, 
    theme, 
    validationErrors.url, 
    processedUrls, 
    handleRemoveUrl
  ]);
  
  /**
   * Render raw text section with enhanced features
   */
  const renderRawTextSection = useMemo(() => (
    <div className="min-w-[85%] max-w-[85%]">
      <div className="mb-4 text-base flex justify-between items-center">
        <div className="text-gray-600 dark:text-gray-400">
          Words count: 
          <span className={`font-medium ml-2 ${
            rawWordCounts > CONSTANTS.MAX_WORDS * 0.8 
              ? 'text-orange-500' 
              : 'text-[#2D3377]'
          }`}>
            {rawWordCounts.toLocaleString()}
          </span>
        </div>
        
        <div className="text-xs text-gray-500">
          Characters: {rawCharCount.toLocaleString()}
        </div>
      </div>
      
      <div className="relative">
        <textarea
          ref={textareaRef}
          onChange={handleRawTextChange}
          value={rawText}
          id="rawText"
          className={`w-full text-base border p-4 border-zinc-300 dark:border-zinc-600 rounded-lg focus:ring-2 focus:ring-[#2D3377]/20 focus:border-[#2D3377] outline-none max-h-[70vh] overflow-y-auto transition-all duration-200 resize-none ${
            theme === "dark"
              ? "bg-[#1F222A] text-white"
              : "bg-white text-black"
          }`}
          placeholder="Enter raw text content here..."
          style={{ height: "auto", minHeight: "15vh" }}
          aria-describedby="raw-text-help"
        />
        
        {rawText && (
          <button
            onClick={() => {
              setRawText("");
              setRawWordCounts(0);
              setRawCharCount(0);
            }}
            className="absolute top-2 right-2 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            title="Clear text"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
      
      <div id="raw-text-help" className="text-xs text-gray-500 mt-2">
        Paste or type your text content. Word count updates automatically.
      </div>
    </div>
  ), [rawText, rawWordCounts, rawCharCount, handleRawTextChange, theme]);

  /**
   * Render sources sidebar with enhanced metrics
   */
  const renderSourcesSidebar = useMemo(() => (
    <div
      className={`flex flex-col gap-4 justify-center items-center w-[20%] py-16 px-4 rounded-xl shadow-lg ${
        theme === "dark" ? "bg-[#1A1C22] text-white" : "bg-white text-black"
      }`}
    >
      <h5 className="font-semibold text-lg text-[#2D3377] flex items-center gap-2">
        Sources
      </h5>
      
      <div className="w-full space-y-6">
        {/* Total Words */}
        <div className="text-center">
          <h6 className="font-semibold text-base text-gray-600 dark:text-gray-400 mb-2">
            Total Words Detected
          </h6>
          <div className="relative">
            <div className={`text-2xl font-bold ${
              isWordCountExceeded ? 'text-red-500' : 'text-[#2D3377]'
            }`}>
              {totalWordCount.toLocaleString()}
            </div>
            <div className="text-sm text-gray-500 mt-1">
              of {CONSTANTS.MAX_WORDS.toLocaleString()} limit
            </div>
            
            {/* Progress bar */}
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-3">
              <div 
                className={`h-2 rounded-full transition-all duration-500 ${
                  isWordCountExceeded ? 'bg-red-500' : 'bg-[#2D3377]'
                }`}
                style={{ width: `${Math.min(wordCountProgress, 100)}%` }}
              />
            </div>
            
            {isWordCountExceeded && (
              <div className="text-xs text-red-500 mt-2 font-medium">
                 Word limit exceeded
              </div>
            )}
          </div>
        </div>
        
        {/* Character Count */}
        <div className="text-center">
          <h6 className="font-semibold text-base text-gray-600 dark:text-gray-400 mb-2">
            Total Characters
          </h6>
          <p className="text-lg font-medium text-[#2D3377]">
            {charCount.toLocaleString()}
          </p>
        </div>
        
        {/* Breakdown
        <div className="text-center space-y-3">
          <h6 className="font-semibold text-sm text-gray-600 dark:text-gray-400">
            Source Breakdown
          </h6>
          
          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span>Raw Text:</span>
              <span className="font-medium">{rawWordCounts.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>URLs:</span>
              <span className="font-medium">{urlWordCounts.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Files:</span>
              <span className="font-medium">
                {Object.values(fileWordCounts || {}).reduce(
                  (acc, count) => acc + (count.wordCount || 0), 0
                ).toLocaleString()}
              </span>
            </div>
          </div>
        </div>*/}
      </div>
      
      {/* Error Display */}
      {error && (
        <div className="w-full">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <span className="text-red-700 dark:text-red-400 text-sm font-medium">
                {error}
              </span>
            </div>
          </div>
        </div>
      )}
      
      {/* Update Button */}
      <div className="w-full">
        <ContainedButton
          onClick={handleUpdate}
          disabled={isUpdateDisabled}
          className={`w-full mt-4 font-medium py-3 px-6 rounded-lg transition-all duration-200 relative ${
            isUpdateDisabled
              ? "bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed opacity-50"
              : "bg-[#2D3377] hover:bg-[#211A55] text-white cursor-pointer hover:shadow-lg transform hover:scale-105"
          }`}
        >
          {isProcessing || isLoading ? (
            <div className="flex items-center justify-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span>Processing...</span>
            </div>
          ) : (
            <>
              <span className="ml-2">Retrain Chatbot</span>
            </>
          )}
        </ContainedButton>
        
        {hasChanges && !isUpdateDisabled && (
          <div className="text-xs text-green-600 dark:text-green-400 mt-2 text-center">
            ✓ Changes detected
          </div>
        )}
        
        {!hasChanges && (
          <div className="text-xs text-gray-500 mt-2 text-center">
            No changes to save
          </div>
        )}
      </div>
    </div>
  ), [
    theme,
    totalWordCount,
    isWordCountExceeded,
    wordCountProgress,
    charCount,
    rawWordCounts,
    urlWordCounts,
    fileWordCounts,
    error,
    handleUpdate,
    isUpdateDisabled,
    isProcessing,
    isLoading,
    hasChanges
  ]);

  // ============================================================================
  // MAIN RENDER
  // ============================================================================
  
  return (
    <div className={`flex flex-col justify-start items-center px-8 w-full h-[100vh] overflow-hidden`}>
      {/* Header */}
      <div className={`border-b-[.1vw] flex justify-center relative w-full mt-[2vw] pt-[.6vw] text-base border-zinc-300 dark:border-zinc-600 ${
        theme === "dark" ? "text-[#9f9f9f]" : "text-black"
      }`}>
        <div className="absolute left-[2vw] top-[-.6vw]">
          <OutlinedButton
            onClick={handleBackToWorkspace}
            borderColor="border-2 border-[#8b8b8b] text-[#8b8b8b] hover:border-[#333333] hover:text-[#333333] dark:border-[#6b6b6b] dark:text-[#6b6b6b] dark:hover:border-[#9b9b9b] dark:hover:text-[#9b9b9b]"
          >
            <FaArrowLeftLong className="text-sm" />
            <span className="text-sm">Back to workspace</span>
          </OutlinedButton>
        </div>
        <ChatSettingNav />
      </div>

      {/* Main Content */}
      <div className="flex items-start justify-start py-8 gap-8 pl-12 pr-12 w-[80%] h-[85%] max-h-[85%]">
        {/* Main Panel */}
        <div className={`flex flex-col justify-start min-h-full max-h-full w-[80%] overflow-hidden py-8 px-4 rounded-xl shadow-lg ${
          theme === "dark" ? "bg-[#1A1C22] text-white" : "bg-white text-black"
        }`}>
          <h1 className="px-10 text-xl font-semibold pb-4 text-[#2D3377]/90 flex items-center gap-3">
            Data Sources
          </h1>
          
          <form 
            className="flex flex-col gap-6 px-10 h-full overflow-hidden"
            onSubmit={(e) => e.preventDefault()}
          >
            <div className="flex justify-between gap-12 h-full w-full overflow-hidden">
              <div className="min-w-[25%] msx-w-[25%]">
                {/* Navigation */}
                {renderNavigation}

              </div>

              {/* Content Area */}
              <div className="flex-1 min-w-[75%] max-w-[75%] overflow-hidden">
                {selectedSection === SECTIONS.FILES && renderFilesSection}
                {selectedSection === SECTIONS.URLS && renderUrlsSection}
                {selectedSection === SECTIONS.RAW_TEXT && renderRawTextSection}
              </div>
            </div>
          </form>
        </div>

        {/* Sources Sidebar */}
        {renderSourcesSidebar}
      </div>
      
      {/* Keyboard Shortcuts Help (Hidden by default, can be toggled) */}
      <div className="hidden fixed bottom-4 right-4 bg-black/80 text-white p-3 rounded-lg text-xs">
        <div className="font-semibold mb-2">Keyboard Shortcuts:</div>
        <div>• Enter: Add URL</div>
        <div>• Ctrl+S: Save changes</div>
        <div>• Tab: Navigate sections</div>
      </div>
    </div>
  );
});

// Set display name for debugging
Source.displayName = 'Source';

export default Source;