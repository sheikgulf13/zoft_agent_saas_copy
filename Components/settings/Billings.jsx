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
    <div className='h-[70vh] overflow-scroll scroll max-w-[1200px] mx-auto'>
      <div className={`w-full rounded-md mb-8 relative px-8 py-4 ${theme === "dark" ? 'bg-[#1F222A] text-white' : 'bg-white text-black'}`}>
      <div className='flex flex-col gap-4 mb-4'>
              <h1 className='text-lg font-semibold capitalize'>payment method</h1>
              <h6 className='text-lg capitalize text-zinc-400'>update your billing details and address</h6>
      </div>
        <div className='flex w-full mb-4'>
          <div className='h-[20vh] w-1/2 flex flex-col gap-8'>
            
            <div className='flex flex-col gap-4 items-start'>
              <h1 className='text-lg font-semibold capitalize'>card details</h1>
              <GradientButton
                Icon={FaPlus}
                text='add another card'
                className='contentButton bg-gradient-to-r from-[#EB1CD6] to-[#F4A36F] text-white px-6 py-2 text-lg'
              />
            </div>
          </div>
          <div className='w-1/2 flex flex-col justify-between gap-8'>
            <div className='h-1/2 w-full flex justify-between items-center'>
              <div className='flex flex-col gap-4'>
                <label className='text-lg font-semibold capitalize' htmlFor="nameOnCard">
                  name on card
                </label>
                <input value={nameOnCard} className={`text-base border border-zinc-300 text-zinc-400 px-4 py-2 rounded-md ${theme === "dark" ? 'bg-[#1F222A] text-white' : 'bg-white text-black'}`} type="text" name="" id="" />
              </div>

              <div className='flex flex-col gap-4'>
                <label className='text-lg font-semibold capitalize' htmlFor="expiry">
                  expiry
                </label>
                <input value={expiry} className={`text-base border border-zinc-300 text-zinc-400 pl-4 pr-2 py-2 rounded-md ${theme === "dark" ? 'bg-[#1F222A] text-white' : 'bg-white text-black'}`} type="text" name='' id='' />
              </div>

            </div>
            <div className='h-1/2 w-full flex justify-between items-center'>
              <div className='flex flex-col gap-4'>
                <label className='text-lg capitalize font-semibold' htmlFor="cardNumber">
                  card number
                </label>
                <input value={cardNumber} className={`text-base border border-zinc-300 text-zinc-400 px-4 py-2 rounded-md ${theme === "dark" ? 'bg-[#1F222A] text-white' : 'bg-white text-black'}`} type="text" name="" id="" />
              </div>

              <div className='flex flex-col gap-4'>
                <label className='text-lg uppercase font-semibold' htmlFor="cvv">
                  cvv
                </label>
                <input value={cvv} className={`text-base border border-zinc-300 pl-4 text-zinc-400 py-2 rounded-md ${theme === "dark" ? 'bg-[#1F222A] text-white' : 'bg-white text-black'}`} type="text" name='' id='' />
              </div>

            </div>
          </div>
          </div>
          <div className='h-[1px] w-[92%] mt-6 bg-zinc-400 mb-4 rounded-md'></div>
          <div className='mt-4 flex justify-between items- w-[92%]'>
            <div className='flex flex-col gap-4'>
              <h1 className='text-lg capitalize font-medium'>contact email</h1>
              <h6 className='text-base capitalize text-zinc-400'>where should invoices to be send</h6>
            </div>
            <div className='flex flex-col gap-2'>
              <div className='flex items-center gap-4 pr-6'>
                <div className='h-[24px] w-[24px] border border-black rounded-full flex justify-center items-center'>
                  <div className='h-[12px] w-[12px] bg-black rounded-full'></div>
                </div>
                <div className='flex flex-col'>
                  <h6 className='text-base capitalize'>send to my contact email</h6>
                  <h6 className='capitalize text-zinc-400 text-sm'>kayzen@gmail.com</h6>
                </div>
              </div>

              <div className='flex items-center gap-4 pr-6'>
                <div className='h-[24px] w-[24px] border border-black rounded-full flex justify-center items-center'>
                  <div className='h-[12px] w-[12px] bg-black rounded-full'></div>
                </div>
                <div className='flex flex-col'>
                  <h6 className='text-base capitalize'>send to another email</h6>
                </div>
              </div>

            </div>
          </div>
        
      </div>
      <div className='h-[1px] w-full bg-zinc-400 mb-6 rounded-md'></div>
      <div className={`w-full rounded-md relative px-4 py-3 ${theme === "dark" ? 'bg-[#1F222A] text-white' : 'bg-white text-black'}`}>
        <h1 className='text-lg capitalize font-medium mb-2'>billing history</h1>
        <h6 className='capitalize text-base text-zinc-400 mb-2'>see the transactions you made</h6>
        <table className='w-full rounded-md'>
          <thead className={`w-full h-[32px] rounded-md ${theme === "dark" ? 'bg-[#1A1C22] text-white' : 'bg-white text-black'}`}>
            <tr className={`rounded-md capitalize text-left px-6 mb-4 ${theme === "dark" ? 'bg-[#1A1C22] text-white' : 'bg-[#F2F4F7] text-black'}`}>
            <th className="p-1">
                  <CheckBox/>
                </th>
                <th className='text-lg w-fit'>invoice</th>
              <th className='text-lg w-fit'>amount</th>
              <th className='text-lg w-fit'>date</th>
              <th className='text-lg w-fit'>status</th>
              <th className='text-lg w-fit'>plan</th>
              <th className='text-lg'>action</th>
            </tr>
          </thead>
          <tbody className='text-lg'>
            <tr className={`w-full h-[40px] border-b border-b-zinc-300 px-4 ${theme === "dark" ? 'bg-[#1A1C22] text-white' : 'bg-white text-black'}`}>
            <td className="p-1">
                  <CheckBox/>
                </td>
              <td>basic june plan</td>
              <td>999</td>
              <td>june 10 2023</td>
              <td>paid</td>
              <td>basic plan</td>
              <td></td>
            </tr>

            <tr className={`w-full h-[40px] border-b border-b-zinc-300 ${theme === "dark" ? 'bg-[#1A1C22] text-white' : 'bg-white text-black'}`}>
            <td className="p-1">
            <CheckBox/>
                </td>
              <td>professional june plan</td>
              <td>10000</td>
              <td>june 10 2023</td>
              <td>paid</td>
              <td>professional plan</td>
              <td></td>

            </tr>

            <tr className={`w-full h-[40px] capitalize border-b border-b-zinc-300 ${theme === "dark" ? 'bg-[#1A1C22] text-white' : 'bg-white text-black'}`}>
            <td className="p-1">
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