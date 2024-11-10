"use client"
import React, { useEffect, useRef, useState } from 'react'
import RangeSlider from './RangeSlider';
import GradientButton from '../buttons/GradientButton'
import { useDispatch, useSelector } from 'react-redux';
import { setLanguage, setVoice, setStability, setSimilarity, setExaggeration, setSpeakerBoost, setAdvancedSetting } from '../../store/actions/voiceSettingActions'
import { useRouter } from 'next/navigation';
import useTheme from 'next-theme';
import TickIcon from '../Icons/TickIcon'
import { OutlinedButton } from '../buttons/OutlinedButton';
import { ContainedButton } from '../buttons/ContainedButton';

const VoiceSetting = () => {
  const navigate = useRouter()
  const { theme, setTheme } = useTheme();
  const dispatch = useDispatch()
  const { language, voice, stability, similarity, exaggeration, speakerBoost, advancedSetting } = useSelector((state) => state.voice)
  const [progress, setprogress] = useState(false)

  const handleToggle = () => {
    dispatch(setAdvancedSetting(!advancedSetting))
    console.log(advancedSetting);
    
  };
  const handleToggle2 = () => {
    dispatch(setSpeakerBoost(!speakerBoost))
  }

  const nextHandler = () => {
    navigate.push('/workspace/agents/phone/preview')
    setprogress(true)
  }

  return (
    <div className={`w-full Hmd h-screen relative flex flex-col justify-center items-center  ${theme === 'dark' ? 'bg-[#1D2027] text-white' : 'bg-[#F2F4F7] text-black'}`}>
      <div className={`w-full absolute top-0 left-[50%] translate-x-[-50%] border-b-[.1vw] border-zinc-300 p-[1.5vw] h-[6vh] flex justify-center items-center ${theme === "dark" ? 'bg-[#1A1C21] text-white' : 'bg-white text-black'}`}>
        <div className='w-[75%] h-full flex items-center justify-center gap-[1vw]'>
          <div className='h-full flex items-center justify-start gap-[.5vw]'>
            <div className='circle bg-green-600  w-[2vw] h-[2vw] rounded-full flex justify-center items-center'>
              <TickIcon />
            </div>
            <h2 className='capitalize font-medium Hmd'>phonebot creation</h2>
          </div>

          <div className='h-[1px] w-[3vw] bg-zinc-300 '></div>

          <div className=' h-full flex items-center justify-start gap-[.5vw]'>
            <div className='circle bg-green-600  w-[2vw] h-[2vw] rounded-full flex justify-center items-center'>
              <TickIcon />
            </div>
            <h2 className='capitalize font-medium Hmd'>actions</h2>
          </div>

          <div className='h-[1px] w-[3vw] bg-zinc-300 '></div>
          
          <div className=' h-full flex items-center justify-start gap-[.5vw] '>
            <div className='circle text-blue-400 w-[2vw] h-[2vw] rounded-full border-cyan-500 border-[.2vw] flex justify-center items-center'>
              3
            </div>
            <h2 className='capitalize font-medium Hmd'>voice setting</h2>
          </div>
          
          <div className='h-[1px] w-[3vw] bg-zinc-300 '></div>

          <div className=' h-full flex items-center justify-start gap-[.5vw] opacity-[.4]'>
            <div className='circle text-blue-400 w-[2vw] h-[2vw] rounded-full border-cyan-500 border-[.2vw] flex justify-center items-center'>
              4
            </div>
            <h2 className='capitalize font-medium Hmd'>deployment</h2>
          </div>
        </div>
      </div>

      <div className='w-[75vw] h-fit  rounded-[0.417vw] flex flex-col items-start gap-[1vw] overflow-hidden transition-all duration-1000'>
        <h1 className='H5 capitalize font-bold'>Voice Setting</h1>

        <div className={`w-full rounded-[0.417vw] shadow-lg flex flex-col justify-center py-[1vw] transition-all duration-1000 ${theme === 'dark' ? 'bg-[#1D2027] text-white' : 'bg-white text-black'} ${!advancedSetting ? 'h-[42vh]' : 'h-[74.68vh]'}`}>
          <div className='w-full h-[12vh] bg-red- flex flex-col px-[2vw] py-[.5vh] gap-[1vw] '>
            <label className='text-[1.042vw] capitalize' htmlFor="language">Language</label>
            <select value={language} onChange={(e) => dispatch(setLanguage(e.target.value))} className='Hmd bg-transparent border-[0.052vw] border-zinc-300 py-[.8vh] px-[.5vw] rounded-[0.417vw] focus:outline-none focus:ring-2 focus:ring-pink-200  ' name="language" id="language">
              <option value="english">English</option>
              <option value="english-uk">English-UK</option>
              <option value="tamil">Tamil</option>
              <option value="hindi">Hindi</option>

            </select>
          </div>

          <div className='w-full h-[12vh] bg-red- flex flex-col px-[2vw] py-[.5vw] gap-[1vw] '>
            <label className='text-[1.042vw] capitalize' htmlFor="voice">voice & preview</label>
            <select value={voice} onChange={(e) => dispatch(setVoice(e.target.value))} className='h-[3vw] Hmd bg-transparent border-[0.052vw] border-zinc-300 py-[.8vh] px-[.5vw] rounded-[0.417vw] focus:outline-none focus:ring-2 focus:ring-pink-200 ' name="voice" id="voice">
              <option className='bg-white text-black' value="alexa">Alexa</option>
              <option value="alexa2">Alexa2</option>
              <option value="alexa3">Alexa3</option>
              <option value="alexa4">Alexa4</option>
            </select>
          </div>

          <div className='w-full flex justify- px-[2vw] gap-[1vw] items-center h-[12vh] py-[1vw]'>
            <div onClick={handleToggle2} className={`w-[3.125vw] h-[3.001vh] flex items-center rounded-full p-[0.208vw] cursor-pointer ${speakerBoost ? 'bg-[#D9D9D9]' : 'bg-[#D9D9D9]'}`}>
              <div className={`bg-gradient-to-r from-[#ED3AC0] to-[#F3957A] w-[1.302vw] h-[2.302vh] rounded-full shadow-md transform transition-transform duration-300 ease-in-out ${speakerBoost ? 'translate-x-[1.5vw]' : 'translate-x-0'}`}></div>
            </div>
            <h1 className='text-[1.042vw] capitalize'>speaker boost</h1>
          </div>

          <div className='w-full h-[7vh] flex justify-between items-center px-[2vw]'>
            <h1 className='capitalize text-[1.042vw]'>advance settings</h1>
            <div onClick={handleToggle} className={`w-[3.125vw] h-[3.001vh] flex items-center rounded-full p-[0.208vw] cursor-pointer ${advancedSetting ? 'bg-[#D9D9D9]' : 'bg-[#D9D9D9]'}`}>
              <div className={`bg-gradient-to-r from-[#ED3AC0] to-[#F3957A] w-[1.302vw] h-[2.302vh] rounded-full shadow-md transform transition-transform duration-300 ease-in-out ${advancedSetting ? 'translate-x-[1.5vw]' : 'translate-x-0'}`}></div>
            </div>
          </div>

          <div className={`w-[75vw] relative h-full overflow-hidden transition-all duration-1000 ${!advancedSetting && 'pointer-events-none h-0'}`}>
            <div className={`flex flex-col w-[75vw] top-[1vw] pt-[1vw] absolute transition-all duration-1000 ${!advancedSetting && 'top-[-16vw]'}`}>
              <div className='w-full h-[8vh]  bg-red- flex flex-col mb-[2vh] px-[2vw] py-[.5vh] gap-[0vw] '>
                <label className='capitalize text-[1.042vw] font-semibold' htmlFor="stability">stability</label>
                <RangeSlider initialValue={stability} onChange={(value) => { dispatch(setStability(value)); console.log(value) }} disabled={!advancedSetting} />
              </div>

              <div className='w-full h-[8vh] bg-red- flex flex-col mb-[2vh] px-[2vw] py-[.5vh] gap-[0vw]'>
                <label className='capitalize text-[1.042vw] font-semibold' htmlFor="stability">similarity</label>
                <RangeSlider initialValue={similarity} onChange={(value) => dispatch(setSimilarity(value))} disabled={!advancedSetting} />
              </div>

              <div className='w-full h-[8vh] bg-red- flex flex-col mb-[2vh]  px-[2vw] py-[.5vh] gap-[0vw]'>
                <label className='capitalize text-[1.042vw] font-semibold' htmlFor="stability">style exaggeration</label>
                <RangeSlider initialValue={exaggeration} onChange={(value) => dispatch(setExaggeration(value))} disabled={!advancedSetting} />
              </div>
            </div>
          </div>

        </div>
      </div>

      <div className={`w-full absolute bottom-0 h-[6.5vh]  ${theme === "dark" ? 'bg-[#1F222A] text-white' : 'bg-white text-black'}`}>
        <div className='w-full h-full flex justify-end items-center gap-[2vw] px-[3vw] '>
          <OutlinedButton onClick={() => navigate.push('/workspace/agents/phone/actions')}>Back</OutlinedButton>
          <ContainedButton onClick={nextHandler}>Continue</ContainedButton>
        </div>
      </div>
    </div>
  )
}

export default VoiceSetting