"use client";

import React from "react";

const AnimatedGradientBackground = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none flex items-center justify-center">
      <div className="w-full h-64 flex items-center justify-center animate-gradient-dance">
        <div className="w-[85%] h-full bg-gradient-to-r from-sky-300/10 via-blue-800/10  to-blue-800/25 rounded-full blur-3xl"></div>
      </div>
    </div>
  );
};

export default AnimatedGradientBackground;

