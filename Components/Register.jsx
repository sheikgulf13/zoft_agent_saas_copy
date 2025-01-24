"use client"
import { motion, AnimatePresence, LazyMotion, domAnimation } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import CheckBox from './buttons/CheckBox';
import GradientButton from './buttons/GradientButton';
import { FaUser, FaLock } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { useDispatch, useSelector } from 'react-redux';
import { setUsername, setEmail, setPassword, setAnimationComplete, setShowLogin, setFadeIn } from '../store/actions/registerUserActions';
import Login from './Login';
import { useRouter } from 'next/navigation';
import { getApiConfig, getApiHeaders } from '@/utility/api-config';
import { CookieManager } from "../utility/cookie-manager";
import { showErrorToast, showSuccessToast } from './toast/success-toast';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);

const Register = () => {
  const [check, setCheck] = useState(false);
  const dispatch = useDispatch();
  const navigate = useRouter();
  const url = process.env.url;
  const { username, email, password, animationComplete, showLogin, fadeIn } = useSelector((state) => state.user);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      dispatch(setAnimationComplete(true));
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [dispatch]);

  const registerHandler = async (e) => {
    e.preventDefault();
    if(password?.length === 6) {
      return showErrorToast("Password should be atleast 6 characters long.")
    }

    if (check && username && email && password) {
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) {
        console.error('Sign up error:', error.message);
      } else {
        showSuccessToast("We have sent you a verification email. Please follow the steps in the email to log in.");
        dispatch(setShowLogin(true));
      }

    } else {
      alert("Please fill all fields and agree to the terms");
    }
  };
  const handleGoogleSignUp = async () => {
    console.log("Hi");
    const response = await fetch(`${url}/auth/sso/google`, {
      ...getApiConfig(),
      method: 'POST',
      headers: new Headers({
        ...getApiHeaders()
      })
    });
    const data = await response.text();
    console.log(data);
  
    const width = 600;
    const height = 600;
    const left = (window.screen.width / 2) - (width / 2);
    const top = (window.screen.height / 2) - (height / 2);
    const popup = window.open(
      data,
      'Google Sign-In',
      `width=${width},height=${height},left=${left},top=${top}`
    );
  
    let sessionFetched = false; 
  
    const pollPopup = setInterval(async () => {
      if (popup.closed) {
        clearInterval(pollPopup);
        console.log('Login popup was closed.');
      } else {
        try {
          const params = new URL(popup.location).hash.substring(1);
          const urlParams = new URLSearchParams(params);
          const access_token = urlParams.get('access_token');
          const refresh_token = urlParams.get('refresh_token');
          console.log(access_token, refresh_token);
          if ((access_token || refresh_token) && !sessionFetched) { 
            sessionFetched = true; 
            console.log('Login successful:', { access_token, refresh_token });
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
  }
  
  const session_fetch = async (access_token, refresh_token) => {
    console.log(access_token, refresh_token);
  
    const reqData = JSON.stringify({
      'access_token': access_token,
      'refresh_token': refresh_token
    });
  
    console.log(reqData);
  
    const response = await fetch(`${url}/auth/sso/google/loading`, {
      ...getApiConfig(),
      method: 'POST',
      body: reqData,
      headers: new Headers({
        ...getApiHeaders(),
        'Content-Type': 'application/json'
      })
    });
  
    console.log(response.status, response.statusText);
  
    if (!response.ok) {
      console.error('HTTP error', response.status, response.statusText);
      const errorText = await response.text();
      console.error('Error details:', errorText);
      throw new Error('Failed to fetch session data');
    }
  
    const data = await response.text();
    console.log(data);
    return data;
  };
  
  const loginHandler = () => {
    dispatch(setFadeIn(true))
    setTimeout(() => {
      dispatch(setShowLogin(true));
      dispatch(setFadeIn(false))
    }, 300);
  };

  return (
    <AnimatePresence>
      <LazyMotion features={domAnimation}>
        <motion.div className='w-full h-screen relative z-20 bg-[#F3F4F7] text-black'>
          <div className='w-full h-screen flex justify-center items-center relative z-20 overflow-hidden'>
            {/* Form Container */}
            <div className='w-[95vw] h-[85vh] bg-white rounded-3xl flex justify-end gap-[6vw] items-center overflow-hidden relative '>
              <motion.div
                initial={{ x: '0vw' }}
                animate={{ x: animationComplete ? '-45vw' : '0vw' }}
                transition={{ duration: 1.5, ease: 'easeInOut' }}
                className='w-full h-full absolute z-[5] rounded-3xl overflow-hidden'
              >
                <motion.div className='w-[100vw] h-full rounded-3xl relative inline-block'>
                  <video
                    className='absolute top-0 left-0 w-full h-full object-cover'
                    autoPlay
                    loop
                    muted
                    src="../../videos/anim1.mp4"
                  ></video>
                </motion.div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: fadeIn ? 0 : 1 }} exit={{ opacity: fadeIn ? 0 : 1 }} transition={{ delay: .3, ease: 'easeInOut', duration: .8 }}
                className='w-[47vw] h-[85vh] relative z-[1] rounded-r-3xl flex flex-col items-center gap-[2vw] py-[2vw]'
              >
                {showLogin ? (
                  <Login />
                ) : (
                  <>
                    <div className='logo w-full h-[3vh] flex items-center justify-center'>
                      <img className='w-[2.2vw]' src="/images/logo.svg" alt="Kayzen" />
                      <h1 className='H4 uppercase font-semibold'>Kayzen</h1>
                    </div>

                    <div className='ml-[12.5vw flex flex-col items-center w-1/2 h-[16vh] gap-[2vw]'>
                      <h1 className='-ml-[18vw] capitalize H4 font-medium'>get started.</h1>
                      <button className='capitalize font-semibold relative flex gap-[.5vw] px-[2vw] py-[.5vw] rounded-lg border border-zinc-300 ' onClick={handleGoogleSignUp}><img className='w-[1.5vw]  h-[1.5vw] object-cover' src="/images/google-removebg-preview.png" alt="" /> sign up with google</button>
                      <div className='w-full h-[2vw] flex items-center gap-[.8vw] '>
                        <div className='w-1/2 h-[2px] bg-zinc-300 rounded-lg'></div>
                        <h6 className='text-sm text-zinc-300 capitalize'>or</h6>
                        <div className='w-1/2 h-[2px] bg-zinc-300 rounded-lg'></div>
                      </div>

                    </div>

                    <div className='w-full h-[40vh]'>
                      <form className='w-full h-full flex flex-col justify-start gap-[1.5vw]' >
                        <FormInput
                          label="Username"
                          icon={<FaUser className='H5 absolute left-3' />}
                          value={username}
                          onChange={(e) => dispatch(setUsername(e.target.value))}
                          type="text"
                          placeholder="Enter Username"
                          id="username"
                        />
                        <FormInput
                          label="Email"
                          icon={<MdEmail className='H5 absolute left-3' />}
                          value={email}
                          onChange={(e) => dispatch(setEmail(e.target.value))}
                          type="email"
                          placeholder="Enter Email"
                          id="email"
                        />
                        <FormInput
                          label="Password"
                          icon={<FaLock className='H5 absolute left-3' />}
                          value={password}
                          onChange={(e) => dispatch(setPassword(e.target.value))}
                          type="password"
                          placeholder="Enter Password"
                          id="password"
                        />

                        <div className='w-full flex items-center justify-center gap-[1vw]'>
                          <CheckBox checked={check} onChange={() => setCheck(!check)} />
                          <h6 className='capitalize font-medium'>
                            I agree to the <button className='text-[#630063]'>terms of service</button> and <button className='text-[#630063]'>privacy policy</button>
                          </h6>
                        </div>

                        <div className='w-full flex items-center justify-center'>
                          <GradientButton
                            text='Continue'
                            className='bg-gradient-to-r from-[#EB1CD6] to-[#F4A36F] text-white px-[6vw]'
                            onClick={registerHandler}
                          />
                        </div>
                        <h6 className='ml-[15vw] capitalize font-semibold'>
                          already have an account ? <button className='text-[#630063]' onClick={loginHandler}>Log in</button>
                        </h6>
                      </form>
                    </div>
                  </>
                )}
              </motion.div>
            </div>
          </div>
        </motion.div>
      </LazyMotion>
    </AnimatePresence>
  );
};

const FormInput = ({ label, icon, value, onChange, type, placeholder, id }) => (
  <div className='flex items-center justify-center w-full'>
    <div className='flex flex-col items-start'>
      <label className='capitalize Hmd font-medium' htmlFor={id}>{label}</label>
      <div className='flex items-center relative'>
        {icon}
        <input
          value={value}
          onChange={onChange}
          type={type}
          className='border border-zinc-300 rounded-lg w-[30vw] h-[5vh] pl-[3vw] pr-[1vw]'
          placeholder={placeholder}
          id={id}
          aria-label={label}
          required
        />
      </div>
    </div>
  </div>
);

export default Register;