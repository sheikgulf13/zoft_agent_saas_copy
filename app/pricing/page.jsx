"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCurrentSubscription,
  fetchPricingPlans,
} from "../../store/actions/pricingActions";
import { startSubscription } from "../../utils/razorpay";

// Helper function to format plan data
const formatPlanData = (plan, isYearly, durationDays) => {
  // Mapping subscription types to display names
  const planNames = {
    FREE: "Starter",
    BRONZE: "Bronze",
    SILVER: "Silver",
    GOLD: "Gold",
    ENTERPRISE: "Enterprise",
  };

  const subscriptionType = plan.subscription_type || "Unknown";

  // Get the appropriate price from subscription_amount array
  const monthlyAmount = plan.subscription_amount?.find(
    (item) => item.duration === 30
  );
  const yearlyAmount = plan.subscription_amount?.find(
    (item) => item.duration === 365
  );

  // Use the appropriate price based on billing cycle
  const price = isYearly ? yearlyAmount?.amount : monthlyAmount?.amount;

  const currency =
    (isYearly ? yearlyAmount?.currency : monthlyAmount?.currency) || "INR";

  // Determine if the plan is popular (Silver plan)
  const isPopular = subscriptionType === "SILVER";

  // Map plan features from the API response
  const planFeatures = [
    { value: plan.agent_limit?.toString() || "0", label: "Agent limit" },
    {
      value: plan.conversation_limit
        ? plan.conversation_limit >= 1000
          ? `${plan.conversation_limit / 1000}K`
          : plan.conversation_limit.toString()
        : "0",
      label: "Monthly Conversations",
    },
    {
      value: plan.voice_seconds_limit
        ? `${Math.floor(plan.voice_seconds_limit / 60)} Minutes`
        : "0 Minutes",
      label: "Monthly Voice Call",
    },
    {
      value: plan.knowledge_base_limit
        ? plan.knowledge_base_limit >= 1000000
          ? `${plan.knowledge_base_limit / 1000000}M`
          : `${plan.knowledge_base_limit / 1000}K`
        : "0",
      label: "Knowledge Base",
    },
    {
      value:
        subscriptionType === "FREE" ||
        subscriptionType === "BRONZE" ||
        subscriptionType === "SILVER"
          ? "1 User"
          : "Multiuser Platform",
      label: "User Per Team",
    },
    { value: getStorageValue(subscriptionType), label: "Available Space" },
  ];

  return {
    id: plan.id,
    name: planNames[subscriptionType] || subscriptionType,
    price,
    currency,
    isYearly,
    duration: isYearly ? 365 : 30,
    popular: isPopular,
    features: planFeatures,
    subscriptionType,
  };
};

// Helper to get storage values
const getStorageValue = (subscriptionType) => {
  switch (subscriptionType) {
    case "FREE":
      return "100 MB";
    case "BRONZE":
      return "1 GB";
    case "SILVER":
      return "10 GB";
    case "GOLD":
      return "100 GB";
    default:
      return "Dedicated Support";
  }
};

// Function to sort plans in the correct order (Bronze, Silver, Starter)
const sortPlans = (plans) => {
  const orderMap = {
    Bronze: 1,
    Silver: 2,
    Starter: 3,
    Gold: 4,
    Enterprise: 5,
  };

  return [...plans].sort((a, b) => {
    return (orderMap[a.name] || 99) - (orderMap[b.name] || 99);
  });
};

// Pricing feature component
const PricingFeature = ({ value, label }) => (
  <div className="pt-4 border-t border-gray-200 dark:border-gray-700 text-center">
    <p className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
      {value}
    </p>
    <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
  </div>
);

