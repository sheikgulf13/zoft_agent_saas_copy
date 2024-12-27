import React, { useState } from 'react';
import GradientButton from '../buttons/GradientButton';
import { Bounce, toast } from 'react-toastify';
import useTheme from "next-theme";
import GradientButton2 from '../buttons/GradientButton2';
const Security = () => {
  const [password, setPassword] = useState('');
  const [rePassword, setRePassword] = useState('');
  const { theme, setTheme } = useTheme()

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

    // Add logic to save the new password here
    // This can involve calling an API or updating the state in a parent component
    console.log('Password changed successfully:', password);

    // Optionally, clear the input fields after successful password change
    setPassword('');
    setRePassword('');
  };

  return (
    <div className={`Hmd h-[50vh] w-[60vw] relative rounded-[0.625vw] shadow-xl  ${theme==="dark" ? 'bg-[#1F222A] text-white' : 'bg-white text-black'}`}>
      <div className="flex items-center justify-center gap-[13vw] h-1/3 pr-[10vw]">
        <div className="flex flex-col gap-[2vw]">
          <h1 className="text-lg capitalize ml-[2vw]">change password</h1>
          <GradientButton
            text="change password"
            className="contentButton bg-gradient-to-r from-[#EB1CD6] to-[#F4A36F] text-white ml-[2vw] px-[1.667vw]"
            onClick={handleChangePasswordClick}
          />
        </div>
        <div className="flex flex-col gap-[1vw] mt-[6.4vh]">
          <input
            onChange={handlePasswordChange}
            value={password}
            className={`border-[0.104vw] border-zinc-300 pl-[1vw] pr-[6vw] py-[0.8vh] rounded-[0.313vw]  ${theme==="dark" ? 'bg-[#1F222A] text-white' : 'bg-white text-black'}`}
            type="password"
            name="new-password"
            id="password"
            placeholder="New Password"
          />
          <input
            onChange={handleRePasswordChange}
            value={rePassword}
            className={`border-[0.104vw] border-zinc-300 pl-[1vw] pr-[6vw] py-[0.8vh] rounded-[0.313vw]  ${theme==="dark" ? 'bg-[#1F222A] text-white' : 'bg-white text-black'}`}
            type="password"
            name="re-enter"
            id="re-password"
            placeholder="Re-Enter Password"
          />
        </div>
      </div>
      <div className="flex flex-col items-start justify-center h-2/3 gap-[2vw] px-[3.5vw]">
        <h1 className="text-lg capitalize ">authenticator app</h1>
        <h6 className="w-1/2">
          Double the protection, twice the security: Two-factor authentication keeps your accounts safe with an <br /> extra layer of verification.
        </h6>
        <GradientButton2
          text="enable authenticator app"
          className="contentButton bg-gradient-to-r from-[#EB1CD6] to-[#F4A36F] text-white px-[1.667vw]"
        />
      </div>
    </div>
  );
};

export default Security;
