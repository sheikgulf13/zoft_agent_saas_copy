"use client";

import React, { useEffect, useState } from "react";
import {
  getIntegrationList,
  removeIntegrationApi,
} from "../../api/integration-base-api";
import { ContainedButton } from "@/Components/buttons/ContainedButton";

const Page = () => {
  const [integrations, setIntegrations] = useState({});

  const authenticateCalendly = () => {
    const url =
      "https://auth.calendly.com/oauth/authorize?client_id=jq3Jg3umJnGpDjSjfRtdrvt3SZE9yVxhiVdcBNgtbiI&response_type=code&redirect_uri=http://localhost:3001/dashboard";

    window.open(url);
  };

  const loadAndStoreIntegrationList = async () => {
    const integrations = await getIntegrationList();

    setIntegrations(integrations ? integrations : {});
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      loadAndStoreIntegrationList();
    }, 2000);

    // Cleanup function to clear the interval when component unmounts
    return () => clearInterval(intervalId);
  }, []); // Empty dependency array means this effect runs once on mount

  const removeIntegration = (event) => {
    event.stopPropagation();
    removeIntegrationApi("calendly");
  };

  console.log(integrations);

  return (
    <div>
      <div className="w-full h-screen relative flex justify-center items-center">
        <div className="w-[75%] h-[75%] text-black">
          <h3 className="text-xl font-bold mb-8">Integrations</h3>
          <div className="flex">
            <div
              className="w-[290px] bg-white rounded-[8px] border-[#F2F2F2]-1 p-4 cursor-pointer flex flex-col gap-2"
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
                {integrations["calendly"] && (
                  <>
                    <div className="text-sm text-green-500">Connected</div>
                    <ContainedButton
                      backgroundColor={"rgb(239 68 68 / var(--tw-bg-opacity))"}
                      onClick={removeIntegration}
                    >
                      Disconnect
                    </ContainedButton>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
