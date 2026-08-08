import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { TWIN_STAGES } from '../data/staticData';
import { TwinStage } from '../types';
import { Sparkles, HeartHandshake, Info, ShieldCheck, Leaf, Droplets } from 'lucide-react';

interface EcoTwinTreeProps {
  stage: TwinStage;
  isRustling?: boolean;
  onWaterTree?: () => void;
  rollingAvgFootprint?: number;
  previewOnly?: boolean;
  heroDisplay?: boolean;
}

interface LeafyClusterConfig {
  id: string;
  cx: number;
  cy: number;
  r: number;
  lobes: number;
  seed: number;
  delay: number;
  speedRatio: number;
}

/**
  Generates hand-drawn, scalloped multi-lobed Bézier path contours for Ghibli/Zelda-style leafy foliage clumps.
  Each cluster has 7-9 rounded lobes with organic inward notches, completely avoiding geometric circles or ovals.
*/
function generateLeafyClusterPaths(
  cx: number,
  cy: number,
  r: number,
  numLobes: number,
  seed: number
) {
  const prng = (offset: number) => {
    const x = Math.sin(seed * 12.9898 + offset * 78.233) * 43758.5453;
    return x - Math.floor(x);
  };

  const angleStep = (Math.PI * 2) / numLobes;
  
  const notchPoints: { x: number; y: number; angle: number }[] = [];
  const tipPoints: { x: number; y: number; angle: number; rTip: number }[] = [];

  for (let i = 0; i < numLobes; i++) {
    const notchAngle = i * angleStep + (prng(i * 4 + 1) - 0.5) * 0.18;
    const notchR = r * (0.68 + prng(i * 4 + 2) * 0.14);
    notchPoints.push({
      x: cx + Math.cos(notchAngle) * notchR,
      y: cy + Math.sin(notchAngle) * notchR,
      angle: notchAngle
    });

    const tipAngle = notchAngle + angleStep * 0.5 + (prng(i * 4 + 3) - 0.5) * 0.12;
    const tipR = r * (1.12 + prng(i * 4 + 4) * 0.28);
    tipPoints.push({
      x: cx + Math.cos(tipAngle) * tipR,
      y: cy + Math.sin(tipAngle) * tipR,
      angle: tipAngle,
      rTip: tipR
    });
  }

  let mainPath = `M ${notchPoints[0].x.toFixed(2)} ${notchPoints[0].y.toFixed(2)}`;

  for (let i = 0; i < numLobes; i++) {
    const nextNotch = notchPoints[(i + 1) % numLobes];
    const tip = tipPoints[i];

    const cp1Angle = tip.angle - angleStep * 0.24;
    const cp1R = tip.rTip * 1.25;
    const cp1x = cx + Math.cos(cp1Angle) * cp1R;
    const cp1y = cy + Math.sin(cp1Angle) * cp1R;

    const cp2Angle = tip.angle + angleStep * 0.24;
    const cp2R = tip.rTip * 1.25;
    const cp2x = cx + Math.cos(cp2Angle) * cp2R;
    const cp2y = cy + Math.sin(cp2Angle) * cp2R;

    mainPath += ` C ${cp1x.toFixed(2)} ${cp1y.toFixed(2)}, ${cp2x.toFixed(2)} ${cp2y.toFixed(2)}, ${nextNotch.x.toFixed(2)} ${nextNotch.y.toFixed(2)}`;
  }
  mainPath += " Z";

  const hScale = 0.52;
  const hCx = cx - r * 0.14;
  const hCy = cy - r * 0.2;
  let highlightPath = `M ${(hCx + (notchPoints[0].x - cx) * hScale).toFixed(2)} ${(hCy + (notchPoints[0].y - cy) * hScale).toFixed(2)}`;

  for (let i = 0; i < numLobes; i++) {
    const nextNotch = notchPoints[(i + 1) % numLobes];
    const tip = tipPoints[i];

    const cp1Angle = tip.angle - angleStep * 0.24;
    const cp1R = tip.rTip * 1.25 * hScale;
    const cp1x = hCx + Math.cos(cp1Angle) * cp1R;
    const cp1y = hCy + Math.sin(cp1Angle) * cp1R;

    const cp2Angle = tip.angle + angleStep * 0.24;
    const cp2R = tip.rTip * 1.25 * hScale;
    const cp2x = hCx + Math.cos(cp2Angle) * cp2R;
    const cp2y = hCy + Math.sin(cp2Angle) * cp2R;

    const nx = hCx + (nextNotch.x - cx) * hScale;
    const ny = hCy + (nextNotch.y - cy) * hScale;

    highlightPath += ` C ${cp1x.toFixed(2)} ${cp1y.toFixed(2)}, ${cp2x.toFixed(2)} ${cp2y.toFixed(2)}, ${nx.toFixed(2)} ${ny.toFixed(2)}`;
  }
  highlightPath += " Z";

  const sScale = 0.82;
  const sCx = cx + r * 0.04;
  const sCy = cy + r * 0.14;
  let shadowPath = `M ${(sCx + (notchPoints[0].x - cx) * sScale).toFixed(2)} ${(sCy + (notchPoints[0].y - cy) * sScale).toFixed(2)}`;

  for (let i = 0; i < numLobes; i++) {
    const nextNotch = notchPoints[(i + 1) % numLobes];
    const tip = tipPoints[i];

    const cp1Angle = tip.angle - angleStep * 0.24;
    const cp1R = tip.rTip * 1.25 * sScale;
    const cp1x = sCx + Math.cos(cp1Angle) * cp1R;
    const cp1y = sCy + Math.sin(cp1Angle) * cp1R;

    const cp2Angle = tip.angle + angleStep * 0.24;
    const cp2R = tip.rTip * 1.25 * sScale;
    const cp2x = sCx + Math.cos(cp2Angle) * cp2R;
    const cp2y = sCy + Math.sin(cp2Angle) * cp2R;

    const nx = sCx + (nextNotch.x - cx) * sScale;
    const ny = sCy + (nextNotch.y - cy) * sScale;

    shadowPath += ` C ${cp1x.toFixed(2)} ${cp1y.toFixed(2)}, ${cp2x.toFixed(2)} ${cp2y.toFixed(2)}, ${nx.toFixed(2)} ${ny.toFixed(2)}`;
  }
  shadowPath += " Z";

  return { mainPath, highlightPath, shadowPath };
}

