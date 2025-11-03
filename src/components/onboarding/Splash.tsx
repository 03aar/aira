import React, { useEffect } from 'react';
import { motion } from 'framer-motion';

interface SplashProps {
  onComplete: () => void;
}

const Splash: React.FC<SplashProps> = ({ onComplete }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 4000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 bg-white z-50 flex items-center justify-center"
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
    >
      {/* Animated lines forming */}
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 1920 1080"
        fill="none"
      >
        {/* Horizontal line that splits */}
        <motion.line
          x1="960"
          y1="540"
          x2="960"
          y2="540"
          stroke="url(#lineGradient)"
          strokeWidth="2"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ x2: 1200, pathLength: 1 }}
          transition={{ duration: 1, ease: 'easeInOut' }}
        />
        <motion.line
          x1="960"
          y1="540"
          x2="720"
          y2="540"
          stroke="url(#lineGradient)"
          strokeWidth="2"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1, ease: 'easeInOut', delay: 0.3 }}
        />

        {/* Curved connections */}
        <motion.path
          d="M 960 540 Q 1080 440, 1200 440"
          stroke="url(#lineGradient)"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 1.2, ease: 'easeInOut', delay: 0.6 }}
        />

        <motion.path
          d="M 960 540 Q 840 640, 720 640"
          stroke="url(#lineGradient)"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 1.2, ease: 'easeInOut', delay: 0.9 }}
        />

        <defs>
          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#4B9EFF" />
            <stop offset="50%" stopColor="#9A7AFF" />
            <stop offset="100%" stopColor="#9B5CFF" />
          </linearGradient>
        </defs>
      </svg>

      {/* Center content */}
      <div className="relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.5, duration: 0.8 }}
        >
          {/* Logo */}
          <div className="flex items-center justify-center gap-4 mb-6">
            <motion.div
              className="w-16 h-16 rounded-full bg-gradient-purple flex items-center justify-center"
              animate={{
                boxShadow: [
                  '0 0 20px rgba(155, 92, 255, 0.3)',
                  '0 0 40px rgba(155, 92, 255, 0.6)',
                  '0 0 20px rgba(155, 92, 255, 0.3)',
                ],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <motion.div
                className="w-6 h-6 rounded-full bg-white"
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [1, 0.7, 1],
                }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </motion.div>
            <h1 className="text-6xl font-bold text-aira-text-light tracking-wider">
              AIRA
            </h1>
          </div>

          {/* Tagline */}
          <motion.p
            className="text-xl text-aira-text-secondary"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2, duration: 1 }}
          >
            See your software come alive.
          </motion.p>
        </motion.div>

        {/* Loading indicator */}
        <motion.div
          className="mt-12 flex items-center justify-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.5 }}
        >
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 rounded-full bg-aira-purple"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.3, 1, 0.3],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            />
          ))}
        </motion.div>

        <motion.p
          className="mt-4 text-sm text-aira-text-secondary"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 3 }}
        >
          The living blueprint of your digital world.
        </motion.p>
      </div>
    </motion.div>
  );
};

export default Splash;
