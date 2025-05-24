"use client";

import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { upsertAction } from "@/store/reducers/phoneAgentSlice";
import dynamic from "next/dynamic";
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import { v4 as uuidv4 } from "uuid";
import { OutlinedButton } from "../buttons/OutlinedButton";
import { ContainedButton } from "../buttons/ContainedButton";
import { cloneDeep } from "lodash";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import RequiredParam from "@/Components/RequiredParam";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";

const name = {
  label: "Name",
  value: "action_name",
  placeholder: "Enter the name",
};

const subject = {
  label: "Subject",
  value: "subject",
  placeholder: "Enter the subject",
};

const instructions = {
  label: "Instructions",
  value: "instructions",
  placeholder: "Tell your agent when this action should be triggered.",
};

const content = {
  label: "Content",
  value: "content",
  placeholder: "Provide the main content or body of the email.",
};

const forwardTo = {
  label: "Forward to",
  value: "forward_to",
  placeholder: "Tell your agent where to forward your call.",
};

const apiMethod = {
  label: "API Method",
  value: "api_method",
  placeholder: "Method",
};
const endPoint = {
  label: "End point",
  value: "end_point",
  placeholder: "Enter Endpoint",
};
const httpHeaders = {
  label: "HTTP Headers",
  value: "http_headers",
  //placeholder: "Enter a url",
};
const requestData = {
  label: "Request Data",
  value: "request_data",
  //placeholder: "Enter a url",
};
const requestDataType = {
  label: "Request Data Type",
  value: "request_data_type",
  //placeholder: "Enter a url",
};

const chatActions = [
  {
    id: 1,
    name: "Send email",
    fields: [name, instructions, subject, content],
  },
  {
    id: 3,
    name: "Web hooks",
    fields: [
      name,
      instructions,
      apiMethod,
      endPoint,
      httpHeaders,
      requestDataType,
      requestData,
    ],
  },
  {
    id: 4,
    name: "Booking appointment",
    fields: [name, instructions],
  },
];
const phoneActions = [
  {
    id: 1,
    name: "Send email",
    fields: [name, instructions, subject, content],
  },
  {
    id: 2,
    name: "Call Forwarding",
    fields: [name, instructions, forwardTo],
  },
  {
    id: 3,
    name: "Web hooks",
    fields: [
      name,
      instructions,
      apiMethod,
      endPoint,
      httpHeaders,
      requestDataType,
      requestData,
    ],
  },
  {
    id: 4,
    name: "Booking appointment",
    fields: [name, instructions],
  },
];

// Mapping fields to help text
const fieldHelpText = {
  Name: "Enter the name",
  Instructions: "Tell your agent when this action should be triggered.",
  Subject: "Enter the subject",
  "Forward To": "Tell your agent where to forward your call.",
  Content: "Provide the main content or body of the email.",
  "End point": "Enter a url",
};

