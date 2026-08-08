import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import * as htmlToImage from 'html-to-image';
import { AppData, TwinStage } from '../types';
import { TWIN_STAGES } from '../data/staticData';
import { EcoTwinTree } from './EcoTwinTree';
import {
  Share2,
  Download,
  Copy,
  X,
  Sparkles,
  Flame,
  Award,
  Leaf,
  Check,
  Globe,
  Camera,
  Heart
} from 'lucide-react';

interface ShareSnapshotModalProps {
  isOpen: boolean;
  onClose: () => void;
  appData: AppData;
  rollingAvgFootprint: number;
}

export const ShareSnapshotModal: React.FC<ShareSnapshotModalProps> = ({
  isOpen,
  onClose,
  appData,
  rollingAvgFootprint
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedStatus, setCopiedStatus] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  if (!isOpen) return null;

  const stageInfo = TWIN_STAGES[appData.twinStage];
  const userName = appData.userProfile?.name || 'Eco Advocate';
  const todayStr = new Date().toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  // Download card as PNG
  const handleDownloadPng = async () => {
    if (!cardRef.current || isGenerating) return;
    try {
      setIsGenerating(true);
      setDownloadSuccess(false);

      // Brief pause to ensure fonts/SVGs are rendered
      await new Promise(resolve => setTimeout(resolve, 150));

      const dataUrl = await htmlToImage.toPng(cardRef.current, {
        quality: 0.95,
        pixelRatio: 2,
        cacheBust: true,
        backgroundColor: '#121E14'
      });

      const link = document.createElement('a');
      link.download = `ecotwin-snapshot-${userName.toLowerCase().replace(/\s+/g, '-')}.png`;
      link.href = dataUrl;
      link.click();

      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to generate image snapshot:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  // Copy Image to Clipboard
  const handleCopyImage = async () => {
    if (!cardRef.current || isGenerating) return;
    try {
      setIsGenerating(true);
      const dataUrl = await htmlToImage.toPng(cardRef.current, {
        quality: 0.95,
        pixelRatio: 2,
        backgroundColor: '#121E14'
      });

      const res = await fetch(dataUrl);
      const blob = await res.blob();

      if (navigator.clipboard && window.ClipboardItem) {
        await navigator.clipboard.write([
          new ClipboardItem({ [blob.type]: blob })
        ]);
        setCopiedStatus(true);
        setTimeout(() => setCopiedStatus(false), 3000);
      } else {
        // Fallback: download if copy isn't supported
        handleDownloadPng();
      }
    } catch (err) {
      console.error('Copy failed:', err);
      handleDownloadPng();
    } finally {
      setIsGenerating(false);
    }
  };

  // Web Share API
  const handleWebShare = async () => {
    if (!cardRef.current) return;
    try {
      setIsGenerating(true);
      const dataUrl = await htmlToImage.toPng(cardRef.current, {
        quality: 0.95,
        pixelRatio: 2,
        backgroundColor: '#121E14'
      });
      const res = await fetch(dataUrl);
      const blob = await res.blob();
      const file = new File([blob], `ecotwin-${userName}.png`, { type: 'image/png' });

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: `${userName}'s EcoTwin Living Tree`,
          text: `My EcoTwin tree is thriving with a Green Score of ${appData.greenScore}/100 and a ${appData.streakDays}-day streak! 🌿`,
          files: [file]
        });
      } else {
        handleDownloadPng();
      }
    } catch (err) {
      console.error('Web share failed:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.25 }}
          className="relative w-full max-w-xl bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-white/80 my-8 text-[#1B2B1E]"
        >
          {/* Modal Header */}
          <div className="flex items-center justify-between pb-4 border-b border-gray-100">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-[#2F8F5B] flex items-center justify-center font-bold">
                <Camera className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-lg text-[#1B2B1E]">
                  Shareable EcoTwin Snapshot
                </h3>
                <p className="text-xs text-gray-500 font-medium">
                  Export your living tree & eco milestones as a beautiful image
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* STYLIZED SHAREABLE CARD TO BE CAPTURED */}
          <div className="my-6 overflow-hidden rounded-3xl shadow-xl flex justify-center bg-gray-900">
            <div
              ref={cardRef}
              className="w-full max-w-[460px] bg-gradient-to-b from-[#162719] via-[#1B3220] to-[#111F13] text-white p-6 sm:p-7 rounded-3xl relative border border-emerald-500/20 select-none"
            >
              {/* Background Nature Ornaments */}
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

              {/* Card Header */}
              <div className="flex items-center justify-between pb-4 border-b border-white/10 relative z-10">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-400/30">
                    <Leaf className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-extrabold text-sm tracking-tight text-emerald-300">
                      EcoTwin Companion
                    </div>
                    <div className="text-[10px] text-emerald-100/70 font-medium">
                      {userName}'s Digital Tree • {todayStr}
                    </div>
                  </div>
                </div>

                <div className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[11px] font-black flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  Green Score: {appData.greenScore}/100
                </div>
              </div>

              {/* Centerpiece EcoTwin Tree Display */}
              <div className="my-4 py-2 relative flex flex-col items-center justify-center bg-black/20 rounded-2xl border border-white/5">
                <div className="scale-90 transform-gpu">
                  <EcoTwinTree stage={appData.twinStage} previewOnly={true} />
                </div>

                {/* Stage Badge overlay */}
                <div className="mt-1 px-3 py-1 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-xs font-extrabold flex items-center gap-1.5 text-emerald-200">
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: stageInfo.color }}
                  />
                  <span>Stage {appData.twinStage}: {stageInfo.name}</span>
                </div>
              </div>

              {/* Stat Grid Highlights */}
              <div className="grid grid-cols-2 gap-2.5 relative z-10">
                {/* Active Streak */}
                <div className="p-3 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 text-white flex items-center justify-center shadow-xs">
                    <Flame className="w-5 h-5 fill-amber-100" />
                  </div>
                  <div>
                    <div className="text-[10px] text-gray-400 font-bold uppercase">Consistency</div>
                    <div className="text-sm font-black text-amber-300">{appData.streakDays} Day Streak</div>
                  </div>
                </div>

                {/* Rolling Avg Footprint */}
                <div className="p-3 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-400/20">
                    <Leaf className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[10px] text-gray-400 font-bold uppercase">Avg Footprint</div>
                    <div className="text-sm font-black text-emerald-300">{(rollingAvgFootprint ?? 0).toFixed(1)} kg/day</div>
                  </div>
                </div>
              </div>

              {/* Eco Wins Summary Banner */}
              <div className="mt-3 p-3 rounded-2xl bg-emerald-900/40 border border-emerald-500/20 text-[11px] leading-snug flex items-center justify-between gap-2">
                <span className="text-emerald-100 font-medium flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{appData.history.length} daily logs recorded • {appData.badgesUnlocked.length} eco badges earned</span>
                </span>
                <span className="px-2 py-0.5 rounded-md bg-emerald-400 text-emerald-950 font-black text-[9px] shrink-0">
                  VERIFIED ECO
                </span>
              </div>

              {/* Footer Branding */}
              <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-[10px] text-gray-400">
                <span className="flex items-center gap-1 text-emerald-300 font-bold">
                  <Globe className="w-3 h-3 text-emerald-400" />
                  EcoTwin App
                </span>
                <span className="italic">Lower your digital & daily carbon footprint</span>
              </div>
            </div>
          </div>

          {/* Action Buttons Bar */}
          <div className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Primary Download Button */}
              <button
                onClick={handleDownloadPng}
                disabled={isGenerating}
                className="py-3.5 px-5 rounded-2xl bg-[#2F8F5B] hover:bg-[#287A4D] disabled:opacity-50 text-white font-extrabold text-xs shadow-md shadow-emerald-900/15 flex items-center justify-center gap-2 transition-all cursor-pointer hover:scale-[1.02]"
              >
                {downloadSuccess ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-200" />
                    <span>Saved to Downloads!</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    <span>{isGenerating ? 'Generating PNG...' : 'Download Image (PNG)'}</span>
                  </>
                )}
              </button>

              {/* Copy Image Button */}
              <button
                onClick={handleCopyImage}
                disabled={isGenerating}
                className="py-3.5 px-5 rounded-2xl bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-xs border border-gray-300 flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                {copiedStatus ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>Copied to Clipboard!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-gray-600" />
                    <span>Copy Image</span>
                  </>
                )}
              </button>
            </div>

            {/* Mobile Native Share if available */}
            {typeof navigator !== 'undefined' && 'share' in navigator && (
              <button
                onClick={handleWebShare}
                disabled={isGenerating}
                className="w-full py-2.5 px-4 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-900 font-bold text-xs border border-emerald-200 flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5 text-emerald-700" />
                <span>Share via Apps...</span>
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
