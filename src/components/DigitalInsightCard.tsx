import React from 'react';
import { motion } from 'motion/react';
import { Monitor, Zap, Sparkles, ArrowRight, Info, Flame, Wifi } from 'lucide-react';

interface DigitalInsightCardProps {
  digitalKg?: number;
  highestCategory?: string;
  onOpenExplainer?: () => void;
  onLogDetox?: () => void;
}

export const DigitalInsightCard: React.FC<DigitalInsightCardProps> = ({
  digitalKg = 1.4,
  highestCategory = 'digital',
  onOpenExplainer,
  onLogDetox
}) => {
  const valKg = digitalKg ?? 1.4;
  const isHighest = highestCategory === 'digital' || valKg > 1.0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.01 }}
      className="p-5 md:p-6 rounded-3xl bg-gradient-to-br from-amber-500/10 via-amber-100/50 to-orange-50/60 border-2 border-amber-400/80 shadow-md shadow-amber-900/5 relative overflow-hidden text-amber-950"
    >
      {/* Decorative Glow */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-amber-300/20 rounded-full blur-2xl pointer-events-none" />

      {/* Badge Header */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-600 text-white text-xs font-black shadow-sm tracking-wide">
          <Zap className="w-3.5 h-3.5 fill-amber-200 text-amber-200" />
          <span>⚡ Hidden Digital Footprint</span>
        </div>

        {isHighest && (
          <span className="inline-flex items-center gap-1 text-[11px] font-extrabold text-amber-800 bg-amber-200/90 px-2.5 py-0.5 rounded-lg border border-amber-300">
            <Flame className="w-3.5 h-3.5 text-amber-700" />
            Highest Category Today
          </span>
        )}
      </div>

      {/* Main Impact Headline */}
      <div className="space-y-1.5 mb-4">
        <h4 className="text-base sm:text-lg font-black text-amber-950 flex items-center gap-2">
          <Monitor className="w-5 h-5 text-amber-700 shrink-0" />
          <span>
            {isHighest
              ? "Today's streaming produced more emissions than your commute!"
              : "Invisible Cloud Emissions Detected Today"}
          </span>
        </h4>
        <p className="text-xs text-amber-900/90 leading-relaxed font-medium">
          {valKg > 1.2
            ? `Your digital activity generated ~${valKg.toFixed(1)} kg CO₂e. 4K Video streaming, uncompressed video calls, and cloud backups silently consume massive power in data center cooling.`
            : "Digital carbon is completely invisible, but streaming 4K video for 1 hour produces as much CO₂ as driving a mile. Small digital habits make a huge difference!"}
        </p>
      </div>

      {/* Comparative Callout Box */}
      <div className="p-3 rounded-2xl bg-amber-200/60 border border-amber-300/80 text-xs text-amber-950 font-bold flex items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          <Wifi className="w-4 h-4 text-amber-700 shrink-0" />
          <span>Switching YouTube or Netflix from 4K down to 720p saves ~250g CO₂/hr!</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row items-center gap-2 pt-2 border-t border-amber-200/80">
        {onOpenExplainer && (
          <button
            onClick={onOpenExplainer}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer hover:scale-102"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>How Digital Carbon Works</span>
          </button>
        )}

        {onLogDetox && (
          <button
            onClick={onLogDetox}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-white/90 hover:bg-white text-amber-950 font-bold text-xs border border-amber-300 flex items-center justify-center gap-1.5 transition-all cursor-pointer hover:scale-102"
          >
            <span>Log a Digital Detox</span>
            <ArrowRight className="w-3.5 h-3.5 text-amber-700" />
          </button>
        )}
      </div>
    </motion.div>
  );
};
