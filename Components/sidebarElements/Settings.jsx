"use client"
import React from 'react';
import Tabs from '../settings/Tabs';
import useTheme from "next-theme"

const Settings = () => {
  const { theme, setTheme } = useTheme()
  return ( 
    <div className={`relative w-full h-screen mx-auto px-14 pt-6 pb-8 rounded-xl shadow-lg justify-self-end overflow-y-scroll ${
      theme === "dark" 
        ? 'bg-gradient-to-br from-[#1A1C22] to-[#1F222A] text-white' 
        : 'bg-gradient-to-br from-white to-[#F2F4F7] text-gray-800'
    }`}>
      <div className=" mx-auto">
        <div className="mb-8 mx-10">
          <h1 className="text-2xl font-bold mb-3 bg-gradient-to-r from-[#2D3377] to-[#4D55CC] bg-clip-text text-transparent">
            Settings
          </h1>
          <p className="text-base text-gray-500 dark:text-gray-400">
            Manage your account settings and preferences
          </p>
        </div>

        <div className={`h-px w-full bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-700 to-transparent mb-8`}></div>
        
        <div className=" rounded-xl p-6">
          <Tabs darkMode={theme === "dark"} />
        </div>
      </div>
    </div>
  );
};

export default Settings;
