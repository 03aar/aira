import React from 'react';
import { motion } from 'framer-motion';
import { RefreshCw, ZoomIn, ZoomOut, Share2 } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';

const TopNavRefined: React.FC = () => {
  const { zoomLevel, setZoomLevel, currentUser } = useApp();

  const handleZoomIn = () => setZoomLevel(Math.min(400, zoomLevel + 25));
  const handleZoomOut = () => setZoomLevel(Math.max(25, zoomLevel - 25));
  const handleRefresh = () => {
    // Refresh/sync architecture
    console.log('Refreshing architecture...');
  };

  return (
    <motion.nav
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-0 left-0 right-0 h-16 z-50 bg-white border-b border-gray-100"
    >
      <div className="h-full px-6 flex items-center justify-between">
        {/* Left: AIRA Logo */}
        <motion.div
          className="flex items-center gap-3 cursor-pointer"
          whileHover={{ scale: 1.02 }}
        >
          {/* Circular gradient icon */}
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-aira-blue to-aira-purple flex items-center justify-center shadow-md">
            <motion.div
              className="w-4 h-4 rounded-full bg-white"
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
          <span className="text-xl font-bold text-aira-text-primary tracking-tight">
            AIRA
          </span>
        </motion.div>

        {/* Right: Controls */}
        <div className="flex items-center gap-3">
          {/* Refresh Button */}
          <motion.button
            whileHover={{ scale: 1.05, rotate: 180 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleRefresh}
            className="p-2 hover:bg-gray-50 rounded-lg transition-colors"
            title="Refresh architecture"
          >
            <RefreshCw size={20} className="text-gray-600" />
          </motion.button>

          {/* Zoom Level Display */}
          <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-lg">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleZoomOut}
              className="p-1 hover:bg-gray-200 rounded transition-colors"
            >
              <ZoomOut size={16} className="text-gray-600" />
            </motion.button>
            <span className="text-sm font-medium text-gray-700 min-w-[3rem] text-center">
              {zoomLevel}%
            </span>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleZoomIn}
              className="p-1 hover:bg-gray-200 rounded transition-colors"
            >
              <ZoomIn size={16} className="text-gray-600" />
            </motion.button>
          </div>

          {/* Share Button - Purple Gradient */}
          <motion.button
            whileHover={{ scale: 1.02, y: -1 }}
            whileTap={{ scale: 0.98 }}
            className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-aira-purple to-[#7B5FFF] text-white font-medium shadow-md hover:shadow-lg transition-shadow flex items-center gap-2"
          >
            <Share2 size={16} />
            <span>Share</span>
          </motion.button>

          {/* User Avatar */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-10 h-10 rounded-full bg-gradient-to-br from-aira-blue to-aira-violet flex items-center justify-center text-white font-semibold shadow-md"
          >
            {currentUser.name.charAt(0).toUpperCase()}
          </motion.button>
        </div>
      </div>
    </motion.nav>
  );
};

export default TopNavRefined;
