import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AppData } from '../types';
import { TWIN_STAGES } from '../data/staticData';
import { EcoTwinTree } from './EcoTwinTree';
import {
  Volume2,
  VolumeX,
  Play,
  Pause,
  X,
  Wind,
  Bird,
  CloudRain,
  Maximize2,
  Minimize2,
  Sparkles,
  Heart,
  Droplets,
  Sun
} from 'lucide-react';

interface ZenModeProps {
  appData: AppData;
  onExit: () => void;
  rollingAvgFootprint?: number;
}

export const ZenMode: React.FC<ZenModeProps> = ({
  appData,
  onExit,
  rollingAvgFootprint = 2.5
}) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [soundscape, setSoundscape] = useState<'breeze' | 'birds' | 'rain'>('breeze');
  const [breathingText, setBreathingText] = useState('Inhale gently...');
  const [breathingScale, setBreathingScale] = useState(1);
  const [isTreeRustling, setIsTreeRustling] = useState(false);

  // Web Audio Synthesizer Refs
  const audioCtxRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const noiseSourceRef = useRef<AudioBufferSourceNode | null>(null);
  const filterNodeRef = useRef<BiquadFilterNode | null>(null);
  const birdTimerRef = useRef<NodeJS.Timeout | null>(null);

  const stageInfo = TWIN_STAGES[appData.twinStage];

  // Initialize Web Audio Ambient Sound Generator
  useEffect(() => {
    let ctx: AudioContext | null = null;
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      ctx = new AudioCtx();
      audioCtxRef.current = ctx;

      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(volume, ctx.currentTime);
      masterGain.connect(ctx.destination);
      masterGainRef.current = masterGain;

      // Create pink/brown noise for wind through trees
      const bufferSize = ctx.sampleRate * 2;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;

      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        output[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
        output[i] *= 0.04; // Keep gentle
        b6 = white * 0.115926;
      }

      const whiteNoise = ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      whiteNoise.loop = true;

      // Filter for wind resonance
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(soundscape === 'rain' ? 1200 : 450, ctx.currentTime);
      filterNodeRef.current = filter;

      // Gentle LFO filter modulation for breeze
      const lfo = ctx.createOscillator();
      lfo.frequency.setValueAtTime(0.12, ctx.currentTime);
      const lfoGain = ctx.createGain();
      lfoGain.gain.setValueAtTime(250, ctx.currentTime);
      lfo.connect(lfoGain);
      lfoGain.connect(filter.frequency);
      lfo.start();

      whiteNoise.connect(filter);
      filter.connect(masterGain);
      whiteNoise.start();
      noiseSourceRef.current = whiteNoise;

    } catch (err) {
      console.warn('Web Audio Context initialization paused until user interaction:', err);
    }

    return () => {
      if (birdTimerRef.current) clearInterval(birdTimerRef.current);
      if (ctx && ctx.state !== 'closed') {
        ctx.close();
      }
    };
  }, []);

  // Update Master Volume
  useEffect(() => {
    if (masterGainRef.current && audioCtxRef.current) {
      const targetVol = isMuted || !isPlaying ? 0 : volume;
      masterGainRef.current.gain.setTargetAtTime(targetVol, audioCtxRef.current.currentTime, 0.1);
    }
  }, [volume, isMuted, isPlaying]);

  // Update Soundscape Filter Mode
  useEffect(() => {
    if (filterNodeRef.current && audioCtxRef.current) {
      const freq = soundscape === 'rain' ? 1400 : soundscape === 'birds' ? 600 : 400;
      filterNodeRef.current.frequency.setTargetAtTime(freq, audioCtxRef.current.currentTime, 0.3);
    }
  }, [soundscape]);

  // Periodic Random Birdsong Chirps
  useEffect(() => {
    if (birdTimerRef.current) clearInterval(birdTimerRef.current);

    if (isPlaying && !isMuted && (soundscape === 'birds' || soundscape === 'breeze')) {
      birdTimerRef.current = setInterval(() => {
        if (!audioCtxRef.current || audioCtxRef.current.state !== 'running') return;
        if (Math.random() > 0.4) {
          triggerBirdChirp(audioCtxRef.current, masterGainRef.current);
        }
      }, 3500);
    }

    return () => {
      if (birdTimerRef.current) clearInterval(birdTimerRef.current);
    };
  }, [isPlaying, isMuted, soundscape]);

  // Helper: Synthesize organic bird chirps
  const triggerBirdChirp = (ctx: AudioContext, destination: GainNode | null) => {
    if (!destination) return;
    try {
      const osc = ctx.createOscillator();
      const chirpGain = ctx.createGain();

      const startFreq = 2200 + Math.random() * 800;
      const endFreq = startFreq + (Math.random() > 0.5 ? 600 : -400);

      osc.type = 'sine';
      osc.frequency.setValueAtTime(startFreq, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(endFreq, ctx.currentTime + 0.12);

      chirpGain.gain.setValueAtTime(0.01, ctx.currentTime);
      chirpGain.gain.linearRampToValueAtTime(0.06, ctx.currentTime + 0.04);
      chirpGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);

      osc.connect(chirpGain);
      chirpGain.connect(destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.18);
    } catch {
      // Ignore audio glitches
    }
  };

  // Breathing Rhythm Loop
  useEffect(() => {
    const timer = setInterval(() => {
      setBreathingText(prev => {
        if (prev.startsWith('Inhale')) return 'Hold peacefully...';
        if (prev.startsWith('Hold')) return 'Exhale slowly...';
        return 'Inhale gently...';
      });
      setBreathingScale(prev => (prev === 1 ? 1.08 : prev === 1.08 ? 1.04 : 1));
    }, 4000);

    return () => clearInterval(timer);
  }, []);

  // Keyboard shortcut (Esc to exit)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onExit();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onExit]);

  // Toggle Audio Play/Pause
  const togglePlay = () => {
    if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
      className="fixed inset-0 z-50 bg-[#0F1E12] text-emerald-100 flex flex-col justify-between p-6 sm:p-10 select-none overflow-hidden"
    >
      {/* Background Soft Nature Gradients & Particles */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0F1E12] via-[#152B1B] to-[#0A160D] pointer-events-none" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* TOP FLOATING CONTROLS BAR */}
      <div className="relative z-20 flex items-center justify-between">
        {/* Left: Zen Title & Breathing Guide */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-800/40 border border-emerald-500/30 text-emerald-300 flex items-center justify-center">
            <Wind className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="text-xs font-black tracking-widest uppercase text-emerald-400/90 flex items-center gap-1.5">
              <span>Zen Sanctuary</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            </div>
            <div className="text-sm font-semibold text-emerald-100/80">
              {appData.userProfile?.name || 'Eco Advocate'}'s Living Canopy
            </div>
          </div>
        </div>

        {/* Right: Exit Zen Mode Button */}
        <button
          onClick={onExit}
          className="px-4 py-2 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs backdrop-blur-md border border-white/15 flex items-center gap-2 transition-all cursor-pointer hover:scale-105"
          title="Exit Zen Mode (Esc)"
        >
          <span>Exit Zen Mode</span>
          <X className="w-4 h-4 text-emerald-200" />
        </button>
      </div>

      {/* CENTERPIECE: FULLSCREEN ECOTWIN TREE & BREATHING RHYTHM */}
      <div className="relative z-10 my-auto flex flex-col items-center justify-center space-y-6">
        {/* Mindful Breathing Guide Ring */}
        <motion.div
          animate={{ scale: breathingScale }}
          transition={{ duration: 3.8, ease: 'easeInOut' }}
          className="text-center"
        >
          <span className="px-4 py-1.5 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 text-xs font-bold tracking-wider uppercase inline-flex items-center gap-2 shadow-inner">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            {breathingText}
          </span>
        </motion.div>

        {/* Centerpiece Tree */}
        <div className="transform scale-110 sm:scale-125 transition-transform duration-700">
          <EcoTwinTree
            stage={appData.twinStage}
            isRustling={isTreeRustling}
            onWaterTree={() => setIsTreeRustling(true)}
            rollingAvgFootprint={rollingAvgFootprint}
          />
        </div>

        {/* Subtle Tree Stage Label */}
        <div className="text-center space-y-1 pt-4">
          <h3 className="text-xl font-extrabold text-white tracking-tight">
            Stage {appData.twinStage}: {stageInfo.name} Tree
          </h3>
          <p className="text-xs text-emerald-300/70 max-w-sm mx-auto font-medium">
            {stageInfo.description}
          </p>
        </div>
      </div>

      {/* BOTTOM AMBIENT FOREST AUDIO PLAYER BAR */}
      <div className="relative z-20 max-w-xl w-full mx-auto bg-black/30 backdrop-blur-xl border border-white/10 rounded-3xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-2xl">
        {/* Soundscape Selector */}
        <div className="flex items-center gap-1.5 bg-white/5 p-1 rounded-2xl border border-white/5">
          <button
            onClick={() => setSoundscape('breeze')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              soundscape === 'breeze' ? 'bg-emerald-500 text-emerald-950 shadow-xs' : 'text-gray-300 hover:text-white'
            }`}
          >
            <Wind className="w-3.5 h-3.5" />
            <span>Breeze</span>
          </button>

          <button
            onClick={() => setSoundscape('birds')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              soundscape === 'birds' ? 'bg-emerald-500 text-emerald-950 shadow-xs' : 'text-gray-300 hover:text-white'
            }`}
          >
            <Bird className="w-3.5 h-3.5" />
            <span>Canopy</span>
          </button>

          <button
            onClick={() => setSoundscape('rain')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              soundscape === 'rain' ? 'bg-emerald-500 text-emerald-950 shadow-xs' : 'text-gray-300 hover:text-white'
            }`}
          >
            <CloudRain className="w-3.5 h-3.5" />
            <span>Soft Rain</span>
          </button>
        </div>

        {/* Audio Play/Pause & Volume Controls */}
        <div className="flex items-center gap-3">
          {/* Play / Pause Toggle */}
          <button
            onClick={togglePlay}
            className="w-10 h-10 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-emerald-950 flex items-center justify-center font-extrabold transition-all cursor-pointer shadow-md"
            title={isPlaying ? 'Pause Ambient Audio' : 'Play Ambient Audio'}
          >
            {isPlaying ? <Pause className="w-5 h-5 fill-emerald-950" /> : <Play className="w-5 h-5 fill-emerald-950 ml-0.5" />}
          </button>

          {/* Mute Toggle */}
          <button
            onClick={() => setIsMuted(!isMuted)}
            className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 text-emerald-200 flex items-center justify-center transition-colors cursor-pointer"
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted || volume === 0 ? <VolumeX className="w-4 h-4 text-amber-400" /> : <Volume2 className="w-4 h-4" />}
          </button>

          {/* Volume Slider */}
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={isMuted ? 0 : volume}
            onChange={(e) => {
              setVolume(parseFloat(e.target.value));
              if (isMuted) setIsMuted(false);
            }}
            className="w-20 sm:w-28 accent-emerald-400 bg-white/20 rounded-lg cursor-pointer h-1.5"
            title="Ambient Sound Volume"
          />
        </div>
      </div>
    </motion.div>
  );
};
