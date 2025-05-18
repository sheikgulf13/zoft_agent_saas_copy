"use client";
import {
  motion,
  AnimatePresence,
  LazyMotion,
  domAnimation,
} from "framer-motion";
import React, { useEffect, useState } from "react";
import CheckBox from "./buttons/CheckBox";
import GradientButton from "./buttons/GradientButton";
import { FaUser, FaLock } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import {
  setUsername,
  setEmail,
  setPassword,
  setAnimationComplete,
  setShowLogin,
  setFadeIn,
} from "../store/actions/registerUserActions";
import LoginOld from "./LoginOld";
import { useRouter } from "next/navigation";
import { getApiConfig, getApiHeaders } from "@/utility/api-config";
import { CookieManager } from "../utility/cookie-manager";
import { showErrorToast, showSuccessToast } from "./toast/success-toast";
import { createClient } from "@supabase/supabase-js";
import { IoEyeSharp } from "react-icons/io5";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const dispatch = useDispatch();
  const navigate = useRouter();
  const url = process.env.url;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const { username, email, password, animationComplete, showLogin, fadeIn } =
    useSelector((state) => state.user);
  const [show, setShow] = useState(false);

  const loginHandler = async (e) => {
    e.preventDefault();
    email ? setEmailError("") : setEmailError("Enter a Username");
    password ? setPasswordError("") : setPasswordError("Enter a password");
    if (email && password) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      console.log("login data", data);
      if (error) {
        showErrorToast(error.message);
      } else {
        CookieManager.setCookie("session_id", data.session.access_token);
        setTimeout(() => {
          navigate.push("/dashboard");
        }, 1);
      }
      await fetch(`${url}/public/auth/new`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${data.session.access_token}`,
          "Content-Type": "application/json",
        },
      });
    } else {
      // Handle client-side validation errors here
      console.error("Email and password are required");
    }
  };

  const handleGoogleSignIn = async () => {
    const response = await fetch(`${url}/auth/sso/google`, {
      ...getApiConfig(),
      method: "POST",
      headers: new Headers({
        ...getApiHeaders(),
      }),
    });
    const data = await response.text();
    console.log(data);
    // const data='http://localhost:3000/register';
    const width = 600;
    const height = 600;
    const left = window.screen.width / 2 - width / 2;
    const top = window.screen.height / 2 - height / 2;
    const popup = window.open(
      data,
      "Google Sign-In",
      `width=${width},height=${height},left=${left},top=${top}`
    );

    let sessionFetched = false;

    const pollPopup = setInterval(async () => {
      if (popup.closed) {
        clearInterval(pollPopup);
        console.log("Login popup was closed.");
      } else {
        try {
          const params = new URL(popup.location).hash.substring(1);
          const urlParams = new URLSearchParams(params);
          const access_token = urlParams.get("access_token");
          const refresh_token = urlParams.get("refresh_token");
          console.log(access_token, refresh_token);
          if ((access_token || refresh_token) && !sessionFetched) {
            sessionFetched = true;
            var session_id = await session_fetch(access_token, refresh_token);
            console.log(session_id);
            CookieManager.setCookie("session_id", session_id);
            popup.close();
            navigate.push("/");
            clearInterval(pollPopup);
          }
        } catch (e) {
          console.log(e);
        }
      }
    }, 0);
  };

  const session_fetch = async (access_token, refresh_token) => {
    console.log(access_token, refresh_token);

    const reqData = JSON.stringify({
      access_token: access_token,
      refresh_token: refresh_token,
    });

    console.log(reqData);

    const response = await fetch(`${url}/auth/sso/google/loading`, {
      ...getApiConfig(),
      method: "POST",
      body: reqData,
      headers: new Headers({
        ...getApiHeaders(),
        "Content-Type": "application/json",
      }),
    });

    console.log(response.status, response.statusText);

    if (!response.ok) {
      console.error("HTTP error", response.status, response.statusText);
      const errorText = await response.text();
      console.error("Error details:", errorText);
      throw new Error("Failed to fetch session data");
    }

    const data = await response.text();
    console.log(data);
    return data;
  };

  const registerHandler = (e) => {
    navigate.replace("/register")
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      dispatch(setAnimationComplete(true));
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [dispatch]);

  return (
    <AnimatePresence>
      <LazyMotion features={domAnimation}>
        <motion.div className="w-full h-screen relative z-20 bg-[#F3F4F7] text-black">
          <div className="w-full h-screen flex justify-center items-center relative z-20 overflow-hidden">
            {/* Form Container */}
            <div className="w-[95vw] h-[85vh] bg-white rounded-3xl flex justify-end gap-[6vw] items-center overflow-hidden relative ">
              <motion.div className="w-[50vw] h-full absolute left-0 z-[5] rounded-3xl overflow-hidden">
                <motion.div className="w-[50vw] h-full rounded-3xl relative inline-block">
                  <video
                    className="absolute top-0 right-0 w-full h-full object-cover"
                    autoPlay
                    loop
                    muted
                    src="../../videos/anim1.mp4"
                  ></video>
                </motion.div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, ease: "easeInOut", duration: 0.8 }}
                className="w-[47vw] h-[85vh] relative z-[1] rounded-r-3xl flex flex-col items-center gap-[2vw] py-[2vw]"
              >
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: fadeIn ? 0 : 1 }}
                  exit={{ opacity: fadeIn ? 1 : 0 }}
                  transition={{ delay: 0.3, ease: "easeInOut", duration: 0.8 }}
                >
                  <div className="w-[105%] h-[85vh] flex flex-col gap-[2vw] py-[2vw]">
                    <div className="logo w-full h-[3vh] flex items-center justify-center">
                      <img
                        className="w-[4.2vw]"
                        src="/images/ZOFT_LOGO2.png"
                        alt="Zoft"
                      />
                      <h1 className="H4 uppercase font-semibold">ZOFT</h1>
                    </div>

                    <div className="flex flex-col items-center w-full h-[18vh] gap-[2vw]">
                      <h1 className="H4 capitalize font-semibold">
                        welcome back!
                      </h1>
                      <button
                        className="capitalize font-semibold relative flex gap-[.5vw] px-[2vw] py-[.5vw] rounded-lg border border-zinc-300 "
                        onClick={handleGoogleSignIn}
                      >
                        <img
                          className="w-[1.5vw]  h-[1.5vw] object-cover"
                          src="/images/google-removebg-preview.png"
                          alt=""
                        />{" "}
                        sign in with google
                      </button>
                      <div className="w-1/2 h-[2vw] flex items-center gap-[.8vw] ">
                        <div className="w-1/2 h-[2px] bg-zinc-300 rounded-lg"></div>
                        <h6 className="text-sm text-zinc-300 capitalize">or</h6>
                        <div className="w-1/2 h-[2px] bg-zinc-300 rounded-lg"></div>
                      </div>
                    </div>

                    <div className="w-full h-[40vh]">
                      <form className="w-full h-full flex flex-col justify-start gap-[2vw]">
                        <div className="flex items-center justify-center w-full">
                          <div className="flex flex-col items-start">
                            <div className="flex">
                              <label
                                className="capitalize Hmd font-medium"
                                htmlFor="email"
                              >
                                email&nbsp;
                              </label>
                              {emailError && (
                                <span className="text-red-500 font-medium text-sm">
                                  {" "}
                                  *{emailError}
                                </span>
                              )}
                            </div>

                            <div className="flex items-center relative">
                              <MdEmail className="H5 absolute left-3" />
                              <input
                                value={email}
                                onChange={(e) =>
                                  dispatch(setEmail(e.target.value))
                                }
                                type="email"
                                className="border border-zinc-300 rounded-lg w-[30vw] h-[5vh] pl-[3vw] pr-[1vw]"
                                placeholder="Enter Email"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-center w-full">
                          <div className="flex flex-col items-start">
                            <div className="flex">
                              <label
                                className="capitalize Hmd font-medium"
                                htmlFor="password"
                              >
                                password&nbsp;
                              </label>
                              {passwordError && (
                                <span className="text-red-500 font-medium text-sm">
                                  {" "}
                                  *{passwordError}
                                </span>
                              )}
                            </div>
                            <div className="flex items-center relative">
                              <FaLock className="H5 absolute left-3" />
                              <input
                                value={password}
                                onChange={(e) =>
                                  dispatch(setPassword(e.target.value))
                                }
                                type={show ? "text" : "password"}
                                className="border border-zinc-300 rounded-lg w-[30vw] h-[5vh] pl-[3vw] pr-[1vw]"
                                placeholder="Enter Password"
                              />
                              <IoEyeSharp
                                onClick={() => setShow(!show)}
                                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xl cursor-pointer text-gray-600"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="w-full flex items-center justify-center">
                          <GradientButton
                            text="log in"
                            className="bg-gradient-to-r from-[#EB1CD6] to-[#F4A36F] text-white px-[6vw]"
                            onClick={loginHandler}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                loginHandler();
                              }
                            }}
                          />
                        </div>
                      </form>
                      <h6 className="ml-[8vw] capitalize font-semibold">
                        don't have an account?{" "}
                        <button
                          className="text-[#630063]"
                          onClick={registerHandler}
                        >
                          sign up
                        </button>
                      </h6>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </LazyMotion>
    </AnimatePresence>
  );
};

export default Login;
