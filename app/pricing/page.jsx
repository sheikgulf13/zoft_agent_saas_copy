'use client';

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Typography, Paper, Button, Chip, CircularProgress } from '@mui/material';
import { fetchPricingPlans, fetchCurrentSubscription } from '../../store/actions/pricingActions';

// Helper function to format plan data
const formatPlanData = (plan) => {
  // Check if the plan has a nested subscription_type object
  const planData = plan.subscription_type && typeof plan.subscription_type === 'object'
    ? plan.subscription_type
    : plan;

  // Mapping subscription types to display names
  const planNames = {
    'FREE': 'Starter',
    'BRONZE': 'Bronze',
    'SILVER': 'Silver',
    'GOLD': 'Gold',
    'ENTERPRISE': 'Enterprise'
  };

  // Map subscription types to prices
  const planPrices = {
    'FREE': 0,
    'BRONZE': 34,
    'SILVER': 39,
    'GOLD': 99,
    'ENTERPRISE': null // Custom pricing
  };

  const subscriptionType = planData.subscription_type || 'Unknown';

  // Determine if the plan is popular (Silver plan)
  const isPopular = subscriptionType === 'SILVER';

  // Map known plan features from the screenshot
  let planFeatures;
  
  if (subscriptionType === 'FREE') {
    planFeatures = [
      { value: '5', label: 'Agent limit' },
      { value: '100', label: 'Monthly Conversations' },
      { value: '20 Minutes', label: 'Monthly Voice Call' },
      { value: '500K', label: 'Knowledge Base' },
      { value: '1 User', label: 'User Per Team' },
      { value: '100 MB', label: 'Available Space' }
    ];
  } else if (subscriptionType === 'BRONZE') {
    planFeatures = [
      { value: '25', label: 'Agent limit' },
      { value: '1K', label: 'Monthly Conversations' },
      { value: '50 Minutes', label: 'Monthly Voice Call' },
      { value: '1M', label: 'Knowledge Base' },
      { value: '1 User', label: 'User Per Team' },
      { value: '1 GB', label: 'Available Space' }
    ];
  } else if (subscriptionType === 'SILVER') {
    planFeatures = [
      { value: '50', label: 'Agent limit' },
      { value: '2.5K', label: 'Monthly Conversations' },
      { value: '100 Minutes', label: 'Monthly Voice Call' },
      { value: '2M', label: 'Knowledge Base' },
      { value: '1 User', label: 'User Per Team' },
      { value: '10 GB', label: 'Available Space' }
    ];
  } else if (subscriptionType === 'GOLD') {
    planFeatures = [
      { value: '100', label: 'Agent limit' },
      { value: '10K', label: 'Monthly Conversations' },
      { value: '300 Minutes', label: 'Monthly Voice Call' },
      { value: '10M', label: 'Knowledge Base' },
      { value: '1 User', label: 'User Per Team' },
      { value: '100 GB', label: 'Available Space' }
    ];
  } else {
    // Enterprise or other type
    planFeatures = [
      { value: 'Unlimited', label: 'Agent limit' },
      { value: 'Unlimited', label: 'Monthly Conversations' },
      { value: '1,000 Minutes', label: 'Monthly Voice Call' },
      { value: 'Unlimited', label: 'Knowledge Base' },
      { value: 'Multiuser Platform', label: 'User Per Team' },
      { value: 'Dedicated Support', label: 'Available Space' }
    ];
  }

  return {
    id: plan.id,
    name: planNames[subscriptionType] || subscriptionType,
    price: planPrices[subscriptionType],
    popular: isPopular,
    features: planFeatures
  };
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

  useEffect(() => {
    dispatch(fetchPricingPlans());
    dispatch(fetchCurrentSubscription());
  }, [dispatch]);

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

  // Format the plans from the API response
  const formattedPlans = plans && plans.length > 0 
    ? plans.map(plan => formatPlanData(plan))
    : [];
    
  // Sort plans in the correct order
  const sortedPlans = sortPlans(formattedPlans);

  return (
    <Box>
      {/* Current Plan Section - Moved to top */}
      {currentSubscription && (
        <Box sx={{ mb: 4, textAlign: 'center', pb: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
          <Typography variant="h6" sx={{ fontWeight: 500, mb: 0.5, fontSize: '1rem' }}>
            Your Current Plan: {currentSubscription?.subscription_type?.subscription_type || 'Unknown'}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem', lineHeight: 1.5 }}>
            Status: {currentSubscription?.status || 'N/A'} | Duration: {currentSubscription?.duration || 0} days | Start Date: {currentSubscription?.start_date ? new Date(currentSubscription.start_date).toLocaleDateString() : 'N/A'} | End Date: {currentSubscription?.end_date ? new Date(currentSubscription.end_date).toLocaleDateString() : 'N/A'}
          </Typography>
        </Box>
      )}

      {/* Yearly subscription message */}
      <Typography variant="h6" align="center" sx={{ mb: 4, fontSize: '1rem', fontWeight: 500 }}>
        Get 2 months for free by subscribing yearly.
      </Typography>

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
                  {plan.price === 0 ? 'Free' : plan.price === null ? 'Custom Price' : `$${plan.price}`}
                </Typography>
                
                <Typography variant="body2" align="center" color="text.secondary" sx={{ mb: 3, fontSize: '0.875rem' }}>
                  {plan.price === 0 ? 'Forever' : plan.price === null ? 'Get a Quote' : 'Per Month'}
                </Typography>
                
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
                >
                  {plan.price === 0 ? 'Get started' : 'Subscribe'}
                </Button>
                
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
                  $34
                </Typography>
                <Typography variant="body2" align="center" color="text.secondary" sx={{ mb: 3, fontSize: '0.875rem' }}>
                  Per Month
                </Typography>
                <Button variant="outlined" color="primary" fullWidth 
                  sx={{ 
                    mb: 3, 
                    py: 1, 
                    borderRadius: 1,
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    textTransform: 'none'
                  }}>
                  Subscribe
                </Button>
                
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
                  $39
                </Typography>
                <Typography variant="body2" align="center" color="text.secondary" sx={{ mb: 3, fontSize: '0.875rem' }}>
                  Per Month
                </Typography>
                <Button variant="contained" color="primary" fullWidth 
                  sx={{ 
                    mb: 3, 
                    py: 1, 
                    borderRadius: 1,
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    textTransform: 'none'
                  }}>
                  Subscribe
                </Button>
                
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
                <Button variant="outlined" color="primary" fullWidth 
                  sx={{ 
                    mb: 3, 
                    py: 1, 
                    borderRadius: 1,
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    textTransform: 'none'
                  }}>
                  Get started
                </Button>
                
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