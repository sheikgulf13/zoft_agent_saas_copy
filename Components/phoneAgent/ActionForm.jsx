"use client";

import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";
import { useDispatch } from "react-redux";
import { upsertAction } from "@/store/reducers/phoneAgentSlice";
import dynamic from "next/dynamic";
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import { v4 as uuidv4 } from "uuid";
import { OutlinedButton } from "../buttons/OutlinedButton";
import { ContainedButton } from "../buttons/ContainedButton";
import { cloneDeep, isEqual } from "lodash";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import RequiredParam from "@/Components/RequiredParam";
import {
  FaCheckCircle,
  FaTimesCircle,
  FaImage,
  FaEdit,
  FaPlus,
} from "react-icons/fa";
import { RiDeleteBin6Fill } from "react-icons/ri";

// Constants
const MAX_REQUEST_DATA_PAIRS = 15;
const MAX_HTTP_HEADERS_PAIRS = 10;
const MAX_NAME_LENGTH = 30;
const DEFAULT_API_METHOD = "GET";
const DEFAULT_REQUEST_DATA_TYPE = "JSON";
const TEXTAREA_DEFAULT_HEIGHT = 200;
const EDITOR_MIN_HEIGHT = 200;
const MAX_ITEMS = 5;

// Field definitions
const FIELD_DEFINITIONS = {
  name: {
    label: "Name",
    value: "action_name",
    placeholder: "Enter the name",
    required: true,
  },
  subject: {
    label: "Subject",
    value: "subject",
    placeholder: "Enter the subject",
    required: true,
  },
  instructions: {
    label: "Instructions",
    value: "instructions",
    placeholder: "Tell your agent when this action should be triggered.",
    required: true,
  },
  content: {
    label: "Content",
    value: "content",
    placeholder: "Provide the main content or body of the email.",
    required: true,
  },
  forwardTo: {
    label: "Forward to",
    value: "forward_to",
    placeholder: "Tell your agent where to forward your call.",
    required: true,
  },
  apiMethod: {
    label: "API Method",
    value: "api_method",
    placeholder: "Method",
    required: true,
  },
  endPoint: {
    label: "End point",
    value: "end_point",
    placeholder: "Enter Endpoint",
    required: true,
  },
  httpHeaders: {
    label: "HTTP Headers",
    value: "http_headers",
    required: false,
  },
  requestData: {
    label: "Request Data",
    value: "request_data",
    required: false,
  },
  requestDataType: {
    label: "Request Data Type",
    value: "request_data_type",
    required: false,
  },
  listOfItems: {
    label: "List",
    value: "list",
    required: false,
  },
  sendVideo: {
    label: "Video",
    value: "url",
    required: false,
  },
};

// Action configurations
const ACTION_CONFIGS = {
  chat: [
    {
      id: 1,
      name: "Send email",
      fields: [
        FIELD_DEFINITIONS.name,
        FIELD_DEFINITIONS.instructions,
        FIELD_DEFINITIONS.subject,
        FIELD_DEFINITIONS.content,
      ],
    },
    {
      id: 2,
      name: "Send API request",
      fields: [
        FIELD_DEFINITIONS.name,
        FIELD_DEFINITIONS.instructions,
        FIELD_DEFINITIONS.apiMethod,
        FIELD_DEFINITIONS.endPoint,
        FIELD_DEFINITIONS.httpHeaders,
        FIELD_DEFINITIONS.requestDataType,
        FIELD_DEFINITIONS.requestData,
      ],
    },
    {
      id: 3,
      name: "Booking appointment",
      fields: [FIELD_DEFINITIONS.name, FIELD_DEFINITIONS.instructions],
    },
    {
      id: 4,
      name: "List of items",
      fields: [
        FIELD_DEFINITIONS.name,
        FIELD_DEFINITIONS.instructions,
        FIELD_DEFINITIONS.listOfItems,
      ],
    },
    {
      id: 5,
      name: "Send video",
      fields: [
        FIELD_DEFINITIONS.name,
        FIELD_DEFINITIONS.instructions,
        FIELD_DEFINITIONS.sendVideo,
      ],
    },
  ],
  phone: [
    {
      id: 1,
      name: "Send email",
      fields: [
        FIELD_DEFINITIONS.name,
        FIELD_DEFINITIONS.instructions,
        FIELD_DEFINITIONS.subject,
        FIELD_DEFINITIONS.content,
      ],
    },
    {
      id: 2,
      name: "Call Forwarding",
      fields: [
        FIELD_DEFINITIONS.name,
        FIELD_DEFINITIONS.instructions,
        FIELD_DEFINITIONS.forwardTo,
      ],
    },
    {
      id: 3,
      name: "Send API request",
      fields: [
        FIELD_DEFINITIONS.name,
        FIELD_DEFINITIONS.instructions,
        FIELD_DEFINITIONS.apiMethod,
        FIELD_DEFINITIONS.endPoint,
        FIELD_DEFINITIONS.httpHeaders,
        FIELD_DEFINITIONS.requestDataType,
        FIELD_DEFINITIONS.requestData,
      ],
    },
    {
      id: 4,
      name: "Booking appointment",
      fields: [FIELD_DEFINITIONS.name, FIELD_DEFINITIONS.instructions],
    },
  ],
};

// API method configurations
const API_METHODS = {
  GET: { value: "GET", supportsBody: false },
  POST: { value: "POST", supportsBody: true },
  PATCH: { value: "PATCH", supportsBody: true },
  PUT: { value: "PUT", supportsBody: true },
  DELETE: { value: "DELETE", supportsBody: false },
};

// Utility functions
const toSnakeCase = (input) => {
  return input.toLowerCase().trim().replace(/\s+/g, "_");
};

const isValidJSON = (str) => {
  try {
    JSON.parse(str);
    return true;
  } catch {
    return false;
  }
};

const convertJSONToKeyValuePairs = (jsonStr) => {
  try {
    const jsonObj = JSON.parse(jsonStr);
    return Object.entries(jsonObj).map(([key, value]) => ({
      key,
      value: typeof value === "object" ? JSON.stringify(value) : String(value),
    }));
  } catch {
    return [];
  }
};

const convertKeyValuePairsToJSON = (pairs) => {
  if (!Array.isArray(pairs) || pairs.length === 0) return "";

  try {
    const jsonObj = {};
    pairs.forEach(({ key, value }) => {
      if (key) {
        try {
          jsonObj[key] = JSON.parse(value);
        } catch {
          jsonObj[key] = value;
        }
      }
    });
    return JSON.stringify(jsonObj, null, 2);
  } catch {
    return "";
  }
};