const PricingPage = () => {
  const dispatch = useDispatch();
  const { plans, currentSubscription, loading, error } = useSelector(
    (state) => state.pricing
  );
  const [billingCycle, setBillingCycle] = useState("monthly");
  const [paymentLoading, setPaymentLoading] = useState(false);

  useEffect(() => {
    dispatch(fetchPricingPlans());
    dispatch(fetchCurrentSubscription());
  }, [dispatch]);

  const handleBillingCycleChange = (newBillingCycle) => {
    setBillingCycle(newBillingCycle);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-[50vh] text-red-500">
        {error}
      </div>
    );
  }

  const isYearly = billingCycle === "yearly";

  // Duration in unix timestamp
  const duration =
    currentSubscription?.end_date - currentSubscription?.start_date;

  // Duration in days
  const durationDays = Math.ceil(duration / (1000 * 60 * 60 * 24));

  // Format the plans from the API response
  const formattedPlans =
    plans && plans.length > 0
      ? plans.map((plan) => formatPlanData(plan, isYearly, durationDays))
      : [];

  // Sort plans in the correct order
  const sortedPlans = sortPlans(formattedPlans);

  // Get current subscription type
  const currentPlanType =
    currentSubscription?.subscription_type?.subscription_type || null;

  // Calculate if current subscription is yearly based on start and end dates
  const isCurrentYearly = (() => {
    if (!currentSubscription?.start_date || !currentSubscription?.end_date) {
      return false;
    }

    const startDate = new Date(currentSubscription.start_date);
    const endDate = new Date(currentSubscription.end_date);

    // Calculate difference in days
    const diffTime = Math.abs(endDate - startDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays >= 300; // If over ~10 months, consider it yearly
  })();

  // Plan order for comparison
  const planOrder = {
    FREE: 1,
    BRONZE: 2,
    SILVER: 3,
    GOLD: 4,
    ENTERPRISE: 5,
  };

  // Function to check if a plan is higher than current subscription or yearly upgrade for same tier
  const isUpgradable = (planType, isYearlyPlan) => {
    // if (!currentPlanType) return true; // No current plan, can subscribe to any

    // // Block yearly to monthly transitions
    // if (isCurrentYearly && !isYearlyPlan) {
    //   return false;
    // }

    // // Allow upgrade from monthly to yearly for the same plan only
    // if (isYearlyPlan && !isCurrentYearly) {
    //   return true;
    // }

    // Allow upgrade to higher tier only if same billing cycle
    if (planOrder[planType] > planOrder[currentPlanType]) {
      return true;
    }

    return false;
  };

  console.log(currentPlanType);

  // Function to check if a plan is the current subscription
  const isCurrentPlan = (planType) => {
    if (!currentPlanType) return false;

    if (planType === "STARTER" && currentPlanType === "FREE") return true;

    // For current plan, also check if both are yearly or both are monthly
    if (planType === currentPlanType) {
      // If checking yearly plan, current must be yearly
      // If checking monthly plan, current must be monthly
      return isYearly ? isCurrentYearly : !isCurrentYearly;
    }

    return false;
  };

  // Handle subscription or upgrade
  const handleSubscription = async (plan) => {
    try {
      setPaymentLoading(true);

      // Get duration based on billing cycle
      const duration = plan.duration; // Already set in formatPlanData

      // Get subscription type ID from plan
      const subscriptionTypeId = plan.id;

      // Start subscription process - no need to pass token manually now
      await startSubscription(
        subscriptionTypeId,
        duration,
        {} // User details will be retrieved on the backend
      );
    } catch (error) {
      console.error("Subscription failed:", error);
      alert("Failed to initiate subscription. Please try again.");
    } finally {
      setPaymentLoading(false);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Current Plan Section */}
      {currentSubscription && (
        <div className="text-center mb-8 p-6 bg-white rounded-xl shadow-sm border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Your Current Plan:{" "}
            {currentSubscription?.subscription_type?.subscription_type ||
              "Unknown"}
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Status: {currentSubscription?.status || "N/A"} | Duration:{" "}
            {durationDays || 0} days | Start Date:{" "}
            {currentSubscription?.start_date
              ? new Date(currentSubscription.start_date).toLocaleDateString()
              : "N/A"}{" "}
            | End Date:{" "}
            {currentSubscription?.end_date
              ? new Date(currentSubscription.end_date).toLocaleDateString()
              : "N/A"}
          </p>
        </div>
      )}

      {/* Billing Toggle */}
      <div className="flex flex-col items-center mb-12">
        <div className="inline-flex rounded-lg border border-gray-200 dark:border-gray-700 p-1 bg-gray-50 dark:bg-gray-800">
          <button
            onClick={() => handleBillingCycleChange("monthly")}
            className={`px-4 py-2 text-sm font-medium rounded-md ${
              billingCycle === "monthly"
                ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
                : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => handleBillingCycleChange("yearly")}
            className={`px-4 py-2 text-sm font-medium rounded-md ${
              billingCycle === "yearly"
                ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
                : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            }`}
          >
            Yearly
          </button>
        </div>
        <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
          {isYearly
            ? "Save 16.7% with yearly billing (2 months free)"
            : "Switch to yearly billing for 2 months free"}
        </p>
      </div>

      {/* Plans Grid */}
      <div className="flex justify-center gap-8">
        {sortedPlans && sortedPlans.length > 0 ? (
          sortedPlans.map((plan, index) => (
            <div key={plan.id || index} className="flex justify-center">
              <div
                className={`relative w-[280px] max-w-[280px] rounded-2xl bg-white dark:bg-gray-800 shadow-lg overflow-hidden ${
                  plan.popular ? "ring-2 ring-primary" : ""
                }`}
              >
                {plan.popular && (
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#13104A]/95 via-[#2D3377]/90 via-[#18103A]/85 via-[#211A55]/80 to-[#13104A]/95 backdrop-blur-sm text-white px-3 py-1 text-xs rounded-b-lg font-medium">
                    Most Popular
                  </div>
                )}

                <div className="p-6">
                  <h3 className="text-xl font-semibold text-center text-gray-900 dark:text-white mb-2">
                    {plan.name}
                  </h3>

                  <div className="text-center mb-4">
                    <span className="text-3xl font-bold text-gray-900 dark:text-white">
                      {plan.name === "Starter"
                        ? "Free"
                        : plan.price === undefined
                        ? "Contact Us"
                        : plan.price === 0
                        ? "Free"
                        : `${plan.price} ${plan.currency}`}
                    </span>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      {plan.name === "Starter" || plan.price === 0
                        ? "Forever"
                        : plan.price === null
                        ? "Enterprise"
                        : plan.isYearly
                        ? "Per Year"
                        : "Per Month"}
                    </p>
                  </div>

                  {isCurrentPlan(plan.name.toUpperCase()) ? (
                    <div className="mb-6 py-2 px-4 bg-blue-500 text-white text-center rounded-lg text-sm font-medium">
                      Current plan
                    </div>
                  ) : (
                    <button
                      onClick={() => handleSubscription(plan)}
                      disabled={paymentLoading}
                      className={`w-full mb-6 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                        // plan.popular
                        //   ? "bg-primary text-white hover:bg-primary-dark"
                        !isUpgradable(plan.name.toUpperCase(), plan.isYearly)
                          ? "invisible"
                          : "bg-white text-primary border-2 border-primary hover:bg-primary hover:text-white"
                      }`}
                    >
                      {plan.name.toUpperCase() === currentPlanType &&
                      plan.isYearly
                        ? "Upgrade to yearly"
                        : "Upgrade plan"}
                    </button>
                  )}

                  <div className="space-y-4">
                    {plan.features &&
                      plan.features.map((feature, idx) => (
                        <PricingFeature
                          key={idx}
                          value={feature.value}
                          label={feature.label}
                        />
                      ))}
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <>
            {/* Bronze Plan */}
            <div className="flex justify-center">
              <div className="relative w-full max-w-sm rounded-2xl bg-white dark:bg-gray-800 shadow-lg overflow-hidden">
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-center text-gray-900 dark:text-white mb-2">
                    Bronze
                  </h3>

                  <div className="text-center mb-4">
                    <span className="text-3xl font-bold text-gray-900 dark:text-white">
                      {isYearly ? "340 INR" : "34 INR"}
                    </span>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      {isYearly ? "Per Year" : "Per Month"}
                    </p>
                  </div>

                  {currentPlanType === "BRONZE" &&
                  !isYearly === !isCurrentYearly ? (
                    <div className="mb-6 py-2 px-4 bg-blue-500 text-white text-center rounded-lg text-sm font-medium">
                      Current plan
                    </div>
                  ) : (
                    (planOrder["BRONZE"] > planOrder[currentPlanType] ||
                      (currentPlanType === "BRONZE" &&
                        isYearly &&
                        !isCurrentYearly)) && (
                      <button
                        onClick={() =>
                          handleSubscription({
                            id: plans?.find(
                              (p) =>
                                p.subscription_type?.subscription_type ===
                                "BRONZE"
                            )?.id,
                            name: "Bronze",
                            duration: isYearly ? 365 : 30,
                          })
                        }
                        disabled={paymentLoading}
                        className="w-full mb-6 py-2 px-4 rounded-lg text-sm font-medium transition-colors bg-white text-primary border-2 border-primary hover:bg-primary hover:text-white"
                      >
                        {currentPlanType === "BRONZE" && isYearly
                          ? "Upgrade to yearly"
                          : "Upgrade plan"}
                      </button>
                    )
                  )}

                  <div className="space-y-4">
                    <PricingFeature value="25" label="Agent limit" />
                    <PricingFeature value="1K" label="Monthly Conversations" />
                    <PricingFeature
                      value="50 Minutes"
                      label="Monthly Voice Call"
                    />
                    <PricingFeature value="1M" label="Knowledge Base" />
                    <PricingFeature value="1 User" label="User Per Team" />
                    <PricingFeature value="1 GB" label="Available Space" />
                  </div>
                </div>
              </div>
            </div>

            {/* Silver Plan */}
            <div className="flex justify-center">
              <div className="relative w-full max-w-sm rounded-2xl bg-white dark:bg-gray-800 shadow-lg overflow-hidden ring-2 ring-primary">
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 bg-primary text-white px-4 py-1 text-xs font-medium">
                  Most Popular
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-semibold text-center text-gray-900 dark:text-white mb-2">
                    Silver
                  </h3>

                  <div className="text-center mb-4">
                    <span className="text-3xl font-bold text-gray-900 dark:text-white">
                      {isYearly ? "390 INR" : "39 INR"}
                    </span>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      {isYearly ? "Per Year" : "Per Month"}
                    </p>
                  </div>

                  {currentPlanType === "SILVER" &&
                  !isYearly === !isCurrentYearly ? (
                    <div className="mb-6 py-2 px-4 bg-blue-500 text-white text-center rounded-lg text-sm font-medium">
                      Current plan
                    </div>
                  ) : (
                    (planOrder["SILVER"] > planOrder[currentPlanType] ||
                      (currentPlanType === "SILVER" &&
                        isYearly &&
                        !isCurrentYearly)) && (
                      <button
                        onClick={() =>
                          handleSubscription({
                            id: plans?.find(
                              (p) =>
                                p.subscription_type?.subscription_type ===
                                "SILVER"
                            )?.id,
                            name: "Silver",
                            duration: isYearly ? 365 : 30,
                          })
                        }
                        disabled={paymentLoading}
                        className="w-full mb-6 py-2 px-4 rounded-lg text-sm font-medium transition-colors bg-primary text-white hover:bg-primary-dark"
                      >
                        {currentPlanType === "SILVER" && isYearly
                          ? "Upgrade to yearly"
                          : "Upgrade plan"}
                      </button>
                    )
                  )}

                  <div className="space-y-4">
                    <PricingFeature value="50" label="Agent limit" />
                    <PricingFeature
                      value="2.5K"
                      label="Monthly Conversations"
                    />
                    <PricingFeature
                      value="100 Minutes"
                      label="Monthly Voice Call"
                    />
                    <PricingFeature value="2M" label="Knowledge Base" />
                    <PricingFeature value="1 User" label="User Per Team" />
                    <PricingFeature value="10 GB" label="Available Space" />
                  </div>
                </div>
              </div>
            </div>

            {/* Starter Plan */}
            <div className="flex justify-center">
              <div className="relative w-full max-w-sm rounded-2xl bg-white dark:bg-gray-800 shadow-lg overflow-hidden">
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-center text-gray-900 dark:text-white mb-2">
                    Starter
                  </h3>

                  <div className="text-center mb-4">
                    <span className="text-3xl font-bold text-gray-900 dark:text-white">
                      Free
                    </span>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      Forever
                    </p>
                  </div>

                  <div className="space-y-4">
                    <PricingFeature value="5" label="Agent limit" />
                    <PricingFeature value="100" label="Monthly Conversations" />
                    <PricingFeature
                      value="20 Minutes"
                      label="Monthly Voice Call"
                    />
                    <PricingFeature value="500K" label="Knowledge Base" />
                    <PricingFeature value="1 User" label="User Per Team" />
                    <PricingFeature value="100 MB" label="Available Space" />
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PricingPage;
