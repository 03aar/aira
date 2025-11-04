import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, Clock } from 'lucide-react';

const BottomTimelineRefined: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [timelineValue] = useState(75);

  const milestones = [
    { position: 0, version: 'v1.0.0', date: 'Jan 2024' },
    { position: 25, version: 'v1.1.0', date: 'Mar 2024' },
    { position: 50, version: 'v1.2.5', date: 'May 2024' },
    { position: 75, version: 'v1.4.2', date: 'June 2025' },
    { position: 100, version: 'Current', date: 'Now' },
  ];

  const currentMilestone = milestones.find(
    (m) => Math.abs(m.position - timelineValue) < 5
  ) || milestones[milestones.length - 1];

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const getTimeAgo = () => {
    // Calculate time difference (mock for now)
    return '2h ago';
  };

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.3 }}
      className="fixed bottom-0 left-0 right-0 h-16 z-40 bg-white/90 backdrop-blur-md border-t border-gray-100"
    >
      <div className="h-full px-8 flex items-center gap-4">
        {/* Play/Pause Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handlePlayPause}
          className="w-8 h-8 rounded-lg bg-gradient-to-r from-aira-blue to-aira-purple text-white flex items-center justify-center shadow-md hover:shadow-lg transition-shadow"
        >
          {isPlaying ? <Pause size={16} /> : <Play size={16} className="ml-0.5" />}
        </motion.button>

        {/* Timeline Slider */}
        <div className="flex-1 relative">
          {/* Track Background */}
          <div className="relative h-1.5 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full overflow-hidden">
            {/* Progress with Gradient */}
            <motion.div
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-aira-blue via-aira-purple to-aira-violet rounded-full"
              style={{ width: `${timelineValue}%` }}
              transition={{ type: 'spring', stiffness: 100 }}
            />

            {/* Milestone Markers */}
            {milestones.map((milestone) => (
              <div
                key={milestone.position}
                className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2"
                style={{ left: `${milestone.position}%` }}
              >
                <motion.div
                  whileHover={{ scale: 1.4 }}
                  className={`
                    w-2.5 h-2.5 rounded-full border-2 border-white shadow-md cursor-pointer
                    ${timelineValue >= milestone.position
                      ? 'bg-aira-purple'
                      : 'bg-gray-300'
                    }
                  `}
                />
              </div>
            ))}

            {/* Draggable Handle */}
            <motion.div
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0}
              dragMomentum={false}
              className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 cursor-grab active:cursor-grabbing"
              style={{ left: `${timelineValue}%` }}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
            >
              <div className="w-4 h-4 rounded-full bg-white shadow-lg ring-2 ring-aira-purple" />
            </motion.div>
          </div>
        </div>

        {/* Version Badge */}
        <div className="flex items-center gap-3 px-4 py-2 bg-gradient-to-r from-aira-purple/10 to-aira-blue/10 rounded-lg border border-aira-purple/20">
          <span className="text-sm font-semibold text-aira-purple">
            {currentMilestone.version}
          </span>
          <span className="text-sm text-gray-500">—</span>
          <span className="text-sm text-gray-600">
            {currentMilestone.date}
          </span>
        </div>

        {/* Time Info */}
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Clock size={14} />
          <span>{getTimeAgo()}</span>
        </div>
      </div>
    </motion.div>
  );
};

export default BottomTimelineRefined;
