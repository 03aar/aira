import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import TopNavRefined from '../components/layout/TopNavRefined';
import LeftSidebarRefined from '../components/layout/LeftSidebarRefined';
import RightPanel from '../components/layout/RightPanel';
import BottomTimelineRefined from '../components/layout/BottomTimelineRefined';
import CanvasRefined from '../components/canvas/CanvasRefined';
import InsightsPanel from '../components/insights/InsightsPanel';
import Splash from '../components/onboarding/Splash';
import Onboarding from '../components/onboarding/Onboarding';
import { useOnboarding } from '../contexts/OnboardingContext';

const DashboardRefined: React.FC = () => {
  const { completed } = useOnboarding();
  const [showSplash, setShowSplash] = useState(!completed);
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    if (!completed && !showSplash) {
      setShowOnboarding(true);
    }
  }, [completed, showSplash]);

  const handleSplashComplete = () => {
    setShowSplash(false);
  };

  useEffect(() => {
    if (completed) {
      setShowOnboarding(false);
    }
  }, [completed]);

  return (
    <div className="w-full h-screen overflow-hidden bg-white">
      <AnimatePresence>
        {showSplash && <Splash onComplete={handleSplashComplete} />}
      </AnimatePresence>

      {!showSplash && (
        <>
          <AnimatePresence>
            {showOnboarding && !completed && <Onboarding />}
          </AnimatePresence>

          {completed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="w-full h-full"
            >
              {/* Top Navigation - Refined */}
              <TopNavRefined />

              {/* Left Sidebar - Refined (5 icons) */}
              <LeftSidebarRefined />

              {/* Main Canvas with Floating Search */}
              <div className="pt-16 pb-16">
                <CanvasRefined />
              </div>

              {/* Right Panel (node details) */}
              <RightPanel />

              {/* Insights Panel */}
              <InsightsPanel />

              {/* Bottom Timeline - Refined */}
              <BottomTimelineRefined />
            </motion.div>
          )}
        </>
      )}
    </div>
  );
};

export default DashboardRefined;
