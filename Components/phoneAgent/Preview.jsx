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

  const { phoneAgentId, countryCode } = useSelector(
    (state) => state.phoneAgent
  );
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
        className={`w-[90%] overflow-y-auto mx-auto h-[80vh] mt-[5vh] mb-[5vh] rounded-xl shadow-lg py-8 px-8 ${
          theme === "dark" ? "bg-[#1F222A] text-white" : "bg-white text-black"
        }`}
      >
        <div className="w-full flex items-start justify-between mb-8 px-8">
          <div className="flex flex-col gap-6">
            <h1 className="text-xl font-semibold text-[#2D3377]/90">
              Preview Agent
            </h1>
            <h5 className="text-sm w-10/12 font-medium text-gray-600 dark:text-gray-400">
              To preview the phone agent, please enter any phone number to
              receive a call from the AI phone agent. You can test the phone
              agent before deployment. You can find the summary of the call
              summary below or after you finish saving.
            </h5>
            <h6 className="text-xs font-medium text-gray-500 dark:text-gray-400">
              In case of further changes, go back to edit the agent.
            </h6>
          </div>

          <div
            className={`flex flex-col ${
              theme === "dark"
                ? "bg-[#1A1C22] text-white"
                : "bg-white text-black"
            } p-8 rounded-xl shadow-lg gap-6 w-[700px]`}
          >
            <div className="flex flex-col w-full space-y-5">
              <div className="flex flex-col space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Phone
                </label>
                <div className="flex gap-3">
                  <select
                    value={countryCode}
                    onChange={(e) => dispatch(setCountryCode(e.target.value))}
                    className={`${
                      theme === "dark"
                        ? "bg-[#1A1C22] text-white border-gray-600"
                        : "bg-gray-50 text-black border-gray-300"
                    } w-24 px-4 py-2.5 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#2D3377] focus:border-transparent transition-all`}
                    name="countryCode"
                    id="countryCode"
                  >
                    <option value="+91">+91</option>
                    <option value="+92">+92</option>
                    <option value="+93">+93</option>
                  </select>
                  <input
                    className={`w-full text-base border rounded-lg px-4 py-2.5 bg-transparent focus:outline-none focus:ring-2 focus:ring-[#2D3377] focus:border-transparent transition-all ${
                      theme === "dark" ? "border-gray-600" : "border-gray-300"
                    }`}
                    type="text"
                    placeholder={countryCode}
                    onChange={(e) => setCus_Number(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex flex-col space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Name
                </label>
                <input
                  className={`w-full text-base border rounded-lg px-4 py-2.5 bg-transparent focus:outline-none focus:ring-2 focus:ring-[#2D3377] focus:border-transparent transition-all ${
                    theme === "dark" ? "border-gray-600" : "border-gray-300"
                  }`}
                  type="text"
                  placeholder="Name"
                  onChange={(e) => setCus_Name(e.target.value)}
                />
              </div>

              <div className="flex flex-col space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Purpose
                </label>
                <input
                  className={`w-full text-base border rounded-lg px-4 py-2.5 bg-transparent focus:outline-none focus:ring-2 focus:ring-[#2D3377] focus:border-transparent transition-all ${
                    theme === "dark" ? "border-gray-600" : "border-gray-300"
                  }`}
                  type="text"
                  placeholder="Purpose"
                  onChange={(e) => setCus_Pur(e.target.value)}
                />
              </div>
            </div>
            <div className="mt-6 flex w-full justify-center">
              <GradientButton
                text="Call Now"
                isActive={true}
                className="hover:opacity-90 hover:scale-[1.02] transition-all duration-200"
                onClick={() => makeCall()}
              />
            </div>
          </div>
        </div>

        <div className="w-full flex justify-center items-center mt-8">
          <div
            className={`w-[80%] h-[200px] rounded-xl px-8 py-8 relative ${
              theme === "dark"
                ? "bg-[#1D2027] text-white"
                : "bg-gray-50 text-black"
            }`}
          >
            <h1 className="text-lg font-medium text-[#2D3377]/90 mb-6">
              Call Summary
            </h1>
            <div className="h-[calc(100%-60px)] overflow-y-auto">
              {/* Call summary content will go here */}
            </div>
          </div>
        </div>
      </div>

      <div
        className={`w-full absolute bottom-0 h-[6.5vh] py-[2vw] ${
          theme === "dark" ? "bg-[#1F222A] text-white" : "bg-white text-black"
        }`}
      >
        <div className="w-full h-full flex justify-end items-center gap-[2vw] px-[3vw] ">
          <OutlinedButton
            onClick={() => navigate.push("/workspace/agents/phone/actions")}
            borderColor="border-2 border-[#8b8b8b] text-[#8b8b8b] hover:border-[#333333] hover:text-[#333333] py-[0.3vw]"
          >
            Back
          </OutlinedButton>
          <ContainedButton onClick={createPhoneAgent} className="py-[0.35vw]">
            Finish
          </ContainedButton>
        </div>
      </div>
    </div>
  );
};

export default Preview;
