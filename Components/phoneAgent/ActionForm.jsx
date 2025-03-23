"use client";

import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { upsertAction } from "@/store/reducers/phoneAgentSlice";
import dynamic from "next/dynamic";
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import { v4 as uuidv4 } from "uuid";
import { OutlinedButton } from "../buttons/OutlinedButton";
import { ContainedButton } from "../buttons/ContainedButton";
import { cloneDeep } from "lodash";

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
      requestData,
      requestDataType,
    ],
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
      requestData,
      requestDataType,
    ],
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
  const dispatch = useDispatch();
  const [selectedAction, setSelectedAction] = useState(
    forPhoneActions ? phoneActions[0] : chatActions[0]
  );
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [editorContent, setEditorContent] = useState(
    formData?.data?.content || ""
  ); // State for Quill editor

  const [isHTTPActive, setIsHTTPActive] = useState(false);
  const [isRequestDataActive, setIsRequestDataActive] = useState(false);

  const match = formData?.data?.forward_to?.match(/^(\+\d+)\s*(\d*)$/);
  const initialCountryCode = match ? match[1] : "+1";
  const initialNumber = match ? match[2] : "";

  const [countryCode, setCountryCode] = useState(initialCountryCode);
  const [phoneNumber, setPhoneNumber] = useState(initialNumber);

  useEffect(() => {
    if (formData?.data?.forward_to) {
      setCountryCode(initialCountryCode);
      setPhoneNumber(initialNumber);
    }
  }, [formData?.data?.forward_to]);

  const handleCountryCodeChange = (e) => {
    const newCode = e.target.value;
    setCountryCode(newCode);
    updatePhoneNumber(newCode, phoneNumber);
  };

  const handlePhoneNumberChange = (e) => {
    const value = e.target.value.replace(/\D/g, "");
    setPhoneNumber(value);
    updatePhoneNumber(countryCode, value);
  };

  const updatePhoneNumber = (code, number) => {
    setFormData((prev) => ({
      ...prev,
      data: {
        ...prev.data,
        forward_to: `${code} ${number}`,
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

  useEffect(() => {
    if (initialData) {
      console.log("inital data", initialData.action_type);
      setSelectedAction(
        forPhoneActions
          ? phoneActions.find(
              (action) => action.name === initialData.action_type
            )
          : chatActions.find(
              (action) => action.name === initialData.action_type
            )
      );
      setFormData(initialData);
      setEditorContent(initialData.Content || ""); // Initialize editor content
    } else {
      setSelectedAction(forPhoneActions ? phoneActions[0] : chatActions[0]);
      setFormData({});
      setEditorContent(""); // Reset editor content
    }
  }, [initialData]);

  const handleActionChange = (e) => {
    const actionId = parseInt(e.target.value);
    const action = forPhoneActions
      ? phoneActions.find((action) => action.id === actionId)
      : chatActions.find((action) => action.id === actionId);

    setSelectedAction(action);
    setFormData({});
    setErrors({});
    setEditorContent(""); // Reset editor content on action change
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

    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    let actionData;
    if (initialData) {
      actionData = {
        id: initialData.id,
        action_type: selectedAction.name,
        ...formData,
      };
    } else {
      actionData = {
        id: uuidv4(),
        action_type: selectedAction.name,
        ...formData,
      };
    }

    // const actionData = {
    //   type: selectedAction.name,
    //   ...formData
    // };

    console.log("filled form Data", formData);
    console.log("form data to be dispatched", actionData);

    handleCreateAction(actionData);
    toggle(); // Close the form after submission
    setFormData({});
    setErrors({});
    setEditorContent("");
  };

  if (typeof window === "undefined") {
    return <></>;
  }

  const GetField = (field) => {
    console.log(field);
    switch (field.label) {
      case "Instructions": {
        return (
          <textarea
            name={field.label}
            id={field.value}
            placeholder={field.placeholder}
            value={formData?.instructions || ""}
            className={`w-full h-[200px] rounded-md mt-[.5vw] text-base overflow-hidden resize-none shadow-sm bg-white px-[.5vw] py-[.5vw] ${
              errors[field.value] ? "border-red-500" : ""
            }`}
            onChange={handleChange}
          />
        );
      }

      case "Content": {
        return (
          <ReactQuill
            name={field.label}
            value={editorContent}
            onChange={handleEditorChange}
            placeholder="Start typing..."
            className={`mt-2 bg-white min-h-[200px] border-0 overflow-hidden shadow-sm ${
              errors[field.value] ? "border-red-500" : ""
            }`}
          />
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
            className={`w-full rounded-md mt-[.5vw] bg-white text-base overflow-hidden px-[.5vw] shadow-sm py-[.5vw] ${
              errors[field.value] ? "border-red-500" : ""
            }`}
            onChange={handleChange}
          />
        );
      }

      case "Forward to": {
        return (
          <div className="flex gap-2 items-center">
            <select
              value={countryCode}
              onChange={handleCountryCodeChange}
              className="border p-2 rounded-md w-[25%]"
            >
              <option value="+1">🇺🇸 +1</option>
              <option value="+44">🇬🇧 +44</option>
              <option value="+91">🇮🇳 +91</option>
              <option value="+61">🇦🇺 +61</option>
              <option value="+81">🇯🇵 +81</option>
            </select>

            <input
              type="text"
              placeholder="Enter number"
              value={phoneNumber}
              onChange={handlePhoneNumberChange}
              className="border p-2 rounded-md w-full"
            />
          </div>
        );
      }

      case "API Method": {
        return (
          <select
            name={field.label}
            id={field.value}
            value={formData?.data?.api_method || ""}
            onChange={handleChange}
            className={`mt-1 block flex-1 py-2 px-3 bg-white rounded-md shadow-sm focus:outline-none sm:text-sm`}
          >
            <option value="" disabled hidden>
              Select Method
            </option>
            <option value="GET">GET</option>
            <option value="POST">POST</option>
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
            className={`w-full rounded-md mt-[.5vw] bg-white text-base overflow-hidden px-[.5vw] shadow-sm py-[.5vw] ${
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
              <div className="flex flex-col gap-2 bg-white rounded-md p-5">
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
                      className="border p-2 rounded-md shadow-sm w-[45%] bg-gray-100"
                    />
                    <input
                      type="text"
                      name="value"
                      placeholder="Header Value"
                      value={pair.value}
                      onChange={handleInputChange(index, "http_headers")}
                      className="border p-2 rounded-md shadow-sm w-[45%] bg-gray-100"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemovePair(index, "http_headers")}
                      className=" text-black"
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
                    className="text-[#702963] w-full text-start mr-5"
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
              <div className="flex flex-col gap-2 w-full justify-start bg-white rounded-md p-5">
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
                      className="border p-2 rounded-md shadow-sm w-[45%] bg-gray-100"
                    />
                    <input
                      type="text"
                      name="value"
                      placeholder="Value"
                      value={pair.value}
                      onChange={handleInputChange(index, "request_data")}
                      className="border p-2 rounded-md shadow-sm w-[45%] bg-gray-100"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemovePair(index, "request_data")}
                      className=" text-black cursor-pointer"
                    >
                      x
                    </button>
                  </div>
                ))}

                {(formData?.data?.request_data ?? []).length <
                  maxRequestDataPairs && (
                  <button
                    type="button"
                    onClick={() =>
                      handleAddPair(
                        maxRequestDataPairs,
                        isRequestDataActive,
                        "request_data"
                      )
                    }
                    className="text-[#702963] w-full text-start"
                  >
                    + Add Key
                  </button>
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
            value={formData?.data?.request_data_type || ""}
            onChange={handleChange}
            className="mt-1 block w-full py-2 px-3 bg-white rounded-md shadow-sm focus:outline-none sm:text-sm"
          >
            <option value="" disabled hidden>
              Select Type
            </option>
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
            value={formData?.action_name || ""}
            className={`w-full rounded-md mt-[.5vw] bg-white text-base overflow-hidden px-[.5vw] shadow-sm py-[.5vw] ${
              errors[field.value] ? "border-red-500" : ""
            }`}
            onChange={handleChange}
          />
        );
      }
    }
  };

  return (
    <div className="h-[65vh] scrollbar p-[1vw] pr-[1.8vw] mr-[-1vw] flex flex-col justify-between">
      <h2 className="text-xl font-semibold mb-[1vw]">Action Form</h2>
      <form
        onSubmit={handleSubmit}
        className="overflow-y-auto pr-2"
        style={{ height: "calc(70vh - 160px)" }}
      >
        <div className="bg-gray-100 rounded-lg p-5 mb-8">
          <div>
            <label
              htmlFor="action-type"
              className="block text-sm font-medium text-gray-700"
            >
              Action Type
            </label>
            <select
              id="action-type"
              value={selectedAction?.id}
              onChange={handleActionChange}
              className="mt-1 block w-full py-2 px-3 bg-white rounded-md shadow-sm focus:outline-none sm:text-sm"
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
            <div key={index} className="mt-4">
              <label
                htmlFor={field.label}
                className="block mt-[1vw] text-sm font-medium text-gray-700"
              >
                {field.label}
              </label>
              {GetField(field)}
              {errors[field.value] && (
                <p className="text-red-500 text-xs">{errors[field.value]}</p>
              )}
            </div>
          ))}
        </div>

        <div className="w-full flex justify-center">
          <div className="bg-gray-300 h-[1px] w-[80%]" />
        </div>

        <div className="bg-gray-100 rounded-lg p-5 mt-8">
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
                  } text-sm font-medium text-gray-700`}
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
                    <div className="w-11 h-6 bg-gray-300 peer-focus:ring-2 peer-focus:ring-[#702963] rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-5 peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#702963]"></div>
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
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-300 peer-focus:ring-2 peer-focus:ring-[#702963] rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-5 peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#702963]"></div>
                  </label>
                )}
              </div>
              {GetField(field)}
              {errors[field.value] && (
                <p className="text-red-500 text-xs">{errors[field.value]}</p>
              )}
            </div>
          ))}
        </div>
      </form>
      <div className="flex items-center justify-between mt-[15px]">
        <OutlinedButton onClick={toggle}>Cancel</OutlinedButton>
        <button
          onClick={handleSubmit}
          type="submit"
          className="bg-[#702963] hover:bg-opacity-[0.85] shadow-sm text-white px-4 py-2 rounded"
        >
          {initialData ? "Update Action" : "Create New Action"}
        </button>
      </div>
    </div>
  );
}

export default ActionForm;
