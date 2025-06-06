"use client";

import React from "react";
import Actions from "../../../../../../Components/phoneAgent/Actions";
import useTheme from "next-theme";
import { OutlinedButton } from "@/Components/buttons/OutlinedButton";
import { FaArrowLeftLong } from "react-icons/fa6";
import PhoneSettingNav from "@/Components/phoneAgent/phoneSettings/PhoneSettingNav";

const page = () => {
    
  const { theme } = useTheme();
  return (
    <div className={`flex flex-col justify-start items-center px-8  w-full h-[100vh]`}>
     <div
        className={`border-b-[1px] mt-8 mb-8 flex justify-center relative w-full text-base border-zinc-300 ${
          theme === "dark" ? "text-[#9f9f9f]" : " text-black"
        }`}
      >
        <PhoneSettingNav />
      </div>
      <Actions editPage = {true} />
    </div>
  );
};

export default page;
