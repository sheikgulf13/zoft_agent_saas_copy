import { useSubscription } from '../context/SubscriptionContext';

export const useSubscriptionPermission = () => {
  const { isSubscriptionValid, subscriptionDetails } = useSubscription();

  const getFeatureLimit = (featureName) => {
    if (!subscriptionDetails) return 0;
    
    const limits = {
      agents: subscriptionDetails.limits.agentLimit,
      conversations: subscriptionDetails.limits.conversationLimit,
      voiceSeconds: subscriptionDetails.limits.voiceSecondsLimit,
      knowledgeBase: subscriptionDetails.limits.knowledgeBaseLimit
    };

    return limits[featureName] || 0;
  };

  return {
    isSubscriptionValid,
    subscriptionDetails,
    getFeatureLimit
  };
}; 