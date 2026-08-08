import React, { useState } from 'react';
import { motion } from 'motion/react';
import { EcoTwinTree } from './EcoTwinTree';
import { TWIN_STAGES } from '../data/staticData';
import { TwinStage } from '../types';
import { Sparkles, Heart, ShieldCheck, ArrowRight, Leaf, Info, Flame, BarChart2 } from 'lucide-react';

interface AboutViewProps {
  currentStage: TwinStage;
  onNavigateLog: () => void;
}

export const AboutView: React.FC<AboutViewProps> = ({ currentStage, onNavigateLog }) => {
  const [selectedPreviewStage, setSelectedPreviewStage] = useState<TwinStage>(currentStage || 3);

  const stagesList: TwinStage[] = [1, 2, 3, 4, 5];

  const stageThresholds: Record<TwinStage, string> = {
    1: '> 11.0 kg CO2e/day',
    2: '8.0 – 11.0 kg CO2e/day',
    3: '5.5 – 8.0 kg CO2e/day',
    4: '3.2 – 5.5 kg CO2e/day',
    5: '< 3.2 kg CO2e/day'
  };

  return (
    <div className="space-y-8 py-2 max-w-5xl mx-auto">
      {/* Hero Emotional Copy Card in Glassmorphism Light */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="glass-card-light rounded-3xl p-8 sm:p-12 shadow-xl border border-white/80 relative overflow-hidden text-center"
      >
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-100 text-[#2F8F5B] text-xs font-bold mb-4 border border-emerald-200/80">
          <Heart className="w-3.5 h-3.5 fill-emerald-500/20" />
          <span>The Philosophy Behind EcoTwin</span>
        </div>

        {/* Heading in Instrument Serif */}
        <h1 className="font-serif-instrument text-4xl sm:text-6xl text-[#1B2B1E] tracking-tight leading-none mb-6">
          This is your EcoTwin.
        </h1>

        {/* Emotional Copy */}
        <p className="text-base sm:text-lg text-[#1B2B1E]/90 font-medium max-w-2xl mx-auto leading-relaxed italic">
          "Every habit you log — every ride, every meal, every stream — feeds this tree. It isn't a graph. It isn't a score. It's alive, in the only way we could make it feel that way: it grows when you do right by it, and it fades when you don't. Don't let it dry out."
        </p>

        {/* Call to Action button */}
        <div className="mt-8 flex items-center justify-center gap-3">
          <button
            onClick={onNavigateLog}
            className="px-6 py-3.5 rounded-2xl bg-[#2F8F5B] hover:bg-[#287A4D] text-white font-extrabold text-xs shadow-md shadow-emerald-900/15 flex items-center gap-2 transition-all cursor-pointer hover:scale-[1.02]"
          >
            <Leaf className="w-4 h-4 fill-white/20" />
            <span>Nourish Your Twin Today</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </motion.section>

      {/* Growth Stage Previews Section */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.15 }}
        className="glass-card-emerald rounded-3xl p-6 sm:p-8 shadow-lg border border-emerald-200/70 space-y-6"
      >
        <div className="text-center max-w-xl mx-auto">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-200/80 text-emerald-900 text-xs font-bold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
            The 5 Life Stages of EcoTwin
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1B2B1E]">
            How Your Habits Shape the Canopy
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 font-medium mt-1">
            Tap any growth stage below to inspect how your daily choices directly influence foliage, color, and tree vigor.
          </p>
        </div>

        {/* Horizontal Strip of 5 Growth Stage Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {stagesList.map((st) => {
            const info = TWIN_STAGES[st];
            const isSelected = selectedPreviewStage === st;
            const isCurrent = currentStage === st;

            return (
              <button
                key={`stage-btn-${st}`}
                onClick={() => setSelectedPreviewStage(st)}
                className={`p-3.5 rounded-2xl transition-all text-left flex flex-col justify-between border cursor-pointer relative overflow-hidden ${
                  isSelected
                    ? 'bg-white shadow-md border-emerald-500 ring-2 ring-emerald-500/30 scale-[1.02]'
                    : 'bg-white/60 hover:bg-white/90 border-emerald-900/10'
                }`}
              >
                {/* Active/Current indicator badge */}
                {isCurrent && (
                  <span className="absolute top-2 right-2 px-1.5 py-0.5 rounded-md text-[9px] font-extrabold bg-emerald-700 text-white uppercase">
                    Your Stage
                  </span>
                )}

                <div>
                  <div className="flex items-center gap-1.5 mb-1">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: info.color }}
                    />
                    <span className="text-xs font-extrabold text-[#1B2B1E]">
                      Stage {st}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-gray-700 truncate">
                    {info.name}
                  </h4>
                </div>

                <div className="mt-3 pt-2 border-t border-gray-100">
                  <span className="text-[10px] font-semibold text-gray-500 block">
                    Footprint Target:
                  </span>
                  <span className="text-[11px] font-extrabold text-emerald-800">
                    {stageThresholds[st]}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Stage Stage Showcase Spotlight */}
        <div className="bg-white/90 rounded-3xl p-6 border border-emerald-100 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <div className="flex flex-col items-center justify-center p-4 bg-[#F6FAF4] rounded-2xl border border-emerald-100/80">
            <EcoTwinTree stage={selectedPreviewStage} previewOnly={true} />
            <span className="mt-2 text-xs font-bold px-3 py-1 rounded-full text-white" style={{ backgroundColor: TWIN_STAGES[selectedPreviewStage].color }}>
              Stage {selectedPreviewStage}: {TWIN_STAGES[selectedPreviewStage].name}
            </span>
          </div>

          <div className="space-y-4">
            <div>
              <span className="text-xs font-extrabold text-[#2F8F5B] uppercase tracking-wider">Stage Focus</span>
              <h3 className="text-xl font-extrabold text-[#1B2B1E] mt-0.5">
                "{TWIN_STAGES[selectedPreviewStage].statusLine}"
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 font-medium mt-2 leading-relaxed">
                {TWIN_STAGES[selectedPreviewStage].description}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200/80 text-amber-950 text-xs space-y-1">
              <span className="font-bold flex items-center gap-1 text-amber-900">
                <Info className="w-3.5 h-3.5 text-amber-700" />
                Footprint Criteria:
              </span>
              <p className="text-amber-900/90 font-medium">
                Rolling 7-day average: <strong>{stageThresholds[selectedPreviewStage]}</strong>
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs text-gray-500 font-medium">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Anime cel-shaded SVG tree renders smoothly across all devices.</span>
            </div>
          </div>
        </div>
      </motion.section>
    </div>
  );
};
