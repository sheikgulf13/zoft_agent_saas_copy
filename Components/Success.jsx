"use client"
import React, { useEffect } from 'react';
import GradientButton from '@/Components/buttons/GradientButton'; // Adjust the import path as necessary
import { useRouter } from 'next/navigation';
import useTheme from 'next-theme';
import { useDispatch } from 'react-redux';
import { setBotName, setDescription, setLoading, setPrompt } from '@/store/reducers/botSlice';
import { setrawText, seturl } from '@/store/reducers/dataSourceSlice';
import { setFile } from '@/store/reducers/fileSlice';

const Success = () => {
  const router = useRouter();
  const {theme, setTheme} = useTheme()
  const dispatch= useDispatch();
  const navigateHome = () => {
    router.push('/chats');
  };
  useEffect(()=>{
    dispatch(setBotName(''));
    dispatch(setDescription(''))
    dispatch(setPrompt(''))
    dispatch(setLoading(true))
    dispatch(seturl([]))
    dispatch(setrawText(''))
    dispatch(setFile(null))
  },[])
  return (
    <div className={`flex items-center justify-center min-h-screen ${theme === "dark" ? 'bg-[#1F222A] text-white' : 'bg-[#F2F4F7] text-black'}`}>
      <div className={` p-[2vw] rounded-[.5vw] shadow-lg text-center ${theme === "dark" ? 'bg-[#1F222A] text-white' : 'bg-[#F2F4F7] text-black'}`}>
        <div className="flex items-center justify-center w-[4vw] h-[4vw] mx-auto mb-[3vh] bg-green-500 rounded-full">
          <svg
            className="w-[2vw] h-[2vw] text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 13l4 4L19 7"
            ></path>
          </svg>
        </div>
        <h2 className="H8 font-bold mb-[1vh] text-gray-800">
          Agent Created Successfully!
        </h2>
        <p className="text-gray-600 mb-[3vh] H1">
          Your agent has been created successfully and is ready to use.
        </p>
        <GradientButton
          text="Go to ChatDashboard"
          onClick={navigateHome}
          className="bg-gradient-to-r mx-auto from-[#EB1CD6] to-[#F4A36F] text-white px-[1.4vw] py-[1.4vh] rounded-full"
        />
      </div>
    </div>
  );
};

export default Success;
