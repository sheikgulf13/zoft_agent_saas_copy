'use client';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Typography, Paper, Button, Chip, CircularProgress, ToggleButtonGroup, ToggleButton } from '@mui/material';
import { fetchPricingPlans, fetchCurrentSubscription } from '../../store/actions/pricingActions';
import { startSubscription } from '../../utils/razorpay';

// Helper function to format plan data
const formatPlanData = (plan, isYearly) => {
  // Mapping subscription types to display names
  const planNames = {
    'FREE': 'Starter',
    'BRONZE': 'Bronze',
    'SILVER': 'Silver',
    'GOLD': 'Gold',
    'ENTERPRISE': 'Enterprise'
  };

  const subscriptionType = plan.subscription_type || 'Unknown';
  
  // Get the appropriate price from subscription_amount array
  const monthlyAmount = plan.subscription_amount?.find(item => item.duration === 30);
  const yearlyAmount = plan.subscription_amount?.find(item => item.duration === 365);
  
  // Use the appropriate price based on billing cycle
  const price = isYearly 
    ? yearlyAmount?.amount 
    : monthlyAmount?.amount;
    
  const currency = (isYearly ? yearlyAmount?.currency : monthlyAmount?.currency) || 'INR';
  
  // Determine if the plan is popular (Silver plan)
  const isPopular = subscriptionType === 'SILVER';

  // Map plan features from the API response
  const planFeatures = [
    { value: plan.agent_limit?.toString() || '0', label: 'Agent limit' },
    { value: plan.conversation_limit ? (plan.conversation_limit >= 1000 ? `${plan.conversation_limit/1000}K` : plan.conversation_limit.toString()) : '0', 
      label: 'Monthly Conversations' },
    { value: plan.voice_seconds_limit ? `${Math.floor(plan.voice_seconds_limit/60)} Minutes` : '0 Minutes', 
      label: 'Monthly Voice Call' },
    { value: plan.knowledge_base_limit ? (plan.knowledge_base_limit >= 1000000 ? `${plan.knowledge_base_limit/1000000}M` : `${plan.knowledge_base_limit/1000}K`) : '0', 
      label: 'Knowledge Base' },
    { value: subscriptionType === 'FREE' || subscriptionType === 'BRONZE' || subscriptionType === 'SILVER' ? '1 User' : 'Multiuser Platform', 
      label: 'User Per Team' },
    { value: getStorageValue(subscriptionType), 
      label: 'Available Space' }
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
    subscriptionType
  };
};

// Helper to get storage values
const getStorageValue = (subscriptionType) => {
  switch (subscriptionType) {
    case 'FREE': return '100 MB';
    case 'BRONZE': return '1 GB';
    case 'SILVER': return '10 GB';
    case 'GOLD': return '100 GB';
    default: return 'Dedicated Support';
  }
};

// Function to sort plans in the correct order (Bronze, Silver, Starter)
const sortPlans = (plans) => {
  const orderMap = {
    'Bronze': 1,
    'Silver': 2, 
    'Starter': 3,
    'Gold': 4,
    'Enterprise': 5
  };
  
  return [...plans].sort((a, b) => {
    return (orderMap[a.name] || 99) - (orderMap[b.name] || 99);
  });
};

