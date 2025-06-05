'use client';

import React from 'react';
import useTheme from "next-theme";
import PricingPage from '@/app/pricing/page';

const Plan = () => {
  const { theme } = useTheme();
  
  return (
    <div className='w-full text-base min-h-screen '>
      <div className={`pt-8 px-6 max-w-7xl mx-auto ${theme === "dark" ? 'text-white' : 'text-black'}`}>
        <h1 className='text-3xl font-bold text-[#2D3377] mb-3 tracking-tight'>Pricing Plans</h1>
        <p className='text-base text-gray-500 dark:text-gray-400 mb-8 max-w-2xl'>
          Choose the right plan for your needs. We offer flexible options to help you scale your business.
        </p>
      </div>
      
      {/* Scrollable Pricing Page container */}
      <div className='h-full overflow-hidden pb-8 px-6 w-full max-w-7xl mx-auto'>
        <div className=' h-full dark:bg-gray-800 rounded-2xl p-6'>
          <PricingPage />
        </div>
      </div>
    </div>
  );
};

export default Plan;