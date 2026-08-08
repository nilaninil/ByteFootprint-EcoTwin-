import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Leaf, Sparkles, TrendingUp } from 'lucide-react';

interface AnimatedGreenScoreProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export const AnimatedGreenScore: React.FC<AnimatedGreenScoreProps> = ({
  score,
  size = 'md',
  showLabel = true
}) => {
  const [displayScore, setDisplayScore] = useState(score);
  const [isImproving, setIsImproving] = useState(false);

  useEffect(() => {
    if (score === displayScore) return;

    if (score > displayScore) {
      setIsImproving(true);
      const timer = setTimeout(() => setIsImproving(false), 2200);
      
      let current = displayScore;
      const step = Math.max(1, Math.ceil((score - displayScore) / 15));
      const interval = setInterval(() => {
        current += step;
        if (current >= score) {
          setDisplayScore(score);
          clearInterval(interval);
        } else {
          setDisplayScore(current);
        }
      }, 40);

      return () => {
        clearTimeout(timer);
        clearInterval(interval);
      };
    } else {
      setDisplayScore(score);
    }
  }, [score, displayScore]);

  const sizeClasses = {
    sm: {
      box: 'px-3 py-1.5 rounded-xl text-xs font-extrabold',
      num: 'text-sm font-black',
      icon: 'w-3.5 h-3.5'
    },
    md: {
      box: 'px-4 py-2 rounded-2xl text-sm font-extrabold',
      num: 'text-lg font-black',
      icon: 'w-4 h-4'
    },
    lg: {
      box: 'px-6 py-3 rounded-3xl text-base font-extrabold',
      num: 'text-2xl font-black',
      icon: 'w-5 h-5'
    }
  }[size];

  return (
    <div className="relative inline-block">
      {/* Soft Glow Pulse Burst when Score Improves */}
      <AnimatePresence>
        {isImproving && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1.2 }}
            exit={{ opacity: 0, scale: 1.4 }}
            className="absolute inset-0 bg-emerald-400/30 rounded-3xl blur-md pointer-events-none"
          />
        )}
      </AnimatePresence>

      <motion.div
        animate={isImproving ? { scale: [1, 1.1, 1], rotate: [-2, 2, 0] } : {}}
        transition={{ duration: 0.5 }}
        className={`flex items-center gap-2 border shadow-sm transition-colors ${sizeClasses.box} ${
          isImproving
            ? 'bg-emerald-500 text-white border-emerald-400 shadow-emerald-500/30 shadow-lg'
            : 'bg-emerald-800/90 text-emerald-100 border-emerald-700/60'
        }`}
      >
        <Leaf className={`${sizeClasses.icon} ${isImproving ? 'text-amber-300 animate-bounce' : 'text-emerald-300'}`} />
        <div className="flex items-baseline gap-1">
          {showLabel && <span className="text-[11px] opacity-80 uppercase tracking-wider font-bold">Green Score</span>}
          <span className={sizeClasses.num}>{displayScore}</span>
          <span className="text-[10px] opacity-75">/100</span>
        </div>
        {isImproving && <Sparkles className="w-4 h-4 text-amber-300 animate-spin" />}
      </motion.div>
    </div>
  );
};
