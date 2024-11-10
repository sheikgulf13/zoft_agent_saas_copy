"use client"
import React from 'react';

const PieIcon = ({isActive,className}) => {
  return (
    <lord-icon
      src="https://cdn.lordicon.com/pqirzoux.json"
      trigger="hover"
      colors={`primary:${!isActive ? '#737791' : '#f8fafc'}`}
      target={`.${className}`}
      className={className}
    />
  );
};

export default PieIcon;
// `${className}`