"use client"
import React from 'react'

const DotIcon = ({isActive}) => {
  return (
    <lord-icon
    src="https://cdn.lordicon.com/lqxfrxad.json"
    trigger="hover"
    colors="primary: #737791 ,secondary:#737791"
    state="loop-transparency"
    style={{width:'1.5vw',height:'1.5vw', rotate: '90deg', cursor: 'pointer'}}>
</lord-icon>
  )
}

export default DotIcon