"use client";

import { getDashboardDataApi } from "@/api/dashboard/dashboard";
import useTheme from "next-theme";
import React, { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  BarElement,
  Filler,
  ArcElement,
} from "chart.js";
import { Line, Bar, Pie } from "react-chartjs-2";

ChartJS.register(
  LinearScale,
  CategoryScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  Filler
);

const DashboardContainer = () => {
  const { theme } = useTheme();
  const [data, setData] = useState();
  const [noData, setNoData] = useState(false);

  const fetchDashboardData = async () => {
    const response = await getDashboardDataApi();

    if (response) {
      setData(response);
      setNoData(false);
    } else {
      setNoData(true)
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const [chart, setChart] = useState("Line");
  const [isOpen, setIsOpen] = useState(false);
  const [detail, setDetail] = useState([
    {
      employee_name: "subdeep",
      employee_salary: 45000,
      employee_age: 45,
    },
    {
      employee_name: "sheik",
      employee_salary: 87000,
      employee_age: 22,
    },
    {
      employee_name: "no name",
      employee_salary: 500,
      employee_age: 32,
    },
    {
      employee_name: "elon",
      employee_salary: 4000,
      employee_age: 5,
    },
  ]);

  useEffect(() => {
    console.log("adata check", data);
  }, [data]);

  const callDirectionData = {
    labels: data?.call_direction ? Object.keys(data.call_direction) : [],
    datasets: [
      {
        data: data?.call_direction ? Object.values(data.call_direction) : [],
        backgroundColor: [
          "#8A2BE2",
          "#4B0082",
          "#1E90FF",
          "#4169E1",
          "#00FFFF",
        ],
        borderColor: ["#8A2BE2", "#4B0082", "#1E90FF", "#4169E1", "#00FFFF"],
        borderWidth: 1,
      },
    ],
  };
  const callStatusData = {
    labels: data?.call_status ? Object.keys(data.call_status) : [],
    datasets: [
      {
        data: data?.call_status ? Object.values(data.call_status) : [],
        backgroundColor: [
          "#87CEFA",
          "#9370DB",
          "#B0C4DE",
          "#4682B4",
          "#D8BFD8",
          "#6A5ACD",
          "#E6E6FA",
          "#4169E1",
          "#BA55D3",
          "#483D8B",
        ],
        borderColor: [
          "#B0C4DE",
          "#9370DB",
          "#87CEFA",
          "#4682B4",
          "#D8BFD8",
          "#6A5ACD",
          "#E6E6FA",
          "#4169E1",
          "#BA55D3",
          "#483D8B",
        ],
        borderWidth: 1,
      },
    ],
  };
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: true,
    },
    scales: {
      y: {
        type: "linear",
      },
    },
  };

  return (
    <div
      className={`w-full overflow-y-auto h-full  rounded-lg shadow-md py-[2%] px-10 relative  ${
        theme === "dark" ? "bg-[#1F222A] text-white" : "bg-[#FFFFFF] text-black"
      }`}
    >
      <h3 className="text-2xl font-bold text-[#2D3377]">Dashboard</h3>

      {noData ? (
        <div className="flex items-center justify-center h-[80vh]">
          <div className="text-center">
            <div className="mb-4">
              <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No Dashboard Data Available</h3>
            <p className="text-gray-500">We're currently unable to display the dashboard information. Please try again later.</p>
          </div>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between my-4 gap-4">
            <div className="shadow-md border-gray-200 border-[1px] rounded-xl p-6 mt-4 h-[150px] flex flex-1 flex-col items-start justify-center hover:scale-[1.05] cursor-pointer transition-all duration-200">
              <h4 className="text-sm font-medium mb-2">Total Phone Agents</h4>
              <p className="text-2xl font-semibold">
                {data?.Total_phone_agents}
              </p>
              <p className="text-xs font-medium text-green-500">
                {data?.Total_phone_agents}%
              </p>
              <p className="text-xs font-normal text-gray-400">
                from last month
              </p>
            </div>
            <div className="shadow-md border-gray-200 border-[1px] rounded-xl p-6 mt-4 h-[150px] flex flex-1 flex-col items-start justify-center hover:scale-[1.05] cursor-pointer transition-all duration-200">
              <h4 className="text-sm font-medium mb-2">Total Calls</h4>
              <p className="text-2xl font-semibold">{data?.Total_calls}</p>
              <p className="text-xs font-medium text-green-500">
                {data?.Total_calls}%
              </p>
              <p className="text-xs font-normal text-gray-400">
                from last month
              </p>
            </div>
            <div className="shadow-md border-gray-200 border-[1px] rounded-xl p-6 mt-4 h-[150px] flex flex-1 flex-col items-start justify-center hover:scale-[1.05] cursor-pointer transition-all duration-200">
              <h4 className="text-sm font-medium mb-2">
                Total Call Duration (mins)
              </h4>
              <p className="text-2xl font-semibold">
                {data?.Total_call_duration_mins}
              </p>
              <p className="text-xs font-medium text-red-500">
                {data?.Total_call_duration_mins}%
              </p>
              <p className="text-xs font-normal text-gray-400">
                from last month
              </p>
            </div>
            <div className="shadow-md border-gray-200 border-[1px] rounded-xl p-6 mt-4 h-[150px] flex flex-1 flex-col items-start justify-center hover:scale-[1.05] cursor-pointer transition-all duration-200">
              <h4 className="text-sm font-medium mb-2">
                Average Call Duration (mins)
              </h4>
              <p className="text-2xl font-semibold">
                {data?.Average_call_duration}
              </p>
              <p className="text-xs font-medium text-red-500">
                {data?.Average_call_duration}%
              </p>
              <p className="text-xs font-normal text-gray-400">
                from last month
              </p>
            </div>
          </div>

          <div className="flex w-full gap-10 my-10">
            <div
              className={`flex flex-1 flex-col gap-5 items-center justify-center  p-5 rounded-xl ${
                theme === "dark"
                  ? "bg-[#1F222A] text-white border border-white"
                  : "bg-gray-50 text-black"
              }`}
            >
              <h6 className="text-lg font-semibold w-full text-start">
                Call Direction
              </h6>

              <div
                className={`w-[70%]  ${
                  theme === "dark"
                    ? "bg-[#1F222A] text-white"
                    : "bg-gray-50 text-black"
                }`}
              >
                <Pie data={callDirectionData} className="my-5" />
              </div>
            </div>
            <div
              className={`flex flex-1 flex-col gap-5 items-center justify-center  p-5 rounded-xl ${
                theme === "dark"
                  ? "bg-[#1F222A] text-white border border-white"
                  : "bg-gray-50 text-black"
              }`}
            >
              <h6 className="text-lg font-semibold w-full text-start">
                Call Status
              </h6>

              <div
                className={`w-[70%]  ${
                  theme === "dark"
                    ? "bg-[#1F222A] text-white"
                    : "bg-gray-50 text-black"
                }`}
              >
                <Pie data={callStatusData} className="my-5" />
              </div>
            </div>
          </div>

          <div className="flex justify-between items-start mt-20">
            <div className="w-[43%] shadow-sm border-gray-300 border-[1px] rounded-xl p-6">
              <div>
                <h4 className="text-lg font-semibold mb-0.5">Cost Breakdown</h4>
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
                <p className="text-xs font-normal text-gray-400">
                  from last month
                </p>
              </div>
              <div className=" p-6 mt-4 w-[260px] h-[150px] flex flex-col items-start justify-center hover:scale-[1.05] cursor-pointer transition-all duration-200">
                <h4 className="text-sm font-medium mb-2">Average Cost</h4>
                <p className="text-2xl font-semibold">{data?.Average_cost}</p>
                <p className="text-xs font-medium text-red-500">
                  {data?.Average_cost}%
                </p>
                <p className="text-xs font-normal text-gray-400">
                  from last month
                </p>
              </div>
            </div>

            <div className="w-[55%] flex flex-col gap-6 shadow-sm border-gray-300 border-[1px] rounded-xl p-6">
              <div>
                <h4 className="text-lg font-semibold mb-0.5">
                  Recent Activity
                </h4>
                <p className="text-sm font-normal text-gray-400">
                  Latest agent interactions and events
                </p>
              </div>

              <div className="flex flex-col gap-5">
                <div className="flex w-[100%] h-[70px] border-gray-300 border-[1px] rounded-lg items-center justify-between p-3">
                  <div className="flex gap-3">
                    <div className="w-[40px] h-[40px] bg-gray-300 rounded-full"></div>

                    <div className="flex flex-col justify-between h-[100%]">
                      <p className="text-md font-medium">Emily Johnson</p>
                      <p className="text-xs font-medium text-gray-400">
                        Chat Agent #46 . 5m 23s
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col justify-between h-[100%] items-end">
                    <p className="bg-black rounded-full text-white px-3 py-1 text-xs font-semibold">
                      Completed
                    </p>
                    <p className="text-xs font-medium text-gray-400">
                      15 minutes ago
                    </p>
                  </div>
                </div>

                <div className="flex w-[100%] h-[70px] border-gray-300 border-[1px] rounded-lg items-center justify-between p-3">
                  <div className="flex gap-3">
                    <div className="w-[40px] h-[40px] bg-gray-300 rounded-full"></div>

                    <div className="flex flex-col justify-between h-[100%]">
                      <p className="text-md font-medium">John Smith</p>
                      <p className="text-xs font-medium text-gray-400">
                        Phone Agent #53 . 7m 23s
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col justify-between h-[100%] items-end">
                    <p className="bg-red-500 rounded-full text-white px-3 py-1 text-xs font-semibold">
                      Abondoned
                    </p>
                    <p className="text-xs font-medium text-gray-400">
                      23 minutes ago
                    </p>
                  </div>
                </div>

                <div className="flex w-[100%] h-[70px] border-gray-300 border-[1px] rounded-lg items-center justify-between p-3">
                  <div className="flex gap-3">
                    <div className="w-[40px] h-[40px] bg-gray-300 rounded-full"></div>

                    <div className="flex flex-col justify-between h-[100%]">
                      <p className="text-md font-medium">Emily Johnson</p>
                      <p className="text-xs font-medium text-gray-400">
                        Chat Agent #46 . 5m 23s
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col justify-between h-[100%] items-end">
                    <p className="bg-black rounded-full text-white px-3 py-1 text-xs font-semibold">
                      Completed
                    </p>
                    <p className="text-xs font-medium text-gray-400">
                      15 minutes ago
                    </p>
                  </div>
                </div>
                <div className="flex w-[100%] h-[70px] border-gray-300 border-[1px] rounded-lg items-center justify-between p-3">
                  <div className="flex gap-3">
                    <div className="w-[40px] h-[40px] bg-gray-300 rounded-full"></div>

                    <div className="flex flex-col justify-between h-[100%]">
                      <p className="text-md font-medium">John Smith</p>
                      <p className="text-xs font-medium text-gray-400">
                        Phone Agent #53 . 7m 23s
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col justify-between h-[100%] items-end">
                    <p className="bg-red-500 rounded-full text-white px-3 py-1 text-xs font-semibold">
                      Abondoned
                    </p>
                    <p className="text-xs font-medium text-gray-400">
                      23 minutes ago
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export { DashboardContainer };
