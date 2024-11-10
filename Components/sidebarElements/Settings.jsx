"use client"
import React from 'react';
import Tabs from '../settings/Tabs';
import useTheme from "next-theme"
const Settings = () => {
  const { theme, setTheme } = useTheme()
  return ( 
    <div className={`relative w-full h-screen mx-auto px-[4vw] pt-[2vh] py-[.7vw] rounded-[0.417vw] shadow-lg justify-self-end ${theme==="dark" ? 'bg-[#1F222A] text-white' : 'bg-[#F2F4F7] text-black'}`}>
      <h1 className="text-[2vw] font-semibold mb-[.5vh]">Settings</h1>
      <p className=" text-[1.25vw] text-zinc-400 mb-[2vh]">Manage your account settings and preferences</p>
      <div className='h-[.1vh] w-full bg-zinc-400 mb-[3vh]'></div>
      <Tabs darkMode={theme==="dark"} />
      
    </div>
  );
};

export default Settings;
