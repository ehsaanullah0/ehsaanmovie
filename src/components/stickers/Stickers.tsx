import React from 'react';

interface StickerProps {
  className?: string;
  size?: number;
}

export const ClapperboardSticker: React.FC<StickerProps> = ({ className = '', size = 80 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`drop-shadow-sm select-none ${className}`}
  >
    {/* Clapperboard Body */}
    <rect
      x="18"
      y="38"
      width="64"
      height="46"
      rx="8"
      className="fill-neutral-900 stroke-amber-400 dark:stroke-amber-400 stroke-2"
    />
    
    {/* Screen / Slate Area */}
    <rect
      x="24"
      y="44"
      width="52"
      height="34"
      rx="4"
      className="fill-neutral-800 dark:fill-neutral-800/90"
    />
    
    {/* Cute Star / Heart on slate */}
    <path
      d="M50 50L52 56H58L53 60L55 66L50 62L45 66L47 60L42 56H48L50 50Z"
      className="fill-amber-400"
    />
    <path
      d="M32 71H68"
      className="stroke-neutral-500 stroke-2 stroke-linecap-round"
    />

    {/* Hinged Clapper Top (angled) */}
    <g transform="rotate(-10 20 34)">
      <rect
        x="16"
        y="24"
        width="68"
        height="14"
        rx="4"
        className="fill-neutral-900 stroke-amber-400 stroke-2"
      />
      {/* Stripes */}
      <polygon points="26,24 33,24 27,38 20,38" className="fill-amber-400" />
      <polygon points="41,24 48,24 42,38 35,38" className="fill-amber-400" />
      <polygon points="56,24 63,24 57,38 50,38" className="fill-amber-400" />
      <polygon points="71,24 78,24 72,38 65,38" className="fill-amber-400" />
      {/* Hinge screw */}
      <circle cx="21" cy="31" r="2.5" className="fill-amber-300" />
    </g>

    {/* Cute Sparkle */}
    <path
      d="M82 22L83.5 27L88.5 28.5L83.5 30L82 35L80.5 30L75.5 28.5L80.5 27L82 22Z"
      className="fill-amber-400 animate-pulse"
    />
  </svg>
);

export const RetroTVSticker: React.FC<StickerProps> = ({ className = '', size = 80 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`drop-shadow-sm select-none ${className}`}
  >
    {/* Antennas */}
    <line x1="36" y1="20" x2="47" y2="35" className="stroke-amber-400 stroke-2 stroke-linecap-round" />
    <line x1="64" y1="20" x2="53" y2="35" className="stroke-amber-400 stroke-2 stroke-linecap-round" />
    <circle cx="35" cy="19" r="3" className="fill-amber-400" />
    <circle cx="65" cy="19" r="3" className="fill-amber-400" />

    {/* TV Body */}
    <rect
      x="16"
      y="32"
      width="68"
      height="50"
      rx="10"
      className="fill-neutral-900 stroke-amber-400 stroke-2"
    />
    
    {/* Screen */}
    <rect
      x="22"
      y="38"
      width="44"
      height="38"
      rx="6"
      className="fill-neutral-800"
    />
    
    {/* Cute Face on Screen */}
    <circle cx="36" cy="54" r="3" className="fill-amber-400" />
    <circle cx="52" cy="54" r="3" className="fill-amber-400" />
    <path d="M41 60Q44 63 47 60" className="stroke-amber-400 stroke-2 stroke-linecap-round" />

    {/* TV Knobs */}
    <circle cx="74" cy="46" r="4" className="fill-neutral-800 stroke-amber-400 stroke-1.5" />
    <circle cx="74" cy="60" r="4" className="fill-neutral-800 stroke-amber-400 stroke-1.5" />
    {/* Speaker slats */}
    <line x1="71" y1="71" x2="77" y2="71" className="stroke-amber-400/80 stroke-1.5 stroke-linecap-round" />
    <line x1="71" y1="74" x2="77" y2="74" className="stroke-amber-400/80 stroke-1.5 stroke-linecap-round" />

    {/* TV Legs */}
    <line x1="28" y1="82" x2="22" y2="90" className="stroke-amber-400 stroke-2.5 stroke-linecap-round" />
    <line x1="72" y1="82" x2="78" y2="90" className="stroke-amber-400 stroke-2.5 stroke-linecap-round" />
  </svg>
);

export const AstronautSticker: React.FC<StickerProps> = ({ className = '', size = 80 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`drop-shadow-sm select-none ${className}`}
  >
    {/* Helmet Outer */}
    <circle cx="50" cy="46" r="28" className="fill-neutral-900 stroke-amber-400 stroke-2" />
    {/* Visor */}
    <ellipse cx="50" cy="46" rx="20" ry="16" className="fill-neutral-800 stroke-amber-400 stroke-2" />
    {/* Visor Glint / Star reflection */}
    <path
      d="M44 38L45 42L49 43L45 44L44 48L43 44L39 43L43 42L44 38Z"
      className="fill-amber-300"
    />
    <path
      d="M58 48L58.5 50.5L61 51L58.5 51.5L58 54L57.5 51.5L55 51L57.5 50.5L58 48Z"
      className="fill-amber-400"
    />
    
    {/* Neck Ring */}
    <rect x="36" y="72" width="28" height="6" rx="3" className="fill-amber-400" />
    {/* Shoulder Suit */}
    <path
      d="M26 88C26 78 35 76 50 76C65 76 74 78 74 88"
      className="stroke-amber-400 stroke-2 stroke-linecap-round"
    />
    {/* Cute Ears / Antenna pods */}
    <rect x="18" y="41" width="5" height="10" rx="2" className="fill-amber-400" />
    <rect x="77" y="41" width="5" height="10" rx="2" className="fill-amber-400" />
  </svg>
);

