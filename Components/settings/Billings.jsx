import React from 'react'
import GradientButton from '../buttons/GradientButton'
import { FaPlus } from 'react-icons/fa'
import { useDispatch, useSelector } from 'react-redux'
import useTheme from 'next-theme'
import CheckBox from '../buttons/CheckBox'
const Billings = () => {
  const { theme, setTheme } = useTheme()
  const dispatch = useDispatch()
  const { nameOnCard, expiry, cardNumber, cvv } = useSelector((state) => state.billing)

  return (
    <div className=' h-[70vh] overflow-scroll scroll'>
      <div className={`Hmd  w-[74vw] rounded-[0.417vw] mb-[3.84vh] relative px-[3vw] py-[1vw]  ${theme === "dark" ? 'bg-[#1F222A] text-white' : 'bg-white text-black'}`}>
      <div className='flex flex-col gap-[1vw] mb-[2vh]'>
              <h1 className='text-lg font-semibold capitalize'>payment method</h1>
              <h6 className='text-lg capitalize text-zinc-400'>update your billing details and address</h6>
      </div>
        <div className='flex w-full mb-[1vh]'>
          <div className='h-[20vh] w-1/2  flex flex-col gap-[4vw] '>
            
            <div className='flex flex-col gap-[1vw] items-start '>
              <h1 className='text-lg font-semibold capitalize'>card details</h1>
              <GradientButton
                Icon={FaPlus}
                text='add another card'
                className='contentButton bg-gradient-to-r from-[#EB1CD6] to-[#F4A36F] text-white px-[1.667vw] py-[1.2vh] text-lg'
              />
            </div>
          </div>
          <div className='w-1/2 flex flex-col justify-between gap-[2vw]'>
            <div className='h-1/2 w-full flex justify-between items-center'>
              <div className='flex flex-col gap-[1vw] '>
                <label className='text-lg font-semibold capitalize' htmlFor="nameOnCard">
                  name on card
                </label>
                <input value={nameOnCard} className={`text-base border-[0.052vw] border-zinc-300 text-zinc-400 px-[1.25vw] py-[0.8vh] rounded-[0.313vw]  ${theme === "dark" ? 'bg-[#1F222A] text-white' : 'bg-white text-black'}`} type="text" name="" id="" />
              </div>

              <div className='flex flex-col gap-[1vw] '>
                <label className='text-lg font-semibold capitalize' htmlFor="expiry">
                  expiry
                </label>
                <input value={expiry} className={`text-base border-[0.052vw] border-zinc-300 text-zinc-400 pl-[1.25vw] pr-[0.6vw] py-[0.8vh] rounded-[0.313vw]  ${theme === "dark" ? 'bg-[#1F222A] text-white' : 'bg-white text-black'}`} type="text" name='' id='' />
              </div>

            </div>
            <div className='h-1/2 w-full flex justify-between items-center'>
              <div className='flex flex-col gap-[1vw]'>
                <label className='text-lg capitalize font-semibold' htmlFor="cardNumber">
                  card number
                </label>
                <input value={cardNumber} className={`text-base border-[0.052vw] border-zinc-300 text-zinc-400 pl-[1.25] px-[1.25vw] py-[0.8vh] rounded-[0.313vw]  ${theme === "dark" ? 'bg-[#1F222A] text-white' : 'bg-white text-black'}`} type="text" name="" id="" />
              </div>

              <div className='flex flex-col gap-[1vw] '>
                <label className='text-lg uppercase font-semibold' htmlFor="cvv">
                  cvv
                </label>
                <input value={cvv} className={`text-base border-[0.052vw] border-zinc-300 pl-[1.4vw] text-zinc-400 py-[0.8vh] rounded-[0.313vw]  ${theme === "dark" ? 'bg-[#1F222A] text-white' : 'bg-white text-black'}`} type="text" name='' id='' />
              </div>

            </div>
          </div>
          </div>
          <div className='h-[.1vh] w-[92%] mt-[3vh] bg-zinc-400 mb-[1vh] rounded-[0.417vw] right-[4.162vw]'></div>
          <div className=' mt-[2vh] flex justify-between items- w-[92%] '>
            <div className='flex flex-col gap-[1vw] '>
              <h1 className='text-lg capitalize font-medium'>contact email</h1>
              <h6 className='text-base capitalize text-zinc-400'>where should invoices to be send</h6>
            </div>
            <div className='flex flex-col gap-[.5vw]'>
              <div className='flex items-center gap-[1vw] pr-[6vw] '>
                <div className='h-[3vh] w-[3vh] border-[0.052vw] border-black rounded-full flex justify-center items-center'>
                  <div className='h-[1.5vh] w-[1.5vh] bg-black rounded-full '></div>
                </div>
                <div className='flex flex-col'>
                  <h6 className='text-base capitalize'>send to my contact email</h6>
                  <h6 className='capitalize text-zinc-400 text-sm'>kayzen@gmail.com</h6>
                </div>
              </div>

              <div className='flex items-center gap-[1vw] pr-[6vw] '>
                <div className='h-[3vh] w-[1.5vw] border-[0.052vw] border-black rounded-full flex justify-center items-center'>
                  <div className='h-[1.5vh] w-[0.781vw] bg-black rounded-full '></div>
                </div>
                <div className='flex flex-col'>
                  <h6 className='text-base capitalize'>send to another email</h6>
                </div>
              </div>

            </div>
          </div>
        
      </div>
      <div className='h-[.1vh] w-[74vw] bg-zinc-400 mb-[3.5vh] rounded-[0.417vw]'></div>
      <div className={`w-[74vw] rounded-[0.417vw] relative  px-[1vw] py-[0.8vh]  ${theme === "dark" ? 'bg-[#1F222A] text-white' : 'bg-white text-black'}`}>
        <h1 className='text-lg capitalize font-medium mb-[.8vh]'>billing history</h1>
        <h6 className='capitalize text-base text-zinc-400 mb-[.8vh]'>see the transactions you made</h6>
        <table className='w-full rounded-[0.417vw] '>
          <thead className={` w-full h-[4vh] rounded-[0.417vw]    ${theme === "dark" ? 'bg-[#1A1C22] text-white' : 'bg-white text-black'}`}>
            <tr className={`rounded-[0.417vw] capitalize text-left px-[2.5vw] mb-[1vh]  ${theme === "dark" ? 'bg-[#1A1C22] text-white' : 'bg-[#F2F4F7] text-black'}`}>
            <th className="p-[0.208vw]">
                  <CheckBox/>
                </th>
                <th className='text-lg w-fit'>invoice</th>
              <th className='text-lg w-fit'>amount</th>
              <th className='text-lg w-fit'>date</th>
              <th className='text-lg w-fit'>status</th>
              <th className='text-lg w-fit'>plan</th>
              <th className='text-lg '>action</th>
            </tr>
          </thead>
          <tbody className='text-lg '>
            <tr className={`w-full  h-[5vh] border-b-[0.052vw] capitalize border-b-zinc-300 px-[1.25vw]  ${theme === "dark" ? 'bg-[#1A1C22] text-white' : 'bg-white text-black'}`}>
            <td className="p-[0.208vw]">
                  <CheckBox/>
                </td>
              <td>basic june plan</td>
              <td>999</td>
              <td>june 10 2023</td>
              <td>paid</td>
              <td>basic plan</td>
              <td></td>
            </tr>

            <tr className={`w-full  h-[5vh] border-b-[0.052vw] capitalize border-b-zinc-300 ${theme === "dark" ? 'bg-[#1A1C22] text-white' : 'bg-white text-black'}`}>
            <td className="p-[0.208vw] ">
            <CheckBox/>
                </td>
              <td>professional june plan</td>
              <td>10000</td>
              <td>june 10 2023</td>
              <td>paid</td>
              <td>professional plan</td>
              <td></td>

            </tr>

            <tr className={`w-full  h-[5vh] capitalize border-b-[0.052vw] border-b-zinc-300 ${theme === "dark" ? 'bg-[#1A1C22] text-white' : 'bg-white text-black'}`}>
            <td className="p-[0.208vw]">
            <CheckBox/>
                </td>
              <td>basic june plan</td>
              <td>999</td>
              <td>june 10 2023</td>
              <td>paid</td>
              <td>basic plan</td>
              <td></td>

            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Billings