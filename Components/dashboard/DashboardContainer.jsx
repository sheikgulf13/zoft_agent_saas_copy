"use client";

import { getApiConfig, getApiHeaders } from "@/utility/api-config";
import useTheme from "next-theme";
import React, { useEffect, useState } from "react";

const DashboardContainer = () => {
  const { theme } = useTheme();
  const [data, setData] = useState();

  const fetchDashboardData = async () => {
    const url = process.env.url;
    const response = await fetch(`${url}/dashboard`, {
      ...getApiConfig(),
      method: "GET",
      headers: new Headers({ ...getApiHeaders() }),
    });

    const res = await response.json();
    setData(res);
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return (
    <div
      className={`w-[90%] overflow-y-auto h-[90vh] rounded-[.9vh] shadow-xl py-[2%] px-[2%] relative  ${
        theme === "dark" ? "bg-[#1F222A] text-white" : "bg-white text-black"
      }`}
    >
      <h3 className="text-xl font-bold">Dashboard</h3>
      <div className="flex flex-wrap gap-4 mt-4">
        <div className="shadow-md border-gray-300 border-[1px] rounded-md p-4 mt-4 w-[200px] h-[200px] flex flex-col items-center justify-between">
          <h4 className="text-lg text-[#4863A0] text-center">Total Phone Agents</h4>
          <div className="text-lg w-[120px] h-[120px] flex items-center justify-center text-gray-500">
            <p className="text-lg">{data?.Total_phone_agents}</p>
          </div>
        </div>
        <div className="shadow-md border-gray-300 border-[1px] rounded-md p-4 mt-4 w-[200px] h-[200px] flex flex-col items-center justify-between">
          <h4 className="text-lg text-[#4863A0] text-center">Total Calls</h4>
          <div className="text-lg w-[120px] h-[120px] flex items-center justify-center text-gray-500">
            <p className="text-lg">{data?.Total_calls}</p>
          </div>
        </div>
        <div className="shadow-md border-gray-300 border-[1px] rounded-md p-4 mt-4 w-[200px] h-[200px] flex flex-col items-center justify-between">
          <h4 className="text-lg text-[#4863A0] text-center">Total Call Duration (mins)</h4>
          <div className="text-lg w-[120px] h-[120px] flex items-center justify-center text-gray-500">
            <p className="text-lg">{data?.Total_call_duration_mins}</p>
          </div>
        </div>
        <div className="w-full"></div> {/* This div will force the next items to wrap */}
        <div className="shadow-md border-gray-300 border-[1px] rounded-md p-4 mt-4 w-[200px] h-[200px] flex flex-col items-center justify-between">
          <h4 className="text-lg text-[#4863A0] text-center">Average Call Duration (mins)</h4>
          <div className="text-lg w-[120px] h-[120px] flex items-center justify-center text-gray-500">
            <p className="text-lg">{data?.Average_call_duration}</p>
          </div>
        </div>
        <div className="shadow-md border-gray-300 border-[1px] rounded-md p-4 mt-4 w-[200px] h-[200px] flex flex-col items-center justify-between">
          <h4 className="text-lg text-[#4863A0] text-center">Total Cost</h4>
          <div className="text-lg w-[120px] h-[120px] flex items-center justify-center text-gray-500">
            <p className="text-lg">{data?.Total_cost}</p>
          </div>
        </div>
        <div className="shadow-md border-gray-300 border-[1px] rounded-md p-4 mt-4 w-[200px] h-[200px] flex flex-col items-center justify-between">
          <h4 className="text-lg text-[#4863A0] text-center">Average Cost</h4>
          <div className="text-lg w-[120px] h-[120px] flex items-center justify-center text-gray-500">
            <p className="text-lg">{data?.Average_cost}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export { DashboardContainer };
