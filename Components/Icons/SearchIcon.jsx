"use client"
import React from 'react'

const SearchIcon = ({left, className,isActive}) => {
  return (
    <lord-icon
    src="https://cdn.lordicon.com/kkvxgpti.json"
    target={`.${className}`}
    colors={`primary:${!isActive ? '#737791' : '#f8fafc'}`}
    trigger="hover"
    style={{width:'1.5vw',height:'1.5vw',position: 'absolute', left:`${left}`}}>
</lord-icon>
  )
}

export default SearchIcon