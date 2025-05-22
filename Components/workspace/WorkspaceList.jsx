import useTheme from 'next-theme';
import { useRouter } from 'next/navigation';
import React from 'react'

const WorkspaceList = (key,workspace) => {
    const router = useRouter();
    const {theme} = useTheme()
    const replaceHandler = () => {
        router.push(`/workspace/agents/?workspaceId=${workspace?.id}`)
        console.log(workspace);
        
    };
    return (
        <div key={key} className={`cursor-pointer text-[#737791] relative min-w-[12vw] max-w-[12vw] overflow-hidden min-h-[12vw] max-h-[12vw] border-[0.052vw] border-black rounded-[1.5vw] hover:shadow-2xl ${theme === "dark" ? 'text-[#9f9f9f]' : ' text-black'}`} onClick={replaceHandler}>
            <div className='w-full pl-[2vw] pr-[4vw] pt-[2vh] overflow-hidden'>
                <h3 className=' mb-[1vw] font-bold text-[1.2vw] bg-black text-black'>{}</h3>
                {/*<span className='text[.5vw] font-normal'>
                    {key?.workspace?.description}
                </span>*/}
                <p className='text-[.7vw] font-normal mt-[4vw] text-black'>{}</p>
            </div>
        </div>
    )
}

export default WorkspaceList