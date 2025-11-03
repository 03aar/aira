import React from 'react';
import { motion } from 'framer-motion';
import { Briefcase, Code, Boxes, Clipboard, Palette } from 'lucide-react';
import { useOnboarding } from '../../../contexts/OnboardingContext';
import type { User } from '../../../types';
import Card from '../../common/Card';

const RoleStep: React.FC = () => {
  const { nextStep, setUserRole, userRole } = useOnboarding();

  const roles: Array<{
    id: User['role'];
    icon: React.ReactNode;
    title: string;
    description: string;
  }> = [
    {
      id: 'founder',
      icon: <Briefcase size={36} />,
      title: 'Founder / CEO',
      description: 'High-level system overview',
    },
    {
      id: 'engineer',
      icon: <Code size={36} />,
      title: 'Engineer',
      description: 'Deep technical details',
    },
    {
      id: 'architect',
      icon: <Boxes size={36} />,
      title: 'Architect',
      description: 'System design and patterns',
    },
    {
      id: 'product',
      icon: <Clipboard size={36} />,
      title: 'Product Manager',
      description: 'Feature connections',
    },
    {
      id: 'designer',
      icon: <Palette size={36} />,
      title: 'Designer',
      description: 'User flows and interfaces',
    },
  ];

  const handleSelect = (role: User['role']) => {
    setUserRole(role);
    setTimeout(nextStep, 300);
  };

  return (
    <div className="text-center">
      <h2 className="text-4xl font-bold text-aira-text-primary mb-3">
        What's your role?
      </h2>
      <p className="text-lg text-aira-text-secondary mb-12">
        So I can tailor your view
      </p>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 max-w-6xl mx-auto">
        {roles.map((role, index) => (
          <motion.div
            key={role.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card
              hover
              selected={userRole === role.id}
              onClick={() => handleSelect(role.id)}
              className="p-6 h-full"
            >
              <motion.div
                className="text-aira-purple mb-3"
                whileHover={{ scale: 1.1, rotate: 5 }}
              >
                {role.icon}
              </motion.div>
              <h3 className="text-base font-semibold text-aira-text-primary mb-1">
                {role.title}
              </h3>
              <p className="text-xs text-aira-text-secondary">
                {role.description}
              </p>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default RoleStep;
