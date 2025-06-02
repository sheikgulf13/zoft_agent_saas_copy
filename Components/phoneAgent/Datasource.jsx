"use client";
import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import PropTypes from "prop-types";
import useTheme from "next-theme";

// Components
import GradientButton from "@/Components/buttons/GradientButton";
import { OutlinedButton } from "../buttons/OutlinedButton";
import { ContainedButton } from "../buttons/ContainedButton";
import CreateSource from "./CreateSource";
import TickIcon from "../Icons/TickIcon";
import AddFile from "../../Components/chatAgent/AddFile";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";

// Constants
const CONSTANTS = {
  LOADING_TIMEOUT: 100,
  NAVIGATION_DELAY: 150,
  AUTO_SAVE_DELAY: 1000,
  SKELETON_ANIMATION_DURATION: 1500,
  ROUTES: {
    PREVIOUS: "/workspace/agents/phone/createagent",
    NEXT: "/workspace/agents/phone/actions",
  },
  STEPS: {
    CURRENT: 2,
    TOTAL: 3,
    LABELS: {
      1: "phonebot creation",
      2: "Data Source", 
      3: "Actions"
    }
  }
};

const THEME_CONFIG = {
  light: {
    background: "bg-[#F2F4F7]",
    header: "bg-white",
    footer: "bg-white",
    text: "text-black",
    skeleton: { base: "#f5f5f5", highlight: "#e0e0e0" }
  },
  dark: {
    background: "bg-[#1F222A]",
    header: "bg-[#1A1C21]", 
    footer: "bg-[#1F222A]",
    text: "text-white",
    skeleton: { base: "#2a2d35", highlight: "#3a3f47" }
  }
};

// Custom Hooks
const useLoadingState = (initialDelay = CONSTANTS.LOADING_TIMEOUT) => {
  const [isLoading, setIsLoading] = useState(true);
  const timeoutRef = useRef(null);

  useEffect(() => {
    timeoutRef.current = setTimeout(() => {
      setIsLoading(false);
    }, initialDelay);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [initialDelay]);

  const resetLoading = useCallback((delay = initialDelay) => {
    setIsLoading(true);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      setIsLoading(false);
    }, delay);
  }, [initialDelay]);

  return { isLoading, resetLoading };
};

const useNavigation = () => {
  const router = useRouter();
  const [isNavigating, setIsNavigating] = useState(false);
  const [navigationError, setNavigationError] = useState(null);

  const navigate = useCallback(async (path, options = {}) => {
    if (isNavigating) return false;

    try {
      setIsNavigating(true);
      setNavigationError(null);

      // Add slight delay for better UX
      if (options.delay !== false) {
        await new Promise(resolve => setTimeout(resolve, CONSTANTS.NAVIGATION_DELAY));
      }

      router.push(path);
      return true;
    } catch (error) {
      console.error('Navigation error:', error);
      setNavigationError(error.message);
      setIsNavigating(false);
      return false;
    }
  }, [router, isNavigating]);

  const clearNavigationError = useCallback(() => {
    setNavigationError(null);
  }, []);

  return {
    navigate,
    isNavigating,
    navigationError,
    clearNavigationError
  };
};

const useProgressTracking = () => {
  const [progress, setProgress] = useState(false);
  const [lastActionTime, setLastActionTime] = useState(null);

  const trackProgress = useCallback((action) => {
    setProgress(true);
    setLastActionTime(new Date().toISOString());
    
    // Reset progress after a delay
    setTimeout(() => {
      setProgress(false);
    }, 2000);
  }, []);

  return {
    progress,
    lastActionTime,
    trackProgress
  };
};

