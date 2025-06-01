"use client";
import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
  useMemo,
  memo,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { Chip } from "@mui/material";
import PropTypes from "prop-types";
import useTheme from "next-theme";

// Components
import GradientButton from "../buttons/GradientButton";
import { OutlinedButton } from "../buttons/OutlinedButton";
import { ContainedButton } from "../buttons/ContainedButton";
import TickIcon from "../Icons/TickIcon";
import { TiArrowSortedDown } from "react-icons/ti";

// Redux Actions
import {
  setphoneAgentName,
  setphoneAgentPurpose,
  setLanguage,
  setGender,
  setVoice,
  setCountryCode,
  setPhoneNumber,
  setCompanyName,
  setCompanyBusiness,
  setCompanyServices,
} from "../../store/actions/phoneAgentActions";

// Utilities
import {
  elevenlabsVoice,
  language_mapping_accent,
} from "../../utility/eleven-labs-voice";
import { getApiConfig, getApiHeaders } from "@/utility/api-config";

// Constants
const CONSTANTS = {
  VALIDATION: {
    MIN_NAME_LENGTH: 2,
    MIN_PURPOSE_LENGTH: 10,
    MAX_NAME_LENGTH: 50,
    MAX_PURPOSE_LENGTH: 1000,
  },
  UI: {
    ANIMATION_DURATION: 700,
    DEBOUNCE_DELAY: 300,
    AUTO_RESIZE_DELAY: 100,
  },
  ROUTES: {
    PREVIOUS: "/workspace/agents",
    NEXT: "/workspace/agents/phone/datasource",
  },
  STEPS: {
    CURRENT: 1,
    LABELS: {
      1: "phonebot creation",
      2: "Data Source",
      3: "Actions",
    },
  },
  ACCORDIONS: {
    AGENT_SETTINGS: "agentSettings",
    BUSINESS_SETTINGS: "businessSettings",
    ADVANCED_SETTINGS: "advancedSettings",
  },
};

const THEME_CONFIG = {
  light: {
    background: "bg-[#F2F4F7]",
    card: "bg-white",
    header: "bg-white",
    footer: "bg-white",
    text: "text-black",
    accordion: "bg-[#F2F4F7]",
  },
  dark: {
    background: "bg-[#1F222A]",
    card: "bg-[#1A1C21]",
    header: "bg-[#1A1C21]",
    footer: "bg-[#1F222A]",
    text: "text-white",
    accordion: "bg-[#1F222A]",
  },
};

const VALIDATION_RULES = {
  phoneAgentName: {
    required: true,
    minLength: CONSTANTS.VALIDATION.MIN_NAME_LENGTH,
    maxLength: CONSTANTS.VALIDATION.MAX_NAME_LENGTH,
    pattern: /^[a-zA-Z\s]+$/,
  },
  phoneAgentPurpose: {
    required: true,
    minLength: CONSTANTS.VALIDATION.MIN_PURPOSE_LENGTH,
    maxLength: CONSTANTS.VALIDATION.MAX_PURPOSE_LENGTH,
  },
  language: { required: true },
  gender: { required: true },
  voice: { required: true },
};

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

const useFormValidation = (formData) => {
  return useMemo(() => {
    const errors = {};
    const isValid = {};

    Object.entries(VALIDATION_RULES).forEach(([field, rules]) => {
      const value = formData[field];
      errors[field] = [];
      isValid[field] = true;

      // Safe string conversion and trimming
      const stringValue = value != null ? String(value) : "";
      const trimmedValue = stringValue.trim();

      if (rules.required && (!value || trimmedValue === "")) {
        errors[field].push("This field is required");
        isValid[field] = false;
      }

      if (
        trimmedValue &&
        rules.minLength &&
        trimmedValue.length < rules.minLength
      ) {
        errors[field].push(`Minimum ${rules.minLength} characters required`);
        isValid[field] = false;
      }

      if (
        trimmedValue &&
        rules.maxLength &&
        trimmedValue.length > rules.maxLength
      ) {
        errors[field].push(`Maximum ${rules.maxLength} characters allowed`);
        isValid[field] = false;
      }

      if (trimmedValue && rules.pattern && !rules.pattern.test(trimmedValue)) {
        errors[field].push("Invalid format");
        isValid[field] = false;
      }
    });

    const allFieldsValid = Object.values(isValid).every(Boolean);

    return { errors, isValid, allFieldsValid };
  }, [formData]);
};