// Main component
function ActionForm({
  show,
  toggle,
  initialData,
  handleCreateAction,
  forPhoneActions,
}) {
  const dispatch = useDispatch();

  // Get appropriate action configurations
  const actions = useMemo(
    () => (forPhoneActions ? ACTION_CONFIGS.phone : ACTION_CONFIGS.chat),
    [forPhoneActions]
  );

  // State management
  const [selectedAction, setSelectedAction] = useState(actions[0]);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [parameterData, setParameterData] = useState([]);
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [editorContent, setEditorContent] = useState("");
  const [isFormChanged, setIsFormChanged] = useState(false);
  const [initialFormState, setInitialFormState] = useState(null);
  const [isHTTPActive, setIsHTTPActive] = useState(false);
  const [selectedCalendarValue, setSelectedCalendarValue] = useState(null);
  const [isRequestDataActive, setIsRequestDataActive] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [fileName, setFileName] = useState("");
  const [jsonInput, setJsonInput] = useState("");

  // Card functionality states
  const [items, setItems] = useState([{ id: uuidv4(), isPlaceholder: true }]);
  const [activeCardId, setActiveCardId] = useState(null);
  const [cardFormData, setCardFormData] = useState({
    image: null,
    title: "",
    description: "",
    action: "",
    url: "",
    linkText: "",
  });
  const [showCardForm, setShowCardForm] = useState(false);

  // Store form data for each action type to persist when switching
  const [actionFormDataCache, setActionFormDataCache] = useState({});

  // Refs
  const fileInputRef = useRef(null);
  const cardFormRef = useRef();

  useEffect(() => {
    if (showCardForm && cardFormRef.current) {
      cardFormRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [showCardForm]);

  useEffect(() => {
    console.log("formData", formData?.data);
  }, [formData]);

  {/*useEffect(() => {
    if (selectedAction.name === "Send video") {
      setFormData((prev) => ({
        ...prev,
        data: {
          ...prev.data,
          api_method: "",
          request_data_type: "",
        },
      }));
    }
  }, [selectedAction]);*/}

  // Initialize form with initial data or existing formData
  useEffect(() => {
    // Check both initialData and formData for existing data
    const existingData =
      initialData ||
      (formData && Object.keys(formData).length > 0 && formData.action_name
        ? formData
        : null);

    if (existingData) {
      const actionType = actions.find(
        (action) =>
          action.name.toLowerCase() ===
          (existingData.action_type || "").replace(/_/g, " ")
      );

      if (actionType) {
        setSelectedAction(actionType);
      }

      const initialFormData = {
        action_name: existingData.action_name || "",
        instructions: existingData.instructions || "",
        required_params: existingData.required_params || [],
        data: {
          content: existingData.data?.content || "",
          subject: existingData.data?.subject || "",
          forward_to: existingData.data?.forward_to || "",
          api_method:
            existingData.data?.api_method ||
            (actionType !== "send_video" && DEFAULT_API_METHOD),
          end_point: existingData.data?.end_point || "",
          http_headers: existingData.data?.http_headers || [],
          request_data: existingData.data?.request_data || [],
          request_data_type:
            existingData.data?.request_data_type ||
            (actionType !== "send_video" && DEFAULT_REQUEST_DATA_TYPE),
          video: existingData?.data?.video || "",
        },
      };

      setFormData(initialFormData);
      setEditorContent(existingData.data?.content || "");
      setPhoneNumber(existingData.data?.forward_to || "");
      setParameterData(existingData.required_params || []);

      // Set active states
      if (existingData.data?.http_headers?.length > 0) {
        setIsHTTPActive(true);
      }
      if (existingData.data?.request_data?.length > 0) {
        setIsRequestDataActive(true);
      }
      if (existingData.data?.items?.length > 0) {
        setItems(existingData.data.items);
      }

      // Handle JSON input for request data
      if (
        existingData.data?.request_data_type === "JSON" &&
        existingData.data?.request_data?.length > 0
      ) {
        setJsonInput(
          convertKeyValuePairsToJSON(existingData.data.request_data)
        );
      }

      // Set initial form state for change detection AFTER setting all values
      setTimeout(() => {
        setInitialFormState({
          formData: cloneDeep(initialFormData),
          editorContent: existingData.data?.content || "",
          selectedAction: actionType,
          parameterData: existingData.required_params || [],
        });
        setIsFormChanged(false);
      }, 100);

      // Initialize cache with initial data
      const cacheKey = toSnakeCase(actionType?.name || actions[0].name);
      setActionFormDataCache({
        [cacheKey]: {
          formData: cloneDeep(initialFormData),
          editorContent: existingData.data?.content || "",
          isHTTPActive: existingData.data?.http_headers?.length > 0,
          isRequestDataActive: existingData.data?.request_data?.length > 0,
          phoneNumber: existingData.data?.forward_to || "",
          jsonInput:
            existingData.data?.request_data_type === "JSON"
              ? convertKeyValuePairsToJSON(existingData.data.request_data)
              : "",
          parameterData: existingData.required_params || [],
          selectedCalendarValue: "",
          fileName: "",
          items: existingData.data?.items || [
            { id: uuidv4(), isPlaceholder: true },
          ],
        },
      });
    } else {
      // Reset form for new action
      setSelectedAction(actions[0]);
      setFormData({
        data: {
          api_method:
            selectedAction.name !== "Send video" && DEFAULT_API_METHOD,
          request_data_type:
            selectedAction.name !== "Send video" && DEFAULT_REQUEST_DATA_TYPE,
        },
      });
      setEditorContent("");
      setIsHTTPActive(false);
      setIsRequestDataActive(false);
      setInitialFormState(null);
      setJsonInput("");
      setPhoneNumber("");
      setParameterData([]);
      setIsFormChanged(false);
      setItems([{ id: uuidv4(), isPlaceholder: true }]);
    }

    console.log("actions checking", actions);
  }, [initialData, actions]);

  // Form change detection
  useEffect(() => {
    if (!initialFormState) {
      return;
    }

    const currentFormData = {
      ...formData,
      data: {
        ...formData.data,
        content: editorContent,
      },
    };

    const initialForm = {
      ...initialFormState.formData,
      data: {
        ...initialFormState.formData.data,
        content: initialFormState.editorContent,
      },
    };

    const hasChanged =
      !isEqual(currentFormData, initialForm) ||
      !isEqual(parameterData, initialFormState.parameterData) ||
      selectedAction.name !== initialFormState.selectedAction.name;

    setIsFormChanged(hasChanged);
  }, [
    formData,
    editorContent,
    selectedAction,
    parameterData,
    initialFormState,
  ]);

  // Handle API method changes
  useEffect(() => {
    const apiMethod = formData?.data?.api_method;
    const methodConfig = API_METHODS[apiMethod];

    if (methodConfig && !methodConfig.supportsBody) {
      setIsRequestDataActive(false);
      setFormData((prev) => ({
        ...prev,
        data: {
          ...prev.data,
          request_data: [],
        },
      }));
    }
  }, [formData?.data?.api_method]);

  // Update form data with parameters
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      required_params: parameterData,
    }));
  }, [parameterData]);

  // Validation
  const validateForm = useCallback(() => {
    const newErrors = {};

    selectedAction.fields.forEach((field) => {
      let isValid =
        Boolean(formData?.[field.value]) ||
        Boolean(formData?.data?.[field.value]);

      if (field.value === "http_headers") {
        isValid =
          !isHTTPActive ||
          (Array.isArray(formData?.data?.http_headers) &&
            formData.data.http_headers.some(
              (pair) => pair.key?.trim() !== "" && pair.value?.trim() !== ""
            ));
      }

      if (field.value === "request_data") {
        const apiMethod = formData?.data?.api_method;
        const methodConfig = API_METHODS[apiMethod];

        if (!methodConfig?.supportsBody) {
          isValid = true;
        } else {
          isValid =
            !isRequestDataActive ||
            (Array.isArray(formData?.data?.request_data) &&
              formData.data.request_data.some(
                (pair) => pair.key?.trim() !== "" && pair.value?.trim() !== ""
              ));
        }
      }

      if (!isRequestDataActive && field.value === "request_data_type") {
        isValid = true;
      }

      if (!isValid && field.required) {
        newErrors[field.value] = "This field is required.";
      }
    });

    // Special validation for list field
    //if (selectedAction.fields.some(field => field.value === "list")) {
    // const isListValid = items.every(card => !card.isPlaceholder);
    // if (!isListValid) {
    //    newErrors.list = "All items must be filled before submitting";
    //  }
    //}

    return newErrors;
  }, [formData, selectedAction, isHTTPActive, isRequestDataActive]);

  // Handlers
  const handleActionChange = useCallback(
    (e) => {
      const actionId = parseInt(e.target.value);
      const action = actions.find((a) => a.id === actionId);

      if (action) {
        // Save current form data before switching
        const currentActionType = toSnakeCase(selectedAction.name);

        setActionFormDataCache((prev) => {
          const newCache = {
            ...prev,
            [currentActionType]: {
              formData: cloneDeep(formData),
              editorContent,
              isHTTPActive,
              isRequestDataActive,
              phoneNumber,
              jsonInput,
              parameterData,
              selectedCalendarValue,
              fileName,
              items,
            },
          };

          // Check if we have cached data for the new action type
          const newActionType = toSnakeCase(action.name);
          const cachedData = newCache[newActionType] || prev[newActionType];

          if (cachedData) {
            // Restore cached data
            setFormData(cachedData.formData);
            setEditorContent(cachedData.editorContent);
            setIsHTTPActive(cachedData.isHTTPActive);
            setIsRequestDataActive(cachedData.isRequestDataActive);
            setPhoneNumber(cachedData.phoneNumber);
            setJsonInput(cachedData.jsonInput);
            setParameterData(cachedData.parameterData);
            setSelectedCalendarValue(cachedData.selectedCalendarValue);
            setFileName(cachedData.fileName);
            setItems(
              cachedData.items || [{ id: uuidv4(), isPlaceholder: true }]
            );
          } else {
            // No cached data, reset to defaults
            setFormData({
              data: {
                api_method: DEFAULT_API_METHOD,
                request_data_type: DEFAULT_REQUEST_DATA_TYPE,
              },
            });
            setEditorContent("");
            setIsHTTPActive(false);
            setIsRequestDataActive(false);
            setJsonInput("");
            setPhoneNumber("");
            setSelectedCalendarValue("");
            setFileName("");
            setParameterData([]);
            setItems([{ id: uuidv4(), isPlaceholder: true }]);
          }

          return newCache;
        });

        setSelectedAction(action);
        setErrors({});
      }
    },
    [
      selectedAction,
      formData,
      editorContent,
      isHTTPActive,
      isRequestDataActive,
      phoneNumber,
      jsonInput,
      parameterData,
      selectedCalendarValue,
      fileName,
      items,
    ]
  );

  const handleChange = useCallback((e, _id, val) => {
    let id = _id;
    let value = val;

    if (!_id) {
      id = e.target.id;
      value = e.target.value;

      // Auto-resize textarea
      if (e.target.tagName === "TEXTAREA") {
        e.target.style.height = "auto";
        e.target.style.height = `${e.target.scrollHeight}px`;
      }
    }

    setFormData((prev) => {
      if (id === "action_name" || id === "instructions") {
        return { ...prev, [id]: value };
      } else {
        return {
          ...prev,
          data: { ...prev.data, [id]: value },
        };
      }
    });

    setErrors({});
  }, []);

  const handleEditorChange = useCallback(
    (content) => {
      setEditorContent(content);
      handleChange(null, "content", content);
    },
    [handleChange]
  );

  const handlePhoneNumberChange = useCallback((phone) => {
    setPhoneNumber(phone || "");
    setFormData((prev) => ({
      ...prev,
      data: {
        ...prev.data,
        forward_to: phone || "",
      },
    }));
  }, []);

  const handleCalendarChange = useCallback((e) => {
    setSelectedCalendarValue(e.target.value);
  }, []);

  const handleFileChange = useCallback((e) => {
    const file = e.target.files[0];

    if (file && file.name.endsWith(".json")) {
      setFileName(file);
    } else {
      alert("Please upload a valid .json file.");
      setFileName("");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  }, []);

  const handleDeleteFile = useCallback(() => {
    setFileName("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, []);

  const handleAddPair = useCallback((maxLimit, isActive, fieldName) => {
    if (!isActive) return;

    setFormData((prev) => {
      const existingData = prev.data?.[fieldName] ?? [];
      if (existingData.length >= maxLimit) return prev;

      return {
        ...prev,
        data: {
          ...prev.data,
          [fieldName]: [...existingData, { key: "", value: "" }],
        },
      };
    });
  }, []);

  const handleInputChange = useCallback(
    (index, fieldName) => (e) => {
      const { name, value } = e.target;

      setFormData((prev) => {
        const newData = { ...prev };
        const existingData = [...(newData.data[fieldName] || [])];
        existingData[index] = { ...existingData[index], [name]: value };

        return {
          ...newData,
          data: {
            ...newData.data,
            [fieldName]: existingData,
          },
        };
      });
    },
    []
  );

  const handleRemovePair = useCallback((index, fieldName) => {
    setFormData((prev) => {
      const existingData = prev.data[fieldName] || [];
      const updatedData = existingData.filter((_, i) => i !== index);

      return {
        ...prev,
        data:
          updatedData.length === 0
            ? Object.fromEntries(
                Object.entries(prev.data).filter(([key]) => key !== fieldName)
              )
            : { ...prev.data, [fieldName]: updatedData },
      };
    });
  }, []);

  const handleJSONInputChange = useCallback((value) => {
    setJsonInput(value);

    if (value.trim()) {
      try {
        const pairs = convertJSONToKeyValuePairs(value);
        setFormData((prev) => ({
          ...prev,
          data: {
            ...prev.data,
            request_data: pairs,
          },
        }));
      } catch (error) {
        console.error("Invalid JSON:", error);
      }
    }
  }, []);

  // Card-related handlers
  const handleAddCard = useCallback(
    (e) => {
      e?.preventDefault();
      if (items.length < MAX_ITEMS) {
        const newCard = { id: uuidv4(), isPlaceholder: true };
        setItems((prev) => [...prev, newCard]);
        setActiveCardId(newCard.id);
        setShowCardForm(true);
        setCardFormData({
          image: null,
          title: "",
          description: "",
          action: "",
          url: "",
          linkText: "",
        });
      }
    },
    [items.length]
  );

  const handleCardClick = useCallback(
    (cardId) => {
      setActiveCardId(cardId);
      setShowCardForm(true);
      const card = items.find((c) => c.id === cardId);
      if (card && !card.isPlaceholder) {
        setCardFormData({
          image: card.image,
          imageUrl: card.imageUrl,
          title: card.title,
          description: card.description,
          action: card.action,
          url: card.url,
          linkText: card.linkText,
        });
      } else {
        setCardFormData({
          image: null,
          imageUrl: "",
          title: "",
          description: "",
          action: "",
          url: "",
          linkText: "",
        });
      }
    },
    [items]
  );

  const handleCardFormSubmit = useCallback(
    (e) => {
      e.preventDefault();
      const updatedItems = items.map((card) => {
        if (card.id === activeCardId) {
          return {
            ...card,
            isPlaceholder: false,
            ...cardFormData,
          };
        }
        return card;
      });

      setItems(updatedItems);
      setShowCardForm(false);
      setActiveCardId(null);

      setFormData((prev) => ({
        ...prev,
        data: {
          ...prev.data,
          items: updatedItems,
        },
      }));
    },
    [items, activeCardId, cardFormData]
  );

  const handleImageUpload = useCallback((e) => {
    const file = e.target.files[0];
    console.log("image uri inlist 2", file);

    //const originalName = file.name;
    //const extension = originalName.split(".").pop();
    //const baseName = originalName.split(".")[0];

    setCardFormData((prev) => ({
      ...prev,
      image: file.name,
      imageUrl: file,
    }));

    {
      /*if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCardFormData((prev) => ({
          ...prev,
          imageUrl: reader.result,
        }));
      };
      reader.readAsArrayBuffer(file);
    }*/
    }
  }, []);

  useEffect(() => {
    console.log("image url", cardFormData?.image);
  }, [cardFormData]);

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      setFormSubmitted(true);

      // Validate parameters
      const allParamsValid = parameterData.every(
        (param) => param.key.trim() && param.description.trim()
      );

      if (!allParamsValid) {
        console.log("Parameter validation failed!");
        return;
      }

      // Validate form fields
      const validationErrors = validateForm();
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        return;
      }

      // Prepare action data
      const actionData = {
        id: initialData?.id || uuidv4(),
        action_type: toSnakeCase(selectedAction.name),
        ...formData,
      };

      console.log("action data", actionData);

      // Submit and reset
      handleCreateAction(actionData);
      toggle();

      // Reset form and cache
      setFormData({});
      setErrors({});
      setEditorContent("");
      setFormSubmitted(false);
      setActionFormDataCache({});
    },
    [
      formData,
      parameterData,
      selectedAction,
      initialData,
      validateForm,
      handleCreateAction,
      toggle,
    ]
  );

  // Memoized values
  const isJSONValid = useMemo(() => isValidJSON(jsonInput), [jsonInput]);

  const quillModules = useMemo(
    () => ({
      toolbar: [
        ["bold", "italic", "underline"],
        [{ list: "ordered" }, { list: "bullet" }],
        ["clean"],
      ],
    }),
    []
  );

  // Prevent SSR issues with React Quill
  if (typeof window === "undefined") {
    return null;
  }

  // Field renderer
  const renderField = (field) => {
    console.log("field label", field.label);
    switch (field.label) {
      case "Instructions":
        return (
          <textarea
            name={field.label}
            id={field.value}
            placeholder={field.placeholder}
            value={formData?.instructions || ""}
            className={`w-full h-[${TEXTAREA_DEFAULT_HEIGHT}px] rounded-md mt-[.5vw] text-base overflow-hidden resize-none shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-[.5vw] py-[.5vw] border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-[#4D55CC] focus:border-transparent ${
              errors[field.value] ? "border-red-500" : ""
            }`}
            onChange={handleChange}
          />
        );

      case "Content":
        return (
          <div
            className={`mt-2 bg-white dark:bg-gray-700 min-h-[${EDITOR_MIN_HEIGHT}px] h-[${EDITOR_MIN_HEIGHT}px] border border-gray-200 dark:border-gray-600 rounded-md shadow-sm`}
          >
            <style jsx global>{`
              .ql-container {
                height: calc(100% - 42px) !important;
                overflow-y: auto !important;
              }
              .ql-toolbar {
                border-top: none !important;
                border-left: none !important;
                border-right: none !important;
                border-bottom: 1px solid #e5e7eb !important;
                background: #f9fafb !important;
              }
              .dark .ql-toolbar {
                border-bottom: 1px solid #374151 !important;
                background: #1f2937 !important;
              }
              .ql-editor {
                height: 100% !important;
                overflow-y: auto !important;
                color: #111827 !important;
              }
              .dark .ql-editor {
                color: #f9fafb !important;
              }
            `}</style>
            <ReactQuill
              name={field.label}
              value={editorContent}
              onChange={handleEditorChange}
              placeholder="Start typing..."
              className={`h-full ${
                errors[field.value] ? "border-red-500" : ""
              }`}
              modules={quillModules}
            />
          </div>
        );

      case "Subject":
      case "End point":

      case "Name":
        return (
          <input
            type="text"
            name={field.label}
            id={field.value}
            placeholder={field.placeholder}
            maxLength={
              field.value === "action_name" ? MAX_NAME_LENGTH : undefined
            }
            value={
              field.value === "action_name"
                ? formData?.action_name || ""
                : formData?.data?.[field.value] || ""
            }
            className={`w-full rounded-md mt-[.5vw] bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-base overflow-hidden px-[.5vw] shadow-sm py-[.5vw] border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-[#4D55CC] focus:border-transparent ${
              errors[field.value] ? "border-red-500" : ""
            }`}
            onChange={handleChange}
          />
        );

      case "Forward to":
        return (
          <div className="flex items-center space-x-2">
            <PhoneInput
              placeholder="Enter phone number"
              value={phoneNumber}
              onChange={handlePhoneNumberChange}
              defaultCountry="US"
              className="w-full flex px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4D55CC]"
            />
          </div>
        );

      case "API Method":
        return (
          <select
            name={field.label}
            id={field.value}
            value={formData?.data?.api_method || DEFAULT_API_METHOD}
            onChange={handleChange}
            className="mt-1 block flex-1 py-2 px-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#4D55CC] sm:text-sm border border-gray-200 dark:border-gray-600"
          >
            {Object.values(API_METHODS).map((method) => (
              <option key={method.value} value={method.value}>
                {method.value}
              </option>
            ))}
          </select>
        );

      case "HTTP Headers":
        return (
          <>
            {isHTTPActive && (
              <div className="flex flex-col gap-2 bg-white dark:bg-gray-800 rounded-md p-5 border border-gray-200 dark:border-gray-600">
                {formData?.data?.http_headers?.map((pair, index) => (
                  <div
                    key={`http-header-${index}`}
                    className="flex gap-2 items-center justify-between w-full overflow-hidden"
                  >
                    <input
                      type="text"
                      name="key"
                      placeholder="Header Key"
                      value={pair.key || ""}
                      onChange={handleInputChange(index, "http_headers")}
                      className="border border-gray-200 dark:border-gray-600 p-2 rounded-md text-sm shadow-sm w-[45%] bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-[#4D55CC] focus:border-transparent"
                    />
                    <input
                      type="text"
                      name="value"
                      placeholder="Header Value"
                      value={pair.value || ""}
                      onChange={handleInputChange(index, "http_headers")}
                      className="border border-gray-200 dark:border-gray-600 p-2 rounded-md text-sm shadow-sm w-[45%] bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-[#4D55CC] focus:border-transparent"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemovePair(index, "http_headers")}
                      className="text-gray-400 hover:text-red-500 transition-colors duration-200"
                    >
                      X
                    </button>
                  </div>
                ))}

                {(formData?.data?.http_headers ?? []).length <
                  MAX_HTTP_HEADERS_PAIRS && (
                  <button
                    type="button"
                    onClick={() =>
                      handleAddPair(
                        MAX_HTTP_HEADERS_PAIRS,
                        isHTTPActive,
                        "http_headers"
                      )
                    }
                    className="text-[#4D55CC] hover:text-[#211C84] w-full text-start text-sm mr-5 transition-colors duration-200"
                  >
                    + Add Key
                  </button>
                )}
              </div>
            )}
          </>
        );

      case "Request Data": {
        const apiMethod = formData?.data?.api_method;
        const methodConfig = API_METHODS[apiMethod];
        const isDisabled = !methodConfig?.supportsBody;

        return (
          <>
            {isRequestDataActive && (
              <div className="flex flex-col gap-2 w-full justify-start bg-white dark:bg-gray-800 rounded-md p-5 border border-gray-200 dark:border-gray-600">
                {isDisabled ? (
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Request data is not applicable for {apiMethod} method
                  </div>
                ) : formData?.data?.request_data_type === "JSON" ? (
                  <div className="w-full">
                    <textarea
                      value={jsonInput}
                      onChange={(e) => handleJSONInputChange(e.target.value)}
                      placeholder="Enter JSON data..."
                      className="w-full h-[200px] border border-gray-200 dark:border-gray-600 p-2 rounded-md text-sm shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-[#4D55CC] focus:border-transparent font-mono"
                    />
                    {jsonInput && (
                      <div className="mt-2 text-sm flex items-center gap-1">
                        {isJSONValid ? (
                          <span className="text-green-500 flex items-center gap-1">
                            <FaCheckCircle className="text-lg" />
                            Valid JSON
                          </span>
                        ) : (
                          <span className="text-red-500 flex items-center gap-1">
                            <FaTimesCircle className="text-lg" />
                            Invalid JSON
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  <>
                    {formData?.data?.request_data?.map((pair, index) => (
                      <div
                        key={`request-data-${index}`}
                        className="flex gap-2 items-center justify-between w-full overflow-hidden"
                      >
                        <input
                          type="text"
                          name="key"
                          placeholder="Key"
                          value={pair.key || ""}
                          onChange={handleInputChange(index, "request_data")}
                          className="border border-gray-200 dark:border-gray-600 p-2 rounded-md text-sm shadow-sm w-[45%] bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-[#4D55CC] focus:border-transparent"
                        />
                        <input
                          type="text"
                          name="value"
                          placeholder="Value"
                          value={pair.value || ""}
                          onChange={handleInputChange(index, "request_data")}
                          className="border border-gray-200 dark:border-gray-600 p-2 rounded-md text-sm shadow-sm w-[45%] bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-[#4D55CC] focus:border-transparent"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            handleRemovePair(index, "request_data")
                          }
                          className="text-gray-400 hover:text-red-500 transition-colors duration-200"
                        >
                          x
                        </button>
                      </div>
                    ))}

                    {(formData?.data?.request_data ?? []).length <
                      MAX_REQUEST_DATA_PAIRS && (
                      <button
                        type="button"
                        onClick={() =>
                          handleAddPair(
                            MAX_REQUEST_DATA_PAIRS,
                            isRequestDataActive,
                            "request_data"
                          )
                        }
                        className="text-[#4D55CC] hover:text-[#211C84] w-full text-start text-sm transition-colors duration-200"
                      >
                        + Add Key
                      </button>
                    )}
                  </>
                )}
              </div>
            )}
          </>
        );
      }

      case "Request Data Type": {
        const apiMethod = formData?.data?.api_method;
        const methodConfig = API_METHODS[apiMethod];
        const isDisabled = !methodConfig?.supportsBody;

        return (
          <select
            name={field.label}
            id={field.value}
            value={
              formData?.data?.request_data_type || DEFAULT_REQUEST_DATA_TYPE
            }
            onChange={(e) => {
              const newType = e.target.value;
              const currentData = formData?.data?.request_data || [];

              handleChange(e);

              // Convert data between formats instead of resetting
              if (
                newType === "JSON" &&
                formData?.data?.request_data_type === "Form"
              ) {
                // Convert from Form (key-value pairs) to JSON
                if (currentData.length > 0) {
                  const jsonStr = convertKeyValuePairsToJSON(currentData);
                  setJsonInput(jsonStr);
                }
              } else if (
                newType === "Form" &&
                formData?.data?.request_data_type === "JSON"
              ) {
                // Convert from JSON to Form (key-value pairs)
                if (jsonInput) {
                  try {
                    const pairs = convertJSONToKeyValuePairs(jsonInput);
                    setFormData((prev) => ({
                      ...prev,
                      data: {
                        ...prev.data,
                        request_data: pairs,
                      },
                    }));
                  } catch (error) {
                    // If conversion fails, keep the data as is
                  }
                }
              }
            }}
            disabled={isDisabled}
            className={`mt-1 block w-full py-2 px-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#4D55CC] sm:text-sm border border-gray-200 dark:border-gray-600 ${
              isDisabled ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            <option value="JSON">JSON</option>
            <option value="Form">Form</option>
          </select>
        );
      }

      case "List":
        console.log("image url in list", cardFormData?.imageUrl);
        return (
          <div className="w-full">
            {showCardForm && (
              <div
                ref={cardFormRef}
                className="flex gap-6 min-h-[calc(100vh-250px)] overflow-hidden"
              >
                {/* Form Section */}
                <div className="flex-1 p-4 overflow-y-auto">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-base font-semibold text-gray-800 dark:text-gray-100">
                      Edit Card
                    </h3>
                    {/*<button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        setShowCardForm(false);
                        setActiveCardId(null);
                      }}
                      className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    >
                      <FaTimesCircle className="text-lg" />
                    </button>*/}
                  </div>
                  <form className="space-y-8">
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-28 h-28 ${
                          cardFormData?.image
                            ? "!shadow-md"
                            : "border-2 border-dashed"
                        } border-gray-300 dark:border-gray-600 rounded-lg flex items-center justify-center cursor-pointer relative group hover:border-[#4D55CC] shadow-sm transition-colors duration-200`}
                      >
                        {cardFormData.imageUrl ? (
                          typeof cardFormData.imageUrl === "string" &&
                          cardFormData?.imageUrl?.includes("supabase") ? (
                            <img
                              src={cardFormData?.imageUrl}
                              alt={cardFormData.title}
                              className="w-full h-full object-cover"
                            />
                          ) : cardFormData.imageUrl instanceof Blob ? (
                            <img
                              src={URL.createObjectURL(cardFormData?.imageUrl)}
                              alt={cardFormData.title}
                              className="w-full h-full object-cover"
                            />
                          ) : null
                        ) : (
                          <div className="text-center">
                            <FaImage className="text-gray-400 text-xl mx-auto mb-1" />
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              Upload Image
                            </span>
                          </div>
                        )}
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="absolute inset-0 opacity-0 cursor-pointer"
                          required
                        />
                      </div>
                      <div className="flex-1 space-y-3">
                        <div>
                          <div className="flex items-center mb-1">
                            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">
                              Title <span className="text-red-600">*</span>
                            </label>
                            {!cardFormData.title && (
                              <p className="text-red-600 text-xs">required</p>
                            )}
                          </div>
                          <input
                            type="text"
                            placeholder="Enter card title"
                            value={cardFormData.title}
                            onChange={(e) =>
                              setCardFormData((prev) => ({
                                ...prev,
                                title: e.target.value,
                              }))
                            }
                            className={`w-full rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-2 py-1.5 text-sm shadow-sm border ${
                              !cardFormData.title
                                ? "border-red-500"
                                : "border-gray-200 dark:border-gray-600"
                            } focus:ring-2 focus:ring-[#4D55CC] focus:border-transparent`}
                            required
                          />
                        </div>
                        <div>
                          <div className="flex items-center mb-1">
                            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">
                              Description{" "}
                              <span className="text-red-600">*</span>
                            </label>
                            {!cardFormData.description && (
                              <p className="text-red-600 text-xs">required</p>
                            )}
                          </div>
                          <textarea
                            placeholder="Enter card description"
                            value={cardFormData.description}
                            onChange={(e) =>
                              setCardFormData((prev) => ({
                                ...prev,
                                description: e.target.value,
                              }))
                            }
                            className={`w-full max-h-[70px] rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-2 py-1.5 text-sm shadow-sm border ${
                              !cardFormData.description
                                ? "border-red-500"
                                : "border-gray-200 dark:border-gray-600"
                            } focus:ring-2 focus:ring-[#4D55CC] focus:border-transparent`}
                            rows={2}
                            required
                          />
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col gap-3">
                      <div>
                        <div className="flex items-center mb-1">
                          <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">
                            Action <span className="text-red-600">*</span>
                          </label>
                          {!cardFormData.action && (
                            <p className="text-red-600 text-xs">required</p>
                          )}
                        </div>
                        <select
                          value={cardFormData.action}
                          onChange={(e) =>
                            setCardFormData((prev) => ({
                              ...prev,
                              action: e.target.value,
                            }))
                          }
                          className={`w-full rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-2 py-1.5 text-sm shadow-sm border ${
                            !cardFormData.action
                              ? "border-red-500"
                              : "border-gray-200 dark:border-gray-600"
                          } focus:ring-2 focus:ring-[#4D55CC] focus:border-transparent`}
                          required
                        >
                          <option value="">Select Action</option>
                          <option value="link">Open a Link</option>
                          <option value="button">
                            Ask to AI as a question
                          </option>
                        </select>
                      </div>

                      {cardFormData?.action === "link" ? (
                        <>
                          <div>
                            <div className="flex items-center mb-1">
                              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">
                                URL <span className="text-red-600">*</span>
                              </label>
                              {!cardFormData.url && (
                                <p className="text-red-600 text-xs">required</p>
                              )}
                            </div>
                            <input
                              type="url"
                              placeholder="Enter URL"
                              value={cardFormData.url}
                              onChange={(e) =>
                                setCardFormData((prev) => ({
                                  ...prev,
                                  url: e.target.value,
                                }))
                              }
                              className={`w-full rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-2 py-1.5 text-sm shadow-sm border ${
                                !cardFormData.url
                                  ? "border-red-500"
                                  : "border-gray-200 dark:border-gray-600"
                              } focus:ring-2 focus:ring-[#4D55CC] focus:border-transparent`}
                              required
                            />
                          </div>
                          <div>
                            <div className="flex items-center mb-1">
                              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">
                                Link Text{" "}
                                <span className="text-red-600">*</span>
                              </label>
                              {!cardFormData.linkText && (
                                <p className="text-red-600 text-xs">required</p>
                              )}
                            </div>
                            <input
                              type="text"
                              placeholder="Enter link text"
                              value={cardFormData.linkText}
                              onChange={(e) =>
                                setCardFormData((prev) => ({
                                  ...prev,
                                  linkText: e.target.value,
                                }))
                              }
                              className={`w-full rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-2 py-1.5 text-sm  shadow-sm border ${
                                !cardFormData.linkText
                                  ? "border-red-500"
                                  : "border-gray-200 dark:border-gray-600"
                              } focus:ring-2 focus:ring-[#4D55CC] focus:border-transparent`}
                              required
                            />
                          </div>
                        </>
                      ) : (
                        <></>
                      )}
                    </div>
                  </form>
                </div>

                {/* Preview Section */}
                <div className="w-64 flex-shrink-0 flex flex-col p-4">
                  <div className="flex-1">
                    <h4 className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Live Preview
                    </h4>
                    <div className="flex flex-col justify-between bg-white dark:bg-gray-800 rounded-lg shadow-sm p-2 w-56 h-[280px] max-h-[280px]">
                      <div className="flex flex-col gap-2">
                        <div className="w-full h-28 rounded-lg mb-1.5 overflow-hidden bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                          {cardFormData.imageUrl ? (
                            typeof cardFormData.imageUrl === "string" &&
                            cardFormData?.imageUrl?.includes("supabase") ? (
                              <img
                                src={cardFormData?.imageUrl}
                                alt={cardFormData.title}
                                className="w-full h-full object-cover"
                              />
                            ) : cardFormData.imageUrl instanceof Blob ? (
                              <img
                                src={URL.createObjectURL(
                                  cardFormData?.imageUrl
                                )}
                                alt={cardFormData.title}
                                className="w-full h-full object-cover"
                              />
                            ) : null
                          ) : (
                            <div className="flex flex-col items-center gap-1">
                              <FaImage className="text-gray-400 text-lg" />
                              <span className="text-sm text-gray-500 dark:text-gray-400">
                                No Image
                              </span>
                            </div>
                          )}
                        </div>
                        <h4 className="font-semibold mb-0.5 text-gray-800 dark:text-gray-100 text-sm">
                          {cardFormData.title || "Card Title"}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-1.5 line-clamp-2">
                          {cardFormData.description ||
                            "Card description will appear here..."}
                        </p>
                      </div>
                      {cardFormData?.linkText || cardFormData?.url ? (
                        <div className="w-full text-center pt-1.5 border-t border-gray-100 dark:border-gray-700">
                          <span className="text-base text-center font-medium text-[#4D55CC] hover:text-[#3D45B8] transition-colors duration-200 p-5">
                            {cardFormData.linkText
                              ? cardFormData?.linkText
                              : cardFormData?.url}
                          </span>
                        </div>
                      ) : (
                        <></>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        setShowCardForm(false);
                        setActiveCardId(null);
                      }}
                      className="px-3 py-1.5 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors duration-200"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleCardFormSubmit}
                      disabled={
                        !cardFormData.image ||
                        !cardFormData.title ||
                        !cardFormData.description ||
                        !cardFormData.action ||
                        !cardFormData.url ||
                        !cardFormData.linkText
                      }
                      className={`px-3 py-1.5 text-sm rounded-md transition-colors duration-200 ${
                        !cardFormData.image ||
                        !cardFormData.title ||
                        !cardFormData.description ||
                        !cardFormData.action ||
                        !cardFormData.url ||
                        !cardFormData.linkText
                          ? "bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                          : "bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#13104A]/95 via-[#2D3377]/90 via-[#18103A]/85 via-[#211A55]/80 to-[#13104A]/95 backdrop-blur-sm hover:opacity-90 text-white"
                      }`}
                    >
                      Save Card
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="flex gap-3 overflow-x-auto pb-2 px-3 min-h-[300px] items-center scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent">
              {items.map((card) => (
                <div
                  key={card.id}
                  className={`flex-none w-48 h-[240px] max-h-[240px] bg-white dark:bg-gray-800 rounded-lg shadow-md p-2.5 cursor-pointer relative group hover:scale-105 transition-all duration-200 ${
                    activeCardId === card.id
                      ? "ring-2 ring-[#4D55CC] ring-offset-1"
                      : ""
                  }`}
                  onClick={() => handleCardClick(card.id)}
                >
                  {activeCardId !== card.id && (
                    <div className="absolute z-50 top-1.5 right-1.5 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCardClick(card.id);
                        }}
                        className="p-1.5 bg-gray-100 dark:bg-gray-700 rounded-md shadow-sm hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors duration-200"
                      >
                        <FaEdit className="text-[#4D55CC] text-md" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setItems((prev) => {
                            const newItems = prev.filter(
                              (c) => c.id !== card.id
                            );
                            // Update formData with new items
                            setFormData((prevForm) => ({
                              ...prevForm,
                              data: {
                                ...prevForm.data,
                                items: newItems,
                              },
                            }));
                            return newItems;
                          });
                        }}
                        className="p-1.5 bg-gray-100 dark:bg-gray-700 rounded-md shadow-sm hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors duration-200"
                      >
                        <RiDeleteBin6Fill className="text-red-500 text-md" />
                      </button>
                    </div>
                  )}
                  {card.isPlaceholder ? (
                    <div className="relative">
                      <div className="w-full h-28 rounded-lg mb-1.5 overflow-hidden bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                        {card.imageUrl ? (
                          typeof card.imageUrl === "string" &&
                          card?.imageUrl?.includes("supabase") ? (
                            <img
                              src={card?.imageUrl}
                              alt={card.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <img
                              src={URL.createObjectURL(card?.imageUrl)}
                              alt={card.title}
                              className="w-full h-full object-cover"
                            />
                          )
                        ) : (
                          <div className="flex flex-col items-center gap-1">
                            <FaImage className="text-gray-400 text-lg" />
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                              No Image
                            </span>
                          </div>
                        )}
                      </div>
                      <h4 className="font-semibold mb-0.5 text-gray-800 dark:text-gray-100 text-sm">
                        {card.title}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-1.5 line-clamp-2">
                        {card.description}
                      </p>

                      {card.linkText && (
                        <div className="pt-1.5 border-t border-gray-100 dark:border-gray-700">
                          <span className="text-lg font-medium text-[#4D55CC] hover:text-[#3D45B8] transition-colors duration-200">
                            {card.linkText}
                          </span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <>
                      <div className="w-full h-28 rounded-lg mb-1.5 overflow-hidden bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                        {card.imageUrl ? (
                          typeof card.imageUrl === "string" &&
                          card?.imageUrl?.includes("supabase") ? (
                            <img
                              src={card.imageUrl}
                              alt={card.title}
                              className="w-full h-full object-cover"
                            />
                          ) : card.imageUrl instanceof Blob ? (
                            <img
                              src={URL?.createObjectURL(card?.imageUrl)}
                              alt={card.title}
                              className="w-full h-full object-cover"
                            />
                          ) : null
                        ) : (
                          <div className="flex flex-col items-center gap-1">
                            <FaImage className="text-gray-400 text-lg" />
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                              No Image
                            </span>
                          </div>
                        )}
                      </div>
                      <h4 className="font-semibold mb-0.5 text-gray-800 dark:text-gray-100 text-sm">
                        {card.title}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-1.5 line-clamp-2">
                        {card.description}
                      </p>

                      {card.linkText && (
                        <div className="pt-1.5 border-t border-gray-100 dark:border-gray-700">
                          <span className="text-lg font-medium text-[#4D55CC] hover:text-[#3D45B8] transition-colors duration-200">
                            {card.linkText}
                          </span>
                        </div>
                      )}
                      {activeCardId === card.id && (
                        <div className="absolute top-1.5 right-1.5">
                          <div className="bg-[#4D55CC] text-white text-[10px] px-1.5 py-0.5 rounded-full">
                            Editing
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              ))}
              {items.length < MAX_ITEMS && (
                <div
                  className="flex-none w-48 h-[240px] max-h-[240px] border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg flex items-center justify-center cursor-pointer hover:border-[#4D55CC] hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all duration-200"
                  onClick={handleAddCard}
                >
                  <div className="flex flex-col items-center gap-1.5">
                    <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                      <FaPlus className="text-gray-400 text-sm" />
                    </div>
                    <span className="text-[10px] text-gray-500 dark:text-gray-400">
                      Add Card
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        );

      case "Video": {
        const getVideoEmbedUrl = (url) => {
          // YouTube
          if (url.includes("youtube.com") || url.includes("youtu.be")) {
            const videoId = url.includes("youtu.be")
              ? url.split("youtu.be/")[1]?.split("?")[0]
              : url.split("v=")[1]?.split("&")[0];
            return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
          }

          // Dailymotion
          if (url.includes("dailymotion.com")) {
            const videoId = url.split("/video/")[1]?.split("?")[0];
            return videoId
              ? `https://www.dailymotion.com/embed/video/${videoId}`
              : null;
          }

          // Vimeo
          if (url.includes("vimeo.com")) {
            const videoId = url.split("vimeo.com/")[1]?.split("?")[0];
            return videoId ? `https://player.vimeo.com/video/${videoId}` : null;
          }

          // Loom
          if (url.includes("loom.com")) {
            const videoId = url.split("loom.com/")[1]?.split("?")[0];
            return videoId ? `https://www.loom.com/embed/${videoId}` : null;
          }

          return null;
        };

        const isEmbeddableUrl = (url) => {
          return (
            url.includes("youtube.com") ||
            url.includes("youtu.be") ||
            url.includes("dailymotion.com") ||
            url.includes("vimeo.com") ||
            url.includes("loom.com")
          );
        };

        const validateVideoUrl = (url) => {
          if (!url) return "Video URL is required";
          if (!isEmbeddableUrl(url)) {
            return "Please enter a valid URL from YouTube, Vimeo, Loom, or Dailymotion";
          }
          return "";
        };

        const handleVideoUrlChange = (e) => {
          const url = e.target.value;
          const error = validateVideoUrl(url);
          setErrors((prev) => ({
            ...prev,
            [field.value]: error,
          }));

          setFormData((prev) => ({
            ...prev,
            data: {
              ...prev.data,
              video: url,
            },
          }));
        };

        const handleVideoUrlSubmit = (e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            const url = formData?.data?.video || "";
            const error = validateVideoUrl(url);
            if (!error) {
              setFormData((prev) => ({
                ...prev,
                data: {
                  ...prev.data,
                  video: url,
                },
              }));
            }
          }
        };

        const videoUrl = formData?.data?.video || "";
        const embedUrl = isEmbeddableUrl(videoUrl)
          ? getVideoEmbedUrl(videoUrl)
          : null;

        return (
          <div className="w-full space-y-4">
            <input
              type="url"
              name={field.label}
              id={field.value}
              placeholder="Enter video URL (YouTube, Vimeo, Loom, or Dailymotion)"
              value={videoUrl}
              className={`w-full rounded-md mt-[.5vw] bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-base overflow-hidden px-[.5vw] shadow-sm py-[.5vw] border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-[#4D55CC] focus:border-transparent ${
                errors[field.value] ? "border-red-500" : ""
              }`}
              onChange={handleVideoUrlChange}
              onKeyDown={handleVideoUrlSubmit}
            />
            {errors[field.value] && (
              <p className="text-red-500 text-xs mt-1">{errors[field.value]}</p>
            )}

            {videoUrl && !errors[field.value] && (
              <div className="w-[80%] aspect-video rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
                {isEmbeddableUrl(videoUrl) ? (
                  <iframe
                    src={embedUrl}
                    title="Video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                  ></iframe>
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-red-500">
                    Invalid video URL
                  </div>
                )}
              </div>
            )}
          </div>
        );
      }

      default:
        return null;
    }
  };

  // Booking appointment fields
  const renderBookingAppointmentFields = () => {
    if (selectedAction?.name !== "Booking appointment") return null;

    return (
      <>
        <div className="flex items-center gap-2 mt-4">
          <label htmlFor="calendar" className="font-medium">
            Calendar
          </label>
          <select
            name="calendar"
            id="calendar"
            value={selectedCalendarValue || ""}
            onChange={handleCalendarChange}
            className="mt-1 block flex-1 py-2 px-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-md shadow-sm focus:outline-none sm:text-sm mx-5 border border-gray-200 dark:border-gray-600"
          >
            <option value="">Select a calendar</option>
            <option value="Google Calendar">Google Calendar</option>
            <option value="Calendly">Calendly</option>
          </select>
        </div>

        {selectedCalendarValue === "Calendly" ? (
          <div className="mt-4 text-blue-600 font-medium">
            You have selected Calendly
          </div>
        ) : (
          selectedCalendarValue === "Google Calendar" && (
            <>
              <div className="mt-4 flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-800 p-6 rounded-lg">
                <label className="cursor-pointer bg-[#702963] hover:bg-[#702963]/90 text-white text-sm font-semibold py-2 px-4 rounded-lg shadow-lg transition-all duration-200">
                  Upload JSON File
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleFileChange}
                    className="hidden"
                    ref={fileInputRef}
                  />
                </label>

                {fileName && (
                  <div className="mt-4 font-medium border p-2 bg-white dark:bg-gray-700 rounded-lg flex gap-2 items-center">
                    {fileName.name?.length < 35 ? (
                      <span className="font-semibold text-sm">
                        {fileName.name}
                      </span>
                    ) : (
                      <div className="group relative inline-block">
                        <span className="absolute bg-gray-400 top-[-35px] left-0 rounded-lg px-2 py-1 text-xs shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 inline-block min-w-max z-10">
                          {fileName.name}
                        </span>
                        <span className="font-semibold text-sm block max-w-[200px] truncate">
                          {fileName.name.slice(0, 35)}...
                        </span>
                      </div>
                    )}
                    <button
                      type="button"
                      className="ml-[1vw] bg-red-500 hover:bg-red-600 text-white text-sm px-2 py-1 rounded transition-colors duration-200"
                      onClick={handleDeleteFile}
                    >
                      delete
                    </button>
                  </div>
                )}
              </div>

              <div className="mt-4 flex items-center gap-2">
                <label
                  htmlFor="calendarId"
                  className="font-medium text-sm mb-1"
                >
                  Choose Calendar ID
                </label>
                <select
                  name="id"
                  id="calendarId"
                  className="w-4/6 py-2 px-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-md shadow-sm focus:outline-none sm:text-sm mx-4 border border-gray-200 dark:border-gray-600"
                >
                  <option value="">Select an ID</option>
                  <option value="id1">ID 1</option>
                  <option value="id2">ID 2</option>
                </select>
              </div>
            </>
          )
        )}
      </>
    );
  };

  return (
    <div className="h-[85vh] scrollbar p-[1vw] pr-[1.8vw] mr-[-1vw] flex flex-col justify-between">
      <h2 className="text-xl font-semibold mb-[1vw]">Action Form</h2>

      <form
        onSubmit={handleSubmit}
        className={`${
          showCardForm ? "overflow-hidden" : "overflow-y-auto"
        } pr-2`}
        style={{ height: "calc(90vh - 160px)" }}
      >
        {/* Action Type Section */}
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-5 mb-8 shadow-sm">
          <div>
            <label
              htmlFor="action-type"
              className="block text-sm font-medium text-gray-700 dark:text-gray-200"
            >
              Action Type
            </label>
            <select
              id="action-type"
              value={selectedAction?.id}
              onChange={handleActionChange}
              className="mt-1 block w-full py-2 px-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#4D55CC] sm:text-sm border border-gray-200 dark:border-gray-600"
            >
              {actions.map((action) => (
                <option key={action.id} value={action.id}>
                  {action.name}
                </option>
              ))}
            </select>
          </div>

          {/* Primary fields (Name & Instructions) */}
          {selectedAction?.fields.slice(0, 2).map((field) => (
            <div key={`primary-${field.value}`} className="mt-4">
              <label
                htmlFor={field.label}
                className="block mt-[1vw] text-sm font-medium text-gray-700 dark:text-gray-200"
              >
                {field.label}
                {field.required && <span className="text-red-500 ml-1">*</span>}
              </label>
              {renderField(field)}
              {errors[field.value] && (
                <p className="text-red-500 text-xs mt-1">
                  {errors[field.value]}
                </p>
              )}
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="w-full flex justify-center">
          <div className="bg-gray-200 dark:bg-gray-700 h-[1px] w-[90%]" />
        </div>

        {/* Secondary fields */}
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-5 mt-8 shadow-sm">
          {selectedAction?.fields.slice(2).map((field) => (
            <div
              key={`secondary-${field.value}`}
              className={`${
                field.label === "API Method" ? "flex gap-5 items-center" : ""
              } mt-4`}
            >
              <div
                className={`${
                  field.label === "HTTP Headers" ||
                  field.label === "Request Data"
                    ? "flex w-full justify-between items-center mb-3"
                    : ""
                }`}
              >
                <label
                  htmlFor={field.label}
                  className={`${
                    field.label === "API Method" ? "flex" : "block mt-1"
                  } text-sm font-medium text-gray-700 dark:text-gray-200`}
                >
                  {field.label}
                  {field.required && (
                    <span className="text-red-500 ml-1">*</span>
                  )}
                </label>

                {/* Toggle switches for HTTP Headers and Request Data */}
                {field.label === "HTTP Headers" && (
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isHTTPActive}
                      onChange={() => setIsHTTPActive(!isHTTPActive)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 dark:bg-gray-700 peer-focus:ring-2 peer-focus:ring-[#4D55CC] rounded-full peer peer-checked:after:translate-x-5 peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#4D55CC]"></div>
                  </label>
                )}

                {field.label === "Request Data" && (
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isRequestDataActive}
                      onChange={() =>
                        setIsRequestDataActive(!isRequestDataActive)
                      }
                      disabled={
                        !API_METHODS[formData?.data?.api_method]?.supportsBody
                      }
                      className="sr-only peer"
                    />
                    <div
                      className={`w-11 h-6 bg-gray-200 dark:bg-gray-700 peer-focus:ring-2 peer-focus:ring-[#4D55CC] rounded-full peer peer-checked:after:translate-x-5 peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#4D55CC] ${
                        !API_METHODS[formData?.data?.api_method]?.supportsBody
                          ? "opacity-50 cursor-not-allowed"
                          : ""
                      }`}
                    ></div>
                  </label>
                )}
              </div>

              {renderField(field)}
              {errors[field.value] && (
                <p className="text-red-500 text-xs mt-1">
                  {errors[field.value]}
                </p>
              )}
            </div>
          ))}

          {/* Booking appointment specific fields */}
          {renderBookingAppointmentFields()}
        </div>

        {/* Required Parameters */}
        <div>
          <RequiredParam
            parameterData={parameterData}
            setParameterData={setParameterData}
            formSubmitted={formSubmitted}
            actionType={selectedAction?.name}
          />
        </div>
      </form>

      {/* Action buttons */}
      <div className="flex items-center justify-between mt-[15px] gap-4">
        <button
          onClick={toggle}
          type="button"
          className="px-6 py-2.5 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4D55CC] transition-all duration-200 font-medium shadow-sm"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          type="submit"
          disabled={initialData && !isFormChanged}
          className={`${
            initialData && !isFormChanged
              ? "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
              : "bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#13104A]/95 via-[#2D3377]/90 via-[#18103A]/85 via-[#211A55]/80 to-[#13104A]/95 backdrop-blur-sm hover:opacity-90 text-white"
          } px-6 py-2.5 rounded-lg shadow-sm transition-all duration-200 font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4D55CC]`}
        >
          {initialData ? "Update Action" : "Create New Action"}
        </button>
      </div>
    </div>
  );
}

export default ActionForm;
