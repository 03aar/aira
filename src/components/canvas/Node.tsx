import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../../contexts/AppContext';
import type { Node as NodeType } from '../../types';

interface NodeProps {
  node: NodeType;
  index: number;
}

const Node: React.FC<NodeProps> = ({ node, index }) => {
  const { selectedNode, selectNode } = useApp();
  const [isHovered, setIsHovered] = useState(false);

  const isSelected = selectedNode === node.id;

  const getNodeColor = (type: NodeType['type']) => {
    const colors = {
      frontend: {
        bg: 'from-blue-400 to-blue-500',
        shadow: 'rgba(75, 158, 255, 0.4)',
        ring: 'ring-blue-400',
      },
      backend: {
        bg: 'from-violet-400 to-violet-500',
        shadow: 'rgba(154, 122, 255, 0.4)',
        ring: 'ring-violet-400',
      },
      data: {
        bg: 'from-yellow-400 to-yellow-500',
        shadow: 'rgba(248, 214, 110, 0.4)',
        ring: 'ring-yellow-400',
      },
      ai: {
        bg: 'from-cyan-400 to-cyan-500',
        shadow: 'rgba(66, 240, 245, 0.4)',
        ring: 'ring-cyan-400',
      },
      infrastructure: {
        bg: 'from-gray-400 to-gray-500',
        shadow: 'rgba(156, 163, 175, 0.4)',
        ring: 'ring-gray-400',
      },
      integration: {
        bg: 'from-red-400 to-red-500',
        shadow: 'rgba(255, 90, 100, 0.4)',
        ring: 'ring-red-400',
      },
    };
    return colors[type];
  };

  const nodeColor = getNodeColor(node.type);

  // Calculate position with some offset to center the canvas view
  const posX = node.x + window.innerWidth / 2 - 50;
  const posY = node.y + window.innerHeight / 2 - 50;

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{
        delay: index * 0.1,
        type: 'spring',
        stiffness: 200,
        damping: 20,
      }}
      style={{
        position: 'absolute',
        left: posX,
        top: posY,
      }}
      className="cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => selectNode(node.id)}
    >
      {/* Node Circle */}
      <motion.div
        className={`
          relative w-20 h-20 rounded-full
          bg-gradient-to-br ${nodeColor.bg}
          flex items-center justify-center
          transition-all duration-300
        `}
        animate={{
          scale: isHovered ? 1.1 : isSelected ? 1.15 : 1,
          boxShadow: isHovered || isSelected
            ? `0 0 30px ${nodeColor.shadow}`
            : `0 0 15px ${nodeColor.shadow}`,
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        {/* Inner pulse animation */}
        {node.status === 'healthy' && (
          <motion.div
            className={`absolute inset-0 rounded-full bg-white`}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0, 0.3],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        )}

        {/* Node Icon/Initial */}
        <span className="relative z-10 text-white font-bold text-lg">
          {node.name.substring(0, 2).toUpperCase()}
        </span>

        {/* Selection Ring */}
        {isSelected && (
          <motion.div
            layoutId="selectedNodeRing"
            className={`absolute inset-0 rounded-full ring-4 ${nodeColor.ring} ring-offset-4 ring-offset-white`}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          />
        )}

        {/* Glow ring animation */}
        <motion.div
          className="absolute inset-0 rounded-full"
          animate={{
            boxShadow: [
              `0 0 5px ${nodeColor.shadow}`,
              `0 0 20px ${nodeColor.shadow}`,
              `0 0 5px ${nodeColor.shadow}`,
            ],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </motion.div>

      {/* Node Label & Tooltip */}
      <AnimatePresence>
        {(isHovered || isSelected) && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full mt-3 left-1/2 -translate-x-1/2 whitespace-nowrap"
          >
            <div className="px-4 py-2 bg-gray-900 text-white text-sm rounded-lg shadow-xl">
              <div className="font-semibold">{node.name}</div>
              {node.description && (
                <div className="text-xs text-gray-300 mt-1 max-w-xs">
                  {node.description}
                </div>
              )}
              {/* Arrow pointer */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-[-1px]">
                <div className="w-2 h-2 bg-gray-900 transform rotate-45" />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Activity indicator */}
      {node.status === 'healthy' && (
        <motion.div
          className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white shadow-md"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [1, 0.7, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      )}
    </motion.div>
  );
};

export default Node;
