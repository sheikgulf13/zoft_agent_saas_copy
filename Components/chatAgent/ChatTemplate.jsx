"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import useTheme from "next-theme";
import { getApiConfig, getApiHeaders } from "@/utility/api-config";

const categories = [
  { id: "all", name: "All Templates" },
  { id: "customer-service", name: "Customer Service" },
  { id: "sales", name: "Sales & Marketing" },
  { id: "support", name: "Technical Support" },
  { id: "onboarding", name: "Onboarding" },
  { id: "education", name: "Education" },
];

const ChatTemplate = () => {
  const [templates, setTemplates] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { theme } = useTheme();
  const url = process.env.url;

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      const response = await fetch(`${url}/template/get_agents`, {
        ...getApiConfig(),
        method: "GET",
        headers: new Headers({
          ...getApiHeaders(),
          "Content-Type": "application/json",
        }),
      });

      const data = await response.json();
      console.log("chat", data);
      setTemplates(data);

      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching templates:", error);

      setIsLoading(false);
    }
  };

  //const filteredTemplates =
  //selectedCategory === "all"
  // templates
  //: templates.filter((template) => template.category === selectedCategory);

  return (
    <div className="h-screen flex">
      {/* Left Navigation */}
      <div className="w-64 bg-white border-r border-gray-100 p-4">
        <h2 className="text-lg font-semibold text-gray-800 mb-6 px-2">
          Categories
        </h2>
        <nav className="space-y-1">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
                selectedCategory === category.id
                  ? "bg-[#13104A]/5 text-[#13104A] font-medium"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              {category.name}
            </button>
          ))}
        </nav>
      </div>
      {/* Right Content */}
      <div className="flex-1 bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                Chat Templates
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Choose from our pre-built templates to get started quickly
              </p>
            </div>
            <span className="text-sm text-gray-500 bg-white px-3 py-1.5 rounded-full border border-gray-200">
              {templates?.chat_agents?.length} templates available
            </span>
          </div>
          <div className="h-[calc(100vh-200px)] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent pr-2">
            <div className="flex flex-wrap gap-6">
              <AnimatePresence mode="wait">
                {isLoading
                  ? Array.from({ length: 6 }).map((_, index) => (
                      <div
                        key={index}
                        className="bg-white rounded-xl p-6 shadow-sm animate-pulse w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] min-h-[200px] max-h-[250px]"
                      >
                        <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-full mb-4"></div>
                        <div className="h-10 bg-gray-200 rounded"></div>
                      </div>
                    ))
                  : templates?.chat_agents?.map((template) => (
                      <motion.div
                        key={template.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.2 }}
                        className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] min-h-[200px] max-h-[250px] flex flex-col"
                      >
                        <div className="flex-1 mb-4">
                          <h3 className="text-lg font-semibold text-gray-800 mb-2">
                            {template.agent_name}
                          </h3>
                          <p className="text-sm text-gray-500 line-clamp-3">
                            {template.agent_description || "No description available"}
                          </p>
                        </div>
                        <div className="flex items-center justify-between mt-auto">
                          <button
                            onClick={() =>
                              router.push(
                                `/workspace/agents/chats/createbot?template=${encodeURIComponent(JSON.stringify(template))}`
                              )
                            }
                            className="w-full px-4 py-2 rounded-lg border border-[#13104A] text-[#13104A] text-sm font-medium hover:bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] hover:from-[#13104A]/95 hover:via-[#2D3377]/90 hover:via-[#18103A]/85 hover:via-[#211A55]/80 hover:to-[#13104A]/95 hover:text-white transition-all duration-300"
                          >
                            Use Template
                          </button>
                        </div>
                      </motion.div>
                    ))}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatTemplate;
