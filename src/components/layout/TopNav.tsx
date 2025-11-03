import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Share2, ZoomIn, ZoomOut } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';

const TopNav: React.FC = () => {
  const { zoomLevel, setZoomLevel, currentUser } = useApp();
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleZoomIn = () => setZoomLevel(Math.min(200, zoomLevel + 10));
  const handleZoomOut = () => setZoomLevel(Math.max(20, zoomLevel - 10));

  return (
    <motion.nav
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-0 left-0 right-0 h-16 z-50"
    >
      <div className="h-full px-6 flex items-center justify-between aira-glass border-b border-black/5">
        {/* Logo */}
        <motion.div
          className="flex items-center gap-3 cursor-pointer"
          whileHover={{ scale: 1.05 }}
        >
          <div className="w-8 h-8 rounded-full bg-gradient-purple flex items-center justify-center">
            <motion.div
              className="w-3 h-3 rounded-full bg-white"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [1, 0.8, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          </div>
          <span className="text-xl font-semibold text-aira-text-light tracking-wide">
            AIRA
          </span>
        </motion.div>

        {/* Search / Ask Field */}
        <motion.div
          className="flex-1 max-w-2xl mx-8"
          animate={{
            scale: searchFocused ? 1.02 : 1,
          }}
          transition={{ duration: 0.2 }}
        >
          <div className="relative">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-aira-text-secondary"
              size={20}
            />
            <input
              type="text"
              placeholder="Ask Aira anything about your system…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              className={`
                w-full pl-12 pr-4 py-3 rounded-full
                bg-white/50 backdrop-blur-sm
                border transition-all duration-300
                focus:outline-none focus:ring-2 focus:ring-aira-cyan/30
                ${searchFocused
                  ? 'border-aira-cyan shadow-lg bg-white/90'
                  : 'border-gray-200 hover:border-gray-300'
                }
              `}
            />
          </div>
        </motion.div>

        {/* Right Controls */}
        <div className="flex items-center gap-4">
          {/* Zoom Controls */}
          <div className="flex items-center gap-2 px-3 py-2 rounded-full bg-white/50 border border-gray-200">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleZoomOut}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ZoomOut size={18} className="text-aira-text-secondary" />
            </motion.button>
            <span className="text-sm font-medium text-aira-text-primary w-12 text-center">
              {zoomLevel}%
            </span>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleZoomIn}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ZoomIn size={18} className="text-aira-text-secondary" />
            </motion.button>
          </div>

          {/* Share Button */}
          <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className="px-5 py-2 rounded-full bg-gradient-purple text-white font-medium shadow-md hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center gap-2">
              <Share2 size={16} />
              <span>Share</span>
            </div>
          </motion.button>

          {/* User Menu */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-10 h-10 rounded-full bg-gradient-to-br from-aira-blue to-aira-violet flex items-center justify-center text-white font-medium shadow-md"
          >
            {currentUser.name.charAt(0).toUpperCase()}
          </motion.button>
        </div>
      </div>
    </motion.nav>
  );
};

export default TopNav;
