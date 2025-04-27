import { getApiConfig, getApiHeaders } from "../../utility/api-config";

const getDashboardDataApi = async () => {
    const url = process.env.url;
    const config = getApiConfig();
    
    try {
        let response = await fetch(`${url}/dashboard`, {
            method: 'GET',
            ...config,
            headers: {
                ...getApiHeaders(),
            }
        });

        if(response.status === 401) {
            return window.location.href = "/register";
        }
        
        if (!response.ok) {
            throw new Error('Failed to fetch pricing plans');
        }
        
        return await response.json();
    } catch (error) {
        console.error('Error fetching pricing plans:', error);
        return null;
    }
};

export { getDashboardDataApi };
