"use client"

import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { upsertAction } from "@/store/reducers/phoneAgentSlice";
import dynamic from "next/dynamic";
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import { v4 as uuidv4 } from "uuid";
import { OutlinedButton } from "../buttons/OutlinedButton";
import { ContainedButton } from "../buttons/ContainedButton";
import {cloneDeep} from "lodash";

const name= {
  label: "Name",
  value: "action_name",
  placeholder: "Enter the name"
};

const subject = {
  label: "Subject",
  value: "subject",
  placeholder: "Enter the subject"
}

const instructions = {
  label: "Instructions",
  value: "instructions",
  placeholder: "Tell your agent when this action should be triggered."
}

const content = {
  label: "Content",
  value: "content",
  placeholder: "Provide the main content or body of the email."
}

const forwardTo = {
  label: "Forward to",
  value: "forward_to",
  placeholder: "Tell your agent where to forward your call."
}

const endPoint = {
  label: "End point",
  value: "end_point",
  placeholder: "Enter a url"
}

const actions = [
  {
    id: 1,
    name: "Send email",
    fields: [name, subject, instructions, content],
  },
  // {
  //   id: 2,
  //   name: "Call Forwarding",
  //   fields: [name, forwardTo, instructions],
  // },
  { id: 3, name: "Web hooks", fields: [name, endPoint, instructions] },
];

// Mapping fields to help text
const fieldHelpText = {
  Name: "Enter the name",
  Subject: "Enter the subject",
  "Forward To": "Tell your agent where to forward your call.",
  Instructions: "Tell your agent when this action should be triggered.",
  Content: "Provide the main content or body of the email.",
  "End point": "Enter a url",
};

function ActionForm({ show, toggle, initialData, handleCreateAction }) {
  const dispatch = useDispatch();
  const [selectedAction, setSelectedAction] = useState(actions[0]);
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [editorContent, setEditorContent] = useState(formData?.data?.content || ""); // State for Quill editor

  useEffect(() => {
    console.log(formData)

  }, [formData])

  useEffect(() => {
    if (initialData) {
      setSelectedAction(
        actions.find((action) => action.name === initialData.type)
      );
      setFormData(initialData);
      setEditorContent(initialData.Content || ""); // Initialize editor content
    } else {
      setSelectedAction(actions[0]);
      setFormData({});
      setEditorContent(""); // Reset editor content
    }
  }, [initialData]);

  const handleActionChange = (e) => {
    const actionId = parseInt(e.target.value);
    const action = actions.find((action) => action.id === actionId);
    setSelectedAction(action);
    setFormData({});
    setErrors({});
    setEditorContent(""); // Reset editor content on action change
  };

  const handleChange = (e, _id, val) => {
    
    let id = _id;
    let value = val;

    if(!_id) {
      id = e.target.id;
      value = e.target.value;
      e.target.style.height = "auto"; // Reset height
      e.target.style.height = `${e.target.scrollHeight}px`; // Set new height
    }

    const newData = cloneDeep(formData);
    const data = {}

    if(id === "action_name") {
      newData["action_name"] = value;
    } else {
      data[id] = value
    }

    if(Object.keys(data).length) {
      newData["data"] = {...newData?.data, ...data};
    }

    setFormData(newData);
    setErrors([])
  };

  const handleEditorChange = (content) => {
    setEditorContent(content);
    handleChange(null, "content", content)
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
      let isExist = Boolean(formData[field.value]);
      if (formData?.data) {
        if(formData?.data[field.value]){
          isExist = true;
        }
      }

      if(!isExist) {
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

    console.log('filled form Data', formData);
    console.log('form data to be dispatched', actionData);
    

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
    console.log(field)
    switch(field.label) {
      case "Instructions": {
        return (
          <textarea
          name={field.label}
          id={field.value}
          placeholder={field.placeholder}
          value={formData?.data?.instructions || ""}
          className={`w-full h-[200px] rounded-md mt-[.5vw] text-base overflow-hidden resize-none shadow-sm bg-gray-100 px-[.5vw] py-[.5vw] ${
            errors[field.value] ? "border-red-500" : ""
          }`}
          onChange={handleChange}
        />
        )
      }

      case "Content": {
        return (
          <ReactQuill
          name={field.label}
          value={editorContent}
          onChange={handleEditorChange}
          placeholder="Start typing..."
          className={`mt-2 bg-gray-100 min-h-[200px] border-0 overflow-hidden shadow-sm ${
            errors[field.value] ? "border-red-500" : ""
          }`}
        />
        )
      }

      case "Subject": {
        return (
          <input
          type="text"
          name={field.label}
          id={field.value}
          placeholder={field.placeholder}
          value={formData?.data?.subject || ""}
          className={`w-full rounded-md mt-[.5vw] bg-gray-100 text-base overflow-hidden px-[.5vw] shadow-sm py-[.5vw] ${
            errors[field.value] ? "border-red-500" : ""
          }`}
          onChange={handleChange}
        />
        )
      }

      case "Forward to": {
        return (
          <input
          type="text"
          name={field.label}
          id={field.value}
          placeholder={field.placeholder}
          value={formData?.data?.forward_to || ""}
          className={`w-full rounded-md mt-[.5vw] bg-gray-100 text-base overflow-hidden px-[.5vw] shadow-sm py-[.5vw] ${
            errors[field.value] ? "border-red-500" : ""
          }`}
          onChange={handleChange}
        />
        )
      }

      case "End point": {
        return (
          <input
          type="text"
          name={field.label}
          id={field.value}
          placeholder={field.placeholder}
          value={formData?.data?.end_point || ""}
          className={`w-full rounded-md mt-[.5vw] bg-gray-100 text-base overflow-hidden px-[.5vw] shadow-sm py-[.5vw] ${
            errors[field.value] ? "border-red-500" : ""
          }`}
          onChange={handleChange}
        />
        )
      }

      case "Name": {
        return (
          <input
          type="text"
          name={field.label}
          id={field.value}
          placeholder={field.placeholder}
          value={formData?.action_name || ""}
          className={`w-full rounded-md mt-[.5vw] bg-gray-100 text-base overflow-hidden px-[.5vw] shadow-sm py-[.5vw] ${
            errors[field.value] ? "border-red-500" : ""
          }`}
          onChange={handleChange}
        />
        )
      }
    }
  }

  return (
    <div className="h-[65vh] scrollbar p-[1vw] pr-[1.8vw] mr-[-1vw] flex flex-col justify-between">
      <h2 className="text-xl font-semibold mb-[1vw]">Action Form</h2>
      <form
        onSubmit={handleSubmit}
        className="overflow-y-auto pr-2"
        style={{ height: "calc(70vh - 160px)" }}
      >
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
            className="mt-1 block w-full py-2 px-3 bg-gray-100 rounded-md shadow-sm focus:outline-none sm:text-sm"
          >
            {actions.map((action) => (
              <option key={action.id} value={action.id}>
                {action.name}
              </option>
            ))}
          </select>
        </div>

        {selectedAction?.fields.map((field, index) => (
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
