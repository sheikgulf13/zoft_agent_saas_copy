import React, { useState } from 'react';
import PersonalDetails from './PersonalDetails';
import Security from './Security';
import Billings from './Billings';
import Plan from './Plan';
import useTheme from "next-theme"
const Tabs = () => {
  const [activeTab, setActiveTab] = useState('Personal Details');
  const { theme, setTheme } = useTheme()
  const renderContent = () => {
    switch (activeTab) {
      case 'Personal Details':
        return <PersonalDetails/>;
      case 'Security':
        return <Security  />;
      case 'Billings':
        return <Billings  />;
      case 'Plan':
        return <Plan />;
      default:
        return null;
    }
  };

  const getTabClassNames = (tabName) => {
    const baseClasses = 'flex-1 py-[0.8vh] px-[0.833vw] text-center';
    const activeClasses = theme==="dark" ? 'bg-[#1A1C22] text-white border-b-[.3vh] border-[#EB1CD6]' : 'bg-white text-black border-b-[.3vh] border-[#EB1CD6]';
    const inactiveClasses = theme==="dark" ? 'bg-[#2A2E37] text-white' : 'bg-gray-200 text-black';

    return `${baseClasses} ${activeTab === tabName ? activeClasses : inactiveClasses}`;
  };

  return (
    <div>
    <div className={`tabs flex mb-[3.2vh] w-[39vw] Hmd  h-[5vh]  rounded-[0.417vw] shadow-md ${theme==="dark"} ? 'bg-[#1F222A]' : 'bg-white'}`}>
      <button
        className={`tab rounded-s-[0.417vw] ${getTabClassNames('Personal Details')}`}
        onClick={() => setActiveTab('Personal Details')}
      >
        Personal Details
      </button>
      <button
        className={`tab ${getTabClassNames('Security')}`}
        onClick={() => setActiveTab('Security')}
      >
        Security
      </button>
      <button
        className={`tab ${getTabClassNames('Billings')}`}
        onClick={() => setActiveTab('Billings')}
      >
        Billings
      </button>
      <button
        className={`tab rounded-e-lg ${getTabClassNames('Plan')}`}
        onClick={() => setActiveTab('Plan')}
      >
        Plan
      </button>
    </div>
    <div className={`tab-content ${theme==="dark"} ? 'bg-[#1F222A] text-white' : 'bg-[#F2F4F7] text-black'}`}>
      {renderContent()}
    </div>
  </div>

  );
};

export default Tabs;
