import { useEffect, useState } from "react";
import {
  FaChevronDown,
  FaChevronUp,
  FaPlusCircle,
  FaTrash,
  FaInfoCircle,
} from "react-icons/fa";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Tabs,
  Tab,
  Box,
  Typography,
  FormControlLabel,
  Switch,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const RequiredParam = ({ parameterData, setParameterData, formSubmitted }) => {
  const [modal, setModal] = useState(false);
  const [infoOpen, setInfoOpen] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [isDynamicParam, setIsDynamicParam] = useState(true);

  useEffect(() => {
    setModal(true);
  }, [parameterData]);

  const addParameter = () => {
    console.log(parameterData);

    setParameterData([
      ...parameterData,
      { key: "", value: "", description: "" },
    ]);
  };

  // Update any field
  // const updateParameter = (index, field, value) => {
  //   const updated = [...parameterData];
  //   updated[index][field] = value;
  //   setParameterData(updated);
  // };
  const updateParameter = (index, field, value) => {
    const updated = parameterData.map((param, i) =>
      i === index ? { ...param, [field]: value } : param
    );
    setParameterData(updated);
  };

  // Delete a parameter
  const deleteParameter = (index) => {
    const filtered = parameterData.filter((_, i) => i !== index);
    setParameterData(filtered);
  };

  const handleOpenInfo = (e) => {
    e.stopPropagation(); // Prevent triggering the collapse/expand
    setInfoOpen(true);
  };

  const handleCloseInfo = () => {
    setInfoOpen(false);
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleDynamicParamToggle = (event) => {
    setIsDynamicParam(event.target.checked);
  };

  return (
    <div className="bg-[#f3f4f6] mt-[10px] px-5 rounded-md">
      <div className="flex flex-col py-3">
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center gap-2">
            <h1 onClick={() => setModal(!modal)} className="cursor-pointer">
              Required / Dynamic Parameters
            </h1>
            <IconButton
              size="small"
              className="text-blue-500 hover:text-blue-700"
              onClick={handleOpenInfo}
            >
              <FaInfoCircle />
            </IconButton>
          </div>
          <h1 className="cursor-pointer" onClick={() => setModal(!modal)}>
            {modal ? <FaChevronUp /> : <FaChevronDown />}
          </h1>
        </div>
      </div>
      <div
        className={`transition-all duration-400 ease-in-out overflow-hidden ${
          modal ? " opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="w-[38vw]">
          <div className="bg-blue-100 border border-blue-500 p-2 rounded-md">
            <h1 className="text-md text-blue-500 font-bold">How it works</h1>
            <h1 className="text-sm text-blue-500">
              Ai agent will collect all required parameters from the user
              through conversation before trigering the action. Parameters will
              be validated based on your description.
            </h1>
          </div>
        </div>
        {parameterData.map((param, index) => (
          <div
            key={index}
            className="bg-white border rounded-md p-4 mb-4 shadow-sm relative mt-2"
          >
            <h2 className="font-semibold mb-2">Parameter {index + 1}</h2>
            <FormControlLabel
              control={
                <Switch
                  checked={isDynamicParam}
                  onChange={handleDynamicParamToggle}
                  color="primary"
                  size="small"
                />
              }
              label={
                <Typography variant="body2" className="text-gray-700">
                  Enable this as a dynamic parameter
                </Typography>
              }
              className="ml-[1px]"
              style={{margin: "8px 0 8px 0"}}
            />

            <label className="block text-sm font-medium mb-1">Key</label>
            <input
              type="text"
              className="w-full border px-3 py-2 rounded-md text-sm"
              placeholder="Parameter name"
              value={param.key}
              onChange={(e) => updateParameter(index, "key", e.target.value)}
            />
            {formSubmitted && !param.key && (
              <p className="text-red-500 text-sm mb-2">
                * This field is required.
              </p>
            )}
            <label className="block text-sm font-medium mb-1 mt-3">
              Value (optional)
            </label>
            <input
              type="text"
              className="w-full border px-3 py-2 mb-3 rounded-md text-sm"
              placeholder="Default value (e.g {name: 'sample name'})"
              value={param.value}
              onChange={(e) => updateParameter(index, "value", e.target.value)}
            />

            <label className="block text-sm font-medium mb-1">
              Description
            </label>
            <textarea
              className="w-full border px-3 py-2 rounded-md text-sm"
              placeholder="Explain what this parameter is for..."
              value={param.description}
              onChange={(e) =>
                updateParameter(index, "description", e.target.value)
              }
            />
            {formSubmitted && !param.description && (
              <p className="text-red-500 text-sm mb-2">
                * This field is required.
              </p>
            )}
            <button
              type="button"
              onClick={() => deleteParameter(index)}
              className="absolute top-4 right-4 text-red-500 hover:text-red-700"
            >
              <FaTrash />
            </button>
          </div>
        ))}
        <div
          className="bg-white border p-2 rounded-md my-2 item-center flex justify-center cursor-pointer gap-2"
          onClick={addParameter}
        >
          <FaPlusCircle className="text-purple-500" />
          <h1 className="text-purple-500 text-sm">Add Parameter</h1>
        </div>
      </div>

      {/* Info Dialog */}
      <Dialog
        open={infoOpen}
        onClose={handleCloseInfo}
        maxWidth="sm"
        fullWidth
        className="rounded-lg"
        style={{ zIndex: 99999 }}
      >
        <DialogTitle className="flex justify-between items-center bg-purple-50">
          <Typography variant="h6" className="font-semibold text-purple-700">
            Parameter Field Guide
          </Typography>
          <IconButton onClick={handleCloseInfo} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent className="mt-2">
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            variant="fullWidth"
            className="mb-4 border-b"
          >
            <Tab label="Key" className="font-medium" />
            <Tab label="Value" className="font-medium" />
            <Tab label="Description" className="font-medium" />
          </Tabs>

          {/* Key Tab */}
          <TabPanel value={tabValue} index={0}>
            <div className="p-3 bg-gray-50 rounded-md">
              <Typography
                variant="subtitle1"
                className="font-semibold text-gray-800 mb-2"
              >
                What is the Key field?
              </Typography>
              <Typography variant="body2" className="text-gray-700 mb-2">
                The Key field represents the name of your parameter that will be
                used in your action flow. This will be sent to the action url as
                a parameter.
              </Typography>
              <Typography variant="body2" className="text-gray-700">
                <span className="font-semibold">Best practices:</span>
                <ul className="list-disc pl-5 mt-1">
                  <li>Use clear, descriptive names</li>
                  <li>Avoid spaces (use camelCase or snake_case)</li>
                  <li>Choose names that reflect the data being collected</li>
                </ul>
              </Typography>
            </div>
          </TabPanel>

          {/* Value Tab */}
          <TabPanel value={tabValue} index={1}>
            <div className="p-3 bg-gray-50 rounded-md">
              <Typography
                variant="subtitle1"
                className="font-semibold text-gray-800 mb-2"
              >
                What is the Value field?
              </Typography>
              <Typography variant="body2" className="text-gray-700 mb-2">
                The value field is for defining the data structure of the
                parameter. e.g {`{"name": "sample name"}`}
              </Typography>
              <Typography variant="body2" className="text-gray-700">
                <span className="font-semibold">When to use:</span>
                <ul className="list-disc pl-5 mt-1">
                  <li>For parameters with custom data structure</li>
                  <li>To pass data to the action url</li>
                </ul>
              </Typography>
            </div>
          </TabPanel>

          {/* Description Tab */}
          <TabPanel value={tabValue} index={2}>
            <div className="p-3 bg-gray-50 rounded-md">
              <Typography
                variant="subtitle1"
                className="font-semibold text-gray-800 mb-2"
              >
                What is the Description field?
              </Typography>
              <Typography variant="body2" className="text-gray-700 mb-2">
                The Description field explains the purpose and expected format
                of the parameter. This helps the AI understand how to prompt the
                user for this information.
              </Typography>
              <Typography variant="body2" className="text-gray-700">
                <span className="font-semibold">
                  Writing effective descriptions:
                </span>
                <ul className="list-disc pl-5 mt-1">
                  <li>Clearly explain what information is needed</li>
                  <li>Mention any formatting requirements</li>
                  <li>Include examples when helpful</li>
                  <li>
                    Specify any constraints (min/max values, patterns, etc.)
                  </li>
                </ul>
              </Typography>
            </div>
          </TabPanel>
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Tab Panel component
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`parameter-tabpanel-${index}`}
      aria-labelledby={`parameter-tab-${index}`}
      {...other}
    >
      {value === index && <Box>{children}</Box>}
    </div>
  );
}

export default RequiredParam;
