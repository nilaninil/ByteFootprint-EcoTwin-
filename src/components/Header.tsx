import React from 'react';
import { Leaf, Flame, Trophy, BarChart3, Recycle, PlusCircle, Home, Monitor, Info, User, LogOut, Wind, Sun, Moon } from 'lucide-react';
import { UserProfile } from '../types';

interface HeaderProps {
  activeTab: 'home' | 'log' | 'trends' | 'badges' | 'recycling' | 'about';
  setActiveTab: (tab: 'home' | 'log' | 'trends' | 'badges' | 'recycling' | 'about') => void;
  greenScore: number;
  streakDays: number;
  userProfile?: UserProfile;
  onOpenDigitalExplainer?: () => void;
  onChangeProfileName?: () => void;
  onOpenLoginScreen?: () => void;
  onOpenZenMode?: () => void;
  isDarkMode?: boolean;
  onToggleDarkMode?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  greenScore,
  streakDays,
  userProfile,
  onOpenDigitalExplainer,
  onChangeProfileName,
  onOpenLoginScreen,
  onOpenZenMode,
  isDarkMode,
  onToggleDarkMode
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#F4F7F2]/95 backdrop-blur-md border-b border-emerald-900/10 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
        {/* Top bar: Brand + Stats Badges + Profile */}
        <div className="flex items-center justify-between gap-3">
          {/* Brand Logo & Tagline */}
          <div 
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-2xl bg-[#2F8F5B] text-white flex items-center justify-center shadow-md shadow-emerald-800/20 group-hover:scale-105 transition-transform">
              <Leaf className="w-5 h-5 fill-white/20" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-serif-instrument text-2xl text-[#1B2B1E] tracking-tight font-normal leading-none">
                  Eco<span className="font-serif-instrument italic text-[#2F8F5B]">Twin</span>
                </h1>
                <span className="hidden sm:inline-block px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-emerald-100 text-[#2F8F5B]">
                  EcoLife '26
                </span>
              </div>
              <p className="text-[11px] text-gray-500 font-medium hidden sm:block mt-0.5">
                Your carbon footprint, given a pulse.
              </p>
            </div>
          </div>

          {/* Stats Badges: User Profile + Green Score + Streak + Digital Badge */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* User Profile Badge */}
            {userProfile?.name ? (
              <div className="flex items-center gap-1 bg-white p-1 rounded-2xl border border-emerald-900/10 shadow-xs">
                <button
                  onClick={onChangeProfileName}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl hover:bg-emerald-50 text-[#1B2B1E] text-xs font-bold transition-all cursor-pointer"
                  title="Click to rename profile"
                >
                  <div className="w-5 h-5 rounded-full bg-emerald-100 text-[#2F8F5B] flex items-center justify-center font-black text-[10px]">
                    {userProfile.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="max-w-[70px] sm:max-w-[110px] truncate">{userProfile.name}</span>
                </button>
                {onOpenLoginScreen && (
                  <button
                    onClick={onOpenLoginScreen}
                    className="p-1.5 rounded-xl hover:bg-emerald-100 text-emerald-800 transition-colors cursor-pointer"
                    title="Switch user / Open Login page"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ) : (
              onOpenLoginScreen && (
                <button
                  onClick={onOpenLoginScreen}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-[#2F8F5B] text-white text-xs font-bold shadow-xs transition-all cursor-pointer"
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Log In</span>
                </button>
              )
            )}

            {/* Zen Mode Button */}
            {onOpenZenMode && (
              <button
                onClick={onOpenZenMode}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#1B2B1E] hover:bg-emerald-950 text-emerald-100 text-xs font-extrabold shadow-sm transition-all cursor-pointer hover:scale-105"
                title="Open Fullscreen Zen Mode & Ambient Forest Player"
              >
                <Wind className="w-3.5 h-3.5 text-emerald-300" />
                <span>Zen Mode</span>
              </button>
            )}

            {/* Dark Mode / Light Mode Toggle */}
            {onToggleDarkMode && (
              <button
                onClick={onToggleDarkMode}
                className="p-2 rounded-2xl bg-white dark:bg-emerald-900/60 border border-emerald-900/10 dark:border-emerald-700/50 text-[#1B2B1E] dark:text-emerald-100 hover:bg-emerald-50 dark:hover:bg-emerald-800/80 transition-all cursor-pointer shadow-xs"
                title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
              >
                {isDarkMode ? (
                  <Sun className="w-4 h-4 text-amber-400 fill-amber-400/20" />
                ) : (
                  <Moon className="w-4 h-4 text-emerald-800" />
                )}
              </button>
            )}

            {/* Digital Footprint Explainer Button */}
            {onOpenDigitalExplainer && (
              <button
                onClick={onOpenDigitalExplainer}
                className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-100/80 hover:bg-amber-200/80 text-amber-900 text-xs font-semibold border border-amber-300/60 transition-all cursor-pointer"
                title="Learn why Digital Footprint is the hidden carbon source"
              >
                <Monitor className="w-3.5 h-3.5 text-amber-700" />
                <span>Hidden Footprint</span>
              </button>
            )}

            {/* Streak Counter Badge */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-orange-50 border border-orange-200/80 text-orange-800 text-xs font-bold shadow-xs">
              <Flame className="w-4 h-4 text-orange-500 fill-orange-500/20 animate-pulse" />
              <span>{streakDays}d Streak</span>
            </div>

            {/* Circular Green Score Badge */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-[#1B2B1E] text-white shadow-md shadow-emerald-900/15">
              <div className="relative w-7 h-7 flex items-center justify-center font-extrabold text-xs">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-emerald-900"
                    strokeWidth="3.5"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="text-emerald-300 transition-all duration-700"
                    strokeDasharray={`${greenScore}, 100`}
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <span className="absolute text-[10px] text-emerald-200">{greenScore}</span>
              </div>
              <div className="flex flex-col text-left">
                <span className="text-[10px] text-emerald-300 font-semibold leading-none uppercase tracking-wider">Green Score</span>
                <span className="text-xs font-bold leading-tight">{greenScore}/100</span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs (Desktop & Tablet) */}
        <nav className="mt-3 flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 pt-2 border-t border-emerald-900/10">
          <button
            onClick={() => setActiveTab('home')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'home'
                ? 'bg-[#2F8F5B] text-white shadow-sm font-bold'
                : 'text-gray-700 hover:bg-emerald-100/60 hover:text-[#1B2B1E]'
            }`}
          >
            <Home className="w-3.5 h-3.5" />
            <span>Home Twin</span>
          </button>

          <button
            onClick={() => setActiveTab('log')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'log'
                ? 'bg-[#2F8F5B] text-white shadow-sm font-bold'
                : 'text-gray-700 hover:bg-emerald-100/60 hover:text-[#1B2B1E]'
            }`}
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Log Daily Habits</span>
          </button>

          <button
            onClick={() => setActiveTab('trends')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'trends'
                ? 'bg-[#2F8F5B] text-white shadow-sm font-bold'
                : 'text-gray-700 hover:bg-emerald-100/60 hover:text-[#1B2B1E]'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Trends & Filmstrip</span>
          </button>

          <button
            onClick={() => setActiveTab('badges')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'badges'
                ? 'bg-[#2F8F5B] text-white shadow-sm font-bold'
                : 'text-gray-700 hover:bg-emerald-100/60 hover:text-[#1B2B1E]'
            }`}
          >
            <Trophy className="w-3.5 h-3.5" />
            <span>Badges Shelf</span>
          </button>

          <button
            onClick={() => setActiveTab('recycling')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'recycling'
                ? 'bg-[#2F8F5B] text-white shadow-sm font-bold'
                : 'text-gray-700 hover:bg-emerald-100/60 hover:text-[#1B2B1E]'
            }`}
          >
            <Recycle className="w-3.5 h-3.5" />
            <span>Recycling Guide</span>
          </button>

          <button
            onClick={() => setActiveTab('about')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'about'
                ? 'bg-[#2F8F5B] text-white shadow-sm font-bold'
                : 'text-gray-700 hover:bg-emerald-100/60 hover:text-[#1B2B1E]'
            }`}
          >
            <Info className="w-3.5 h-3.5 text-amber-600" />
            <span>About EcoTwin</span>
          </button>
        </nav>
      </div>
    </header>
  );
};

