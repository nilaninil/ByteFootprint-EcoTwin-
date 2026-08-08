import React, { useRef, useEffect, useState } from 'react';

interface BackgroundVideoProps {
  opacity?: number;
  videoUrl?: string;
}

export const BackgroundVideo: React.FC<BackgroundVideoProps> = ({
  opacity = 0.55,
  videoUrl = "https://videos.pexels.com/video-files/1448735/1448735-uhd_2732_1440_24fps.mp4"
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {
        // Autoplay policy or offline catch
        setHasError(true);
      });
    }
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none">
      {!hasError ? (
        <video
          ref={videoRef}
          src={videoUrl}
          autoPlay
          loop
          muted
          playsInline
          onError={() => setHasError(true)}
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-1000"
          style={{ opacity }}
        />
      ) : (
        /* Fallback soft animated ambient forest gradient if video is unavailable */
        <div 
          className="absolute inset-0 w-full h-full bg-gradient-to-br from-emerald-950/20 via-teal-900/10 to-amber-950/20 animate-pulse"
          style={{ opacity: opacity * 1.2 }}
        />
      )}

      {/* EcoTwin Theme Soft Clear Light Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#F6FAF4]/45 via-[#F6FAF4]/25 to-[#F6FAF4]/60" />

      {/* Floating Ambient Dust Particles & Drifting Pollen */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Soft Radial Sun Rays */}
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gradient-to-b from-amber-200/15 via-emerald-100/10 to-transparent blur-3xl rounded-full" />
        
        {/* Floating Ambient Dust / Pollen Motes */}
        <div className="absolute inset-0 opacity-40">
          <div className="absolute top-1/4 left-1/6 w-1.5 h-1.5 rounded-full bg-amber-200 blur-[0.5px] animate-ping" style={{ animationDuration: '4s' }} />
          <div className="absolute top-1/3 right-1/4 w-2 h-2 rounded-full bg-emerald-300 blur-[0.5px] animate-pulse" style={{ animationDuration: '6s' }} />
          <div className="absolute bottom-1/3 left-1/3 w-1.5 h-1.5 rounded-full bg-amber-100 blur-[0.5px] animate-ping" style={{ animationDuration: '5s' }} />
          <div className="absolute top-1/2 right-1/6 w-2 h-2 rounded-full bg-green-200 blur-[0.5px] animate-pulse" style={{ animationDuration: '7s' }} />
        </div>
      </div>
    </div>
  );
};
