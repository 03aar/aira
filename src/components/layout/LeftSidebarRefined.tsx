import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Layers, Lightbulb, MessageCircle, Smartphone } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';

type ToolId = 'home' | 'layers' | 'insights' | 'comments' | 'connections';

interface Tool {
  id: ToolId;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string;
  badge?: number | boolean;
  badgeColor?: string;
}

const LeftSidebarRefined: React.FC = () => {
  const { toggleInsights, showInsights } = useApp();
  const [activeTool, setActiveTool] = useState<ToolId>('home');
  const [hoveredTool, setHoveredTool] = useState<ToolId | null>(null);

  const tools: Tool[] = [
    {
      id: 'home',
      icon: Home,
      label: 'Home / Dashboard',
    },
    {
      id: 'layers',
      icon: Layers,
      label: 'Layers / Views',
    },
    {
      id: 'insights',
      icon: Lightbulb,
      label: 'AI Insights',
      badge: 3, // Number of critical insights
      badgeColor: 'bg-red-500',
    },
    {
      id: 'comments',
      icon: MessageCircle,
      label: 'Comments',
      badge: 5, // Number of unread comments
      badgeColor: 'bg-blue-500',
    },
    {
      id: 'connections',
      icon: Smartphone,
      label: 'Integrations / Connections',
      badge: true, // Green dot if syncing
      badgeColor: 'bg-green-500',
    },
  ];

  const handleToolClick = (toolId: ToolId) => {
    setActiveTool(toolId);
    if (toolId === 'insights') {
      toggleInsights();
    }
  };

  return (
    <motion.div
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ delay: 0.2 }}
      className="fixed left-5 top-1/2 -translate-y-1/2 z-40"
    >
      <div className="flex flex-col gap-2 p-2 bg-white/90 backdrop-blur-md rounded-2xl shadow-lg border border-gray-100">
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
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleToolClick(tool.id)}
                onMouseEnter={() => setHoveredTool(tool.id)}
                onMouseLeave={() => setHoveredTool(null)}
                className={`
                  relative w-12 h-12 rounded-xl flex items-center justify-center
                  transition-all duration-200
                  ${isActive
                    ? 'bg-aira-blue text-white shadow-md'
                    : 'bg-transparent text-gray-500 hover:bg-gray-50 hover:text-aira-purple'
                  }
                `}
              >
                <Icon size={24} className={isActive ? '' : 'stroke-[1.5]'} />

                {/* Badge */}
                {tool.badge && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className={`
                      absolute -top-1 -right-1 min-w-[18px] h-[18px] ${tool.badgeColor}
                      rounded-full flex items-center justify-center
                      text-[10px] font-bold text-white shadow-md
                    `}
                  >
                    {typeof tool.badge === 'number' ? tool.badge : null}
                  </motion.div>
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
                    className="absolute left-full ml-4 top-1/2 -translate-y-1/2 whitespace-nowrap pointer-events-none"
                  >
                    <div className="px-3 py-2 bg-gray-900 text-white text-sm rounded-lg shadow-xl">
                      {tool.label}
                      <div className="absolute right-full top-1/2 -translate-y-1/2 mr-[-1px]">
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

export default LeftSidebarRefined;
