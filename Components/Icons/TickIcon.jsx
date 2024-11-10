"use client"
import React from 'react'

const TickIcon = ({isActive}) => {
  return (
    <lord-icon
    src="https://cdn.lordicon.com/oqdmuxru.json"
    colors={`primary:${!isActive ? '#fff' : '#f8fafc'}`}
    trigger="hover"
    style={{width:'2vw',height:'2vw'}}>
</lord-icon>
  )
}

export default TickIcon