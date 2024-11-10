"use client"
import React from 'react'

const AvatarIcon = ({className,isActive}) => {
  return (
    <lord-icon
    src="https://cdn.lordicon.com/zkpqhifb.json"
    trigger="hover"
    state="hover-looking-around"
    target={`.${className}`}    
    colors={`primary:${!isActive ? '#737791' : '#f8fafc'}`}
    style={{width:'1.5vw',height:'1.5vw'}}>
</lord-icon>
  )
}

export default AvatarIcon