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
import { useRouter } from "next/navigation";
import { getApiConfig, getApiHeaders } from "@/utility/api-config";
import { CookieManager } from "../utility/cookie-manager";
import { showErrorToast, showSuccessToast } from "./toast/success-toast";
import { createClient } from "@supabase/supabase-js";
import { IoEyeSharp } from "react-icons/io5";
import Script from "next/script";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [check, setCheck] = useState(false);
  const [userNameError, setUserNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [agreeError, setAgreeError] = useState("");
  const dispatch = useDispatch();
  const navigate = useRouter();
  const url = process.env.url;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const { username, email, password, animationComplete, showLogin, fadeIn } =
    useSelector((state) => state.user);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // console.log(fadeIn);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      dispatch(setAnimationComplete(true));
    }, 1000);

    const interval = setInterval(() => {
      if (!isPaused) {
        setCurrentSlide((prev) => (prev === 0 ? 1 : 0));
      }
    }, 2500);

    return () => {
      clearTimeout(timeoutId);
      clearInterval(interval);
    };
  }, [dispatch, isPaused]);

  const registerHandler = async (e) => {
    e.preventDefault();
    username ? setUserNameError("") : setUserNameError("Enter a Username");
    if (!email) {
      setEmailError("Enter a email");
    } else if (!emailRegex.test(email)) {
      setEmailError("Enter a valid email address");
    } else {
      setEmailError("");
    }

    check
      ? setAgreeError("")
      : setAgreeError(
          "Please agree to the Terms and Privacy Policy to continue."
        );
    if (!password) {
      setPasswordError("Enter a password");
    } else if (password.length < 6) {
      setPasswordError("Password should be at least 6 characters long.");
    } else {
      setPasswordError("");
    }

    if (check && username && email && password) {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { name: username } },
      });
      if (error) {
        console.error("Sign up error:", error.message);
      } else {
        showSuccessToast(
          "We have sent you a verification email. Please follow the steps in the email to log in."
        );

        dispatch(setShowLogin(true));
      }
    }
  };

  // Add real-time validation
  const handleUsernameChange = (e) => {
    dispatch(setUsername(e.target.value));
    if (e.target.value) {
      setUserNameError("");
    }
  };

  const handleEmailChange = (e) => {
    dispatch(setEmail(e.target.value));
    if (e.target.value && emailRegex.test(e.target.value)) {
      setEmailError("");
    }
  };

  const handlePasswordChange = (e) => {
    dispatch(setPassword(e.target.value));
    if (e.target.value && e.target.value.length >= 6) {
      setPasswordError("");
    }
  };

  const handleCheckboxChange = () => {
    const newCheckState = !check;
    setCheck(newCheckState);
    if (newCheckState) {
      setAgreeError("");
    }
  };

  const handleGoogleSignUp = async () => {
    console.log("Hi");
    const response = await fetch(`${url}/auth/sso/google`, {
      ...getApiConfig(),
      method: "POST",
      headers: new Headers({
        ...getApiHeaders(),
      }),
    });
    const data = await response.text();
    console.log(data);

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
            console.log("Login successful:", { access_token, refresh_token });
            var session_id = await session_fetch(access_token, refresh_token);
            console.log(session_id);
            CookieManager.setCookie("session_id", session_id);
            popup.close();
            navigate.push("/dashboard");
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

  const loginHandler = () => {
    navigate.replace("/login");
  };
  const handleKeyDown = (e) => {
    if (
      e.key === "Enter" &&
      document.activeElement !== document.getElementById("submit-btn")
    ) {
      e.preventDefault();
    }
  };

  return (
    <AnimatePresence>
      <LazyMotion features={domAnimation}>
        <div className="w-full h-[100vh] bg-white flex justify-around gap-[6vw] px-[5vw] items-center overflow-hidden">
          <div className="w-[40%] h-[80%] z-[5] rounded-3xl overflow-hidden relative flex flex-col items-center justify-center">
            <div 
              className="relative w-full h-[60%]"
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
            >
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="absolute w-full h-full"
              >
                <img
                  src={currentSlide === 0 ? "/videos/Chatbot.gif" : "/videos/Innovation.gif"}
                  alt={currentSlide === 0 ? "Chatbot Demo" : "Innovation Demo"}
                  className="h-full w-full object-contain"
                />
              </motion.div>
            </div>
            <div className="w-full flex flex-col items-center gap-4 mt-6">
              <h2 className="text-2xl font-semibold text-gray-800">
                {currentSlide === 0 ? "Smart Chatbot" : "Innovative Solutions"}
              </h2>
              <p className="text-center text-gray-600 max-w-[80%]">
                {currentSlide === 0 
                  ? "Experience our intelligent chatbot that provides instant support and answers to your queries 24/7."
                  : "Discover cutting-edge solutions that transform the way you work and collaborate."}
              </p>
              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => setCurrentSlide(0)}
                  className={`w-3 h-3 rounded-full transition-all duration-200 ${
                    currentSlide === 0 ? "bg-[#2D3377] w-6" : "bg-gray-300"
                  }`}
                />
                <button
                  onClick={() => setCurrentSlide(1)}
                  className={`w-3 h-3 rounded-full transition-all duration-200 ${
                    currentSlide === 1 ? "bg-[#2D3377] w-6" : "bg-gray-300"
                  }`}
                />
              </div>
            </div>
          </div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, ease: "easeInOut", duration: 0.8 }}
            className="w-[45%] h-[90%] relative z-[1] rounded-3xl flex flex-col items-center justify-center gap-4 py-[2.5vw] bg-white overflow-hidden px-[5vw]"
          >
            <div className="w-full flex items-center justify-center py-4">
              <img className="w-12" src="/images/ZOFT_LOGO2.png" alt="Zoft" />
              <h1 className="text-xl font-bold bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#13104A]/95 via-[#2D3377]/90 via-[#18103A]/85 via-[#211A55]/80 to-[#13104A]/95 backdrop-blur-sm text-transparent bg-clip-text">
                Zoft
              </h1>
            </div>

            <div className="w-full flex flex-col items-center gap-3 mb-3">
              <h1 className="text-xl font-semibold text-gray-800">
                Create your account
              </h1>
              <button
                className="w-full capitalize font-medium flex items-center justify-center gap-3 px-4 py-2 rounded-xl text-gray-700 border border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 shadow-sm"
                onClick={handleGoogleSignUp}
              >
                <img
                  className="w-5 h-5 object-cover"
                  src="/images/google-removebg-preview.png"
                  alt="Google logo"
                />
                Continue with Google
              </button>
              <div className="w-full flex items-center gap-3 mt-4">
                <div className="flex-1 h-[1px] bg-gray-200"></div>
                <span className="text-sm text-gray-500">or</span>
                <div className="flex-1 h-[1px] bg-gray-200"></div>
              </div>
            </div>

            <div className="w-full">
              <form
                onKeyDown={handleKeyDown}
                className="w-full h-full flex flex-col justify-center py-4"
              >
                <div className="flex flex-col gap-1.5 mt-4">
                  <FormInput
                    label="Username"
                    icon={<FaUser className="text-gray-400" />}
                    value={username}
                    onChange={handleUsernameChange}
                    type="text"
                    placeholder="Enter your username"
                    id="username"
                    userNameError={userNameError}
                  />
                  <FormInput
                    label="Email"
                    icon={<MdEmail className="text-gray-400" />}
                    value={email}
                    onChange={handleEmailChange}
                    type="email"
                    placeholder="Enter your email"
                    id="email"
                    emailError={emailError}
                  />
                  <FormInput
                    label="Password"
                    showPassword={showPassword}
                    setShowPassword={setShowPassword}
                    eyeIcon={true}
                    icon={<FaLock className="text-gray-400" />}
                    value={password}
                    onChange={handlePasswordChange}
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a password"
                    id="password"
                    passwordError={passwordError}
                  />

                  {/* Terms and conditions */}
                  <div className="flex flex-col items-center gap-2">
                    <div className="flex items-center gap-2">
                      <CheckBox
                        checked={check}
                        onChange={handleCheckboxChange}
                      />
                      <p className="text-xs text-gray-600 text-center">
                        I agree to the{" "}
                        <button
                          type="button"
                          className="text-[#2D3377] hover:text-[#1a1f4d] transition-colors duration-200"
                          onClick={() =>
                            window.open(
                              "https://blogs.zoft.ai/termsandconditions"
                            )
                          }
                        >
                          Terms of Service
                        </button>{" "}
                        and{" "}
                        <button
                          type="button"
                          className="text-[#2D3377] hover:text-[#1a1f4d] transition-colors duration-200"
                          onClick={() =>
                            window.open("https://blogs.zoft.ai/privacy-policy")
                          }
                        >
                          Privacy Policy
                        </button>
                      </p>
                    </div>
                    {agreeError && (
                      <div className="flex items-center gap-1">
                        <span className="text-red-500 text-xs">*</span>
                        <span className="text-red-500 text-xs text-center">
                          {agreeError}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-col gap-4 mt-4">
                  {/* Submit button */}
                  <div className="flex justify-center">
                    <GradientButton
                      id="submit-btn"
                      text="Create Account"
                      className=" bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#13104A]/95 via-[#2D3377]/90 via-[#18103A]/85 via-[#211A55]/80 to-[#13104A]/95 backdrop-blur-sm text-white py-2.5 rounded-lg text-center hover:opacity-90 transition-all duration-200 shadow-md px-[2vw]"
                      onClick={registerHandler}
                    />
                  </div>

                  {/* Login link */}
                  <div className="flex justify-center">
                    <p className="text-center text-xs text-gray-600">
                      Already have an account?{" "}
                      <button
                        type="button"
                        className="text-[#2D3377] font-medium hover:text-[#1a1f4d] transition-colors duration-200"
                        onClick={loginHandler}
                      >
                        Sign in
                      </button>
                    </p>
                  </div>
                </div>
              </form>
            </div>
          </motion.div>
        </div>

         <Script
        src={
          "https://14e2-2409-40f4-3104-8201-d0a4-bb3a-ba23-4edc.ngrok-free.app/api/chatbot-script/9c68746b-9614-4783-8b32-19e828440079?v=3"
        }
      />
      </LazyMotion>
    </AnimatePresence>
  );
};

