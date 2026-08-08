import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Leaf, ArrowRight, ShieldCheck } from 'lucide-react';
import { BackgroundVideo } from './BackgroundVideo';
import { BotanicalSketch } from './BotanicalSketch';

interface ProfileEntryScreenProps {
  onSubmitProfile: (name: string) => void;
}

export const ProfileEntryScreen: React.FC<ProfileEntryScreenProps> = ({ onSubmitProfile }) => {
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please enter a name so your EcoTwin can greet you!');
      return;
    }
    onSubmitProfile(name.trim());
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 bg-[#F3F6F0] text-[#1B2B1E] overflow-hidden selection:bg-emerald-200">
      {/* Background Nature Video Loop */}
      <BackgroundVideo opacity={0.45} />

      {/* Botanical Sketch Graphic in Background */}
      <div className="absolute top-0 right-0 w-80 sm:w-[500px] h-full pointer-events-none opacity-40">
        <BotanicalSketch className="w-full h-full object-cover" />
      </div>

      {/* Centered Editorial Glass Card */}
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-md bg-white/85 backdrop-blur-md rounded-[2.5rem] p-8 sm:p-10 shadow-2xl border border-white/90 text-center"
      >
        {/* Brand Icon Header */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mx-auto w-12 h-12 rounded-2xl bg-[#2F8F5B] text-white flex items-center justify-center shadow-md shadow-emerald-900/20 mb-5"
        >
          <Leaf className="w-6 h-6 fill-white/20 animate-pulse" />
        </motion.div>

        {/* Title in Instrument Serif */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100/90 text-[#2F8F5B] text-[11px] font-extrabold uppercase tracking-widest mb-3 border border-emerald-200/60">
            • A personal carbon companion
          </div>
          <h1 className="font-serif-instrument text-4xl sm:text-5xl text-[#1B2B1E] tracking-tight leading-none mb-2 font-normal">
            Welcome to Eco<span className="font-serif-instrument italic text-[#2F8F5B]">Twin</span>
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 font-medium max-w-xs mx-auto leading-relaxed">
            A small daily ritual for seeing the whole picture — including the part hiding behind your screen.
          </p>
        </motion.div>

        {/* Form */}
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="mt-6 space-y-4 text-left"
        >
          <div>
            <label htmlFor="user-name-input" className="block text-[11px] font-extrabold text-[#1B2B1E] uppercase tracking-wider mb-1.5 ml-1">
              What should we call you?
            </label>
            <div className="relative">
              <input
                id="user-name-input"
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (error) setError('');
                }}
                placeholder="e.g. Alex Rivera, Maya, Sam..."
                maxLength={30}
                autoFocus
                className="w-full px-4 py-3.5 rounded-2xl bg-white border border-emerald-900/15 focus:border-[#2F8F5B] focus:ring-2 focus:ring-emerald-500/20 text-sm font-semibold text-[#1B2B1E] placeholder:text-gray-400 outline-none transition-all shadow-xs"
              />
            </div>
            {error && (
              <p className="text-xs text-rose-600 font-medium mt-1.5 ml-1">
                {error}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-4 px-6 rounded-full bg-[#1B2B1E] hover:bg-emerald-950 text-white font-bold text-sm shadow-md flex items-center justify-center gap-2.5 transition-all cursor-pointer active:scale-[0.98] group"
          >
            <span>Meet Your Twin</span>
            <ArrowRight className="w-4 h-4 text-emerald-300 group-hover:translate-x-1 transition-transform" />
          </button>
        </motion.form>

        {/* Local Storage Privacy Assurance */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="mt-6 pt-5 border-t border-emerald-900/10 flex items-center justify-center gap-2 text-[11px] text-gray-500 font-medium"
        >
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>100% Private • Stored purely in your browser localStorage</span>
        </motion.div>
      </motion.div>
    </div>
  );
};

