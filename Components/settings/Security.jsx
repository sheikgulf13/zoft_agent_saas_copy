import React, { useState } from 'react';
import GradientButton from '../buttons/GradientButton';
import { Bounce, toast } from 'react-toastify';
import useTheme from "next-theme";
import GradientButton2 from '../buttons/GradientButton2';

const Security = () => {
  const [password, setPassword] = useState('');
  const [rePassword, setRePassword] = useState('');
  const { theme } = useTheme();

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleRePasswordChange = (e) => {
    setRePassword(e.target.value);
  };

  const handleChangePasswordClick = () => {
    if (password !== rePassword) {
      toast.error('Passwords Do Not Match!', {
        position: "top-center",
        autoClose: 800,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
      return;
    }

    console.log('Password changed successfully:', password);
    setPassword('');
    setRePassword('');
  };

  return (
    <div className='w-full flex justify-center items-center'>
      <div className={`Hmd h-[50vh] w-[60vw] relative rounded-2xl backdrop-blur-sm ${theme==="dark" ? 'bg-[#1F222A]/95 text-white' : 'bg-white/95 text-black'}`}>
        {/* Password Change Section */}
        <div className="flex items-center justify-between h-1/3 px-8 pt-8 pb-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-1.5 h-6 bg-[#2D3377] rounded-full"></div>
              <h1 className="text-lg font-semibold text-[#2D3377] capitalize">Change Password</h1>
            </div>
            <GradientButton
              text="Change Password"
              className="contentButton bg-gradient-to-r from-[#2D3377] to-[#4A4F8C] text-white px-5 py-2 rounded-lg hover:shadow-lg hover:shadow-[#2D3377]/20 transition-all duration-300 transform hover:-translate-y-0.5 text-sm"
              onClick={handleChangePasswordClick}
            />
          </div>
          <div className="flex flex-col gap-3 w-[40%]">
            <div className="relative">
              <input
                onChange={handlePasswordChange}
                value={password}
                className={`w-full border-2 border-[#2D3377]/10 pl-3.5 pr-10 py-2.5 rounded-lg focus:border-[#2D3377] focus:ring-2 focus:ring-[#2D3377]/20 outline-none transition-all duration-300 text-sm ${
                  theme==="dark" 
                    ? 'bg-[#1F222A] text-white placeholder-gray-400' 
                    : 'bg-white text-black placeholder-gray-500'
                }`}
                type="password"
                name="new-password"
                id="password"
                placeholder="New Password"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
            </div>
            <div className="relative">
              <input
                onChange={handleRePasswordChange}
                value={rePassword}
                className={`w-full border-2 border-[#2D3377]/10 pl-3.5 pr-10 py-2.5 rounded-lg focus:border-[#2D3377] focus:ring-2 focus:ring-[#2D3377]/20 outline-none transition-all duration-300 text-sm ${
                  theme==="dark" 
                    ? 'bg-[#1F222A] text-white placeholder-gray-400' 
                    : 'bg-white text-black placeholder-gray-500'
                }`}
                type="password"
                name="re-enter"
                id="re-password"
                placeholder="Re-Enter Password"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Authenticator Section */}
        <div className="flex flex-col h-2/3 p-8 gap-5">
          <div className="flex items-center gap-2.5">
            <div className="w-1.5 h-6 bg-[#2D3377] rounded-full"></div>
            <h1 className="text-lg font-semibold text-[#2D3377] capitalize">Authenticator App</h1>
          </div>
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 bg-[#2D3377]/10 rounded-xl flex items-center justify-center">
              <svg className="w-7 h-7 text-[#2D3377]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed max-w-xl">
              Double the protection, twice the security: Two-factor authentication keeps your accounts safe with an extra layer of verification.
            </p>
          </div>
          <GradientButton2
            text="Enable Authenticator App"
            className="contentButton bg-gradient-to-r from-[#2D3377] to-[#4A4F8C] text-white px-5 py-2 rounded-lg hover:shadow-lg hover:shadow-[#2D3377]/20 transition-all duration-300 transform hover:-translate-y-0.5 w-fit text-sm"
          />
        </div>
      </div>
    </div>
  );
};

export default Security;
