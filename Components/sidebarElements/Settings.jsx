"use client"
import React from 'react';
import Tabs from '../settings/Tabs';
import useTheme from "next-theme"

const Settings = () => {
  const { theme, setTheme } = useTheme()
  return ( 
    <div className={`relative w-full h-screen mx-auto px-8 pt-6 pb-8 rounded-xl shadow-lg justify-self-end overflow-visible ${
      theme === "dark" 
        ? 'bg-gradient-to-br from-[#1A1C22] to-[#1F222A] text-white' 
        : 'bg-gradient-to-br from-white to-[#F2F4F7] text-gray-800'
    }`}>
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-3 bg-gradient-to-r from-[#2D3377] to-[#4D55CC] bg-clip-text text-transparent">
            Settings
          </h1>
          <p className="text-base text-gray-500 dark:text-gray-400">
            Manage your account settings and preferences
          </p>
        </div>

        <div className={`h-px w-full bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-700 to-transparent mb-8`}></div>
        
        <div className="bg-white dark:bg-[#1F222A] rounded-xl shadow-md p-6">
          <Tabs darkMode={theme === "dark"} />
        </div>
      </div>
    </div>
  );
};

export default Settings;
