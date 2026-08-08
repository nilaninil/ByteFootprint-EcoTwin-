import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Monitor, Server, Mail, HardDrive, Sparkles, CheckCircle2 } from 'lucide-react';

interface DigitalFootprintExplainerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DigitalFootprintExplainer: React.FC<DigitalFootprintExplainerProps> = ({
  isOpen,
  onClose
}) => {
  const [streamHours, setStreamHours] = useState(3);
  const [quality, setQuality] = useState<'4K' | '1080p' | '720p'>('4K');

  if (!isOpen) return null;

  const co2Grams = Math.round(streamHours * (quality === '4K' ? 350 : quality === '1080p' ? 100 : 36));
  const kmScooterEquivalent = (co2Grams / 40).toFixed(1);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-white rounded-3xl p-6 md:p-8 max-w-lg w-full shadow-2xl border border-amber-300 text-[#1B2B1E] relative max-h-[90vh] overflow-y-auto"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold flex items-center justify-center"
        >
          ✕
        </button>

        {/* Badge Header */}
        <div className="flex items-center gap-2 mb-3">
          <div className="p-2.5 rounded-2xl bg-amber-500 text-white shadow-xs">
            <Monitor className="w-6 h-6" />
          </div>
          <div>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-amber-600 text-white">
              The Hidden Footprint
            </span>
            <h3 className="text-xl font-bold text-amber-950">Why Digital Carbon Matters</h3>
          </div>
        </div>

        <p className="text-xs text-gray-600 leading-relaxed mb-4">
          Most students assume staying indoors and streaming movies or playing online games is zero-carbon. In reality, global data centers, 5G towers, and edge cloud servers draw enormous electricity 24/7!
        </p>

        {/* 3 Core Pillars */}
        <div className="space-y-3 my-4">
          <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-xs">
            <div className="flex items-center gap-2 font-bold text-amber-900 mb-1">
              <Server className="w-4 h-4 text-amber-700" />
              <span>1. High-Bitrate Video Streaming</span>
            </div>
            <p className="text-amber-800/90 text-[11px]">
              Transmitting 4K video requires 25+ Mbps continuous cloud data transfer. Data centers consume massive water and power to cool hyperscale servers.
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-xs">
            <div className="flex items-center gap-2 font-bold text-amber-900 mb-1">
              <HardDrive className="w-4 h-4 text-amber-700" />
              <span>2. Perpetual Cloud Storage Sync</span>
            </div>
            <p className="text-amber-800/90 text-[11px]">
              100GB of active cloud backup sitting on SSD drives uses ~200g CO2 per year just staying powered on standby for immediate access.
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-xs">
            <div className="flex items-center gap-2 font-bold text-amber-900 mb-1">
              <Mail className="w-4 h-4 text-amber-700" />
              <span>3. Email Attachments & Spam</span>
            </div>
            <p className="text-amber-800/90 text-[11px]">
              Sending a single email with a large PDF attachment emits ~50g CO2 across mail routing servers and local spam filters.
            </p>
          </div>
        </div>

        {/* Interactive Impact Calculator Sandbox */}
        <div className="p-4 rounded-2xl bg-amber-100/60 border border-amber-300 text-xs space-y-3">
          <h4 className="font-bold text-amber-950 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-700" />
            <span>Interactive Digital Impact Estimator</span>
          </h4>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-amber-900 mb-1">Stream Hours:</label>
              <input
                type="range"
                min="1"
                max="8"
                value={streamHours}
                onChange={e => setStreamHours(Number(e.target.value))}
                className="w-full accent-amber-700 cursor-pointer"
              />
              <span className="font-bold text-amber-950">{streamHours} Hours</span>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-amber-900 mb-1">Quality:</label>
              <select
                value={quality}
                onChange={e => setQuality(e.target.value as any)}
                className="w-full p-1.5 rounded-xl border border-amber-300 bg-white font-bold text-amber-950 text-xs"
              >
                <option value="4K">4K Ultra HD</option>
                <option value="1080p">1080p HD</option>
                <option value="720p">720p Eco</option>
              </select>
            </div>
          </div>

          <div className="pt-2 border-t border-amber-300/60 flex items-center justify-between font-bold text-amber-950">
            <span>Result: {co2Grams}g CO2e</span>
            <span className="text-amber-900 bg-amber-200 px-2 py-0.5 rounded-md text-[11px]">
              ≈ {kmScooterEquivalent} km electric scooter ride!
            </span>
          </div>
        </div>

        <button
          onClick={onClose}
          className="mt-5 w-full py-3 rounded-2xl bg-[#2F8F5B] hover:bg-[#287A4D] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md"
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>Got It! I'll Track My Digital Footprint</span>
        </button>
      </motion.div>
    </div>
  );
};
