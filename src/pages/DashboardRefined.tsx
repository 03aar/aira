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
    <div className="w-full h-screen flex flex-col bg-white">
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
              className="w-full h-full flex flex-col"
            >
              {/* Top Navigation - Refined (Fixed) */}
              <TopNavRefined />

              {/* Left Sidebar - Refined (Fixed, 5 icons) */}
              <LeftSidebarRefined />

              {/* Main Canvas Container - Scrollable */}
              <div className="flex-1 relative overflow-auto">
                <CanvasRefined />
              </div>

              {/* Right Panel (node details) - Fixed */}
              <RightPanel />

              {/* Insights Panel - Fixed */}
              <InsightsPanel />

              {/* Bottom Timeline - Refined (Fixed) */}
              <BottomTimelineRefined />
            </motion.div>
          )}
        </>
      )}
    </div>
  );
};

export default DashboardRefined;
