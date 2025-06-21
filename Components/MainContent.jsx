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
  const [showTopBar, setShowTopBar] = useState(true);
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
      className={`h-screen items-center justify-center flex flex-col p- flex-1 ${theme === "dark" ? "bg-[#1F222A] text-white" : "bg-white"
        }`}
    >
      {subscriptionDetails?.type === "FREE" && showTopBar && (
        <div className="w-full flex items-center justify-between px-6 py-4 bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] shadow-lg mb-6 relative">
          <span className="text-white text-lg font-medium flex items-center gap-2">
            <svg className="w-6 h-6 mr-2" fill="none" stroke="white" strokeWidth="2" viewBox="0 0 24 24">
              <rect x="4" y="4" width="16" height="16" rx="4" fill="#fff" fillOpacity="0.1" />
              <path d="M8 12h8M12 8v8" stroke="white" strokeWidth="2" strokeLinecap="round" />
            </svg>
            You’re on the free plan — step up to premium and elevate your experience!
          </span>
          <div className="flex items-center gap-3">
            <button
              className="bg-[#F871A0] hover:bg-[#EC4899] text-white font-semibold px-6 py-2 rounded-md text-base shadow transition"
              onClick={() => router.push("/settings")}
            >
              Upgrade
            </button>
            <button
              className="ml-2 text-white hover:bg-white/20 rounded-full p-2 transition"
              onClick={() => setShowTopBar(false)}
              aria-label="Close"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

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
                    className={`px-3 py-1 rounded-full text-sm font-medium ${isSubscriptionValid
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
                onClick={() => router.push("/settings")}
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
