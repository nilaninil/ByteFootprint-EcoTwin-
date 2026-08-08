import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AppData, LogEntry } from './types';
import { loadAppData, submitHabitLog, completeChallengeAction, resetAppData, deriveTwinStage, updateUserProfile } from './services/storage';
import { ALL_CHALLENGES } from './data/staticData';

// Components
import { BackgroundVideo } from './components/BackgroundVideo';
import { ProfileEntryScreen } from './components/ProfileEntryScreen';
import { Header } from './components/Header';
import { EcoTwinTree } from './components/EcoTwinTree';
import { StreakCalendar } from './components/StreakCalendar';
import { HabitLogger } from './components/HabitLogger';
import { RevealModal } from './components/RevealModal';
import { TodayChallengeCard } from './components/TodayChallengeCard';
import { EcoTipsWidget } from './components/EcoTipsWidget';
import { TrendsView } from './components/TrendsView';
import { BadgesView } from './components/BadgesView';
import { RecyclingGuideView } from './components/RecyclingGuideView';
import { AboutView } from './components/AboutView';
import { DigitalFootprintExplainer } from './components/DigitalFootprintExplainer';
import { ShareSnapshotModal } from './components/ShareSnapshotModal';
import { ZenMode } from './components/ZenMode';
import { EcoTwinHero } from './components/EcoTwinHero';
import { DigitalInsightCard } from './components/DigitalInsightCard';
import { EcoTwinTimeline } from './components/EcoTwinTimeline';

