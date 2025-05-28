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
import { usePathname } from "next/navigation";

const RequiredParam = ({ parameterData, setParameterData, formSubmitted, actionType }) => {
  const [modal, setModal] = useState(false);
  const [infoOpen, setInfoOpen] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const pathname = usePathname();

  // Handle initial load and action type changes
  useEffect(() => {
    // Only add default email parameter when:
    // 1. Action type is "Send email"
    // 2. There's no initialData (parameterData is empty)
    if (actionType === "Send email" && (!parameterData || parameterData.length === 0)) {
      setParameterData([{
        key: "email",
        value: "",
        description: "User's email to send email for this action",
        dynamic: "true"
      }]);
    } else if (actionType !== "Send email" && parameterData?.length === 1 && parameterData[0]?.key === "email") {
      // If action type changes from "Send email" to something else, clear the parameters
      setParameterData([]);
    }
    setModal(true);
  }, [actionType, parameterData]); // Include both actionType and parameterData

  // Handle initial modal state
  useEffect(() => {
    setModal(true);
  }, []);

  const addParameter = () => {
    console.log(parameterData);
    const isSpecialRoute = pathname === "/workspace/agents/chats/createbot" || 
                          pathname === "/workspace/agents/phone/actions";

    setParameterData([
      ...parameterData,
      { 
        key: "", 
        value: "", 
        description: "", 
        dynamic: isSpecialRoute ? "true" : "false" 
      },
    ]);
  };

  const updateParameter = (index, field, value) => {
    const updated = parameterData.map((param, i) =>
      i === index ? { ...param, [field]: value } : param
    );
    setParameterData(updated);
  };

  const handleDynamicParamToggle = (index, checked) => {
    const updated = parameterData.map((param, i) =>
      i === index ? { ...param, dynamic: checked ? "true" : "false" } : param
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

  return (
    <div className="bg-gray-50 dark:bg-gray-900/50 mt-[10px] px-5 rounded-lg shadow-sm">
      <div className="flex flex-col py-3">
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center gap-2">
            <h1 onClick={() => setModal(!modal)} className="cursor-pointer text-gray-900 dark:text-gray-100 font-semibold">
              Required / Dynamic Parameters
            </h1>
            <IconButton
              size="small"
              className="text-[#4D55CC] hover:text-[#211C84] dark:text-[#4D55CC] dark:hover:text-[#211C84] transition-colors duration-200"
              onClick={handleOpenInfo}
            >
              <FaInfoCircle />
            </IconButton>
          </div>
          <h1 className="cursor-pointer text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 transition-all duration-300 transform hover:scale-110" onClick={() => setModal(!modal)}>
            <FaChevronDown className={`transform transition-transform duration-300 ${modal ? 'rotate-180' : 'rotate-0'}`} />
          </h1>
        </div>
      </div>
      <div
        className={`transition-all duration-500 ease-in-out overflow-hidden ${
          modal ? "opacity-100 max-h-[2000px]" : "max-h-0 opacity-0"
        }`}
      >
        <div className="w-full">
          <div className="bg-blue-50 w-full dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 p-4 rounded-lg">
            <h1 className="text-md text-blue-600 dark:text-blue-400 font-bold mb-2">How it works</h1>
            <h1 className="text-sm text-blue-600 dark:text-blue-400">
              AI agent will collect all required parameters from the user
              through conversation before triggering the action. Parameters will
              be validated based on your description.
            </h1>
          </div>
        </div>
        {parameterData.map((param, index) => (
          <div
            key={index}
            className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-5 mb-4 shadow-sm relative mt-3 hover:shadow-md transition-shadow duration-200"
          >
            <h2 className="font-semibold mb-3 text-gray-900 dark:text-gray-100">Parameter {index + 1}</h2>
            <FormControlLabel
              control={
                <Switch
                  checked={param.dynamic === "true"}
                  onChange={(e) => handleDynamicParamToggle(index, e.target.checked)}
                  sx={{
                    '& .MuiSwitch-switchBase': {
                      '&.Mui-checked': {
                        color: '#4D55CC',
                        '& + .MuiSwitch-track': {
                          backgroundColor: '#4D55CC',
                          opacity: 0.5,
                        },
                      },
                    },
                    '& .MuiSwitch-track': {
                      backgroundColor: '#9CA3AF',
                    },
                  }}
                  size="small"
                />
              }
              label={
                <Typography variant="body2" className="text-gray-700 dark:text-gray-300">
                  Enable this as a dynamic parameter
                </Typography>
              }
              className="ml-[1px]"
              style={{margin: "8px 0 8px 0"}}
            />

            <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">Key</label>
            <input
              type="text"
              className={`w-full border ${
                formSubmitted && !param.key 
                  ? 'border-red-500 dark:border-red-400 focus:ring-red-500 dark:focus:ring-red-400' 
                  : 'border-gray-200 dark:border-gray-600 focus:ring-[#4D55CC]'
              } bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-3 py-2 rounded-lg text-sm focus:ring-2 focus:border-transparent transition-all duration-200`}
              placeholder="Parameter name"
              value={param.key}
              onChange={(e) => updateParameter(index, "key", e.target.value)}
            />
            {formSubmitted && !param.key && (
              <p className="text-red-500 dark:text-red-400 text-sm mt-1.5">
                * This field is required.
              </p>
            )}
            <label className="block text-sm font-medium mb-1.5 mt-4 text-gray-700 dark:text-gray-300">
              Value (optional)
            </label>
            <input
              type="text"
              className="w-full border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-3 py-2 mb-3 rounded-lg text-sm focus:ring-2 focus:ring-[#4D55CC] focus:border-transparent transition-all duration-200"
              placeholder="Default value (e.g {name: 'sample name'})"
              value={param.value}
              onChange={(e) => updateParameter(index, "value", e.target.value)}
            />

            <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">
              Description
            </label>
            <textarea
              className={`w-full border ${
                formSubmitted && !param.description 
                  ? 'border-red-500 dark:border-red-400 focus:ring-red-500 dark:focus:ring-red-400' 
                  : 'border-gray-200 dark:border-gray-600 focus:ring-[#4D55CC]'
              } bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-3 py-2 rounded-lg text-sm focus:ring-2 focus:border-transparent transition-all duration-200`}
              placeholder="Explain what this parameter is for..."
              value={param.description}
              onChange={(e) =>
                updateParameter(index, "description", e.target.value)
              }
            />
            {formSubmitted && !param.description && (
              <p className="text-red-500 dark:text-red-400 text-sm mt-1.5">
                * This field is required.
              </p>
            )}
            <button
              type="button"
              onClick={() => deleteParameter(index)}
              className="absolute top-4 right-4 text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 transition-all duration-300 transform hover:scale-110 hover:rotate-12"
            >
              <FaTrash />
            </button>
          </div>
        ))}
        <div
          className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 p-3 rounded-lg my-3 flex items-center justify-center cursor-pointer gap-2 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors duration-200"
          onClick={addParameter}
        >
          <FaPlusCircle className="text-[#4D55CC] dark:text-[#4D55CC]" />
          <h1 className="text-[#4D55CC] dark:text-[#4D55CC] text-sm font-medium">Add Parameter</h1>
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
        <DialogTitle className="flex justify-between items-center bg-gradient-to-r from-[#4D55CC] to-[#211C84] text-white">
          <Typography variant="h6" className="font-semibold">
            Parameter Field Guide
          </Typography>
          <IconButton onClick={handleCloseInfo} size="small" className="text-white hover:bg-white/10">
            <CloseIcon className="text-white hover:bg-white/10" />
          </IconButton>
        </DialogTitle>
        <DialogContent className="mt-2 bg-white dark:bg-gray-800">
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            variant="fullWidth"
            className="mb-4 border-b border-gray-200 dark:border-gray-600"
          >
            <Tab label="Key" className="font-medium text-gray-700 dark:text-gray-300" />
            <Tab label="Value" className="font-medium text-gray-700 dark:text-gray-300" />
            <Tab label="Description" className="font-medium text-gray-700 dark:text-gray-300" />
          </Tabs>

          {/* Key Tab */}
          <TabPanel value={tabValue} index={0}>
            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <Typography
                variant="subtitle1"
                className="font-semibold text-gray-900 dark:text-gray-100 mb-2"
              >
                What is the Key field?
              </Typography>
              <Typography variant="body2" className="text-gray-700 dark:text-gray-300 mb-3">
                The Key field represents the name of your parameter that will be
                used in your action flow. This will be sent to the action url as
                a parameter.
              </Typography>
              <Typography variant="body2" className="text-gray-700 dark:text-gray-300">
                <span className="font-semibold">Best practices:</span>
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  <li>Use clear, descriptive names</li>
                  <li>Avoid spaces (use camelCase or snake_case)</li>
                  <li>Choose names that reflect the data being collected</li>
                </ul>
              </Typography>
            </div>
          </TabPanel>

          {/* Value Tab */}
          <TabPanel value={tabValue} index={1}>
            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <Typography
                variant="subtitle1"
                className="font-semibold text-gray-900 dark:text-gray-100 mb-2"
              >
                What is the Value field?
              </Typography>
              <Typography variant="body2" className="text-gray-700 dark:text-gray-300 mb-3">
                The value field is for defining the data structure of the
                parameter. e.g {`{"name": "sample name"}`}
              </Typography>
              <Typography variant="body2" className="text-gray-700 dark:text-gray-300">
                <span className="font-semibold">When to use:</span>
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  <li>For parameters with custom data structure</li>
                  <li>To pass data to the action url</li>
                </ul>
              </Typography>
            </div>
          </TabPanel>

          {/* Description Tab */}
          <TabPanel value={tabValue} index={2}>
            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <Typography
                variant="subtitle1"
                className="font-semibold text-gray-900 dark:text-gray-100 mb-2"
              >
                What is the Description field?
              </Typography>
              <Typography variant="body2" className="text-gray-700 dark:text-gray-300 mb-3">
                The Description field explains the purpose and expected format
                of the parameter. This helps the AI understand how to prompt the
                user for this information.
              </Typography>
              <Typography variant="body2" className="text-gray-700 dark:text-gray-300">
                <span className="font-semibold">
                  Writing effective descriptions:
                </span>
                <ul className="list-disc pl-5 mt-2 space-y-1">
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
