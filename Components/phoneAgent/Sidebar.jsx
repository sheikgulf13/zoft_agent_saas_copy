import React from 'react'
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'

const Sidebar = ({theme}) => {

    return (
        <div className={`w-[25vw] h-screen justify-self-end shadow-xl ${theme === "dark" ? 'bg-[#1D2027] text-white' : 'bg-white text-black'}`}>
            <h1 className='heading pt-[4vh] px-[3vw]'>Agent Progress</h1>
            <div className='border-b-[0.052vw] border-zinc-400 w-full min-h-[20vh] flex flex-col items-start pl-[3vw] justify-center gap-[1vw] text-start capitalize'>
                <h1 className='subHeading'>1. Agent Settings</h1>
                <h2 className='Hmd font-normal pl-[3vw]'>Agent Details</h2>
                <h2 className='Hmd font-normal pl-[3vw]'>Agent Business Details</h2>
            </div>
            <div className='border-b-[0.052vw] border-zinc-400 w-full min-h-[20vh]  flex flex-col items-start pl-[3vw] justify-center gap-[1vw] text-start capitalize'>
                <h1 className='subHeading'>2. Tools Creation</h1>
                <h2 className='Hmd font-normal pl-[3vw]'>Adding Tools</h2>
            </div>
            <div className='border-b-[0.052vw] border-zinc-400 w-full min-h-[20vh] flex flex-col items-start pl-[3vw] justify-center gap-[1vw] text-start capitalize'>
                <h1 className='subHeading'>3. Voice settings</h1>
                <h2 className='Hmd font-normal pl-[3vw]'>Advanced Voice Settings</h2>
            </div>
            <div className='w-full min-h-[20vh] flex flex-col items-start pl-[3vw] justify-center gap-[1vw] text-start capitalize'>
                <h1 className='subHeading'>4. Deployment</h1>
                <h2 className='Hmd font-normal'><Skeleton width={'20vw'}/></h2>
            </div>
        </div>
    )
}

export default Sidebar