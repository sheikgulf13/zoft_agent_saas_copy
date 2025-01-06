"use client";
import React, { useEffect, useState } from "react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import useTheme from "next-theme";
import GradientButton from "@/Components/buttons/GradientButton";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { CopyBlock, dracula } from "react-code-blocks";
import TickIcon from "../Icons/TickIcon";
import Chatbot from "./Chatbot";
import { getApiConfig, getApiHeaders } from "@/utility/api-config";
import { OutlinedButton } from "../buttons/OutlinedButton";
import { ContainedButton } from "../buttons/ContainedButton";
import { CookieManager } from "@/utility/cookie-manager";
import SimpleAlert from "../toast/success-toast";

const Deploy = () => {
  const { theme, setTheme } = useTheme();
  const navigate = useRouter();
  const [loading, setLoading] = useState(true);
  const [embedCode, setEmbedCode] = useState("");
  const [chatId, setChaId] = useState();
  const { botName, description, prompt } = useSelector((state) => state.bot);
  const { url, rawText, fileCount } = useSelector((state) => state.data);
  const { selectedWorkSpace } = useSelector((state) => state.selectedData);
    const {
      createdActions,
    } = useSelector((state) => state.actions);
  const { file } = useSelector((state) => state.file);
  const [profileId, setProfileId] = useState("");
  const [chatAgent, setChatAgent] = useState("");
  const urlFetch = process.env.url;
  const [progress, setprogress] = useState(false);
  const [currentSentence, setCurrentSentence] = useState(0);
  const [toast, setToast] = useState("");
  const frame = `<iframe 
style="position: fixed; bottom:0; right:0; width: 40vw; height: 110vh; border: none;" 
src="https://chat-embed.zoft.ai/?id=${chatId}" 
align="right">
</iframe>`;

  const sentences = [
    "Heating up the oven...",
    "Gathering the freshest ingredients...",
    "Mixing the secret sauce...",
    "Almost done, just a sprinkle of AI magic...",
  ];
  const createChatBot = async () => {
    const dict = {};
    const session_id = CookieManager.getCookie("session_id");
    const formData = new FormData();
    var urls = "";
    url.forEach((url1, index) => {
      urls += url1 + ",";
      dict[url1] = 0;
    });
    file?.forEach((file, index) => {
      formData.append(`files`, file);
    });

    formData.append("session_id", session_id);
    formData.append("URLs", urls);
    formData.append("botname", botName);
    formData.append("description", description);
    formData.append("prompt", prompt);
    formData.append("raw_text", rawText);
    formData.append("raw_text_word_count", rawText.split(" ").length);
    formData.append("url_word_count", JSON.stringify(dict));
    formData.append("workspace_id", selectedWorkSpace);
    formData.append("actions", JSON.stringify(createdActions));
    const tempFileCount = JSON.stringify(fileCount);
    formData.append("file_word_count", tempFileCount);
    const response = await fetch(`${urlFetch}/public/chat_agent/create_test`, {
      ...getApiConfig(),
      method: "POST",
      headers: new Headers({
        ...getApiHeaders(),
      }),
      body: formData,
    });
    const data = await response.json();
    setChatAgent(data);
    if (response.ok) {
      setToast("success");
      setTimeout(() => {
        setToast("");
      }, 3000);
    }
    if (!response.ok) {
      setToast("error");
      setTimeout(() => {
        setToast("");
      }, 3000);
    }
    localStorage.removeItem(`agentList_${session_id}`);
    setLoading(false);
  };
  useEffect(() => {
    if (loading) {
      const interval = setInterval(() => {
        setCurrentSentence((prevSentence) => {
          if (prevSentence < sentences.length - 1) {
            return prevSentence + 1;
          } else {
            clearInterval(interval);
            prevSentence = 0;
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
    navigate.push("/workspace/agents");
    setprogress(true);
  };

  const prevHandler = () => {
    navigate.push("/workspace/agents/chats/datasource");
  };

  const renderSkeleton = () => {
    return (
      <SkeletonTheme baseColor="#f5f5f5" highlightColor="#e0e0e0">
        <div className="w-full h-screen">
          <div className="h-[0.4vh] w-full bg-gradient-to-r from-[#EB1CD6] to-[#F4A36F]"></div>
          <div className="flex justify-end gap-[8vw]">
            <div className="w-[40vw] h-[80vh] mt-[3vw] rounded-[0.833vw] shadow-xl py-[2vw] relative">
              <h1 className="text-lg capitalize text-center pb-[2vw] mb-[2vw]">
                <Skeleton width={200} height={50} />
              </h1>
              <div className="flex flex-col gap-[2vw] px-[3vw] items-center">
                <GradientButton
                  text="Preview"
                  className="w-fit contentButton bg-gradient-to-r from-[#EB1CD6] to-[#F4A36F] text-white"
                >
                  <Skeleton height={40} width={100} />
                </GradientButton>
                <div className="flex flex-col gap-[0.417vw] mt-[8vw]">
                  <label className="capitalize text-base font-medium">
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
  };

  return (
    <>
      {/*  loading ? (
       renderSkeleton()
    ) : ( */}
      <div
        className={`w-full h-screen flex justify-center items-center overflow-y-auto relative ${
          theme === "dark"
            ? "bg-[#1F222A] text-white"
            : "bg-[#F2F4F7] text-black"
        }`}
      >
        <div>
          {toast === "success" ? (
            <div className="fixed top-[30px] w-[250px] h-[70px] right-[30px] z-[1000]">
              <SimpleAlert
                content={"Chatbot created succesfully"}
                severity={"success"}
              />
            </div>
          ) : toast === "error" ? (
            <div className="fixed top-[30px] w-[250px] h-[70px] right-[30px] z-[1000]">
              <SimpleAlert
                content={"Chatbot creation failed"}
                severity={"error"}
              />
            </div>
          ) : (
            <></>
          )}
        </div>

        <div className="w-[90%] h-[90%] bg-white flex justify-center items-center relative gap-[3vw] py-[20px] rounded-lg">
          <div className="w-full absolute top-0 py-[20px] px-[20px]">
            <h1 className="text-[30px] font-bold text-black">Preview</h1>
          </div>
          <div
            className={`w-[40%] h-[65vh]  rounded-[0.833vw] shadow-xl py-[2vw] relative ${
              theme === "dark"
                ? "bg-[#1F222A] text-white"
                : "bg-white text-black"
            }`}
          >
            <h1 className="text-2xl capitalize text-left font-bold px-[2vw] pb-[1vw]">
              Deploy
            </h1>
            <div className="flex flex-col gap-[2vw] mt-[1vh] px-[2vw] items-center">
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
              <div className="flex flex-col w-[100%] h-[40vh] text-base">
                {/* <MyCodeComponent /> */}
                <label htmlFor="embed" className="capitalize text-base">
                  Embed Code
                </label>
                <CopyBlock
                  text={frame}
                  language="html"
                  showLineNumbers={true}
                  theme={dracula}
                  codeBlock
                />
              </div>
            </div>
          </div>
          {chatAgent && (
            <Chatbot height={"65vh"} chatAgent={chatAgent} loading={loading} />
          )}
          <div className="w-full absolute bottom-0 bg-white h-[9.5vh] py-[10px]">
            <div className="w-full h-full flex justify-center items-center gap-[2vw] px-[3vw]">
              <ContainedButton onClick={() => {navigate.push(`/workspace/agents?workspaceId=${selectedWorkSpace}`)}}>Finish</ContainedButton>
            </div>
          </div>
        </div>
      </div>
      {/* ); */}
    </>
  );
};

export default Deploy;
