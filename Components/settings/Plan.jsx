'use client';

import React from 'react';
import { Box } from '@mui/material';
import useTheme from "next-theme";
import PricingPage from '@/app/pricing/page';

const Plan = () => {
  const { theme } = useTheme();
  
  return (
    <div className='w-full text-base'>
      <div className={`pt-4 px-4 ${theme === "dark" ? 'text-white' : 'text-black'}`}>
        <h1 className='text-2xl font-semibold mb-2'>Pricing Plans</h1>
        <p className='text-sm text-zinc-400 mb-4'>Choose the right plan for your needs</p>
      </div>
      
      {/* Scrollable Pricing Page container with fixed width */}
      <Box sx={{ 
        height: 'calc(100vh - 280px)', 
        overflow: 'auto',
        paddingBottom: 2,
        paddingX: 2,
        width: '100%',
        maxWidth: '1200px',
        mx: 'auto'
      }}>
        <PricingPage />
      </Box>
    </div>
  );
};

export default Plan;