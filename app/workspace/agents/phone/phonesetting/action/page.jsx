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
    <div className={`flex flex-col justify-start items-center  w-full h-[100vh]`}>
     <div
        className={`border-b-[1px] flex justify-center mx-8 mt-8 w-full text-base border-zinc-300 ${
          theme === "dark" ? "text-[#9f9f9f]" : "text-black"
        }`}
      >
        <PhoneSettingNav />
      </div>
      <Actions editPage = {true} />
    </div>
  );
};

export default page;
