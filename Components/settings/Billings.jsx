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
      <div className={`w-full rounded-xl mb-8 relative px-8 py-6 backdrop-blur-sm ${theme === "dark" ? 'bg-[#1F222A]/95 text-white' : 'bg-white/95 text-black'}`}>
        <div className='flex flex-col gap-3 mb-10'>
          <h1 className='text-xl font-semibold capitalize text-[#2D3377]'>payment method</h1>
          <h6 className='text-base capitalize text-zinc-500'>update your billing details and address</h6>
        </div>
        <div className='flex w-full mb-6'>
          <div className='h-[20vh] w-1/2 flex flex-col gap-8'>
            <div className='flex flex-col gap-4 items-start'>
              <h1 className='text-lg font-semibold capitalize text-[#2D3377]'>card details</h1>
              <GradientButton
                Icon={FaPlus}
                text='add another card'
                className='contentButton bg-gradient-to-r from-[#2D3377] to-[#4A4F8C] text-white px-5 py-2 text-sm rounded-lg hover:shadow-lg hover:shadow-[#2D3377]/20 transition-all duration-300 transform hover:-translate-y-0.5'
              />
            </div>
          </div>
          <div className='w-1/2 flex flex-col justify-between gap-8'>
            <div className='h-1/2 w-full flex justify-between items-center'>
              <div className='flex flex-col gap-3'>
                <label className='text-sm font-medium capitalize text-[#2D3377]' htmlFor="nameOnCard">
                  name on card
                </label>
                <input 
                  value={nameOnCard} 
                  className={`text-sm border-2 border-[#2D3377]/10 px-4 py-2.5 rounded-lg focus:border-[#2D3377] focus:ring-2 focus:ring-[#2D3377]/20 outline-none transition-all duration-300 ${
                    theme === "dark" ? 'bg-[#1F222A] text-white placeholder-gray-400' : 'bg-white text-black placeholder-gray-500'
                  }`} 
                  type="text" 
                  name="" 
                  id="" 
                />
              </div>

              <div className='flex flex-col gap-3'>
                <label className='text-sm font-medium capitalize text-[#2D3377]' htmlFor="expiry">
                  expiry
                </label>
                <input 
                  value={expiry} 
                  className={`text-sm border-2 border-[#2D3377]/10 px-4 py-2.5 rounded-lg focus:border-[#2D3377] focus:ring-2 focus:ring-[#2D3377]/20 outline-none transition-all duration-300 ${
                    theme === "dark" ? 'bg-[#1F222A] text-white placeholder-gray-400' : 'bg-white text-black placeholder-gray-500'
                  }`} 
                  type="text" 
                  name='' 
                  id='' 
                />
              </div>
            </div>
            <div className='h-1/2 w-full flex justify-between items-center'>
              <div className='flex flex-col gap-3'>
                <label className='text-sm font-medium capitalize text-[#2D3377]' htmlFor="cardNumber">
                  card number
                </label>
                <input 
                  value={cardNumber} 
                  className={`text-sm border-2 border-[#2D3377]/10 px-4 py-2.5 rounded-lg focus:border-[#2D3377] focus:ring-2 focus:ring-[#2D3377]/20 outline-none transition-all duration-300 ${
                    theme === "dark" ? 'bg-[#1F222A] text-white placeholder-gray-400' : 'bg-white text-black placeholder-gray-500'
                  }`} 
                  type="text" 
                  name="" 
                  id="" 
                />
              </div>

              <div className='flex flex-col gap-3'>
                <label className='text-sm font-medium uppercase text-[#2D3377]' htmlFor="cvv">
                  cvv
                </label>
                <input 
                  value={cvv} 
                  className={`text-sm border-2 border-[#2D3377]/10 px-4 py-2.5 rounded-lg focus:border-[#2D3377] focus:ring-2 focus:ring-[#2D3377]/20 outline-none transition-all duration-300 ${
                    theme === "dark" ? 'bg-[#1F222A] text-white placeholder-gray-400' : 'bg-white text-black placeholder-gray-500'
                  }`} 
                  type="text" 
                  name='' 
                  id='' 
                />
              </div>
            </div>
          </div>
        </div>
        <div className='h-[1px] w-[92%] mt-6 bg-zinc-200 dark:bg-zinc-700 mb-6 rounded-md'></div>
        <div className='mt-6 flex justify-between items-center w-[92%]'>
          <div className='flex flex-col gap-3'>
            <h1 className='text-lg capitalize font-medium text-[#2D3377]'>contact email</h1>
            <h6 className='text-sm capitalize text-zinc-500'>where should invoices to be send</h6>
          </div>
          <div className='flex flex-col gap-3'>
            <div className='flex items-center gap-4 pr-6'>
              <div className='h-5 w-5 border-2 border-[#2D3377] rounded-full flex justify-center items-center cursor-pointer hover:border-[#4A4F8C] transition-colors duration-300'>
                <div className='h-2.5 w-2.5 bg-[#2D3377] rounded-full'></div>
              </div>
              <div className='flex flex-col'>
                <h6 className='text-sm capitalize'>send to my contact email</h6>
                <h6 className='capitalize text-zinc-500 text-xs'>kayzen@gmail.com</h6>
              </div>
            </div>

            <div className='flex items-center gap-4 pr-6'>
              <div className='h-5 w-5 border-2 border-[#2D3377] rounded-full flex justify-center items-center cursor-pointer hover:border-[#4A4F8C] transition-colors duration-300'>
                <div className='h-2.5 w-2.5 bg-[#2D3377] rounded-full'></div>
              </div>
              <div className='flex flex-col'>
                <h6 className='text-sm capitalize'>send to another email</h6>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className='h-[1px] w-full bg-zinc-200 dark:bg-zinc-700 mb-6 rounded-md'></div>
      <div className={`w-full rounded-xl relative px-6 py-5 shadow-lg backdrop-blur-sm ${theme === "dark" ? 'bg-[#1F222A]/95 text-white' : 'bg-white/95 text-black'}`}>
        <h1 className='text-xl capitalize font-medium text-[#2D3377] mb-2'>billing history</h1>
        <h6 className='capitalize text-sm text-zinc-500 mb-4'>see the transactions you made</h6>
        <table className='w-full rounded-lg overflow-hidden'>
          <thead className={`w-full ${theme === "dark" ? 'bg-[#1A1C22] text-white' : 'bg-[#F2F4F7] text-black'}`}>
            <tr className='rounded-lg capitalize text-left'>
              <th className="p-3">
                <CheckBox/>
              </th>
              <th className='text-sm font-medium p-3'>invoice</th>
              <th className='text-sm font-medium p-3'>amount</th>
              <th className='text-sm font-medium p-3'>date</th>
              <th className='text-sm font-medium p-3'>status</th>
              <th className='text-sm font-medium p-3'>plan</th>
              <th className='text-sm font-medium p-3'>action</th>
            </tr>
          </thead>
          <tbody className='text-sm'>
            <tr className={`border-b border-zinc-200 dark:border-zinc-700 ${theme === "dark" ? 'bg-[#1A1C22] text-white' : 'bg-white text-black'}`}>
              <td className="p-3">
                <CheckBox/>
              </td>
              <td className='p-3'>basic june plan</td>
              <td className='p-3'>999</td>
              <td className='p-3'>june 10 2023</td>
              <td className='p-3'>
                <span className='px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs'>paid</span>
              </td>
              <td className='p-3'>basic plan</td>
              <td className='p-3'></td>
            </tr>

            <tr className={`border-b border-zinc-200 dark:border-zinc-700 ${theme === "dark" ? 'bg-[#1A1C22] text-white' : 'bg-white text-black'}`}>
              <td className="p-3">
                <CheckBox/>
              </td>
              <td className='p-3'>professional june plan</td>
              <td className='p-3'>10000</td>
              <td className='p-3'>june 10 2023</td>
              <td className='p-3'>
                <span className='px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs'>paid</span>
              </td>
              <td className='p-3'>professional plan</td>
              <td className='p-3'></td>
            </tr>

            <tr className={`border-b border-zinc-200 dark:border-zinc-700 ${theme === "dark" ? 'bg-[#1A1C22] text-white' : 'bg-white text-black'}`}>
              <td className="p-3">
                <CheckBox/>
              </td>
              <td className='p-3'>basic june plan</td>
              <td className='p-3'>999</td>
              <td className='p-3'>june 10 2023</td>
              <td className='p-3'>
                <span className='px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs'>paid</span>
              </td>
              <td className='p-3'>basic plan</td>
              <td className='p-3'></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Billings