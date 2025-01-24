"use client"

import React from "react";

const Page = () => {
  const authenticateCalendly = () => {
    const url =
      "https://auth.calendly.com/oauth/authorize?client_id=BRlpX1MI-TROt-KbNuIJvtejB2SoRgZcnpAr5LtXGb4&response_type=code&redirect_uri=https://app.zoft.ai";

    window.open(url);
  };
  return (
    <div>
      <div className="w-full h-screen relative flex justify-center items-center">
        <div className="w-[75%] h-[75%]">
          <h3 className="text-xl font-bold mb-8">Integrations</h3>
          <div className="flex">
            <div
              className="w-[290px] h-[170px] bg-white rounded-[8px] border-[#F2F2F2]-1 p-2 cursor-pointer"
              onClick={authenticateCalendly}
            >
              <div className="w-full h-[40%]">
                <img src={"/images/calendly.svg"} width={48} height={48} />
              </div>
              <div className="flex flex-col gap-2">
                <h3 className="text-lg">Calendly</h3>
                <p className="text-sm">
                  Integrate with calendly to automate bookings via chatbot and
                  phonebot
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
