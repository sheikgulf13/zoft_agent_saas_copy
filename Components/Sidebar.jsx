"use client";
import React, { useState, useEffect } from "react";
import GradientButton from "./buttons/GradientButton";
import GradientButton2 from "./buttons/GradientButton2";
import Link from "next/link";
import { useSelector } from "react-redux";
import useTheme from "next-theme";
import { motion } from "framer-motion";
import { FaAngleDoubleLeft, FaAngleDoubleRight } from "react-icons/fa";
import { FiLogOut, FiPieChart, FiMessageSquare, FiUsers, FiSettings } from "react-icons/fi";
import { HiSpeakerphone } from "react-icons/hi";
import { IoMoonOutline, IoSunny } from "react-icons/io5";
import { HiSpeakerPhone } from "react-icons/hi2";
import { getApiConfig, getApiHeaders } from "@/utility/api-config";
import { usePathname } from "next/navigation";
import { CookieManager } from "../utility/cookie-manager";

const variants = {
  open: { width: "15vw", width: "15%", transition: { duration: 0.5 } },
  closed: { width: "5%", transition: { duration: 0.5 } }
};

const textVariants = {
  open: { opacity: 1, display: "block" },
  closed: { opacity: 0, display: "none" },
};

const Sidebar = ({ isSidebarCollapsed, toggleSidebar }) => {
  const [activeButton, setActiveButton] = useState("dashboard");
  const { profilePicture, displayName } = useSelector((state) => state.profile);
  const { theme, setTheme } = useTheme();
  const [isOpen, setisOpen] = useState(true);
  const url = process.env.url;

  const pathname = usePathname();

  useEffect(() => {
    import("@lordicon/element").then(({ defineElement }) => {
      import("lottie-web").then((lottie) => {
        defineElement(lottie.loadAnimation);
      });
    });
  }, []);

  //sidebar collapse on chatsettings
  useEffect(() => {
    isSidebarCollapsed === true ? setisOpen(false) : setisOpen(true);
    console.log(isSidebarCollapsed);
  }, [isSidebarCollapsed]);

  const handleButtonClick = async (index, button) => {
    if (button.text === "logout") {
      // const refresh_token=getCookie("refresh_token")
      const response = await fetch(`${url}/auth/signout`, {
        ...getApiConfig(),
        method: "POST",
        headers: new Headers({
          ...getApiHeaders(),
          "Content-Type": "application/json",
        }),
      });
      const data = await response.text();
      if (data) {
        CookieManager.deleteCookie("session_id");
      }
    }
    setActiveButton(button.text);
  };

  const navButtons = [
    {
      Icon: FiPieChart,
      text: "dashboard",
      path: "/dashboard",
      className: "Pie first",
      color: "primary",
    },
    {
      Icon: FiMessageSquare,
      text: "workspace",
      path: "/workspace",
      className: "Message second",
      color: "primary",
    },
    {
      Icon: '/images/integration.png',
      text: "Integrations",
      path: "/integrations",
      className: "Integrations",
      color: "primary",
    },
    //{ Icon: MessageIcon, text: 'chat agent', path: '/chats', className: 'Message second', color: 'primary' },
    //{ Icon: PhoneIcon, text: 'phone agent', path: '/phone', className: 'Phone third', color: 'primary' },
    // {
    //   Icon: EmailIcon,
    //   text: "email",
    //   path: "/email",
    //   className: "Email fourth",
    //   color: "primary",
    // },
    {
      Icon: FiUsers,
      text: "team",
      path: "/team",
      className: "Team fifth",
      color: "primary",
    },
    {
      Icon: HiSpeakerphone,
      text: "campaigns",
      path: "/campaigns",
      className: "Campaign seventh",
      color: "primary",
    },
    {
      Icon: FiSettings,
      text: "settings",
      path: "/settings",
      className: "Setting sixth",
      color: "primary",
    },
    {
      Icon: FiLogOut,
      text: "logout",
      path: "/register",
      className: "Logout eighth",
      color: "primary",
    },
    {
      Icon: profilePicture,
      text: displayName,
      path: "/profile",
      padding: "pr-[5vw]",
      className: "Profile ",
      color: "primary",
    },
  ];

  const profileButton = navButtons.find(
    (button) => button.text === displayName
  );

  return (
    <motion.div
      animate={isOpen ? "open" : "closed"}
      variants={variants}
      className={`overflow-hidden h-screen flex flex-col items-center border-r-[.1vw] border-zinc-300 shadow-xl ${
        theme === "dark"
          ? "bg-[#1A1C22] text-[#737791]"
          : "bg-white text-[#737791]"
      }`}
      id="sidebar"
    >
      <div
        className={`w-[90%] flex items-center justify-between ${
          isOpen ? "flex mt-[.5vw] pr-[.5vw]" : "flex-col -pr-[.8vw]"
        } `}
      >
        <div
          className={`uppercase text-center justify-self-center font-bold flex justify-center items-center h-fit ${
            isOpen ? "ml-[0vw]" : "-ml-[3.5vw mt-[1vw]"
          }`}
        >
          <div className="p-[.4vw] rounded-[.6vw]">
            <img
              src={`${theme === "dark" ? "/images/ZOFT_LOGO2_Dark.png" : "/images/ZOFT_LOGO2.png"}`}
              alt="Logo"
              className="w-[3.5vw] h-[3.5vw]"
            />
          </div>
          {isOpen && (
            <h1 className="text-lg mt-[.5vh] text-center font-bold bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#211C84]/95 via-[#4D55CC]/90 via-[#2A1B5D]/85 via-[#3B2B8E]/80 to-[#211C84]/95 backdrop-blur-sm text-transparent bg-clip-text">
              Zoft
            </h1>
          )}
        </div>

        <div
          className={`w-[2.2vw] relative h-[2.2vw] mt-[.5vh] bg-[#f2f0ef] px-[0.2vw] py-[0.4vw] rounded-md flex justify-center items-center cursor-pointer transition-all duration-300 hover:scale-105`}
          onClick={() => setisOpen((isOpen) => !isOpen)}
        >
          {isOpen ? (
            <FaAngleDoubleLeft size="0.9vw" className="text-[#4D55CC]" />
          ) : (
            <FaAngleDoubleRight size="0.9vw" className="text-[#4D55CC]" />
          )}
        </div>
      </div>

      <div className="flex flex-col items-center h-full relative border-t pt-[2vh] border-zinc-300 w-[90%]">
        <div className="w-full h-1/2 flex flex-col items-center gap-[.6vw] relative">
          {navButtons.slice(0, 5).map((button, index) => {
            const isActive = button.path === '/integrations' ? pathname === button.path : pathname.includes(button.path);

            return (
              <Link
                href={button.path}
                className="w-full flex justify-center"
                key={index}
              >
                <GradientButton
                  Icon={button.Icon}
                  text={button.text}
                  isActive={isActive}
                  onClick={() => handleButtonClick(index, button)}
                  className={`w-full text-sm ${button.padding}
                ${isActive ? "" : button.color}
                ${button.width}
                ${isActive ? `${button.className}` : ``}
                ${isOpen ? "inline-block" : "hidden"} `}
                  iconClassName={button.className}
                />
                <div>
                  <GradientButton
                    Icon={button.Icon}
                    isActive={isActive}
                    onClick={() => handleButtonClick(index, button)}
                    className={`${isActive ? "" : button.color}
                  ${isActive ? `${button.className}` : ``}
                  ${isOpen ? "hidden" : "inline-block"} `}
                  >
                    {typeof button.Icon === 'function' ? (
                      <button.Icon
                        size="1vw"
                        isActive={isActive}
                        className={button.className}
                        style={{width: "1.2vw", height: "1.2vw"}}
                      />
                    ) : (
                      <button.Icon
                        className={`flex flex-col ${
                          isOpen ? "inline-block" : "hidden"
                        } w-[1vw] h-[1vw]`}
                      />
                    )}
                  </GradientButton>
                </div>
                {/* <motion.span
                animate={isOpen ? 'open' : 'closed'}
                variants={textVariants}
                transition={{duration: .6, ease: 'easeInOut'}}
                className={` ${isOpen ? 'inline-block' : 'hidden'}`}>
              </motion.span> */}
              </Link>
            );
          })}
        </div>
        <div className="w-full pt-4 pb-4 flex flex-col items-center justify-end gap-[.5vw] mt-auto border-t border-b mb-4 border-zinc-300">
          {navButtons.slice(5, 7).map((button, index) => {
            const isActive = button.path === '/integrations' ? pathname === button.path : button.path === '/settings' ? pathname === button.path : pathname.includes(button.path);
            return (

            <Link
              href={button.path}
              className="w-full flex justify-center"
              key={index}
            >
              <GradientButton
                Icon={button.Icon}
                text={button.text}
                isActive={isActive}
                onClick={() => handleButtonClick(index, button)}
                className={` w-full text-sm ${button.padding}
                ${isActive ? "" : button.color}
                ${activeButton === button.text ? `${button.className}` : ``}
                ${button.text === "logout" ? "H3" : ""}
                ${isOpen ? "inline-block" : "hidden"} text-sm`}
                iconClassName={button.className}
              />
              <div>
                <GradientButton
                  Icon={button.Icon}
                  isActive={activeButton === button.text}
                  onClick={() => handleButtonClick(index, button)}
                  className={`${isOpen ? "hidden" : "inline-block"}
                    ${activeButton === button.text ? "" : button.color}
                    ${button.text === "logout" ? "H3" : ""}
                    ${
                      activeButton === button.text ? `${button.className}` : ``
                    }`}
                >
                  {typeof button.Icon === 'function' ? (
                    <button.Icon
                      size="1vw"
                      isActive={activeButton === button.text}
                      className={button.className}
                      style={{width: "1.2vw", height: "1.2vw"}}
                    />
                  ) : (
                    <button.Icon
                      className={`mr-2 flex flex-col ${
                        isOpen ? "inline-block" : "hidden"
                      } w-[1vw] h-[1vw]`}
                    />
                  )}
                </GradientButton>
              </div>
              {/* <motion.span
                animate={isOpen ? 'open' : 'closed'}
                variants={textVariants}
                className={` ${isOpen ? 'inline-block' : 'hidden'} w-full Hmd`}>
              </motion.span> */}
            </Link>
          )})}
        </div>

        {/*<div
          className={`sidebar flex justify-center items-center ${theme === 'dark' ? 'bg-[#333333]' : 'bg-[#f2f0ef]'} hover:bg-[#4D55CC]/10 rounded-md relative mb-4 shadow-md ${
            isOpen ? "w-[75%] h-[2.8vw]" : "w-[75%]"
          }`}
        >
          <GradientButton2
            Icon={theme === "dark" ? IoMoonOutline : IoSunny}
            text={isOpen ? (theme === "dark" ? "dark" : "light") : ""}
            className={`toggle-mode primary w-[5.3vw] sidebar-button rounded-[0.417vw] py-[.46vw] px-[.3vw] text-[#4D55CC] hover:scale-105 transition-all duration-300 ${
              isOpen ? "text-sm" : "flex justify-center items-center w-[5vw] Hmd"
            }`}
            onClick={() =>
              theme === "dark" ? setTheme("light") : setTheme("dark")
            }
          />
        </div>*/}
      </div>
    </motion.div>
  );
};

export default Sidebar;
