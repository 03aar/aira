import React from 'react';
import { motion } from 'framer-motion';
import { useOnboarding } from '../../../contexts/OnboardingContext';
import { useApp } from '../../../contexts/AppContext';
import type { Theme } from '../../../types';

const ThemeStep: React.FC = () => {
  const { completeOnboarding, setSelectedTheme, selectedTheme } = useOnboarding();
  const { setTheme } = useApp();

  const themes: Array<{
    id: Theme;
    name: string;
    description: string;
    preview: string;
    colors: { bg: string; nodes: string[]; lines: string };
  }> = [
    {
      id: 'light',
      name: 'Light Flow',
      description: 'Pure white, subtle blue-gray connections',
      preview: 'Clean and minimal',
      colors: {
        bg: 'bg-white',
        nodes: ['bg-blue-400', 'bg-violet-400', 'bg-cyan-400'],
        lines: 'border-gray-300',
      },
    },
    {
      id: 'dark',
      name: 'Dark Pulse',
      description: 'Deep graphite, glowing lines',
      preview: 'Bold and immersive',
      colors: {
        bg: 'bg-gray-900',
        nodes: ['bg-blue-500', 'bg-violet-500', 'bg-cyan-500'],
        lines: 'border-violet-500',
      },
    },
    {
      id: 'focus',
      name: 'Focus Mode',
      description: 'Monochrome minimalism',
      preview: 'Distraction-free',
      colors: {
        bg: 'bg-gray-50',
        nodes: ['bg-gray-400', 'bg-gray-500', 'bg-gray-600'],
        lines: 'border-gray-400',
      },
    },
  ];

  const handleSelectTheme = (themeId: Theme) => {
    setSelectedTheme(themeId);
    setTheme(themeId);
    setTimeout(() => {
      completeOnboarding();
    }, 500);
  };

  return (
    <div className="text-center">
      <h2 className="text-4xl font-bold text-aira-text-primary mb-3">
        Choose your aesthetic
      </h2>
      <p className="text-lg text-aira-text-secondary mb-12">
        How do you want your world to look?
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {themes.map((theme, index) => {
          const isSelected = selectedTheme === theme.id;

          return (
            <motion.div
              key={theme.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <motion.button
                onClick={() => handleSelectTheme(theme.id)}
                whileHover={{ scale: 1.02, y: -4 }}
                whileTap={{ scale: 0.98 }}
                className={`
                  w-full p-6 rounded-2xl border-2 transition-all text-left
                  ${isSelected
                    ? 'border-aira-purple shadow-2xl ring-2 ring-aira-purple/20'
                    : 'border-gray-200 hover:border-aira-purple/50 bg-white'
                  }
                `}
              >
                {/* Theme Preview */}
                <div
                  className={`
                    h-48 rounded-xl mb-4 p-4 ${theme.colors.bg}
                    flex items-center justify-center relative overflow-hidden
                  `}
                >
                  {/* Preview nodes */}
                  <div className="relative w-full h-full">
                    {theme.colors.nodes.map((nodeColor, i) => (
                      <motion.div
                        key={i}
                        className={`absolute w-12 h-12 rounded-full ${nodeColor} shadow-lg`}
                        style={{
                          left: `${20 + i * 30}%`,
                          top: `${30 + (i % 2) * 30}%`,
                        }}
                        animate={{
                          scale: [1, 1.1, 1],
                          opacity: [0.8, 1, 0.8],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          delay: i * 0.3,
                        }}
                      />
                    ))}

                    {/* Preview connection lines */}
                    <svg className="absolute inset-0 w-full h-full">
                      <line
                        x1="25%"
                        y1="40%"
                        x2="55%"
                        y2="40%"
                        className={theme.colors.lines}
                        strokeWidth="2"
                        stroke="currentColor"
                        opacity="0.4"
                      />
                      <line
                        x1="55%"
                        y1="40%"
                        x2="85%"
                        y2="70%"
                        className={theme.colors.lines}
                        strokeWidth="2"
                        stroke="currentColor"
                        opacity="0.4"
                      />
                    </svg>
                  </div>

                  {/* Selected indicator */}
                  {isSelected && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute top-3 right-3 w-8 h-8 rounded-full bg-aira-purple text-white flex items-center justify-center shadow-lg"
                    >
                      ✓
                    </motion.div>
                  )}
                </div>

                {/* Theme info */}
                <h3 className="text-xl font-semibold text-aira-text-primary mb-2">
                  {theme.name}
                </h3>
                <p className="text-sm text-aira-text-secondary mb-1">
                  {theme.description}
                </p>
                <p className="text-xs text-aira-purple font-medium">
                  {theme.preview}
                </p>
              </motion.button>
            </motion.div>
          );
        })}
      </div>

      {selectedTheme && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8"
        >
          <p className="text-sm text-aira-text-secondary">
            You can change this anytime in settings
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default ThemeStep;
