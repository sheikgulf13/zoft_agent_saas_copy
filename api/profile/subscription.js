import { getApiConfig, getApiHeaders } from "../../utility/api-config";

const getPricingPlansApi = async () => {
    const url = process.env.url;
    const config = getApiConfig();
    
    try {
        let response = await fetch(`${url}/public/get/pricing`, {
            method: 'GET',
            ...config
        });
        
        if (!response.ok) {
            throw new Error('Failed to fetch pricing plans');
        }
        
        return await response.json();
    } catch (error) {
        console.error('Error fetching pricing plans:', error);
        return null;
    }
};

const getCurrentSubscriptionApi = async () => {
    const url = process.env.url;
    const config = getApiConfig();
    const headers = getApiHeaders();
    
    try {
        let response = await fetch(`${url}/public/subscription/current`, {
            method: 'POST',
            headers: {
                ...headers,
                'Content-Type': 'application/json'
            },
            ...config
        });
        
        if (!response.ok) {
            throw new Error('Failed to fetch current subscription');
        }
        
        return await response.json();
    } catch (error) {
        console.error('Error fetching current subscription:', error);
        return null;
    }
};

export { getPricingPlansApi, getCurrentSubscriptionApi };