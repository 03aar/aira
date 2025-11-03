import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause } from 'lucide-react';

const BottomTimeline: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [timelineValue, setTimelineValue] = useState(75);

  const milestones = [
    { position: 0, label: 'Initial Release', date: 'Jan 2024' },
    { position: 25, label: 'v1.1', date: 'Mar 2024' },
    { position: 50, label: 'v1.5', date: 'Jun 2024' },
    { position: 75, label: 'v2.0', date: 'Sep 2024' },
    { position: 100, label: 'Current', date: 'Now' },
  ];

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.3 }}
      className="fixed bottom-0 left-0 right-0 h-20 z-40"
    >
      <div className="h-full px-8 flex items-center gap-6 aira-glass border-t border-black/5">
        {/* Play/Pause Button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handlePlayPause}
          className="w-10 h-10 rounded-full bg-gradient-purple text-white flex items-center justify-center shadow-md hover:shadow-lg transition-shadow"
        >
          {isPlaying ? <Pause size={18} /> : <Play size={18} className="ml-0.5" />}
        </motion.button>

        {/* Timeline */}
        <div className="flex-1 relative">
          {/* Track */}
          <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
            {/* Progress */}
            <motion.div
              className="absolute inset-y-0 left-0 bg-gradient-purple"
              style={{ width: `${timelineValue}%` }}
              transition={{ type: 'spring', stiffness: 100 }}
            />

            {/* Milestones */}
            {milestones.map((milestone) => (
              <div
                key={milestone.position}
                className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2"
                style={{ left: `${milestone.position}%` }}
              >
                <motion.div
                  whileHover={{ scale: 1.3 }}
                  className={`
                    w-3 h-3 rounded-full border-2 border-white shadow-md cursor-pointer
                    ${timelineValue >= milestone.position
                      ? 'bg-aira-purple'
                      : 'bg-gray-300'
                    }
                  `}
                />
              </div>
            ))}

            {/* Slider Handle */}
            <motion.div
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0}
              dragMomentum={false}
              className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 cursor-grab active:cursor-grabbing"
              style={{ left: `${timelineValue}%` }}
              onDrag={(_, info) => {
                const track = document.querySelector('.timeline-track') as HTMLElement;
                if (track) {
                  const rect = track.getBoundingClientRect();
                  const percent = ((info.point.x - rect.left) / rect.width) * 100;
                  setTimelineValue(Math.max(0, Math.min(100, percent)));
                }
              }}
            >
              <div className="w-5 h-5 rounded-full bg-white shadow-lg ring-2 ring-aira-purple">
                <motion.div
                  className="absolute inset-0 rounded-full bg-aira-purple/20"
                  animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </div>
            </motion.div>
          </div>

          {/* Milestone Labels */}
          <div className="absolute -top-8 left-0 right-0">
            {milestones.map((milestone) => {
              const isActive = timelineValue >= milestone.position - 5 &&
                              timelineValue <= milestone.position + 5;

              return (
                <motion.div
                  key={milestone.position}
                  className="absolute -translate-x-1/2"
                  style={{ left: `${milestone.position}%` }}
                  animate={{
                    opacity: isActive ? 1 : 0.6,
                    scale: isActive ? 1.1 : 1,
                  }}
                >
                  <div className="text-center">
                    <p className="text-xs font-semibold text-aira-text-primary whitespace-nowrap">
                      {milestone.label}
                    </p>
                    <p className="text-xs text-aira-text-secondary">
                      {milestone.date}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Timeline Info */}
        <div className="text-right min-w-32">
          <p className="text-xs text-aira-text-secondary">Evolution Timeline</p>
          <p className="text-sm font-semibold text-aira-text-primary">
            {milestones.find((m) => Math.abs(m.position - timelineValue) < 5)?.label ||
             `${Math.round(timelineValue)}%`}
          </p>
        </div>
      </div>

      {/* Hidden element for drag calculations */}
      <div className="timeline-track" />
    </motion.div>
  );
};

export default BottomTimeline;
