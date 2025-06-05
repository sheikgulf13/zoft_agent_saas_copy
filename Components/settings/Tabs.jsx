import React, { useState } from "react";
import PersonalDetails from "./PersonalDetails";
import Security from "./Security";
import Billings from "./Billings";
import Plan from "./Plan";
import useTheme from "next-theme";

const Tabs = () => {
  const [activeTab, setActiveTab] = useState("Personal Details");
  const { theme, setTheme } = useTheme();
  
  const renderContent = () => {
    switch (activeTab) {
      case "Personal Details":
        return <PersonalDetails />;
      case "Plan":
        return <Plan />;
      case "Security":
        return <Security />;
      case "Billings":
        return <Billings />;
      default:
        return null;
    }
  };

  const getTabClassNames = (tabName) => {
    const baseClasses = "flex-1 py-3 px-4 text-center transition-all duration-200 font-medium";
    const activeClasses =
      theme === "dark"
        ? "bg-[#1A1C22] text-white border-b-2 border-[#2D3377]"
        : "bg-white text-[#2D3377] border-b-2 border-[#2D3377]";
    const inactiveClasses =
      theme === "dark" 
        ? "bg-[#2A2E37] text-gray-400 hover:text-white hover:bg-[#2A2E37]/80" 
        : "bg-gray-50 text-gray-600 hover:text-[#2D3377] hover:bg-gray-100";

    return `${baseClasses} ${
      activeTab === tabName ? activeClasses : inactiveClasses
    }`;
  };

  const tabButtonStyle = {
    width: '250px', 
    minWidth: '250px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap'
  };

  return (
    <div className="flex flex-col h-[65vh]">
      <div
        className={`tabs flex mb-6 w-full max-w-[1100px] h-14 mx-auto rounded-xl shadow-md ${
          theme === "dark" ? 'bg-[#1F222A]' : 'bg-white'
        }`}
      >
        <button
          className={`tab rounded-l-xl ${getTabClassNames(
            "Personal Details"
          )}`}
          style={tabButtonStyle}
          onClick={() => setActiveTab("Personal Details")}
        >
          Personal Details
        </button>
        <button
          className={`tab ${getTabClassNames("Plan")}`}
          style={tabButtonStyle}
          onClick={() => setActiveTab("Plan")}
        >
          Plan
        </button>
        <button
          className={`tab ${getTabClassNames("Security")}`}
          style={tabButtonStyle}
          onClick={() => setActiveTab("Security")}
        >
          Security
        </button>
        <button
          className={`tab rounded-r-xl ${getTabClassNames("Billings")}`}
          style={tabButtonStyle}
          onClick={() => setActiveTab("Billings")}
        >
          Billings
        </button>
      </div>
      <div
        className={`tab-content flex-1  rounded-xl p-6  scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent ${
          theme === "dark" 
            ? 'bg-[#1F222A] text-white' 
            : ' text-gray-800'
        }`}
      >
        {renderContent()}
      </div>
    </div>
  );
};

export default Tabs;
