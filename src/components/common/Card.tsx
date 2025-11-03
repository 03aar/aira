import React from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
  selected?: boolean;
}

const Card: React.FC<CardProps> = ({
  children,
  className = '',
  hover = false,
  onClick,
  selected = false,
}) => {
  const baseStyles = 'bg-white rounded-2xl shadow-sm border transition-all duration-300';
  const hoverStyles = hover ? 'cursor-pointer hover:shadow-md hover:-translate-y-1' : '';
  const selectedStyles = selected ? 'ring-2 ring-aira-purple shadow-lg' : 'border-gray-100';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`${baseStyles} ${hoverStyles} ${selectedStyles} ${className}`}
      onClick={onClick}
      whileHover={hover ? { scale: 1.02 } : {}}
    >
      {children}
    </motion.div>
  );
};

export default Card;
