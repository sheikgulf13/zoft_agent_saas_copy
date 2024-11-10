"use client"
import React, { useState, useEffect } from 'react';
import GradientButton from '@/Components/buttons/GradientButton';
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import AddFile from './AddFile';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { seturl, setrawText } from '../../store/reducers/dataSourceSlice';
import DeleteIcon from '../Icons/DeleteIcon';
import useTheme from "next-theme";
import { useRouter } from 'next/navigation';
import TickIcon from '../Icons/TickIcon'
import Source from './chatSettings/SourceCopy';
import { OutlinedButton } from '../buttons/OutlinedButton';
import { ContainedButton } from '../buttons/ContainedButton';

function isValidURL(url) {
    try {
        new URL(url);
        return true;
    } catch (error) {
        return false;
    }
}
const DataSource = () => {
    const dispatch = useDispatch();
    const navigate = useRouter();
    const { theme } = useTheme();
    const [loading, setLoading] = useState(true);
    const { url, rawText } = useSelector(state => state.data);
    const [showDiv, setShowDiv] = useState(false);
    const [pastedUrl, setPastedUrl] = useState([]);
    const [inputUrl, setInputUrl] = useState('');
    const [err, setErr] = useState('');
    const [progress, setprogress] = useState(false)

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 0);
        setPastedUrl([...url]);
        setrawText(rawText)
        return () => clearTimeout(timer);
    }, []);

    const urlHandler = (e) => {
        setInputUrl(e.target.value)
    };

    const rawTextHandler = (e) => {
        dispatch(setrawText(e.target.value));
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
    };

    const prevReplaceHandler = () => {
        navigate.push('/workspace/agents/chats/createbot');
    };

    const nextReplaceHandler = () => {
        // if (pastedUrl.length != 0){
            navigate.push('/workspace/agents/chats/deploy');
            setprogress(true)
        // }
        // else setErr("Error: URL is empty")
    };

    const keypressHandler = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (!inputUrl || inputUrl.trim() === '') {
                setErr("Error: URL is empty");
            } else if (!isValidURL(inputUrl)) {
                setErr("Error: Invalid URL format");
            } else if (pastedUrl.length < 2) {
                setShowDiv(true);
                dispatch(seturl([...pastedUrl, inputUrl]));
                setPastedUrl([...pastedUrl, inputUrl]);
                setInputUrl('');
                setErr('')

            } else {
                setErr('You can only add up to 2 URLs!')
            }
        }
    };

    const removeUrl = (index) => {
        const updatedUrl = pastedUrl.filter((_, i) => i !== index);
        setPastedUrl(updatedUrl);
    };

    const renderSkeletonForm = () => (
        <SkeletonTheme baseColor="#f5f5f5" highlightColor="#e0e0e0">
            <div className="w-full h-screen">
                <div className='h-[.5vh] w-[66%] bg-gradient-to-r from-[#EB1CD6] to-[#F4A36F]'></div>
                <div className="flex justify-end gap-[8vw]">
                    <div className={`w-[40vw] mt-[3vw] rounded-[1vw] shadow-xl py-[1.5vw] relative ${theme === "dark" ? 'bg-[#1F222A] text-white' : 'bg-white text-black'}`}>
                        <h1 className="H1 capitalize text-center pb-[1vh]"><Skeleton width={200} /></h1>
                        <form className="flex flex-col gap-[1vw] px-[3vw]" onSubmit={handleFormSubmit}>
                            <AddFile />
                            <div className="flex flex-col gap-[.4vw]">
                                <label htmlFor="url" className="capitalize H2 font-medium"><Skeleton width={100} /></label>
                                <Skeleton height={30} />
                            </div>
                            <div className="flex flex-col gap-[.4vw]">
                                <label htmlFor="rawText" className="capitalize H1 font-medium"><Skeleton width={100} /></label>
                                <Skeleton height={100} />
                            </div>
                            <div className="flex justify-between mb-[4vh]">
                                <GradientButton text="Back" icon={FaAngleLeft} onClick={prevReplaceHandler} className="w-fit bg-gradient-to-r from-[#EB1CD6] to-[#F4A36F] text-white" />
                                <GradientButton text="Next" icon={FaAngleRight} onClick={nextReplaceHandler} className="w-fit bg-gradient-to-r from-[#EB1CD6] to-[#F4A36F] text-white" />
                            </div>
                        </form>
                    </div>
                    <div className={`w-[25vw] h-screen justify-self-end shadow-xl ${theme === "dark" ? 'bg-[#1F222A] text-white' : 'bg-white text-black'}`}>
                        <div className="border-b-[0.052vw] border-zinc-400 w-full h-1/3 flex flex-col items-start pl-[6vw] justify-center gap-[1vw] text-start capitalize">
                            <h1 className="H7 font-medium"><Skeleton width={200} /></h1>
                            <h2 className="H4 font-medium"><Skeleton width={200} /></h2>
                            <h6 className="H2 font-medium"><Skeleton width={100} /></h6>
                            <h6 className="H2 font-medium"><Skeleton width={100} /></h6>
                        </div>
                        <div className="border-b-[.06vw] border-zinc-400 w-full h-1/3 flex flex-col items-start pl-[6vw] justify-center gap-[1vw] text-start capitalize">
                            <h1 className="H7 font-medium"><Skeleton width={200} /></h1>
                            <h6 className="H2 font-medium"><Skeleton width={200} /></h6>
                            <h6 className="H2 font-medium"><Skeleton width={100} /></h6>
                            <h6 className="H2 font-medium"><Skeleton width={100} /></h6>
                        </div>
                        <div className="border-b-[0.04vw] border-zinc-400 w-full h-1/3 flex flex-col items-start pl-[6vw] justify-center gap-[1vw] text-start capitalize">
                            <h1 className="H7 font-medium"><Skeleton width={200} /></h1>
                        </div>
                    </div>
                </div>
            </div>
        </SkeletonTheme>
    );

    return loading ? (
        renderSkeletonForm()
    ) : (
        <div className={`w-full h-screen relative ${theme === "dark" ? 'bg-[#1F222A] text-white' : 'bg-[#F2F4F7] text-black'}`}>
            <div className={`w-full absolute top-0 left-[50%] translate-x-[-50%] border-b-[.1vw] border-zinc-300 p-[1.5vw] h-[6vh] flex justify-center items-center ${theme === "dark" ? 'bg-[#1A1C21] text-white' : 'bg-white text-black'}`}>
                <div className='w-[50%] h-full flex items-center gap-[1vw]'>
                    <div className='h-full flex items-center justify-start gap-[.5vw]'>
                        <div className='circle bg-green-600  w-[2vw] h-[2vw] rounded-full flex justify-center items-center'>
                            <TickIcon/>
                        </div>
                        <h2 className='capitalize font-medium Hmd'>bot creation</h2>
                    </div>
                        
                    <div className='h-[1px] w-[3vw] bg-zinc-300 '></div>

                    <div className='h-full flex items-center justify-start gap-[.5vw]'>
                        <div className='circle border Hmd border-blue-500 text-blue-500  w-[2vw] h-[2vw] rounded-full flex justify-center items-center'>
                            { progress ? <TickIcon/> : 2}
                        </div>
                        <h2 className='capitalize font-medium Hmd'>data sources</h2>
                    </div>
                    
                    <div className='h-[1px] w-[3vw] bg-zinc-300 '></div>
                    
                    <div className='h-full flex items-center justify-start gap-[.5vw] opacity-[.4]'>
                        <div className='circle border Hmd border-blue-500 text-blue-500  w-[2vw] h-[2vw] rounded-full flex justify-center items-center'>
                            3
                        </div>
                        <h2 className='capitalize font-medium Hmd'>deployment</h2>
                    </div>
                </div>
            </div>

            <Source/>

            <div className={`w-full absolute bottom-0 h-[6.5vh] ${theme === "dark" ? 'bg-[#1F222A] text-white' : 'bg-white text-black'}`}>
                <div className='w-full h-full flex justify-end items-center gap-[2vw] px-[3vw] pr-[10%]'>
                    <OutlinedButton onClick={prevReplaceHandler}>
                        Back
                    </OutlinedButton>
                    <ContainedButton onClick={nextReplaceHandler}>
                        Create
                    </ContainedButton>
                </div>
            </div>
        </div>
    );
}

export default DataSource;