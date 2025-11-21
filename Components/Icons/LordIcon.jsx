"use client"
import React from 'react';

const PieIcon = ({isActive, className, style}) => {
  // Extract the first class name for the target selector
  const targetClass = className ? className.split(' ')[0] : 'Pie';
  return (
    <lord-icon
      src="https://cdn.lordicon.com/pqirzoux.json"
      trigger="hover"
      colors={`primary:${!isActive ? '#737791' : '#f8fafc'}`}
      target={`.${targetClass}`}
      className={className}
      style={{width: "1.2vw", height: "1.2vw", ...style}}
    />
  );
};

export default PieIcon;
// `${className}`