import { GenrePillStyle } from '../types';

export const STANDARD_GENRES = [
  'Action',
  'Adventure',
  'Animation',
  'Comedy',
  'Crime',
  'Documentary',
  'Drama',
  'Family',
  'Fantasy',
  'History',
  'Horror',
  'Music',
  'Mystery',
  'Romance',
  'Sci-Fi',
  'Thriller',
  'War',
  'Western',
];

// Default Signature Camel color for unified elegance
export const DEFAULT_GENRE_COLOR = '#caa282';

export const GENRE_PRESET_PALETTES: {
  id: string;
  name: string;
  description: string;
  previewColors: string[];
  colors: Record<string, string>;
}[] = [
  {
    id: 'signature-camel',
    name: 'Signature Camel & Sand',
    description: 'Unified warm caramel & sand tone matching the Ehsaan signature aesthetic',
    previewColors: ['#caa282', '#dfc3ab', '#b88f6f', '#e6d0bc'],
    colors: STANDARD_GENRES.reduce((acc, g) => ({ ...acc, [g]: '#caa282' }), {}),
  },
  {
    id: 'cinema-spectrum',
    name: 'Cinema Spectrum',
    description: 'Distinctive, rich cinematic hues tailored for each genre',
    previewColors: ['#e63946', '#00b4d8', '#f4a261', '#9d4edd', '#06d6a0'],
    colors: {
      Action: '#e63946',
      Adventure: '#2a9d8f',
      Animation: '#f4a261',
      Comedy: '#e9c46a',
      Crime: '#8338ec',
      Documentary: '#457b9d',
      Drama: '#d4a373',
      Family: '#06d6a0',
      Fantasy: '#9d4edd',
      History: '#bc6c25',
      Horror: '#b5179e',
      Music: '#ff006e',
      Mystery: '#3a86ff',
      Romance: '#ff758f',
      'Sci-Fi': '#00b4d8',
      'Science Fiction': '#00b4d8',
      Thriller: '#e76f51',
      War: '#6c584c',
      Western: '#c08552',
    },
  },
  {
    id: 'neon-cyberpunk',
    name: 'Neon Cyberpunk',
    description: 'High-voltage electric neons that pop with vivid intensity',
    previewColors: ['#00f0ff', '#ff007f', '#39ff14', '#b026ff', '#ffe600'],
    colors: {
      Action: '#ff0055',
      Adventure: '#00f0ff',
      Animation: '#ffe600',
      Comedy: '#39ff14',
      Crime: '#b026ff',
      Documentary: '#00d2ff',
      Drama: '#ff7700',
      Family: '#00ffaa',
      Fantasy: '#d600ff',
      History: '#ffaa00',
      Horror: '#ff0033',
      Music: '#ff007f',
      Mystery: '#7b00ff',
      Romance: '#ff3399',
      'Sci-Fi': '#00f0ff',
      'Science Fiction': '#00f0ff',
      Thriller: '#ff4400',
      War: '#88ff00',
      Western: '#ff9900',
    },
  },
  {
    id: 'warm-terracotta',
    name: 'Warm Terracotta & Espresso',
    description: 'Earth-toned ochres, roasted coffee, amber, and terracotta clays',
    previewColors: ['#c86d51', '#d9822b', '#b35c37', '#caa282', '#8c4830'],
    colors: {
      Action: '#c85a32',
      Adventure: '#b36d3c',
      Animation: '#e08a47',
      Comedy: '#d9a74a',
      Crime: '#7a4e3a',
      Documentary: '#8c6b54',
      Drama: '#caa282',
      Family: '#cf986e',
      Fantasy: '#96634d',
      History: '#a15b39',
      Horror: '#6e3c2b',
      Music: '#c4694b',
      Mystery: '#7d5240',
      Romance: '#d47b62',
      'Sci-Fi': '#a88164',
      'Science Fiction': '#a88164',
      Thriller: '#b85433',
      War: '#734e38',
      Western: '#9c5f3a',
    },
  },
  {
    id: 'midnight-slate',
    name: 'Midnight Slate & Emerald',
    description: 'Cool celestial tones: deep indigos, icy teals, and muted emeralds',
    previewColors: ['#38bdf8', '#818cf8', '#2dd4bf', '#a78bfa', '#34d399'],
    colors: {
      Action: '#38bdf8',
      Adventure: '#2dd4bf',
      Animation: '#818cf8',
      Comedy: '#34d399',
      Crime: '#6366f1',
      Documentary: '#64748b',
      Drama: '#94a3b8',
      Family: '#5eead4',
      Fantasy: '#a78bfa',
      History: '#78716c',
      Horror: '#475569',
      Music: '#c084fc',
      Mystery: '#0284c7',
      Romance: '#f472b6',
      'Sci-Fi': '#0ea5e9',
      'Science Fiction': '#0ea5e9',
      Thriller: '#0d9488',
      War: '#52525b',
      Western: '#71717a',
    },
  },
  {
    id: 'pastel-velvet',
    name: 'Pastel Velvet',
    description: 'Gentle, modern aesthetic pastels with high visual comfort',
    previewColors: ['#f472b6', '#c084fc', '#38bdf8', '#4ade80', '#fbbf24'],
    colors: {
      Action: '#fb7185',
      Adventure: '#2dd4bf',
      Animation: '#fcd34d',
      Comedy: '#fde047',
      Crime: '#c084fc',
      Documentary: '#93c5fd',
      Drama: '#fdba74',
      Family: '#86efac',
      Fantasy: '#d8b4fe',
      History: '#e2e8f0',
      Horror: '#f43f5e',
      Music: '#f472b6',
      Mystery: '#a5b4fc',
      Romance: '#fda4af',
      'Sci-Fi': '#67e8f9',
      'Science Fiction': '#67e8f9',
      Thriller: '#f97316',
      War: '#cbd5e1',
      Western: '#f59e0b',
    },
  },
];

