import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LogEntry } from '../types';
import { Monitor, AlertTriangle, ArrowRight, Sparkles, CheckCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

interface RevealModalProps {
  entry: LogEntry | null;
  onClose: () => void;
  onGoToChallenge: () => void;
  newlyUnlockedBadges?: string[];
}

export const RevealModal: React.FC<RevealModalProps> = ({
  entry,
  onClose,
  onGoToChallenge,
  newlyUnlockedBadges = []
}) => {
  if (!entry) return null;

  // Trigger celebration confetti
  React.useEffect(() => {
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#2F8F5B', '#7FC98F', '#C97F1E', '#FBBF24']
    });
  }, []);

  const getWorstCategoryLabel = (cat: string) => {
    switch (cat) {
      case 'digital': return 'Digital Footprint (Streaming, Cloud & Emails)';
      case 'transport': return 'Transportation & Vehicle Travel';
      case 'food': return 'Meals & Diet Selection';
      case 'energy': return 'Household & Appliance Energy';
      default: return cat;
    }
  };

  const getDigitalFact = () => {
    if (entry.streamingQuality === '4K' && entry.streamingHours >= 1) {
      return `One hour of 4K video streaming (350g CO2) emitted more carbon than an electric scooter ride!`;
    }
    if (entry.cloudBackupGB >= 15) {
      return `Storing ${entry.cloudBackupGB}GB in active cloud servers generates ~${(entry.cloudBackupGB * 2).toFixed(0)}g CO2 daily for 24/7 data center cooling.`;
    }
    return `Digital energy is invisible — data centers and network routers process every byte you stream!`;
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="bg-white rounded-3xl p-6 md:p-8 max-w-lg w-full shadow-2xl border border-emerald-100 relative text-[#1B2B1E] overflow-hidden"
        >
          {/* Header Badge */}
          <div className="flex items-center justify-between mb-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-[#2F8F5B] text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              Pulse Logged Successfully
            </span>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 font-bold flex items-center justify-center transition-colors"
            >
              ✕
            </button>
          </div>

          <h3 className="text-xl font-bold text-[#1B2B1E]">Today's Footprint Summary</h3>
          <p className="text-xs text-gray-500 mt-1">Your total carbon footprint for today has been calculated.</p>

          {/* Big Footprint Display */}
          <div className="my-5 p-5 rounded-2xl bg-[#F6FAF4] border border-emerald-200 flex items-center justify-between">
            <div>
              <span className="block text-xs uppercase tracking-wider font-semibold text-gray-500">Total Emissions</span>
              <span className="text-3xl font-extrabold text-[#2F8F5B]">
                {entry.totalFootprint} <span className="text-base font-semibold">kg CO2e</span>
              </span>
            </div>
            <div className="text-right">
              <span className="text-xs font-semibold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-lg inline-block">
                EcoTwin Updated
              </span>
            </div>
          </div>

          {/* WORST CATEGORY REVEAL */}
          <div className={`p-4 rounded-2xl border text-xs space-y-2 mb-4 ${
            entry.worstCategory === 'digital'
              ? 'bg-amber-50 border-amber-300 text-amber-950'
              : 'bg-emerald-50 border-emerald-200 text-emerald-950'
          }`}>
            <div className="flex items-center gap-2 font-bold text-sm">
              {entry.worstCategory === 'digital' ? (
                <Monitor className="w-5 h-5 text-amber-600 shrink-0" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-emerald-600 shrink-0" />
              )}
              <span>Largest Impact Today: {getWorstCategoryLabel(entry.worstCategory)}</span>
            </div>

            <p className="text-gray-700">
              This category accounted for <strong>{entry.footprintByCategory[entry.worstCategory]} kg CO2e</strong> ({Math.round((entry.footprintByCategory[entry.worstCategory] / entry.totalFootprint) * 100)}% of today's total).
            </p>

            {/* Special One-Line Factual Callout for Digital */}
            {entry.worstCategory === 'digital' && (
              <div className="mt-2 p-2.5 rounded-xl bg-amber-100 border border-amber-300 text-amber-900 font-semibold text-xs flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-700 shrink-0" />
                <span>{getDigitalFact()}</span>
              </div>
            )}
          </div>

          {/* Newly Unlocked Badges Alert */}
          {newlyUnlockedBadges.length > 0 && (
            <div className="mb-4 p-3 rounded-2xl bg-yellow-50 border border-yellow-300 text-yellow-900 text-xs font-semibold flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-yellow-600" />
              <span>🏆 Unlocked {newlyUnlockedBadges.length} new badge(s)! Check your Badges shelf.</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-2 mt-5">
            <button
              onClick={onGoToChallenge}
              className="flex-1 py-3 px-4 rounded-2xl bg-[#2F8F5B] hover:bg-[#287A4D] text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md"
            >
              <span>View Today's Challenge</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="py-3 px-4 rounded-2xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-xs transition-all"
            >
              Back to Home
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
