"use client";

import React, { useEffect, useState } from "react";
import PhoneSettingNav from "./PhoneSettingNav";
import useTheme from "next-theme";
import { useSearchParams } from "next/navigation";
import { getCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import Image from "next/image";
import GradientButton from "@/Components/buttons/GradientButton";
import { useDispatch, useSelector } from "react-redux";
import { ContainedButton } from "@/Components/buttons/ContainedButton";

const playground = () => {
  const searchParams = useSearchParams();
  const { theme } = useTheme();
  const session_id = getCookie("session_id");
  const phoneId = searchParams.get("phoneId");
  const [phoneAgent, setPhoneAgent] = useState({});
  const urlFetch = process.env.url;
  const router = useRouter();
  const dispatch = useDispatch();
  const url = process.env.url;
  const { countryCode } = useSelector((state) => state.phoneAgent);
  const [cus_Number, setCus_Number] = useState("");
  const [cus_Name, setCus_Name] = useState("");
  const [cus_Pur, setCus_Pur] = useState("");

  const getAgent = async () => {
    {
      /*if (!phoneId || phoneId == "") {
      const agent = localStorage.getItem("current_phone_agent");
      if (agent) setPhoneAgent(JSON.parse(agent));
     
      return;
    */
    }
    const formData = new FormData();
    formData.append("session_id", session_id);
    formData.append("phone_agent_id", phoneId);
    const response = await fetch(
      `${urlFetch}/public/phone_agent/get_agent/by_id`,
      {
        mode: "cors",
        method: "POST",
        headers: new Headers({
          "ngrok-skip-browser-warning": "true",
        }),
        body: formData,
      }
    );
    const data = await response.json();
    console.log(data[0], "heloooooo");

    localStorage.setItem("current_phone_agent", JSON.stringify(data[0] || []));
    setPhoneAgent(data[0]);
  };

  const makeCall = async () => {
    const reqURL = `${url}/start-call`;
    const formData = new FormData();
    formData.append("phone_agent_id", phoneId);
    formData.append("customer_name", cus_Name);
    formData.append("customer_phonenumber", countryCode + cus_Number);
    formData.append("custmer_businessdetails", cus_Pur);
    const response = await fetch(reqURL, {
      mode: "cors",
      method: "POST",
      headers: new Headers({
        "ngrok-skip-browser-warning": "true",
      }),
      body: formData,
    });
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    console.log(reqURL, data);
  };

  useEffect(() => {
    // getAgent();
  }, []);

  return (
    <div
      className={`flex flex-col justify-start items-start px-8  w-full h-[100vh]`}
    >
      <div
        className={`border-b-[1px] mt-8 mb-8 flex justify-center relative w-full text-base border-zinc-300 ${
          theme === "dark" ? "text-[#9f9f9f]" : " text-black"
        }`}
      >
        <PhoneSettingNav />
      </div>

      <div className={`flex w-full h-full relative`}>
        <div
          className={`absolute flex flex-col top-[2vw] right-[2vw] ${
            theme === "dark" ? "bg-black text-white" : "bg-white text-black"
          } p-[1.5vw] rounded-lg gap-[.8vw]`}
        >
          <div
            className={`${
              theme === "dark" ? "text-white" : "text-black"
            } flex items-center gap-[1vw]`}
          >
            <h6 className="font-semibold text-lg">kayzen</h6>
          </div>

          <div className="flex justify-between w-full">
            <label className="text-base py-[1.5vh] px-[1vw] rounded-[0.417vw] ">
              Name
            </label>
            <input
              className=" text-base border-[0.052vw] bg-transparent border-zinc-400 w-[18vw] py-[1.5vh] px-[1vw] rounded-[0.417vw] "
              type="text"
              placeholder="Name"
              onChange={(e) => setCus_Name(e.target.value)}
            />
          </div>
          <div className="flex justify-between w-full">
            <label
              className={`${
                theme === "dark" ? "text-white" : "text-black"
              } text-base py-[1.5vh] px-[1vw] rounded-[0.417vw] `}
            >
              Phone
            </label>
            <div className="select-container flex w-[18vw] gap-[.5vw] items-center justify-center">
              <select
                value={countryCode}
                onChange={(e) => dispatch(setCountryCode(e.target.value))}
                className={`${
                  theme === "dark"
                    ? "bg-[#1A1C22] text-white"
                    : "bg-zinc-200 text-black"
                } Hmd py-[1.5vh] w-[4vw] !px-[.5vw] rounded-[0.417vw] select cursor-pointer`}
                name="countryCode"
                id="countryCode"
              >
                <option value="+91">+91</option>
                <option value="+92">+92</option>
                <option value="+93">+93</option>
              </select>
              <input
                className="Hmd border-[0.052vw] bg-transparent border-zinc-400 w-[13.5vw] px-[1vw] py-[1.5vh] rounded-[0.417vw] "
                type="number"
                placeholder={countryCode}
                onChange={(e) => setCus_Number(e.target.value)}
              />
            </div>
          </div>
          <div className="flex justify-between w-full">
            <label className="text-base py-[1.5vh] px-[1vw] rounded-[0.417vw] ">
              Purpose
            </label>
            <input
              className="text-base border-[0.052vw] bg-transparent border-zinc-400 w-[18vw] py-[1.5vh] px-[1vw] rounded-[0.417vw] "
              type="text"
              placeholder="Purpose"
              onChange={(e) => setCus_Pur(e.target.value)}
            />
          </div>
          <div className="mt-[1.5vw] flex w-full justify-end">
            <ContainedButton onClick={makeCall}>Call me now</ContainedButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default playground;
