"use client"
import React from 'react'

const SunIcon = ({className,isActive}) => {
  return (
    <lord-icon
    src="https://cdn.lordicon.com/akfyycou.json"
    trigger="hover"
    stroke="light"
    target={`.${className}`}
    colors={`primary:${!isActive ? '#737791' : '#f8fafc'}`}
    style={{width:'1.5vw',height:'1.5vw'}}>
</lord-icon>
  )
}

export default SunIcon