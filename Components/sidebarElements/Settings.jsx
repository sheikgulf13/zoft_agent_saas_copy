"use client"
import React from 'react';
import Tabs from '../settings/Tabs';
import useTheme from "next-theme"
const Settings = () => {
  const { theme, setTheme } = useTheme()
  return ( 
    <div className={`relative w-full h-screen mx-auto px-6 pt-4 py-3 rounded-md shadow-lg justify-self-end overflow-visible ${theme==="dark" ? 'bg-[#1F222A] text-white' : 'bg-[#F2F4F7] text-black'}`}>
      <h1 className="text-3xl font-semibold mb-2">Settings</h1>
      <p className="text-base text-zinc-400 mb-4">Manage your account settings and preferences</p>
      <div className='h-px w-full bg-zinc-400 mb-6'></div>
      <Tabs darkMode={theme==="dark"} />
      
    </div>
  );
};

export default Settings;