export const GhostSticker: React.FC<StickerProps> = ({ className = '', size = 80 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`drop-shadow-sm select-none ${className}`}
  >
    {/* Ghost Body */}
    <path
      d="M26 50C26 36 36 22 50 22C64 22 74 36 74 50V74C74 78 69 77 66 74C63 71 59 72 58 75C56 78 52 78 50 75C48 72 44 71 41 74C38 77 33 78 33 74C33 70 26 76 26 74V50Z"
      className="fill-neutral-900 stroke-amber-400 stroke-2"
    />
    {/* Eyes */}
    <ellipse cx="43" cy="44" rx="4" ry="5" className="fill-amber-400" />
    <ellipse cx="57" cy="44" rx="4" ry="5" className="fill-amber-400" />
    <circle cx="44" cy="42" r="1.5" className="fill-neutral-900" />
    <circle cx="58" cy="42" r="1.5" className="fill-neutral-900" />
    {/* Cute Mouth */}
    <ellipse cx="50" cy="54" rx="3.5" ry="4.5" className="fill-amber-400" />
    {/* Little popcorn cup held */}
    <g transform="translate(62, 58) rotate(10)">
      <polygon points="2,6 14,6 12,20 4,20" className="fill-amber-400 stroke-neutral-900 stroke-1" />
      <circle cx="5" cy="4" r="3" className="fill-amber-200" />
      <circle cx="10" cy="4" r="3" className="fill-amber-200" />
      <circle cx="8" cy="2" r="2.5" className="fill-amber-100" />
    </g>
  </svg>
);

export const ActionCamSticker: React.FC<StickerProps> = ({ className = '', size = 80 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`drop-shadow-sm select-none ${className}`}
  >
    {/* Camera Body */}
    <rect x="20" y="38" width="46" height="36" rx="6" className="fill-neutral-900 stroke-amber-400 stroke-2" />
    {/* Lens Barrel */}
    <circle cx="43" cy="56" r="13" className="fill-neutral-800 stroke-amber-400 stroke-2" />
    <circle cx="43" cy="56" r="7" className="fill-neutral-900 stroke-amber-400 stroke-1.5" />
    <circle cx="41" cy="54" r="2" className="fill-amber-300" />

    {/* Film Reels on Top */}
    <circle cx="34" cy="28" r="10" className="fill-neutral-900 stroke-amber-400 stroke-2" />
    <circle cx="34" cy="28" r="4" className="fill-amber-400" />
    <circle cx="54" cy="28" r="10" className="fill-neutral-900 stroke-amber-400 stroke-2" />
    <circle cx="54" cy="28" r="4" className="fill-amber-400" />

    {/* Viewfinder / Flash */}
    <rect x="66" y="44" width="16" height="24" rx="3" className="fill-neutral-800 stroke-amber-400 stroke-2" />
    <circle cx="74" cy="56" r="3" className="fill-amber-400" />
  </svg>
);

export const PopcornSticker: React.FC<StickerProps> = ({ className = '', size = 80 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`drop-shadow-sm select-none ${className}`}
  >
    {/* Popcorn Puffs */}
    <circle cx="36" cy="34" r="8" className="fill-amber-200 stroke-amber-400 stroke-1.5" />
    <circle cx="50" cy="30" r="9" className="fill-amber-100 stroke-amber-400 stroke-1.5" />
    <circle cx="64" cy="34" r="8" className="fill-amber-200 stroke-amber-400 stroke-1.5" />
    <circle cx="44" cy="24" r="7" className="fill-amber-300 stroke-amber-400 stroke-1.5" />
    <circle cx="56" cy="25" r="7" className="fill-amber-200 stroke-amber-400 stroke-1.5" />

    {/* Bucket */}
    <polygon points="28,42 72,42 64,84 36,84" className="fill-neutral-900 stroke-amber-400 stroke-2" />
    {/* Bucket Stripes */}
    <polygon points="37,42 43,42 41,84 37,84" className="fill-amber-400" />
    <polygon points="49,42 55,42 52,84 48,84" className="fill-amber-400" />
    <polygon points="61,42 67,42 63,84 59,84" className="fill-amber-400" />
    
    {/* Star badge on bucket */}
    <circle cx="51" cy="63" r="7" className="fill-neutral-900 stroke-amber-400 stroke-1.5" />
    <path d="M51 58L52.5 61.5H56L53 63.5L54.5 67L51 65L47.5 67L49 63.5L46 61.5H49.5L51 58Z" className="fill-amber-400" />
  </svg>
);

export const HeroStickerArtwork: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`relative flex items-center justify-center p-3 select-none ${className}`}>
    {/* Background Soft Glow */}
    <div className="absolute inset-0 bg-amber-400/10 dark:bg-amber-400/5 rounded-full blur-2xl pointer-events-none" />
    
    {/* Floating elements composition */}
    <div className="relative flex items-center justify-center gap-2">
      <div className="transform -rotate-6 transition-transform hover:rotate-0 duration-300">
        <ClapperboardSticker size={105} />
      </div>
      <div className="transform rotate-8 translate-y-3 transition-transform hover:rotate-0 duration-300">
        <RetroTVSticker size={95} />
      </div>
      <div className="hidden sm:block transform -rotate-12 -translate-y-2 transition-transform hover:rotate-0 duration-300">
        <PopcornSticker size={85} />
      </div>
    </div>
  </div>
);