const PricingPage = () => {
  const dispatch = useDispatch();
  const { plans, currentSubscription, loading, error } = useSelector((state) => state.pricing);
  const [billingCycle, setBillingCycle] = useState('monthly');
  const [paymentLoading, setPaymentLoading] = useState(false);
  
  useEffect(() => {
    dispatch(fetchPricingPlans());
    dispatch(fetchCurrentSubscription());
  }, [dispatch]);

  const handleBillingCycleChange = (event, newBillingCycle) => {
    if (newBillingCycle !== null) {
      setBillingCycle(newBillingCycle);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  const isYearly = billingCycle === 'yearly';
  
  // Duration in unix timestamp
  const duration = currentSubscription?.end_date - currentSubscription?.start_date;

  // Duration in days
  const durationDays = Math.ceil(duration / (1000 * 60 * 60 * 24));

  // Format the plans from the API response
  const formattedPlans = plans && plans.length > 0 
    ? plans.map(plan => formatPlanData(plan, isYearly, durationDays))
    : [];
    
  // Sort plans in the correct order
  const sortedPlans = sortPlans(formattedPlans);

  // Get current subscription type
  const currentPlanType = currentSubscription?.subscription_type?.subscription_type || null;
  
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
    'FREE': 1,
    'BRONZE': 2,
    'SILVER': 3,
    'GOLD': 4,
    'ENTERPRISE': 5
  };

  // Function to check if a plan is higher than current subscription or yearly upgrade for same tier
  const isUpgradable = (planType, isYearlyPlan) => {
    if (!currentPlanType) return true; // No current plan, can subscribe to any
    
    // Allow upgrade from monthly to yearly for same tier
    if (planType === currentPlanType && isYearlyPlan && !isCurrentYearly) {
      return true;
    }
    
    // Allow upgrade to higher tier
    if (planOrder[planType] > planOrder[currentPlanType]) {
      return true;
    }
    
    // Allow monthly to yearly even for lower tier plans
    if (isYearlyPlan && !isCurrentYearly) {
      return true;
    }
    
    return false;
  };

  // Function to check if a plan is the current subscription
  const isCurrentPlan = (planType) => {
    if (!currentPlanType || planType === 'FREE') return false;
    
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
      console.error('Subscription failed:', error);
      alert('Failed to initiate subscription. Please try again.');
    } finally {
      setPaymentLoading(false);
    }
  };

  return (
    <Box>
      {/* Current Plan Section - Moved to top */}
      {currentSubscription && (
        <Box sx={{ mb: 4, textAlign: 'center', pb: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
          <Typography variant="h6" sx={{ fontWeight: 500, mb: 0.5, fontSize: '1rem' }}>
            Your Current Plan: {currentSubscription?.subscription_type?.subscription_type || 'Unknown'}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem', lineHeight: 1.5 }}>
            Status: {currentSubscription?.status || 'N/A'} | Duration: {durationDays || 0} days | Start Date: {currentSubscription?.start_date ? new Date(currentSubscription.start_date).toLocaleDateString() : 'N/A'} | End Date: {currentSubscription?.end_date ? new Date(currentSubscription.end_date).toLocaleDateString() : 'N/A'}
          </Typography>
        </Box>
      )}

      {/* Billing toggle and yearly discount message */}
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 4 }}>
        <ToggleButtonGroup
          value={billingCycle}
          exclusive
          onChange={handleBillingCycleChange}
          aria-label="billing cycle"
          sx={{ mb: 2 }}
        >
          <ToggleButton value="monthly" aria-label="monthly billing">
            Monthly
          </ToggleButton>
          <ToggleButton value="yearly" aria-label="yearly billing">
            Yearly
          </ToggleButton>
        </ToggleButtonGroup>
        
        <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem' }}>
          {isYearly ? 'Save 16.7% with yearly billing (2 months free)' : 'Switch to yearly billing for 2 months free'}
        </Typography>
      </Box>

      {/* Plans grid - using Box with CSS Grid instead of deprecated Grid */}
      <Box sx={{ 
        width: '100%', 
        maxWidth: 1200, 
        mx: 'auto', 
        display: 'grid',
        gridTemplateColumns: {
          xs: '1fr',
          sm: 'repeat(2, 1fr)',
          md: 'repeat(3, 1fr)'
        },
        gap: 3,
        justifyContent: 'center'
      }}>
        {/* Plan cards would be mapped from the API response */}
        {sortedPlans && sortedPlans.length > 0 ? (
          sortedPlans.map((plan, index) => (
            <Box key={plan.id || index} sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
              <Paper 
                elevation={3} 
                sx={{ 
                  p: 3, 
                  height: '100%',
                  minHeight: 550, 
                  width: '100%',
                  maxWidth: 320,
                  display: 'flex', 
                  flexDirection: 'column',
                  position: 'relative',
                  overflow: 'hidden',
                  borderRadius: 2
                }}
              >
                {plan.popular && (
                  <Chip 
                    label="Most Popular" 
                    color="primary" 
                    sx={{ 
                      position: 'absolute', 
                      top: 0, 
                      left: '50%', 
                      transform: 'translateX(-50%)',
                      borderRadius: 0,
                      px: 2,
                      height: 24,
                      fontSize: '0.75rem',
                      fontWeight: 500,
                      '& .MuiChip-label': {
                        fontSize: '0.75rem',
                      }
                    }} 
                  />
                )}
                
                <Typography variant="h5" component="h2" align="center" sx={{ fontWeight: 600, mb: 1, mt: plan.popular ? 1 : 0, fontSize: '1.25rem' }}>
                  {plan.name}
                </Typography>
                
                <Typography variant="h4" align="center" sx={{ fontWeight: 700, mb: 0.5, fontSize: '1.75rem' }}>
                  {plan.name === 'Starter' ? 'Free' : plan.price === undefined ? 'Contact Us' : plan.price === 0 ? 'Free' : `${plan.price} ${plan.currency}`}
                </Typography>
                
                <Typography variant="body2" align="center" color="text.secondary" sx={{ mb: 3, fontSize: '0.875rem' }}>
                  {plan.name === 'Starter' || plan.price === 0 
                    ? 'Forever' 
                    : plan.price === null 
                      ? 'Enterprise' 
                      : plan.isYearly 
                        ? 'Per Year' 
                        : 'Per Month'}
                </Typography>
                
                {/* Free plan: no button, Current plan: non-clickable indicator, Higher tier or yearly upgrade: Upgrade plan */}
                {plan.price !== 0 && plan.name !== 'Starter' && (
                  isCurrentPlan(plan.name.toUpperCase()) ? (
                    <Box
                      sx={{
                        mb: 3,
                        py: 1,
                        borderRadius: 1,
                        fontSize: '0.875rem',
                        fontWeight: 500,
                        textAlign: 'center',
                        bgcolor: '#4dabf5',
                        color: 'white'
                      }}
                    >
                      Current plan
                    </Box>
                  ) : (
                    isUpgradable(plan.name.toUpperCase(), plan.isYearly) && (
                      <Button 
                        variant={plan.popular ? "contained" : "outlined"} 
                        color="primary" 
                        fullWidth 
                        sx={{ 
                          mb: 3, 
                          py: 1, 
                          borderRadius: 1,
                          fontSize: '0.875rem',
                          fontWeight: 500,
                          textTransform: 'none'
                        }}
                        onClick={() => handleSubscription(plan)}
                        disabled={paymentLoading}
                      >
                        {paymentLoading ? <CircularProgress size={20} /> : plan.name.toUpperCase() === currentPlanType && plan.isYearly ? 'Upgrade to yearly' : 'Upgrade plan'}
                      </Button>
                    )
                  )
                )}
                
                {/* Features */}
                <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                  {plan.features && plan.features.map((feature, idx) => (
                    <Box 
                      key={idx} 
                      sx={{ 
                        py: 2, 
                        borderTop: '1px solid',
                        borderColor: 'divider',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        textAlign: 'center'
                      }}
                    >
                      <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1rem', lineHeight: 1.5 }}>
                        {feature.value}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem' }}>
                        {feature.label}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Paper>
            </Box>
          ))
        ) : (
          // Fallback for empty plans
          <>
            {/* Bronze Plan */}
            <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
              <Paper elevation={3} sx={{ 
                p: 3, 
                height: '100%', 
                minHeight: 550,
                width: '100%',
                maxWidth: 320,
                display: 'flex', 
                flexDirection: 'column', 
                borderRadius: 2
              }}>
                <Typography variant="h5" component="h2" align="center" sx={{ fontWeight: 600, mb: 1, fontSize: '1.25rem' }}>
                  Bronze
                </Typography>
                <Typography variant="h4" align="center" sx={{ fontWeight: 700, mb: 0.5, fontSize: '1.75rem' }}>
                  {isYearly ? '340 INR' : '34 INR'}
                </Typography>
                <Typography variant="body2" align="center" color="text.secondary" sx={{ mb: 3, fontSize: '0.875rem' }}>
                  {isYearly ? 'Per Year' : 'Per Month'}
                </Typography>
                
                {currentPlanType === 'BRONZE' && !isYearly === !isCurrentYearly ? (
                  <Box
                    sx={{
                      mb: 3,
                      py: 1,
                      borderRadius: 1,
                      fontSize: '0.875rem',
                      fontWeight: 500,
                      textAlign: 'center',
                      bgcolor: '#4dabf5',
                      color: 'white'
                    }}
                  >
                    Current plan
                  </Box>
                ) : (
                  (planOrder['BRONZE'] > planOrder[currentPlanType] || 
                   (currentPlanType === 'BRONZE' && isYearly && !isCurrentYearly)) && (
                    <Button 
                      variant="outlined" 
                      color="primary" 
                      fullWidth 
                      sx={{ 
                        mb: 3, 
                        py: 1, 
                        borderRadius: 1,
                        fontSize: '0.875rem',
                        fontWeight: 500,
                        textTransform: 'none'
                      }}
                      onClick={() => handleSubscription({
                        id: plans.find(p => p.subscription_type?.subscription_type === 'BRONZE')?.id,
                        name: 'Bronze',
                        duration: isYearly ? 365 : 30
                      })}
                      disabled={paymentLoading}
                    >
                      {paymentLoading ? <CircularProgress size={20} /> : currentPlanType === 'BRONZE' && isYearly ? 'Upgrade to yearly' : 'Upgrade plan'}
                    </Button>
                  )
                )}
                
                <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                  <PricingFeature value="25" label="Agent limit" />
                  <PricingFeature value="1K" label="Monthly Conversations" />
                  <PricingFeature value="50 Minutes" label="Monthly Voice Call" />
                  <PricingFeature value="1M" label="Knowledge Base" />
                  <PricingFeature value="1 User" label="User Per Team" />
                  <PricingFeature value="1 GB" label="Available Space" />
                </Box>
              </Paper>
            </Box>

            {/* Silver Plan */}
            <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
              <Paper 
                elevation={3} 
                sx={{ 
                  p: 3, 
                  height: '100%',
                  minHeight: 550,
                  width: '100%',
                  maxWidth: 320,
                  display: 'flex', 
                  flexDirection: 'column',
                  position: 'relative',
                  overflow: 'hidden',
                  borderRadius: 2
                }}
              >
                <Chip 
                  label="Most Popular" 
                  color="primary" 
                  sx={{ 
                    position: 'absolute', 
                    top: 0, 
                    left: '50%', 
                    transform: 'translateX(-50%)',
                    borderRadius: 0,
                    px: 2,
                    height: 24,
                    fontSize: '0.75rem',
                    fontWeight: 500,
                    '& .MuiChip-label': {
                      fontSize: '0.75rem',
                    }
                  }} 
                />
                <Typography variant="h5" component="h2" align="center" sx={{ fontWeight: 600, mb: 1, mt: 1, fontSize: '1.25rem' }}>
                  Silver
                </Typography>
                <Typography variant="h4" align="center" sx={{ fontWeight: 700, mb: 0.5, fontSize: '1.75rem' }}>
                  {isYearly ? '390 INR' : '39 INR'}
                </Typography>
                <Typography variant="body2" align="center" color="text.secondary" sx={{ mb: 3, fontSize: '0.875rem' }}>
                  {isYearly ? 'Per Year' : 'Per Month'}
                </Typography>
                
                {currentPlanType === 'SILVER' && !isYearly === !isCurrentYearly ? (
                  <Box
                    sx={{
                      mb: 3,
                      py: 1,
                      borderRadius: 1,
                      fontSize: '0.875rem',
                      fontWeight: 500,
                      textAlign: 'center',
                      bgcolor: '#4dabf5',
                      color: 'white'
                    }}
                  >
                    Current plan
                  </Box>
                ) : (
                  (planOrder['SILVER'] > planOrder[currentPlanType] || 
                   (currentPlanType === 'SILVER' && isYearly && !isCurrentYearly)) && (
                    <Button 
                      variant="contained" 
                      color="primary" 
                      fullWidth 
                      sx={{ 
                        mb: 3, 
                        py: 1, 
                        borderRadius: 1,
                        fontSize: '0.875rem',
                        fontWeight: 500,
                        textTransform: 'none'
                      }}
                      onClick={() => handleSubscription({
                        id: plans.find(p => p.subscription_type?.subscription_type === 'SILVER')?.id,
                        name: 'Silver',
                        duration: isYearly ? 365 : 30
                      })}
                      disabled={paymentLoading}
                    >
                      {paymentLoading ? <CircularProgress size={20} /> : currentPlanType === 'SILVER' && isYearly ? 'Upgrade to yearly' : 'Upgrade plan'}
                    </Button>
                  )
                )}
                
                <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                  <PricingFeature value="50" label="Agent limit" />
                  <PricingFeature value="2.5K" label="Monthly Conversations" />
                  <PricingFeature value="100 Minutes" label="Monthly Voice Call" />
                  <PricingFeature value="2M" label="Knowledge Base" />
                  <PricingFeature value="1 User" label="User Per Team" />
                  <PricingFeature value="10 GB" label="Available Space" />
                </Box>
              </Paper>
            </Box>
            
            {/* Starter Plan */}
            <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
              <Paper elevation={3} sx={{ 
                p: 3, 
                height: '100%',
                minHeight: 550,
                width: '100%', 
                maxWidth: 320,
                display: 'flex', 
                flexDirection: 'column', 
                borderRadius: 2
              }}>
                <Typography variant="h5" component="h2" align="center" sx={{ fontWeight: 600, mb: 1, fontSize: '1.25rem' }}>
                  Starter
                </Typography>
                <Typography variant="h4" align="center" sx={{ fontWeight: 700, mb: 0.5, fontSize: '1.75rem' }}>
                  Free
                </Typography>
                <Typography variant="body2" align="center" color="text.secondary" sx={{ mb: 3, fontSize: '0.875rem' }}>
                  Forever
                </Typography>
                
                {/* Free plan will never be under current plan - removed button */}
                
                <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                  <PricingFeature value="5" label="Agent limit" />
                  <PricingFeature value="100" label="Monthly Conversations" />
                  <PricingFeature value="20 Minutes" label="Monthly Voice Call" />
                  <PricingFeature value="500K" label="Knowledge Base" />
                  <PricingFeature value="1 User" label="User Per Team" />
                  <PricingFeature value="100 MB" label="Available Space" />
                </Box>
              </Paper>
            </Box>
          </>
        )}
      </Box>
    </Box>
  );
};

// Pricing feature component
const PricingFeature = ({ value, label }) => (
  <Box 
    sx={{ 
      py: 2, 
      borderTop: '1px solid',
      borderColor: 'divider',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      textAlign: 'center'
    }}
  >
    <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1rem', lineHeight: 1.5 }}>
      {value}
    </Typography>
    <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem' }}>
      {label}
    </Typography>
  </Box>
);

export default PricingPage; 