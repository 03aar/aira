import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../../contexts/AppContext';
import type { Node as NodeType } from '../../types';

interface NodeProps {
  node: NodeType;
  index: number;
}

const NodeRefined: React.FC<NodeProps> = ({ node, index }) => {
  const { selectedNode, selectNode } = useApp();
  const [isHovered, setIsHovered] = useState(false);

  const isSelected = selectedNode === node.id;

  const getNodeStyle = (type: NodeType['type'], _status: NodeType['status']) => {
    const styles = {
      frontend: {
        bg: 'from-[#5B9EFF] to-[#4B8EEF]',
        shadow: 'rgba(91, 158, 255, 0.4)',
        ring: 'ring-[#5B9EFF]',
      },
      backend: {
        bg: 'from-[#9B7AFF] to-[#8B6AEF]',
        shadow: 'rgba(155, 122, 255, 0.4)',
        ring: 'ring-[#9B7AFF]',
      },
      data: {
        bg: 'from-[#FFD66B] to-[#FFC55B]',
        shadow: 'rgba(255, 214, 107, 0.4)',
        ring: 'ring-[#FFD66B]',
      },
      ai: {
        bg: 'from-[#5BE5EA] to-[#4BD5DA]',
        shadow: 'rgba(91, 229, 234, 0.4)',
        ring: 'ring-[#5BE5EA]',
      },
      infrastructure: {
        bg: 'from-gray-400 to-gray-500',
        shadow: 'rgba(156, 163, 175, 0.4)',
        ring: 'ring-gray-400',
      },
      integration: {
        bg: 'from-[#FF6B7A] to-[#FF5B6A]',
        shadow: 'rgba(255, 107, 122, 0.4)',
        ring: 'ring-[#FF6B7A]',
      },
    };

    return styles[type];
  };

  const getStatusDot = (status: NodeType['status']) => {
    const dots = {
      healthy: 'bg-green-500',
      warning: 'bg-yellow-500',
      error: 'bg-red-500',
      inactive: 'bg-gray-400',
      deploying: 'bg-blue-500',
    };
    return dots[status];
  };

  const nodeStyle = getNodeStyle(node.type, node.status);
  const healthPercentage = node.metrics?.uptime || 95;

  // Calculate position with offset
  const posX = node.x + window.innerWidth / 2 - 50;
  const posY = node.y + window.innerHeight / 2 + 100; // +100 to account for floating search

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
      {/* Main Node Container */}
      <motion.div
        className="relative"
        animate={{
          scale: isHovered ? 1.08 : isSelected ? 1.1 : 1,
        }}
        transition={{ duration: 0.2 }}
      >
        {/* Node Card with Glassmorphism */}
        <div
          className={`
            relative w-32 h-32 rounded-2xl
            bg-gradient-to-br ${nodeStyle.bg}
            backdrop-blur-md
            flex flex-col items-center justify-center
            transition-all duration-300
          `}
          style={{
            boxShadow: isHovered || isSelected
              ? `0 12px 48px ${nodeStyle.shadow}`
              : `0 8px 32px rgba(0,0,0,0.12)`,
          }}
        >
          {/* Glassmorphism overlay */}
          <div className="absolute inset-0 bg-white/10 rounded-2xl backdrop-blur-sm" />

          {/* Content */}
          <div className="relative z-10 flex flex-col items-center gap-1 px-3 text-center">
            {/* Service Name */}
            <p className="text-sm font-medium text-white/90 line-clamp-2">
              {node.name}
            </p>

            {/* Health Percentage */}
            <p className="text-2xl font-bold text-white">
              {Math.round(healthPercentage)}%
            </p>
          </div>

          {/* Status Indicator Dot */}
          <motion.div
            className={`
              absolute -bottom-2 left-1/2 -translate-x-1/2
              w-3 h-3 rounded-full ${getStatusDot(node.status)}
              border-2 border-white shadow-md
            `}
            animate={{
              scale: node.status === 'deploying' ? [1, 1.3, 1] : [1, 1.2, 1],
              opacity: [1, 0.7, 1],
            }}
            transition={{
              duration: node.status === 'deploying' ? 0.8 : 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />

          {/* Selection Ring */}
          {isSelected && (
            <motion.div
              layoutId="selectedNodeRing"
              className={`absolute inset-0 rounded-2xl ring-4 ${nodeStyle.ring} ring-offset-4 ring-offset-white`}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            />
          )}

          {/* Glow effect on hover */}
          {(isHovered || isSelected) && (
            <motion.div
              className="absolute inset-0 rounded-2xl"
              animate={{
                boxShadow: [
                  `0 0 20px ${nodeStyle.shadow}`,
                  `0 0 40px ${nodeStyle.shadow}`,
                  `0 0 20px ${nodeStyle.shadow}`,
                ],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          )}
        </div>

        {/* Idle pulse animation */}
        {!isHovered && !isSelected && (
          <motion.div
            className="absolute inset-0 rounded-2xl pointer-events-none"
            animate={{
              scale: [1, 1.02, 1],
              opacity: [0.5, 0.7, 0.5],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        )}
      </motion.div>

      {/* Hover Tooltip */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full mt-3 left-1/2 -translate-x-1/2 whitespace-nowrap z-50"
          >
            <div className="px-4 py-3 bg-gray-900 text-white text-sm rounded-xl shadow-2xl max-w-xs">
              <div className="font-semibold mb-1">{node.name}</div>
              {node.description && (
                <div className="text-xs text-gray-300 mb-2">
                  {node.description}
                </div>
              )}
              <div className="flex items-center gap-4 text-xs">
                {node.metrics?.latency && (
                  <span>Latency: {node.metrics.latency}ms</span>
                )}
                {node.metrics?.requestsPerMin && (
                  <span>RPS: {node.metrics.requestsPerMin}</span>
                )}
              </div>
              {/* Arrow pointer */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-[-1px]">
                <div className="w-2 h-2 bg-gray-900 transform rotate-45" />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default NodeRefined;
