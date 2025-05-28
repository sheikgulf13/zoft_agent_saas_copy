import React from "react";

const OutlinedButton = ({ children, onClick, className = "", isActive = false, gradient, bgColor, borderColor }) => {
  return (
    <button
      onClick={onClick}
      className={`py-[.6vw] text-lg capitalize flex items-center gap-[1vw] px-[1vw] text-center cursor-pointer font-medium rounded-lg transition-all duration-300 ${
        isActive
          ? 'bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#13104A]/95 via-[#2D3377]/90 via-[#18103A]/85 via-[#211A55]/80 to-[#13104A]/95 backdrop-blur-sm text-white'
          : bgColor ? bgColor : borderColor && borderColor
      } ${className}`}
    >
      {children}
    </button>
  );
};

export { OutlinedButton };

//border-2 border-[#2D3377] text-[#2D3377] hover:bg-[#2D3377]/5