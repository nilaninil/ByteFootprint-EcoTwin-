import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ALL_BADGES } from '../data/staticData';
import { Badge as BadgeType, AppData } from '../types';
import { Trophy, ShieldCheck, Lock, Flame, Zap, Sprout, WifiOff, TreePine, CheckCircle2, Crown, Scale, Sparkles, Leaf } from 'lucide-react';

interface BadgesViewProps {
  appData: AppData;
}

export const BadgesView: React.FC<BadgesViewProps> = ({ appData }) => {
  const [selectedBadge, setSelectedBadge] = useState<BadgeType | null>(null);

  const unlockedSet = new Set(appData.badgesUnlocked || []);

  const renderBadgeIcon = (iconName: string, isUnlocked: boolean) => {
    const cls = `w-7 h-7 ${isUnlocked ? 'text-amber-500' : 'text-gray-400'}`;
    switch (iconName) {
      case 'Sprout': return <Sprout className={cls} />;
      case 'Zap': return <Zap className={cls} />;
      case 'Flame': return <Flame className={cls} />;
      case 'WifiOff': return <WifiOff className={cls} />;
      case 'TreePine': return <TreePine className={cls} />;
      case 'CheckCircle2': return <CheckCircle2 className={cls} />;
      case 'Crown': return <Crown className={cls} />;
      case 'Scale': return <Scale className={cls} />;
      default: return <Trophy className={cls} />;
    }
  };

  const unlockedCount = unlockedSet.size;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header Shelf Summary */}
      <div className="bg-white/90 backdrop-blur-md rounded-3xl p-6 shadow-sm border border-emerald-900/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-[#1B2B1E] flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-500" />
            <span>Achievement Badges Shelf</span>
          </h2>
          <p className="text-xs text-gray-500 mt-0.5 font-medium">
            Unlock badges by maintaining habit streaks, lowering digital carbon, and helping your EcoTwin flourish!
          </p>
        </div>

        <div className="flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-[#F6FAF4] border border-emerald-200 shadow-xs">
          <ShieldCheck className="w-6 h-6 text-[#2F8F5B]" />
          <div>
            <span className="block text-[10px] uppercase font-extrabold text-gray-500">Unlocked Badges</span>
            <span className="text-base font-black text-[#2F8F5B]">
              {unlockedCount} / {ALL_BADGES.length}
            </span>
          </div>
        </div>
      </div>

      {/* Badges Grid Shelf */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {ALL_BADGES.map((badge) => {
          const isUnlocked = unlockedSet.has(badge.id);

          return (
            <motion.div
              key={badge.id}
              whileHover={{ y: -4, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedBadge(badge)}
              className={`p-5 rounded-3xl border transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between shadow-xs ${
                isUnlocked
                  ? 'bg-white border-amber-300 shadow-amber-900/10 shadow-md hover:border-amber-400'
                  : 'bg-gray-50/80 border-gray-200 opacity-75 hover:opacity-100 hover:bg-white'
              }`}
            >
              {/* Lock / Unlock Ribbon */}
              <div className="flex items-center justify-between mb-3">
                <div className={`p-3 rounded-2xl relative ${isUnlocked ? 'bg-amber-100/90 shadow-inner' : 'bg-gray-200/60'}`}>
                  {renderBadgeIcon(badge.iconName, isUnlocked)}
                  {isUnlocked && (
                    <Sparkles className="w-3.5 h-3.5 text-amber-500 absolute -top-1 -right-1 animate-ping" />
                  )}
                </div>

                {isUnlocked ? (
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-amber-100 text-amber-950 border border-amber-300">
                    Unlocked ✨
                  </span>
                ) : (
                  <span className="p-1.5 rounded-full bg-gray-200 text-gray-500" title="Locked badge">
                    <Lock className="w-3.5 h-3.5" />
                  </span>
                )}
              </div>

              <div>
                <h3 className={`font-extrabold text-sm mb-1 ${isUnlocked ? 'text-[#1B2B1E]' : 'text-gray-600'}`}>
                  {badge.title}
                </h3>
                <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed font-medium">
                  {badge.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-gray-100 text-[11px] font-semibold text-gray-600">
                <span>Requirement: </span>
                <span className={isUnlocked ? 'text-[#2F8F5B] font-extrabold' : 'text-gray-600'}>
                  {badge.requirement}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* BADGE DETAIL DIALOG */}
      <AnimatePresence>
        {selectedBadge && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 10 }}
              className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-emerald-100 text-[#1B2B1E] relative overflow-hidden"
            >
              {/* Floating Leaf Particles in Unlocked Modal */}
              {unlockedSet.has(selectedBadge.id) && (
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute top-4 left-6 text-emerald-400 animate-bounce" style={{ animationDuration: '3s' }}>
                    <Leaf className="w-4 h-4" />
                  </div>
                  <div className="absolute bottom-10 right-6 text-amber-400 animate-pulse" style={{ animationDuration: '4s' }}>
                    <Sparkles className="w-4 h-4" />
                  </div>
                </div>
              )}

              <button
                onClick={() => setSelectedBadge(null)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center font-bold cursor-pointer"
              >
                ✕
              </button>

              <div className="text-center my-2">
                <div className="w-16 h-16 rounded-3xl bg-amber-100/90 mx-auto flex items-center justify-center mb-3 shadow-sm relative">
                  {renderBadgeIcon(selectedBadge.iconName, unlockedSet.has(selectedBadge.id))}
                </div>

                <h3 className="text-lg font-black text-[#1B2B1E]">{selectedBadge.title}</h3>
                <p className="text-xs text-gray-500 mt-1 font-medium">{selectedBadge.description}</p>
              </div>

              <div className="my-4 p-3 rounded-2xl bg-gray-50 border border-gray-100 text-xs text-gray-700 space-y-1.5">
                <div className="flex justify-between">
                  <span className="font-semibold text-gray-500">Status:</span>
                  <span className={`font-bold ${unlockedSet.has(selectedBadge.id) ? 'text-amber-600' : 'text-gray-500'}`}>
                    {unlockedSet.has(selectedBadge.id) ? 'Unlocked ✨' : 'Locked'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold text-gray-500">Requirement:</span>
                  <span className="font-bold text-[#1B2B1E]">{selectedBadge.requirement}</span>
                </div>
              </div>

              <button
                onClick={() => setSelectedBadge(null)}
                className="w-full py-3 rounded-2xl bg-[#2F8F5B] hover:bg-[#287A4D] text-white font-black text-xs cursor-pointer shadow-md"
              >
                Close Details
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

