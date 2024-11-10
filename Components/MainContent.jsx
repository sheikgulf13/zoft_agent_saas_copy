// components/MainContent.jsx
"use client";
import React from 'react';
import Header from './Header';
import  useTheme  from 'next-theme';

const MainContent = () => {
  const { theme, setTheme } = useTheme()
  return (
    <div className={`p- flex-1 ${theme === 'dark' ? 'bg-[#1F222A] text-white' : 'bg-[#F2F4F7]'}`}>
      <Header />
    </div>
  );
};

export default MainContent;
