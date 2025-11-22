"use client";

import React, { Suspense, useEffect, useState } from "react";
import PhoneSettingNav from "./PhoneSettingNav";
import useTheme from "next-theme";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { ContainedButton } from "@/Components/buttons/ContainedButton";
import { CookieManager } from "../../../utility/cookie-manager"
import { getApiHeaders, getApiConfig } from "@/utility/api-config";
import { setCountryCode } from "@/store/actions/phoneAgentActions";
import AnimatedGradientBackground from "./AnimatedGradientBackground";

const Content = () => {
  const searchParams = useSearchParams();
  const { theme } = useTheme();
  const phoneId = searchParams.get("phoneId");
  const [phoneAgent, setPhoneAgent] = useState({});
  const urlFetch = process.env.url;
  const router = useRouter();
  const dispatch = useDispatch();
  const phone_url = process.env.phone_url;
  const { countryCode } = useSelector((state) => state.phoneAgent);
  const [cus_Number, setCus_Number] = useState("");
  const [cus_Name, setCus_Name] = useState("");
  const [cus_Email, setCus_Email] = useState("");
  const [cus_Pur, setCus_Pur] = useState("");

  const { selectedPhoneAgent, selectedWorkSpace } = useSelector((state) => state.selectedData);

  console.log(selectedPhoneAgent)
  const [phoneAgentID, setPhoneAgentID] = useState(selectedPhoneAgent?.id);
  console.log('TEsting')
  console.log(phoneAgentID)

  const getAgent = async () => {
    {
      /*if (!phoneId || phoneId == "") {
      const agent = localStorage.getItem("current_phone_agent");
      if (agent) setPhoneAgent(JSON.parse(agent));
     
      return;
    */
    }
    const formData = new FormData();
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
    // const reqURL = `${phone_url}/start-call`;
    const reqURL = `${phone_url}/outgoing-call`;
    const formData = new FormData();
   const data1={
    "customer_phone_number": `${countryCode}${cus_Number}`,
    "phone_agent_id": phoneAgentID,
    // "phone_agent_id":"06f9b34b-77f9-4b4e-9d8f-f86e6d96dda5",
    "customer_name": cus_Name,
    "customer_email": cus_Email,
    "customer_business_details": cus_Pur
    }
    const response = await fetch(reqURL, {
      ...getApiConfig(),
      mode: "cors",
      method: "POST",
      headers: new Headers({
        "ngrok-skip-browser-warning": "true",
        ...getApiHeaders(),
      }),
      body: JSON.stringify(data1),
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
      className={`flex flex-col justify-start items-start px-8  w-full h-[100vh] `}
    >
      <div
        className={`border-b-[1px] mt-8 mb-8 flex justify-center relative w-full text-base border-zinc-300 ${
          theme === "dark" ? "text-[#9f9f9f]" : " text-black"
        }`}
      >
        <PhoneSettingNav />
      </div>

      <div className="flex w-full h-full relative">
        <AnimatedGradientBackground />
        <div className={`absolute flex flex-col top-8 right-8 z-10 ${
          theme === "dark" ? "bg-[#1A1C22] text-white" : "bg-white text-black"
        } p-6 rounded-xl shadow-lg gap-4`}>
          <div className={`${
            theme === "dark" ? "text-white" : "text-black"
          } flex items-center gap-3`}>
            <h6 className="text-xl font-semibold text-[#2D3377]/90">Zoft</h6>
          </div>

          <div className="flex flex-col w-full space-y-4">
            <div className="flex flex-col space-y-2">
              <label className={`text-sm font-medium ${
                theme === "dark" ? "text-gray-200" : "text-gray-700"
              }`}>
                Name
              </label>
              <input
                className={`w-full text-base border ${
                  theme === "dark" ? "border-gray-600" : "border-gray-300"
                } rounded-lg px-4 py-2.5 bg-transparent focus:outline-none focus:ring-2 focus:ring-[#2D3377] focus:border-transparent transition-all`}
                type="text"
                placeholder="Enter your name"
                onChange={(e) => setCus_Name(e.target.value)}
              />
            </div>

            <div className="flex flex-col space-y-2">
              <label className={`text-sm font-medium ${
                theme === "dark" ? "text-gray-200" : "text-gray-700"
              }`}>
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
                  className={`flex-1 text-base border ${
                    theme === "dark" ? "border-gray-600" : "border-gray-300"
                  } rounded-lg px-4 py-2.5 bg-transparent focus:outline-none focus:ring-2 focus:ring-[#2D3377] focus:border-transparent transition-all`}
                  type="number"
                  placeholder="Enter phone number"
                  onChange={(e) => setCus_Number(e.target.value)}
                />
              </div>
            </div>

            <div className="flex flex-col space-y-2">
              <label className={`text-sm font-medium ${
                theme === "dark" ? "text-gray-200" : "text-gray-700"
              }`}>
                Email
              </label>
              <input
                className={`w-full text-base border ${
                  theme === "dark" ? "border-gray-600" : "border-gray-300"
                } rounded-lg px-4 py-2.5 bg-transparent focus:outline-none focus:ring-2 focus:ring-[#2D3377] focus:border-transparent transition-all`}
                type="email"
                placeholder="Enter your email"
                onChange={(e) => setCus_Email(e.target.value)}
              />
            </div>

            <div className="flex flex-col space-y-2">
              <label className={`text-sm font-medium ${
                theme === "dark" ? "text-gray-200" : "text-gray-700"
              }`}>
                Business details
              </label>
              <input
                className={`w-full text-base border ${
                  theme === "dark" ? "border-gray-600" : "border-gray-300"
                } rounded-lg px-4 py-2.5 bg-transparent focus:outline-none focus:ring-2 focus:ring-[#2D3377] focus:border-transparent transition-all`}
                type="text"
                placeholder="Enter your business details"
                onChange={(e) => setCus_Pur(e.target.value)}
              />
            </div>

            <div className="mt-6 flex w-full justify-end">
              <ContainedButton 
                onClick={makeCall}
                className="bg-[#2D3377] hover:bg-[#2D3377]/90 transition-colors"
              >
                Call me now
              </ContainedButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const playground = () => {
  return (
    <Suspense fallback={"Loading..."}>
      <Content />
    </Suspense>
  )
}

export default playground;
