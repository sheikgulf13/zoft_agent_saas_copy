import useTheme from "next-theme";
import { useRouter } from "next/navigation";
import React from "react";
import { RiDeleteBin6Fill } from "react-icons/ri";
import { IoSettingsSharp } from "react-icons/io5";
import { deleteChatAgentApi } from "@/api/agent";
import { useDispatch } from "react-redux";
import { updateSelectedChatAgent } from "../../store/actions/selectedDataActions";

const AgentList = (key, agent) => {
  const router = useRouter();
  const { theme } = useTheme;
  const dispatch = useDispatch();
  const replaceHandler = () => {
    if (!key?.agent?.id) {
      return dispatch(updateSelectedChatAgent(null));
    }
    dispatch(updateSelectedChatAgent(key.agent));
    router.push(`/workspace/agents/chats/chatsetting/ai?workspaceId=${key?.agent?.workspace_id}`);
  };

  const deleteAgent = (agentId) => {
    if (!agentId) {
      return;
    }

    deleteChatAgentApi(agentId);
  };

  return (
    <div
      key={key?.agent?.id}
      className={`w-[140px] h-[140px] cursor-pointer text-[#737791] relative overflow-hidden border-[1px] border-gray-400 rounded-[15%] hover:shadow-2xl ${
        theme === "dark" ? "text-[#9f9f9f]" : " text-black"
      }`}
      onClick={replaceHandler}
    >
      <div className="w-full overflow-hidden h-[140px] flex items-center justify-center p-4">
        <h3 className="font-bold text-base text-[#737791] w-[80%] overflow-hidden text-ellipsis">
          {key?.agent?.bot_name}
        </h3>
        {/* <span className='text[.5vw] font-normal'>
                    {key?.agent?.description}
                </span>
                <p className='text-[.7vw] font-normal mt-[4vw] text-[#6d6e78]'>{key?.agent?.id}</p> */}
        {/* <div className={`w-full flex justify-between`}>
          <div className={`w-[50%]`}>
            <button
              className={`w-full flex justify-center text-lg text-[#702963] text-center font-semibold`}
            >
              <IoSettingsSharp
                size={24}
                // onClick={(event) => {
                //   event.stopPropagation();
                //   router.push(
                //     `/workspace/settings?workspaceId=${workspace.id}`
                //   );
                // }}
                className="hover:scale-[1.3] transition-all duration-300"
              />
            </button>
          </div>
          <div className={`w-[50%]`}>
            <button
              className={`w-full flex justify-center text-lg text-[#702963] text-center font-semibold`}
            >
              <RiDeleteBin6Fill
                size={24}
                className="hover:scale-[1.3] transition-all duration-300"
                onClick={(event) => {
                  event.stopPropagation();

                  deleteAgent(key?.agent?.id);
                }}
              />
            </button>
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default AgentList;