// Quick palette swatch circle options for the color picker
export const QUICK_SWATCH_COLORS = [
  '#caa282', // Signature Camel
  '#e63946', // Crimson Red
  '#f97316', // Bright Orange
  '#f59e0b', // Amber
  '#eab308', // Warm Gold
  '#10b981', // Emerald
  '#06d6a0', // Mint
  '#00b4d8', // Cyan
  '#0284c7', // Sky Blue
  '#3a86ff', // Cobalt Blue
  '#6366f1', // Indigo
  '#8338ec', // Violet
  '#9d4edd', // Purple
  '#b5179e', // Blood Plum
  '#ff007f', // Electric Pink
  '#ec4899', // Blush Rose
  '#8c5e42', // Terracotta
  '#1c120c', // Espresso Dark
  '#52525b', // Slate Gray
  '#ffffff', // Pure White
];

/**
 * Calculates optimal text color (#1c120c or #ffffff) based on background luminance
 */
export function getContrastTextColor(hexColor: string): string {
  if (!hexColor) return '#1c120c';
  const clean = hexColor.replace('#', '').trim();
  if (clean.length === 3) {
    const r = parseInt(clean[0] + clean[0], 16);
    const g = parseInt(clean[1] + clean[1], 16);
    const b = parseInt(clean[2] + clean[2], 16);
    const yiq = (r * 299 + g * 587 + b * 114) / 1000;
    return yiq >= 155 ? '#1c120c' : '#ffffff';
  }
  if (clean.length === 6) {
    const r = parseInt(clean.substring(0, 2), 16);
    const g = parseInt(clean.substring(2, 4), 16);
    const b = parseInt(clean.substring(4, 6), 16);
    const yiq = (r * 299 + g * 587 + b * 114) / 1000;
    return yiq >= 155 ? '#1c120c' : '#ffffff';
  }
  return '#1c120c';
}

/**
 * Resolves color for a given genre name from mapping, with intelligent fallbacks
 */
export function resolveGenreColor(genreName: string, colorsMap?: Record<string, string>): string {
  if (!genreName) return DEFAULT_GENRE_COLOR;
  if (!colorsMap) return DEFAULT_GENRE_COLOR;

  // Direct match
  if (colorsMap[genreName]) return colorsMap[genreName];

  // Normalized key match
  const lower = genreName.toLowerCase().trim();
  for (const [k, v] of Object.entries(colorsMap)) {
    if (k.toLowerCase().trim() === lower) return v;
  }

  // Common aliases
  if (lower.includes('sci-fi') || lower.includes('science fiction')) {
    return colorsMap['Sci-Fi'] || colorsMap['Science Fiction'] || '#00b4d8';
  }
  if (lower.includes('action') || lower.includes('adventure')) {
    return colorsMap['Action'] || colorsMap['Adventure'] || '#e63946';
  }

  return DEFAULT_GENRE_COLOR;
}

/**
 * Computes CSS styles for a genre pill given style mode and theme
 */
export function getGenreBadgeComputedStyle(
  genreName: string,
  colorsMap: Record<string, string>,
  pillStyle: GenrePillStyle = 'solid',
  isDark = true
): {
  style: React.CSSProperties;
  className: string;
  dotColor?: string;
} {
  const hex = resolveGenreColor(genreName, colorsMap);
  const contrastText = getContrastTextColor(hex);

  switch (pillStyle) {
    case 'soft':
      return {
        style: {
          backgroundColor: `${hex}22`, // ~13% opacity
          borderColor: `${hex}66`, // ~40% opacity
          color: isDark ? (getContrastTextColor(hex) === '#1c120c' ? hex : '#faf6f2') : hex,
        },
        className: 'border backdrop-blur-xs font-bold transition-all shadow-2xs',
        dotColor: hex,
      };

    case 'outline':
      return {
        style: {
          backgroundColor: 'transparent',
          borderColor: `${hex}99`,
          color: isDark ? '#faf6f2' : '#1c120c',
        },
        className: 'border font-bold transition-all hover:bg-white/5',
        dotColor: hex,
      };

    case 'gradient':
      return {
        style: {
          backgroundImage: `linear-gradient(135deg, ${hex}, ${hex}cc)`,
          borderColor: `${hex}88`,
          color: contrastText,
        },
        className: 'border font-extrabold shadow-xs transition-all',
      };

    case 'solid':
    default:
      return {
        style: {
          backgroundColor: hex,
          borderColor: `${hex}aa`,
          color: contrastText,
        },
        className: 'border font-extrabold shadow-2xs transition-all',
      };
  }
}
