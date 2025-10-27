import React, { useState } from 'react';
import { X, ChevronRight, ChevronLeft } from 'lucide-react';

const OnboardingGuide = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      title: 'Welcome to Weather Disaster Tracker',
      description: 'Your comprehensive tool for tracking natural disasters, staying safe, and reporting emergencies.',
      icon: '🌪️'
    },
    {
      title: 'Interactive Map',
      description: 'View real-time tracking of hurricanes and storms with live satellite imagery. See active storm pins with detailed information.',
      icon: '🗺️'
    },
    {
      title: 'Report Emergencies',
      description: 'Quickly report emergencies in your area. Your reports help authorities organize and respond to disasters effectively.',
      icon: '🚨'
    },
    {
      title: 'Analytics & Tracking',
      description: 'Access detailed analytics showing hurricane paths, wind speeds, and growth patterns over time.',
      icon: '📊'
    },
    {
      title: 'Bluetooth Communication',
      description: 'Connect with nearby devices using low-energy Bluetooth to share critical information when internet is unavailable.',
      icon: '📡'
    },
    {
      title: 'Emergency Contacts',
      description: 'Find regional emergency contacts quickly when you need them most.',
      icon: '📞'
    },
    {
      title: 'AI Assistant',
      description: 'Click the chat button (available on every page) to get disaster safety tips, evacuation guidance, and emergency preparedness advice.',
      icon: '🤖'
    }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    onComplete();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full p-8 relative">
        {/* Close button */}
        <button
          onClick={handleSkip}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X size={24} />
        </button>

        {/* Content */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">{steps[currentStep].icon}</div>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            {steps[currentStep].title}
          </h2>
          <p className="text-lg text-gray-600">
            {steps[currentStep].description}
          </p>
        </div>

        {/* Progress dots */}
        <div className="flex justify-center space-x-2 mb-8">
          {steps.map((_, index) => (
            <div
              key={index}
              className={`h-2 rounded-full transition-all ${
                index === currentStep
                  ? 'w-8 bg-primary'
                  : 'w-2 bg-gray-300'
              }`}
            />
          ))}
        </div>

        {/* Navigation buttons */}
        <div className="flex justify-between items-center">
          <button
            onClick={handlePrev}
            disabled={currentStep === 0}
            className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronLeft size={20} />
            <span>Previous</span>
          </button>

          <button
            onClick={handleSkip}
            className="text-gray-500 hover:text-gray-700"
          >
            Skip Tour
          </button>

          <button
            onClick={handleNext}
            className="flex items-center space-x-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            <span>{currentStep === steps.length - 1 ? 'Get Started' : 'Next'}</span>
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default OnboardingGuide;

