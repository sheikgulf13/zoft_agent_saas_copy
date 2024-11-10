"use client"
import React from 'react'

const SettingIcon = ({className,isActive}) => {
  return (
    <lord-icon
    src="https://cdn.lordicon.com/lecprnjb.json"
    trigger="hover"
    colors={`primary:${!isActive ? '#737791' : '#f8fafc'}`}
    target={`.${className}`}
    >
</lord-icon>
  )
}

export default SettingIcon