const useAutoResize = () => {
  const autoResize = useCallback((element) => {
    if (!element) return;
    element.style.height = "auto";
    element.style.height = `${element.scrollHeight}px`;
  }, []);

  return { autoResize };
};

const useApiService = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPhoneNumbers = useCallback(async (workspaceId) => {
    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("workspace_id", workspaceId);

      const response = await fetch(
        `${process.env.url || ""}/twilio/get/numbers`,
        {
          ...getApiConfig(),
          method: "POST",
          headers: new Headers({
            ...getApiHeaders(),
          }),
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return data || [];
    } catch (err) {
      console.error("Failed to fetch phone numbers:", err);
      setError(err.message);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { fetchPhoneNumbers, isLoading, error };
};

// Enhanced Search Component
const SearchableSelect = memo(
  ({
    options,
    value,
    onChange,
    placeholder,
    searchPlaceholder,
    renderOption,
    className = "",
    disabled = false,
    error = false,
  }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const dropdownRef = useRef(null);
    const searchInputRef = useRef(null);

    const debouncedSearchTerm = useDebounce(searchTerm, 200);

    const filteredOptions = useMemo(() => {
      if (!debouncedSearchTerm.trim()) return options;
      return options.filter((option) =>
        (option.label || option.name || option)
          .toLowerCase()
          .includes(debouncedSearchTerm.toLowerCase())
      );
    }, [options, debouncedSearchTerm]);

    const selectedOption = useMemo(
      () =>
        options.find(
          (option) => (option.value || option.voice_id || option) === value
        ),
      [options, value]
    );

    const handleToggle = useCallback(() => {
      if (disabled) return;
      setIsOpen((prev) => !prev);
      if (!isOpen && searchInputRef.current) {
        setTimeout(() => searchInputRef.current?.focus(), 100);
      }
    }, [disabled, isOpen]);

    const handleSelect = useCallback(
      (option) => {
        const selectedValue = option.value || option.voice_id || option;
        onChange(selectedValue);
        setIsOpen(false);
        setSearchTerm("");
      },
      [onChange]
    );

    const handleClickOutside = useCallback((event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearchTerm("");
      }
    }, []);

    useEffect(() => {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }, [handleClickOutside]);

    return (
      <div className={`relative ${className}`} ref={dropdownRef}>
        <button
          type="button"
          onClick={handleToggle}
          disabled={disabled}
          className={`w-full border rounded-md px-3 py-2 text-left focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ${
            error ? "border-red-300 bg-red-50" : "border-gray-300 bg-white"
          } ${
            disabled ? "opacity-50 cursor-not-allowed" : "hover:border-gray-400"
          }`}
        >
          <span className={selectedOption ? "text-gray-900" : "text-gray-500"}>
            {selectedOption
              ? renderOption
                ? renderOption(selectedOption)
                : selectedOption.label || selectedOption.name || selectedOption
              : placeholder}
          </span>
          <TiArrowSortedDown
            className={`absolute right-3 top-1/2 transform -translate-y-1/2 transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {isOpen && (
          <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-hidden">
            <div className="p-2 border-b">
              <input
                ref={searchInputRef}
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={searchPlaceholder || "Search..."}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="max-h-48 overflow-y-auto">
              {filteredOptions.length > 0 ? (
                filteredOptions.map((option, index) => (
                  <button
                    key={option.value || option.voice_id || index}
                    type="button"
                    onClick={() => handleSelect(option)}
                    className="w-full px-3 py-2 text-left hover:bg-gray-100 focus:bg-gray-100 focus:outline-none transition-colors duration-150"
                  >
                    {renderOption
                      ? renderOption(option)
                      : option.label || option.name || option}
                  </button>
                ))
              ) : (
                <div className="px-3 py-2 text-gray-500 text-center">
                  No options found
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }
);

SearchableSelect.displayName = "SearchableSelect";
SearchableSelect.propTypes = {
  options: PropTypes.array.isRequired,
  value: PropTypes.any,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  searchPlaceholder: PropTypes.string,
  renderOption: PropTypes.func,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  error: PropTypes.bool,
};

// Enhanced Input Field Component
const InputField = memo(
  ({
    label,
    description,
    value,
    onChange,
    placeholder,
    isTextarea = false,
    required = false,
    error = null,
    className = "",
    disabled = false,
    autoResize = false,
    ...props
  }) => {
    const inputRef = useRef(null);
    const { autoResize: performAutoResize } = useAutoResize();

    const handleChange = useCallback(
      (e) => {
        onChange(e);
        if (isTextarea && autoResize && inputRef.current) {
          performAutoResize(inputRef.current);
        }
      },
      [onChange, isTextarea, autoResize, performAutoResize]
    );

    const inputClasses = `w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ${
      error && Array.isArray(error) && error.length > 0
        ? "border-red-300 bg-red-50"
        : "border-gray-300"
    } ${disabled ? "opacity-50 cursor-not-allowed" : ""} ${className}`;

    return (
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          {label} {required && <span className="text-red-500">*</span>}
          {error && error.length > 0 && (
            <span className="text-red-500 text-xs ml-2 font-normal">
              {Array.isArray(error) ? error[0] : String(error)}
            </span>
          )}
        </label>
        {isTextarea ? (
          <textarea
            ref={inputRef}
            value={value}
            onChange={handleChange}
            placeholder={placeholder}
            disabled={disabled}
            className={`${inputClasses} ${
              autoResize ? "resize-none overflow-hidden" : "resize-y"
            }`}
            {...props}
          />
        ) : (
          <input
            ref={inputRef}
            value={value}
            onChange={handleChange}
            placeholder={placeholder}
            disabled={disabled}
            className={inputClasses}
            {...props}
          />
        )}
        {description && <p className="text-xs text-gray-500">{description}</p>}
      </div>
    );
  }
);

InputField.displayName = "InputField";
InputField.propTypes = {
  label: PropTypes.string.isRequired,
  description: PropTypes.string,
  value: PropTypes.any,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  isTextarea: PropTypes.bool,
  required: PropTypes.bool,
  error: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
  className: PropTypes.string,
  disabled: PropTypes.bool,
  autoResize: PropTypes.bool,
};

// Accordion Component
const AccordionSection = memo(
  ({
    id,
    title,
    isOpen,
    onToggle,
    children,
    theme,
    hasError = false,
    errorMessage = "",
  }) => {
    const themeConfig = THEME_CONFIG[theme] || THEME_CONFIG.light;

    return (
      <div
        className={`overflow-hidden w-[75vw] rounded-[0.625vw] transition-all duration-500 relative ${themeConfig.card}`}
      >
        <div className="h-fit w-full">
          <div
            className={`${
              isOpen ? themeConfig.accordion : ""
            } transition-all duration-1000 flex items-center justify-between py-[1%] px-[2vw] cursor-pointer hover:opacity-80`}
            onClick={onToggle}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && onToggle()}
            aria-expanded={isOpen}
            aria-controls={`accordion-${id}`}
          >
            <h1 className="text-[1.1vw] capitalize">{title}</h1>
            <div className="p-[.3vw] flex items-center gap-[1vw]">
              {!isOpen && hasError && (
                <span className="text-red-500 capitalize text-sm font-medium transition-all duration-700">
                  {errorMessage || "*Data Required"}
                </span>
              )}
              <TiArrowSortedDown
                className={`${themeConfig.text} ${
                  isOpen ? "-rotate-180" : ""
                } transition-all duration-700 text-[2vw]`}
              />
            </div>
          </div>
          <div
            id={`accordion-${id}`}
            className={`relative w-full px-[2vw] transition-all duration-1000 ${
              !isOpen
                ? "pointer-events-none h-[0vh] !pt-0 my-0 overflow-hidden opacity-0"
                : "h-[53vh] overflow-y-scroll scrollBar pt-[1.5vw] opacity-100"
            }`}
          >
            {children}
          </div>
        </div>
      </div>
    );
  }
);

AccordionSection.displayName = "AccordionSection";
AccordionSection.propTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  isOpen: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
  theme: PropTypes.oneOf(["light", "dark"]).isRequired,
  hasError: PropTypes.bool,
  errorMessage: PropTypes.string,
};

// Main PhoneAgent Component
const PhoneAgent = ({ className = "", onStepChange = null }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { theme } = useTheme();
  const audioRef = useRef();

  // Redux state
  const {
    phoneAgentType,
    phoneAgentName,
    phoneAgentPurpose,
    language,
    gender,
    voice,
    countryCode,
    phoneNumber,
    companyName,
    companyBusiness,
    companyServices,
  } = useSelector((state) => state.phoneAgent);

  const { selectedWorkSpace } = useSelector((state) => state.selectedData);

  // Local state
  const [progress, setProgress] = useState(false);
  const [accordionState, setAccordionState] = useState({
    [CONSTANTS.ACCORDIONS.AGENT_SETTINGS]: true,
    [CONSTANTS.ACCORDIONS.BUSINESS_SETTINGS]: false,
  });
  const [phoneData, setPhoneData] = useState([]);
  const [voiceUrl, setVoiceUrl] = useState("");
  const [templateData, setTemplateData] = useState(null);

  // Custom hooks
  const {
    fetchPhoneNumbers,
    isLoading: isLoadingPhones,
    error: phoneError,
  } = useApiService();
  const { autoResize } = useAutoResize();

  // Form data for validation
  const formData = useMemo(
    () => ({
      phoneAgentName,
      phoneAgentPurpose,
      language,
      gender,
      voice,
    }),
    [phoneAgentName, phoneAgentPurpose, language, gender, voice]
  );

  const { errors, isValid, allFieldsValid } = useFormValidation(formData);

  useEffect(() => {
    console.log("formData", formData);
  }, [formData]);

  // Theme configuration
  const themeConfig = useMemo(
    () => THEME_CONFIG[theme] || THEME_CONFIG.light,
    [theme]
  );

  // Processed data
  const uniqueLanguages = useMemo(() => {
    if (!elevenlabsVoice) return [];
    //const languages = elevenlabsVoice.map((item) => item.language_accent);
    //return [...new Set(languages)];
  }, []);

  const filteredVoiceNames = useMemo(() => {
    if (!elevenlabsVoice || !language_mapping_accent) return [];

    const elevenLabsVoices = elevenlabsVoice.elevenlabs.filter((item) => {
      const genderMatch = !gender || item.labels?.gender === gender;
      const languageMatch =
        !language ||
        language_mapping_accent[language]?.includes(item.labels?.accent);
      return genderMatch && languageMatch;
    });

    const ultravoxVoices = elevenlabsVoice.ultravox.filter((item) => {
      const genderMatch = !gender || item?.gender === gender;
      const languageMatch =
        !language ||
        language_mapping_accent[language]?.includes(item.accent?.toLowerCase());
      return genderMatch && languageMatch;
    });

    return [...elevenLabsVoices, ...ultravoxVoices];
  }, [gender, language]);

  // Language options for SearchableSelect
  const languageOptions = useMemo(
    () => [
      { value: "English", label: "English" },
      { value: "Tamil", label: "Tamil" },
      { value: "Hindi", label: "Hindi" },
      { value: "Arabic", label: "Arabic" },
      { value: "Spanish", label: "Spanish" },
      { value: "Portuguese", label: "Portuguese" },
      { value: "French", label: "French" },
      { value: "German", label: "German" },
      { value: "Italian", label: "Italian" },
      { value: "Japanese", label: "Japanese" },
      { value: "Chinese", label: "Chinese" },
      { value: "Russian", label: "Russian" },
      { value: "Dutch", label: "Dutch" },
      { value: "Polish", label: "Polish" },
      { value: "Turkish", label: "Turkish" },
      { value: "Ukrainian", label: "Ukrainian" },
      { value: "Romanian", label: "Romanian" },
      { value: "Hungarian", label: "Hungarian" },
      { value: "Finnish", label: "Finnish" },
      { value: "Swedish", label: "Swedish" },
      { value: "Danish", label: "Danish" },
      { value: "Norwegian", label: "Norwegian" },
      { value: "Czech", label: "Czech" },
      { value: "Bulgarian", label: "Bulgarian" },
      { value: "Greek", label: "Greek" },
      { value: "Vietnamese", label: "Vietnamese" }
    ],
    []
  );

  // Gender options (simple select, no search needed)
  const genderOptions = useMemo(
    () => [
      { value: "female", label: "Female" },
      { value: "male", label: "Male" },
    ],
    []
  );

  // Simple Select Component for Gender (no search)
  const SimpleSelect = memo(
    ({
      options,
      value,
      onChange,
      placeholder,
      className = "",
      error = false,
      disabled = false,
    }) => {
      return (
        <select
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 appearance-none ${
            error ? "border-red-300 bg-red-50" : "border-gray-300 bg-white"
          } ${
            disabled ? "opacity-50 cursor-not-allowed" : "hover:border-gray-400"
          } ${className}`}
        >
          <option value="">{placeholder}</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      );
    }
  );

  SimpleSelect.displayName = "SimpleSelect";

  // Initialize component
  useEffect(() => {
    // Parse template data from URL
    try {
      const searchParams = new URLSearchParams(window.location.search);
      const templateParam = searchParams.get("template");
      if (templateParam) {
        const parsed = JSON.parse(decodeURIComponent(templateParam));
        setTemplateData(parsed);
      }
    } catch (error) {
      console.warn("Failed to parse template data:", error);
    }

    // Fetch phone numbers
    if (selectedWorkSpace) {
      fetchPhoneNumbers(selectedWorkSpace).then((data) => {
        setPhoneData(data);
        if (data.length > 0 && !phoneNumber) {
          dispatch(setPhoneNumber(data[0]));
        }
      });
    }

    // Notify parent of step change
    onStepChange?.(CONSTANTS.STEPS.CURRENT);
  }, [
    selectedWorkSpace,
    fetchPhoneNumbers,
    dispatch,
    phoneNumber,
    onStepChange,
  ]);

  // Update voice URL when voice changes
  useEffect(() => {
    if (!voice || !elevenlabsVoice) {
      setVoiceUrl("");
      return;
    }

    const selectedVoice =
      elevenlabsVoice.elevenlabs.find((item) => item.voice_id === voice) ||
      elevenlabsVoice.ultravox.find((item) => item.voiceId === voice) || elevenlabsVoice.elevenlabs.find((item) => item.voice_id === voice.voiceId) ||
      elevenlabsVoice.ultravox.find((item) => item.voiceId === voice.voiceId);
    setVoiceUrl(selectedVoice?.preview_url || selectedVoice?.previewUrl || "");
  }, [voice]);

  // Reload audio when voice URL changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.load();
    }
    console.log('voice url', voiceUrl)
  }, [voiceUrl]);

  // Event handlers
  const handleAccordionToggle = useCallback((accordionId) => {
    setAccordionState((prev) => ({
      ...Object.keys(prev).reduce((acc, key) => ({ ...acc, [key]: false }), {}),
      [accordionId]: !prev[accordionId],
    }));
  }, []);

  const handleInputChange = useCallback(
    (field) => (e) => {
      const value = e.target?.value !== undefined ? e.target.value : e;

      // Ensure we're working with a proper string value
      const cleanValue = value != null ? String(value) : "";

      switch (field) {
        case "phoneAgentName":
          dispatch(setphoneAgentName(cleanValue));
          break;
        case "phoneAgentPurpose":
          dispatch(setphoneAgentPurpose(cleanValue));
          break;
        case "language":
          dispatch(setLanguage(cleanValue));
          break;
        case "gender":
          dispatch(setGender(cleanValue));
          break;
        case "voice":
          dispatch(setVoice(cleanValue));
          break;
        case "phoneNumber":
          dispatch(setPhoneNumber(cleanValue));
          break;
        case "companyName":
          dispatch(setCompanyName(cleanValue));
          break;
        case "companyBusiness":
          dispatch(setCompanyBusiness(cleanValue));
          break;
        case "companyServices":
          dispatch(setCompanyServices(cleanValue));
          break;
        default:
          console.warn(`Unknown field: ${field}`);
      }
    },
    [dispatch]
  );

  const handleVoiceChange = useCallback(
    (selectedVoiceId) => {
      dispatch(setVoice(selectedVoiceId));
    },
    [dispatch]
  );

  const handlePrevious = useCallback(() => {
    router.push(CONSTANTS.ROUTES.PREVIOUS);
  }, [router]);

  const handleNext = useCallback(() => {
    if (!allFieldsValid) {
      console.warn("Form validation failed:", errors);
      return;
    }

    setProgress(true);
    router.push(CONSTANTS.ROUTES.NEXT);
  }, [allFieldsValid, errors, router]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.ctrlKey || event.metaKey) {
        switch (event.key) {
          case "Enter":
            event.preventDefault();
            if (allFieldsValid) handleNext();
            break;
          case "Escape":
            event.preventDefault();
            handlePrevious();
            break;
        }
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [allFieldsValid, handleNext, handlePrevious]);

  // Render voice option with audio preview
  const renderVoiceOption = useCallback((voice) => {
    const isElevenLabs = elevenlabsVoice.elevenlabs.some(
      (item) => item.voice_id === voice.voiceId
    );
    console.log('voice id check', voice)

    return (
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center justify-between w-full gap-2">
          <span>{voice.name}</span>
          <img
            src={`${isElevenLabs ? '/images/elevenlabs-symbol.png' : '/images/ZOFT_LOGO2.png'}`}
            className={`w-8 h-8`}
          />
        </div>
      </div>
    );
  }, []);

  const hasAgentSettingsError =
    !isValid.phoneAgentName ||
    !isValid.phoneAgentPurpose ||
    !isValid.language ||
    !isValid.gender ||
    !isValid.voice;

  return (
    <div
      className={`flex text-[.9vw] w-full h-screen relative ${themeConfig.background} ${themeConfig.text} ${className}`}
    >
      <div className="flex flex-col w-full h-full">
        {/* Header with stepper */}
        <header
          className={`w-full relative top-0 left-[50%] translate-x-[-50%] border-b-[.1vw] border-zinc-300 p-[1.5vw] h-[6vh] flex justify-center items-center ${themeConfig.header}`}
          role="banner"
        >
          <div className="w-[75%] h-full flex items-center justify-center gap-[1vw]">
            <div className="h-full flex items-center justify-start gap-[.5vw]">
              <div className="circle text-blue-400 w-[2vw] h-[2vw] border-cyan-500 border-[.2vw] rounded-full flex justify-center items-center">
                {progress ? <TickIcon /> : 1}
              </div>
              <h2 className="capitalize font-medium text-[.9vw]">
                {CONSTANTS.STEPS.LABELS[1]}
              </h2>
            </div>

            <div className="h-[1px] w-[3vw] bg-zinc-300" />

            <div className="h-full flex items-center justify-start gap-[.5vw] opacity-[.4]">
              <div className="circle text-blue-400 w-[2vw] h-[2vw] rounded-full border-cyan-500 border-[.2vw] flex justify-center items-center">
                2
              </div>
              <h2 className="capitalize font-medium text-[.9vw]">
                {CONSTANTS.STEPS.LABELS[2]}
              </h2>
            </div>

            <div className="h-[1px] w-[3vw] bg-zinc-300" />

            <div className="h-full flex items-center justify-start gap-[.5vw] opacity-[.4]">
              <div className="circle text-blue-400 w-[2vw] h-[2vw] rounded-full border-cyan-500 border-[.2vw] flex justify-center items-center">
                3
              </div>
              <h2 className="capitalize font-medium text-[.9vw]">
                {CONSTANTS.STEPS.LABELS[3]}
              </h2>
            </div>
          </div>
        </header>

        {/* Page title */}
        <div className="py-[2%] px-[3vw]">
          <h1 className="text-[1.3vw] font-semibold">
            Phone Agent{" "}
            <Chip
              label={phoneAgentType === "outbound" ? "Outbound" : "Inbound"}
              color="primary"
            />
          </h1>
        </div>

        {/* Main content */}
        <main
          className="flex w-full h-full pb-[1vw] justify-center items-start overflow-hidden"
          role="main"
        >
          <div className="flex flex-col w-full items-center justify-start gap-[1.2vw]">
            {/* Agent Settings Accordion */}
            <AccordionSection
              id={CONSTANTS.ACCORDIONS.AGENT_SETTINGS}
              title="Agent Settings"
              isOpen={accordionState[CONSTANTS.ACCORDIONS.AGENT_SETTINGS]}
              onToggle={() =>
                handleAccordionToggle(CONSTANTS.ACCORDIONS.AGENT_SETTINGS)
              }
              theme={theme}
              hasError={hasAgentSettingsError}
              errorMessage="*Required fields missing"
            >
              <div className="bg-gray-50 rounded-lg p-6 mb-8">
                <h1 className="text-2xl font-bold mb-3">
                  AI Assistant Configuration
                </h1>
                <form className="flex flex-wrap md:flex-nowrap gap-4">
                  {/* Left Column */}
                  <div className="space-y-6 flex-1">
                    <InputField
                      label="Name"
                      value={templateData?.agent_name || phoneAgentName || ""}
                      onChange={handleInputChange("phoneAgentName")}
                      placeholder="What name will your assistant go by"
                      description="What name will your assistant go by"
                      required
                      error={errors.phoneAgentName}
                    />

                    <InputField
                      label="Purpose or Goal"
                      value={phoneAgentPurpose || ""}
                      onChange={handleInputChange("phoneAgentPurpose")}
                      placeholder="Describe the purpose or goal of your AI assistant"
                      description="Describe the main purpose or goal of your AI assistant"
                      isTextarea
                      autoResize
                      required
                      error={errors.phoneAgentPurpose}
                      rows={1}
                      className="min-h-[180px]"
                    />
                  </div>

                  {/* Right Column */}
                  <div className="space-y-6 flex-1">
                    <div className="flex gap-5">
                      <div className="space-y-2 flex-1">
                        <label className="block text-sm font-medium text-gray-700">
                          Gender <span className="text-red-500">*</span>
                          {errors.gender && errors.gender.length > 0 && (
                            <span className="text-red-500 text-xs ml-2 font-normal">
                              {errors.gender[0]}
                            </span>
                          )}
                        </label>
                        <SimpleSelect
                          options={genderOptions}
                          value={gender}
                          onChange={handleInputChange("gender")}
                          placeholder="Select Gender"
                          error={errors.gender && errors.gender.length > 0}
                        />
                        <p className="text-xs text-gray-500">
                          Select the gender your agent will use
                        </p>
                      </div>

                      <div className="space-y-2 flex-1">
                        <label className="block text-sm font-medium text-gray-700">
                          Language <span className="text-red-500">*</span>
                          {errors.language && errors.language.length > 0 && (
                            <span className="text-red-500 text-xs ml-2 font-normal">
                              {errors.language[0]}
                            </span>
                          )}
                        </label>
                        <SearchableSelect
                          options={languageOptions}
                          value={language}
                          onChange={handleInputChange("language")}
                          placeholder="Select Language"
                          searchPlaceholder="Search language..."
                          error={errors.language && errors.language.length > 0}
                        />
                        <p className="text-xs text-gray-500">
                          Select the language your agent will use
                        </p>
                      </div>
                    </div>

                    {/* Voice Field */}
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Voice <span className="text-red-500">*</span>
                        {errors.voice && errors.voice.length > 0 && (
                          <span className="text-red-500 text-xs ml-2 font-normal">
                            {errors.voice[0]}
                          </span>
                        )}
                      </label>
                      <div className="flex bg-white border border-gray-300 rounded-md p-1 gap-2">
                        <div className="flex-1">
                          <SearchableSelect
                            options={filteredVoiceNames}
                            value={voice}
                            onChange={handleVoiceChange}
                            placeholder="Choose a voice"
                            searchPlaceholder="Search voices..."
                            renderOption={renderVoiceOption}
                            className="border-0 rounded-none"
                            error={errors.voice && errors.voice.length > 0}
                          />
                        </div>
                        {voiceUrl && (
                          <div className="flex-shrink-0">
                            <audio ref={audioRef} controls className="h-10">
                              <source src={voiceUrl} type="audio/mpeg" />
                              Your browser does not support the audio element.
                            </audio>
                          </div>
                        )}
                      </div>
                      <p className="text-xs text-gray-500">
                        Select what voice your agent will use
                      </p>
                    </div>

                    {/* Phone Number Field */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="block text-sm font-medium text-gray-700">
                          Phone number <span className="text-red-500">*</span>
                        </label>
                        {phoneData.length === 0 && !isLoadingPhones && (
                          <div className="p-2 bg-yellow-50 border border-yellow-200 rounded-md flex-1 ml-2">
                            <p className="text-sm text-yellow-700">
                              {phoneError || "Please add Twilio details"}
                            </p>
                          </div>
                        )}
                        {isLoadingPhones && (
                          <div className="p-2 bg-blue-50 border border-blue-200 rounded-md flex-1 ml-2">
                            <p className="text-sm text-blue-700">
                              Loading phone numbers...
                            </p>
                          </div>
                        )}
                      </div>

                      <div className="w-full border border-gray-300 rounded-md overflow-hidden">
                        {phoneData.length > 0 ? (
                          <SearchableSelect
                            options={phoneData.map((phone) => ({
                              value: phone,
                              label: phone,
                            }))}
                            value={phoneNumber}
                            onChange={handleInputChange("phoneNumber")}
                            placeholder="Select phone number"
                            searchPlaceholder="Search phone numbers..."
                            className="w-full border-0 rounded-none"
                          />
                        ) : (
                          <input
                            type="tel"
                            onChange={handleInputChange("phoneNumber")}
                            placeholder="Enter your Twilio phone number"
                            value={phoneNumber || ""}
                            disabled={isLoadingPhones}
                            className="w-full border-0 focus:ring-0 focus:outline-none px-3 py-2 disabled:opacity-50"
                          />
                        )}
                      </div>
                      <p className="text-xs text-gray-500">
                        {phoneData.length > 0
                          ? "Select your Twilio phone number"
                          : "Enter your Twilio phone number"}
                      </p>
                    </div>
                  </div>
                </form>
              </div>
            </AccordionSection>

            {/* Business Settings Accordion */}
            <AccordionSection
              id={CONSTANTS.ACCORDIONS.BUSINESS_SETTINGS}
              title="Agent Business Settings"
              isOpen={accordionState[CONSTANTS.ACCORDIONS.BUSINESS_SETTINGS]}
              onToggle={() =>
                handleAccordionToggle(CONSTANTS.ACCORDIONS.BUSINESS_SETTINGS)
              }
              theme={theme}
            >
              <div className="bg-gray-50 rounded-lg p-6 mb-8">
                <h1 className="text-2xl font-bold mb-6">
                  Company Configuration
                </h1>
                <form className="flex flex-wrap md:flex-nowrap gap-6">
                  {/* Left Column */}
                  <div className="space-y-6 flex-1">
                    <InputField
                      label="Company Name"
                      value={companyName}
                      onChange={handleInputChange("companyName")}
                      placeholder="Enter your company name"
                      description="The official name of your company"
                    />

                    <InputField
                      label="Company Business"
                      value={companyBusiness}
                      onChange={handleInputChange("companyBusiness")}
                      placeholder="Describe your company business"
                      description="Describe what your company does"
                      isTextarea
                      autoResize
                      rows={1}
                      className="min-h-[10vh]"
                    />
                  </div>

                  {/* Right Column */}
                  <div className="space-y-6 flex-1">
                    <InputField
                      label="Company Products"
                      value={companyServices}
                      onChange={handleInputChange("companyServices")}
                      placeholder="List your company products"
                      description="List the products your company offers"
                      isTextarea
                      autoResize
                      rows={1}
                      className="min-h-[210px]"
                    />
                  </div>
                </form>
              </div>
            </AccordionSection>
          </div>
        </main>

        {/* Footer */}
        <footer
          className={`w-full absolute bottom-0 h-[6.5vh] py-[2vw] ${themeConfig.footer} ${themeConfig.text}`}
          role="contentinfo"
        >
          <div className="w-full h-full flex justify-end items-center gap-[2vw] px-[3vw]">
            <OutlinedButton
              onClick={handlePrevious}
              disabled={progress}
              className="border-2 border-[#8b8b8b] text-[#8b8b8b] hover:border-[#333333] hover:text-[#333333] py-[0.3vw] transition-all duration-200 disabled:opacity-50"
              aria-label="Cancel and go back"
            >
              Cancel
            </OutlinedButton>

            <ContainedButton
              onClick={handleNext}
              disabled={!allFieldsValid || progress}
              className={`py-[0.35vw] transition-all duration-200 ${
                !allFieldsValid
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:shadow-lg transform hover:scale-105"
              }`}
              aria-label={
                allFieldsValid
                  ? "Continue to next step"
                  : "Complete required fields to continue"
              }
            >
              {progress ? "Processing..." : "Continue"}
            </ContainedButton>
          </div>
        </footer>

        {/* Error Display */}
        {!allFieldsValid &&
          Object.values(errors).some((error) => error.length > 0) && (
            <div className="fixed bottom-20 left-4 right-4 z-50">
              <div className="max-w-md mx-auto p-4 rounded-lg shadow-lg border-l-4 bg-yellow-50 border-yellow-400 text-yellow-800">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium">
                      Please complete all required fields
                    </p>
                    <ul className="text-xs mt-1 list-disc list-inside">
                      {Object.entries(errors).map(
                        ([field, fieldErrors]) =>
                          fieldErrors.length > 0 && (
                            <li key={field}>
                              {field.replace(/([A-Z])/g, " $1").toLowerCase()}:{" "}
                              {fieldErrors[0]}
                            </li>
                          )
                      )}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

        {/* Loading Overlay */}
        {progress && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
            <div
              className={`p-6 rounded-lg shadow-lg ${themeConfig.card} ${themeConfig.text}`}
            >
              <div className="flex items-center gap-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                <p className="text-lg font-medium">
                  Setting up your phone agent...
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

PhoneAgent.propTypes = {
  className: PropTypes.string,
  onStepChange: PropTypes.func,
};

export default memo(PhoneAgent);
