import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Github, Cloud, FileText, Layers } from 'lucide-react';
import { useOnboarding } from '../../../contexts/OnboardingContext';
import Button from '../../common/Button';

const ConnectStep: React.FC = () => {
  const { nextStep, addConnectedSource, connectedSources } = useOnboarding();
  const [connected, setConnected] = useState<string[]>(connectedSources || []);

  const sources = [
    {
      id: 'github',
      icon: <Github size={32} />,
      title: 'GitHub',
      description: 'Connect your repositories',
    },
    {
      id: 'cloud',
      icon: <Cloud size={32} />,
      title: 'Cloud Provider',
      description: 'AWS, GCP, or Azure',
    },
    {
      id: 'api',
      icon: <FileText size={32} />,
      title: 'API Docs',
      description: 'OpenAPI, Swagger, etc.',
    },
    {
      id: 'sandbox',
      icon: <Layers size={32} />,
      title: 'Sandbox Mode',
      description: 'Try without connecting',
    },
  ];

  const handleConnect = (sourceId: string) => {
    if (!connected.includes(sourceId)) {
      setConnected([...connected, sourceId]);
      addConnectedSource(sourceId);
    }
  };

  const handleContinue = () => {
    if (connected.length > 0) {
      nextStep();
    }
  };

  return (
    <div className="text-center max-w-4xl mx-auto">
      <h2 className="text-4xl font-bold text-aira-text-primary mb-3">
        Let's start mapping
      </h2>
      <p className="text-lg text-aira-text-secondary mb-12">
        Connect what Aira should learn from
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {sources.map((source, index) => {
          const isConnected = connected.includes(source.id);

          return (
            <motion.div
              key={source.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <motion.button
                onClick={() => handleConnect(source.id)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`
                  w-full p-6 rounded-2xl border-2 transition-all text-left
                  ${isConnected
                    ? 'border-aira-cyan bg-cyan-50 shadow-lg'
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                  }
                `}
              >
                <div className="flex items-start gap-4">
                  <motion.div
                    className={`${isConnected ? 'text-aira-cyan' : 'text-aira-purple'}`}
                    animate={isConnected ? { scale: [1, 1.1, 1] } : {}}
                    transition={{ duration: 0.3 }}
                  >
                    {source.icon}
                  </motion.div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-aira-text-primary mb-1">
                      {source.title}
                    </h3>
                    <p className="text-sm text-aira-text-secondary">
                      {source.description}
                    </p>
                  </div>
                  {isConnected && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-6 h-6 rounded-full bg-aira-cyan text-white flex items-center justify-center"
                    >
                      ✓
                    </motion.div>
                  )}
                </div>
              </motion.button>
            </motion.div>
          );
        })}
      </div>

      <div className="flex items-center justify-center gap-4">
        <Button
          onClick={handleContinue}
          size="lg"
          disabled={connected.length === 0}
        >
          Continue
        </Button>
        <Button onClick={nextStep} variant="ghost" size="lg">
          I'll do this later
        </Button>
      </div>
    </div>
  );
};

export default ConnectStep;
