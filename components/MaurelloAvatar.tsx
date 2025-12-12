
import React, { useEffect, useRef } from 'react';

interface MaurelloAvatarProps {
  isActive: boolean;
  isAiSpeaking: boolean;
  isAiThinking: boolean;
  size?: 'sm' | 'lg';
  videoStream?: MediaStream | null;
}

export const MaurelloAvatar: React.FC<MaurelloAvatarProps> = ({ 
  isActive, 
  isAiSpeaking, 
  isAiThinking, 
  size = 'lg',
  videoStream 
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  // Responsive dimensions: 300px on mobile (fit screen), 550px on desktop
  const dimension = size === 'lg' 
    ? 'w-[300px] h-[300px] md:w-[550px] md:h-[550px]' 
    : 'w-8 h-8';
  
  const strokeWidth = size === 'lg' ? "1.5" : "8"; 
  
  const isUserSpeaking = isActive && !isAiSpeaking && !isAiThinking;

  // ANIMATIONS
  const blueCircleClass = isAiThinking
    ? 'animate-spin-meditative' // Spin when thinking
    : isUserSpeaking 
        ? 'animate-pulse-slow' // Pulse when user speaks
        : '';

  const haloClass = isAiThinking
    ? 'animate-pulse-slow' // Halo also active when thinking
    : isAiSpeaking 
        ? 'animate-pulse-slow' // Pulse when AI speaks
        : '';

  useEffect(() => {
    if (videoRef.current && videoStream) {
      videoRef.current.srcObject = videoStream;
    }
  }, [videoStream]);

  return (
    <div 
      className={`relative flex items-center justify-center ${dimension} transition-all duration-700 flex-shrink-0 mx-auto`}
    >
      {/* 
        VIDEO LAYER (User's Camera)
        Positioned to match the exact diameter of the Blue Circle in the SVG.
        SVG ViewBox: 0 0 100 100
        Blue Circle: cx=50, cy=65, r=24 -> Diameter 48
        Left: (50 - 24) = 26%
        Top: (65 - 24) = 41%
        Width/Height: 48%
      */}
      {size === 'lg' && videoStream && (
        <div 
            className="absolute z-0 overflow-hidden rounded-full bg-black"
            style={{
                top: '41%',
                left: '26%',
                width: '48%',
                height: '48%',
            }}
        >
             <video 
               ref={videoRef}
               autoPlay 
               playsInline 
               muted 
               className="w-full h-full object-cover transform scale-x-[-1]" // Mirror effect
             />
             {/* Blue tint overlay to integrate video with the avatar aesthetic */}
             <div className="absolute inset-0 bg-[#00F0FF]/10 mix-blend-overlay"></div>
        </div>
      )}

      {/* SVG LAYER */}
      <svg 
        viewBox="0 0 100 100" 
        className="w-full h-full relative z-10 pointer-events-none"
        style={{ overflow: 'visible', filter: 'drop-shadow(0px 0px 30px rgba(0, 240, 255, 0.2))' }}
      >
        <defs>
          <linearGradient id="blueLuxeGradient" x1="15%" y1="15%" x2="85%" y2="85%">
            <stop offset="0%" stopColor="#00F0FF" /> {/* Neon Cyan */}
            <stop offset="100%" stopColor="#0066FF" /> {/* Electric Blue */}
          </linearGradient>

          <linearGradient id="goldMetallicGradient" x1="0%" y1="0%" x2="100%" y2="20%">
            <stop offset="0%" stopColor="#FFF700" />   {/* Neon Lemon */}
            <stop offset="100%" stopColor="#FFAA00" />  {/* Neon Amber */}
          </linearGradient>

          <filter id="softGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="1.2" result="blur" />
            <feComposite in="blur" in2="SourceGraphic" operator="over" />
          </filter>
        </defs>

        {/* BODY (Blue Circle) */}
        <circle 
          cx="50" 
          cy="65" 
          r="24" 
          fill="none" 
          stroke="url(#blueLuxeGradient)" 
          strokeWidth={strokeWidth}
          className={`
            transition-all duration-700 ease-in-out origin-[50px_65px]
            ${blueCircleClass}
          `}
        />

        {/* HALO (Golden Ellipse) - Positioned at cy=38 to float/touch top */}
        <g className="origin-[50px_38px]">
            <ellipse 
            cx="50" 
            cy="38" 
            rx="24" 
            ry="6" 
            fill="none" 
            stroke="url(#goldMetallicGradient)" 
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            filter="url(#softGlow)"
            className={`
                transition-all duration-700 ease-in-out origin-center
                ${haloClass}
            `}
            />
        </g>
      </svg>
    </div>
  );
};
