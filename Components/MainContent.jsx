// components/MainContent.jsx
"use client";
import React, { useEffect } from "react";
import Header from "./Header";
import useTheme from "next-theme";
import {
  getApiConfig,
  getApiHeaders,
} from "@/utility/api-config";
import { useSearchParams } from "next/navigation";

const MainContent = () => {
  const { theme, setTheme } = useTheme();
  const searchParams = useSearchParams();

  const authenticateCalendly = (code) => {
    const url = process.env.url;

    const form = new Form();
    form.append("app_integration","calendly");
    form.append("authorization_code",code);

    fetch(`${url}/public/integration`, {
      ...getApiConfig(),
      method: "post",
      headers: new Headers({ ...getApiHeaders() }),
      body: JSON.stringify(form),
    }).then(() => {
      window.close();
    });
  };

  useEffect(() => {
    const code = searchParams.get("code");

    console.log(code);

    if (code?.length) {
      authenticateCalendly();
    }
  }, []);

  return (
    <div
      className={`p- flex-1 ${
        theme === "dark" ? "bg-[#1F222A] text-white" : "bg-[#F2F4F7]"
      }`}
    >
      <Header />
    </div>
  );
};

export default MainContent;
