import React from 'react';
import { motion } from 'framer-motion';
import { useOnboarding } from '../../../contexts/OnboardingContext';
import Button from '../../common/Button';

const WelcomeStep: React.FC = () => {
  const { nextStep, skipOnboarding } = useOnboarding();

  return (
    <div className="text-center">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        className="mb-8 inline-flex items-center justify-center"
      >
        <div className="w-20 h-20 rounded-full bg-gradient-purple flex items-center justify-center shadow-2xl">
          <motion.div
            className="w-8 h-8 rounded-full bg-white"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [1, 0.8, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        </div>
      </motion.div>

      <motion.h1
        className="text-5xl font-bold text-aira-text-primary mb-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        Welcome to Aira.
      </motion.h1>

      <motion.p
        className="text-xl text-aira-text-secondary mb-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        Let's discover how your world connects.
      </motion.p>

      <motion.div
        className="flex items-center justify-center gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Button onClick={nextStep} size="lg">
          Begin Setup
        </Button>
        <Button onClick={skipOnboarding} variant="ghost" size="lg">
          Skip Setup → Sandbox Mode
        </Button>
      </motion.div>

      {/* Floating particles animation */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-aira-purple/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [-20, -100],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default WelcomeStep;
