"use client";

import useTheme from "next-theme";
import React, { useEffect, useState } from "react";
import { TfiReload } from "react-icons/tfi";
import CreateButton from "../buttons/CreateButton";
import { FaPlus } from "react-icons/fa";
import { RiDeleteBin6Fill } from "react-icons/ri";
import { IoSettingsSharp } from "react-icons/io5";
import { useRouter } from "next/navigation";
import Modal from "../Modal";
import { useDispatch, useSelector } from "react-redux";
import {
  setworkspacename,
  setWorkSpaceId,
} from "@/store/reducers/workspaceSlice";
import SkeletonCard from "../SkeletonCard";
import { getApiConfig, getApiHeaders } from "../../utility/api-config";
import { ContainedButton } from "../buttons/ContainedButton";
import { deleteWorkSpaceApi, getWorkSpaceListApi } from "../../api/workspace";
import { updateWorkSpaceList } from "../../store/actions/workSpaceListAction";
import {} from "../../store/actions/workSpaceListAction";
import { updateSelectedWorkSpace } from "@/store/reducers/selectedDataSlice";
import { resetWorkSpace } from "../../store/actions/workspaceActions";
import { showConfirmationModal } from "../modals/ConfirmationModal";
import { CookieManager } from "../../utility/cookie-manager";

const WorkSpace = () => {
  const { theme } = useTheme();
  const router = useRouter();
  const dispatch = useDispatch();
  const { workspacename } = useSelector((state) => state.workspace);
  const { workSpaceList } = useSelector((state) => state.workSpaceList);
  const [modal, setModal] = useState(false);
  const [isLoading, setLoading] = useState(true);
  const url = process.env.url;

  const getWorkspaceList = async () => {
    let list = await getWorkSpaceListApi();

    if (!list) {
      return;
    }

    dispatch(updateWorkSpaceList(list));

    setLoading(false);
  };

  useEffect(() => {
    getWorkspaceList();
  }, [url]);

  const replaceHandler = () => {
    if(workspacename?.length === 0){
      return;
    }
    router.push("/workspace/createworkspace");
  };

  const workspaceHandler = async (workspaceId) => {
    dispatch(updateSelectedWorkSpace(workspaceId));

    router.push(`/workspace/agents?workspaceId=${workspaceId}`);
  };

  const toggleCreateDialog = () => {
    dispatch(resetWorkSpace());
    setModal(true);
  };

  const deleteWorkSpace = async (event, workspaceId) => {
    event.stopPropagation();

    showConfirmationModal(
      "Are you sure you want to delete this workspace ?",
      async () => {
        const result = await deleteWorkSpaceApi(workspaceId);

        if (result) {
          getWorkspaceList();
        }
      },
      "delete"
    );
  };

  return (
    <div className="h-[100vh] overflow-hidden flex items-center justify-center">
      <div
        className={`w-[90%] overflow-y-auto h-[90vh] rounded-2xl shadow-md py-[2%] px-[2%] relative  ${
          theme === "dark" ? "bg-[#1F222A] text-white" : "bg-white text-black"
        }`}
      >
        <div
          className={`flex items-center justify-between w-full pt-[1vw] pb-[.9vw] px-[1.5vw] border-zinc-300 ${
            theme === "dark" ? "text-[#9f9f9f]" : " text-black"
          }`}
        >
          <h1 className="text-xl font-bold">Workspace</h1>
        </div>

        <div className={`overflow-hidden m-[2%]`}>
          <div
            className={`p-[2%] flex flex-wrap items-center justify-start overflow-y-scroll scrollbar gap-8 ${
              theme === "dark" ? "scrollbar-dark" : "scrollbar-light"
            }`}
          >
            <CreateButton
              onClick={toggleCreateDialog}
              Icon={FaPlus}
              isWorkSpace
            />
            {isLoading ? (
              <>
                <SkeletonCard isWorkSpace />
              </>
            ) : workSpaceList?.length === 0 ? (
              <div
                className={`${
                  theme === "dark" ? " text-[#9f9f9f]" : " text-[#9f9f9f]"
                } font-bold text-[1.1vw] w-[12vw] h-[12vw] flex items-center justify-center`}
              >
                No Workspace Created
              </div>
            ) : (
              <>
                {workSpaceList?.map((workspace, index) => (
                  <div
                    key={index}
                    className={`cursor-pointer text-[#737791] relative overflow-hidden border-[1px] w-[180px] h-[180px] border-gray-400 rounded-[15%] hover:shadow-lg hover:scale-[1.01] transition-all duration-100 ${
                      theme === "dark" ? "text-[#9f9f9f]" : " text-black"
                    }`}
                    onClick={() => workspaceHandler(workspace.id)}
                  >
                    <div className="h-[85%] w-full pl-[1vw] pr-[1vw] pt-[2vh] overflow-hidden">
                      <h3 className=" mb-[1vw] font-bold text-lg text-gray-600 overflow-hidden w-full">
                        {workspace.workspace_name}
                      </h3>
                      {/*<span className='text[.5vw] font-normal'>
                                            {key?.workspace?.description}
                                        </span>*/}
                      <div
                        className={`flex items-center absolute bottom-0 left-0 w-full z-50`}
                      >
                        <div className={`w-[50%]`}>
                          <button
                            className={`w-full flex justify-center text-xl p-4 ${
                              theme === "dark"
                                ? "hover:bg-[#2A2E37] hover:text-[#4D55CC]"
                                : "hover:bg-gray-100 hover:text-[#4D55CC]"
                            } text-center font-semibold`}
                          >
                            <IoSettingsSharp
                              size={24}
                              onClick={(event) => {
                                event.stopPropagation();
                                router.push(
                                  `/workspace/settings?workspaceId=${workspace.id}`
                                );
                              }}
                              className="text-[#13104A]/95 hover:scale-110 transition-transform duration-200"
                            />
                          </button>
                        </div>
                        <div className={`w-[50%]`}>
                          <button
                            className={`w-full flex justify-center text-xl p-4 ${
                              theme === "dark"
                                ? "hover:bg-[#2A2E37] hover:text-red-400"
                                : "hover:bg-gray-100 hover:text-red-500"
                            } text-center font-semibold`}
                          >
                            <RiDeleteBin6Fill
                              size={24}
                              className="text-red-500 hover:scale-110 transition-transform duration-200"
                              onClick={(event) =>
                                deleteWorkSpace(event, workspace.id)
                              }
                            />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
        {modal && (
          <Modal open={modal} onClose={() => setModal(false)}>
            <div className={`flex flex-col gap-[1vw] w-[20vw]`}>
              <h6 className="font-semibold">Add new workspace</h6>
              <div>
                <p className="text-[.8vw] text-[#9f9f9f]">Workspace name</p>
                <input
                  type="text"
                  onChange={(e) => dispatch(setworkspacename(e.target.value))}
                  value={workspacename}
                  className={`${
                    theme === "dark"
                      ? "bg-black text-white border-white"
                      : "bg-white text-black border-black"
                  } border-b-[.1vw] outline-none w-full p-[.5vw]`}
                />
              </div>
              <div className="w-full flex justify-center mt-4">
                <ContainedButton onClick={replaceHandler} className="text-center px-[4vw]">Create</ContainedButton>
              </div>
            </div>
          </Modal>
        )}
      </div>
    </div>
  );
};

export default WorkSpace;
