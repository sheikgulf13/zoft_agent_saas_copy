"use client";
import React, { useEffect, useRef, useState } from "react";
import { FaPlus } from "react-icons/fa";
import { useRouter } from "next/navigation";
import AgentCard from "./AgentCard";
import useTheme from "next-theme";
import CreateButton from "../buttons/CreateButton";
import SkeletonCard from "../SkeletonCard";
import Modal from "../Modal";
import { IoSettingsSharp } from "react-icons/io5";
import {
  clearState,
  setPhoneAgentType,
} from "../../store/actions/phoneAgentActions";
import { useDispatch, useSelector } from "react-redux";

const PhoneAgentList = (props) => {
  const { theme } = useTheme();
  const router = useRouter();
  const scrollRef = useRef();
  const [scrollHeight, setScrollHeight] = useState();
  const [modal, setModal] = useState(false);
  const dispatch = useDispatch();
  const { isLoading } = props;
  const { workSpaceAgentList } = useSelector(
    (state) => state.workSpaceAgentList
  );

  useEffect(() => {
    const scrollHeight = scrollRef?.current?.scrollHeight;
    setScrollHeight(scrollHeight);
    console.log(scrollHeight);
  }, [scrollRef?.current?.scrollHeight]);

  const replaceHandler = (type) => {
    dispatch(setPhoneAgentType(type));
    router.push("/workspace/agents/phone/createagent");
  };

  return (
    <div className="h-[50%] overflow-hidden">
      <div
        className={`w-[88%] h-full mx-auto rounded-b-[.9vh]relative p-8  ${
          theme === "dark" ? "bg-[#1A1C22] text-white" : "bg-white text-black"
        }`}
      >
        <div
          className={`flex items-center justify-between  w-full pb-[25px] ${
            theme === "dark" ? " text-[#9f9f9f]" : " text-black"
          }`}
        >
          <h1 className="text-lg font-bold">Phone Agents</h1>
        </div>

        <div
          className={`flex justify-center w-full overflow-y-auto`}
          style={{ height: "28vh" }}
        >
          <div
            ref={scrollRef}
            className={`flex flex-wrap justify-start w-full ${
              scrollHeight > 260 ? "scrollbar" : "scrollbar-none"
            } mt-4 gap-[2.5vw] ${
              theme === "dark" ? "scrollbar-dark" : "scrollbar-light"
            }`}
          >
            <CreateButton
              onClick={() => {
                dispatch(clearState());
                setModal(true);
              }}
              Icon={FaPlus}
              text="Create a new Phonebot"
            />
            {isLoading ? (
              <SkeletonCard />
            ) : (
              <>
                {workSpaceAgentList?.phone_agents?.length ? (
                  <>
                    {workSpaceAgentList.phone_agents.map((agent, index) => (
                      <AgentCard key={index} agent={agent} />
                    ))}
                  </>
                ) : (
                  <div
                    className={`${
                      theme === "dark" ? " text-[#9f9f9f]" : " text-[#9f9f9f]"
                    } font-bold text-[1.1vw] w-[12vw] h-[12vw] flex items-center justify-center`}
                  >
                    No Agents Created
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {modal && (
          <Modal
            open={modal}
            onClose={() => setModal(false)}
            classname={"!bg-transparent w-[52%] !shadow-none"}
          >
            <div className="bg-gray-300 rounded-lg p-[4%] shadow-lg">
              <div className={`flex gap-[2vw]`}>
                <div
                  className={`w-[1%] hover:text-opacity-[.8] pt-[2%] pl-[3%] pr-[2%]`}
                >
                  <button
                    className={`flex p-[10%] text-[1.3vw] text-[#702963] text-center font-semibold`}
                  >
                    <IoSettingsSharp
                      // onClick={() =>
                      //   router.push(
                      //     `/workspace/settings?workspaceId=${workspace.id}`
                      //   )
                      // }
                      className="hover:scale-[1.3] transition-all duration-300"
                    />
                  </button>
                </div>
                <div className={`flex flex-col gap-[0.3vw] pb-[5%]`}>
                  <h6 className="text-[1.1vw] font-semibold">
                    Create a new agent
                  </h6>
                  <p className="text-[.9vw] font-normal">
                    What type of agent are you trying to create?
                  </p>
                </div>
              </div>
              <div
                className={`flex flex-col items-center justify-center gap-[2vw] transition-all duration-300`}
              >
                <div
                  onClick={() => replaceHandler("outbound")}
                  className={`${
                    theme === "dark"
                      ? "bg-white text-black"
                      : "bg-white text-black"
                  } flex gap-[2vw] min-w-[100%] items-center rounded-lg shadow-lg hover:scale-[1.03] hover:cursor-pointer p-[1.5vw] transition-all duration-200`}
                >
                  <div
                    className={`${
                      theme === "dark"
                        ? "bg-[#1A1C22] text-white"
                        : "bg-[#1A1C22] text-white"
                    } bg-opacity-[.8] min-w-[10vw] min-h-[10vw] rounded-lg flex items-center justify-center `}
                  >
                    Outbound Agent
                  </div>
                  <div className={`flex flex-col gap-[.3vw]`}>
                    <h6 className="text-[1.1vw] font-semibold">
                      Outbound agent
                    </h6>
                    <p className="text-[.9vw] font-normal">
                      Outbound agent's are agents that call prospects that
                      signup on your optin form or are being sent to the agent
                      through a webhook integration
                    </p>
                  </div>
                </div>

                <div
                  onClick={() => replaceHandler("inbound")}
                  className={`${
                    theme === "dark"
                      ? "bg-white text-black"
                      : "bg-white text-black"
                  } flex gap-[2vw] min-w-[100%] items-center rounded-lg shadow-lg hover:scale-[1.03] hover:cursor-pointer p-[1.5vw] transition-all duration-200`}
                >
                  <div
                    className={`${
                      theme === "dark"
                        ? "bg-[#1A1C22] text-white"
                        : "bg-[#1A1C22] text-white"
                    } bg-opacity-[.8] min-w-[10vw] min-h-[10vw] rounded-lg flex items-center justify-center `}
                  >
                    Inbound Agent
                  </div>
                  <div className={`flex flex-col gap-[.3vw]`}>
                    <h6 className="text-[1.1vw] font-semibold">
                      Inbound agent
                    </h6>
                    <p className="text-[.9vw] font-normal">
                      Inbound agent's are agents tat respond to prospects
                      calling your twillio number through their phones or "live
                      call" embeddable widgets
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Modal>
        )}
      </div>
    </div>
  );
};

export default PhoneAgentList;
