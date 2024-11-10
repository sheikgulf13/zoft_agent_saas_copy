"use client"
import { motion } from 'framer-motion';
import React from 'react';
import GradientButton from './buttons/GradientButton';
import { FaLock } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { useDispatch, useSelector } from 'react-redux';
import { setEmail, setPassword, setShowLogin, setFadeIn } from '../store/actions/registerUserActions';
import { useRouter } from 'next/navigation';
import { useCookies } from 'next-client-cookies';
import { setCookie } from 'cookies-next';
import { getApiConfig, getApiHeaders } from '@/utility/api-config';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useRouter();
  const { email, password, fadeIn } = useSelector((state) => state.user);
  const cookies=useCookies()
  const url=process.env.url;
  const loginHandler = async (e) => {
    e.preventDefault();
    
    if (email && password) {
      const data = JSON.stringify({ email, password });
  
      try {
        const response = await fetch(
          `${url}/auth/signin/email`,
          {
            ...getApiConfig(),
            method: 'POST',
            body: data,
            headers: new Headers({
              ...getApiHeaders(),
              'Content-Type': 'application/json'
            }),
          }
        );
  
        const responseData = await response.text();
  
        if (response.ok) {
          cookies.set("session_id", responseData);
          // cookies.set("refresh_token", responseData.session.refresh_token);
          // const response = await fetch(
          //   `${url}/set_session`,
          //   {
          //     mode: 'cors',
          //     method: 'POST',
          //     body: data,
          //     headers: new Headers({
          //       'Content-Type': 'application/json',
          //       'ngrok-skip-browser-warning': 'true',
          //     }),
          //     credentials:'include',
          //   }
          // );
          setTimeout(() => {
            navigate.push('/dashboard');
          }, 1);
        } else {
          // Handle server-side errors here
          console.error(responseData.message);
        }
      } catch (error) {
        // Handle network or other errors here
        console.error('Error:', error);
      }
    } else {
      // Handle client-side validation errors here
      console.error('Email and password are required');
    }
  };  

  const handleGoogleSignIn = async () => {
    const response = await fetch(`${url}/auth/sso/google`, {
      ...getApiConfig(),
      method: 'POST',
      headers: new Headers({
        ...getApiHeaders()
      })
    });
    const data = await response.text();
    console.log(data);
    // const data='http://localhost:3000/register';
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
            var session_id = await session_fetch(access_token, refresh_token);
            console.log(session_id);
            setCookie("session_id", session_id);
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
  
  const registerHandler = (e) => {
    e.preventDefault();
    dispatch(setFadeIn(true))
    setTimeout(() => {
      dispatch(setShowLogin(false));
      dispatch(setFadeIn(false))
    }, 300); // Duration should match the animation time
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: fadeIn ? 0 : 1 }} exit={{ opacity: fadeIn ? 1 : 0 }} transition={{ delay: .3, ease: 'easeInOut', duration: .8 }}>
      <div className='w-[105%] h-[85vh] flex flex-col gap-[2vw] py-[2vw]'>
        <div className='logo w-full h-[3vh] flex items-center justify-center'>
          <img className='w-[2.2vw]' src="/images/logo.svg" alt="Kayzen" />
          <h1 className='H4 uppercase font-semibold'>Kayzen</h1>
        </div>

        <div className='flex flex-col items-center w-full h-[18vh] gap-[2vw]'>
          <h1 className='H4 capitalize font-semibold'>welcome back!</h1>
          <button className='capitalize font-semibold relative flex gap-[.5vw] px-[2vw] py-[.5vw] rounded-lg border border-zinc-300 ' onClick={handleGoogleSignIn}><img className='w-[1.5vw]  h-[1.5vw] object-cover' src="/images/google-removebg-preview.png" alt="" /> sign in with google</button>
          <div className='w-1/2 h-[2vw] flex items-center gap-[.8vw] '>
            <div className='w-1/2 h-[2px] bg-zinc-300 rounded-lg'></div>
            <h6 className='text-sm text-zinc-300 capitalize'>or</h6>
            <div className='w-1/2 h-[2px] bg-zinc-300 rounded-lg'></div>
          </div>
        </div>

        <div className='w-full h-[40vh]'>
          <form className='w-full h-full flex flex-col justify-start gap-[2vw]'>
            <div className='flex items-center justify-center w-full'>
              <div className='flex flex-col items-start'>
                <label className='capitalize Hmd font-medium' htmlFor="email">email</label>
                <div className='flex items-center relative'>
                  <MdEmail className='H5 absolute left-3' />
                  <input value={email} onChange={(e) => dispatch(setEmail(e.target.value))} type="email" className='border border-zinc-300 rounded-lg w-[30vw] h-[5vh] pl-[3vw] pr-[1vw]' placeholder='Enter Email' />
                </div>
              </div>
            </div>

            <div className='flex items-center justify-center w-full'>
              <div className='flex flex-col items-start'>
                <label className='capitalize Hmd font-medium' htmlFor="password">password</label>
                <div className='flex items-center relative'>
                  <FaLock className='H5 absolute left-3' />
                  <input value={password} onChange={(e) => dispatch(setPassword(e.target.value))} type="password" className='border border-zinc-300 rounded-lg w-[30vw] h-[5vh] pl-[3vw] pr-[1vw]' placeholder='Enter Password' />
                </div>
              </div>
            </div>

            <div className='w-full flex items-center justify-center'>
              <GradientButton
                text='log in'
                className='bg-gradient-to-r from-[#EB1CD6] to-[#F4A36F] text-white px-[6vw]'
                onClick={loginHandler}
              />
            </div>
            <h6 className='ml-[8vw] capitalize font-semibold'>
              don't have an account? <button className='text-[#630063]' onClick={registerHandler}>sign up</button>
            </h6>
          </form>
        </div>
      </div>
    </motion.div>
  );
};

export default Login;