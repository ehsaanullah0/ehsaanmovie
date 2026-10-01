import React from 'react';

interface StreamingBadgeProps {
  platform: 'netflix' | 'apple' | 'prime' | 'disney' | 'max' | 'hulu' | 'criterion' | 'paramount' | string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const OttStreamingBadge: React.FC<StreamingBadgeProps> = ({
  platform,
  className = '',
  size = 'md',
}) => {
  const norm = platform.toLowerCase();

  const sizeClasses = {
    sm: 'h-8 text-xs px-3 gap-2',
    md: 'h-10 text-sm px-4 gap-2.5',
    lg: 'h-12 text-base px-5 gap-3',
  }[size];

  if (norm.includes('netflix')) {
    return (
      <div
        className={`inline-flex items-center font-bold tracking-tight rounded-md bg-[#141414] text-white border border-[#E50914]/30 shadow-xs hover:border-[#E50914] transition-colors ${sizeClasses} ${className}`}
      >
        <span className="text-[#E50914] font-black tracking-wider text-[1.1em]">N</span>
        <span>Netflix</span>
      </div>
    );
  }

  if (norm.includes('apple')) {
    return (
      <div
        className={`inline-flex items-center font-semibold tracking-tight rounded-md bg-[#000000] text-white border border-white/20 shadow-xs hover:border-white/50 transition-colors ${sizeClasses} ${className}`}
      >
        <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 170 170">
          <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.69-3.04-7.69-7.85-12-14.42-6-9.13-10.74-19.46-14.23-31-3.48-11.53-5.22-22.38-5.22-32.54 0-14.35 3.69-26.09 11.07-35.21 7.39-9.13 16.52-13.8 27.4-14.01 4.58 0 9.89 1.25 15.93 3.75 6.04 2.5 10.05 3.86 12.02 4.08 1.52-.22 5.76-1.63 12.74-4.22 6.97-2.61 12.4-3.8 16.29-3.59 12.61.65 22.72 5.33 30.33 14.02-11.08 6.74-16.52 16.08-16.3 28.04.22 9.35 3.8 17.18 10.75 23.48 6.96 6.3 15.11 9.89 24.46 10.76-2.18 6.74-4.68 13.04-7.51 18.91zM119.22 31.09c0-7.17 2.61-13.8 7.83-19.89 5.21-6.08 11.63-9.89 19.23-11.2-1.3 6.96-4.24 13.37-8.8 19.24-4.57 5.87-10.55 9.89-17.94 12.06-.21-.07-.32-.21-.32-.21z"/>
        </svg>
        <span>Apple TV+</span>
      </div>
    );
  }

  if (norm.includes('prime') || norm.includes('amazon')) {
    return (
      <div
        className={`inline-flex items-center font-bold tracking-tight rounded-md bg-[#00050d] text-[#00A8E1] border border-[#00A8E1]/30 shadow-xs hover:border-[#00A8E1] transition-colors ${sizeClasses} ${className}`}
      >
        <span className="text-[#00A8E1] font-black">prime</span>
        <span className="text-white font-normal">video</span>
      </div>
    );
  }

  if (norm.includes('max') || norm.includes('hbo')) {
    return (
      <div
        className={`inline-flex items-center font-black tracking-wider rounded-md bg-[#001744] text-[#002be8] border border-[#002be8]/40 shadow-xs hover:border-[#002be8] transition-colors ${sizeClasses} ${className}`}
      >
        <span className="text-white font-black">max</span>
      </div>
    );
  }

  if (norm.includes('disney')) {
    return (
      <div
        className={`inline-flex items-center font-bold tracking-tight rounded-md bg-[#040714] text-white border border-[#0063e5]/40 shadow-xs hover:border-[#0063e5] transition-colors ${sizeClasses} ${className}`}
      >
        <span className="text-[#0063e5] font-black italic">Disney+</span>
      </div>
    );
  }

  if (norm.includes('criterion')) {
    return (
      <div
        className={`inline-flex items-center font-mono font-bold tracking-widest rounded-md bg-[#111111] text-white border border-neutral-700 shadow-xs hover:border-white transition-colors ${sizeClasses} ${className}`}
      >
        <span className="w-3.5 h-3.5 rounded-full border-2 border-white inline-flex items-center justify-center text-[9px] font-black leading-none">C</span>
        <span>CRITERION</span>
      </div>
    );
  }

  if (norm.includes('hulu')) {
    return (
      <div
        className={`inline-flex items-center font-black tracking-tight rounded-md bg-[#0b1410] text-[#1ce783] border border-[#1ce783]/30 shadow-xs hover:border-[#1ce783] transition-colors ${sizeClasses} ${className}`}
      >
        <span>hulu</span>
      </div>
    );
  }

  return (
    <div
      className={`inline-flex items-center font-medium rounded-md bg-[#1e1713] text-[#d6c4b8] border border-[#3d2d24] shadow-xs hover:border-[#735848] transition-colors ${sizeClasses} ${className}`}
    >
      <span>{platform}</span>
    </div>
  );
};