function ActionForm({
  show,
  toggle,
  initialData,
  handleCreateAction,
  forPhoneActions,
}) {
  console.log(forPhoneActions);

  const dispatch = useDispatch();
  const [selectedAction, setSelectedAction] = useState(
    forPhoneActions ? phoneActions[0] : chatActions[0]
  );
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [parameterData, setParameterData] = useState([]);
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [editorContent, setEditorContent] = useState(
    formData?.data?.content || ""
  ); // State for Quill editor
  const [isFormChanged, setIsFormChanged] = useState(false);
  const [initialFormState, setInitialFormState] = useState(null);

  const [isHTTPActive, setIsHTTPActive] = useState(false);
  const [selectedCalenderValue, setSelectedCalenderValue] = useState(null);
  const [isRequestDataActive, setIsRequestDataActive] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState(formData?.data?.forward_to);
  const [fileName, setFileName] = useState("");
  const fileInputRef = useRef(null);
  useEffect(() => {
    setParameterData(initialData?.required_params || []);
  }, []);

  useEffect(() => {
    if (formData?.data?.forward_to) {
      setPhoneNumber(formData?.data?.forward_to);
    }
  }, [formData?.data?.forward_to]);

  const handleCalenderChange = (e) => {
    setSelectedCalenderValue(e.target.value);
  };
  const handleDeleteFile = () => {
    setFileName("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    console.log(file);

    if (file && file.name.endsWith(".json")) {
      setFileName(file);
    } else {
      alert("Please upload a valid .json file.");
      setFileName("");
    }
  };
  const handlePhoneNumberChange = (phone) => {
    setPhoneNumber(phone || "");
    setFormData((prev) => ({
      ...prev,
      data: {
        ...prev.data,
        forward_to: phone || "",
      },
    }));
  };

  const maxRequestDataPairs = 15;
  const maxHttpHeadersPairs = 10;

  const handleAddPair = (maxLimit, isActive, fieldName) => {
    if (!isActive) return;

    setFormData((prev) => {
      const newData = prev.data ? { ...prev.data } : {};
      const existingData = newData[fieldName] ?? [];
      if (existingData.length >= maxLimit) return prev;

      const updatedData = [...existingData, { key: "", value: "" }];

      return {
        ...prev,
        data: {
          ...prev.data,
          [fieldName]: updatedData,
        },
      };
    });

    if (fieldName === "request_data") {
      setIsRequestDataActive(true);
    } else if (fieldName === "http_headers") {
      setIsHTTPActive(true);
    }
  };

  const handleInputChange = (index, fieldName) => (e) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      const existingData = prev.data[fieldName] || [];
      const updatedData = existingData.map((pair, i) =>
        i === index ? { ...pair, [name]: value } : pair
      );

      return {
        ...prev,
        data: { ...prev.data, [fieldName]: updatedData },
      };
    });
  };

  const handleRemovePair = (index, fieldName) => {
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
  };

  useEffect(() => {
    if (!isRequestDataActive) {
      setFormData((prev) => {
        const newData = { ...prev.data };
        delete newData.request_data;
        return { ...prev, data: newData };
      });
    }
  }, [isRequestDataActive]);

  useEffect(() => {
    if (!isHTTPActive) {
      setFormData((prev) => {
        const newData = { ...prev.data };
        delete newData.http_headers;
        return { ...prev, data: newData };
      });
    }
  }, [isHTTPActive]);

  useEffect(() => {
    if (!formData?.data) return;

    const hasValidRequestData = (formData.data.request_data ?? []).some(
      (pair) => pair.key.trim() !== "" && pair.value.trim() !== ""
    );

    const hasValidHttpHeaders = (formData.data.http_headers ?? []).some(
      (pair) => pair.key.trim() !== "" && pair.value.trim() !== ""
    );

    // Only update state if it is not already true
    if (!isRequestDataActive && hasValidRequestData)
      setIsRequestDataActive(true);
    if (!isHTTPActive && hasValidHttpHeaders) setIsHTTPActive(true);
  }, [formData?.data?.request_data, formData?.data?.http_headers]);

  useEffect(() => {
    console.log(formData);
  }, [formData]);

  useEffect(() => {
    console.log("selected action check", selectedAction);
  }, [selectedAction]);

  function toSnakeCase(input) {
    return input.toLowerCase().trim().replace(/\s+/g, "_");
  }

  useEffect(() => {
    if (initialData) {
      console.log("initial data", initialData);
      // Find the matching action type
      const actionType = forPhoneActions
        ? phoneActions.find(
            (action) => action.name.toLowerCase() === initialData.action_type.replace(/_/g, ' ')
          )
        : chatActions.find(
            (action) => action.name.toLowerCase() === initialData.action_type.replace(/_/g, ' ')
          );

      if (actionType) {
        setSelectedAction(actionType);
      }

      // Set form data with all fields
      const initialFormData = {
        action_name: initialData.action_name || '',
        instructions: initialData.instructions || '',
        data: {
          ...initialData.data,
          content: initialData.data?.content || '',
          subject: initialData.data?.subject || '',
          forward_to: initialData.data?.forward_to || '',
          api_method: initialData.data?.api_method || 'GET',
          end_point: initialData.data?.end_point || '',
          http_headers: initialData.data?.http_headers || [],
          request_data: initialData.data?.request_data || [],
          request_data_type: initialData.data?.request_data_type || 'JSON'
        }
      };

      setFormData(initialFormData);
      setEditorContent(initialData.data?.content || '');
      setInitialFormState({
        formData: initialFormData,
        editorContent: initialData.data?.content || '',
        selectedAction: actionType,
        parameterData: initialData.required_params || []
      });
      
      // Set HTTP headers and request data states
      if (initialData.data?.http_headers?.length > 0) {
        setIsHTTPActive(true);
      }
      if (initialData.data?.request_data?.length > 0) {
        setIsRequestDataActive(true);
      }
    } else {
      setSelectedAction(forPhoneActions ? phoneActions[0] : chatActions[0]);
      setFormData({
        data: {
          api_method: 'GET',
          request_data_type: 'JSON'
        }
      });
      setEditorContent('');
      setIsHTTPActive(false);
      setIsRequestDataActive(false);
      setInitialFormState(null);
    }
  }, [initialData, forPhoneActions]);

  // Add effect to track form changes
  useEffect(() => {
    if (!initialFormState) {
      setIsFormChanged(true);
      return;
    }

    const hasFormChanged = () => {
      // Check if action type changed
      if (selectedAction.name.toLowerCase() !== initialFormState.selectedAction.name.toLowerCase()) {
        return true;
      }

      // Check if basic fields changed
      if (formData.action_name !== initialFormState.formData.action_name ||
          formData.instructions !== initialFormState.formData.instructions) {
        return true;
      }

      // Check if data fields changed
      const initialDataFields = initialFormState.formData.data || {};
      const currentDataFields = formData.data || {};

      // Check content
      if (editorContent !== initialFormState.editorContent) {
        return true;
      }

      // Check other fields
      const fieldsToCheck = ['subject', 'forward_to', 'api_method', 'end_point', 'request_data_type'];
      for (const field of fieldsToCheck) {
        if (currentDataFields[field] !== initialDataFields[field]) {
          return true;
        }
      }

      // Check arrays
      if (JSON.stringify(currentDataFields.http_headers) !== JSON.stringify(initialDataFields.http_headers) ||
          JSON.stringify(currentDataFields.request_data) !== JSON.stringify(initialDataFields.request_data)) {
        return true;
      }

      // Check parameters
      if (JSON.stringify(parameterData) !== JSON.stringify(initialFormState.parameterData)) {
        return true;
      }

      return false;
    };

    setIsFormChanged(hasFormChanged());
  }, [formData, editorContent, selectedAction, parameterData, initialFormState]);

  useEffect(() => {
    console.log(formData);

    setFormData((prev) => ({
      ...prev,
      required_params: parameterData,
    }));
  }, [parameterData]);

  const handleActionChange = (e) => {
    const actionId = parseInt(e.target.value);
    console.log(actionId);

    const action = forPhoneActions
      ? phoneActions.find((action) => action.id === actionId)
      : chatActions.find((action) => action.id === actionId);

    setSelectedAction(action);
    setFormData({});
    setErrors({});
    setEditorContent(""); // Reset editor content on action change
    setSelectedCalenderValue("");
  };

  const handleChange = (e, _id, val) => {
    let id = _id;
    let value = val;

    if (!_id) {
      id = e.target.id;
      value = e.target.value;
      e.target.style.height = "auto"; // Reset height
      e.target.style.height = `${e.target.scrollHeight}px`; // Set new height
    }
    console.log(formData);

    const newData = cloneDeep(formData);
    const data = {};
    console.log(newData);

    if (id === "action_name") {
      newData["action_name"] = value;
    } else if (id === "instructions") {
      newData["instructions"] = value;
    } else {
      data[id] = value;
    }

    if (Object.keys(data).length) {
      newData["data"] = { ...newData?.data, ...data };
    }

    setFormData(newData);
    setErrors([]);
  };

  const handleEditorChange = (content) => {
    setEditorContent(content);
    handleChange(null, "content", content);
  };

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const editorElement = document.querySelector(".ql-editor");
    if (editorElement) {
      editorElement.style.height = "auto"; // Reset height
      editorElement.style.height = `${editorElement.scrollHeight}px`; // Set height based on content
    }
  }, [editorContent]);

  const validateForm = () => {
    const newErrors = {};

    selectedAction.fields.forEach((field) => {
      console.log("Validating field:", field);
      let isExist =
        Boolean(formData?.[field.value]) ||
        Boolean(formData?.data?.[field.value]);

      if (field.value === "http_headers") {
        isExist =
          !isHTTPActive ||
          (Array.isArray(formData?.data?.http_headers) &&
            formData.data.http_headers.some(
              (pair) => pair.key?.trim() !== "" && pair.value?.trim() !== ""
            ));
      }

      if (field.value === "request_data") {
        isExist =
          !isRequestDataActive ||
          (Array.isArray(formData?.data?.request_data) &&
            formData.data.request_data.some(
              (pair) => pair.key?.trim() !== "" && pair.value?.trim() !== ""
            ));
      }

      if (!isRequestDataActive && field.value === "request_data_type") {
        isExist = true;
      }

      console.log("Final isExist:", isExist);

      // Set error if field is required but missing
      if (!isExist) {
        newErrors[field.value] = "This field is required.";
      }
    });

    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormSubmitted(true);
    const allValid = parameterData.every(
      (param) => param.key.trim() && param.description.trim()
    );

    if (!allValid) {
      console.log("Validation failed!");
      return;
    }
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    let actionData;
    if (initialData) {
      actionData = {
        id: initialData.id,
        action_type: toSnakeCase(selectedAction.name),
        ...formData,
      };
    } else {
      actionData = {
        id: uuidv4(),
        action_type: toSnakeCase(selectedAction.name),
        ...formData,
      };
    }

    handleCreateAction(actionData);
    toggle();
    setFormData({});
    setErrors({});
    setEditorContent("");
  };

  // Add this useEffect after the other useEffects
  useEffect(() => {
    // Handle initial state and API method changes
    if (formData?.data?.api_method === "GET" || formData?.data?.api_method === "DELETE") {
      // Disable request data for GET and DELETE
      setIsRequestDataActive(false);
      // Clear request data
      setFormData(prev => ({
        ...prev,
        data: {
          ...prev.data,
          request_data: [],
          request_data_json: ""
        }
      }));
    } else {
      // For POST, PUT, PATCH, set default request data type to JSON if not set
      if (!formData?.data?.request_data_type) {
        setFormData(prev => ({
          ...prev,
          data: {
            ...prev.data,
            request_data_type: "JSON"
          }
        }));
      }
    }
  }, [formData?.data?.api_method]);

  // Add this useEffect to handle request data type changes
  useEffect(() => {
    if (formData?.data?.request_data_type === "JSON") {
      // Clear form data when switching to JSON
      setFormData(prev => ({
        ...prev,
        data: {
          ...prev.data,
          request_data: [],
          request_data_json: ""
        }
      }));
    } else if (formData?.data?.request_data_type === "Form") {
      // Clear JSON data when switching to Form
      setFormData(prev => ({
        ...prev,
        data: {
          ...prev.data,
          request_data_json: ""
        }
      }));
    }
  }, [formData?.data?.request_data_type]);

  if (typeof window === "undefined") {
    return <></>;
  }

  const GetField = (field) => {
    switch (field.label) {
      case "Instructions": {
        return (
          <textarea
            name={field.label}
            id={field.value}
            placeholder={field.placeholder}
            value={formData?.instructions || ""}
            className={`w-full h-[200px] rounded-md mt-[.5vw] text-base overflow-hidden resize-none shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-[.5vw] py-[.5vw] border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-[#4D55CC] focus:border-transparent ${
              errors[field.value] ? "border-red-500" : ""
            }`}
            onChange={handleChange}
          />
        );
      }

      case "Content": {
        return (
          <div className="mt-2 bg-white dark:bg-gray-700 min-h-[200px] h-[200px] border border-gray-200 dark:border-gray-600 rounded-md shadow-sm">
            <style jsx global>{`
              .ql-container {
                height: calc(100% - 42px) !important;
                overflow-y: auto !important;
              }
              .ql-toolbar {
                border-top: none !important;
                border-left: none !important;
                border-right: none !important;
                border-bottom: 1px solid #E5E7EB !important;
                background: #F9FAFB !important;
              }
              .dark .ql-toolbar {
                border-bottom: 1px solid #374151 !important;
                background: #1F2937 !important;
              }
              .ql-editor {
                height: 100% !important;
                overflow-y: auto !important;
                color: #111827 !important;
              }
              .dark .ql-editor {
                color: #F9FAFB !important;
              }
            `}</style>
            <ReactQuill
              name={field.label}
              value={editorContent}
              onChange={handleEditorChange}
              placeholder="Start typing..."
              className={`h-full ${errors[field.value] ? "border-red-500" : ""}`}
              modules={{
                toolbar: [
                  ['bold', 'italic', 'underline'],
                  [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                  ['clean']
                ]
              }}
            />
          </div>
        );
      }

      case "Subject": {
        return (
          <input
            type="text"
            name={field.label}
            id={field.value}
            placeholder={field.placeholder}
            value={formData?.data?.subject || ""}
            className={`w-full rounded-md mt-[.5vw] bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-base overflow-hidden px-[.5vw] shadow-sm py-[.5vw] border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-[#4D55CC] focus:border-transparent ${
              errors[field.value] ? "border-red-500" : ""
            }`}
            onChange={handleChange}
          />
        );
      }

      case "Forward to": {
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
      }

      case "API Method": {
        return (
          <select
            name={field.label}
            id={field.value}
            value={formData?.data?.api_method || "GET"}
            onChange={handleChange}
            className="mt-1 block flex-1 py-2 px-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#4D55CC] sm:text-sm border border-gray-200 dark:border-gray-600"
          >
            <option value="GET">GET</option>
            <option value="POST">POST</option>
            <option value="PATCH">PATCH</option>
            <option value="PUT">PUT</option>
            <option value="DELETE">DELETE</option>
          </select>
        );
      }

      case "End point": {
        return (
          <input
            type="text"
            name={field.label}
            id={field.value}
            placeholder={field.placeholder}
            value={formData?.data?.end_point || ""}
            className={`w-full rounded-md mt-[.5vw] bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-base overflow-hidden px-[.5vw] shadow-sm py-[.5vw] border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-[#4D55CC] focus:border-transparent ${
              errors[field.value] ? "border-red-500" : ""
            }`}
            onChange={handleChange}
          />
        );
      }

      case "HTTP Headers": {
        return (
          <>
            {isHTTPActive && (
              <div className="flex flex-col gap-2 bg-white dark:bg-gray-800 rounded-md p-5 border border-gray-200 dark:border-gray-600">
                {formData?.data?.http_headers?.map((pair, index) => (
                  <div
                    key={index}
                    className="flex gap-2 items-center justify-between w-full overflow-hidden"
                  >
                    <input
                      type="text"
                      name="key"
                      placeholder="Header Key"
                      value={pair.key}
                      onChange={handleInputChange(index, "http_headers")}
                      className="border border-gray-200 dark:border-gray-600 p-2 rounded-md text-sm shadow-sm w-[45%] bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-[#4D55CC] focus:border-transparent"
                    />
                    <input
                      type="text"
                      name="value"
                      placeholder="Header Value"
                      value={pair.value}
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
                  maxHttpHeadersPairs && (
                  <button
                    type="button"
                    onClick={() =>
                      handleAddPair(
                        maxHttpHeadersPairs,
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
      }

      case "Request Data":
        return (
          <>
            {isRequestDataActive && (
              <div className="flex flex-col gap-2 w-full justify-start bg-white dark:bg-gray-800 rounded-md p-5 border border-gray-200 dark:border-gray-600">
                {formData?.data?.api_method === "GET" || formData?.data?.api_method === "DELETE" ? (
                  // Key-Value pairs for GET and DELETE (disabled)
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Request data is not applicable for GET and DELETE methods
                  </div>
                ) : formData?.data?.request_data_type === "JSON" ? (
                  // JSON input for POST, PATCH, PUT with JSON type
                  <div className="w-full">
                    <textarea
                      value={formData?.data?.request_data_json || ""}
                      onChange={(e) => {
                        try {
                          // Try to parse the JSON to validate it
                          const jsonValue = e.target.value ? JSON.parse(e.target.value) : {};
                          // If valid JSON, update the form data
                          setFormData(prev => ({
                            ...prev,
                            data: {
                              ...prev.data,
                              request_data_json: e.target.value,
                              request_data: Object.entries(jsonValue).map(([key, value]) => ({ key, value: JSON.stringify(value) }))
                            }
                          }));
                        } catch (error) {
                          // If invalid JSON, just update the text value
                          setFormData(prev => ({
                            ...prev,
                            data: {
                              ...prev.data,
                              request_data_json: e.target.value
                            }
                          }));
                        }
                      }}
                      placeholder="Enter JSON data..."
                      className="w-full h-[200px] border border-gray-200 dark:border-gray-600 p-2 rounded-md text-sm shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-[#4D55CC] focus:border-transparent font-mono"
                    />
                    {formData?.data?.request_data_json && (
                      <div className="mt-2 text-sm flex items-center gap-1">
                        {(() => {
                          try {
                            JSON.parse(formData.data.request_data_json);
                            return (
                              <span className="text-green-500 flex items-center gap-1">
                                <FaCheckCircle className="text-lg" />
                                Valid JSON
                              </span>
                            );
                          } catch (error) {
                            return (
                              <span className="text-red-500 flex items-center gap-1">
                                <FaTimesCircle className="text-lg" />
                                Invalid JSON
                              </span>
                            );
                          }
                        })()}
                      </div>
                    )}
                  </div>
                ) : (
                  // Key-Value pairs for POST, PATCH, PUT with Form type
                  <>
                    {formData?.data?.request_data?.map((pair, index) => (
                      <div
                        key={index}
                        className="flex gap-2 items-center justify-between w-full overflow-hidden"
                      >
                        <input
                          type="text"
                          name="key"
                          placeholder="Key"
                          value={pair.key}
                          onChange={handleInputChange(index, "request_data")}
                          className="border border-gray-200 dark:border-gray-600 p-2 rounded-md text-sm shadow-sm w-[45%] bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-[#4D55CC] focus:border-transparent"
                        />
                        <input
                          type="text"
                          name="value"
                          placeholder="Value"
                          value={pair.value}
                          onChange={handleInputChange(index, "request_data")}
                          className="border border-gray-200 dark:border-gray-600 p-2 rounded-md text-sm shadow-sm w-[45%] bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-[#4D55CC] focus:border-transparent"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemovePair(index, "request_data")}
                          className="text-gray-400 hover:text-red-500 transition-colors duration-200"
                        >
                          x
                        </button>
                      </div>
                    ))}

                    {(formData?.data?.request_data ?? []).length < maxRequestDataPairs && (
                      <button
                        type="button"
                        onClick={() => handleAddPair(maxRequestDataPairs, isRequestDataActive, "request_data")}
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

      case "Request Data Type": {
        return (
          <select
            name={field.label}
            id={field.value}
            value={formData?.data?.request_data_type || "JSON"}
            onChange={(e) => {
              const newType = e.target.value;
              handleChange(e);
              
              // Reset request data when switching types
              setFormData(prev => ({
                ...prev,
                data: {
                  ...prev.data,
                  request_data: [],
                  request_data_json: ""
                }
              }));
            }}
            className="mt-1 block w-full py-2 px-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#4D55CC] sm:text-sm border border-gray-200 dark:border-gray-600"
          >
            <option value="JSON">JSON</option>
            <option value="Form">Form</option>
          </select>
        );
      }

      case "Name": {
        return (
          <input
            type="text"
            name={field.label}
            id={field.value}
            placeholder={field.placeholder}
            maxLength={30}
            value={formData?.action_name || ""}
            className={`w-full rounded-md mt-[.5vw] bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-base overflow-hidden px-[.5vw] shadow-sm py-[.5vw] border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-[#4D55CC] focus:border-transparent ${
              errors[field.value] ? "border-red-500" : ""
            }`}
            onChange={handleChange}
          />
        );
      }
    }
  };

  return (
    <div className="h-[85vh] scrollbar p-[1vw] pr-[1.8vw] mr-[-1vw] flex flex-col justify-between">
      <h2 className="text-xl font-semibold mb-[1vw]">Action Form</h2>
      <form
        onSubmit={handleSubmit}
        className="overflow-y-auto pr-2"
        style={{ height: "calc(90vh - 160px)" }}
      >
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
              {forPhoneActions
                ? phoneActions.map((action) => (
                    <option key={action.id} value={action.id}>
                      {action.name}
                    </option>
                  ))
                : chatActions.map((action) => (
                    <option key={action.id} value={action.id}>
                      {action.name}
                    </option>
                  ))}
            </select>
          </div>

          {selectedAction?.fields.slice(0, 2).map((field, index) => (
            <div key={index} className="mt-4 ">
              <label
                htmlFor={field.label}
                className="block mt-[1vw] text-sm font-medium text-gray-700 dark:text-gray-200"
              >
                {field.label}
              </label>
              {GetField(field)}
              {errors[field.value] && (
                <p className="text-red-500 text-xs mt-1">{errors[field.value]}</p>
              )}
            </div>
          ))}
        </div>

        <div className="w-full flex justify-center">
          <div className="bg-gray-200 dark:bg-gray-700 h-[1px] w-[90%]" />
        </div>

        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-5 mt-8 shadow-sm">
          {selectedAction?.fields.slice(2).map((field, index) => (
            <div
              key={index}
              className={`${
                field.label === "API Method" && "flex gap-5 items-center"
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
                </label>
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
                      disabled={formData?.data?.api_method === "GET" || formData?.data?.api_method === "DELETE"}
                      className="sr-only peer"
                    />
                    <div className={`w-11 h-6 bg-gray-200 dark:bg-gray-700 peer-focus:ring-2 peer-focus:ring-[#4D55CC] rounded-full peer peer-checked:after:translate-x-5 peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#4D55CC] ${(formData?.data?.api_method === "GET" || formData?.data?.api_method === "DELETE") ? 'opacity-50 cursor-not-allowed' : ''}`}></div>
                  </label>
                )}
              </div>

              {GetField(field)}
              {errors[field.value] && (
                <p className="text-red-500 text-xs mt-1">{errors[field.value]}</p>
              )}
            </div>
          ))}
          {selectedAction?.name === "Booking appointment" && (
            <>
              <div className="flex items-center gap-2">
                <label htmlFor="calendar" className="font-medium">
                  Calendar
                </label>
                <select
                  name="calendar"
                  id="calendar"
                  value={selectedCalenderValue}
                  onChange={handleCalenderChange}
                  className="mt-1 block flex-1 py-2 px-3 bg-white rounded-md shadow-sm focus:outline-none sm:text-sm mx-5"
                >
                  <option value="Google Calendar">Google Calendar</option>
                  <option value="Calendy">Calendy</option>
                </select>
              </div>

              {selectedCalenderValue === "Calendy" ? (
                <div className="mt-4 text-blue-600 font-medium">
                  You have selected Calendy
                </div>
              ) : (
                <>
                  <div>
                    <div className="mt-4 flex flex-col items-center justify-center bg-gray-100 p-6 rounded-lg">
                      <label className="cursor-pointer bg-[#702963] hover:bg-[#702963] text-white text-sm font-semibold py-2 px-4 rounded-lg shadow-lg transition-all duration-200">
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
                        <div className="mt-4  font-medium border p-2 bg-white rounded-lg flex gap-2 items-center">
                          {fileName?.name.length < 35 ? (
                            <span className="font-semibold text-sm">
                              {fileName?.name}
                            </span>
                          ) : (
                            <div className="group relative inline-block">
                              <span className="absolute bg-gray-400 top-[-35px] left-0 rounded-lg px-2 py-1 text-xs shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 inline-block min-w-max z-10">
                                {fileName?.name}
                              </span>
                              <span className="font-semibold text-sm block max-w-[200px] truncate">
                                {fileName?.name.slice(0, 35)}...
                              </span>
                            </div>
                          )}

                          <button
                            className="ml-[1vw] bg-red-500 text-white text-sm p-[.2vw] rounded"
                            onClick={handleDeleteFile}
                          >
                            delete
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="mt-4 flex items-center gap-2">
                    <label
                      htmlFor="calendarId"
                      className=" font-medium text-sm mb-1"
                    >
                      Choose Calendar ID
                    </label>
                    <select
                      name="id"
                      id="calendarId"
                      className=" w-4/6 py-2 px-3 bg-white rounded-md shadow-sm focus:outline-none sm:text-sm mx-4"
                    >
                      <option value="id1">ID 1</option>
                      <option value="id2">ID 2</option>
                    </select>
                  </div>
                </>
              )}
            </>
          )}
        </div>
        <div>
          <RequiredParam
            parameterData={parameterData}
            setParameterData={setParameterData}
            formSubmitted={formSubmitted}
            actionType={selectedAction?.name}
          />
        </div>
      </form>
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
              ? 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-[#4D55CC] to-[#211C84] hover:opacity-90 text-white'
          } px-6 py-2.5 rounded-lg shadow-sm transition-all duration-200 font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4D55CC]`}
        >
          {initialData ? "Update Action" : "Create New Action"}
        </button>
      </div>
    </div>
  );
}

export default ActionForm;
