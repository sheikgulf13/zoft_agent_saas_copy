"use client";
import React, { useState } from "react";
import GradientButton from "../buttons/GradientButton";
import { setCountryCode } from "../../store/actions/phoneAgentActions";
import { useDispatch, useSelector } from "react-redux";
import useTheme from "next-theme";
import TickIcon from "../Icons/TickIcon";
import { useRouter } from "next/navigation";
import { getApiConfig, getApiHeaders } from "@/utility/api-config";
import { OutlinedButton } from "../buttons/OutlinedButton";
import { ContainedButton } from "../buttons/ContainedButton";

const Preview = () => {
  const { theme } = useTheme();
  const dispatch = useDispatch();
  const url = process.env.url;

  const {
    phoneAgentId,
    countryCode,
  } = useSelector((state) => state.phoneAgent);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5; // Number of rows per page
  const [cus_Number, setCus_Number] = useState("");
  const [cus_Name, setCus_Name] = useState("");
  const [cus_Pur, setCus_Pur] = useState("");
  const navigate = useRouter();
  const callSummaries = [
    {
      contact: "+91 405 555-0128",
      duration: "20s",
      date: "05 Jan 2024 02:34 PM",
      to: "",
    },
    {
      contact: "+91 405 555-0128",
      duration: "20s",
      date: "05 Jan 2024 02:34 PM",
      to: "",
    },
    {
      contact: "+91 405 555-0128",
      duration: "20s",
      date: "05 Jan 2024 02:34 PM",
      to: "",
    },
    {
      contact: "+91 405 555-0128",
      duration: "20s",
      date: "05 Jan 2024 02:34 PM",
      to: "",
    },
    {
      contact: "+91 405 555-0128",
      duration: "20s",
      date: "05 Jan 2024 02:34 PM",
      to: "",
    },
    {
      contact: "+91 405 555-0128",
      duration: "20s",
      date: "05 Jan 2024 02:34 PM",
      to: "",
    },
    {
      contact: "+91 405 555-0128",
      duration: "20s",
      date: "05 Jan 2024 02:34 PM",
      to: "",
    },
    {
      contact: "+91 405 555-0128",
      duration: "20s",
      date: "05 Jan 2024 02:34 PM",
      to: "",
    },
    {
      contact: "+91 405 555-0128",
      duration: "20s",
      date: "05 Jan 2024 02:34 PM",
      to: "",
    },
  ];

  // Calculate pagination
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = callSummaries.slice(indexOfFirstRow, indexOfLastRow);

  // Total number of pages
  const totalPages = Math.ceil(callSummaries.length / rowsPerPage);

  // Change page function
  const changePage = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };
  const createPhoneAgent = async () => {
    navigate.push("/workspace/agents");
  };

  const makeCall = async () => {
    const reqURL = `${url}/start-call`;
    const formData = new FormData();
    formData.append("phone_agent_id", phoneAgentId);
    formData.append("customer_name", cus_Name);
    formData.append("customer_phonenumber", countryCode + cus_Number);
    formData.append("custmer_businessdetails", cus_Pur);
    const response = await fetch(reqURL, {
      ...getApiConfig(),
      method: "POST",
      headers: new Headers({
        ...getApiHeaders(),
      }),
      body: formData,
    });
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    console.log(reqURL, data);
  };
  return (
    <div
      className={`w-full h-screen relative flex flex-col justify-center items-center ${
        theme === "dark" ? "bg-[#1D2027] text-white" : "bg-[#F2F4F7] text-black"
      }`}
    >
      <div
        className={`w-full absolute top-0 left-[50%] translate-x-[-50%] border-b-[.1vw] border-zinc-300 p-[1.5vw] h-[6vh] flex justify-center items-center ${
          theme === "dark" ? "bg-[#1A1C21] text-white" : "bg-white text-black"
        }`}
      >
        <div className="w-[75%] h-full flex items-center justify-center gap-[1vw]">
            <div className="h-full flex items-center justify-start gap-[.5vw]">
              <div className="circle bg-green-600  w-[2vw] h-[2vw] rounded-full flex justify-center items-center">
                <TickIcon />
              </div>
              <h2 className="capitalize font-medium text-[.9vw]">
                phonebot creation
              </h2>
              {/* <Chip label={phoneAgentType} color="primary" /> */}
            </div>

            <div className="h-[1px] w-[3vw] bg-zinc-300 "></div>

            <div className="h-full flex items-center justify-start gap-[.5vw]">
              <div className="circle bg-green-600  w-[2vw] h-[2vw] rounded-full flex justify-center items-center">
                <TickIcon />
              </div>
              <h2 className="capitalize font-medium text-[.9vw]">Actions</h2>
            </div>

            <div className="h-[1px] w-[3vw] bg-zinc-300 "></div>

            <div className="h-full flex items-center justify-start gap-[.5vw] opacity-[.4]">
              <div className="circle text-blue-400 w-[2vw] h-[2vw] rounded-full border-cyan-500 border-[.2vw] flex justify-center items-center">
                3
              </div>
              <h2 className="capitalize font-medium text-[.9vw]">Preview</h2>
            </div>
          </div>
      </div>

      <div
        className={`w-[90%] overflow-y-auto mx-auto h-[80vh] mt-[5vh] mb-[5vh] rounded-[.9vh] shadow-xl py-[3.5vh] px-[2.7vh]  ${
          theme === "dark" ? "bg-[#1F222A] text-white" : "bg-white text-black"
        }`}
      >
        <div className="w-full h-[0.4vh]/2 flex items-start justify-around mb-[1vw] px-[3vw]">
          <div className="flex flex-col gap-[2vw]">
            <h1 className="text-[1.3vw] capitalize font-semibold">
              preview agent
            </h1>
            <h5 className="text-[.8vw] w-10/12 font-medium text-zinc-500">
              To preview the phone agent, please enter any phone number to
              receive a call from the AI phone agent. You can test the phone
              agent before deployment. You can find the summary of the call
              summary below or after you finish saving.
            </h5>
            <h6 className="text-[.725vw] font-medium text-zinc-500">
              In case of further changes, go back to edit the agent.
            </h6>
          </div>

          <div className="w-full flex flex-col items-start gap-[2vw] bg-white rounded-[0.417vw] m-[1vw] p-[1.5vw] shadow-[0_5px_30px_-10px_rgba(0,0,0,0.3)]">
            <div className="flex justify-between w-full">
              <label className="text-[1vw] py-[1.5vh] px-[1vw] rounded-[0.417vw] ">
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
                  } Hmd px-[1vw] py-[1.5vh] rounded-[0.417vw] select cursor-pointer`}
                  name="countryCode"
                  id="countryCode"
                >
                  <option value="+91">+91</option>
                  <option value="+92">+92</option>
                  <option value="+93">+93</option>
                </select>
                <input
                  className="Hmd border-[0.052vw] bg-transparent border-zinc-400 w-[12.5vw] py-[1.5vh] px-[1vw] rounded-[0.417vw] "
                  type="text"
                  placeholder={countryCode}
                  onChange={(e) => setCus_Number(e.target.value)}
                />
              </div>
            </div>
            <div className="flex justify-between w-full">
              <label className="text-[1vw] py-[1.5vh] px-[1vw] rounded-[0.417vw] ">
                Name
              </label>
              <input
                className=" text-[1vw] border-[0.052vw] bg-transparent border-zinc-400 w-[18vw] py-[1.5vh] px-[1vw] rounded-[0.417vw] "
                type="text"
                placeholder="Name"
                onChange={(e) => setCus_Name(e.target.value)}
              />
            </div>
            <div className="flex justify-between w-full">
              <label className="text-[1vw] py-[1.5vh] px-[1vw] rounded-[0.417vw] ">
                Purpose
              </label>
              <input
                className="text-[1vw] border-[0.052vw] bg-transparent border-zinc-400 w-[18vw] py-[1.5vh] px-[1vw] rounded-[0.417vw] "
                type="text"
                placeholder="Purpose"
                onChange={(e) => setCus_Pur(e.target.value)}
              />
            </div>
            <div className="flex justify-end mx-auto mb-[1vh]">
              <GradientButton
                text="call now"
                className=" contentButton bg-gradient-to-r from-[#EB1CD6]  to-[#F4A36F] text-white px-[3vw] text-[1vw] "
                onClick={() => makeCall()}
              />
            </div>
          </div>
        </div>

        <div className="w-full h-[0.4vh]/2  flex justify-center items-center">
          <div
            className={`w-[80vw] h-auto  rounded-[0.417vw] px-[2vw] py-[2vw] relative ${
              theme === "dark"
                ? "bg-[#1D2027] text-white"
                : "bg-[#F2F4F7] text-black"
            }`}
          >
            <h1 className="text-[1.042vw] capitalize font-medium mb-[1.6vh]">
              {" "}
              Call Summary
            </h1>
            <div className="h-auto"></div>
          </div>
        </div>
      </div>

      <div
        className={`w-full absolute right-0 bottom-0 h-[6.5vh] ${
          theme === "dark" ? "bg-[#1F222A] text-white" : "bg-white text-black"
        }`}
      >
        <div className="w-full h-full flex justify-end items-center gap-[2vw] px-[3vw] ">
          <OutlinedButton
            onClick={() =>
              navigate.push("/workspace/agents/phone/actions")
            }
          >
            Back
          </OutlinedButton>
          <ContainedButton onClick={createPhoneAgent}>
            Finish
          </ContainedButton>
        </div>
      </div>
    </div>
  );
};

export default Preview;
