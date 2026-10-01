import React from 'react';
import { MediaItem } from '../types';
import { Film } from 'lucide-react';

interface SpotifyPlaylistCoverProps {
  items: MediaItem[];
  fallbackIcon?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const SpotifyPlaylistCover: React.FC<SpotifyPlaylistCoverProps> = ({
  items,
  fallbackIcon = '🍿',
  className = '',
  size = 'md',
}) => {
  // Get items with valid artwork, up to 4
  const itemsWithArt = items
    .filter((item) => Boolean(item.poster || item.banner))
    .slice(0, 4);

  const roundedClass = size === 'sm' ? 'rounded-lg' : size === 'lg' ? 'rounded-2xl' : 'rounded-xl';

  // CASE 1: 4 or more items -> Classic 2x2 Spotify Mosaic
  if (itemsWithArt.length >= 4) {
    return (
      <div
        className={`relative aspect-square w-full overflow-hidden bg-[#241712] dark:bg-[#150e0a] grid grid-cols-2 grid-rows-2 shadow-md ${roundedClass} ${className}`}
      >
        {itemsWithArt.slice(0, 4).map((item, idx) => (
          <div key={item.id || idx} className="relative w-full h-full overflow-hidden bg-black/40">
            <img
              src={item.poster || item.banner}
              alt={item.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
            />
          </div>
        ))}
      </div>
    );
  }

  // CASE 2: Single item -> Full square hero cover
  if (itemsWithArt.length === 1) {
    const single = itemsWithArt[0];
    return (
      <div
        className={`relative aspect-square w-full overflow-hidden bg-[#241712] dark:bg-[#150e0a] shadow-md ${roundedClass} ${className}`}
      >
        <img
          src={single.poster || single.banner}
          alt={single.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
      </div>
    );
  }

  // CASE 3: 2 or 3 items -> 2x2 grid with fallback tiles for balance
  if (itemsWithArt.length > 1) {
    return (
      <div
        className={`relative aspect-square w-full overflow-hidden bg-[#241712] dark:bg-[#150e0a] grid grid-cols-2 grid-rows-2 shadow-md ${roundedClass} ${className}`}
      >
        {itemsWithArt.map((item, idx) => (
          <div key={item.id || idx} className="relative w-full h-full overflow-hidden bg-black/40">
            <img
              src={item.poster || item.banner}
              alt={item.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
            />
          </div>
        ))}
        {Array.from({ length: 4 - itemsWithArt.length }).map((_, fIdx) => (
          <div
            key={`fallback-${fIdx}`}
            className="w-full h-full bg-gradient-to-br from-[#3b281f] to-[#1e1410] flex items-center justify-center text-white/40"
          >
            <Film className="w-5 h-5 opacity-40" />
          </div>
        ))}
      </div>
    );
  }

  // CASE 4: Empty list -> Sleek aesthetic icon tile
  return (
    <div
      className={`relative aspect-square w-full overflow-hidden bg-gradient-to-br from-[#3e2b21] via-[#2a1d17] to-[#160f0b] flex flex-col items-center justify-center text-white shadow-md border border-white/5 ${roundedClass} ${className}`}
    >
      <span className="text-4xl sm:text-5xl select-none filter drop-shadow-md transition-transform duration-300 group-hover:scale-110">
        {fallbackIcon}
      </span>
    </div>
  );
};
