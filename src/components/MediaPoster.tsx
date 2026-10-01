import React, { useState } from 'react';
import {
  ClapperboardSticker,
  RetroTVSticker,
  AstronautSticker,
  GhostSticker,
  ActionCamSticker,
  PopcornSticker,
} from './stickers/Stickers';
import { MediaType } from '../types';

interface MediaPosterProps {
  src?: string;
  alt: string;
  type?: MediaType;
  genres?: string[];
  title?: string;
  year?: number | string;
  className?: string;
  aspectRatio?: 'portrait' | 'landscape' | 'square';
  stickerSize?: number;
}

export const MediaPoster: React.FC<MediaPosterProps> = ({
  src,
  alt,
  type = 'movie',
  genres = [],
  title,
  year,
  className = '',
  aspectRatio = 'portrait',
  stickerSize = 64,
}) => {
  const [imageError, setImageError] = useState(!src || src.trim() === '');
  const [isLoaded, setIsLoaded] = useState(false);

  // Pick appropriate sticker based on genre and media type
  const renderSticker = () => {
    const genreStr = (genres || []).join(' ').toLowerCase();
    if (genreStr.includes('horror') || genreStr.includes('thriller')) {
      return <GhostSticker size={stickerSize} />;
    }
    if (genreStr.includes('sci-fi') || genreStr.includes('science fiction') || genreStr.includes('space')) {
      return <AstronautSticker size={stickerSize} />;
    }
    if (genreStr.includes('action') || genreStr.includes('crime') || genreStr.includes('mystery')) {
      return <ActionCamSticker size={stickerSize} />;
    }
    if (genreStr.includes('animation') || genreStr.includes('comedy')) {
      return <PopcornSticker size={stickerSize} />;
    }
    if (type === 'series') {
      return <RetroTVSticker size={stickerSize} />;
    }
    return <ClapperboardSticker size={stickerSize} />;
  };

  const aspectClass =
    aspectRatio === 'portrait'
      ? 'aspect-[2/3]'
      : aspectRatio === 'landscape'
      ? 'aspect-[16/9]'
      : 'aspect-square';

  return (
    <div
      className={`relative overflow-hidden rounded-2xl bg-[#f4f4f5] dark:bg-[#1a120e] border border-black/5 dark:border-white/5 flex items-center justify-center ${aspectClass} ${className}`}
    >
      {/* Real Poster Image (when valid and not errored) */}
      {!imageError && src && (
        <img
          src={src}
          alt={alt}
          referrerPolicy="no-referrer"
          loading="lazy"
          onLoad={() => setIsLoaded(true)}
          onError={() => setImageError(true)}
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
        />
      )}

      {/* Loading Skeleton if image is still loading */}
      {!imageError && !isLoaded && src && (
        <div className="absolute inset-0 bg-[#e4e4e7] dark:bg-[#251a15] animate-pulse flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-[#09090b] dark:border-[#faf6f2] border-t-transparent rounded-full animate-spin opacity-50" />
        </div>
      )}

      {/* Cute Sticker Fallback if image failed, missing, or errored */}
      {imageError && (
        <div className="absolute inset-0 p-3 flex flex-col items-center justify-between text-center bg-gradient-to-b from-[#ffffff] via-[#f8f9fa] to-[#f4f4f5] dark:from-[#251a15] dark:via-[#1e1511] dark:to-[#17110e]">
          <div className="w-full flex items-center justify-between text-[11px] font-bold text-[#71717a] dark:text-[#baa698] px-1 pt-1">
            <span className="uppercase tracking-wider text-amber-600 dark:text-[#caa282] text-[10px]">
              {type === 'series' ? 'Series' : 'Movie'}
            </span>
            {year && <span className="tabular-nums font-mono">{year}</span>}
          </div>

          <div className="my-auto py-2 flex items-center justify-center transform transition-transform group-hover:scale-105 duration-200">
            {renderSticker()}
          </div>

          <div className="w-full pb-1 px-1">
            <p className="text-xs font-bold text-[#09090b] dark:text-[#faf6f2] line-clamp-2 leading-tight">
              {title || alt}
            </p>
            {genres && genres.length > 0 && (
              <p className="text-[10px] text-[#71717a] mt-0.5 line-clamp-1">
                {genres.slice(0, 2).join(' · ')}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
