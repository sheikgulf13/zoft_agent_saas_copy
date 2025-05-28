import React from "react";

const ContainedButton = ({ children, onClick, isLoading = false, className = "", bgColor }) => {
  return (
    <button
      onClick={onClick}
      disabled={isLoading}
      className={`py-[.6vw] text-lg capitalize flex items-center gap-[1vw] px-[1vw] text-center cursor-pointer font-medium rounded-lg transition-all duration-300 ${bgColor ? bgColor : 'bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#13104A]/95 via-[#2D3377]/90 via-[#18103A]/85 via-[#211A55]/80 to-[#13104A]/95 backdrop-blur-sm'}  text-white hover:shadow-lg hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed ${className}`}
    >
      {isLoading ? (
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          <span>Loading...</span>
        </div>
      ) : (
        children
      )}
    </button>
  );
};

export { ContainedButton };
