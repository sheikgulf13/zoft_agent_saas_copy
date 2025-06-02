import useTheme from "next-theme";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { RiDeleteBin6Fill } from "react-icons/ri";
import { IoSettingsSharp } from "react-icons/io5";
import { deleteChatAgentApi } from "@/api/agent";
import { useDispatch } from "react-redux";
import { updateSelectedChatAgent } from "../../store/actions/selectedDataActions";

const AgentList = (key, agent) => {
  const router = useRouter();
  const { theme } = useTheme();
  const dispatch = useDispatch();
  const [isHovered, setIsHovered] = useState(false);



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
    //deleteChatAgentApi(agentId);
    //router.push(agentId);
     router.push(`/workspace/agents/chats/chatsetting/ai?workspaceId=${key?.agent?.workspace_id}`);
  };

  return (
    <div
      key={key?.agent?.id}
      className={`w-full min-h-[70px] max-h-[70px] cursor-pointer relative overflow-hidden rounded-xl transition-all duration-300 ${
        theme === "dark" 
          ? "bg-gradient-to-br from-[#1F222A] to-[#2A2E37] border border-gray-700 hover:border-[#2D3377]/90" 
          : "bg-gradient-to-br from-white to-gray-50 border border-gray-200 hover:border-[#2D3377]/90"
      } ${isHovered ? "shadow-sm scale-[1.02]" : "shadow-sm"}`}
      onClick={replaceHandler}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="w-full h-full flex justify-between items-center p-4 relative group">
        <h3 className={`font-semibold text-base min-w-[45%] max-w-[45%] text-left overflow-hidden text-ellipsis ${
          theme === "dark" ? "text-gray-200" : "text-[#333333]"
        }`}>
          {key?.agent?.bot_name}
        </h3>

        <h3 className={`font-semibold text-sm min-w-[20%] max-w-[20%] text-left overflow-hidden text-ellipsis ${
          theme === "dark" ? "text-gray-200" : "text-[#8b8b8b]"
        }`}>
          {key && key?.agent?.actions && JSON?.parse(key?.agent?.actions)?.length}
        </h3>

        <h3 className={`font-semibold text-sm min-w-[20%] max-w-[20%] text-left overflow-hidden text-ellipsis ${
          theme === "dark" ? "text-gray-200" : "text-[#8b8b8b]"
        }`}>
          {new Date(key?.agent?.created_at).toDateString()}
        </h3>
        
        {/* Action Buttons */}
        <div className={`flex justify-end min-w-[15%] max-w-[15%] gap-2 p-2 rounded-xl backdrop-blur-sm transition-all duration-300`}>
          <button
            className={`p-2 rounded-full transition-all duration-200 ${
              theme === "dark" 
                ? "hover:bg-[#2A2E37] hover:text-[#4D55CC]" 
                : "hover:bg-gray-100 hover:text-[#4D55CC]"
            }`}
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/workspace/agents/chats/chatsetting/ai?workspaceId=${key?.agent?.workspace_id}`);
            }}
          >
            <IoSettingsSharp
              size={20}
              className="text-[#13104A]/95 hover:scale-110 transition-transform duration-200"
            />
          </button>
          <button
            className={`p-2 rounded-full transition-all duration-200 ${
              theme === "dark" 
                ? "hover:bg-[#2A2E37] hover:text-red-400" 
                : "hover:bg-gray-100 hover:text-red-500"
            }`}
            onClick={(e) => {
              e.stopPropagation();
              //deleteAgent(key?.agent?.id);
              router.push(`/workspace/agents/chats/chatsetting/ai?workspaceId=${key?.agent?.workspace_id}&isDelete=true`);
            }}
          >
            <RiDeleteBin6Fill
              size={20}
              className="text-red-500 hover:scale-110 transition-transform duration-200"
            />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AgentList;
