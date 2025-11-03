import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import TopNav from '../components/layout/TopNav';
import LeftToolbar from '../components/layout/LeftToolbar';
import RightPanel from '../components/layout/RightPanel';
import BottomTimeline from '../components/layout/BottomTimeline';
import Canvas from '../components/canvas/Canvas';
import InsightsPanel from '../components/insights/InsightsPanel';
import Splash from '../components/onboarding/Splash';
import Onboarding from '../components/onboarding/Onboarding';
import { useOnboarding } from '../contexts/OnboardingContext';

const Dashboard: React.FC = () => {
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

  // If onboarding is completed during the session, hide onboarding
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
              {/* Top Navigation */}
              <TopNav />

              {/* Left Toolbar */}
              <LeftToolbar />

              {/* Main Canvas */}
              <div className="pt-16 pb-20">
                <Canvas />
              </div>

              {/* Right Panel (node details) */}
              <RightPanel />

              {/* Insights Panel */}
              <InsightsPanel />

              {/* Bottom Timeline */}
              <BottomTimeline />
            </motion.div>
          )}
        </>
      )}
    </div>
  );
};

export default Dashboard;
