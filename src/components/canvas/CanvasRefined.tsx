import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../../contexts/AppContext';
import NodeRefined from './NodeRefined';
import Connection from './Connection';
import FloatingSearch from './FloatingSearch';

const CanvasRefined: React.FC = () => {
  const { nodes, connections, showGrid, zoomLevel } = useApp();
  const canvasRef = useRef<HTMLDivElement>(null);

  const scale = zoomLevel / 100;

  return (
    <div className="fixed inset-0 overflow-hidden bg-white">
      {/* Floating Search Bar */}
      <FloatingSearch />

      {/* Grid Background */}
      {showGrid && (
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: 'radial-gradient(circle, #E2E8F0 2px, transparent 2px)',
            backgroundSize: `${40 * scale}px ${40 * scale}px`,
          }}
        />
      )}

      {/* Gradient Background (subtle) */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          background: 'radial-gradient(circle at 50% 50%, rgba(240, 244, 255, 0.5) 0%, transparent 70%)',
        }}
      />

      {/* Canvas Container */}
      <motion.div
        ref={canvasRef}
        className="absolute inset-0"
        style={{
          transform: `scale(${scale})`,
          transformOrigin: 'center center',
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* SVG for Connections */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          <defs>
            {/* Gradients for different connection types */}
            <linearGradient id="connection-gradient-api" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#4B9EFF" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#6E83F7" stopOpacity="0.8" />
            </linearGradient>
            <linearGradient id="connection-gradient-data" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#9A7AFF" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#9B5CFF" stopOpacity="0.8" />
            </linearGradient>
            <linearGradient id="connection-gradient-event" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#42F0F5" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#5BE5EA" stopOpacity="0.8" />
            </linearGradient>
          </defs>

          {/* Render Connections */}
          {connections.map((connection) => {
            const sourceNode = nodes.find((n) => n.id === connection.source);
            const targetNode = nodes.find((n) => n.id === connection.target);

            if (!sourceNode || !targetNode) return null;

            return (
              <Connection
                key={connection.id}
                connection={connection}
                sourceNode={sourceNode}
                targetNode={targetNode}
              />
            );
          })}
        </svg>

        {/* Nodes Layer */}
        <div className="relative w-full h-full">
          {nodes.map((node, index) => (
            <NodeRefined
              key={node.id}
              node={node}
              index={index}
            />
          ))}
        </div>
      </motion.div>

      {/* Breathing vignette effect */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at center, transparent 40%, rgba(255, 255, 255, 0.2) 100%)',
        }}
        animate={{
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
    </div>
  );
};

export default CanvasRefined;
