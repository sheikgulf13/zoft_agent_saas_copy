// components/MainContent.jsx
"use client";
import React, { useEffect, useState } from "react";
import Header from "./Header";
import useTheme from "next-theme";
import { getApiConfig, getApiHeaders } from "@/utility/api-config";
import { useSearchParams, useRouter } from "next/navigation";
import { DashboardContainer } from "./dashboard/DashboardContainer";
import { useSubscription } from "@/context/SubscriptionContext";
import SmudgyBackground from "./SmudgyBackground";

const MainContent = () => {
  const { theme, setTheme } = useTheme();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const {
    isSubscriptionValid,
    subscriptionDetails,
    checkPermission,
    refreshSubscription,
    loading,
    error,
  } = useSubscription();

  useEffect(() => {
    refreshSubscription();
  }, []);

  const authenticateCalendly = (code) => {
    const url = process.env.url;

    const form = new FormData();
    form.append("app_integration", "calendly");
    form.append("authorization_code", code);

    fetch(`${url}/public/integration`, {
      ...getApiConfig(),
      method: "post",
      headers: new Headers({ ...getApiHeaders() }),
      body: form,
    }).then(() => {
      window.close();
    });
  };

  useEffect(() => {
    const code = searchParams.get("code");

    if (code?.length && searchParams) {
      authenticateCalendly(code);
    }
  }, [searchParams]);

  // Loading state for subscription data
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div
      className={`h-screen items-center justify-center flex flex-col p- flex-1 ${
        theme === "dark" ? "bg-[#1F222A] text-white" : "bg-white"
      }`}
    >
      {/* <Header /> */}
      <div className="bg-white flex items-center justify-end w-full min-h-[8vh] max-h-[8vh] px-10 shadow-sm border border-b-gray-200">
        <button
          onClick={() => setShowModal(true)}
          className="text-black border border-blue-950 rounded-full px-10 py-2 mr-4"
        >
          {subscriptionDetails?.type || "FREE"}
        </button>
        {subscriptionDetails?.type === "FREE" && (
          <button
            onClick={() => router.push("/appsettings")}
            className="text-black border border-blue-950 rounded-full px-10 py-2"
          >
            Upgrade
          </button>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 max-w-md w-full shadow-2xl border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                Subscription Details
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="space-y-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-medium text-gray-500">
                    Status
                  </span>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      isSubscriptionValid
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {isSubscriptionValid ? "Active" : "Inactive"}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-500">
                    Plan Type
                  </span>
                  <span className="text-gray-800 font-semibold">
                    {subscriptionDetails?.type || "FREE"}
                  </span>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-sm font-medium text-gray-500 mb-3">
                  Usage Limits
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Agents</span>
                    <span className="font-medium text-gray-800">
                      {subscriptionDetails?.limits?.agentLimit || "Unlimited"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Conversations</span>
                    <span className="font-medium text-gray-800">
                      {subscriptionDetails?.limits?.conversationLimit ||
                        "Unlimited"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Voice Minutes</span>
                    <span className="font-medium text-gray-800">
                      {Math.floor(
                        (subscriptionDetails?.limits?.voiceSecondsLimit || 0) /
                          60
                      )}{" "}
                      minutes
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Knowledge Base</span>
                    <span className="font-medium text-gray-800">
                      {Math.floor(
                        (subscriptionDetails?.limits?.knowledgeBaseLimit || 0) /
                          1000
                      )}
                      K characters
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => router.push("/appsettings")}
                className="w-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#13104A]/95 via-[#2D3377]/90 via-[#18103A]/85 via-[#211A55]/80 to-[#13104A]/95 backdrop-blur-sm text-white px-4 py-2.5 rounded-lg font-medium hover:opacity-[0.8] transition-colors"
              >
                Manage Subscription
              </button>
            </div>
          </div>
        </div>
      )}

      <DashboardContainer />
    </div>
  );
};

export default MainContent;
