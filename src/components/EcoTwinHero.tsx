import React from 'react';
import { motion } from 'motion/react';
import { EcoTwinTree } from './EcoTwinTree';
import { AppData, TwinStage } from '../types';
import { TWIN_STAGES } from '../data/staticData';
import { ArrowRight, Wind, PlusCircle } from 'lucide-react';
import { BotanicalSketch } from './BotanicalSketch';

interface EcoTwinHeroProps {
  appData: AppData;
  isRustling: boolean;
  onWaterTree: () => void;
  onNavigateLog: () => void;
  onOpenZenMode: () => void;
  onOpenShareModal: () => void;
  onOpenDigitalExplainer: () => void;
  rollingAvgFootprint?: number;
}

export const EcoTwinHero: React.FC<EcoTwinHeroProps> = ({
  appData,
  isRustling,
  onWaterTree,
  onNavigateLog,
  onOpenZenMode,
  onOpenDigitalExplainer,
  rollingAvgFootprint
}) => {
  const stage = appData.twinStage || 2;
  const greenScore = appData.greenScore || 3;
  const stageInfo = TWIN_STAGES[stage as TwinStage] || TWIN_STAGES[2];

  return (
    <div className="space-y-12 sm:space-y-16">
      {/* ================= HERO SECTION (IMAGE 1) ================= */}
      <section className="relative rounded-[2.5rem] bg-[#F3F6F0] p-6 sm:p-12 md:p-16 border border-emerald-900/10 overflow-hidden shadow-xs">
        {/* Right Background Botanical Sketch */}
        <div className="absolute top-0 right-0 w-80 sm:w-[500px] h-full pointer-events-none opacity-80">
          <BotanicalSketch className="w-full h-full object-cover" />
        </div>

        {/* Hero Grid Container */}
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center min-h-[520px]">
          {/* Left Column: Editorial Headline */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-4 space-y-3"
          >
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#2F8F5B]">
              <span className="w-2 h-2 rounded-full bg-[#2F8F5B]" />
              <span>A personal carbon companion</span>
            </div>

            <h1 className="text-5xl sm:text-6xl md:text-7xl font-serif-instrument tracking-tight leading-[0.95] text-[#1B2B1E] font-normal">
              The<br />
              carbon<br />
              <span className="font-serif-instrument italic text-[#2F8F5B]">you can't<br />see.</span>
            </h1>
          </motion.div>

          {/* Center Column: Tree Avatar + Floating Glass Badges */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-8 flex flex-col items-center justify-center relative"
          >
            <div className="relative w-full max-w-xl flex flex-col items-center my-4">
              {/* Left Floating Badge: Field Measure */}
              <motion.div
                initial={{ opacity: 0, x: -15, y: -10 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="absolute top-12 left-0 sm:-left-4 z-20 bg-white/85 backdrop-blur-md rounded-2xl p-4 shadow-sm border border-emerald-900/10 w-44 text-left"
              >
                <div className="text-[10px] font-extrabold uppercase tracking-widest text-amber-900/60 mb-1">
                  Field Measure
                </div>
                <div className="font-serif-instrument text-4xl font-bold text-[#1B2B1E] leading-none mb-1">
                  {greenScore}
                </div>
                <div className="text-[10px] text-gray-500 font-semibold leading-tight">
                  green score / rolling rhythm
                </div>
              </motion.div>

              {/* Center EcoTwin Tree */}
              <div className="relative z-10 scale-105 sm:scale-110">
                <EcoTwinTree
                  stage={stage}
                  isRustling={isRustling}
                  onWaterTree={onWaterTree}
                  rollingAvgFootprint={rollingAvgFootprint}
                  heroDisplay={true}
                />
              </div>

              {/* Right Floating Badge: Current Stage */}
              <motion.div
                initial={{ opacity: 0, x: 15, y: -10 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="absolute top-8 right-0 sm:-right-4 z-20 bg-white/85 backdrop-blur-md rounded-2xl p-4 shadow-sm border border-emerald-900/10 w-48 text-left"
              >
                <div className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-800/60 mb-1">
                  Current Stage
                </div>
                <div className="font-serif-instrument text-2xl font-bold text-[#1B2B1E] leading-tight mb-1">
                  {stageInfo.name}
                </div>
                <div className="text-[10px] text-gray-500 font-semibold leading-tight">
                  Your twin is finding its rhythm.
                </div>
              </motion.div>
            </div>

            {/* Subtext & Action Buttons below tree */}
            <div className="mt-4 text-center max-w-md mx-auto space-y-5 relative z-20">
              <p className="text-xs sm:text-sm text-gray-600 font-medium leading-relaxed">
                A small daily ritual for seeing the whole picture — including the part hiding behind your screen.
              </p>

              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={onNavigateLog}
                  className="px-6 py-3.5 rounded-full bg-[#1B2B1E] hover:bg-emerald-950 text-white font-bold text-xs shadow-md flex items-center gap-2 transition-all cursor-pointer hover:scale-105 active:scale-95"
                >
                  <span>Log today's habits</span>
                  <ArrowRight className="w-3.5 h-3.5 text-emerald-300" />
                </button>

                <button
                  onClick={onOpenZenMode}
                  className="px-5 py-3.5 rounded-full bg-white/80 hover:bg-white text-[#1B2B1E] font-bold text-xs border border-emerald-900/15 shadow-xs flex items-center gap-1.5 transition-all cursor-pointer hover:scale-105"
                >
                  <Wind className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Enter Zen Mode</span>
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ================= MIDDLE DARK SECTION (IMAGE 2 TOP) ================= */}
      <section className="relative rounded-[2.5rem] bg-[#152217] p-8 sm:p-12 md:p-16 border border-emerald-900/30 text-white overflow-hidden shadow-xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left: One Ordinary Day */}
          <div className="lg:col-span-7 space-y-4">
            <div className="text-xs font-mono uppercase tracking-widest text-[#72BD8A] font-bold">
              One Ordinary Day
            </div>
            <h2 className="text-4xl sm:text-5xl font-serif-instrument tracking-tight leading-tight text-white font-normal">
              Small signals.<br />
              <span className="font-serif-instrument italic text-[#82C398]">A living response.</span>
            </h2>
            <p className="text-xs sm:text-sm text-emerald-100/80 leading-relaxed font-normal max-w-lg">
              Dropping one hour of 4K video to 720p can make your digital footprint noticeably lighter. Your twin doesn't ask for perfection. It watches the pattern, then answers with a little more life.
            </p>
          </div>

          {/* Right: Floating Cards */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-emerald-950/60 backdrop-blur-md border border-emerald-800/60 rounded-2xl p-5 shadow-sm">
              <div className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-400">
                Digital Signal
              </div>
              <div className="font-serif-instrument text-3xl font-bold text-white mt-1">
                1.4kg
              </div>
              <div className="text-xs text-emerald-200/70 mt-1 font-medium">
                kg hiding behind the screen
              </div>
            </div>

            <div 
              onClick={onNavigateLog}
              className="bg-emerald-950/60 backdrop-blur-md border border-emerald-800/60 rounded-2xl p-5 shadow-sm hover:border-emerald-500 transition-all cursor-pointer group"
            >
              <div className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-400">
                Your Next Small Move
              </div>
              <div className="font-serif-instrument text-2xl font-bold text-white mt-1">
                Make one meal plant-forward
              </div>
              <div className="text-xs font-bold text-emerald-300 mt-2 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                <span>Follow the thread</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= LIGHT SAGE SECTION (IMAGE 2 BOTTOM) ================= */}
      <section className="relative rounded-[2.5rem] bg-[#E9F0E8] p-8 sm:p-12 border border-emerald-900/10 text-[#1B2B1E] shadow-xs">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left: The Idea Behind the Twin */}
          <div className="lg:col-span-5 space-y-4">
            <div className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-widest text-[#2F8F5B]">
              <span>🌱</span>
              <span>The Idea Behind The Twin</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-serif-instrument tracking-tight leading-tight text-[#1B2B1E] font-normal">
              This is your<br />
              <span className="font-serif-instrument font-normal">Bytefootprint</span> <span className="font-serif-instrument italic text-[#2F8F5B]">X EcoTwin.</span>
            </h2>

            <p className="text-xs sm:text-sm text-gray-600 font-medium leading-relaxed">
              Every habit you log — every ride, every meal, every stream — feeds this tree. It isn't a graph. It isn't a score. It's alive, in the only way we could make it feel that way: it grows when you do right by it, and it fades when you don't. Don't let it dry out.
            </p>
          </div>

          {/* Right: Five Growth Stages Preview Strip */}
          <div className="lg:col-span-7 flex flex-col justify-between">
            <div className="flex items-center justify-between text-[10px] font-extrabold uppercase tracking-wider text-gray-500 mb-4">
              <span>Five Growth Stages</span>
              <span>Your Twin, Over Time</span>
            </div>

            {/* 5 Cards Row */}
            <div className="grid grid-cols-5 gap-2 sm:gap-3">
              {([1, 2, 3, 4, 5] as TwinStage[]).map((s) => {
                const info = TWIN_STAGES[s];
                const isActive = stage === s;
                return (
                  <div
                    key={s}
                    className={`rounded-2xl p-2 sm:p-3 text-center flex flex-col items-center justify-between transition-all overflow-hidden ${
                      isActive
                        ? 'bg-white border-2 border-[#2F8F5B] shadow-md scale-105'
                        : 'bg-white/60 border border-emerald-900/10 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <div className="w-full h-16 sm:h-20 flex items-center justify-center my-1 pointer-events-none overflow-hidden">
                      <EcoTwinTree stage={s} isRustling={false} previewOnly={true} heroDisplay={false} />
                    </div>
                    <div className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-[#1B2B1E] mt-1 truncate max-w-full">
                      {info.name}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
