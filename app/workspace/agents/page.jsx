"use client";

import React, { Suspense, useEffect, useState } from "react";
import Agents from "../../../Components/workspace/Agents";
import { getAgentsForWorkSpaceApi } from "../../../api/workspace";
import { useDispatch, useSelector } from "react-redux";
import { updateWorkSpaceAgentList } from "../../../store/actions/workSpaceAgentListSlice";
import { useSearchParams } from "next/navigation";

const Content = () => {
  const [isLoading, setLoader] = useState(true);
  const { selectedWorkSpace } = useSelector((state) => state.selectedData);
  const dispatch = useDispatch();
  const searchParams = useSearchParams();

  let workspaceId = searchParams.get("workspaceId");

  const fetchAgents = async () => {
    if (!workspaceId) {
      workspaceId = selectedWorkSpace;
    }

    if (!workspaceId) {
      return;
    }

    const list = await getAgentsForWorkSpaceApi(workspaceId);

    if (!list) {
      dispatch(updateWorkSpaceAgentList([]));
    }

    dispatch(updateWorkSpaceAgentList(list));

    setLoader(false);
  };

  useEffect(() => {
    fetchAgents();
  }, [selectedWorkSpace, workspaceId]);

  return <Agents isLoading={isLoading} />;
};

const page = () => {
  return (
    <Suspense fallback={"Loading..."}>
      <Content />
    </Suspense>
  )
}

export default page;
