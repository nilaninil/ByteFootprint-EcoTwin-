import React from 'react';
import { motion } from 'motion/react';
import { LogEntry } from '../types';
import { Calendar, Flame, CheckCircle2, Leaf, Sparkles, Plus, Award } from 'lucide-react';

interface StreakCalendarProps {
  history: LogEntry[];
  streakDays: number;
  onNavigateLog?: () => void;
}

export const StreakCalendar: React.FC<StreakCalendarProps> = ({
  history,
  streakDays,
  onNavigateLog
}) => {
  // Generate array for the last 7 days ending today
  const today = new Date();
  
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() - (6 - i));
    const dateStr = d.toISOString().split('T')[0];
    
    // Find log entry for this date
    const logEntry = history.find(entry => entry.date === dateStr);
    
    // Formatting for display
    const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
    const dayNum = d.getDate();
    const monthName = d.toLocaleDateString('en-US', { month: 'short' });
    const isToday = i === 6;

    return {
      dateStr,
      dayName,
      dayNum,
      monthName,
      isToday,
      isLogged: Boolean(logEntry),
      footprint: logEntry?.totalFootprint,
      worstCategory: logEntry?.worstCategory
    };
  });

  const loggedDaysCount = last7Days.filter(d => d.isLogged).length;
  const completionPercentage = Math.round((loggedDaysCount / 7) * 100);

  return (
    <div className="glass-card-light rounded-3xl p-6 shadow-sm border border-white/80 space-y-4">
      {/* Header with Streak count & Consistency status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-emerald-900/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 text-white flex items-center justify-center shadow-md shadow-orange-500/20">
            <Flame className="w-5 h-5 fill-amber-100" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-base text-[#1B2B1E]">Consistency & Streak Tracker</h3>
              <span className="px-2.5 py-0.5 rounded-full bg-orange-100 text-orange-800 text-[11px] font-extrabold flex items-center gap-1 border border-orange-200">
                <Flame className="w-3 h-3 text-orange-600 fill-orange-500" />
                {streakDays} Day Streak
              </span>
            </div>
            <p className="text-xs text-gray-500 font-medium">
              Last 7 Days • {loggedDaysCount} of 7 days logged ({completionPercentage}% consistency)
            </p>
          </div>
        </div>

        {/* Consistency rating pill */}
        <div className="self-start sm:self-auto flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold">
          <Award className="w-3.5 h-3.5 text-emerald-600" />
          <span>
            {loggedDaysCount >= 6 ? '⭐ Excellent Habit' : loggedDaysCount >= 4 ? '🌿 Steady Progress' : '🌱 Build Momentum'}
          </span>
        </div>
      </div>

      {/* 7-Day Grid Layout */}
      <div className="grid grid-cols-7 gap-2 sm:gap-3">
        {last7Days.map((day, idx) => {
          return (
            <motion.div
              key={day.dateStr}
              initial={{ opacity: 0, scale: 0.9, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: idx * 0.05, duration: 0.3 }}
              className={`relative rounded-2xl p-2 sm:p-3 flex flex-col items-center justify-between text-center transition-all duration-300 border ${
                day.isLogged
                  ? day.isToday
                    ? 'bg-gradient-to-b from-emerald-500 to-[#2F8F5B] text-white border-emerald-400 shadow-md ring-2 ring-emerald-500/30'
                    : 'bg-emerald-50/90 hover:bg-emerald-100/90 text-emerald-950 border-emerald-200/80 shadow-xs'
                  : day.isToday
                    ? 'bg-amber-50/90 border-amber-300 text-amber-950 ring-2 ring-amber-400/40'
                    : 'bg-gray-50/70 border-dashed border-gray-200 text-gray-400'
              }`}
            >
              {/* Today Badge */}
              {day.isToday && (
                <span className={`absolute -top-2.5 left-1/2 -translate-x-1/2 px-1.5 py-0.2 rounded-md text-[9px] font-extrabold uppercase tracking-wider ${
                  day.isLogged ? 'bg-white text-emerald-800 shadow-xs' : 'bg-amber-500 text-white'
                }`}>
                  Today
                </span>
              )}

              {/* Day Label & Date */}
              <div className="mt-1">
                <span className={`block text-[10px] uppercase font-extrabold ${
                  day.isLogged && day.isToday
                    ? 'text-emerald-100'
                    : day.isLogged
                      ? 'text-emerald-700'
                      : 'text-gray-400'
                }`}>
                  {day.dayName}
                </span>
                <span className={`text-xs font-black ${
                  day.isLogged && day.isToday ? 'text-white' : day.isLogged ? 'text-[#1B2B1E]' : 'text-gray-400'
                }`}>
                  {day.dayNum}
                </span>
              </div>

              {/* Status Indicator Circle / Icon */}
              <div className="my-1.5">
                {day.isLogged ? (
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center ${
                    day.isToday ? 'bg-white/20 text-white' : 'bg-emerald-200/80 text-emerald-800'
                  }`}>
                    <CheckCircle2 className="w-4 h-4 fill-emerald-600 text-white" />
                  </div>
                ) : (
                  <div className="w-7 h-7 rounded-full bg-gray-200/50 flex items-center justify-center text-gray-300">
                    <div className="w-2.5 h-2.5 rounded-full bg-gray-300" />
                  </div>
                )}
              </div>

              {/* Footprint / Action Tag */}
              <div className="w-full">
                {day.isLogged ? (
                  <span className={`block text-[10px] font-extrabold truncate ${
                    day.isToday ? 'text-emerald-50' : 'text-emerald-800'
                  }`}>
                    {day.footprint?.toFixed(1)}kg
                  </span>
                ) : day.isToday && onNavigateLog ? (
                  <button
                    onClick={onNavigateLog}
                    className="w-full py-0.5 px-1 rounded-lg bg-amber-500 hover:bg-amber-600 text-white text-[9px] font-bold transition-all flex items-center justify-center gap-0.5 cursor-pointer shadow-2xs"
                    title="Log today's habits"
                  >
                    <Plus className="w-2.5 h-2.5" /> Log
                  </button>
                ) : (
                  <span className="block text-[9px] font-semibold text-gray-300">
                    Missed
                  </span>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Bottom Tip / Encouragement banner */}
      <div className="pt-2 flex items-center justify-between text-xs text-gray-600">
        <span className="flex items-center gap-1.5 text-emerald-900 font-medium text-[11px]">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          Logging habits daily keeps your EcoTwin vibrant & maintains your active streak score.
        </span>
        {onNavigateLog && (
          <button
            onClick={onNavigateLog}
            className="text-xs font-bold text-[#2F8F5B] hover:underline shrink-0 cursor-pointer"
          >
            + Log Activity
          </button>
        )}
      </div>
    </div>
  );
};
