import React from 'react';
import { useCollection } from '../context/CollectionContext';
import { getGenreBadgeComputedStyle, resolveGenreColor } from '../utils/genreColors';
import { GenrePillStyle, GenreBadgeSize } from '../types';

interface GenreBadgeProps {
  genre: string;
  size?: GenreBadgeSize;
  className?: string;
  pillStyleOverride?: GenrePillStyle;
  colorsOverride?: Record<string, string>;
  isDarkOverride?: boolean;
  onClick?: (e: React.MouseEvent) => void;
  showDot?: boolean;
}

export const GenreBadge: React.FC<GenreBadgeProps> = ({
  genre,
  size,
  className = '',
  pillStyleOverride,
  colorsOverride,
  isDarkOverride,
  onClick,
  showDot,
}) => {
  const collection = useCollection();
  const genreColors = colorsOverride || collection.genreColors || {};
  const pillStyle = pillStyleOverride || collection.genrePillStyle || 'solid';
  const isDark = isDarkOverride !== undefined ? isDarkOverride : collection.theme === 'dark';
  const effectiveSize = size || collection.genreBadgeSize || 'sm';

  const computed = getGenreBadgeComputedStyle(genre, genreColors, pillStyle, isDark);
  const rawColor = resolveGenreColor(genre, genreColors);

  const sizeClasses = {
    xs: 'text-[9.5px] px-2 py-0.5 rounded-md gap-1 font-bold',
    sm: 'text-[11.5px] px-2.5 py-1 rounded-full gap-1.5 font-bold',
    md: 'text-[13px] px-3.5 py-1.5 rounded-full gap-2 font-black',
    lg: 'text-sm sm:text-[15px] px-4.5 py-2 rounded-2xl gap-2.5 font-black tracking-normal',
  }[effectiveSize];

  const dotSizeClasses = {
    xs: 'w-1 h-1',
    sm: 'w-1.5 h-1.5',
    md: 'w-2 h-2',
    lg: 'w-2.5 h-2.5',
  }[effectiveSize];

  const shouldRenderDot = showDot || pillStyle === 'outline';

  return (
    <span
      onClick={onClick}
      style={computed.style}
      className={`inline-flex items-center tracking-tight leading-none select-none transition-all ${sizeClasses} ${computed.className} ${
        onClick ? 'cursor-pointer hover:scale-105 active:scale-95' : ''
      } ${className}`}
    >
      {shouldRenderDot && (
        <span
          className={`${dotSizeClasses} rounded-full shrink-0 shadow-xs`}
          style={{ backgroundColor: rawColor }}
        />
      )}
      <span className="truncate">{genre}</span>
    </span>
  );
};

