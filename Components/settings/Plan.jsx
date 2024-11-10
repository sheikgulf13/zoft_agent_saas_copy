import React from 'react'
import useTheme from "next-theme"
const Plan = () => {
  const { theme, setTheme } = useTheme()
  return (
    <div className='w-full h-screen'>
      <div className='flex justify-between items-center'>
      <div className='flex flex-col items- w-fit gap-[1vw]  '>
        <h1 className='H25 capitalize text-center'>current plan</h1>
        <div className={` w-[20vw] h-[7vh] rounded-[0.833vw] flex justify-start items-center px-[2vw] border-[0.052vw] border-[#EB1CD6] shadow-lg  ${theme==="dark" ? 'bg-[#1A1C22] text-white' : 'bg-white text-black'}`}>
          <h1 className='text-[1.042vw] capitalize font-semibold'>starter</h1>
        </div>
      </div>

      <div className='flex flex-col items-center w-fit  gap-[1vw]  '>
        <h1 className='H25 capitalize text-center'>upgrade plan</h1>
        <div className={` w-[20vw] h-[7vh] rounded-[0.833vw] flex justify-start items-center px-[2vw] border-[0.052vw] border-[#EB1CD6] shadow-lg  ${theme==="dark" ? 'bg-[#1A1C22] text-white' : 'bg-white text-black'}`}>
          <h1 className='text-[1.042vw] capitalize font-semibold'>starter</h1>
        </div>
      </div>
      </div>
    

      <div className='flex flex-col items-center w-full gap-[1vw]  mt-[10vw] '>
        <h1 className='H25 capitalize text-center'>growth plan</h1>
        <div className={` w-[20vw] h-[7vh] rounded-[0.833vw] flex justify-start items-center px-[2vw] border-[0.052vw] border-[#EB1CD6] shadow-lg  ${theme==="dark" ? 'bg-[#1A1C22] text-white' : 'bg-white text-black'}`}>
          <h1 className='text-[1.042vw] capitalize font-semibold'>growth</h1>
        </div>
      </div>

      
    </div>
  )
}

export default Plan