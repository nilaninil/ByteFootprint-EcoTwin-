import React from 'react';
import { motion } from 'motion/react';
import { TwinStage, LogEntry } from '../types';
import { TWIN_STAGES } from '../data/staticData';
import { Sparkles, Calendar, Trophy, CheckCircle2, ShieldCheck, Heart } from 'lucide-react';

interface EcoTwinTimelineProps {
  currentStage: TwinStage;
  history: LogEntry[];
  greenScore: number;
}

export const EcoTwinTimeline: React.FC<EcoTwinTimelineProps> = ({
  currentStage,
  history,
  greenScore
}) => {
  const STAGE_NODES = [
    { stage: 1, icon: '🌱', title: 'Seedling / Wilted', minScore: 0 },
    { stage: 2, icon: '🌿', title: 'Recovering Shoot', minScore: 40 },
    { stage: 3, icon: '🌳', title: 'Budding Canopy', minScore: 60 },
    { stage: 4, icon: '🌲', title: 'Thriving Tree', minScore: 75 },
    { stage: 5, icon: '✨', title: 'Flourishing Oasis', minScore: 90 }
  ];

  return (
    <div className="bg-white/90 backdrop-blur-md rounded-3xl p-6 shadow-sm border border-emerald-900/10 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-xl bg-emerald-100 text-[#2F8F5B]">
              <Sparkles className="w-4 h-4" />
            </span>
            <h3 className="font-extrabold text-base text-[#1B2B1E]">
              EcoTwin Evolution Timeline
            </h3>
          </div>
          <p className="text-xs text-gray-500 mt-0.5">
            Track your living companion's milestone growth stages as your habits improve!
          </p>
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-[#2F8F5B]">
          <Heart className="w-3.5 h-3.5 fill-emerald-500 text-emerald-500" />
          <span>Stage {currentStage}: {TWIN_STAGES[currentStage]?.name}</span>
        </div>
      </div>

      {/* Horizontal Evolution Progress Line */}
      <div className="relative pt-4 pb-2 px-2 overflow-x-auto scrollbar-none">
        {/* Background Connecting Bar */}
        <div className="absolute top-10 left-8 right-8 h-1.5 bg-gray-100 rounded-full z-0" />
        <div
          className="absolute top-10 left-8 h-1.5 bg-gradient-to-r from-emerald-400 to-[#2F8F5B] rounded-full z-0 transition-all duration-700"
          style={{ width: `${Math.min(100, Math.max(0, ((currentStage - 1) / 4) * 100))}%` }}
        />

        {/* Nodes Container */}
        <div className="relative z-10 flex items-center justify-between min-w-[500px]">
          {STAGE_NODES.map((node) => {
            const isReached = currentStage >= node.stage;
            const isCurrent = currentStage === node.stage;

            return (
              <motion.div
                key={`stage-node-${node.stage}`}
                whileHover={{ scale: 1.05 }}
                className="flex flex-col items-center text-center group cursor-pointer"
              >
                {/* Node Symbol Circle */}
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl shadow-sm transition-all duration-300 relative ${
                    isCurrent
                      ? 'bg-[#2F8F5B] text-white ring-4 ring-emerald-200 scale-110 shadow-lg shadow-emerald-700/20'
                      : isReached
                      ? 'bg-emerald-100 text-emerald-900 border-2 border-emerald-400'
                      : 'bg-gray-100 text-gray-400 border border-gray-200 opacity-60'
                  }`}
                >
                  <span>{node.icon}</span>
                  {isCurrent && (
                    <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border border-white"></span>
                    </span>
                  )}
                </div>

                {/* Title & Min Score */}
                <div className="mt-2.5 max-w-[90px]">
                  <span className={`block text-xs font-bold leading-tight ${isCurrent ? 'text-[#2F8F5B]' : isReached ? 'text-gray-800' : 'text-gray-400'}`}>
                    {node.title}
                  </span>
                  <span className="block text-[10px] text-gray-400 mt-0.5 font-medium">
                    {node.minScore}+ pts
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* History Milestones Log */}
      {history.length > 0 && (
        <div className="pt-2 border-t border-gray-100">
          <div className="flex items-center justify-between text-xs text-gray-500 font-semibold mb-2">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-gray-400" />
              <span>Recent Companion Growth Logs</span>
            </span>
            <span className="text-[11px] text-emerald-700">{history.length} Days Recorded</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {history.slice(-4).map((entry, idx) => (
              <div key={idx} className="p-2.5 rounded-2xl bg-emerald-50/60 border border-emerald-100 flex items-center justify-between text-xs">
                <div>
                  <span className="block font-bold text-[#1B2B1E] text-[11px]">{entry.date}</span>
                  <span className="text-[10px] text-gray-500">{(entry.totalFootprint ?? 0).toFixed(1)} kg CO₂e</span>
                </div>
                <div className="px-2 py-0.5 rounded-lg bg-emerald-100 text-emerald-800 font-extrabold text-[11px]">
                  {(TWIN_STAGES[currentStage]?.name || 'Stage').slice(0, 8)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
