"use client"
import React from 'react'
import GradientButton from '../buttons/GradientButton'
import { useSelector } from 'react-redux'
import useTheme from "next-theme"
import GradientButton2 from '../buttons/GradientButton2'
const Profile = () => {
    const {displayName, email, phoneNumber, profilePicture} = useSelector((state)=> state.profile)
    const { theme, setTheme } = useTheme()
  return (
    <div className='w-full h-screen relative flex justify-center items-center'>
        <div className={`w-2/3 h-2/3  rounded-[0.833vw] relative px-[3vw] py-[2vw] ${theme==="dark" ? 'bg-[#1A1C22] text-white' : 'bg-white text-black'}`}>
            <div className={`top h-1/3 w-full border-b-[0.052vw] border-zinc-400 flex justify-between items-center px-[2vw] ${theme==="dark" ? 'bg-[#1A1C22] text-white' : 'bg-white text-black'}`}>
                <div className='h-[14vh] w-[14vh]  rounded-full -mt-[6vw] border-[0.5vw] border-zinc-300 relative overflow-hidden'>
                    <img className='w-full h-full object-cover' src={profilePicture} alt="" />
                </div>
                <GradientButton2
                text='edit profile'
                className='bg-gradient-to-r from-[#EB1CD6]  to-[#F4A36F] text-white px-[2vw] py-[1vh] font-semibold '
                />
            </div>
            <div className={`btm h-2/3 w-full  rounded-[0.625vw] mt-[1.6vh] ${theme==="dark" ? 'bg-[#1A1C22] text-white' : 'bg-white text-black'}`}>
                <div className=' h-1/3 w-full flex justify-between items-center px-[3vw] '>
                    <div className='flex flex-col gap-[1vw] '>
                        <h1 className='capitalize text-[1.25vw] font-medium -ml-[1vw]'>display name</h1>
                        <h6 className='text-[1.042vw] capitalize font-normal'>{displayName}</h6>
                    </div>
                    <button className={` px-[2vw] py-[.3vw] rounded-[0.625vw] capitalize text-[1vw] font-semibold  ${theme==="dark" ? 'bg-[#1F222A] text-white' : 'bg-zinc-200 text-black'}`}>edit</button>
                </div>

                <div className=' h-1/3 w-full flex justify-between items-center px-[3vw] '>
                    <div className='flex flex-col gap-[1vw] '>
                        <h1 className='capitalize text-[1.25vw] font-medium -ml-[1vw]'>email</h1>
                        <h6 className='text-[1.042vw] capitalize font-normal'>{email}</h6>
                    </div>
                    <button className={` px-[2vw] py-[.3vw] rounded-[0.625vw] capitalize text-[1vw] font-semibold  ${theme==="dark" ? 'bg-[#1F222A] text-white' : 'bg-zinc-200 text-black'}`}>edit</button>
                </div>

                <div className=' h-1/3 w-full flex justify-between items-center px-[3vw] '>
                    <div className='flex flex-col gap-[1vw] '>
                        <h1 className='capitalize text-[1.25vw] font-medium -ml-[1vw]'>phone Number</h1>
                        
                        <h6 className='text-[1.042vw] capitalize font-normal'>{phoneNumber ? phoneNumber : "You haven't added a phone number yet"}</h6>
                    </div>
                    <button className={` px-[2vw] py-[.3vw] rounded-[0.625vw] capitalize text-[1vw] font-semibold  ${theme==="dark" ? 'bg-[#1F222A] text-white' : 'bg-zinc-200 text-black'}`}>edit</button>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Profile