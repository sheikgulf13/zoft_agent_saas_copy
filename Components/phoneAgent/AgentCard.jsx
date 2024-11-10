import { useRouter } from "next/navigation";
import React from "react";
import { RiDeleteBin6Fill } from "react-icons/ri";
import { IoSettingsSharp } from "react-icons/io5";
import { deletePhoneAgentApi } from "@/api/agent";
import { useDispatch, useSelector } from "react-redux";
import { updateSelectedPhoneAgent } from "../../store/actions/selectedDataActions";
import { Chip } from "@mui/material";

const AgentList = ({ agent }) => {
  const router = useRouter();
  const dispatch = useDispatch();

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
    deletePhoneAgentApi(agentId);
  };

  console.log(agent);

  return (
    <div
      key={agent?.id}
      className="hover:shadow-2xl bg-[#FFFFFF] text-[#737791] relative cursor-pointer w-[140px] h-[140px] overflow-hidden border-[1px] border-gray-400 rounded-[15%]"
      onClick={replaceHandler}
    >
      <div className="w-full overflow-hidden h-[140px] flex flex-col justify-center items-center p-4">
        <h4 className="font-bold text-base text-[#737791] w-[80%] overflow-hidden text-ellipsis">
          {agent?.phone_agent_name}
        </h4>
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