const CLUSTER_CONFIGS: LeafyClusterConfig[] = [
  // Layer 1 - Deep Background Shadow Masses
  { id: 'back-top', cx: 120, cy: 58, r: 42, lobes: 9, seed: 101, delay: 0.1, speedRatio: 0.9 },
  { id: 'back-left', cx: 75, cy: 110, r: 38, lobes: 8, seed: 202, delay: 0.5, speedRatio: 0.8 },
  { id: 'back-right', cx: 165, cy: 110, r: 38, lobes: 8, seed: 303, delay: 0.4, speedRatio: 0.85 },

  // Layer 2 - Middle Main Canopy Masses
  { id: 'mid-far-left', cx: 52, cy: 108, r: 32, lobes: 7, seed: 404, delay: 0.6, speedRatio: 1.15 },
  { id: 'mid-lower-left', cx: 82, cy: 132, r: 35, lobes: 8, seed: 505, delay: 0.3, speedRatio: 1.05 },
  { id: 'mid-center-base', cx: 120, cy: 118, r: 40, lobes: 9, seed: 606, delay: 0.2, speedRatio: 0.95 },
  { id: 'mid-lower-right', cx: 158, cy: 132, r: 35, lobes: 8, seed: 707, delay: 0.45, speedRatio: 1.0 },
  { id: 'mid-far-right', cx: 188, cy: 108, r: 32, lobes: 7, seed: 808, delay: 0.55, speedRatio: 1.1 },

  // Layer 3 - Foreground Crown & Highlights
  { id: 'crown-left', cx: 90, cy: 72, r: 36, lobes: 8, seed: 909, delay: 0.25, speedRatio: 1.0 },
  { id: 'crown-right', cx: 150, cy: 72, r: 36, lobes: 8, seed: 1010, delay: 0.35, speedRatio: 0.95 },
  { id: 'crown-peak', cx: 120, cy: 40, r: 33, lobes: 8, seed: 1111, delay: 0.15, speedRatio: 1.1 },
  { id: 'front-left-crest', cx: 105, cy: 92, r: 35, lobes: 8, seed: 1212, delay: 0.3, speedRatio: 1.0 },
  { id: 'front-right-crest', cx: 138, cy: 95, r: 34, lobes: 7, seed: 1313, delay: 0.4, speedRatio: 1.05 },
];

const CANOPY_CLUSTERS = CLUSTER_CONFIGS.map(config => ({
  ...config,
  paths: generateLeafyClusterPaths(config.cx, config.cy, config.r, config.lobes, config.seed)
}));

