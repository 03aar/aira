import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useOnboarding } from '../../../contexts/OnboardingContext';
import Button from '../../common/Button';

const GoalsStep: React.FC = () => {
  const { nextStep, addGoal, goals } = useOnboarding();
  const [selectedGoals, setSelectedGoals] = useState<string[]>(goals || []);

  const goalOptions = [
    'Architecture clarity',
    'Service dependencies',
    'System health',
    'Evolution and growth',
  ];

  const toggleGoal = (goal: string) => {
    if (selectedGoals.includes(goal)) {
      setSelectedGoals(selectedGoals.filter((g) => g !== goal));
    } else {
      setSelectedGoals([...selectedGoals, goal]);
      addGoal(goal);
    }
  };

  const handleContinue = () => {
    if (selectedGoals.length > 0) {
      nextStep();
    }
  };

  return (
    <div className="text-center max-w-2xl mx-auto">
      <h2 className="text-4xl font-bold text-aira-text-primary mb-3">
        What are you hoping to understand better?
      </h2>
      <p className="text-lg text-aira-text-secondary mb-12">
        Select all that apply
      </p>

      <div className="grid grid-cols-2 gap-4 mb-8">
        {goalOptions.map((goal, index) => {
          const isSelected = selectedGoals.includes(goal);

          return (
            <motion.button
              key={goal}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => toggleGoal(goal)}
              className={`
                p-6 rounded-2xl border-2 transition-all text-left
                ${isSelected
                  ? 'border-aira-purple bg-aira-purple/10 shadow-lg'
                  : 'border-gray-200 hover:border-aira-purple/50 bg-white'
                }
              `}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`
                    w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all
                    ${isSelected
                      ? 'border-aira-purple bg-aira-purple'
                      : 'border-gray-300'
                    }
                  `}
                >
                  {isSelected && (
                    <motion.svg
                      width="14"
                      height="11"
                      viewBox="0 0 14 11"
                      fill="none"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.2 }}
                    >
                      <path
                        d="M1 5.5L5 9.5L13 1.5"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </motion.svg>
                  )}
                </div>
                <span className="font-medium text-aira-text-primary">
                  {goal}
                </span>
              </div>
            </motion.button>
          );
        })}
      </div>

      <Button
        onClick={handleContinue}
        size="lg"
        disabled={selectedGoals.length === 0}
      >
        Continue
      </Button>
    </div>
  );
};

export default GoalsStep;
