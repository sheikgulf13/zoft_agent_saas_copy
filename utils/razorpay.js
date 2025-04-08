// Function to dynamically load Razorpay script
import { getApiConfig, getApiHeaders } from '../utility/api-config';

export const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => {
      resolve(true);
    };
    script.onerror = () => {
      resolve(false);
    };
    document.body.appendChild(script);
  });
};

// Function to initialize Razorpay payment
export const initiateRazorpayPayment = async (orderId, amount, currency, subscriptionType, userDetails) => {
  const res = await loadRazorpayScript();
  
  if (!res) {
    alert('Razorpay SDK failed to load. Please check your internet connection.');
    return;
  }
  
  const options = {
    key: process.env.NEXT_PUBLIC_RAZORPAY_KEY,
    amount: amount * 100, // Razorpay expects amount in paise
    currency: currency || 'INR',
    name: 'Kayzen AI',
    description: `Subscription for ${subscriptionType} plan`,
    order_id: orderId,
    handler: function (response) {
      // Handle successful payment
      console.log('Payment successful', response);
      // Redirect to success page or update UI accordingly
      window.location.href = '/dashboard'; // Redirect to dashboard or success page
    },
    prefill: {
      name: userDetails?.name || '',
      email: userDetails?.email || '',
      contact: userDetails?.phone || '',
    },
    notes: {
      subscription_type: subscriptionType
    },
    theme: {
      color: '#3f51b5',
    },
    modal: {
      ondismiss: function() {
        console.log('Payment modal closed');
        // Handle modal dismissal
      }
    }
  };
  
  const paymentObject = new window.Razorpay(options);
  paymentObject.open();
};

// Function to start subscription process
export const startSubscription = async (subscriptionTypeId, duration, userDetails) => {
  try {
    const url = process.env.url;
    const config = getApiConfig();
    const headers = getApiHeaders();
    
    // Call your subscription creation API
    const response = await fetch(`${url}/public/subscription/create`, {
      method: 'POST',
      headers: {
        ...headers,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        subscription_type_id: subscriptionTypeId,
        subscription_duration: duration
      }),
      ...config
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error("API Error:", errorText);
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    
    if (data.success) {
      // Initialize Razorpay payment with order details
      await initiateRazorpayPayment(
        data.order_id,
        data.subscription_details.amount,
        data.subscription_details.currency || 'INR',
        data.subscription_details.type,
        userDetails
      );
      return data;
    } else {
      console.error('Failed to create subscription:', data);
      throw new Error(data.message || 'Failed to create subscription');
    }
  } catch (error) {
    console.error('Error starting subscription:', error);
    throw error;
  }
}; 