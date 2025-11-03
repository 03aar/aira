import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MousePointer, Layers, Lightbulb, MessageCircle, Share2 } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';

type Tool = 'pointer' | 'layers' | 'insights' | 'comments' | 'share';

interface ToolItem {
  id: Tool;
  icon: React.ComponentType<{ size?: number }>;
  label: string;
  action: () => void;
}

const LeftToolbar: React.FC = () => {
  const { toggleInsights, toggleComments } = useApp();
  const [activeTool, setActiveTool] = useState<Tool>('pointer');
  const [hoveredTool, setHoveredTool] = useState<Tool | null>(null);

  const tools: ToolItem[] = [
    {
      id: 'pointer',
      icon: MousePointer,
      label: 'Pointer / Move Tool',
      action: () => setActiveTool('pointer'),
    },
    {
      id: 'layers',
      icon: Layers,
      label: 'Layers Toggle',
      action: () => setActiveTool('layers'),
    },
    {
      id: 'insights',
      icon: Lightbulb,
      label: 'Insights View',
      action: () => {
        setActiveTool('insights');
        toggleInsights();
      },
    },
    {
      id: 'comments',
      icon: MessageCircle,
      label: 'Comments / Notes',
      action: () => {
        setActiveTool('comments');
        toggleComments();
      },
    },
    {
      id: 'share',
      icon: Share2,
      label: 'Share / Export',
      action: () => setActiveTool('share'),
    },
  ];

  return (
    <motion.div
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ delay: 0.2 }}
      className="fixed left-5 top-1/2 -translate-y-1/2 z-40"
    >
      <div className="flex flex-col gap-3 p-3 bg-white/80 backdrop-blur-md rounded-3xl shadow-lg border border-gray-100">
        {tools.map((tool, index) => {
          const Icon = tool.icon;
          const isActive = activeTool === tool.id;
          const isHovered = hoveredTool === tool.id;

          return (
            <div key={tool.id} className="relative">
              <motion.button
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={tool.action}
                onMouseEnter={() => setHoveredTool(tool.id)}
                onMouseLeave={() => setHoveredTool(null)}
                className={`
                  relative w-11 h-11 rounded-full flex items-center justify-center
                  transition-all duration-300
                  ${isActive
                    ? 'bg-gradient-purple text-white shadow-md'
                    : 'bg-white text-aira-text-secondary hover:text-aira-purple hover:bg-gray-50'
                  }
                `}
              >
                <Icon size={20} />

                {/* Active indicator ring */}
                {isActive && (
                  <motion.div
                    layoutId="activeToolRing"
                    className="absolute inset-0 rounded-full ring-2 ring-aira-purple ring-offset-2"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
              </motion.button>

              {/* Tooltip */}
              <AnimatePresence>
                {isHovered && (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.15 }}
                    className="absolute left-full ml-4 top-1/2 -translate-y-1/2 whitespace-nowrap"
                  >
                    <div className="px-3 py-2 bg-gray-900 text-white text-sm rounded-lg shadow-lg">
                      {tool.label}
                      <div className="absolute right-full top-1/2 -translate-y-1/2 -mr-1">
                        <div className="w-2 h-2 bg-gray-900 transform rotate-45" />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default LeftToolbar;
