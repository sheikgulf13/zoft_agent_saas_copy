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
    const baseClasses = "flex-1 py-2 px-4 text-center";
    const activeClasses =
      theme === "dark"
        ? "bg-[#1A1C22] text-white border-b-2 border-[#EB1CD6]"
        : "bg-white text-black border-b-2 border-[#EB1CD6]";
    const inactiveClasses =
      theme === "dark" ? "bg-[#2A2E37] text-white" : "bg-gray-200 text-black";

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
    <div className="">
      <div
        className={`tabs flex mb-4 w-full max-w-[1000px] h-12 rounded-md shadow-md text-base ${
          theme === "dark" ? 'bg-[#1F222A]' : 'bg-white'
        }`}
      >
        <button
          className={`tab rounded-l-md ${getTabClassNames(
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
          className={`tab rounded-r-md ${getTabClassNames("Billings")}`}
          style={tabButtonStyle}
          onClick={() => setActiveTab("Billings")}
        >
          Billings
        </button>
      </div>
      <div
        className={`tab-content flex-1 ${
          theme === "dark" ? 'bg-[#1F222A] text-white' : 'bg-[#F2F4F7] text-black'
        }`}
      >
        {renderContent()}
      </div>
    </div>
  );
};

export default Tabs;