import { PlusCircle, RotateCcw, Monitor, Sparkles, ShieldCheck, Flame, ArrowRight, Leaf, Heart, Share2, Camera, Wind } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function App() {
  const [appData, setAppData] = useState<AppData>(() => loadAppData());
  const [activeTab, setActiveTab] = useState<'home' | 'log' | 'trends' | 'badges' | 'recycling' | 'about'>('home');

  // Dark Mode Theme State
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('ecotwin_theme') === 'dark';
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('ecotwin_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('ecotwin_theme', 'light');
    }
  }, [darkMode]);

  // Modals & Micro-interactions
  const [revealEntry, setRevealEntry] = useState<LogEntry | null>(null);
  const [newlyUnlockedBadges, setNewlyUnlockedBadges] = useState<string[]>([]);
  const [showDigitalExplainer, setShowDigitalExplainer] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showZenMode, setShowZenMode] = useState(false);
  const [isTreeRustling, setIsTreeRustling] = useState(false);

  // If no profile exists yet, show Profile Entry ("Login") Screen
  if (!appData.userProfile || !appData.userProfile.name) {
    return (
      <ProfileEntryScreen
        onSubmitProfile={(name: string) => {
          const updated = updateUserProfile(appData, name);
          setAppData(updated);
        }}
      />
    );
  }

  // Derive current rolling average footprint
  const recentLogs = appData.history.slice(-7);
  const rollingAvgFootprint = recentLogs.length > 0
    ? Number((recentLogs.reduce((acc, curr) => acc + curr.totalFootprint, 0) / recentLogs.length).toFixed(1))
    : 3.8;

  // Active personalized challenge
  const latestWorstCat = appData.history[appData.history.length - 1]?.worstCategory || 'digital';
  const activeChallenge = ALL_CHALLENGES.find(c => c.id === appData.activeChallengeId) || ALL_CHALLENGES[0];
  const isChallengeDone = appData.challengesCompleted.includes(activeChallenge.id);

  // Action: Save Daily Habit Log
  const handleSaveHabits = (input: any) => {
    const { updatedState, newEntry, newlyUnlockedBadges: newBadges } = submitHabitLog(appData, input);
    
    setAppData(updatedState);
    setNewlyUnlockedBadges(newBadges);
    setRevealEntry(newEntry);

    // Trigger tree rustle micro-interaction
    setIsTreeRustling(true);
    setTimeout(() => setIsTreeRustling(false), 1200);
  };

  // Action: Mark Today's Challenge Done
  const handleCompleteChallenge = (challengeId: string) => {
    const updated = completeChallengeAction(appData, challengeId);
    setAppData(updated);

    // Trigger celebration confetti & tree rustle
    confetti({
      particleCount: 60,
      spread: 70,
      origin: { y: 0.5 },
      colors: ['#2F8F5B', '#7FC98F', '#FBBF24']
    });

    setIsTreeRustling(true);
    setTimeout(() => setIsTreeRustling(false), 1200);
  };

  // Action: Care / Water Tree
  const handleWaterTree = () => {
    setIsTreeRustling(true);
    setTimeout(() => setIsTreeRustling(false), 1200);
  };

  // Action: Change Profile Name
  const handleChangeProfileName = () => {
    const newName = window.prompt("Update your EcoTwin profile name:", appData.userProfile?.name || "");
    if (newName && newName.trim()) {
      const updated = updateUserProfile(appData, newName.trim());
      setAppData(updated);
    }
  };

  // Action: Open Login Screen / Switch Profile
  const handleOpenLoginScreen = () => {
    setAppData(prev => ({
      ...prev,
      userProfile: undefined
    }));
  };

  // Action: Reset Demo Data
  const handleResetData = () => {
    if (window.confirm("Reset EcoTwin data to default sample state? This will also reset your local profile.")) {
      const resetState = resetAppData();
      setAppData(resetState);
      setActiveTab('home');
    }
  };

  return (
    <div className="relative min-h-screen bg-[#F6FAF4] text-[#1B2B1E] flex flex-col font-sans selection:bg-emerald-200 selection:text-emerald-900">
      {/* Ambient Nature Video Background */}
      <BackgroundVideo opacity={0.55} />

      {/* Header Bar */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        greenScore={appData.greenScore}
        streakDays={appData.streakDays}
        userProfile={appData.userProfile}
        onOpenDigitalExplainer={() => setShowDigitalExplainer(true)}
        onChangeProfileName={handleChangeProfileName}
        onOpenLoginScreen={handleOpenLoginScreen}
        onOpenZenMode={() => setShowZenMode(true)}
        isDarkMode={darkMode}
        onToggleDarkMode={() => setDarkMode(prev => !prev)}
      />

      {/* Main Content Area */}
      <main className="relative z-10 flex-1 max-w-6xl w-full mx-auto px-4 py-6">
        <AnimatePresence mode="wait">
          {/* 1. HOME TAB */}
          {activeTab === 'home' && (
            <motion.div
              key="tab-home"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.4 }}
              className="space-y-12 sm:space-y-16"
            >
              {/* Chapter 1: The Sanctuary Centerpiece */}
              <EcoTwinHero
                appData={appData}
                isRustling={isTreeRustling}
                onWaterTree={handleWaterTree}
                onNavigateLog={() => setActiveTab('log')}
                onOpenZenMode={() => setShowZenMode(true)}
                onOpenShareModal={() => setShowShareModal(true)}
                onOpenDigitalExplainer={() => setShowDigitalExplainer(true)}
                rollingAvgFootprint={rollingAvgFootprint}
              />

              {/* Chapter 2: The Invisible Burden (Digital Footprint Focus) */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5 }}
                className="relative"
              >
                <div className="flex items-center gap-2 mb-3 px-2">
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                  <span className="text-xs font-black uppercase tracking-widest text-amber-900/80">Chapter II • Invisible Digital Footprint</span>
                </div>
                <DigitalInsightCard
                  digitalKg={appData.history.length > 0 ? appData.history[appData.history.length - 1].footprintByCategory.digital : 1.2}
                  highestCategory={latestWorstCat}
                  onOpenExplainer={() => setShowDigitalExplainer(true)}
                  onLogDetox={() => setActiveTab('log')}
                />
              </motion.div>

              {/* Chapter 3: Living Evolution Journey */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5 }}
                className="relative"
              >
                <div className="flex items-center gap-2 mb-3 px-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="text-xs font-black uppercase tracking-widest text-emerald-900/80">Chapter III • Tree Evolution & Milestones</span>
                </div>
                <EcoTwinTimeline
                  currentStage={appData.twinStage}
                  history={appData.history}
                  greenScore={appData.greenScore}
                />
              </motion.div>

              {/* Chapter 4: Daily Eco Quests & Wisdom */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5 }}
                className="space-y-4"
              >
                <div className="flex items-center justify-between px-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#2F8F5B]" />
                    <span className="text-xs font-black uppercase tracking-widest text-emerald-900/80">Chapter IV • Today's Mission & Nature Wisdom</span>
                  </div>
                  <button
                    onClick={() => setActiveTab('trends')}
                    className="text-xs font-bold text-[#2F8F5B] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>View Analytics</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2">
                    <TodayChallengeCard
                      challenge={activeChallenge}
                      isCompleted={isChallengeDone}
                      onComplete={(id) => {
                        handleCompleteChallenge(id);
                        setIsTreeRustling(true);
                        setTimeout(() => setIsTreeRustling(false), 2200);
                      }}
                      worstCategory={latestWorstCat}
                    />
                  </div>

                  <div>
                    <EcoTipsWidget />
                  </div>
                </div>
              </motion.div>

              {/* Chapter 5: Rhythm of the Forest (Streak & Footprint Pulse) */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5 }}
                className="space-y-6"
              >
                <div className="flex items-center gap-2 px-2">
                  <span className="w-2 h-2 rounded-full bg-indigo-500" />
                  <span className="text-xs font-black uppercase tracking-widest text-emerald-900/80">Chapter V • Habit Rhythm & Footprint Pulse</span>
                </div>

                <StreakCalendar
                  history={appData.history}
                  streakDays={appData.streakDays}
                  onNavigateLog={() => setActiveTab('log')}
                />

                {/* Asymmetrical Organic Footprint Snapshot Floating Ribbon */}
                <div className="bg-white/70 backdrop-blur-md rounded-[2rem] p-6 shadow-sm border border-white/80">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                    <h3 className="font-black text-sm text-[#1B2B1E] flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-emerald-600" />
                      <span>Latest Carbon Snapshot</span>
                    </h3>
                    <span className="text-xs text-gray-500 font-bold bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
                      {appData.history.length > 0 ? `Logged: ${appData.history[appData.history.length - 1].date}` : 'No logs yet'}
                    </span>
                  </div>

                  {appData.history.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                      <div className="p-4 rounded-2xl bg-blue-50/80 border border-blue-100/80 text-blue-900 flex flex-col justify-between">
                        <span className="text-[10px] uppercase font-extrabold text-blue-600 tracking-wider">Transport</span>
                        <span className="font-black text-base mt-1 text-blue-950">{appData.history[appData.history.length - 1].footprintByCategory.transport} kg</span>
                      </div>

                      <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-100/80 text-emerald-900 flex flex-col justify-between">
                        <span className="text-[10px] uppercase font-extrabold text-emerald-600 tracking-wider">Food & Diet</span>
                        <span className="font-black text-base mt-1 text-emerald-950">{appData.history[appData.history.length - 1].footprintByCategory.food} kg</span>
                      </div>

                      <div className="p-4 rounded-2xl bg-purple-50/80 border border-purple-100/80 text-purple-900 flex flex-col justify-between">
                        <span className="text-[10px] uppercase font-extrabold text-purple-600 tracking-wider">Energy</span>
                        <span className="font-black text-base mt-1 text-purple-950">{appData.history[appData.history.length - 1].footprintByCategory.energy} kg</span>
                      </div>

                      <div className="p-4 rounded-2xl bg-amber-50/90 border border-amber-300/90 text-amber-950 flex flex-col justify-between">
                        <span className="text-[10px] uppercase font-black text-amber-800 tracking-wider flex items-center justify-between">
                          <span>Digital</span>
                          <span className="text-[9px] bg-amber-200 px-1.5 py-0.5 rounded-md text-amber-900">Cloud</span>
                        </span>
                        <span className="font-black text-base mt-1 text-amber-950">{appData.history[appData.history.length - 1].footprintByCategory.digital} kg</span>
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs text-gray-500 font-medium">Log your first habits to see your carbon breakdown snapshot here!</p>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}

          {/* 2. LOG HABITS TAB */}
          {activeTab === 'log' && (
            <motion.div
              key="tab-log"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3 }}
            >
              <HabitLogger
                onSaveHabits={handleSaveHabits}
                onOpenDigitalExplainer={() => setShowDigitalExplainer(true)}
              />
            </motion.div>
          )}

          {/* 3. TRENDS TAB */}
          {activeTab === 'trends' && (
            <motion.div
              key="tab-trends"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3 }}
            >
              <TrendsView history={appData.history} />
            </motion.div>
          )}

          {/* 4. BADGES TAB */}
          {activeTab === 'badges' && (
            <motion.div
              key="tab-badges"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3 }}
            >
              <BadgesView appData={appData} />
            </motion.div>
          )}

          {/* 5. RECYCLING GUIDE TAB */}
          {activeTab === 'recycling' && (
            <motion.div
              key="tab-recycling"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3 }}
            >
              <RecyclingGuideView />
            </motion.div>
          )}

          {/* 6. ABOUT ECOTWIN TAB */}
          {activeTab === 'about' && (
            <motion.div
              key="tab-about"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3 }}
            >
              <AboutView
                currentStage={appData.twinStage}
                onNavigateLog={() => setActiveTab('log')}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* MODALS */}
      <RevealModal
        entry={revealEntry}
        onClose={() => setRevealEntry(null)}
        onGoToChallenge={() => {
          setRevealEntry(null);
          setActiveTab('home');
        }}
        newlyUnlockedBadges={newlyUnlockedBadges}
      />

      <DigitalFootprintExplainer
        isOpen={showDigitalExplainer}
        onClose={() => setShowDigitalExplainer(false)}
      />

      <ShareSnapshotModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        appData={appData}
        rollingAvgFootprint={rollingAvgFootprint}
      />

      <AnimatePresence>
        {showZenMode && (
          <ZenMode
            appData={appData}
            onExit={() => setShowZenMode(false)}
            rollingAvgFootprint={rollingAvgFootprint}
          />
        )}
      </AnimatePresence>

      {/* Footer Bar */}
      <footer className="relative z-10 mt-12 border-t border-emerald-900/10 bg-white/80 backdrop-blur-md py-6 text-xs text-gray-500">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>
            <span className="font-bold text-[#1B2B1E]">EcoTwin</span> — "Your carbon footprint, given a pulse."
            <p className="text-[11px] text-gray-600 mt-0.5">EcoLife Hackathon Project • Stored for {appData.userProfile?.name}</p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleResetData}
              className="px-3 py-1.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-600 font-medium flex items-center gap-1 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Demo Data</span>
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
