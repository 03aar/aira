import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertCircle, AlertTriangle, Info } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import type { Insight } from '../../types';

const InsightsPanel: React.FC = () => {
  const { showInsights, toggleInsights, insights, selectNode } = useApp();

  const getSeverityConfig = (severity: Insight['severity']) => {
    const configs = {
      critical: {
        bg: 'bg-red-50',
        border: 'border-red-200',
        text: 'text-red-900',
        icon: <AlertCircle size={20} className="text-red-600" />,
        badge: 'bg-red-600',
      },
      warning: {
        bg: 'bg-amber-50',
        border: 'border-amber-200',
        text: 'text-amber-900',
        icon: <AlertTriangle size={20} className="text-amber-600" />,
        badge: 'bg-amber-600',
      },
      suggestion: {
        bg: 'bg-cyan-50',
        border: 'border-cyan-200',
        text: 'text-cyan-900',
        icon: <Info size={20} className="text-cyan-600" />,
        badge: 'bg-cyan-600',
      },
      discovery: {
        bg: 'bg-purple-50',
        border: 'border-purple-200',
        text: 'text-purple-900',
        icon: <Info size={20} className="text-purple-600" />,
        badge: 'bg-purple-600',
      },
    };
    return configs[severity];
  };

  return (
    <AnimatePresence>
      {showInsights && (
        <motion.div
          initial={{ x: 500, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 500, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="fixed right-0 top-16 bottom-20 w-96 bg-white shadow-2xl z-50 border-l border-gray-100"
        >
          <div className="h-full flex flex-col">
            {/* Header */}
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-aira-text-primary">
                    AI Insights
                  </h2>
                  <p className="text-sm text-aira-text-secondary mt-1">
                    {insights.length} insights detected
                  </p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={toggleInsights}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X size={20} className="text-aira-text-secondary" />
                </motion.button>
              </div>
            </div>

            {/* Insights List */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 aira-scrollbar">
              {insights.map((insight, index) => {
                const config = getSeverityConfig(insight.severity);

                return (
                  <motion.div
                    key={insight.id}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div
                      className={`
                        p-4 rounded-xl border-2 ${config.border} ${config.bg}
                        transition-all hover:shadow-md
                      `}
                    >
                      {/* Severity badge */}
                      <div className="flex items-start gap-3 mb-3">
                        {config.icon}
                        <div className="flex-1">
                          <h3 className={`font-semibold ${config.text} mb-1`}>
                            {insight.title}
                          </h3>
                          <p className="text-sm text-gray-700">
                            {insight.description}
                          </p>
                        </div>
                        <div
                          className={`
                            w-3 h-3 rounded-full ${config.badge}
                            animate-pulse
                          `}
                        />
                      </div>

                      {/* Action button */}
                      {insight.nodeId && (
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => {
                            selectNode(insight.nodeId);
                            toggleInsights();
                          }}
                          className={`
                            w-full mt-3 px-4 py-2 rounded-lg
                            text-sm font-medium transition-colors
                            ${insight.severity === 'critical'
                              ? 'bg-red-600 hover:bg-red-700 text-white'
                              : insight.severity === 'warning'
                              ? 'bg-amber-600 hover:bg-amber-700 text-white'
                              : 'bg-cyan-600 hover:bg-cyan-700 text-white'
                            }
                          `}
                        >
                          View on Map
                        </motion.button>
                      )}

                      {/* Smart actions */}
                      {insight.action && (
                        <div className="mt-3 pt-3 border-t border-gray-200">
                          <p className="text-xs text-gray-600 mb-2">
                            Smart Actions
                          </p>
                          <div className="flex gap-2">
                            <button className="text-xs px-3 py-1 rounded-md bg-white border border-gray-300 hover:border-gray-400 transition-colors">
                              Simulate Fix
                            </button>
                            <button className="text-xs px-3 py-1 rounded-md bg-white border border-gray-300 hover:border-gray-400 transition-colors">
                              Generate Explanation
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Timestamp */}
                      <p className="text-xs text-gray-500 mt-3">
                        {new Date(insight.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </motion.div>
                );
              })}

              {insights.length === 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-12"
                >
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                    <Info size={32} className="text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-aira-text-primary mb-2">
                    No insights yet
                  </h3>
                  <p className="text-sm text-aira-text-secondary">
                    Aira is still learning your world
                  </p>
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default InsightsPanel;
