import React, { useState } from "react";
import { OutlinedButton } from "../../../../Components/buttons/OutlinedButton";
import { ContainedButton } from "@/Components/buttons/ContainedButton";
import useTheme from "next-theme";

const ConfirmationDialog = ({ isOpen, onClose, onConfirm, cancelClass }) => {
  const [text, setText] = useState("");
  const { theme } = useTheme();
  const requiredText = "delete my bot";

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50">
      <div 
        className={`w-[35vw] p-8 rounded-lg shadow-xl transform transition-all duration-300 ${
          theme === 'dark' ? 'bg-[#1A1C22] text-white' : 'bg-white text-black'
        }`}
      >
        <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-red-600 to-red-500 bg-clip-text text-transparent">
          Confirm Deletion
        </h2>
        
        <div className="space-y-4">
          <p className={`text-base leading-relaxed ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
            We will immediately delete your bot details along with files used to create it.
            <br />
            You will no longer be able to use the endpoints for this bot.
          </p>

          <div className="space-y-2">
            <span className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
              To verify, type <span className="text-red-500 font-bold">"{requiredText}"</span> below:
            </span>
            
            <div className="relative">
              <input
                className={`w-full p-3 rounded-md border transition-all duration-200 focus:ring-2 focus:ring-red-500 focus:border-transparent ${
                  text === requiredText 
                    ? 'border-green-500 bg-green-50/10' 
                    : text.length > 0 
                      ? 'border-red-500 bg-red-50/10' 
                      : 'border-gray-300'
                } ${
                  theme === 'dark' 
                    ? 'bg-[#1F222A] text-white placeholder-gray-500' 
                    : 'bg-white text-black placeholder-gray-400'
                }`}
                type="text"
                onChange={(e) => setText(e.target.value)}
                value={text}
                placeholder="Type to confirm deletion"
              />
              
              {text.length > 0 && text !== requiredText && (
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500 text-sm">
                  Incorrect text
                </span>
              )}
              
              {text === requiredText && (
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500 text-sm">
                  ✓ Verified
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4 mt-8">
          <OutlinedButton 
            onClick={onClose}
            className={`hover:bg-gray-100 transition-all duration-200 ${
              theme === 'dark' ? 'hover:bg-gray-800' : ''
            }`}
             borderColor={
              "border-2 border-[#8b8b8b] text-[#8b8b8b] hover:border-[#333333] hover:text-[#333333]"
            }
          >
            Cancel
          </OutlinedButton>
          
          {text === requiredText && (
            <ContainedButton
              onClick={onConfirm}
              bgColor={'bg-red-500 hover:bg-red-600'}
              className="transition-all duration-200"
            >
              Delete
            </ContainedButton>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConfirmationDialog;
