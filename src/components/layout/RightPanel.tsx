import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Activity, Clock, Users, TrendingUp } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import type { Node } from '../../types';

type TabType = 'overview' | 'connections' | 'performance' | 'timeline' | 'insights';

const RightPanel: React.FC = () => {
  const { selectedNode, selectNode, nodes } = useApp();
  const [activeTab, setActiveTab] = useState<TabType>('overview');

  const node = nodes.find((n) => n.id === selectedNode);
  const isOpen = selectedNode !== undefined && node !== undefined;

  const tabs: { id: TabType; label: string }[] = [
    { id: 'overview', label: 'Overview' },
    { id: 'connections', label: 'Connections' },
    { id: 'performance', label: 'Performance' },
    { id: 'timeline', label: 'Timeline' },
    { id: 'insights', label: 'AI Insights' },
  ];

  const getNodeColor = (type: Node['type']) => {
    const colors = {
      frontend: 'bg-aira-blue',
      backend: 'bg-aira-violet',
      data: 'bg-aira-yellow',
      ai: 'bg-aira-cyan',
      infrastructure: 'bg-gray-500',
      integration: 'bg-aira-coral',
    };
    return colors[type];
  };

  return (
    <AnimatePresence>
      {isOpen && node && (
        <motion.div
          initial={{ x: 380, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 380, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="fixed right-0 top-16 bottom-0 w-96 bg-white shadow-2xl z-40 border-l border-gray-100"
        >
          <div className="h-full flex flex-col">
            {/* Header */}
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-aira-text-primary mb-2">
                    {node.name}
                  </h2>
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium text-white ${getNodeColor(
                        node.type
                      )}`}
                    >
                      {node.type.charAt(0).toUpperCase() + node.type.slice(1)}
                    </span>
                    {node.status === 'healthy' && (
                      <div className="flex items-center gap-1 text-green-600">
                        <motion.div
                          className="w-2 h-2 rounded-full bg-green-600"
                          animate={{ scale: [1, 1.2, 1], opacity: [1, 0.7, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        />
                        <span className="text-xs font-medium">Active</span>
                      </div>
                    )}
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => selectNode(undefined)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X size={20} className="text-aira-text-secondary" />
                </motion.button>
              </div>

              {/* Tabs */}
              <div className="flex gap-1 overflow-x-auto pb-2 aira-scrollbar">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`
                      px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all
                      ${activeTab === tab.id
                        ? 'bg-aira-purple text-white'
                        : 'text-aira-text-secondary hover:bg-gray-100'
                      }
                    `}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 aira-scrollbar">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  {activeTab === 'overview' && (
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-sm font-semibold text-aira-text-secondary mb-2">
                          Description
                        </h3>
                        <p className="text-aira-text-primary">
                          {node.description || 'No description available'}
                        </p>
                      </div>

                      {node.owner && (
                        <div>
                          <h3 className="text-sm font-semibold text-aira-text-secondary mb-2">
                            Owner
                          </h3>
                          <div className="flex items-center gap-2">
                            <Users size={16} className="text-aira-text-secondary" />
                            <span className="text-aira-text-primary">{node.owner}</span>
                          </div>
                        </div>
                      )}

                      {node.lastUpdated && (
                        <div>
                          <h3 className="text-sm font-semibold text-aira-text-secondary mb-2">
                            Last Updated
                          </h3>
                          <div className="flex items-center gap-2">
                            <Clock size={16} className="text-aira-text-secondary" />
                            <span className="text-aira-text-primary">{node.lastUpdated}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {activeTab === 'connections' && (
                    <div className="space-y-3">
                      <h3 className="text-sm font-semibold text-aira-text-secondary mb-3">
                        Connected Services ({node.connections.length})
                      </h3>
                      {node.connections.map((connId) => {
                        const connectedNode = nodes.find((n) => n.id === connId);
                        return connectedNode ? (
                          <motion.div
                            key={connId}
                            whileHover={{ x: 4 }}
                            className="p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
                            onClick={() => selectNode(connId)}
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-medium text-aira-text-primary">
                                {connectedNode.name}
                              </span>
                              <span
                                className={`w-2 h-2 rounded-full ${getNodeColor(
                                  connectedNode.type
                                )}`}
                              />
                            </div>
                            <p className="text-xs text-aira-text-secondary mt-1">
                              {connectedNode.type}
                            </p>
                          </motion.div>
                        ) : null;
                      })}
                    </div>
                  )}

                  {activeTab === 'performance' && node.metrics && (
                    <div className="space-y-4">
                      <MetricCard
                        icon={<Activity size={20} />}
                        label="Latency"
                        value={`${node.metrics.latency}ms`}
                        trend="good"
                      />
                      <MetricCard
                        icon={<TrendingUp size={20} />}
                        label="Uptime"
                        value={`${node.metrics.uptime}%`}
                        trend="good"
                      />
                      <MetricCard
                        icon={<Activity size={20} />}
                        label="Activity"
                        value={`${node.metrics.activity}%`}
                        trend="normal"
                      />
                    </div>
                  )}

                  {activeTab === 'timeline' && (
                    <div className="space-y-3">
                      <p className="text-sm text-aira-text-secondary">
                        Historical changes and deployments will appear here.
                      </p>
                    </div>
                  )}

                  {activeTab === 'insights' && (
                    <div className="space-y-3">
                      <div className="p-4 bg-cyan-50 border border-cyan-200 rounded-lg">
                        <h4 className="font-semibold text-cyan-900 mb-2">
                          AI Recommendation
                        </h4>
                        <p className="text-sm text-cyan-800">
                          This service is performing well. Consider caching frequently accessed
                          data to improve response times.
                        </p>
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const MetricCard: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: string;
  trend: 'good' | 'warning' | 'normal';
}> = ({ icon, label, value, trend }) => {
  const trendColors = {
    good: 'text-green-600',
    warning: 'text-amber-600',
    normal: 'text-aira-text-secondary',
  };

  return (
    <div className="p-4 bg-gray-50 rounded-lg">
      <div className="flex items-center justify-between mb-2">
        <div className={`${trendColors[trend]}`}>{icon}</div>
        <span className="text-2xl font-bold text-aira-text-primary">{value}</span>
      </div>
      <p className="text-sm text-aira-text-secondary">{label}</p>
    </div>
  );
};

export default RightPanel;
