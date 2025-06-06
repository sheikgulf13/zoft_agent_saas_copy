import React, { createContext, useContext, useEffect, useState } from 'react';
import { getCurrentSubscriptionApi } from '../api/profile/subscription';

const SubscriptionContext = createContext();

export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (!context) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
};

export const SubscriptionProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubscriptionValid, setIsSubscriptionValid] = useState(false);
  const [subscriptionDetails, setSubscriptionDetails] = useState(null);

  const fetchSubscription = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getCurrentSubscriptionApi();
      console.log('subscription response', response);
      
      if (!response || !Array.isArray(response) || response.length === 0) {
        // Default to FREE plan if no subscription found
        const defaultSubscription = {
          id: "default-id",
          subscription_type_id: 1,
          start_date: new Date().toISOString(),
          end_date: new Date(new Date().setDate(new Date().getDate() + 30)).toISOString(),
          status: "ACTIVE",
          subscription_type: {
            id: 1,
            subscription_type: "FREE",
            agent_limit: 5,
            conversation_limit: 100,
            voice_seconds_limit: 1200,
            knowledge_base_limit: 500000
          }
        };
        handleSubscriptionUpdate(defaultSubscription);
        return;
      }

      // Get the first subscription from the array
      const subscription = response[0];
      handleSubscriptionUpdate(subscription);
    } catch (error) {
      console.error('Error fetching subscription:', error);
      setError(error.message || 'Failed to fetch subscription');
      
      // Set default subscription on error
      const defaultSubscription = {
        id: "default-id",
        subscription_type_id: 1,
        start_date: new Date().toISOString(),
        end_date: new Date(new Date().setDate(new Date().getDate() + 30)).toISOString(),
        status: "ACTIVE",
        subscription_type: {
          id: 1,
          subscription_type: "FREE",
          agent_limit: 5,
          conversation_limit: 100,
          voice_seconds_limit: 1200,
          knowledge_base_limit: 500000
        }
      };
      handleSubscriptionUpdate(defaultSubscription);
    } finally {
      setLoading(false);
    }
  };

  const handleSubscriptionUpdate = (subscription) => {
    const now = new Date();
    const endDate = new Date(subscription.end_date);
    const isValid = endDate > now && subscription.status === 'ACTIVE';
    
    setIsSubscriptionValid(isValid);
    setSubscriptionDetails({
      id: subscription.id,
      type: subscription.subscription_type?.subscription_type || 'FREE',
      limits: {
        agentLimit: subscription.subscription_type?.agent_limit || 5,
        conversationLimit: subscription.subscription_type?.conversation_limit || 100,
        voiceSecondsLimit: subscription.subscription_type?.voice_seconds_limit || 1200,
        knowledgeBaseLimit: subscription.subscription_type?.knowledge_base_limit || 500000
      },
      startDate: subscription.start_date,
      endDate: subscription.end_date,
      status: subscription.status,
      profileId: subscription.profile_id,
      transactionId: subscription.transaction_id,
      createdAt: subscription.created_at,
      updatedAt: subscription.updated_at
    });
  };

  const checkPermission = (requiredPlan) => {
    if (!subscriptionDetails) return false;
    
    const planHierarchy = {
      'FREE': 1,
      'BRONZE': 2,
      'SILVER': 3,
      'GOLD': 4,
      'ENTERPRISE': 5
    };

    return planHierarchy[subscriptionDetails.type] >= planHierarchy[requiredPlan];
  };

  const refreshSubscription = () => {
    fetchSubscription();
  };

  useEffect(() => {
    fetchSubscription();
  }, []);

  const value = {
    isSubscriptionValid,
    subscriptionDetails,
    loading,
    error,
    checkPermission,
    refreshSubscription
  };

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
}; 