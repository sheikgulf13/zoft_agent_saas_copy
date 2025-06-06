import useTheme from "next-theme";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getProfileDetailsApi } from "../../api/profile/profile-details";
import { updateProfile } from "../../store/reducers/profileSlice";
import { ContainedButton } from "../buttons/ContainedButton";
import GradientButton from "../buttons/GradientButton";
const PersonalDetails = () => {
  const dispatch = useDispatch();
  const profile = useSelector((state) => state.profile);
  const [formData, setFormData] = useState(profile);
  const [isEditing, setIsEditing] = useState(false);
  const { theme, setTheme } = useTheme();

  const getProfileDetails = async () => {
    const response = await getProfileDetailsApi();
    setFormData(response);
  };

  const changeHandler = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const saveHandler = (e) => {
    e.preventDefault();
    dispatch(updateProfile(formData));
    setIsEditing(false);
    console.log("Settings saved", formData);
  };

  const editHandler = () => {
    setIsEditing(true);
  };

  useEffect(() => {
    getProfileDetails();
  }, []);

  return (
    <div className="w-full flex items-center justify-center">
      <div
        className={`p-4 rounded-xl h-full w-[60%] relative overflow-hidden shadow-sm ${
          theme === "dark"
            ? "bg-gradient-to-br from-[#1A1C22] to-[#1F222A] text-white"
            : "bg-white text-gray-800"
        }`}
      >
        <form className="flex flex-col h-full">
          <div className="flex w-full justify-between items-center mb-5">
            <h1 className="text-2xl font-bold text-[#2D3377]">
              Profile Settings
            </h1>
            <div className="text-white">
              <ContainedButton className="bg-[#2D3377] hover:bg-[#2D3377]/90 transition-colors">
                Edit
              </ContainedButton>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto pr-2 space-y-6 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent">
            <div className="space-y-2">
              <label
                htmlFor="displayName"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Display Name
              </label>
              <input
                type="text"
                id="displayName"
                name="displayName"
                value={formData?.username}
                onChange={changeHandler}
                disabled={!isEditing}
                className={`w-full px-4 py-2.5 rounded-lg transition-all duration-200 border-[1px] border-gray-200 shadow-sm ${
                  isEditing
                    ? "border-2 border-gray-200 dark:border-gray-700 focus:border-[#2D3377] dark:focus:border-[#4D55CC]"
                    : ""
                } focus:outline-none focus:ring-2 focus:ring-[#2D3377]/20 ${
                  theme === "dark"
                    ? "bg-[#2A2E37] text-white placeholder-gray-500"
                    : "bg-gray-50 text-gray-800 placeholder-gray-400"
                }`}
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData?.email}
                onChange={changeHandler}
                disabled={!isEditing}
                className={`w-full px-4 py-2.5 rounded-lg transition-all duration-200 border-[1px] border-gray-200 shadow-sm ${
                  isEditing
                    ? "border-2 border-gray-200 dark:border-gray-700 focus:border-[#2D3377] dark:focus:border-[#4D55CC]"
                    : ""
                } focus:outline-none focus:ring-2 focus:ring-[#2D3377]/20 ${
                  theme === "dark"
                    ? "bg-[#2A2E37] text-white placeholder-gray-500"
                    : "bg-gray-50 text-gray-800 placeholder-gray-400"
                }`}
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="phoneNumber"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Phone Number
              </label>
              <div className="flex gap-2">
                <select
                  name="countryCode"
                  id="countryCode"
                  value={formData?.countryCode}
                  onChange={changeHandler}
                  disabled={!isEditing}
                  className={`px-4 py-2.5 rounded-lg transition-all duration-200 border-[1px] border-gray-200 shadow-sm ${
                    isEditing
                      ? "border-2 border-gray-200 dark:border-gray-700 focus:border-[#2D3377] dark:focus:border-[#4D55CC]"
                      : ""
                  } focus:outline-none focus:ring-2 focus:ring-[#2D3377]/20 ${
                    theme === "dark"
                      ? "bg-[#2A2E37] text-white"
                      : "bg-gray-50 text-gray-800"
                  }`}
                >
                  <option
                    className={theme === "dark" ? "bg-[#1F222A]" : "bg-white"}
                    value="+91"
                  >
                    +91
                  </option>
                  <option
                    className={theme === "dark" ? "bg-[#1F222A]" : "bg-white"}
                    value="+92"
                  >
                    +92
                  </option>
                </select>
                <input
                  type="tel"
                  id="phoneNumber"
                  name="phoneNumber"
                  value={formData?.phone_number}
                  onChange={changeHandler}
                  disabled={!isEditing}
                  className={`flex-1 px-4 py-2.5 rounded-lg transition-all duration-200 border-[1px] border-gray-200 shadow-sm ${
                    isEditing
                      ? "border-2 border-gray-200 dark:border-gray-700 focus:border-[#2D3377] dark:focus:border-[#4D55CC]"
                      : ""
                  } focus:outline-none focus:ring-2 focus:ring-[#2D3377]/20 ${
                    theme === "dark"
                      ? "bg-[#2A2E37] text-white placeholder-gray-500"
                      : "bg-gray-50 text-gray-800 placeholder-gray-400"
                  }`}
                />
              </div>
            </div>
          </div>

          {isEditing && (
            <div className="flex justify-end mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <GradientButton
                text="Save Changes"
                onClick={saveHandler}
                className="bg-gradient-to-r from-[#2D3377] to-[#4D55CC] hover:opacity-90 text-white px-8 py-2.5 rounded-lg transition-all duration-200"
              />
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default PersonalDetails;
