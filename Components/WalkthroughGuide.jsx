import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ContainedButton } from './buttons/ContainedButton';
import { OutlinedButton } from './buttons/OutlinedButton';
import useTheme from 'next-theme';

const WalkthroughGuide = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const { theme } = useTheme();
  const router = useRouter();

  const steps = [
    {
      title: "Welcome to Workspace!",
      description: "A workspace is where you can create and manage your AI agents. Let's get you started!",
      position: "center"
    },
    {
      title: "Create Your First Workspace",
      description: "Click the '+' button to create your first workspace. This will be your main hub for managing agents.",
      position: "top-right"
    },
    {
      title: "Workspace Settings",
      description: "Each workspace has its own settings. You can access them by clicking the settings icon on any workspace card.",
      position: "bottom-left"
    },
    {
      title: "Ready to Create Agents!",
      description: "Once you create a workspace, you can start adding AI agents to it. Let's go create your first workspace!",
      position: "center"
    }
  ];

  const handleNext = () => {
    if (currentStep === steps.length - 1) {
      onComplete();
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleSkip = () => {
    onComplete();
  };

  const getPositionClasses = (position) => {
    switch (position) {
      case 'top-right':
        return 'top-[20vh] left-[37vw]';
      case 'bottom-left':
        return 'top-[45vh] left-[25vw]';
      case 'center':
        return 'top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2';
      default:
        return 'top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2';
    }
  };

  return (
    <div className="fixed inset-0 z-[1000]">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-50" />
      
      {/* Guide Card */}
      <div 
        className={`absolute ${getPositionClasses(steps[currentStep].position)} 
          ${theme === 'dark' ? 'bg-[#1F222A] text-white' : 'bg-white text-black'}
          p-6 rounded-lg shadow-xl max-w-md w-full`}
      >
        <h3 className="text-xl font-bold mb-3">{steps[currentStep].title}</h3>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          {steps[currentStep].description}
        </p>
        <div className="flex justify-between items-center">
          <OutlinedButton onClick={handleSkip}>Skip</OutlinedButton>
          <ContainedButton onClick={handleNext}>
            {currentStep === steps.length - 1 ? 'Get Started' : 'Next'}
          </ContainedButton>
        </div>
      </div>
    </div>
  );
};

export default WalkthroughGuide; 