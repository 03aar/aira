import React from 'react';
import { motion } from 'framer-motion';
import { Globe, Network, Code } from 'lucide-react';
import { useOnboarding } from '../../../contexts/OnboardingContext';
import Card from '../../common/Card';

const MapTargetStep: React.FC = () => {
  const { nextStep, setMapTarget, mapTarget } = useOnboarding();

  const options = [
    {
      id: 'product' as const,
      icon: <Globe size={40} />,
      title: 'A Product',
      description: 'Map a single product or application',
    },
    {
      id: 'organization' as const,
      icon: <Network size={40} />,
      title: 'Your Organization',
      description: 'Visualize your entire digital ecosystem',
    },
    {
      id: 'codebase' as const,
      icon: <Code size={40} />,
      title: 'A Codebase / API',
      description: 'Explore a specific service or repository',
    },
  ];

  const handleSelect = (target: typeof options[0]['id']) => {
    setMapTarget(target);
    setTimeout(nextStep, 300);
  };

  return (
    <div className="text-center">
      <h2 className="text-4xl font-bold text-aira-text-primary mb-3">
        What do you want to map first?
      </h2>
      <p className="text-lg text-aira-text-secondary mb-12">
        Choose where your map begins
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {options.map((option, index) => (
          <motion.div
            key={option.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card
              hover
              selected={mapTarget === option.id}
              onClick={() => handleSelect(option.id)}
              className="p-8 h-full"
            >
              <motion.div
                className="text-aira-purple mb-4"
                whileHover={{ scale: 1.1, rotate: 5 }}
              >
                {option.icon}
              </motion.div>
              <h3 className="text-xl font-semibold text-aira-text-primary mb-2">
                {option.title}
              </h3>
              <p className="text-sm text-aira-text-secondary">
                {option.description}
              </p>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default MapTargetStep;