export const EcoTwinTree: React.FC<EcoTwinTreeProps> = ({
  stage = 3,
  isRustling = false,
  onWaterTree,
  rollingAvgFootprint,
  previewOnly = false,
  heroDisplay = false
}) => {
  const [showInspector, setShowInspector] = useState(false);
  const [careMessage, setCareMessage] = useState<string | null>(null);
  const stageInfo = TWIN_STAGES[stage] || TWIN_STAGES[3];

  const handleGiveCare = () => {
    if (onWaterTree) onWaterTree();
    setCareMessage("🌱 Care received! Your positive energy nourishes your EcoTwin.");
    setTimeout(() => setCareMessage(null), 3000);
  };

  // Stage-specific color themes for Anime Cel-Shaded Tree
  const getStageTheme = (s: number) => {
    switch (s) {
      case 1: // Wilted
        return {
          canopyBase: '#8A8570',
          canopyHighlight: '#A8A28C',
          canopyShadow: '#6B6653',
          trunkBase: '#7A5E43',
          trunkShadow: '#523C27',
          groundColor: '#C4B79A',
          strokeColor: '#3A3228',
          glowFilter: 'none',
          droopAngle: 6, // drooping clusters
          swaySpeed: 4.5,
          swayRange: 1.5,
          flowerAccents: false
        };
      case 2: // Recovering
        return {
          canopyBase: '#8FAE7C',
          canopyHighlight: '#ACCA9B',
          canopyShadow: '#6D8A5C',
          trunkBase: '#6B4C2E',
          trunkShadow: '#48311B',
          groundColor: '#B0D49C',
          strokeColor: '#25381E',
          glowFilter: 'none',
          droopAngle: 2,
          swaySpeed: 3.8,
          swayRange: 2.5,
          flowerAccents: false
        };
      case 3: // Budding
        return {
          canopyBase: '#7FC98F',
          canopyHighlight: '#A2E6B0',
          canopyShadow: '#57A368',
          trunkBase: '#5C3D1E',
          trunkShadow: '#3D2610',
          groundColor: '#86EFAC',
          strokeColor: '#1E3623',
          glowFilter: 'none',
          droopAngle: 0,
          swaySpeed: 3.2,
          swayRange: 3.5,
          flowerAccents: true
        };
      case 4: // Thriving
        return {
          canopyBase: '#3EA066',
          canopyHighlight: '#68C78D',
          canopyShadow: '#287346',
          trunkBase: '#4D3015',
          trunkShadow: '#311C0A',
          groundColor: '#4ADE80',
          strokeColor: '#112918',
          glowFilter: 'drop-shadow(0 0 16px rgba(62, 160, 102, 0.35))',
          droopAngle: -1,
          swaySpeed: 2.8,
          swayRange: 4.5,
          flowerAccents: true
        };
      case 5: // Flourishing
        return {
          canopyBase: '#2F8F5B',
          canopyHighlight: '#59BA83',
          canopyShadow: '#1B613A',
          trunkBase: '#3D230C',
          trunkShadow: '#241203',
          groundColor: '#34D399',
          strokeColor: '#0C2113',
          glowFilter: 'drop-shadow(0 0 28px rgba(47, 143, 91, 0.55))',
          droopAngle: -2,
          swaySpeed: 2.2,
          swayRange: 5.5,
          flowerAccents: true
        };
      default:
        return {
          canopyBase: '#7FC98F',
          canopyHighlight: '#A2E6B0',
          canopyShadow: '#57A368',
          trunkBase: '#5C3D1E',
          trunkShadow: '#3D2610',
          groundColor: '#86EFAC',
          strokeColor: '#1E3623',
          glowFilter: 'none',
          droopAngle: 0,
          swaySpeed: 3.2,
          swayRange: 3.5,
          flowerAccents: true
        };
    }
  };

  const theme = getStageTheme(stage);

  const treeWidth = previewOnly ? "80" : heroDisplay ? "380" : "260";
  const treeHeight = previewOnly ? "90" : heroDisplay ? "410" : "280";

  return (
    <div className={`relative flex flex-col items-center justify-center ${previewOnly ? 'w-auto h-auto p-0 my-0 overflow-hidden' : heroDisplay ? 'w-full max-w-2xl py-2 mx-auto' : 'w-full max-w-md mx-auto'} select-none`}>
      {/* Interactive Container */}
      <div 
        onClick={() => !previewOnly && setShowInspector(true)}
        className={`group relative flex flex-col items-center justify-center ${!previewOnly ? 'cursor-pointer' : ''}`}
        title={!previewOnly ? "Click tree to inspect health details" : undefined}
      >
        {/* Soft Ambient Radial Sun Glow Aura around Canopy */}
        {heroDisplay && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-80 h-80 rounded-full bg-emerald-400/10 blur-3xl animate-pulse" />
          </div>
        )}

        {/* Floating Pollen Particles / Floating Leaves */}
        {!previewOnly && (
          <div className="absolute inset-0 pointer-events-none overflow-visible">
            {[0, 1, 2, 3, 4].map((i) => (
              <motion.div
                key={`drifting-leaf-${i}`}
                className="absolute text-emerald-700/80"
                style={{
                  left: `${15 + i * 18}%`,
                  top: `${15 + (i % 3) * 20}%`
                }}
                animate={{
                  y: [-12, 24, -12],
                  x: [-20, 20, -20],
                  rotate: [0, 180, 360],
                  scale: [0.8, 1.2, 0.8],
                  opacity: stage >= 4 ? [0.4, 0.95, 0.4] : [0.15, 0.5, 0.15]
                }}
                transition={{
                  duration: 5.5 + i * 1.2,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 0.9
                }}
              >
                {i % 2 === 0 ? (
                  <svg width={heroDisplay ? "18" : "14"} height={heroDisplay ? "18" : "14"} viewBox="0 0 24 24" fill={theme.canopyBase} stroke={theme.strokeColor} strokeWidth="2">
                    <path d="M11 20A9 9 0 0 1 2 11c0-4.5 3.5-8.2 8-9 0 0 3 2 3 6s-2 6-2 6 4-1 6-3c.8 4.5-2.9 9-6 9z" />
                  </svg>
                ) : (
                  <div className="w-2 h-2 rounded-full bg-amber-300/80 shadow-[0_0_8px_rgba(252,211,77,0.8)]" />
                )}
              </motion.div>
            ))}
          </div>
        )}

        {/* Tree SVG Avatar - Anime Cel-Shaded Style with Continuous Breathing */}
        <motion.div
          animate={{
            rotate: isRustling ? [-5, 5, -4, 4, 0] : [0, 0],
            scale: isRustling ? [1, 1.08, 1] : [1, 1.02, 0.99, 1],
            y: isRustling ? [-6, 2, 0] : [0, -3, 0]
          }}
          transition={{
            duration: isRustling ? 0.7 : 5,
            repeat: isRustling ? 0 : Infinity,
            ease: "easeInOut"
          }}
          className="relative transition-transform duration-300 group-hover:scale-[1.02]"
        >
          <svg
            width={treeWidth}
            height={treeHeight}
            viewBox="0 0 240 260"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ filter: theme.glowFilter }}
            className="transition-all duration-700 ease-in-out drop-shadow-md"
          >
            <defs>
              {/* Cel Shading Gradient or Pattern */}
              <linearGradient id={`trunk-grad-${stage}`} x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor={theme.trunkShadow} />
                <stop offset="40%" stopColor={theme.trunkBase} />
                <stop offset="100%" stopColor={theme.trunkBase} />
              </linearGradient>
            </defs>

            {/* Ground Shadow Ellipse */}
            <ellipse
              cx="120"
              cy="236"
              rx="68"
              ry="11"
              fill={theme.groundColor}
              fillOpacity="0.5"
              stroke={theme.strokeColor}
              strokeWidth="2"
            />
            <ellipse
              cx="120"
              cy="236"
              rx="46"
              ry="6"
              fill="#122415"
              fillOpacity="0.15"
            />

            {/* Tree Roots */}
            <path
              d="M102 232 C108 226, 112 216, 115 200 M138 232 C132 226, 128 216, 125 200"
              stroke={theme.strokeColor}
              strokeWidth="6"
              strokeLinecap="round"
            />
            <path
              d="M102 232 C108 226, 112 216, 115 200 M138 232 C132 226, 128 216, 125 200"
              stroke={theme.trunkBase}
              strokeWidth="3.5"
              strokeLinecap="round"
            />

            {/* Tree Trunk & Major Branches with Bold Anime Line Outline */}
            <g id="anime-trunk">
              <path
                d="M106 230 C110 180, 112 140, 115 100 L125 100 C128 140, 130 180, 134 230 Z"
                fill={`url(#trunk-grad-${stage})`}
                stroke={theme.strokeColor}
                strokeWidth="2.5"
                strokeLinejoin="round"
              />

              {/* Major Branch Left */}
              <path
                d="M116 130 C96 112, 80 108, 68 115 C75 125, 92 122, 115 138 Z"
                fill={theme.trunkBase}
                stroke={theme.strokeColor}
                strokeWidth="2"
              />

              {/* Major Branch Right */}
              <path
                d="M124 125 C144 110, 160 106, 172 112 C165 122, 148 120, 125 132 Z"
                fill={theme.trunkBase}
                stroke={theme.strokeColor}
                strokeWidth="2"
              />

              {/* Bark Highlight Accents */}
              <path
                d="M120 190 C121 170, 120 150, 121 130"
                stroke={theme.trunkShadow}
                strokeWidth="2"
                strokeLinecap="round"
                opacity="0.6"
              />
            </g>

            {/* ANIME CANOPY - 13 Hand-Drawn Multi-Lobed Scalloped Leaf Clumps */}
            <g id="anime-canopy">
              {CANOPY_CLUSTERS.map((c) => (
                <motion.g
                  key={c.id}
                  style={{ transformOrigin: `${c.cx}px ${c.cy + 10}px` }}
                  animate={{
                    rotate: [
                      theme.droopAngle - theme.swayRange * c.speedRatio,
                      theme.droopAngle + theme.swayRange * c.speedRatio,
                      theme.droopAngle - theme.swayRange * c.speedRatio
                    ],
                    y: [0, -1.5, 0]
                  }}
                  transition={{
                    duration: theme.swaySpeed * c.speedRatio,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: c.delay
                  }}
                >
                  {/* Main Scalloped Leaf Mass (Fill + Bold Anime Line Outline) */}
                  <path
                    d={c.paths.mainPath}
                    fill={theme.canopyBase}
                    stroke={theme.strokeColor}
                    strokeWidth="2.2"
                    strokeLinejoin="round"
                    className="transition-colors duration-700"
                  />

                  {/* Cel Shading Bottom Shadow Mass */}
                  <path
                    d={c.paths.shadowPath}
                    fill={theme.canopyShadow}
                    className="transition-colors duration-700 opacity-65 pointer-events-none"
                  />

                  {/* Cel Shading Top Highlight Spot */}
                  <path
                    d={c.paths.highlightPath}
                    fill={theme.canopyHighlight}
                    className="transition-colors duration-700 opacity-90 pointer-events-none"
                  />
                </motion.g>
              ))}

              {/* Stage 3, 4 & 5 Blooming Dot & Flower Accents */}
              {theme.flowerAccents && stage >= 3 && (
                <g id="anime-flowers" className="pointer-events-none">
                  {/* Stage 3: Small light sprouts */}
                  <circle cx="85" cy="70" r="3.5" fill="#FEF08A" stroke={theme.strokeColor} strokeWidth="1" />
                  <circle cx="155" cy="70" r="3.5" fill="#FEF08A" stroke={theme.strokeColor} strokeWidth="1" />
                  
                  {/* Stage 4 & 5: Blossom blossoms */}
                  {stage >= 4 && (
                    <>
                      <circle cx="120" cy="35" r="5" fill="#F472B6" stroke={theme.strokeColor} strokeWidth="1.2" />
                      <circle cx="70" cy="100" r="4.5" fill="#F472B6" stroke={theme.strokeColor} strokeWidth="1.2" />
                      <circle cx="170" cy="100" r="4.5" fill="#F472B6" stroke={theme.strokeColor} strokeWidth="1.2" />
                    </>
                  )}

                  {stage === 5 && (
                    <>
                      <circle cx="100" cy="55" r="5" fill="#FBBF24" stroke={theme.strokeColor} strokeWidth="1.2" />
                      <circle cx="140" cy="55" r="5" fill="#FBBF24" stroke={theme.strokeColor} strokeWidth="1.2" />
                      <circle cx="120" cy="85" r="5.5" fill="#F472B6" stroke={theme.strokeColor} strokeWidth="1.2" />
                    </>
                  )}
                </g>
              )}
            </g>
          </svg>
        </motion.div>

        {/* Stage Badge Label (if not in preview grid) */}
        {!previewOnly && (
          <motion.div 
            initial={false}
            animate={{ scale: isRustling ? [1, 1.08, 1] : 1 }}
            className="mt-3 inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold text-white shadow-md transition-colors border border-white/30"
            style={{ backgroundColor: stageInfo.color }}
          >
            <Leaf className="w-3.5 h-3.5 fill-white/20" />
            <span>Stage {stage}: {stageInfo.name}</span>
            {stage >= 4 && <Sparkles className="w-3.5 h-3.5 text-yellow-200" />}
          </motion.div>
        )}

        {/* Inspection Hint */}
        {!previewOnly && (
          <span className="mt-1.5 text-[11px] font-semibold text-emerald-900/70 group-hover:text-emerald-900 transition-colors flex items-center gap-1">
            <Info className="w-3 h-3 text-emerald-700" /> Tap tree to inspect health
          </span>
        )}
      </div>

      {/* Primary Status Line below tree */}
      {!previewOnly && (
        <div className="mt-4 text-center px-4 max-w-md">
          <p className="text-sm md:text-base font-bold text-[#1B2B1E] leading-snug">
            "{stageInfo.statusLine}"
          </p>
          <p className="mt-1 text-xs text-gray-600 line-clamp-2">
            {stageInfo.description}
          </p>
        </div>
      )}

      {/* Quick Care Button */}
      {!previewOnly && (
        <div className="mt-3 flex items-center gap-2">
          <button
            onClick={handleGiveCare}
            className="px-4 py-2 rounded-2xl bg-emerald-100 hover:bg-emerald-200 text-emerald-900 text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs border border-emerald-300/50 cursor-pointer active:scale-95"
          >
            <Droplets className="w-3.5 h-3.5 text-emerald-700 fill-emerald-500/30" />
            Nourish EcoTwin
          </button>
        </div>
      )}

      {/* Care Toast feedback */}
      <AnimatePresence>
        {!previewOnly && careMessage && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-2 px-3.5 py-1.5 rounded-xl bg-emerald-900 text-white text-xs font-semibold shadow-lg flex items-center gap-2 border border-emerald-700"
          >
            <HeartHandshake className="w-4 h-4 text-emerald-300" />
            <span>{careMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* TREE INSPECTION MODAL */}
      <AnimatePresence>
        {!previewOnly && showInspector && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white/95 backdrop-blur-md rounded-3xl p-6 max-w-md w-full shadow-2xl border border-emerald-200 text-[#1B2B1E] relative overflow-hidden"
            >
              <button
                onClick={() => setShowInspector(false)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center text-sm font-bold transition-colors cursor-pointer"
              >
                ✕
              </button>

              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 rounded-2xl bg-emerald-100 text-emerald-800">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-[#1B2B1E]">EcoTwin Companion Status</h3>
                  <p className="text-xs text-gray-500 font-medium">Anime-Stylized Living Carbon Companion</p>
                </div>
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200/60">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold text-gray-700">Growth Stage:</span>
                    <span className="font-bold px-2.5 py-0.5 rounded-full text-white text-[11px]" style={{ backgroundColor: stageInfo.color }}>
                      Stage {stage}: {stageInfo.name}
                    </span>
                  </div>
                  <p className="text-gray-600 font-medium">{stageInfo.description}</p>
                </div>

                <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200/80 text-amber-950">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold flex items-center gap-1.5 text-amber-900">
                      <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                      Rolling Avg Footprint:
                    </span>
                    <span className="font-extrabold text-sm text-amber-900">
                      {rollingAvgFootprint !== undefined ? `${rollingAvgFootprint.toFixed(1)} kg CO2e/day` : '3.8 kg CO2e/day'}
                    </span>
                  </div>
                  <p className="text-[11px] text-amber-900/80 mt-1 leading-snug">
                    Your EcoTwin's foliage color, sway animation, and blossoms respond directly to your 7-day rolling footprint average across Transport, Food, Energy, and Digital activities.
                  </p>
                </div>

                <div className="p-3 rounded-2xl bg-gray-50 border border-gray-200 text-gray-600 space-y-1.5">
                  <p className="font-bold text-gray-800">🌳 How to help your tree flourish:</p>
                  <ul className="list-disc list-inside space-y-1 text-gray-600">
                    <li>Reduce streaming resolution (1080p/720p saves CO2)</li>
                    <li>Choose plant-based meals & sustainable transit</li>
                    <li>Complete daily personalized challenges</li>
                  </ul>
                </div>
              </div>

              <div className="mt-5 flex gap-2">
                <button
                  onClick={() => {
                    handleGiveCare();
                    setShowInspector(false);
                  }}
                  className="flex-1 py-3 rounded-2xl bg-[#2F8F5B] hover:bg-[#287A4D] text-white font-extrabold text-xs flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer"
                >
                  <Droplets className="w-4 h-4" />
                  Nourish EcoTwin
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
