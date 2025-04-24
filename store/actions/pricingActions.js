import {
  fetchPricingStart,
  fetchPricingSuccess,
  fetchPricingFailure,
  fetchSubscriptionStart,
  fetchSubscriptionSuccess,
  fetchSubscriptionFailure
} from '../reducers/pricingReducer';
import { getPricingPlansApi, getCurrentSubscriptionApi } from '../../api/profile/subscription';

export const fetchPricingPlans = () => async (dispatch) => {
  try {
    dispatch(fetchPricingStart());
    const plans = await getPricingPlansApi();
    
    if (!plans || !Array.isArray(plans)) {
      // If no plans returned or invalid format, use fallback data
      const fallbackPlans = [
        {
          id: 1,
          subscription_type: 'FREE',
          agent_limit: 5,
          conversation_limit: 100,
          voice_seconds_limit: 1200, // 20 minutes
          knowledge_base_limit: 500000
        },
        {
          id: 2,
          subscription_type: 'BRONZE',
          agent_limit: 25,
          conversation_limit: 1000,
          voice_seconds_limit: 3000, // 50 minutes
          knowledge_base_limit: 1000000
        },
        {
          id: 3,
          subscription_type: 'SILVER',
          agent_limit: 50,
          conversation_limit: 2500,
          voice_seconds_limit: 6000, // 100 minutes
          knowledge_base_limit: 2000000
        }
      ];
      dispatch(fetchPricingSuccess(fallbackPlans));
      return fallbackPlans;
    }
    
    dispatch(fetchPricingSuccess(plans));
    return plans;
  } catch (error) {
    console.error('Error fetching pricing plans:', error);
    dispatch(fetchPricingFailure(error.message || 'Failed to fetch pricing plans'));
    
    // Return fallback data on error
    const fallbackPlans = [
      {
        id: 1,
        subscription_type: 'FREE',
        agent_limit: 5,
        conversation_limit: 100,
        voice_seconds_limit: 1200, // 20 minutes
        knowledge_base_limit: 500000
      },
      {
        id: 2,
        subscription_type: 'BRONZE',
        agent_limit: 25,
        conversation_limit: 1000,
        voice_seconds_limit: 3000, // 50 minutes
        knowledge_base_limit: 1000000
      },
      {
        id: 3,
        subscription_type: 'SILVER',
        agent_limit: 50,
        conversation_limit: 2500,
        voice_seconds_limit: 6000, // 100 minutes
        knowledge_base_limit: 2000000
      }
    ];
    dispatch(fetchPricingSuccess(fallbackPlans));
    return fallbackPlans;
  }
};

export const fetchCurrentSubscription = () => async (dispatch) => {
  try {
    dispatch(fetchSubscriptionStart());
    const subscriptionResponse = await getCurrentSubscriptionApi();
    
    // Handle the array response from the API (subscriptionResponse is an array)
    if (!subscriptionResponse || !Array.isArray(subscriptionResponse) || subscriptionResponse.length === 0) {
      // Default fallback subscription with SILVER plan when no data is returned
      const fallbackSubscription = {
        id: "fallback-id",
        subscription_type_id: 3,
        duration: 30,
        start_date: new Date().toISOString(),
        end_date: new Date(new Date().setDate(new Date().getDate() + 30)).toISOString(),
        status: "ACTIVE",
        subscription_type: {
          id: 3,
          subscription_type: "FREE",
          agent_limit: 50,
          conversation_limit: 2500,
          voice_seconds_limit: 6000,
          knowledge_base_limit: 2000000
        }
      };
      dispatch(fetchSubscriptionSuccess(fallbackSubscription));
      return fallbackSubscription;
    }
    
    // Take the first subscription from the array
    const subscription = subscriptionResponse[0];
    dispatch(fetchSubscriptionSuccess(subscription));
    return subscription;
  } catch (error) {
    console.error('Error fetching current subscription:', error);
    dispatch(fetchSubscriptionFailure(error.message || 'Failed to fetch current subscription'));
    
    // Default fallback subscription with SILVER plan on error
    const fallbackSubscription = {
      id: "fallback-id",
      subscription_type_id: 3,
      duration: 30,
      start_date: new Date().toISOString(),
      end_date: new Date(new Date().setDate(new Date().getDate() + 30)).toISOString(),
      status: "ACTIVE",
      subscription_type: {
        id: 3,
        subscription_type: "SILVER",
        agent_limit: 50,
        conversation_limit: 2500,
        voice_seconds_limit: 6000,
        knowledge_base_limit: 2000000
      }
    };
    dispatch(fetchSubscriptionSuccess(fallbackSubscription));
    return fallbackSubscription;
  }
}; 