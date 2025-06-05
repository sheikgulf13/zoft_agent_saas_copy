// components/MainContent.jsx
"use client";
import React, { useEffect } from "react";
import Header from "./Header";
import useTheme from "next-theme";
import { getApiConfig, getApiHeaders } from "@/utility/api-config";
import { useSearchParams } from "next/navigation";
import { DashboardContainer } from "./dashboard/DashboardContainer";

const MainContent = () => {
  const { theme, setTheme } = useTheme();
  const searchParams = useSearchParams();

  const authenticateCalendly = (code) => {
    const url = process.env.url;

    const form = new FormData();
    form.append("app_integration", "calendly");
    form.append("authorization_code", code);

    fetch(`${url}/public/integration`, {
      ...getApiConfig(),
      method: "post",
      headers: new Headers({ ...getApiHeaders() }),
      body: form,
    }).then(() => {
      window.close();
    });
  };

  useEffect(() => {
    const code = searchParams.get("code");

    console.log(code);

    if (code?.length && searchParams) {
      authenticateCalendly(code);
    }
  }, [searchParams]);

  return (
    <div
      className={`h-screen items-center justify-center flex flex-col p- flex-1 ${
        theme === "dark" ? "bg-[#1F222A] text-white" : "bg-white"
      }`}
    >
      {/* <Header /> */}
      <div className="bg-white flex items-center justify-end w-full min-h-[8vh] max-h-[8vh] px-10 shadow-sm border border-b-gray-200">
        <button className="text-black border border-blue-950 rounded-full px-10 py-2">
          Upgrade
        </button>
      </div>
      <DashboardContainer />
    </div>
  );
};

export default MainContent;
