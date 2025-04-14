import { useState } from "react";
import { FaChevronDown, FaChevronUp,FaPlusCircle,FaTrash  } from "react-icons/fa";

const RequiredParam = ({parameterData, setParameterData}) => {
    
  const [modal, setModal] = useState(false);
  const addParameter = () => {
    console.log(parameterData);
    
    setParameterData([
      ...parameterData,
      { key: "", defaultValue: "", description: "" },
    ]);
  };

  // Update any field
  const updateParameter = (index, field, value) => {
    const updated = [...parameterData];
    updated[index][field] = value;
    setParameterData(updated);
  };

  // Delete a parameter
  const deleteParameter = (index) => {
    const filtered = parameterData.filter((_, i) => i !== index);
    setParameterData(filtered);
  };
  return (
    <div className="bg-[#f3f4f6] mt-[10px] px-5 rounded-md">
      <div className="flex justify-between py-2">
        <h1>Required Parameters</h1>
        <h1 className="cursor-pointer" onClick={() => setModal(!modal)}>
          {modal ? <FaChevronUp /> : <FaChevronDown />}
        </h1>
      </div>
      <div
        className={`transition-all duration-400 ease-in-out overflow-hidden ${
          modal ? " opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="">
          <div className="bg-blue-100 border border-blue-500 max-w-[660px] p-2 rounded-md">
            <h1 className="text-md text-blue-500 font-bold">How it works</h1>
            <h1 className="text-sm text-blue-500">
              Ai agent will collect all required parameters from the user
              through conversation before trigering the action. parameter will
              be validated basedon your specificattions
            </h1>
          </div>
        </div>
        {parameterData.map((param, index) => (
          <div
            key={index}
            className="bg-white border rounded-md p-4 mb-4 shadow-sm relative mt-2"
          >
            <h2 className="font-semibold mb-2">Parameter {index + 1}</h2>

            <label className="block text-sm font-medium mb-1">Key</label>
            <input
              type="text"
              className="w-full border px-3 py-2 mb-3 rounded-md"
              placeholder="Parameter name"
              value={param.key}
              onChange={(e) => updateParameter(index, "key", e.target.value)}
            />

            <label className="block text-sm font-medium mb-1">
              Default Value (optional)
            </label>
            <input
              type="text"
              className="w-full border px-3 py-2 mb-3 rounded-md"
              placeholder="Default value"
              value={param.defaultValue}
              onChange={(e) =>
                updateParameter(index, "defaultValue", e.target.value)
              }
            />

            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              className="w-full border px-3 py-2 mb-3 rounded-md"
              placeholder="Explain what this parameter is for..."
              value={param.description}
              onChange={(e) =>
                updateParameter(index, "description", e.target.value)
              }
            />

            <button
              type="button"
              onClick={() => deleteParameter(index)}
              className="absolute top-4 right-4 text-red-500 hover:text-red-700"
            >
              <FaTrash />
            </button>
          </div>
        ))}
        <div className="bg-white border p-2 rounded-md my-2 item-center flex justify-center cursor-pointer gap-2" onClick={addParameter}>
            <FaPlusCircle className="text-purple-500"/>
           <h1 className="text-purple-500 text-sm">
             Add Parameter
            </h1>
        </div>
      </div>
    </div>
  );
};

export default RequiredParam;
