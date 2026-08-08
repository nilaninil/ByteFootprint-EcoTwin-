import React, { useState } from 'react';
import { DAILY_ECO_TIPS } from '../data/staticData';
import { Lightbulb, ChevronRight, ChevronLeft, Sparkles } from 'lucide-react';

export const EcoTipsWidget: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const currentTip = DAILY_ECO_TIPS[currentIndex] || DAILY_ECO_TIPS[0];

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % DAILY_ECO_TIPS.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + DAILY_ECO_TIPS.length) % DAILY_ECO_TIPS.length);
  };

  const isDigital = currentTip.category === 'digital';

  return (
    <div className="bg-white rounded-3xl p-5 shadow-sm border border-emerald-900/10 relative overflow-hidden">
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-emerald-100 text-[#2F8F5B]">
            <Lightbulb className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-[#1B2B1E]">Daily Eco Tip</h4>
            <p className="text-[10px] text-gray-500">Tip {currentIndex + 1} of {DAILY_ECO_TIPS.length}</p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={handlePrev}
            className="p-1.5 rounded-xl hover:bg-gray-100 text-gray-600 transition-colors"
            title="Previous tip"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={handleNext}
            className="p-1.5 rounded-xl hover:bg-gray-100 text-gray-600 transition-colors"
            title="Next tip"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
            isDigital ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-[#2F8F5B]'
          }`}>
            {currentTip.category.toUpperCase()} TIP
          </span>
          <h5 className="font-bold text-sm text-[#1B2B1E]">{currentTip.title}</h5>
        </div>

        <p className="text-xs text-gray-600 leading-relaxed">
          {currentTip.content}
        </p>

        <div className="pt-2">
          <div className="p-2.5 rounded-xl bg-emerald-50/70 border border-emerald-100 text-[11px] text-emerald-950 flex items-start gap-2">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
            <span><strong>Did you know?</strong> {currentTip.funFact}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
