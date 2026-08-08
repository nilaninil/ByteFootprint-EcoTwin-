import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LogEntry, TwinStage } from '../types';
import { TWIN_STAGES } from '../data/staticData';
import { deriveTwinStage } from '../services/storage';
import { EcoTwinTree } from './EcoTwinTree';
import {
  Calendar,
  Sparkles,
  TrendingUp,
  Leaf,
  Filter,
  ChevronRight,
  Award,
  Clock,
  Zap,
  Info,
  Layers,
  CheckCircle2,
  Lock
} from 'lucide-react';

interface TreeTimelineGalleryProps {
  history: LogEntry[];
}

export const TreeTimelineGallery: React.FC<TreeTimelineGalleryProps> = ({ history }) => {
  const [selectedStageFilter, setSelectedStageFilter] = useState<number | 'all'>('all');
  const [selectedLogId, setSelectedLogId] = useState<string | null>(
    history.length > 0 ? history[history.length - 1].id : null
  );

  if (!history || history.length === 0) {
    return null;
  }

  // Calculate timeline entries with derived cumulative stage at each historical step
  const timelineEntries = history.map((log, idx) => {
    const subHistory = history.slice(0, idx + 1);
    const stage = deriveTwinStage(subHistory);
    const stageInfo = TWIN_STAGES[stage];

    // Check if this log represents a stage change compared to previous log
    const prevStage = idx > 0 ? deriveTwinStage(history.slice(0, idx)) : 3;
    const isStageTransition = idx === 0 || stage !== prevStage;

    return {
      log,
      dayIndex: idx + 1,
      stage,
      stageInfo,
      isStageTransition,
      prevStage
    };
  });

  // Calculate unlocked stages summary
  const stagesUnlockedMap: Record<number, { unlocked: boolean; firstUnlockedDate?: string; count: number }> = {
    1: { unlocked: false, count: 0 },
    2: { unlocked: false, count: 0 },
    3: { unlocked: false, count: 0 },
    4: { unlocked: false, count: 0 },
    5: { unlocked: false, count: 0 }
  };

  timelineEntries.forEach(entry => {
    const st = entry.stage;
    if (stagesUnlockedMap[st]) {
      if (!stagesUnlockedMap[st].unlocked) {
        stagesUnlockedMap[st].unlocked = true;
        stagesUnlockedMap[st].firstUnlockedDate = entry.log.date;
      }
      stagesUnlockedMap[st].count += 1;
    }
  });

  // Filtered timeline entries
  const filteredEntries = selectedStageFilter === 'all'
    ? timelineEntries
    : timelineEntries.filter(e => e.stage === selectedStageFilter);

  // Selected log detail
  const activeEntry = timelineEntries.find(e => e.log.id === selectedLogId) || timelineEntries[timelineEntries.length - 1];

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-emerald-900/10 space-y-8">
      {/* Header Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-gray-100">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100/80 text-[#2F8F5B] text-xs font-extrabold mb-2 border border-emerald-200/60">
            <Clock className="w-3.5 h-3.5" />
            Historical EcoTwin Gallery
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#1B2B1E] tracking-tight">
            Tree Growth Timeline & Stage History
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 font-medium mt-1">
            Visual journey of your EcoTwin tree's evolution through habits logged over time.
          </p>
        </div>

        {/* Milestone Count Badge */}
        <div className="flex items-center gap-2 self-start md:self-auto">
          <div className="px-3.5 py-2 rounded-2xl bg-[#F6FAF4] border border-emerald-200/80 text-emerald-900 text-xs font-bold flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span>{Object.values(stagesUnlockedMap).filter(s => s.unlocked).length} of 5 Stages Unlocked</span>
          </div>
        </div>
      </div>

      {/* STAGE UNLOCK GALLERY CARDS (1 to 5) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-extrabold text-[#1B2B1E] uppercase tracking-wider flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-emerald-600" />
            <span>Growth Stage Milestones</span>
          </h3>
          <span className="text-[11px] text-gray-500 font-medium">Click a stage to filter timeline</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
          {([1, 2, 3, 4, 5] as TwinStage[]).map(st => {
            const info = TWIN_STAGES[st];
            const stats = stagesUnlockedMap[st];
            const isSelected = selectedStageFilter === st;

            return (
              <button
                key={st}
                onClick={() => setSelectedStageFilter(isSelected ? 'all' : st)}
                className={`p-3 rounded-2xl text-left transition-all duration-200 border cursor-pointer relative overflow-hidden ${
                  stats.unlocked
                    ? isSelected
                      ? 'bg-emerald-900 text-white border-emerald-800 shadow-md ring-2 ring-emerald-500/30'
                      : 'bg-emerald-50/60 hover:bg-emerald-100/70 border-emerald-200/80 text-emerald-950'
                    : 'bg-gray-50/80 border-gray-200 text-gray-400 opacity-60'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                    isSelected
                      ? 'bg-white/20 text-white'
                      : stats.unlocked
                        ? 'bg-emerald-200/80 text-emerald-900'
                        : 'bg-gray-200 text-gray-500'
                  }`}>
                    Stage {st}
                  </span>
                  {stats.unlocked ? (
                    <CheckCircle2 className={`w-3.5 h-3.5 ${isSelected ? 'text-emerald-300' : 'text-emerald-600'}`} />
                  ) : (
                    <Lock className="w-3.5 h-3.5 text-gray-400" />
                  )}
                </div>

                <div className="font-extrabold text-xs sm:text-sm truncate" style={{ color: !isSelected && stats.unlocked ? info.color : undefined }}>
                  {info.name}
                </div>

                <div className="mt-2 text-[10px] font-medium leading-tight">
                  {stats.unlocked ? (
                    <span className={isSelected ? 'text-emerald-200' : 'text-gray-500'}>
                      {stats.count} {stats.count === 1 ? 'day' : 'days'} active
                    </span>
                  ) : (
                    <span className="text-gray-400 italic">Locked</span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* FILTER CLEAR PILL */}
      {selectedStageFilter !== 'all' && (
        <div className="flex items-center justify-between px-4 py-2 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-semibold">
          <span>Filtering by <strong>Stage {selectedStageFilter}: {TWIN_STAGES[selectedStageFilter as TwinStage].name}</strong></span>
          <button
            onClick={() => setSelectedStageFilter('all')}
            className="text-amber-700 hover:text-amber-950 underline cursor-pointer text-xs font-bold ml-2"
          >
            Show All ({timelineEntries.length})
          </button>
        </div>
      )}

      {/* MAIN TIMELINE & PREVIEW SPLIT VIEW */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: TIMELINE FEED (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-gradient-to-b before:from-emerald-300 before:via-emerald-500 before:to-teal-600">
            {filteredEntries.map(({ log, dayIndex, stage, stageInfo, isStageTransition }) => {
              const isSelected = activeEntry.log.id === log.id;

              return (
                <div key={log.id} className="relative group">
                  {/* Timeline Node Dot */}
                  <div
                    className={`absolute -left-[23px] top-4 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                      isSelected
                        ? 'bg-[#2F8F5B] border-white shadow-md ring-4 ring-emerald-500/20 scale-125 z-10'
                        : isStageTransition
                          ? 'bg-amber-400 border-white shadow-xs'
                          : 'bg-emerald-100 border-emerald-400'
                    }`}
                  >
                    {isStageTransition && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                  </div>

                  {/* Log Card */}
                  <motion.div
                    whileHover={{ x: 3 }}
                    onClick={() => setSelectedLogId(log.id)}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all duration-200 ${
                      isSelected
                        ? 'bg-[#F6FAF4] border-[#2F8F5B] ring-2 ring-[#2F8F5B]/20 shadow-sm'
                        : 'bg-white border-gray-200/80 hover:border-emerald-300 hover:bg-gray-50/80'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-black text-[#1B2B1E]">Day {dayIndex}</span>
                          <span className="text-xs text-gray-500 font-medium">• {log.date}</span>
                        </div>
                        {isStageTransition && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-extrabold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-md mt-1 border border-amber-200">
                            <Sparkles className="w-3 h-3 text-amber-600" />
                            Stage Milestone: {stageInfo.name} Tree
                          </span>
                        )}
                      </div>

                      {/* Stage Badge */}
                      <span
                        className="px-2.5 py-1 rounded-xl text-[10px] font-extrabold text-white shrink-0 shadow-2xs"
                        style={{ backgroundColor: stageInfo.color }}
                      >
                        Stage {stage}: {stageInfo.name}
                      </span>
                    </div>

                    {/* Stats & Category Pills */}
                    <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-gray-100 text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-[#1B2B1E] text-sm">{log.totalFootprint} kg</span>
                        <span className="text-[10px] text-gray-500">CO2e</span>
                      </div>

                      <div className="flex items-center gap-1.5 text-[10px] font-semibold">
                        <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-800 border border-blue-100">
                          🚘 {log.footprintByCategory.transport}kg
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-100">
                          🥗 {log.footprintByCategory.food}kg
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-purple-50 text-purple-800 border border-purple-100">
                          ⚡ {log.footprintByCategory.energy}kg
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-900 border border-amber-200 font-bold">
                          📱 {log.footprintByCategory.digital}kg
                        </span>
                      </div>
                    </div>
                  </motion.div>
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT COLUMN: STAGE PREVIEW & REFLECTION (5 Cols) */}
        <div className="lg:col-span-5 sticky top-20 space-y-4">
          <div className="glass-card-light rounded-3xl p-6 border border-white/80 shadow-md text-center space-y-4 relative overflow-hidden">
            {/* Background Soft Glow */}
            <div
              className="absolute -top-12 -right-12 w-48 h-48 rounded-full opacity-20 blur-2xl pointer-events-none"
              style={{ backgroundColor: activeEntry.stageInfo.color }}
            />

            <div className="flex items-center justify-between text-left">
              <div>
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">
                  Historical Tree Inspection
                </span>
                <h4 className="text-base font-extrabold text-[#1B2B1E]">
                  Day {activeEntry.dayIndex} • {activeEntry.log.date}
                </h4>
              </div>
              <span
                className="px-3 py-1 rounded-full text-xs font-extrabold text-white shadow-xs"
                style={{ backgroundColor: activeEntry.stageInfo.color }}
              >
                Stage {activeEntry.stage}
              </span>
            </div>

            {/* Tree Canvas Preview */}
            <div className="py-2 bg-gradient-to-b from-emerald-50/50 to-white rounded-2xl border border-emerald-100/60 shadow-inner">
              <EcoTwinTree stage={activeEntry.stage} previewOnly={true} />
            </div>

            {/* Stage Description & Status */}
            <div className="text-left space-y-2 bg-white/80 p-4 rounded-2xl border border-emerald-900/10 text-xs">
              <div className="flex items-center gap-1.5 font-bold text-[#1B2B1E]">
                <Leaf className="w-4 h-4 text-emerald-600" />
                <span>{activeEntry.stageInfo.name} Tree Stage</span>
              </div>
              <p className="text-gray-600 leading-relaxed font-medium">
                {activeEntry.stageInfo.description}
              </p>

              <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-[11px]">
                <span className="text-gray-500">Day Footprint Total:</span>
                <span className="font-extrabold text-emerald-900">{activeEntry.log.totalFootprint} kg CO2e</span>
              </div>
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-gray-500">Highest Emission Category:</span>
                <span className="font-extrabold capitalize text-amber-900 bg-amber-100 px-2 py-0.5 rounded">
                  {activeEntry.log.worstCategory}
                </span>
              </div>
            </div>

            {/* Micro Reflection Tip */}
            <div className="text-left p-3 rounded-2xl bg-[#1B2B1E] text-white text-[11px] leading-relaxed flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-emerald-300 block mb-0.5">Historical Insight</span>
                {activeEntry.log.footprintByCategory.digital > 1.0
                  ? `On ${activeEntry.log.date}, high digital streaming (${activeEntry.log.streamingHours}h) added ${activeEntry.log.footprintByCategory.digital}kg to your carbon total.`
                  : `On ${activeEntry.log.date}, conscious low-carbon choices helped keep your tree vibrant and thriving!`}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
