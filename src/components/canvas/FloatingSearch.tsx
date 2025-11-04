import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Sparkles } from 'lucide-react';

const FloatingSearch: React.FC = () => {
  const [isFocused, setIsFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  const placeholders = [
    'Ask Aira anything about your system...',
    'Search services, APIs, databases...',
    'Try: Show me all authentication services',
    'Try: Why is payment-service slow?',
  ];

  const [currentPlaceholder, setCurrentPlaceholder] = useState(0);

  // Rotate placeholder every 3 seconds
  React.useEffect(() => {
    if (!isFocused && searchQuery === '') {
      const interval = setInterval(() => {
        setCurrentPlaceholder((prev) => (prev + 1) % placeholders.length);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [isFocused, searchQuery]);

  const handleFocus = () => {
    setIsFocused(true);
    setShowSuggestions(true);
  };

  const handleBlur = () => {
    setTimeout(() => {
      setIsFocused(false);
      setShowSuggestions(false);
    }, 200);
  };

  const suggestions = [
    'Show me payment-service dependencies',
    'Why is payment-service slow?',
    'Payment-service health metrics',
  ];

  const nodes = [
    { name: 'Payment Service', health: 78 },
    { name: 'Payment Gateway', health: 89 },
  ];

  return (
    <div className="fixed top-24 left-1/2 -translate-x-1/2 z-40 w-full max-w-2xl px-4">
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
        className="relative"
      >
        {/* Main Search Input */}
        <motion.div
          animate={{
            scale: isFocused ? 1.02 : 1,
            boxShadow: isFocused
              ? '0 4px 24px rgba(155,122,255,0.2)'
              : '0 4px 20px rgba(0,0,0,0.08)',
          }}
          transition={{ duration: 0.2 }}
          className={`
            relative bg-white/80 backdrop-blur-md rounded-xl
            border-2 transition-all duration-200
            ${isFocused
              ? 'border-aira-purple bg-white'
              : 'border-transparent hover:border-gray-200'
            }
          `}
        >
          <div className="flex items-center px-6 py-4">
            {/* Search Icon */}
            <Search
              className={`mr-4 transition-colors ${
                isFocused ? 'text-aira-purple' : 'text-gray-400'
              }`}
              size={20}
            />

            {/* Input */}
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={handleFocus}
              onBlur={handleBlur}
              placeholder={placeholders[currentPlaceholder]}
              className="flex-1 bg-transparent outline-none text-base text-gray-800 placeholder-gray-400"
            />

            {/* AI Sparkle Icon */}
            <motion.div
              animate={{
                scale: isFocused ? [1, 1.2, 1] : 1,
                rotate: isFocused ? [0, 10, -10, 0] : 0,
              }}
              transition={{
                duration: 2,
                repeat: isFocused ? Infinity : 0,
              }}
            >
              <Sparkles
                className={`ml-4 ${
                  isFocused ? 'text-aira-purple' : 'text-gray-300'
                }`}
                size={20}
              />
            </motion.div>
          </div>
        </motion.div>

        {/* Suggestions Dropdown */}
        <AnimatePresence>
          {showSuggestions && searchQuery.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute top-full mt-2 left-0 right-0 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden"
            >
              <div className="p-4">
                {/* AI Suggestions */}
                <div className="mb-4">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                    Suggestions
                  </p>
                  <div className="space-y-1">
                    {suggestions.map((suggestion, index) => (
                      <motion.button
                        key={index}
                        whileHover={{ x: 4, backgroundColor: '#F8F9FA' }}
                        className="w-full text-left px-3 py-2 rounded-lg text-sm text-gray-700 hover:text-aira-purple transition-colors flex items-center gap-2"
                      >
                        <Sparkles size={14} className="text-aira-purple" />
                        {suggestion}
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Matching Nodes */}
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                    Nodes
                  </p>
                  <div className="space-y-1">
                    {nodes.map((node, index) => (
                      <motion.button
                        key={index}
                        whileHover={{ x: 4, backgroundColor: '#F8F9FA' }}
                        className="w-full text-left px-3 py-2 rounded-lg text-sm hover:bg-gray-50 transition-colors flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-aira-purple" />
                          <span className="text-gray-800">{node.name}</span>
                        </div>
                        <span className="text-xs text-gray-500">
                          {node.health}%
                        </span>
                      </motion.button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default FloatingSearch;
