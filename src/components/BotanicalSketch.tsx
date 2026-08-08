import React from 'react';

export const BotanicalSketch: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <svg
      viewBox="0 0 600 900"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`pointer-events-none select-none ${className}`}
    >
      <g stroke="#2C3D2E" strokeWidth="0.85" strokeLinecap="round" strokeLinejoin="round" opacity="0.32">
        {/* Main Trunk & Major Branches */}
        <path d="M 350 900 Q 340 700 360 500 T 330 200 T 350 0" />
        <path d="M 345 900 Q 335 700 352 500 T 325 200 T 345 0" strokeWidth="0.5" />
        
        {/* Secondary Branches Right */}
        <path d="M 355 750 C 420 700 480 620 550 580" />
        <path d="M 358 620 C 440 560 500 460 580 400" />
        <path d="M 350 480 C 420 400 490 310 570 240" />
        <path d="M 340 320 C 410 240 480 150 560 80" />
        <path d="M 335 200 C 400 120 460 60 520 10" />

        {/* Secondary Branches Left */}
        <path d="M 348 780 C 290 730 220 680 150 650" />
        <path d="M 352 640 C 270 580 200 510 120 460" />
        <path d="M 345 510 C 280 440 210 360 140 300" />
        <path d="M 338 350 C 270 270 190 190 120 120" />

        {/* Detailed Leaves - Cluster 1 (Top Right) */}
        <path d="M 550 580 C 570 560 590 570 580 590 C 570 600 550 590 550 580 Z" />
        <path d="M 550 580 L 570 585" strokeWidth="0.4" />
        <path d="M 580 400 C 600 380 610 390 600 410 C 590 420 575 410 580 400 Z" />
        <path d="M 570 240 C 590 220 600 230 590 250 C 580 260 565 250 570 240 Z" />

        {/* Detailed Serrated Leaf Outline Drawings */}
        <g strokeWidth="0.6">
          {/* Maple/Oak Leaf 1 */}
          <path d="M 450 480 Q 470 450 490 460 T 520 440 T 540 470 T 510 490 T 520 520 T 480 510 T 450 480" />
          <path d="M 450 480 L 510 490" strokeWidth="0.4" />
          <path d="M 470 475 L 485 460" strokeWidth="0.3" />
          <path d="M 485 480 L 500 465" strokeWidth="0.3" />

          {/* Leaf 2 */}
          <path d="M 420 380 Q 440 350 460 360 T 490 340 T 510 370 T 480 390 T 490 420 T 450 410 T 420 380" />
          <path d="M 420 380 L 480 390" strokeWidth="0.4" />

          {/* Leaf 3 */}
          <path d="M 380 260 Q 400 230 420 240 T 450 220 T 470 250 T 440 270 T 450 300 T 410 290 T 380 260" />
          <path d="M 380 260 L 440 270" strokeWidth="0.4" />

          {/* Leaf 4 (Top) */}
          <path d="M 360 140 Q 380 110 400 120 T 430 100 T 450 130 T 420 150 T 430 180 T 390 170 T 360 140" />
          <path d="M 360 140 L 420 150" strokeWidth="0.4" />

          {/* Bottom Large Leaf */}
          <path d="M 480 620 Q 510 580 540 600 T 580 570 T 600 610 T 560 640 T 570 680 T 520 670 T 480 620" />
          <path d="M 480 620 L 560 640" strokeWidth="0.4" />
        </g>

        {/* Small hanging seed pods / keys */}
        <path d="M 450 520 Q 440 560 435 590" strokeWidth="0.5" />
        <path d="M 435 590 C 425 610 445 620 440 595 Z" fill="#2C3D2E" fillOpacity="0.08" />
        <path d="M 480 420 Q 470 460 465 490" strokeWidth="0.5" />
        <path d="M 465 490 C 455 510 475 520 470 495 Z" fill="#2C3D2E" fillOpacity="0.08" />
      </g>
    </svg>
  );
};
