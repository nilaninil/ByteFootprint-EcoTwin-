import React, { useState } from 'react';
import { motion } from 'motion/react';
import { TransportMode, StreamingQuality } from '../types';
import { calculateFootprint } from '../data/emissionFactors';
import { Car, Utensils, Zap, Monitor, Info, Sparkles, CheckCircle2 } from 'lucide-react';

interface HabitLoggerProps {
  onSaveHabits: (input: {
    transportKm: number;
    transportMode: TransportMode;
    meals: number;
    meatMeals: number;
    energyLevel: number;
    streamingHours: number;
    streamingQuality: StreamingQuality;
    emailsSent: number;
    cloudBackupGB: number;
  }) => void;
  onOpenDigitalExplainer?: () => void;
}

export const HabitLogger: React.FC<HabitLoggerProps> = ({
  onSaveHabits,
  onOpenDigitalExplainer
}) => {
  // Form State
  const [transportKm, setTransportKm] = useState<number>(5);
  const [transportMode, setTransportMode] = useState<TransportMode>('bus');

  const [meals, setMeals] = useState<number>(3);
  const [meatMeals, setMeatMeals] = useState<number>(1);

  const [energyLevel, setEnergyLevel] = useState<number>(2); // 1: Low, 2: Med, 3: High

  // Digital state
  const [streamingHours, setStreamingHours] = useState<number>(2.5);
  const [streamingQuality, setStreamingQuality] = useState<StreamingQuality>('1080p');
  const [emailsSent, setEmailsSent] = useState<number>(12);
  const [cloudBackupGB, setCloudBackupGB] = useState<number>(10);

  // Live footprint calculation preview
  const liveEstimate = calculateFootprint({
    transportKm,
    transportMode,
    meals,
    meatMeals,
    energyLevel,
    streamingHours,
    streamingQuality,
    emailsSent,
    cloudBackupGB
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveHabits({
      transportKm,
      transportMode,
      meals,
      meatMeals,
      energyLevel,
      streamingHours,
      streamingQuality,
      emailsSent,
      cloudBackupGB
    });
  };

  return (
    <div className="bg-white rounded-3xl p-5 md:p-7 shadow-xl border border-emerald-900/10 max-w-3xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6 border-b border-gray-100 pb-4">
        <div>
          <h2 className="text-xl font-bold text-[#1B2B1E] flex items-center gap-2">
            <span>Log Today's Eco Habits</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-100 text-[#2F8F5B] font-semibold">
              Daily Pulse
            </span>
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Log your daily activities across 4 categories to see how your EcoTwin companion reacts.
          </p>
        </div>

        {/* Live Estimate Badge */}
        <div className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-[#F6FAF4] border border-emerald-200">
          <div className="text-right">
            <span className="block text-[10px] uppercase tracking-wider font-semibold text-emerald-800">Live Carbon Est.</span>
            <span className="text-base font-extrabold text-[#2F8F5B]">
              {liveEstimate.totalFootprint} <span className="text-xs font-medium">kg CO2e</span>
            </span>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 1. TRANSPORT SECTION */}
        <div className="p-4 rounded-2xl bg-gray-50/80 border border-gray-200/80 space-y-3">
          <div className="flex items-center justify-between">
            <label className="font-bold text-sm text-gray-800 flex items-center gap-2">
              <Car className="w-4 h-4 text-emerald-600" />
              <span>1. Transportation</span>
            </label>
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-md">
              {liveEstimate.footprintByCategory.transport} kg CO2e
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <div className="flex justify-between text-xs font-medium text-gray-600 mb-1">
                <span>Distance Traveled:</span>
                <span className="font-bold text-gray-900">{transportKm} km</span>
              </div>
              <input
                type="range"
                min="0"
                max="80"
                step="1"
                value={transportKm}
                onChange={e => setTransportKm(Number(e.target.value))}
                className="w-full accent-[#2F8F5B] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-gray-600">
                <span>0 km</span>
                <span>40 km</span>
                <span>80 km</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Primary Transport Mode:</label>
              <select
                value={transportMode}
                onChange={e => setTransportMode(e.target.value as TransportMode)}
                className="w-full p-2.5 rounded-xl border border-gray-300 text-xs font-medium bg-white focus:ring-2 focus:ring-[#2F8F5B] outline-none"
              >
                <option value="bike_walk">🚲 Bicycle / Walking (0g CO2)</option>
                <option value="bus">🚌 Public Bus (80g CO2/km)</option>
                <option value="train">🚆 Metro / Train (35g CO2/km)</option>
                <option value="ev">⚡ Electric Vehicle (45g CO2/km)</option>
                <option value="car">🚗 Petrol Car (170g CO2/km)</option>
              </select>
            </div>
          </div>
        </div>

        {/* 2. FOOD SECTION */}
        <div className="p-4 rounded-2xl bg-gray-50/80 border border-gray-200/80 space-y-3">
          <div className="flex items-center justify-between">
            <label className="font-bold text-sm text-gray-800 flex items-center gap-2">
              <Utensils className="w-4 h-4 text-emerald-600" />
              <span>2. Meals & Diet</span>
            </label>
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-md">
              {liveEstimate.footprintByCategory.food} kg CO2e
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Total Meals Today:</label>
              <div className="flex gap-2">
                {[2, 3, 4].map(num => (
                  <button
                    key={`meal-${num}`}
                    type="button"
                    onClick={() => {
                      setMeals(num);
                      if (meatMeals > num) setMeatMeals(num);
                    }}
                    className={`flex-1 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                      meals === num
                        ? 'bg-[#2F8F5B] text-white border-[#2F8F5B]'
                        : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    {num} Meals
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Meals with Meat / Beef / Dairy:
              </label>
              <div className="flex gap-1.5">
                {[...Array(meals + 1)].map((_, i) => (
                  <button
                    key={`meat-${i}`}
                    type="button"
                    onClick={() => setMeatMeals(i)}
                    className={`flex-1 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                      meatMeals === i
                        ? 'bg-amber-600 text-white border-amber-600'
                        : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    {i === 0 ? '0 (All Veg)' : `${i} Meat`}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 3. ENERGY SECTION */}
        <div className="p-4 rounded-2xl bg-gray-50/80 border border-gray-200/80 space-y-3">
          <div className="flex items-center justify-between">
            <label className="font-bold text-sm text-gray-800 flex items-center gap-2">
              <Zap className="w-4 h-4 text-emerald-600" />
              <span>3. Household & Device Energy</span>
            </label>
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-md">
              {liveEstimate.footprintByCategory.energy} kg CO2e
            </span>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Daily Energy Usage Intensity:</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { lvl: 1, label: 'Eco / Low', sub: 'Natural light, eco mode' },
                { lvl: 2, label: 'Moderate', sub: 'Standard thermostat' },
                { lvl: 3, label: 'High Power', sub: 'Heavy AC, multiple monitors' }
              ].map(opt => (
                <button
                  key={`energy-${opt.lvl}`}
                  type="button"
                  onClick={() => setEnergyLevel(opt.lvl)}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    energyLevel === opt.lvl
                      ? 'bg-emerald-800 text-white border-emerald-800'
                      : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  <div className="font-bold text-xs">{opt.label}</div>
                  <div className={`text-[10px] mt-0.5 ${energyLevel === opt.lvl ? 'text-emerald-200' : 'text-gray-600'}`}>
                    {opt.sub}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 4. DIGITAL FOOTPRINT (THE DIFFERENTIATOR - PROMINENT & VISUALLY DISTINCT) */}
        <div className="p-5 rounded-3xl bg-amber-50/80 border-2 border-amber-400/80 shadow-xs relative overflow-hidden space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-amber-500 text-white shadow-xs">
                <Monitor className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-base text-amber-950">4. Digital Footprint</h3>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wide bg-amber-600 text-white shadow-xs">
                    The Hidden Footprint
                  </span>
                </div>
                <p className="text-xs text-amber-800 font-medium">
                  Data servers, cloud backups, & video streams consume massive power.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-amber-900 bg-amber-200/80 px-2.5 py-1 rounded-lg">
                {liveEstimate.footprintByCategory.digital} kg CO2e
              </span>
              {onOpenDigitalExplainer && (
                <button
                  type="button"
                  onClick={onOpenDigitalExplainer}
                  className="text-amber-800 hover:text-amber-950 p-1 rounded-lg bg-amber-200/60 transition-colors"
                  title="Why digital footprint matters"
                >
                  <Info className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            {/* Streaming Hours & Quality */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-semibold text-amber-900">
                <span>Video Streaming / Youtube / Netflix:</span>
                <span className="font-bold text-amber-950">{streamingHours} hours</span>
              </div>
              <input
                type="range"
                min="0"
                max="10"
                step="0.5"
                value={streamingHours}
                onChange={e => setStreamingHours(Number(e.target.value))}
                className="w-full accent-amber-600 cursor-pointer"
              />

              <div className="pt-1">
                <label className="block text-xs font-semibold text-amber-900 mb-1">Stream Quality Setting:</label>
                <select
                  value={streamingQuality}
                  onChange={e => setStreamingQuality(e.target.value as StreamingQuality)}
                  className="w-full p-2.5 rounded-xl border border-amber-300 text-xs font-bold text-amber-950 bg-white focus:ring-2 focus:ring-amber-500 outline-none"
                >
                  <option value="4K">🎥 4K Ultra HD (~350g CO2/hr - Highest Server Load)</option>
                  <option value="1080p">📺 1080p Full HD (~100g CO2/hr)</option>
                  <option value="720p">📱 720p HD Eco Stream (~36g CO2/hr - Recommended)</option>
                  <option value="audio_only">🎵 Audio Only / Spotify (~10g CO2/hr)</option>
                </select>
              </div>
            </div>

            {/* Email & Cloud Sync */}
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs font-semibold text-amber-900 mb-1">
                  <span>Emails / Attachments Sent & Received:</span>
                  <span className="font-bold">{emailsSent} emails</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="80"
                  step="5"
                  value={emailsSent}
                  onChange={e => setEmailsSent(Number(e.target.value))}
                  className="w-full accent-amber-600 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold text-amber-900 mb-1">
                  <span>Active Cloud Backup Storage:</span>
                  <span className="font-bold">{cloudBackupGB} GB</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={cloudBackupGB}
                  onChange={e => setCloudBackupGB(Number(e.target.value))}
                  className="w-full accent-amber-600 cursor-pointer"
                />
              </div>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-amber-100/70 border border-amber-300/60 text-amber-950 text-[11px] flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-700 shrink-0" />
            <span>
              <strong>Fact:</strong> Streaming 1 hour in 4K emits as much carbon as driving an electric scooter for 8km!
            </span>
          </div>
        </div>

        {/* SUBMIT BUTTON */}
        <div className="pt-2">
          <motion.button
            type="submit"
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-4 px-6 rounded-2xl bg-[#2F8F5B] hover:bg-[#287A4D] text-white font-extrabold text-base shadow-lg shadow-emerald-900/20 flex items-center justify-center gap-2.5 transition-all cursor-pointer"
          >
            <CheckCircle2 className="w-5 h-5 text-emerald-200" />
            <span>Log Today's Habits</span>
          </motion.button>
        </div>
      </form>
    </div>
  );
};