const FormInput = ({
  label,
  icon,
  value,
  onChange,
  type,
  placeholder,
  id,
  userNameError,
  emailError,
  passwordError,
  eyeIcon,
  setShowPassword,
  showPassword,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const hasValue = value && value.length > 0;
  const error = userNameError || emailError || passwordError;

  return (
    <div className="flex flex-col min-h-[70px]">
      {error && (
        <div className="flex items-center gap-1 mb-1">
          <span className="text-red-500 text-xs">*</span>
          <span className="text-xs text-red-500">{error}</span>
        </div>
      )}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          {icon}
        </div>
        <input
          value={value}
          onChange={onChange}
          type={type}
          className={`w-full h-10 pl-9 pr-4 rounded-lg border-2 ${
            error ? "border-red-500" : "border-gray-200"
          } text-sm text-gray-700 placeholder-transparent focus:outline-none focus:border-[#2D3377] transition-all duration-200`}
          placeholder={label}
          id={id}
          aria-label={label}
          required
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
        <label
          htmlFor={id}
          className={`absolute text-sm transition-all duration-200 pointer-events-none ${
            isFocused || hasValue
              ? "-top-2.5 text-[#2D3377] text-xs bg-white px-1 left-8"
              : "top-2.5 text-gray-500 left-9"
          }`}
        >
          {label}
        </label>
        {eyeIcon && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
          >
            <IoEyeSharp className="text-gray-400 hover:text-gray-600 transition-colors duration-200" />
          </button>
        )}
      </div>
    </div>
  );
};

export default Register;
