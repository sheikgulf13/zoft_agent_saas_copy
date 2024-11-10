"use client"
import React from 'react';

const LeftArrowIcon = ({ className ,isActive}) => {
    return (
        <lord-icon
            src="https://cdn.lordicon.com/rmkahxvq.json" // Replace with the actual URL of the left arrow Lordicon
            trigger="hover"
            target={`.${className}`}
            colors={`primary:${!isActive ? '#737791' : '#f8fafc'}`}
            style={{ width: '1.5vw', height: '1.5vw' }}
        >
        </lord-icon>
    );
};

export default LeftArrowIcon;
