import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { RiDeleteBin6Fill } from "react-icons/ri";
import { IoSettingsSharp } from "react-icons/io5";
import { deletePhoneAgentApi } from "@/api/agent";
import { useDispatch, useSelector } from "react-redux";
import { updateSelectedPhoneAgent } from "../../store/actions/selectedDataActions";
import { Chip } from "@mui/material";
import useTheme from "next-theme";

const AgentList = ({ agent }) => {
  const router = useRouter();
  const { theme } = useTheme();
  const dispatch = useDispatch();
  const [isHovered, setIsHovered] = useState(false);

    useEffect(() => {
    console.log('key', agent)
  }, [agent])

  const replaceHandler = () => {
    if (!agent) {
      return;
    }
    dispatch(updateSelectedPhoneAgent(agent));
    router.push(
      `/workspace/agents/phone/phonesetting/configure?workspaceId=${agent?.workspace_id}`
    );
  };

  const deleteAgent = (agentId) => {
    if(!agentId) return;
    //deletePhoneAgentApi(agentId);
    //router.push(agentId);
     router.push(
      `/workspace/agents/phone/phonesetting/configure?workspaceId=${agent?.workspace_id}`
    );
  };

  // console.log(agent);

  return (
    <div
      key={agent?.id}
      className={`w-full min-h-[70px] max-h-[70px] cursor-pointer relative overflow-hidden rounded-xl transition-all duration-300 ${
        theme === "dark"
          ? "bg-gradient-to-br from-[#1F222A] to-[#2A2E37] border border-gray-700 hover:border-[#2D3377]/90"
          : "bg-gradient-to-br from-white to-gray-50 border border-gray-200 hover:border-[#2D3377]/90"
      } ${isHovered ? "shadow-sm scale-[1.02]" : "shadow-sm"}`}
      onClick={replaceHandler}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
       <div className="w-full h-full flex items-center justify-center p-4 relative group">
        <h3 className={`font-semibold text-base min-w-[45%] max-w-[45%] text-left overflow-hidden text-ellipsis ${
          theme === "dark" ? "text-gray-200" : "text-[#333333]"
        }`}>
          {agent?.phone_agent_name}
        </h3>

          <h3 className={`font-semibold text-sm min-w-[20%] max-w-[20%] text-left overflow-hidden text-ellipsis ${
          theme === "dark" ? "text-gray-200" : "text-[#8b8b8b]"
        }`}>
          {agent && JSON.parse(agent?.actions)?.length}
        </h3>

        <h3 className={`font-semibold text-sm min-w-[20%] max-w-[20%] text-left overflow-hidden text-ellipsis ${
          theme === "dark" ? "text-gray-200" : "text-[#8b8b8b]"
        }`}>
          {new Date(agent?.created_at).toDateString()}
        </h3>

        {/* Action Buttons */}
        <div
          className={`flex min-w-[15%] max-w-[15%] justify-end gap-2 p-2 rounded-xl transition-all duration-300`}
        >
       
          <button
            className={`p-2 rounded-full transition-all duration-200 ${
              theme === "dark"
                ? "hover:bg-[#2A2E37] hover:text-red-400"
                : "hover:bg-gray-100 hover:text-red-500"
            }`}
            onClick={(e) => {
              e.stopPropagation();
              //deleteAgent(agent?.id);
                router.push(
                `/workspace/agents/phone/phonesetting/configure?workspaceId=${agent?.workspace_id}&isDelete=true`
              );
            }}
          >
            <RiDeleteBin6Fill
              size={20}
              className="text-red-500 hover:scale-110 transition-transform duration-200"
            />
          </button>
        </div>

        {/* <span className='Hsm font-normal'>{agent?.conversation_purpose}</span> */}

        {/* <div className={`w-full flex justify-between`}>
          <div className={`w-[50%] hover:text-opacity-[.8]`}>
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
                  deleteAgent(agent?.id)
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
