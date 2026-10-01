import React, { useRef, useState, useEffect } from 'react';
import {
  Settings as SettingsIcon,
  Sun,
  Moon,
  Download,
  Upload,
  RotateCcw,
  CheckCircle,
  AlertCircle,
  ShieldCheck,
  Database,
  Sliders,
  Palette,
  Sparkles,
  History,
  Check,
  Trash2,
  CheckSquare,
  HardDrive,
  Wifi,
  WifiOff,
  Clock,
  Save,
  ChevronDown,
  ChevronUp,
  Tag,
  Eye,
  RefreshCw,
  Pipette,
  Layers,
  SlidersHorizontal,
  Film,
  Maximize2,
  Minimize2,
  Scaling,
} from 'lucide-react';
import { useCollection } from '../context/CollectionContext';
import { GenreBadge } from '../components/GenreBadge';
import {
  STANDARD_GENRES,
  GENRE_PRESET_PALETTES,
  QUICK_SWATCH_COLORS,
  DEFAULT_GENRE_COLOR,
  resolveGenreColor,
} from '../utils/genreColors';
import { GenrePillStyle, GenreBadgeSize } from '../types';

interface ChangelogVersion {
  version: string;
  date: string;
  badge: string;
  points: string[];
}

const CHANGELOG_DATA: ChangelogVersion[] = [
  {
    version: 'v2.9.0 — Custom Genre Color Selector & Live Look Preview',
    date: 'Current Release',
    badge: 'Latest',
    points: [
      'Custom Genre Sizing Scale: Freely adjust genre badge scale between Compact, Standard, Medium, and Spacious Hero sizes across the app.',
      'Custom Genre Color Selector: Added comprehensive per-genre color customizer with quick swatches and unrestricted hex color wheel.',
      'Interactive Live Look & Feel Preview: Real-time visual simulation with mock movie titles and dark/light canvas toggle.',
      'Distinctive Pill Aesthetics: Select between Solid Fill, Soft Frosted Glow, Minimalist Outline, and Gradient Shine.',
      '6 Curated Cinema Presets: 1-click apply Cinema Spectrum, Neon Cyberpunk, Warm Terracotta, Midnight Slate, or Pastel Velvet.',
      'Monochromatic Theme Option: Quickly apply your favorite chosen color across all genres in one click.',
    ],
  },
  {
    version: 'v2.8.0 — Watchlist Default Status & Pure Grid Architecture',
    date: 'Recent Release',
    badge: 'Previous',
    points: [
      'Watchlist Default "In Watchlist" Status: Configured the Watchlist section to show "In Watchlist" items by default, cleanly hiding watched and watching titles.',
      'Watchlist Consolidation: Fully unified personal collection under the "Watchlist" name, retaining all custom lists, vault tools, and archive features.',
      'Pure Poster Grid Architecture: Removed list and table view toggles and rendering completely across all pages in favor of an immersive poster grid.',
      'Dynamic Watchlist Counters: Updated sidebar and mobile bottom navigation badges to reflect accurate queued watchlist item counts.',
    ],
  },
  {
    version: 'v2.7.0 — High-Contrast `#FFE96B` Theme & Filter Bar Polish',
    date: 'Recent Release',
    badge: 'Enhancement',
    points: [
      'High-Contrast Yellow-Gold Buttons: Upgraded Filter and Random Pick buttons with custom #FFE96B fill, bold borders, and strong dark typography.',
      'Dedicated Watched Quick Filter: Replaced quick-sort selector with a direct "Watched" button to instantly filter completed films and series.',
      'Moved Sort & Recently Added to Drawer: Integrated "Recently Added" and full sorting controls inside the expandable Filters drawer.',
      'Crisp White Search Bar Outlines: Added clean white border outlines and drop shadows to all search inputs across the app.',
      'Repositioned Preview Rating Badge: Moved the star rating badge directly above titles in the media preview window.',
      'Removed Preview Title Kicker: Removed the uppercase fire/feature film tracker banner above titles for a clean, editorial look.',
      '#FFE96B Genre Chips: Styled preview modal genre pills with bold #FFE96B yellow-gold badges.',
      'Hidden Details Button Default: Set preview window "Details" popover button to hidden by default, configurable in settings.',
      'Mobile Top Bar Streamlining: Removed settings icon from mobile/tablet top bar and styled filter drawer to match Ehsaan profile aesthetic.',
    ],
  },
  {
    version: 'v2.6.3 — Offline Local Storage & Data Preservation',
    date: 'Previous Release',
    badge: 'Storage',
    points: [
      'Offline Local Copy: Added dedicated "Save Local Copy" feature archiving full library state into local storage.',
      'Offline Resilience: The app now seamlessly operates offline with your saved local copy whenever internet connectivity is unavailable.',
      'Removed Sample Reset: Removed reload sample catalog button from the backup section for safer data ownership.',
      'Offline Notice: Prominent offline guidance added to ensure users can preserve their personal cinema collection locally.',
    ],
  },
  {
    version: 'v2.6.2 — Polish & Backdrop Customization',
    date: 'Previous Release',
    badge: 'Polish',
    points: [
      'Backdrop Opacity Slider: Added a settings slider to customize backdrop art visibility (0-100%).',
      'Refined Modal UI: Overlayed header action buttons on banner art for a cleaner look.',
      'Black Like Button: Liked state now features a distinct black fill for better contrast.',
      'Episode Pill UI: Replaced thumbnails with streamlined pill-shaped episode list items featuring circular status ticks.',
    ],
  },
  {
    version: 'v2.5 — Clean Minimalist Home & Polished Preview Architecture',
    date: 'Previous Release',
    badge: 'Enhancement',
    points: [
      'Streamlined Home Page: Removed Harmonic Depth cards, Accessible Tracking cards, Curated List promotional blocks, and Recent Archive Activity log for an uncluttered focus.',
      'Polished Preview Window Surface: Brightened modal surfaces and background art with luminous travertine gradients and high-contrast typography.',
      'Increased Backdrop Visibility: Boosted background art banner opacity to 60% for a more immersive preview experience.',
      'Episode Thumbnails: Added visual streaming episode thumbnails to all TV series episode tracking lists for a professional look.',
      'Batch Selection & Deletion: Maintained settings toggle for bulk multi-item selection and deletion across views.',
      'Remove All Data Utility: Kept secure one-click data purge option in settings to clear local storage items.',
      'Search & Detail Visual Parity: Retained reference design matching for search result cards and immersive media preview modals.',
    ],
  },
  {
    version: 'v2.4 — Batch Selection, Data Removal & Screenshot UI Parity',
    date: 'Previous Release',
    badge: 'Enhancement',
    points: [
      'Batch Selection & Deletion Toggle: Added settings toggle to enable multi-item selection checkboxes across collection views for bulk deletion.',
      'Remove All Data Utility: Added a secure one-click data purge option in settings to clear all local items, lists, and activity history with confirmation.',
      'Search Result Card Visual Parity: Redesigned search result and universal search cards to match reference design with vertical portrait posters, prominent titles, overview excerpts, and release year / rating badge chips.',
      'Movie & Series Detail Modal Redesign: Restyled detail modals with immersive backdrop banner overlay, floating poster thumbnail, release year & runtime subtitle, genre pill badges, overview card container, personal notes editor, and circular cast photo avatars.',
      'Live TMDB Multi-Search Engine: Connected search modal and search view directly to TMDB API for live movie, TV series, and cast discovery.',
      'High-Resolution CDN Posters: Integrated TMDB official image pipeline delivering crisp theatrical posters and wide backdrops.',
      'Guaranteed Image Fallback: Protected against missing or failed posters by smoothly falling back to custom animated sticker illustrations.',
      'Local-First Watchlist Architecture: Retained 100% local browser persistence for watchlist items, progress, personal ratings, and notes without external DBs.',
    ],
  },
  {
    version: 'v2.3 — TMDB Universal API Integration & Live Discovery',
    date: 'Previous Release',
    badge: 'Enhancement',
    points: [
      'Live TMDB Multi-Search Engine: Connected search modal and search view directly to TMDB API for live movie, TV series, and cast discovery.',
      'High-Resolution CDN Posters: Integrated TMDB official image pipeline delivering crisp theatrical posters and wide backdrops.',
      'Guaranteed Image Fallback: Protected against missing or failed posters by smoothly falling back to custom animated sticker illustrations.',
      'Comprehensive Media Details: Enhanced detail modals with TMDB runtime, director, cast rosters, release dates, ratings, and backdrops.',
      'TV Series Season & Episode Sync: Structured multi-season rosters and individual episode trackers from live TMDB television metadata.',
      'Local-First Watchlist Architecture: Retained 100% local browser persistence for watchlist items, progress, personal ratings, and notes without external DBs.',
      'Resilient In-Memory Caching: Added query and detail caching with graceful fallback handling for timeouts or network disruptions.',
      'Unaltered Minimalist UI: Maintained all existing warm biscuit/espresso styling, theme switching, layout controls, and animations.',
    ],
  },
  {
    version: 'v2.2 — Brand Popcorn Identity & Full-Screen Immersion',
    date: 'Previous Release',
    badge: 'Enhancement',
    points: [
      'Brand Hero Headline Update: Changed main hero headline to "EHSAAN MOVIE" with subtitle "a platform for all you favourite stuff".',
      'White Outlined Popcorn Cup Brand Icon: Designed a minimalist vector popcorn bucket logo with warm roasted espresso background.',
      'Universal Favicon & App Icon: Deployed the popcorn icon across browser tabs (favicon.svg), app assets (icon.svg), and PWA manifests.',
      'Full-Screen Distraction-Free Workspace: Configured sidebar to completely hide out of view with zero margins for an uninterrupted full-screen experience.',
      'Header Popcorn Logo Trigger: Added brand popcorn icon in top navigation bar that acts as the reveal trigger when the sidebar is hidden.',
      'Smooth Sidebar Transition: Animated sidebar sliding out from and tucking away behind the brand logo.',
      'PWA Manifest & Mobile Web Integration: Integrated standalone web app manifest with brand icon colors and theme metadata.',
    ],
  },
  {
    version: 'v2.1 — Profile Customization & Sidebar Navigation',
    date: 'Previous Release',
    badge: 'Enhancement',
    points: [
      'Collapsible Sidebar Layout: Added desktop expand/collapse toggle switching between slim icon bar and full drawer navigation.',
      'Refined Sidebar Layout: Removed the static showcase vault container to maximize navigation space and minimalism.',
      'Expandable Custom Lists: Integrated an arrow chevron toggle to collapse and expand the My Lists section at will.',
      'Interactive User Profile Drawer: Clicking the top-right avatar reveals a dedicated user profile modal popover.',
      'Editable User Display Name: Added inline user profile name customization with instant local storage persistence.',
      'Profile Photo Upload: Enabled custom avatar picture upload with local storage, camera icon overlay, and fallback initials.',
      'Quick Export & Import in Header: Integrated one-click JSON backup export and restore file picker directly in the profile drawer.',
    ],
  },
  {
    version: 'v2.0 — Harmonic Minimalist Redesign',
    date: 'Previous Release',
    badge: 'Major',
    points: [
      'Warm Sand & Travertine Canvas: Implemented bespoke biscuit-sand base palette (#e8dad0) and rich roasted espresso surfaces (#231814) inspired by the reference design.',
      'Harmonic Depth Color Science: Layered tone hierarchy spanning espresso (#342721), roasted mocha (#594235), and toasted caramel (#a07b5e) for organic depth.',
      'High-Contrast Metrics Banner: Added solid espresso strip displaying real-time catalog totals, watchlist counts, and watching metrics with tabular figures.',
      'Minimalist Hero Architecture: Introduced centered editorial typography, pill kicker badges, and dual primary/secondary action buttons with comfortable padding.',
      'Numbered Bento Depth Cards: Styled 01-02-03 feature blocks with clean numerical indicators and direct navigation routes.',
      'Universal Component Restyling: Redesigned Sidebar, TopBar, and Navigation with tight hairlines, rounded-2xl geometry, and responsive drawer controls.',
      'Refreshed Modal Overlays: Restyled Universal Search (⌘K), Media Detail modal, Episode Tracker, and Custom List creator with warm espresso surfaces.',
      'Zero-Pill Metadata Discipline: Cleaned up metadata chips into refined typographic separators and high-contrast segmented controls.',
      'Theme Switch Engine: Configured Tailwind v4 @custom-variant dark with synchronized DOM class and data-theme attributes for seamless switching between Light Sand and Roasted Dark modes.',
    ],
  },
  {
    version: 'v1.0 — Initial Collection Engine',
    date: 'Initial Build',
    badge: 'Foundation',
    points: [
      'Personal movie and TV series library cataloging with local storage persistence.',
      'Watchlist, Currently Watching, and Completed status management.',
      'Per-episode checkmarks and seasonal tracking calculation for series.',
      'Universal search with director and actor catalog query engine.',
      'JSON export and import backup utilities for complete data ownership.',
      'Custom list creation with personalized emoji badges and descriptions.',
      'Personal star ratings (1-10) and review notes per media item.',
    ],
  },
];

