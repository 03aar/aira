import React from 'react';
import { motion } from 'framer-motion';
import type { Connection as ConnectionType, Node } from '../../types';
import { useApp } from '../../contexts/AppContext';

interface ConnectionProps {
  connection: ConnectionType;
  sourceNode: Node;
  targetNode: Node;
}

const Connection: React.FC<ConnectionProps> = ({ connection, sourceNode, targetNode }) => {
  const { selectedNode } = useApp();

  // Calculate positions with canvas centering offset
  const offsetX = window.innerWidth / 2 - 50;
  const offsetY = window.innerHeight / 2 - 50;

  const startX = sourceNode.x + offsetX + 40; // +40 for half node width
  const startY = sourceNode.y + offsetY + 40;
  const endX = targetNode.x + offsetX + 40;
  const endY = targetNode.y + offsetY + 40;

  // Calculate control points for bezier curve
  const dx = endX - startX;
  const dy = endY - startY;
  const distance = Math.sqrt(dx * dx + dy * dy);

  // Control point offset based on distance
  const controlOffset = Math.min(distance * 0.3, 100);

  const control1X = startX + dx * 0.25;
  const control1Y = startY + dy * 0.25 - controlOffset;
  const control2X = startX + dx * 0.75;
  const control2Y = startY + dy * 0.75 + controlOffset;

  // Create bezier curve path
  const path = `M ${startX} ${startY} C ${control1X} ${control1Y}, ${control2X} ${control2Y}, ${endX} ${endY}`;

  // Determine if connection should be highlighted
  const isHighlighted =
    selectedNode === sourceNode.id ||
    selectedNode === targetNode.id;

  // Get connection color based on type
  const getConnectionColor = () => {
    if (connection.type === 'data') return '#9A7AFF';
    if (connection.type === 'api') return '#4B9EFF';
    return '#42F0F5';
  };

  const color = getConnectionColor();

  return (
    <g>
      {/* Main connection line */}
      <motion.path
        d={path}
        fill="none"
        stroke={color}
        strokeWidth={isHighlighted ? 3 : 2}
        strokeOpacity={isHighlighted ? 0.8 : 0.4}
        strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{
          pathLength: 1,
          opacity: 1,
          strokeWidth: isHighlighted ? 3 : 2,
          strokeOpacity: isHighlighted ? 0.8 : 0.4,
        }}
        transition={{ duration: 1, ease: 'easeInOut' }}
      />

      {/* Animated particle flow effect when highlighted */}
      {isHighlighted && connection.active && (
        <>
          <motion.circle
            r="4"
            fill={color}
            initial={{ offsetDistance: '0%', opacity: 0 }}
            animate={{
              offsetDistance: '100%',
              opacity: [0, 1, 1, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'linear',
            }}
            style={{
              offsetPath: `path('${path}')`,
            }}
          >
            <animateMotion
              dur="2s"
              repeatCount="indefinite"
              path={path}
            />
          </motion.circle>

          {/* Second particle with delay */}
          <motion.circle
            r="3"
            fill={color}
            initial={{ offsetDistance: '0%', opacity: 0 }}
            animate={{
              offsetDistance: '100%',
              opacity: [0, 1, 1, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'linear',
              delay: 0.5,
            }}
          >
            <animateMotion
              dur="2s"
              repeatCount="indefinite"
              path={path}
              begin="0.5s"
            />
          </motion.circle>
        </>
      )}

      {/* Glow effect for highlighted connections */}
      {isHighlighted && (
        <motion.path
          d={path}
          fill="none"
          stroke={color}
          strokeWidth={8}
          strokeOpacity={0.2}
          strokeLinecap="round"
          filter="blur(4px)"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        />
      )}
    </g>
  );
};

export default Connection;
