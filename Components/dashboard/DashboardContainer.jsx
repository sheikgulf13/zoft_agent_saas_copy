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
      className={`w-[90%] overflow-y-auto h-[90vh]  rounded-[.9vh] shadow-xl py-[2%] px-[2%] relative  ${
        theme === "dark" ? "bg-[#1F222A] text-white" : "bg-white text-black"
      }`}
    >
      <h3 className="text-xl font-bold">Dashboard</h3>
      <div className="flex items-center justify-between my-4">
        <div className="shadow-sm border-gray-300 border-[1px] rounded-xl p-6 mt-4 w-[260px] h-[150px] flex flex-col items-start justify-center hover:scale-[1.05] cursor-pointer transition-all duration-200">
          <h4 className="text-sm font-medium mb-2">Total Phone Agents</h4>
          <p className="text-2xl font-semibold">{data?.Total_phone_agents}</p>
          <p className="text-xs font-medium text-green-500">
            {data?.Total_phone_agents}%
          </p>
          <p className="text-xs font-normal text-gray-400">from last month</p>
        </div>
        <div className="shadow-sm border-gray-300 border-[1px] rounded-xl p-6 mt-4 w-[260px] h-[150px] flex flex-col items-start justify-center hover:scale-[1.05] cursor-pointer transition-all duration-200">
          <h4 className="text-sm font-medium mb-2">Total Calls</h4>
          <p className="text-2xl font-semibold">{data?.Total_calls}</p>
          <p className="text-xs font-medium text-green-500">
            {data?.Total_calls}%
          </p>
          <p className="text-xs font-normal text-gray-400">from last month</p>
        </div>
        <div className="shadow-sm border-gray-300 border-[1px] rounded-xl p-6 mt-4 w-[260px] h-[150px] flex flex-col items-start justify-center hover:scale-[1.05] cursor-pointer transition-all duration-200">
          <h4 className="text-sm font-medium mb-2">
            Total Call Duration (mins)
          </h4>
          <p className="text-2xl font-semibold">
            {data?.Total_call_duration_mins}
          </p>
          <p className="text-xs font-medium text-red-500">
            {data?.Total_call_duration_mins}%
          </p>
          <p className="text-xs font-normal text-gray-400">from last month</p>
        </div>
        <div className="shadow-sm border-gray-300 border-[1px] rounded-xl p-6 mt-4 w-[260px] h-[150px] flex flex-col items-start justify-center hover:scale-[1.05] cursor-pointer transition-all duration-200">
          <h4 className="text-sm font-medium mb-2">
            Average Call Duration (mins)
          </h4>
          <p className="text-2xl font-semibold">
            {data?.Average_call_duration}
          </p>
          <p className="text-xs font-medium text-red-500">
            {data?.Average_call_duration}%
          </p>
          <p className="text-xs font-normal text-gray-400">from last month</p>
        </div>
      </div>

      <div className="flex justify-between items-start mt-20">
        <div className="w-[43%] shadow-sm border-gray-300 border-[1px] rounded-xl p-6">
          <div>
            <h4 className="text-lg font-semibold mb-0.5">
              Cost Breakdown
            </h4>
            <p className="text-sm font-normal text-gray-400">
              Cost analysis by agent and usage
            </p>
          </div>

          <div className=" border-gray-300 border-b-[1px] p-6 mt-4 w-[260px] h-[150px] flex flex-col items-start justify-center hover:scale-[1.05] cursor-pointer transition-all duration-200">
            <h4 className="text-sm font-medium mb-2">Total Cost</h4>
            <p className="text-2xl font-semibold">{data?.Total_cost}</p>
            <p className="text-xs font-medium text-red-500">
              {data?.Total_cost}%
            </p>
            <p className="text-xs font-normal text-gray-400">from last month</p>
          </div>
          <div className=" p-6 mt-4 w-[260px] h-[150px] flex flex-col items-start justify-center hover:scale-[1.05] cursor-pointer transition-all duration-200">
            <h4 className="text-sm font-medium mb-2">Average Cost</h4>
            <p className="text-2xl font-semibold">{data?.Average_cost}</p>
            <p className="text-xs font-medium text-red-500">
              {data?.Average_cost}%
            </p>
            <p className="text-xs font-normal text-gray-400">from last month</p>
          </div>
        </div>

        <div className="w-[55%] flex flex-col gap-6 shadow-sm border-gray-300 border-[1px] rounded-xl p-6">
          <div>
            <h4 className="text-lg font-semibold mb-0.5">Recent Activity</h4>
            <p className="text-sm font-normal text-gray-400">
              Latest agent interactions and events
            </p>
          </div>

          <div className="flex flex-col gap-5">
            <div className="flex w-[100%] h-[70px] border-gray-300 border-[1px] rounded-lg items-center justify-between p-3">
              <div className="flex gap-3">
                <div className="w-[40px] h-[40px] bg-gray-300 rounded-full">

                </div>

                <div className="flex flex-col justify-between h-[100%]">
                  <p className="text-md font-medium">Emily Johnson</p>
                  <p className="text-xs font-medium text-gray-400">Chat Agent #46 . 5m 23s</p>
                </div>
              </div>

              <div className="flex flex-col justify-between h-[100%] items-end">
                <p className="bg-black rounded-full text-white px-3 py-1 text-xs font-semibold">Completed</p>
                <p className="text-xs font-medium text-gray-400">15 minutes ago</p>
              </div>
            </div>

            <div className="flex w-[100%] h-[70px] border-gray-300 border-[1px] rounded-lg items-center justify-between p-3">
              <div className="flex gap-3">
                <div className="w-[40px] h-[40px] bg-gray-300 rounded-full">

                </div>

                <div className="flex flex-col justify-between h-[100%]">
                  <p className="text-md font-medium">John Smith</p>
                  <p className="text-xs font-medium text-gray-400">Phone Agent #53 . 7m 23s</p>
                </div>
              </div>

              <div className="flex flex-col justify-between h-[100%] items-end">
                <p className="bg-red-500 rounded-full text-white px-3 py-1 text-xs font-semibold">Abondoned</p>
                <p className="text-xs font-medium text-gray-400">23 minutes ago</p>
              </div>
            </div>

            <div className="flex w-[100%] h-[70px] border-gray-300 border-[1px] rounded-lg items-center justify-between p-3">
              <div className="flex gap-3">
                <div className="w-[40px] h-[40px] bg-gray-300 rounded-full">

                </div>

                <div className="flex flex-col justify-between h-[100%]">
                  <p className="text-md font-medium">Emily Johnson</p>
                  <p className="text-xs font-medium text-gray-400">Chat Agent #46 . 5m 23s</p>
                </div>
              </div>

              <div className="flex flex-col justify-between h-[100%] items-end">
                <p className="bg-black rounded-full text-white px-3 py-1 text-xs font-semibold">Completed</p>
                <p className="text-xs font-medium text-gray-400">15 minutes ago</p>
              </div>
            </div>
            <div className="flex w-[100%] h-[70px] border-gray-300 border-[1px] rounded-lg items-center justify-between p-3">
              <div className="flex gap-3">
                <div className="w-[40px] h-[40px] bg-gray-300 rounded-full">

                </div>

                <div className="flex flex-col justify-between h-[100%]">
                  <p className="text-md font-medium">John Smith</p>
                  <p className="text-xs font-medium text-gray-400">Phone Agent #53 . 7m 23s</p>
                </div>
              </div>

              <div className="flex flex-col justify-between h-[100%] items-end">
                <p className="bg-red-500 rounded-full text-white px-3 py-1 text-xs font-semibold">Abondoned</p>
                <p className="text-xs font-medium text-gray-400">23 minutes ago</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export { DashboardContainer };
