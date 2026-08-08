import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Challenge } from '../types';
import { CheckCircle2, Sparkles, Monitor, Car, Utensils, Zap, Trophy, ShieldCheck, Target, Flame, Play } from 'lucide-react';

interface TodayChallengeCardProps {
  challenge: Challenge;
  isCompleted: boolean;
  onComplete: (challengeId: string) => void;
  worstCategory?: string;
}

export const TodayChallengeCard: React.FC<TodayChallengeCardProps> = ({
  challenge,
  isCompleted,
  onComplete,
  worstCategory = 'digital'
}) => {
  const [isAccepted, setIsAccepted] = useState(false);

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'digital': return <Monitor className="w-4 h-4 text-amber-600" />;
      case 'transport': return <Car className="w-4 h-4 text-emerald-600" />;
      case 'food': return <Utensils className="w-4 h-4 text-emerald-600" />;
      case 'energy': return <Zap className="w-4 h-4 text-emerald-600" />;
      default: return <Sparkles className="w-4 h-4 text-emerald-600" />;
    }
  };

  const getDifficulty = (points: number) => {
    if (points >= 20) return { label: 'Heroic', color: 'bg-rose-100 text-rose-800 border-rose-300' };
    if (points >= 15) return { label: 'Medium', color: 'bg-amber-100 text-amber-900 border-amber-300' };
    return { label: 'Easy', color: 'bg-emerald-100 text-emerald-900 border-emerald-300' };
  };

  const isDigital = challenge.category === 'digital';
  const difficulty = getDifficulty(challenge.points);

  return (
    <motion.div
      whileHover={{ y: -2 }}
      className={`rounded-3xl p-5 md:p-6 shadow-sm border transition-all relative overflow-hidden ${
        isDigital
          ? 'bg-amber-50/80 border-amber-300/80 shadow-amber-900/5'
          : 'bg-white border-emerald-900/10 shadow-emerald-900/5'
      }`}
    >
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1B2B1E] text-emerald-300 text-xs font-black tracking-wide shadow-sm">
            <Target className="w-3.5 h-3.5 text-emerald-400" />
            <span>Mission of the Day</span>
          </span>

          <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-extrabold border ${difficulty.color}`}>
            {difficulty.label}
          </span>
        </div>

        <span className="inline-flex items-center gap-1 text-xs font-black text-[#2F8F5B] bg-emerald-100/90 px-3 py-1 rounded-xl">
          <Trophy className="w-3.5 h-3.5 text-emerald-700" />
          +{challenge.points} XP
        </span>
      </div>

      {/* Challenge Title & Description */}
      <div className="mb-4">
        <h3 className="text-lg font-black text-[#1B2B1E] mb-1 flex items-center gap-2">
          {getCategoryIcon(challenge.category)}
          <span>{challenge.title}</span>
        </h3>
        <p className="text-xs text-gray-600 leading-relaxed font-medium">
          {challenge.description}
        </p>
      </div>

      {/* Digital Insight Fact */}
      {challenge.digitalFact && (
        <div className="mb-4 p-3 rounded-2xl bg-amber-100/90 border border-amber-300/80 text-amber-950 text-xs font-medium flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-700 shrink-0" />
          <span><strong>Digital Insight:</strong> {challenge.digitalFact}</span>
        </div>
      )}

      {/* Footer Info & Quest Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-gray-100">
        <div className="text-xs font-bold text-gray-600 flex items-center gap-1.5">
          <span>Estimated CO₂ Saved:</span>
          <span className="px-2 py-0.5 rounded-lg bg-emerald-100 text-[#2F8F5B] font-extrabold">
            -{challenge.impactKgSaved} kg CO₂e
          </span>
        </div>

        {isCompleted ? (
          <div className="flex items-center gap-1.5 px-5 py-2.5 rounded-2xl bg-emerald-100 text-emerald-900 text-xs font-black border border-emerald-300">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Mission Completed Today! (+{challenge.points} XP)</span>
          </div>
        ) : !isAccepted ? (
          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setIsAccepted(true)}
              className="px-4 py-2.5 rounded-2xl bg-emerald-800 hover:bg-emerald-900 text-emerald-100 font-extrabold text-xs flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 text-emerald-300" />
              <span>Accept Mission</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onComplete(challenge.id)}
              className={`px-5 py-2.5 rounded-2xl font-extrabold text-xs flex items-center gap-1.5 shadow-sm cursor-pointer transition-colors ${
                isDigital
                  ? 'bg-amber-600 hover:bg-amber-700 text-white'
                  : 'bg-[#2F8F5B] hover:bg-[#287A4D] text-white'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Mark Completed</span>
            </motion.button>
          </div>
        ) : (
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onComplete(challenge.id)}
            className={`px-6 py-2.5 rounded-2xl font-black text-xs flex items-center gap-2 shadow-md cursor-pointer transition-all animate-pulse ${
              isDigital
                ? 'bg-amber-600 hover:bg-amber-700 text-white'
                : 'bg-[#2F8F5B] hover:bg-[#287A4D] text-white'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Complete Mission Now</span>
          </motion.button>
        )}
      </div>
    </motion.div>
  );
};

