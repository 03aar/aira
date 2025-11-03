import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useOnboarding } from '../../contexts/OnboardingContext';
import WelcomeStep from './steps/WelcomeStep';
import MapTargetStep from './steps/MapTargetStep';
import GoalsStep from './steps/GoalsStep';
import RoleStep from './steps/RoleStep';
import ConnectStep from './steps/ConnectStep';
import ThemeStep from './steps/ThemeStep';

const Onboarding: React.FC = () => {
  const { step } = useOnboarding();

  const steps = [
    <WelcomeStep key="welcome" />,
    <MapTargetStep key="map-target" />,
    <GoalsStep key="goals" />,
    <RoleStep key="role" />,
    <ConnectStep key="connect" />,
    <ThemeStep key="theme" />,
  ];

  return (
    <div className="fixed inset-0 bg-white z-40 overflow-hidden">
      {/* Dotted grid background */}
      <div className="absolute inset-0 aira-grid-bg opacity-30" />

      {/* Animated background gradient */}
      <motion.div
        className="absolute inset-0 opacity-20"
        style={{
          background: 'radial-gradient(circle at 50% 50%, rgba(155, 92, 255, 0.1) 0%, transparent 70%)',
        }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.1, 0.2, 0.1],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Content */}
      <div className="relative z-10 h-full flex items-center justify-center p-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
            className="w-full max-w-4xl"
          >
            {steps[step] || steps[0]}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Progress Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2">
        {steps.map((_, index) => (
          <motion.div
            key={index}
            className={`h-2 rounded-full transition-all ${
              index === step
                ? 'w-8 bg-aira-purple'
                : index < step
                ? 'w-2 bg-aira-purple/50'
                : 'w-2 bg-gray-300'
            }`}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: index * 0.05 }}
          />
        ))}
      </div>
    </div>
  );
};

export default Onboarding;
