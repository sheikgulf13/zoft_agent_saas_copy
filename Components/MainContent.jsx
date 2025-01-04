// components/MainContent.jsx
"use client";
import React from 'react';
import Header from './Header';
import  useTheme  from 'next-theme';
import { getSessionId } from '@/utility/api-config';

const MainContent = () => {
  const { theme, setTheme } = useTheme()
  const sessionId = getSessionId();

  console.log("Session id", sessionId);
  return (
    <div className={`p- flex-1 ${theme === 'dark' ? 'bg-[#1F222A] text-white' : 'bg-[#F2F4F7]'}`}>
      <Header />
    </div>
  );
};

export default MainContent;
