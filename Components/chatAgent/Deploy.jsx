"use client";
import React, { useEffect, useState } from 'react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import useTheme from 'next-theme';
import GradientButton from '@/Components/buttons/GradientButton';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { getCookie } from 'cookies-next';
import { CopyBlock, dracula } from 'react-code-blocks';
import TickIcon from '../Icons/TickIcon'
import Chatbot from './Chatbot'
import { getApiConfig, getApiHeaders } from '@/utility/api-config';
import { OutlinedButton } from '../buttons/OutlinedButton';
import { ContainedButton } from '../buttons/ContainedButton';

const Deploy = () => {
    const { theme, setTheme } = useTheme();
    const navigate = useRouter();
    const [loading, setLoading] = useState(true);
    const [embedCode, setEmbedCode] = useState("");
    const [chatId, setChaId] = useState(1245);
    const { botName, description, prompt } = useSelector((state) => state.bot);
    const { url, rawText, fileCount} = useSelector(state => state.data);
    const {selectedChatAgent} = useSelector(state => state.selectedData);
    const { file } = useSelector(state => state.file);
    const [profileId, setProfileId] = useState("")
    const [chatAgentId, setChatAgentId] = useState("")
    const urlFetch = process.env.url;
    const [progress, setprogress] = useState(false)
    const [currentSentence, setCurrentSentence] = useState(0);
    const frame = `<iframe 
style="position: absolute; bottom: 0; right: 0; width: 40vw; height: 110vh; border: none;" 
src="https://embedded-chatbot-pi.vercel.app/?id=${chatId}" 
align="right">
</iframe>`

    const sentences = [
        "Heating up the oven...",
        "Gathering the freshest ingredients...",
        "Mixing the secret sauce...",
        "Almost done, just a sprinkle of AI magic..."
    ];
    const createChatBot = async () => {
        const dict={};
        const session_id = getCookie("session_id")
        const formData = new FormData();
        var urls = ""
        url.forEach((url1, index) => {
            urls += url1 + ","
            dict[url1]=0
        })
        file?.forEach((file, index) => {
            formData.append(`files`, file);
        });

        formData.append('session_id', session_id);
        formData.append('URLs', urls);
        formData.append('botname', botName);
        formData.append('description', description);
        formData.append('prompt', prompt);
        formData.append('raw_text_word_count',rawText.split(" ").length);
        formData.append('url_word_count',JSON.stringify(dict));
        const tempFileCount=JSON.stringify(fileCount)
        formData.append('file_word_count',tempFileCount);
        const response = await fetch(`${urlFetch}/public/chat_agent/create_test`, {
            ...getApiConfig(),
            method: 'POST',
            headers: new Headers({
                ...getApiHeaders(),
            }),
            body: formData
        });
        const data = await response.text();
        setChaId(data);
        const list = data.split("_")
        setProfileId(list[0])
        setChatAgentId(list[1])
        localStorage.removeItem(`agentList_${session_id}`);
        setLoading(false);
    }
    useEffect(() => {
        if (loading) {
            const interval = setInterval(() => {
                setCurrentSentence((prevSentence) => {
                    if (prevSentence < sentences.length - 1) {
                        return prevSentence + 1;
                    } else {
                        clearInterval(interval);
                        prevSentence = 0
                        return prevSentence;
                    }
                });
            }, 2000);

            return () => clearInterval(interval);
        }
    }, [loading]);

    useEffect(() => {
        createChatBot();
        // const timer = setTimeout(() => {
        //     setLoading(false);
        // }, 2000);
        // return () => clearTimeout(timer);
    }, []);

    const handleEmbedChange = (e) => {
        setEmbedCode(e.target.value);
    };

    const successHandler = async () => {
        navigate.push('/workspace/agents');
        setprogress(true)
    }

    const prevHandler = () => {
        navigate.push('/workspace/agents/chats/datasource')
    }

    const renderSkeleton = () => {
        return (
            <SkeletonTheme baseColor="#f5f5f5" highlightColor="#e0e0e0">
                <div className="w-full h-screen">
                    <div className='h-[0.4vh] w-full bg-gradient-to-r from-[#EB1CD6] to-[#F4A36F]'></div>
                    <div className="flex justify-end gap-[8vw]">
                        <div className="w-[40vw] h-[80vh] mt-[3vw] rounded-[0.833vw] shadow-xl py-[2vw] relative">
                            <h1 className="text-lg capitalize text-center pb-[2vw] mb-[2vw]">
                                <Skeleton width={200} height={50} />
                            </h1>
                            <div className="flex flex-col gap-[2vw] px-[3vw] items-center">
                                <GradientButton
                                    text='Preview'
                                    className='w-fit contentButton bg-gradient-to-r from-[#EB1CD6] to-[#F4A36F] text-white'
                                >
                                    <Skeleton height={40} width={100} />
                                </GradientButton>
                                <div className='flex flex-col gap-[0.417vw] mt-[8vw]'>
                                    <label className='capitalize text-base font-medium'>
                                        <Skeleton width={150} height={40} />
                                    </label>
                                    <Skeleton width={600} height={200} />
                                </div>
                            </div>
                            <div className="flex flex-col gap-[2vw] px-[3vw] items-end">
                                <GradientButton
                                    text="Save"
                                    className="mt-[3vw] contentButton w-fit bg-gradient-to-r from-[#EB1CD6] to-[#F4A36F] text-white"
                                >
                                    <Skeleton height={40} width={100} />
                                </GradientButton>
                            </div>
                        </div>
                        <div className="w-[25vw] h-screen justify-self-end shadow-xl">
                            <div className="border-b-[0.052vw] border-zinc-400 w-full h-1/3 flex flex-col items-start pl-[6vw] justify-center gap-[1vw] text-start capitalize">
                                <h1 className="H5 font-medium">
                                    <Skeleton width={200} />
                                </h1>
                                <h2 className="H25 font-medium">
                                    <Skeleton width={150} />
                                </h2>
                                <h6 className="Hmd font-medium">
                                    <Skeleton width={100} />
                                </h6>
                                <h6 className="Hmd font-medium">
                                    <Skeleton width={100} />
                                </h6>
                            </div>
                            <div className="border-b-[0.052vw] border-zinc-400 w-full h-1/3 flex flex-col items-start pl-[6vw] justify-center gap-[1vw] text-start capitalize">
                                <h1 className="text-lg font-medium">
                                    <Skeleton width={200} />
                                </h1>
                                <h6 className="Hmd font-medium">
                                    <Skeleton width={100} />
                                </h6>
                                <h6 className="Hmd font-medium">
                                    <Skeleton width={100} />
                                </h6>
                                <h6 className="Hmd font-medium">
                                    <Skeleton width={200} />
                                </h6>
                            </div>
                            <div className="border-b-[0.052vw] border-zinc-400 w-full h-1/3 flex flex-col items-start pl-[6vw] justify-center gap-[1vw] text-start capitalize">
                                <h1 className="text-lg font-medium">
                                    <Skeleton width={200} />
                                </h1>
                            </div>
                        </div>
                    </div>
                </div>
            </SkeletonTheme>
        );
    }

    return <>
        {/*  loading ? (
       renderSkeleton()
    ) : ( */}
        <div className={`w-full h-screen overflow-y-auto relative ${theme === "dark" ? 'bg-[#1F222A] text-white' : 'bg-[#F2F4F7] text-black'}`}>
            <div className={`w-full absolute top-0 left-[50%] translate-x-[-50%] border-b-[.1vw] border-zinc-300 p-[1.5vw] h-[6vh] flex justify-center items-center ${theme === "dark" ? 'bg-[#1A1C21] text-white' : 'bg-white text-black'}`}>
                <div className='w-[40%] h-full flex items-center gap-[1vw]'>
                    <div className='h-full flex items-center justify-start gap-[.5vw]'>
                        <div className='circle bg-green-600  w-[2vw] h-[2vw] rounded-full flex justify-center items-center'>
                            <TickIcon />
                        </div>
                        <h2 className='capitalize font-medium Hmd'>bot creation</h2>
                    </div>

                    <div className='h-[1px] w-[3vw] bg-zinc-300 '></div>

                    <div className='h-full flex items-center justify-start gap-[.5vw]'>
                        <div className='circle bg-green-600  w-[2vw] h-[2vw] rounded-full flex justify-center items-center'>
                            <TickIcon />
                        </div>
                        <h2 className='capitalize font-medium Hmd'>data sources</h2>
                    </div>

                    <div className='h-[1px] w-[3vw] bg-zinc-300 '></div>

                    <div className='h-full flex items-center justify-start gap-[.5vw]'>
                        <div className='circle border Hmd border-blue-500 text-blue-500  w-[2vw] h-[2vw] rounded-full flex justify-center items-center'>
                            3
                        </div>
                        <h2 className='capitalize font-medium Hmd'>deployment</h2>
                    </div>
                </div>
            </div>

            <div className='w-full h-[80vh] flex justify-center items-center gap-[3vw] mt-[4vw]'>
                <div className={`w-[40%] h-[77vh]  rounded-[0.833vw] shadow-xl py-[2vw] relative ${theme === "dark" ? 'bg-[#1F222A] text-white' : 'bg-white text-black'}`}>
                    <h1 className='text-2xl capitalize text-left font-bold px-[2vw] pb-[1vw]'>Deploy</h1>
                    <div className='flex flex-col gap-[2vw] mt-[1vh] px-[2vw] items-center'>
                        {/* load animation */}
                        <div className="h-[8vh]">
                            {loading ? (
                                <>
                                    <div className="fancy-spinner mb-[1vw]">
                                        <div className="ring"></div>
                                        <div className="ring"></div>
                                        <div className="dot"></div>
                                    </div>
                                    <span>{sentences[currentSentence]}</span>
                                </>
                            ) : (
                                <>
                                    <span>Your chatbot is freshly baked and ready!</span>
                                    <br />
                                    <span>Bon appétit! Let's start chatting.</span>
                                    <br />
                                    <p>Ready to chat!</p>
                                </>
                            )}
                        </div>
                        <div className='flex flex-col w-[100%] h-[40vh] text-base'>
                            {/* <MyCodeComponent /> */}
                            <label htmlFor="embed" className='capitalize text-base'>Embed Code</label>
                            <CopyBlock
                                text={frame}
                                language='html'
                                showLineNumbers={true}
                                theme={dracula}
                                codeBlock
                            />
                        </div>
                    </div>
                </div>
                <Chatbot height={"77vh"} chatAgent={selectedChatAgent} loading={loading} />
            </div>

            <div className={`w-full absolute bottom-0 h-[6.5vh] ${theme === "dark" ? 'bg-[#1F222A] text-white' : 'bg-white text-black'}`}>
                <div className='w-full h-full flex justify-end items-center gap-[2vw] px-[3vw] pr-[10%]'>
                    <OutlinedButton
                        onClick={prevHandler}
                    >
                        Back
                    </OutlinedButton>
                    <ContainedButton onClick={successHandler}>
                        Finish
                    </ContainedButton>
                </div>
            </div>
        </div>
        {/* ); */}
    </>
};

export default Deploy;