const useErrorBoundary = () => {
  const [error, setError] = useState(null);

  const handleError = useCallback((error, context = '') => {
    console.error(`DataSource Error ${context}:`, error);
    setError({
      message: error.message || 'An unexpected error occurred',
      context,
      timestamp: Date.now()
    });
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return { error, handleError, clearError };
};

// Enhanced Skeleton Component
const SkeletonForm = React.memo(({ theme }) => {
  const themeConfig = THEME_CONFIG[theme] || THEME_CONFIG.light;
  
  const handleFormSubmit = useCallback((e) => {
    e.preventDefault();
  }, []);

  // Placeholder handlers for skeleton
  const placeholderHandler = useCallback(() => {}, []);

  return (
    <SkeletonTheme 
      baseColor={themeConfig.skeleton.base} 
      highlightColor={themeConfig.skeleton.highlight}
      duration={CONSTANTS.SKELETON_ANIMATION_DURATION}
    >
      <div className="w-full h-screen">
        {/* Progress bar */}
        <div className="h-[.5vh] w-[66%] bg-gradient-to-r from-[#EB1CD6] to-[#F4A36F]" />
        
        <div className="flex justify-end gap-[8vw]">
          {/* Main content skeleton */}
          <div className={`w-[40vw] mt-[3vw] rounded-[1vw] shadow-xl py-[1.5vw] relative ${
            theme === "dark" ? "bg-[#1F222A] text-white" : "bg-white text-black"
          }`}>
            <h1 className="H1 capitalize text-center pb-[1vh]">
              <Skeleton width={200} height={24} />
            </h1>
            
            <form
              className="flex flex-col gap-[1vw] px-[3vw]"
              onSubmit={handleFormSubmit}
            >
              <div className="mb-4">
                <Skeleton height={120} />
              </div>
              
              <div className="flex flex-col gap-[.4vw]">
                <label htmlFor="url" className="capitalize H2 font-medium">
                  <Skeleton width={100} height={16} />
                </label>
                <Skeleton height={40} />
              </div>
              
              <div className="flex flex-col gap-[.4vw]">
                <label htmlFor="rawText" className="capitalize H1 font-medium">
                  <Skeleton width={120} height={16} />
                </label>
                <Skeleton height={100} />
              </div>
              
              <div className="flex justify-between mb-[4vh] mt-4">
                <Skeleton width={80} height={36} />
                <Skeleton width={80} height={36} />
              </div>
            </form>
          </div>
          
          {/* Sidebar skeleton */}
          <div className={`w-[25vw] h-screen justify-self-end shadow-xl ${
            theme === "dark" ? "bg-[#1F222A] text-white" : "bg-white text-black"
          }`}>
            {[1, 2, 3].map((section) => (
              <div 
                key={section}
                className="border-b-[0.052vw] border-zinc-400 w-full h-1/3 flex flex-col items-start pl-[6vw] justify-center gap-[1vw] text-start capitalize"
              >
                <h1 className="H7 font-medium">
                  <Skeleton width={180} height={20} />
                </h1>
                <h2 className="H4 font-medium">
                  <Skeleton width={160} height={16} />
                </h2>
                <h6 className="H2 font-medium">
                  <Skeleton width={100} height={14} />
                </h6>
                <h6 className="H2 font-medium">
                  <Skeleton width={120} height={14} />
                </h6>
              </div>
            ))}
          </div>
        </div>
      </div>
    </SkeletonTheme>
  );
});

SkeletonForm.displayName = 'SkeletonForm';
SkeletonForm.propTypes = {
  theme: PropTypes.oneOf(['light', 'dark']).isRequired,
};

// Step Indicator Component  
const StepIndicator = React.memo(({ stepNumber, label, isCompleted, isCurrent, theme }) => {
  const getStepClasses = () => {
    if (isCompleted) {
      return "w-8 h-8 rounded-full bg-green-600 flex justify-center items-center";
    }
    if (isCurrent) {
      return "circle text-blue-400 w-[2vw] h-[2vw] rounded-full border-cyan-500 border-[.2vw] flex justify-center items-center";
    }
    return "circle text-blue-400 w-[2vw] h-[2vw] rounded-full border-cyan-500 border-[.2vw] flex justify-center items-center opacity-[.4]";
  };

  const getLabelClasses = () => {
    const baseClasses = "capitalize font-medium text-[.9vw] transition-all duration-200";
    if (!isCurrent && !isCompleted) {
      return `${baseClasses} opacity-[.4]`;
    }
    return baseClasses;
  };

  return (
    <div className="h-full flex items-center justify-start gap-[.5vw]">
      <div className={getStepClasses()} aria-label={`Step ${stepNumber}: ${label}`}>
        {isCompleted ? <TickIcon /> : stepNumber}
      </div>
      <h2 className={getLabelClasses()}>
        {label}
      </h2>
    </div>
  );
});

StepIndicator.displayName = 'StepIndicator';
StepIndicator.propTypes = {
  stepNumber: PropTypes.number.isRequired,
  label: PropTypes.string.isRequired,
  isCompleted: PropTypes.bool.isRequired,
  isCurrent: PropTypes.bool.isRequired,
  theme: PropTypes.oneOf(['light', 'dark']).isRequired,
};

// Error Display Component
const ErrorDisplay = React.memo(({ error, onDismiss, theme }) => {
  if (!error) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 animate-slide-up">
      <div className="max-w-md mx-auto p-4 rounded-lg shadow-lg border-l-4 bg-red-50 border-red-400 text-red-800 dark:bg-red-900 dark:text-red-200">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium">{error.message}</p>
            {error.context && (
              <p className="text-xs mt-1 opacity-75">Context: {error.context}</p>
            )}
          </div>
          <button 
            onClick={onDismiss}
            className="ml-4 text-lg leading-none hover:opacity-70 transition-opacity"
            aria-label="Dismiss error"
          >
            ×
          </button>
        </div>
      </div>
    </div>
  );
});

ErrorDisplay.displayName = 'ErrorDisplay';
ErrorDisplay.propTypes = {
  error: PropTypes.shape({
    message: PropTypes.string.isRequired,
    context: PropTypes.string,
    timestamp: PropTypes.number,
  }),
  onDismiss: PropTypes.func.isRequired,
  theme: PropTypes.oneOf(['light', 'dark']).isRequired,
};

// Main DataSource Component
const DataSource = ({ 
  className = "",
  onNavigate = null,
  initialLoadingDelay = CONSTANTS.LOADING_TIMEOUT 
}) => {
  const { theme } = useTheme();
  const { isLoading } = useLoadingState(initialLoadingDelay);
  const { navigate, isNavigating, navigationError, clearNavigationError } = useNavigation();
  const { progress, trackProgress } = useProgressTracking();
  const { error, handleError, clearError } = useErrorBoundary();
  
  // Refs for cleanup
  const mountedRef = useRef(true);
  
  // Theme configuration
  const themeConfig = useMemo(() => 
    THEME_CONFIG[theme] || THEME_CONFIG.light, [theme]
  );

  // Event handlers with error boundaries
  const handleFormSubmit = useCallback((e) => {
    e.preventDefault();
  }, []);

  const handlePreviousStep = useCallback(async () => {
    try {
      trackProgress('navigate_back');
      onNavigate?.('previous', CONSTANTS.ROUTES.PREVIOUS);
      await navigate(CONSTANTS.ROUTES.PREVIOUS);
    } catch (error) {
      handleError(error, 'previous_navigation');
    }
  }, [navigate, trackProgress, onNavigate, handleError]);

  const handleNextStep = useCallback(async () => {
    try {
      trackProgress('navigate_forward');
      onNavigate?.('next', CONSTANTS.ROUTES.NEXT);
      await navigate(CONSTANTS.ROUTES.NEXT);
    } catch (error) {
      handleError(error, 'next_navigation');
    }
  }, [navigate, trackProgress, onNavigate, handleError]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (event) => {
      if (!mountedRef.current) return;
      
      if (event.ctrlKey || event.metaKey) {
        switch (event.key) {
          case 'Enter':
            event.preventDefault();
            if (!isNavigating && !isLoading) {
              handleNextStep();
            }
            break;
          case 'Escape':
            event.preventDefault();
            if (!isNavigating && !isLoading) {
              handlePreviousStep();
            }
            break;
          default:
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleNextStep, handlePreviousStep, isNavigating, isLoading]);

  // Error handling for navigation errors
  useEffect(() => {
    if (navigationError) {
      handleError(new Error(navigationError), 'navigation');
    }
  }, [navigationError, handleError]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  // Clear errors when they're dismissed
  const handleErrorDismiss = useCallback(() => {
    clearError();
    clearNavigationError();
  }, [clearError, clearNavigationError]);

  // Render loading skeleton
  if (isLoading) {
    return <SkeletonForm theme={theme} />;
  }

  return (
    <div className={`w-full h-screen relative ${themeConfig.background} ${themeConfig.text} ${className}`}>
      {/* Header with step indicators - maintaining exact original layout */}
      <div className={`w-full relative top-0 left-[50%] translate-x-[-50%] border-b-[.1vw] border-zinc-300 p-[1.5vw] h-[6vh] flex justify-center items-center ${themeConfig.header} ${themeConfig.text}`}>
        <div className="w-[75%] h-full flex items-center justify-center gap-[1vw]">
          {/* Step 1 - Completed */}
          <StepIndicator
            stepNumber={1}
            label={CONSTANTS.STEPS.LABELS[1]}
            isCompleted={true}
            isCurrent={false}
            theme={theme}
          />

          <div className="h-[1px] w-[3vw] bg-zinc-300" />

          {/* Step 2 - Current */}
          <StepIndicator
            stepNumber={2}
            label={CONSTANTS.STEPS.LABELS[2]}
            isCompleted={false}
            isCurrent={true}
            theme={theme}
          />

          <div className="h-[1px] w-[3vw] bg-zinc-300" />

          {/* Step 3 - Pending */}
          <StepIndicator
            stepNumber={3}
            label={CONSTANTS.STEPS.LABELS[3]}
            isCompleted={false}
            isCurrent={false}
            theme={theme}
          />
        </div>
      </div>

      {/* Main content - CreateSource component */}
      <main role="main" className="flex-1">
        <CreateSource />
      </main>

      {/* Footer with navigation buttons - maintaining exact original layout */}
      <footer className={`w-full absolute bottom-0 h-[6.5vh] py-[2vw] ${themeConfig.footer} ${themeConfig.text}`}>
        <div className="w-full h-full flex justify-end items-center gap-[2vw] px-[3vw]">
          <OutlinedButton
            onClick={handlePreviousStep}
            disabled={isNavigating}
            className="border-2 border-[#8b8b8b] text-[#8b8b8b] hover:border-[#333333] hover:text-[#333333] py-[0.3vw] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Go to previous step"
          >
            {isNavigating ? "..." : "Back"}
          </OutlinedButton>
          
          <ContainedButton 
            onClick={handleNextStep}
            disabled={isNavigating}
            className="py-[0.35vw] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transform hover:scale-105"
            aria-label="Proceed to next step"
          >
            {isNavigating ? "Creating..." : "Create"}
          </ContainedButton>
        </div>
      </footer>

      {/* Error display */}
      <ErrorDisplay 
        error={error}
        onDismiss={handleErrorDismiss}
        theme={theme}
      />

      {/* Progress indicator (if needed) */}
      {progress && (
        <div className="fixed top-4 right-4 z-50">
          <div className={`px-4 py-2 rounded-lg shadow-lg ${themeConfig.header} ${themeConfig.text} border`}>
            <p className="text-sm font-medium">Processing...</p>
          </div>
        </div>
      )}
    </div>
  );
};

DataSource.propTypes = {
  className: PropTypes.string,
  onNavigate: PropTypes.func,
  initialLoadingDelay: PropTypes.number,
};

export default React.memo(DataSource);