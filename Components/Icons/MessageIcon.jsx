"use client"
import React from 'react'

const MessageIcon = ({className, isActive, style}) => {
    // Extract the first class name for the target selector
    const targetClass = className ? className.split(' ')[0] : 'Message';
    return (
        <lord-icon
            src="https://cdn.lordicon.com/fdxqrdfe.json"
            trigger="hover"
            colors={`primary:${! isActive ? '#737791' : '#f8fafc'}`}
            target={`.${targetClass}`}
            className={className}
            style={{width: "1.2vw", height: "1.2vw", ...style}}
        >
        </lord-icon>
    )
}

export default MessageIcon