export const SettingsView: React.FC = () => {
  const {
    theme,
    setTheme,
    items,
    customLists,
    exportCollectionJson,
    importCollectionJson,
    resetToDefaultData,
    removeAllData,
    isBatchSelectEnabled,
    setIsBatchSelectEnabled,
    showPreviewArtwork,
    setShowPreviewArtwork,
    previewArtworkOpacity,
    setPreviewArtworkOpacity,
    previewShowTagline,
    setPreviewShowTagline,
    previewShowGenres,
    setPreviewShowGenres,
    previewShowMatchScore,
    setPreviewShowMatchScore,
    previewShowRatingBadge,
    setPreviewShowRatingBadge,
    previewShowQualityBadge,
    setPreviewShowQualityBadge,
    previewShowTrailerButton,
    setPreviewShowTrailerButton,
    previewShowCuratedListButton,
    setPreviewShowCuratedListButton,
    previewShowSynopsis,
    setPreviewShowSynopsis,
    previewShowProviders,
    setPreviewShowProviders,
    previewShowTitleCard,
    setPreviewShowTitleCard,
    previewShowDetailsButton,
    setPreviewShowDetailsButton,
    saveLocalOfflineCopy,
    loadLocalOfflineCopy,
    lastOfflineSavedAt,
    offlineCopyCount,
    isOffline,
    genreColors,
    setGenreColors,
    updateGenreColor,
    resetGenreColors,
    genrePillStyle,
    setGenrePillStyle,
    genreBadgeSize,
    setGenreBadgeSize,
  } = useCollection();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [isChangelogExpanded, setIsChangelogExpanded] = useState(false);

  // Genre Color Customizer State
  const [selectedGenreForColor, setSelectedGenreForColor] = useState<string>('Sci-Fi');
  const [previewThemeMode, setPreviewThemeMode] = useState<'dark' | 'light'>(theme);
  const [genreSearchQuery, setGenreSearchQuery] = useState('');
  const [customHexInput, setCustomHexInput] = useState('');

  // Sync custom hex input whenever selected genre or genreColors change
  useEffect(() => {
    const curColor = resolveGenreColor(selectedGenreForColor, genreColors);
    setCustomHexInput(curColor);
  }, [selectedGenreForColor, genreColors]);

  const handleApplyPalette = (palette: typeof GENRE_PRESET_PALETTES[0]) => {
    setGenreColors(palette.colors);
    setNotification({
      type: 'success',
      message: `Applied "${palette.name}" genre palette!`,
    });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleApplyColorToAll = (color: string) => {
    const allMap = STANDARD_GENRES.reduce((acc, g) => ({ ...acc, [g]: color }), {});
    setGenreColors(allMap);
    setNotification({
      type: 'success',
      message: `Applied ${color.toUpperCase()} across all genres!`,
    });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleResetGenres = () => {
    resetGenreColors();
    setNotification({
      type: 'success',
      message: 'Reset genre colors and pill style to Signature Camel defaults.',
    });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleSaveLocalCopy = () => {
    const res = saveLocalOfflineCopy();
    if (res.success) {
      setNotification({
        type: 'success',
        message: 'Local copy successfully saved in local storage! The app will work completely offline with this saved data.',
      });
    } else {
      setNotification({
        type: 'error',
        message: res.message,
      });
    }
    setTimeout(() => setNotification(null), 5000);
  };

  const handleLoadLocalCopy = () => {
    if (confirm('Load and restore all collection items from your saved local storage copy?')) {
      const res = loadLocalOfflineCopy();
      if (res.success) {
        setNotification({
          type: 'success',
          message: res.message,
        });
      } else {
        setNotification({
          type: 'error',
          message: res.message,
        });
      }
      setTimeout(() => setNotification(null), 5000);
    }
  };

  const handleExport = () => {
    const jsonString = exportCollectionJson();
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ehsaan-movie-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setNotification({
      type: 'success',
      message: 'Collection exported successfully as JSON file.',
    });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        const result = importCollectionJson(content);
        if (result.success) {
          setNotification({ type: 'success', message: result.message });
        } else {
          setNotification({ type: 'error', message: result.message });
        }
        setTimeout(() => setNotification(null), 4000);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleRemoveAll = () => {
    if (confirm('⚠️ WARNING: Are you sure you want to remove all saved collection data, custom lists, and activity history? This action cannot be undone.')) {
      removeAllData();
      setNotification({
        type: 'success',
        message: 'All local data and lists have been successfully removed.',
      });
      setTimeout(() => setNotification(null), 4000);
    }
  };

  return (
    <div className="space-y-8 pb-16 max-w-4xl animate-in fade-in duration-200">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#8f6d54] dark:text-[#caa282]">
          <SettingsIcon className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>Preferences &amp; Changelog</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-[#231814] dark:text-[#faf6f2] mt-1">
          Settings
        </h1>
        <p className="text-xs sm:text-sm text-[#715c4f] dark:text-[#baa698] mt-0.5">
          Manage your theme, batch selections, data portability, and system release notes
        </p>
      </div>

      {/* Notification Banner */}
      {notification && (
        <div
          className={`p-4 rounded-2xl flex items-center gap-3 text-xs font-bold border animate-in slide-in-from-top-2 duration-150 ${
            notification.type === 'success'
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-800 dark:text-emerald-300'
              : 'bg-rose-500/10 border-rose-500/30 text-rose-800 dark:text-rose-300'
          }`}
        >
          {notification.type === 'success' ? (
            <CheckCircle className="w-4 h-4 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0" />
          )}
          <span>{notification.message}</span>
        </div>
      )}

      {/* 1. Appearance Section */}
      <section className="p-6 sm:p-7 rounded-2xl sm:rounded-3xl bg-[#caa282] border border-[#b88f6f] space-y-4 shadow-sm text-[#1c120c]">
        <div className="flex items-center gap-2">
          <Palette className="w-4 h-4 text-[#1c120c]" />
          <h2 className="text-sm font-extrabold text-[#1c120c] uppercase tracking-wider">
            Color Science &amp; Appearance
          </h2>
        </div>
        <p className="text-xs text-[#3b291e] font-medium">
          Select between the signature crisp pure light palette and the deep roasted espresso dark mode.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
          {/* Light Sand Theme Card */}
          <button
            onClick={() => setTheme('light')}
            className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex items-start gap-4 ${
              theme === 'light'
                ? 'bg-[#1c120c] text-white border-[#1c120c] shadow-sm'
                : 'bg-[#dfc3ab] text-[#1c120c] border-[#b88f6f] hover:bg-[#ebd5c2]'
            }`}
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
              theme === 'light' ? 'bg-white text-[#1c120c]' : 'bg-[#1c120c] text-white'
            }`}>
              <Sun className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-extrabold">Light Mode</h3>
                {theme === 'light' && (
                  <span className="text-[10px] uppercase font-bold text-[#231814] bg-[#caa282] px-2 py-0.5 rounded-md">
                    Active
                  </span>
                )}
              </div>
              <p className={`text-xs mt-1 ${theme === 'light' ? 'text-[#dfc3ab]' : 'text-[#4e3628]'}`}>
                Luminous canvas with crisp borders and high-contrast typography.
              </p>
            </div>
          </button>

          {/* Dark Espresso Theme Card */}
          <button
            onClick={() => setTheme('dark')}
            className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex items-start gap-4 ${
              theme === 'dark'
                ? 'bg-[#1c120c] text-white border-[#1c120c] shadow-sm'
                : 'bg-[#dfc3ab] text-[#1c120c] border-[#b88f6f] hover:bg-[#ebd5c2]'
            }`}
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
              theme === 'dark' ? 'bg-[#caa282] text-[#231814]' : 'bg-[#1c120c] text-white'
            }`}>
              <Moon className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-extrabold">Roasted Espresso</h3>
                {theme === 'dark' && (
                  <span className="text-[10px] uppercase font-bold text-[#231814] bg-[#caa282] px-2 py-0.5 rounded-md">
                    Active
                  </span>
                )}
              </div>
              <p className={`text-xs mt-1 ${theme === 'dark' ? 'text-[#dfc3ab]' : 'text-[#4e3628]'}`}>
                Deep cocoa backgrounds with warm sand highlights and high WCAG AAA clarity.
              </p>
            </div>
          </button>
        </div>
      </section>

      {/* 2. Custom Genre Colors & Live Look Preview Section */}
      <section className="p-6 sm:p-7 rounded-2xl sm:rounded-3xl bg-[#caa282] border border-[#b88f6f] space-y-6 shadow-sm text-[#1c120c]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Tag className="w-4 h-4 text-[#1c120c]" />
              <h2 className="text-sm font-extrabold text-[#1c120c] uppercase tracking-wider">
                Custom Genre Colors &amp; Visual Look
              </h2>
            </div>
            <p className="text-xs text-[#3b291e] font-medium">
              Personalize color badges and pill aesthetics for all cinema genres with real-time interactive preview.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleResetGenres}
              title="Reset all genre colors to default signature camel"
              className="px-3 py-1.5 rounded-xl bg-[#dfc3ab] hover:bg-[#ebd5c2] border border-[#b88f6f] text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs active:scale-95"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset Defaults</span>
            </button>
          </div>
        </div>

        {/* 2a. Live Interactive Look & Feel Preview Box */}
        <div className="rounded-2xl sm:rounded-3xl border border-[#b88f6f] overflow-hidden shadow-md">
          {/* Preview Box Header */}
          <div className="px-4 py-3 bg-[#b88f6f]/40 border-b border-[#b88f6f] flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-[#1c120c]" />
              <span className="text-xs font-extrabold uppercase tracking-wide text-[#1c120c]">
                Live Look &amp; Contrast Preview
              </span>
              <span className="text-[10px] font-mono font-bold bg-[#1c120c] text-white px-2 py-0.5 rounded-md">
                Pill: {genrePillStyle.toUpperCase()}
              </span>
              <span className="text-[10px] font-mono font-bold bg-[#1c120c] text-[#caa282] px-2 py-0.5 rounded-md border border-white/10">
                Size: {genreBadgeSize.toUpperCase()}
              </span>
            </div>

            {/* Toggle Preview Canvas Theme */}
            <div className="flex items-center gap-1 bg-[#dfc3ab] p-1 rounded-xl border border-[#b88f6f]">
              <button
                type="button"
                onClick={() => setPreviewThemeMode('dark')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  previewThemeMode === 'dark'
                    ? 'bg-[#1c120c] text-white shadow-xs'
                    : 'text-[#4e3628] hover:text-[#1c120c]'
                }`}
              >
                <Moon className="w-3 h-3" />
                <span>Dark Canvas</span>
              </button>
              <button
                type="button"
                onClick={() => setPreviewThemeMode('light')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  previewThemeMode === 'light'
                    ? 'bg-white text-[#1c120c] shadow-xs'
                    : 'text-[#4e3628] hover:text-[#1c120c]'
                }`}
              >
                <Sun className="w-3 h-3" />
                <span>Light Canvas</span>
              </button>
            </div>
          </div>

          {/* Preview Canvas Surface */}
          <div
            className={`p-5 sm:p-6 transition-colors duration-200 space-y-5 ${
              previewThemeMode === 'dark'
                ? 'bg-[#1c120c] text-[#faf6f2]'
                : 'bg-[#fdf8f3] text-[#1c120c]'
            }`}
          >
            {/* Simulated Movie Preview Cards Row */}
            <div className="space-y-2">
              <span className="text-[10px] font-mono font-extrabold uppercase tracking-wider opacity-60">
                Simulated Cinema Title Badges:
              </span>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {[
                  {
                    title: 'Dune: Part Two',
                    year: '2024',
                    genres: ['Sci-Fi', 'Adventure', 'Drama'],
                  },
                  {
                    title: 'The Dark Knight',
                    year: '2008',
                    genres: ['Action', 'Crime', 'Drama'],
                  },
                  {
                    title: 'Spirited Away',
                    year: '2001',
                    genres: ['Animation', 'Family', 'Fantasy'],
                  },
                ].map((sample) => (
                  <div
                    key={sample.title}
                    className={`p-3.5 rounded-2xl border transition-all ${
                      previewThemeMode === 'dark'
                        ? 'bg-[#251a15] border-[#38271e]'
                        : 'bg-white border-[#e5d4c5] shadow-xs'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs font-bold mb-2">
                      <span className="truncate">{sample.title}</span>
                      <span className="text-[10px] font-mono opacity-60 shrink-0">{sample.year}</span>
                    </div>
                    <div className="flex flex-wrap items-center gap-1.5">
                      {sample.genres.map((g) => (
                        <GenreBadge
                          key={g}
                          genre={g}
                          size={genreBadgeSize}
                          pillStyleOverride={genrePillStyle}
                          colorsOverride={genreColors}
                          isDarkOverride={previewThemeMode === 'dark'}
                          onClick={() => setSelectedGenreForColor(g)}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Interactive All-Genres Cloud */}
            <div className="pt-2 border-t border-black/10 dark:border-white/10 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-extrabold uppercase tracking-wider opacity-60">
                  Interactive Genre Cloud (Click any badge to tune color below):
                </span>
                <span className="text-[10px] font-mono opacity-70">
                  Editing: <strong className="text-amber-600 dark:text-[#caa282]">{selectedGenreForColor}</strong>
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {STANDARD_GENRES.map((g) => {
                  const isSelected = selectedGenreForColor === g;
                  return (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setSelectedGenreForColor(g)}
                      className={`relative rounded-full transition-transform cursor-pointer ${
                        isSelected
                          ? 'ring-3 ring-amber-500 scale-105 shadow-md z-10'
                          : 'hover:scale-105'
                      }`}
                    >
                      <GenreBadge
                        genre={g}
                        size={genreBadgeSize}
                        pillStyleOverride={genrePillStyle}
                        colorsOverride={genreColors}
                        isDarkOverride={previewThemeMode === 'dark'}
                      />
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* 2b. Genre Badge Size / Scale Selector */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[#dfc3ab] border border-[#b88f6f] space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Scaling className="w-4 h-4 text-[#1c120c]" />
              <h3 className="text-xs sm:text-sm font-extrabold text-[#1c120c]">
                Badge Size &amp; Scale
              </h3>
            </div>
            <span className="text-[11px] font-mono font-bold text-[#4e3628]">
              Current: {genreBadgeSize === 'xs' ? 'Compact' : genreBadgeSize === 'sm' ? 'Standard' : genreBadgeSize === 'md' ? 'Medium' : 'Spacious'}
            </span>
          </div>
          <p className="text-[11px] text-[#4e3628] font-medium">
            Adjust the physical size, font scale, and padding of genre badges across the entire application.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
            {[
              {
                id: 'xs' as GenreBadgeSize,
                label: 'Compact',
                sub: 'Micro (9.5px)',
                desc: 'Minimalist snug tags',
              },
              {
                id: 'sm' as GenreBadgeSize,
                label: 'Standard',
                sub: 'Regular (11.5px)',
                desc: 'Balanced cinema badges',
              },
              {
                id: 'md' as GenreBadgeSize,
                label: 'Medium',
                sub: 'Prominent (13px)',
                desc: 'Bold, punchy badges',
              },
              {
                id: 'lg' as GenreBadgeSize,
                label: 'Spacious',
                sub: 'Hero (15px)',
                desc: 'Max visibility & padding',
              },
            ].map((sizeOpt) => {
              const isSelected = genreBadgeSize === sizeOpt.id;
              return (
                <button
                  key={sizeOpt.id}
                  type="button"
                  onClick={() => setGenreBadgeSize(sizeOpt.id)}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-2.5 ${
                    isSelected
                      ? 'bg-[#1c120c] text-white border-[#1c120c] shadow-xs scale-[1.02]'
                      : 'bg-[#caa282]/40 text-[#1c120c] border-[#b88f6f] hover:bg-[#caa282]/80'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <div>
                      <span className="text-xs font-black block">{sizeOpt.label}</span>
                      <span className={`text-[10px] font-mono ${isSelected ? 'text-[#caa282]' : 'text-[#4e3628]'}`}>
                        {sizeOpt.sub}
                      </span>
                    </div>
                    {isSelected && <Check className="w-3.5 h-3.5 stroke-[3] text-amber-300 shrink-0" />}
                  </div>
                  <div className="py-0.5">
                    <GenreBadge
                      genre="Sci-Fi"
                      size={sizeOpt.id}
                      pillStyleOverride={genrePillStyle}
                      colorsOverride={genreColors}
                      isDarkOverride={isSelected}
                    />
                  </div>
                  <span className={`text-[10px] leading-tight ${isSelected ? 'text-[#dfc3ab]' : 'text-[#4e3628]'}`}>
                    {sizeOpt.desc}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2c. Pill Visual Look Selector */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[#dfc3ab] border border-[#b88f6f] space-y-3">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#1c120c]" />
            <h3 className="text-xs sm:text-sm font-extrabold text-[#1c120c]">
              Pill Aesthetic &amp; Styling
            </h3>
          </div>
          <p className="text-[11px] text-[#4e3628] font-medium">
            Choose how genre badges are rendered across media preview modals and filter chips.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
            {[
              {
                id: 'solid' as GenrePillStyle,
                label: 'Solid Fill',
                desc: 'Opaque contrast badge',
              },
              {
                id: 'soft' as GenrePillStyle,
                label: 'Soft Frosted Glow',
                desc: 'Translucent tinted fill',
              },
              {
                id: 'outline' as GenrePillStyle,
                label: 'Minimalist Outline',
                desc: 'Clean border & dot',
              },
              {
                id: 'gradient' as GenrePillStyle,
                label: 'Gradient Shine',
                desc: 'Diagonal light sheen',
              },
            ].map((styleOpt) => {
              const isSelected = genrePillStyle === styleOpt.id;
              return (
                <button
                  key={styleOpt.id}
                  type="button"
                  onClick={() => setGenrePillStyle(styleOpt.id)}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-2.5 ${
                    isSelected
                      ? 'bg-[#1c120c] text-white border-[#1c120c] shadow-xs scale-[1.02]'
                      : 'bg-[#caa282]/40 text-[#1c120c] border-[#b88f6f] hover:bg-[#caa282]/80'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="text-xs font-black">{styleOpt.label}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 stroke-[3] text-amber-300" />}
                  </div>
                  <GenreBadge
                    genre="Sci-Fi"
                    size="xs"
                    pillStyleOverride={styleOpt.id}
                    colorsOverride={genreColors}
                    isDarkOverride={isSelected}
                  />
                  <span className={`text-[10px] leading-tight ${isSelected ? 'text-[#dfc3ab]' : 'text-[#4e3628]'}`}>
                    {styleOpt.desc}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2d. Curated Preset Palettes */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[#dfc3ab] border border-[#b88f6f] space-y-3">
          <div className="flex items-center gap-2">
            <Palette className="w-4 h-4 text-[#1c120c]" />
            <h3 className="text-xs sm:text-sm font-extrabold text-[#1c120c]">
              Curated Cinema Preset Palettes
            </h3>
          </div>
          <p className="text-[11px] text-[#4e3628] font-medium">
            Instantly apply cohesive designer color harmonies across all genres.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-1">
            {GENRE_PRESET_PALETTES.map((preset) => {
              return (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => handleApplyPalette(preset)}
                  className="p-3.5 rounded-2xl bg-[#caa282]/40 hover:bg-[#caa282] border border-[#b88f6f] text-left transition-all cursor-pointer flex flex-col justify-between gap-2.5 hover:shadow-xs active:scale-95 group"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="text-xs font-black text-[#1c120c] group-hover:text-black">
                        {preset.name}
                      </h4>
                      <p className="text-[10px] text-[#4e3628] mt-0.5 leading-snug">
                        {preset.description}
                      </p>
                    </div>
                  </div>

                  {/* Swatches strip */}
                  <div className="flex items-center gap-1.5 pt-1">
                    {preset.previewColors.map((hex, idx) => (
                      <span
                        key={idx}
                        className="w-4 h-4 rounded-full border border-black/20 shadow-2xs"
                        style={{ backgroundColor: hex }}
                      />
                    ))}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2e. Individual Genre Custom Color Fine-Tuning */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[#dfc3ab] border border-[#b88f6f] space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#b88f6f]/60 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <Pipette className="w-4 h-4 text-[#1c120c]" />
                <h3 className="text-xs sm:text-sm font-extrabold text-[#1c120c]">
                  Custom Color Tuning: <span className="underline decoration-black">{selectedGenreForColor}</span>
                </h3>
              </div>
              <p className="text-[11px] text-[#4e3628] mt-0.5 font-medium">
                Pick a swatch or use the native color wheel for complete creative freedom.
              </p>
            </div>

            {/* Live active genre badge */}
            <div className="flex items-center gap-2 self-start sm:self-auto">
              <span className="text-[11px] font-bold text-[#4e3628]">Result:</span>
              <GenreBadge
                genre={selectedGenreForColor}
                size={genreBadgeSize}
                pillStyleOverride={genrePillStyle}
                colorsOverride={genreColors}
              />
            </div>
          </div>

          {/* Genre Quick Selector Tabs with Search */}
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#4e3628]">
                Select Genre to Customize:
              </span>
              <input
                type="text"
                placeholder="Filter genres..."
                value={genreSearchQuery}
                onChange={(e) => setGenreSearchQuery(e.target.value)}
                className="px-2.5 py-1 rounded-lg text-xs bg-white/70 dark:bg-[#1c120c]/20 border border-[#b88f6f] text-[#1c120c] placeholder-[#4e3628]/70 focus:outline-hidden max-w-[150px]"
              />
            </div>

            <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto p-1 rounded-xl bg-[#caa282]/20 border border-[#b88f6f]/40">
              {STANDARD_GENRES.filter((g) =>
                g.toLowerCase().includes(genreSearchQuery.toLowerCase().trim())
              ).map((g) => {
                const isSelected = selectedGenreForColor === g;
                const gColor = resolveGenreColor(g, genreColors);
                return (
                  <button
                    key={g}
                    type="button"
                    onClick={() => setSelectedGenreForColor(g)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 border ${
                      isSelected
                        ? 'bg-[#1c120c] text-white border-[#1c120c] shadow-xs'
                        : 'bg-white/50 hover:bg-white text-[#1c120c] border-[#b88f6f]/60'
                    }`}
                  >
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0 border border-black/20"
                      style={{ backgroundColor: gColor }}
                    />
                    <span>{g}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick Swatches Palette Grid */}
          <div className="space-y-2 pt-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#4e3628] block">
              1-Click Quick Color Swatches:
            </span>
            <div className="flex flex-wrap gap-2 items-center">
              {QUICK_SWATCH_COLORS.map((hex) => {
                const isCurrent =
                  resolveGenreColor(selectedGenreForColor, genreColors).toLowerCase() === hex.toLowerCase();
                return (
                  <button
                    key={hex}
                    type="button"
                    onClick={() => updateGenreColor(selectedGenreForColor, hex)}
                    title={`Apply ${hex} to ${selectedGenreForColor}`}
                    className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full transition-transform cursor-pointer border border-black/20 shadow-2xs flex items-center justify-center ${
                      isCurrent
                        ? 'scale-110 ring-3 ring-[#1c120c]'
                        : 'hover:scale-110'
                    }`}
                    style={{ backgroundColor: hex }}
                  >
                    {isCurrent && (
                      <Check
                        className="w-3.5 h-3.5 stroke-[3]"
                        style={{
                          color: hex === '#ffffff' || hex === '#caa282' || hex === '#f59e0b' || hex === '#eab308' || hex === '#06d6a0' ? '#1c120c' : '#ffffff',
                        }}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Custom Hex Code & Native Color Wheel Input */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {/* Hex text input */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold uppercase tracking-wider text-[#4e3628] block">
                Custom Hex Code
              </label>
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-mono font-bold text-[#4e3628]">
                    #
                  </span>
                  <input
                    type="text"
                    maxLength={7}
                    value={customHexInput.replace('#', '')}
                    onChange={(e) => {
                      const val = `#${e.target.value.replace(/[^0-9A-Fa-f]/g, '')}`;
                      setCustomHexInput(val);
                      if (/^#[0-9A-Fa-f]{6}$/.test(val) || /^#[0-9A-Fa-f]{3}$/.test(val)) {
                        updateGenreColor(selectedGenreForColor, val);
                      }
                    }}
                    placeholder="CAA282"
                    className="w-full pl-7 pr-3 py-2 rounded-xl bg-white border border-[#b88f6f] text-xs font-mono font-bold text-[#1c120c] uppercase focus:outline-hidden focus:border-[#1c120c]"
                  />
                </div>

                {/* Color wheel preview picker */}
                <label
                  title="Open Color Wheel Picker"
                  className="w-10 h-10 rounded-xl border-2 border-black/30 shadow-xs flex items-center justify-center cursor-pointer hover:scale-105 active:scale-95 transition-transform overflow-hidden relative shrink-0"
                  style={{ backgroundColor: resolveGenreColor(selectedGenreForColor, genreColors) }}
                >
                  <input
                    type="color"
                    value={
                      resolveGenreColor(selectedGenreForColor, genreColors).startsWith('#')
                        ? resolveGenreColor(selectedGenreForColor, genreColors)
                        : '#caa282'
                    }
                    onChange={(e) => updateGenreColor(selectedGenreForColor, e.target.value)}
                    className="opacity-0 absolute inset-0 w-full h-full cursor-pointer"
                  />
                  <Pipette
                    className="w-4 h-4"
                    style={{
                      color:
                        customHexInput === '#ffffff' || customHexInput === '#caa282'
                          ? '#1c120c'
                          : '#ffffff',
                    }}
                  />
                </label>
              </div>
            </div>

            {/* Quick Actions for active color */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold uppercase tracking-wider text-[#4e3628] block">
                Batch Actions
              </label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() =>
                    handleApplyColorToAll(resolveGenreColor(selectedGenreForColor, genreColors))
                  }
                  className="flex-1 px-3 py-2 rounded-xl bg-[#1c120c] hover:bg-black text-white text-xs font-bold transition-all cursor-pointer shadow-xs active:scale-95 text-center truncate"
                >
                  Apply to All Genres
                </button>
                <button
                  type="button"
                  onClick={() => updateGenreColor(selectedGenreForColor, DEFAULT_GENRE_COLOR)}
                  className="px-3 py-2 rounded-xl bg-[#dfc3ab] hover:bg-[#ebd5c2] border border-[#b88f6f] text-xs font-bold text-[#1c120c] transition-all cursor-pointer active:scale-95"
                >
                  Reset
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Features & Workflow Section (Batch Selection Toggle) */}
      <section className="p-6 sm:p-7 rounded-2xl sm:rounded-3xl bg-[#caa282] border border-[#b88f6f] space-y-4 shadow-sm text-[#1c120c]">
        <div className="flex items-center gap-2">
          <CheckSquare className="w-4 h-4 text-[#1c120c]" />
          <h2 className="text-sm font-extrabold text-[#1c120c] uppercase tracking-wider">
            Workflow &amp; Batch Selection
          </h2>
        </div>
        <p className="text-xs text-[#3b291e] font-medium">
          Enable multi-item selection mode across your collection to check and delete multiple items at once.
        </p>

        <div className="flex items-center justify-between p-4 rounded-2xl bg-[#dfc3ab] border border-[#b88f6f]">
          <div>
            <h3 className="text-xs sm:text-sm font-extrabold text-[#1c120c]">
              Batch Selection &amp; Bulk Deletion
            </h3>
            <p className="text-[11px] text-[#4e3628] mt-0.5 font-medium">
              Show selection checkboxes and bulk delete action bar in library views.
            </p>
          </div>
          <button
            onClick={() => setIsBatchSelectEnabled(!isBatchSelectEnabled)}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
              isBatchSelectEnabled
                ? 'bg-[#1c120c] text-white shadow-xs'
                : 'bg-[#b88f6f]/60 text-[#1c120c]'
            }`}
          >
            {isBatchSelectEnabled ? 'Enabled' : 'Disabled'}
          </button>
        </div>

        {/* Movie Preview Backdrop Artwork Toggle & Opacity Slider */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[#dfc3ab] border border-[#b88f6f] space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xs sm:text-sm font-extrabold text-[#1c120c]">
                Movie Preview Backdrop Artwork
              </h3>
              <p className="text-[11px] text-[#4e3628] mt-0.5 font-medium">
                Display wide cinematic background art and backdrops behind titles in the preview window.
              </p>
            </div>
            <button
              onClick={() => setShowPreviewArtwork(!showPreviewArtwork)}
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                showPreviewArtwork
                  ? 'bg-[#1c120c] text-white shadow-xs'
                  : 'bg-[#b88f6f]/60 text-[#1c120c]'
              }`}
            >
              {showPreviewArtwork ? 'Enabled' : 'Disabled'}
            </button>
          </div>

          {showPreviewArtwork && (
            <div className="pt-2 border-t border-[#b88f6f]/60 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-[#3b291e]">
                  Artwork Opacity &amp; Intensity:
                </span>
                <span className="font-mono font-black text-[#1c120c]">
                  {previewArtworkOpacity}%
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[10px] text-[#4e3628] font-mono font-bold">0% (Faint)</span>
                <input
                  type="range"
                  min="5"
                  max="100"
                  step="5"
                  value={previewArtworkOpacity}
                  onChange={(e) => setPreviewArtworkOpacity(Number(e.target.value))}
                  className="flex-1 h-2 bg-[#b88f6f] rounded-lg appearance-none cursor-pointer accent-[#1c120c]"
                />
                <span className="text-[10px] text-[#4e3628] font-mono font-bold">100% (Vivid)</span>
              </div>
            </div>
          )}
        </div>

        {/* Preview Page Elements Minimalist Customization */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[#dfc3ab] border border-[#b88f6f] space-y-3">
          <div className="border-b border-[#b88f6f]/60 pb-2">
            <h3 className="text-xs sm:text-sm font-extrabold text-[#1c120c]">
              Preview Window Elements (Declutter &amp; Minimalism)
            </h3>
            <p className="text-[11px] text-[#4e3628] mt-0.5 font-medium">
              Customize what elements appear directly on the preview window hero banner versus in the Details popup.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            {[
              {
                id: 'titleCard',
                title: 'Title Background Card',
                desc: 'Show frosted card container behind title & actions (or remove to let them sit directly on artwork)',
                val: previewShowTitleCard,
                toggle: () => setPreviewShowTitleCard(!previewShowTitleCard),
              },
              {
                id: 'tagline',
                title: 'Tagline Quote',
                desc: 'Show editorial quote below title in hero',
                val: previewShowTagline,
                toggle: () => setPreviewShowTagline(!previewShowTagline),
              },
              {
                id: 'genres',
                title: 'Inline Genre Pills',
                desc: 'Show yellow-gold genre badges in hero (or keep in Details popup)',
                val: previewShowGenres,
                toggle: () => setPreviewShowGenres(!previewShowGenres),
              },
              {
                id: 'match',
                title: '% Match Score',
                desc: 'Show algorithm match percentage',
                val: previewShowMatchScore,
                toggle: () => setPreviewShowMatchScore(!previewShowMatchScore),
              },
              {
                id: 'rating',
                title: '★ Rating Badge',
                desc: 'Show yellow IMDb/community star badge',
                val: previewShowRatingBadge,
                toggle: () => setPreviewShowRatingBadge(!previewShowRatingBadge),
              },
              {
                id: 'quality',
                title: 'HD Quality Tag',
                desc: 'Display HD / 4K stream resolution tag',
                val: previewShowQualityBadge,
                toggle: () => setPreviewShowQualityBadge(!previewShowQualityBadge),
              },
              {
                id: 'trailer',
                title: 'Watch Trailer CTA',
                desc: 'Show primary Play Trailer CTA button in action bar',
                val: previewShowTrailerButton,
                toggle: () => setPreviewShowTrailerButton(!previewShowTrailerButton),
              },
              {
                id: 'curated',
                title: 'Curated List Button',
                desc: 'Show add-to-curated-list action button in hero',
                val: previewShowCuratedListButton,
                toggle: () => setPreviewShowCuratedListButton(!previewShowCuratedListButton),
              },
              {
                id: 'synopsis',
                title: 'Story Synopsis in Hero',
                desc: 'Show overview text directly on hero (or keep in Details popup)',
                val: previewShowSynopsis,
                toggle: () => setPreviewShowSynopsis(!previewShowSynopsis),
              },
              {
                id: 'providers',
                title: 'Streaming Providers in Hero',
                desc: 'Show where to watch directly on hero (or keep in Details popup)',
                val: previewShowProviders,
                toggle: () => setPreviewShowProviders(!previewShowProviders),
              },
              {
                id: 'detailsButton',
                title: 'Details Popover Button',
                desc: 'Show Details CTA Button next to primary actions in preview banner',
                val: previewShowDetailsButton,
                toggle: () => setPreviewShowDetailsButton(!previewShowDetailsButton),
              },
            ].map((elem) => (
              <div
                key={elem.id}
                className="p-3 rounded-xl bg-[#caa282] border border-[#b88f6f] flex items-center justify-between gap-3 shadow-2xs"
              >
                <div>
                  <h4 className="text-xs font-bold text-[#1c120c]">{elem.title}</h4>
                  <p className="text-[10px] text-[#4e3628] font-medium">{elem.desc}</p>
                </div>
                <button
                  onClick={elem.toggle}
                  className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer whitespace-nowrap ${
                    elem.val
                      ? 'bg-[#1c120c] text-white shadow-xs'
                      : 'bg-[#b88f6f]/60 text-[#1c120c]'
                  }`}
                >
                  {elem.val ? 'Shown' : 'Hidden'}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Data Management & Removal Section */}
      <section className="p-6 sm:p-7 rounded-2xl sm:rounded-3xl bg-[#caa282] border border-[#b88f6f] space-y-4 shadow-sm text-[#1c120c]">
        <div className="flex items-center gap-2">
          <Database className="w-4 h-4 text-[#1c120c]" />
          <h2 className="text-sm font-extrabold text-[#1c120c] uppercase tracking-wider">
            Data Backup &amp; Portability
          </h2>
        </div>
        <p className="text-xs text-[#3b291e] font-medium">
          Your collection is saved locally in your browser. Export anytime to back up your watch history, ratings, and custom lists, or import onto another device.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          {/* Export JSON */}
          <button
            onClick={handleExport}
            className="p-3.5 rounded-2xl bg-[#dfc3ab] border border-[#b88f6f] hover:bg-[#ebd5c2] transition-all cursor-pointer flex items-center justify-center gap-2 text-xs font-black text-[#1c120c] shadow-xs"
          >
            <Download className="w-4 h-4" />
            <span>Export Backup (JSON)</span>
          </button>

          {/* Import JSON */}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="p-3.5 rounded-2xl bg-[#dfc3ab] border border-[#b88f6f] hover:bg-[#ebd5c2] transition-all cursor-pointer flex items-center justify-center gap-2 text-xs font-black text-[#1c120c] shadow-xs"
          >
            <Upload className="w-4 h-4" />
            <span>Restore Backup (JSON)</span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>

        {/* Remove All Data Destructive Button */}
        <div className="pt-3 border-t border-[#b88f6f]/60 flex items-center justify-between">
          <div>
            <h3 className="text-xs font-bold text-rose-900">Remove All Local Data</h3>
            <p className="text-[11px] text-[#4e3628] font-medium">Permanently clear all items, custom lists, and local storage.</p>
          </div>
          <button
            onClick={handleRemoveAll}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-rose-700 hover:bg-rose-800 text-white transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Remove All Data</span>
          </button>
        </div>
      </section>

      {/* 4. Offline Storage & Local Copy Section */}
      <section className="p-6 sm:p-7 rounded-2xl sm:rounded-3xl bg-[#caa282] border border-[#b88f6f] space-y-5 shadow-sm text-[#1c120c]">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <HardDrive className="w-4 h-4 text-[#1c120c]" />
            <h2 className="text-sm font-extrabold text-[#1c120c] uppercase tracking-wider">
              Offline Storage &amp; Local Copy
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black ${
                isOffline
                  ? 'bg-amber-900/20 text-amber-950 border border-amber-900/40'
                  : 'bg-emerald-900/20 text-emerald-950 border border-emerald-900/40'
              }`}
            >
              {isOffline ? (
                <>
                  <WifiOff className="w-3.5 h-3.5" />
                  <span>Offline Mode Active</span>
                </>
              ) : (
                <>
                  <Wifi className="w-3.5 h-3.5" />
                  <span>Connected Online</span>
                </>
              )}
            </span>
          </div>
        </div>

        {/* User Requested Offline Notice */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[#dfc3ab] border-l-4 border-[#1c120c] border border-[#b88f6f] space-y-1.5">
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[#1c120c]">
            <ShieldCheck className="w-4 h-4" />
            <span>Offline Local Storage Notice</span>
          </div>
          <p className="text-xs sm:text-sm font-black text-[#1c120c] leading-relaxed">
            "Please save a local copy of your data in local storage so that the app will work offline."
          </p>
          <p className="text-[11px] sm:text-xs text-[#3b291e] font-medium leading-relaxed">
            This saves a verified, standalone snapshot of your entire movie and TV library, custom lists, watch progress, and ratings into your browser's persistent local storage. Whenever internet goes down, the app will continue to work smoothly with your saved local data.
          </p>
        </div>

        {/* Offline Status & Action Buttons */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[#dfc3ab] border border-[#b88f6f] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-extrabold text-[#1c120c]">
                Local Storage Archive:
              </span>
              <span className="text-xs font-mono font-black text-[#1c120c]">
                {lastOfflineSavedAt ? `${offlineCopyCount || items.length} titles preserved` : 'No local copy saved yet'}
              </span>
            </div>
            <p className="text-[11px] text-[#4e3628] font-medium flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              <span>
                {lastOfflineSavedAt
                  ? `Last saved: ${new Date(lastOfflineSavedAt).toLocaleString()}`
                  : 'Click "Save Local Copy" to store your collection for offline access.'}
              </span>
            </p>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap">
            {lastOfflineSavedAt && (
              <button
                onClick={handleLoadLocalCopy}
                title="Restore library from the saved local storage copy"
                className="px-4 py-2.5 rounded-xl border border-[#b88f6f] bg-[#caa282] hover:bg-[#ebd5c2] text-xs font-bold text-[#1c120c] transition-all cursor-pointer shadow-xs"
              >
                Restore Local Copy
              </button>
            )}

            <button
              onClick={handleSaveLocalCopy}
              className="px-5 py-2.5 rounded-xl bg-[#1c120c] hover:bg-black text-[#caa282] text-xs font-black flex items-center gap-2 transition-all cursor-pointer shadow-md active:scale-95"
            >
              <Save className="w-4 h-4" />
              <span>Save Local Copy</span>
            </button>
          </div>
        </div>
      </section>

      {/* 5. Official System Changelog (Hidden behind button toggle) */}
      <section className="p-6 sm:p-7 rounded-2xl sm:rounded-3xl bg-[#caa282] border border-[#b88f6f] space-y-4 shadow-sm text-[#1c120c]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <History className="w-4 h-4 text-[#1c120c]" />
              <h2 className="text-sm font-extrabold text-[#1c120c] uppercase tracking-wider">
                System Changelog
              </h2>
              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-[#1c120c] text-[#caa282] border border-black/20">
                {CHANGELOG_DATA[0]?.badge || 'Latest'} ({CHANGELOG_DATA[0]?.version.split('—')[0].trim()})
              </span>
            </div>
            <p className="text-xs text-[#3b291e] font-medium">
              View all version updates, feature additions, and recent improvements.
            </p>
          </div>

          <button
            onClick={() => setIsChangelogExpanded((prev) => !prev)}
            className="px-4 py-2.5 rounded-xl border border-[#b88f6f] bg-[#dfc3ab] hover:bg-[#ebd5c2] text-xs font-black text-[#1c120c] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs active:scale-95 self-start sm:self-auto"
          >
            <History className="w-3.5 h-3.5" />
            <span>{isChangelogExpanded ? 'Hide Changelog' : 'View Changelog'}</span>
            {isChangelogExpanded ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>
        </div>

        {isChangelogExpanded && (
          <div className="space-y-6 pt-2 animate-in fade-in duration-200">
            {CHANGELOG_DATA.map((release, idx) => (
              <div
                key={`${release.version}-${idx}`}
                className="p-5 rounded-2xl bg-[#dfc3ab] border border-[#b88f6f] space-y-3"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#b88f6f]/60 pb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-[#1c120c]">
                      {release.version}
                    </span>
                    <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-[#1c120c] text-white">
                      {release.badge}
                    </span>
                  </div>
                  <span className="text-[11px] font-mono font-bold text-[#4e3628]">
                    {release.date} · {release.points.length} points
                  </span>
                </div>

                <ul className="space-y-2 pt-1">
                  {release.points.map((pt, pIdx) => (
                    <li key={`${release.version}-${pIdx}`} className="flex items-start gap-2.5 text-xs text-[#2a1b13] font-medium leading-relaxed">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#1c120c] mt-1.5 shrink-0" />
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
