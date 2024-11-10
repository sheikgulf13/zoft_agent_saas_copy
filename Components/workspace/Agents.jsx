"use client";

import React from "react";
import ChatAgent from "../sidebarElements/ChatAgent";
import PhoneAgentList from "../phoneAgent/PhoneAgentLists";

const Agents = (props) => {
  const { isLoading } = props;

  return (
    <div className={`h-[100vh] py-[4%] flex flex-col `}>
      <ChatAgent isLoading={isLoading} />
      <PhoneAgentList isLoading={isLoading} />
    </div>
  );
};

export default Agents;
