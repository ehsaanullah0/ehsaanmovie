import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  X,
  Star,
  Heart,
  Clock,
  Play,
  Check,
  Plus,
  CheckCircle,
  ListPlus,
  Trash2,
  Share2,
  ExternalLink,
  ChevronDown,
  Tv,
  Film,
  Sparkles,
  Bookmark,
  Eye,
  Video,
  ArrowRight,
  ArrowLeft,
  Sliders,
  Image as ImageIcon,
  Info,
} from 'lucide-react';
import { useCollection } from '../context/CollectionContext';
import { MediaPoster } from './MediaPoster';
import { OttStreamingBadge } from './OttStreamingBadges';
import { GenreBadge } from './GenreBadge';
import { getFallbackTrailerKey } from '../data/trailers';
import { fetchTmdbMediaDetails, searchMediaAndPeople } from '../services/movieApi';
import { MediaItem, WatchStatus } from '../types';

type DetailTab = 'overview' | 'episodes' | 'trailers' | 'cast' | 'streaming' | 'similar';

export const MediaDetailModal: React.FC = () => {
  const {
    selectedMedia,
    setSelectedMedia,
    items,
    customLists,
    updateItem,
    updateItemStatus,
    removeItem,
    toggleFavorite,
    updateProgress,
    toggleEpisodeWatched,
    toggleSeasonAllEpisodes,
    toggleItemInList,
    createCustomList,
    addItem,
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
  } = useCollection();

  // Active Tab
  const [activeTab, setActiveTab] = useState<DetailTab>('overview');

  // Video Trailer Player Mode
  const [isPlayingTrailer, setIsPlayingTrailer] = useState(false);
  const [isConfirmingRemove, setIsConfirmingRemove] = useState(false);

  // Custom List & Info Dropdown states
  const [isListDropdownOpen, setIsListDropdownOpen] = useState(false);
  const [newListName, setNewListName] = useState('');
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
  const [isArtworkPopoverOpen, setIsArtworkPopoverOpen] = useState(false);
  const [isDetailsPopoverOpen, setIsDetailsPopoverOpen] = useState(false);

  // First-time user highlight for preview customizer button
  const [hasSeenCustomizerHighlight, setHasSeenCustomizerHighlight] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('ehsaan_customizer_highlight_seen') === 'true';
    }
    return false;
  });

  const handleOpenCustomizer = () => {
    setIsArtworkPopoverOpen((prev) => !prev);
    if (!hasSeenCustomizerHighlight) {
      setHasSeenCustomizerHighlight(true);
      if (typeof window !== 'undefined') {
        localStorage.setItem('ehsaan_customizer_highlight_seen', 'true');
      }
    }
  };

  // Selected Season for TV Series
  const [selectedSeasonNumber, setSelectedSeasonNumber] = useState<number>(1);

  // Share Toast state
  const [shareToastMessage, setShareToastMessage] = useState<string | null>(null);

  // Detailed Media State (enhanced with live TMDB data)
  const [enrichedData, setEnrichedData] = useState<Partial<MediaItem>>({});

  // Dropdown click outside refs
  const statusDropdownRef = useRef<HTMLDivElement>(null);
  const listDropdownRef = useRef<HTMLDivElement>(null);
  const artworkPopoverRef = useRef<HTMLDivElement>(null);
  const detailsPopoverRef = useRef<HTMLDivElement>(null);

  // Merge selectedMedia with current saved items in collection to stay 100% reactive
  const item: MediaItem | null = useMemo(() => {
    if (!selectedMedia) return null;
    const inCollection = items.find(
      (i) => i.id === selectedMedia.id || (i.tmdbId && i.tmdbId === selectedMedia.tmdbId)
    );
    if (inCollection) {
      return {
        ...selectedMedia,
        ...enrichedData,
        ...inCollection,
        // Guarantee user's real-time seasonsData from state is preserved
        seasonsData: inCollection.seasonsData || enrichedData.seasonsData || selectedMedia.seasonsData,
      };
    }
    return {
      ...selectedMedia,
      ...enrichedData,
    };
  }, [selectedMedia, items, enrichedData]);

  // Sync selected season when modal opens or item changes
  useEffect(() => {
    if (item) {
      setSelectedSeasonNumber(item.currentSeason || 1);
    }
  }, [item?.id]);

  // Reset tab and trailer state when a new media item opens
  useEffect(() => {
    setActiveTab('overview');
    setIsPlayingTrailer(false);
    setIsListDropdownOpen(false);
    setIsStatusDropdownOpen(false);
    setEnrichedData({});
  }, [selectedMedia?.id]);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (
        statusDropdownRef.current &&
        !statusDropdownRef.current.contains(e.target as Node)
      ) {
        setIsStatusDropdownOpen(false);
      }
      if (
        listDropdownRef.current &&
        !listDropdownRef.current.contains(e.target as Node)
      ) {
        setIsListDropdownOpen(false);
      }
      if (
        artworkPopoverRef.current &&
        !artworkPopoverRef.current.contains(e.target as Node)
      ) {
        setIsArtworkPopoverOpen(false);
      }
      if (
        detailsPopoverRef.current &&
        !detailsPopoverRef.current.contains(e.target as Node)
      ) {
        setIsDetailsPopoverOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  // Fetch full details from TMDB when modal opens if needed
  useEffect(() => {
    let isCancelled = false;

    async function loadFullDetails() {
      if (!selectedMedia) return;

      let tmdbId = selectedMedia.tmdbId;

      if (!tmdbId && selectedMedia.title) {
        try {
          const results = await searchMediaAndPeople(selectedMedia.title);
          const match =
            selectedMedia.type === 'movie'
              ? results.movies.find(
                  (m) => m.title.toLowerCase() === selectedMedia.title.toLowerCase()
                )
              : results.series.find(
                  (s) => s.title.toLowerCase() === selectedMedia.title.toLowerCase()
                );

          if (match && match.tmdbId) {
            tmdbId = match.tmdbId;
          }
        } catch {
          // ignore lookup errors
        }
      }

      if (
        tmdbId &&
        (!selectedMedia.castDetails ||
          !selectedMedia.trailerYoutubeKey ||
          (selectedMedia.type === 'series' && !selectedMedia.seasonsData))
      ) {
        try {
          const details = await fetchTmdbMediaDetails(tmdbId, selectedMedia.type);
          if (!isCancelled && Object.keys(details).length > 0) {
            setEnrichedData(details);
            updateItem(selectedMedia.id, details);
          }
        } catch (err) {
          console.warn('Failed to load enriched TMDB details:', err);
        }
      }
    }

    loadFullDetails();

    return () => {
      isCancelled = true;
    };
  }, [selectedMedia?.id, selectedMedia?.tmdbId]);

  // Keyboard shortcut listener (Esc to close)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedMedia) return;
      if (e.key === 'Escape') {
        if (isPlayingTrailer) {
          setIsPlayingTrailer(false);
        } else {
          setSelectedMedia(null);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedMedia, isPlayingTrailer]);

  if (!selectedMedia || !item) return null;

  const isSeries = item.type === 'series';
  const isInCollection = items.some(
    (i) =>
      i.id === item.id ||
      (item.tmdbId && i.tmdbId === item.tmdbId) ||
      (i.title && item.title && i.title.toLowerCase() === item.title.toLowerCase())
  );
  const currentStatus: WatchStatus = item.status || 'not_added';
  const currentProgress = item.progressPercentage || 0;

  // Toggle Custom List Item (handles non-added items gracefully)
  const handleToggleCustomList = (listId: string) => {
    if (!item) return;
    if (!isInCollection) {
      addItem(item, 'watchlist');
    }
    toggleItemInList(item, listId);
    const target = customLists.find((l) => l.id === listId);
    const isCurrentlyIn = (item.customLists || []).includes(listId);
    setShareToastMessage(
      isCurrentlyIn
        ? `Removed from ${target?.name || 'custom list'}`
        : `Added to ${target?.name || 'custom list'}`
    );
    setTimeout(() => setShareToastMessage(null), 2500);
  };

  // Quick Create List from preview modal
  const handleQuickCreateList = () => {
    if (!newListName.trim() || !item) return;
    const created = createCustomList(newListName.trim(), '🎬');
    if (!isInCollection) {
      addItem(item, 'watchlist');
    }
    toggleItemInList(item, created.id);
    setNewListName('');
    setShareToastMessage(`Created "${created.name}" and added title!`);
    setTimeout(() => setShareToastMessage(null), 2500);
  };

  // Trailer YouTube Key calculation
  const activeTrailerKey = item.trailerYoutubeKey || getFallbackTrailerKey(item.title);

  // Active season object with fallback generation for series if seasonsData is missing
  const seasons = (item.seasonsData && item.seasonsData.length > 0)
    ? item.seasonsData
    : (isSeries
        ? Array.from({ length: item.totalSeasons || 1 }, (_, sIdx) => ({
            seasonNumber: sIdx + 1,
            name: `Season ${sIdx + 1}`,
            episodes: Array.from({ length: 10 }, (_, eIdx) => ({
              episodeNumber: eIdx + 1,
              title: `Episode ${eIdx + 1}`,
              runtime: '42 min',
              airDate: '2026',
              watched: false,
            })),
          }))
        : []);
  const currentSeasonData =
    seasons.find((s) => s.seasonNumber === selectedSeasonNumber) || seasons[0];

  // Status Labels and styling
  const statusConfig: Record<
    WatchStatus,
    { label: string; icon: React.ReactNode }
  > = {
    not_added: {
      label: 'Add to Library',
      icon: <Bookmark className="w-4 h-4" />,
    },
    watchlist: {
      label: 'In Watchlist',
      icon: <Bookmark className="w-4 h-4 fill-[#ea9160] text-[#ea9160]" />,
    },
    watching: {
      label: 'Currently Watching',
      icon: <Clock className="w-4 h-4 text-sky-500 dark:text-sky-400" />,
    },
    watched: {
      label: 'Completed / Watched',
      icon: <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />,
    },
  };

  // Handle Watch Status Change
  const handleStatusChange = (status: WatchStatus) => {
    if (!isInCollection) {
      addItem(item, status);
    } else {
      updateItemStatus(item.id, status);
    }
    setIsStatusDropdownOpen(false);
  };

  // Handle Share link copy
  const handleShare = () => {
    const summary = `${item.title} (${item.year}) · ${item.rating}/10 ⭐\nSaved on EHSAAN MOVIE Hub`;
    navigator.clipboard.writeText(summary);
    setShareToastMessage('Title & details copied to clipboard!');
    setTimeout(() => setShareToastMessage(null), 2500);
  };

  // Handle Next Episode in Series
  const handleAdvanceNextEpisode = () => {
    if (!currentSeasonData) return;
    const currentEpNum = item.currentEpisode || 1;
    const nextEp = currentSeasonData.episodes.find((e) => e.episodeNumber === currentEpNum + 1);
    if (nextEp) {
      toggleEpisodeWatched(item.id, selectedSeasonNumber, nextEp.episodeNumber);
    } else {
      const nextSeason = seasons.find((s) => s.seasonNumber === selectedSeasonNumber + 1);
      if (nextSeason && nextSeason.episodes[0]) {
        setSelectedSeasonNumber(nextSeason.seasonNumber);
        toggleEpisodeWatched(item.id, nextSeason.seasonNumber, 1);
      }
    }
  };

  const providers = item.streamingProviders || [
    { id: 'netflix', name: 'Netflix', type: 'subscription' as const, quality: '4K Ultra HD' },
    { id: 'apple', name: 'Apple TV+', type: 'rent' as const, quality: '4K Dolby Vision' },
    { id: 'prime', name: 'Prime Video', type: 'rent' as const, quality: 'HDR' },
    { id: 'max', name: 'Max (HBO)', type: 'subscription' as const, quality: '4K Atmos' },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#3d2a21] dark:bg-[#201510] text-[#fdf8f3] flex flex-col animate-in fade-in duration-150">
      {/* Toast Notification */}
      {shareToastMessage && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-70 bg-[#251b16] dark:bg-[#1a120e] text-[#faf6f2] border border-[#f0c2a8]/50 px-4 py-2 rounded-full shadow-2xl text-xs font-semibold flex items-center gap-2 animate-in fade-in slide-in-from-top-4 duration-150">
          <Sparkles className="w-3.5 h-3.5 text-[#ea9160]" />
          <span>{shareToastMessage}</span>
        </div>
      )}

      {/* Top Edge-to-Edge Billboard Showcase (Identical to Home Page Slideshow, No Background Card) */}
      <div className="relative w-full min-h-[480px] sm:min-h-[540px] md:min-h-[620px] flex flex-col justify-between p-6 sm:p-12 lg:p-16 text-white select-none bg-[#0e0907] border-b border-[#5a4135]/40 dark:border-white/10 shrink-0">
        {/* Edge-to-edge Background Banner Image with Crisp Saturation & Full Clarity */}
        <div className="absolute inset-0 z-0 bg-[#0e0907]">
          {showPreviewArtwork && (item.banner || item.poster) ? (
            <img
              src={item.banner || item.poster}
              alt={item.title}
              referrerPolicy="no-referrer"
              style={{ opacity: (previewArtworkOpacity ?? 100) / 100 }}
              className="absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-300"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-r from-[#241a15] via-[#1c1410] to-[#160f0b]" />
          )}

          {/* Clear, focused readability gradient only behind left text and bottom edge - fades seamlessly into light chocolate */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/40 to-transparent z-10" />
          <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-[#3d2a21] via-[#3d2a21]/50 to-transparent dark:from-[#201510] dark:via-[#201510]/50 z-10 pointer-events-none" />
        </div>

        {/* Top Header Navigation Controls Overlay (z-50 guarantees customizer popup floats above title card & action buttons) */}
        <div className="relative z-50 max-w-7xl mx-auto w-full flex items-center justify-between pb-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSelectedMedia(null)}
              className="px-3.5 py-1.5 rounded-full bg-black/50 hover:bg-black/75 text-white border border-white/20 transition-all cursor-pointer backdrop-blur-md flex items-center gap-1.5 text-xs font-bold shadow-xs active:scale-95"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>

            {item.studios && item.studios.length > 0 && (
              <span className="hidden sm:inline text-white/80 text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-black/40 border border-white/10 backdrop-blur-xs">
                {item.studios[0]}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Artwork Backdrop Intensity & Live Elements Customizer Popover */}
            <div className="relative" ref={artworkPopoverRef}>
              <button
                onClick={handleOpenCustomizer}
                title="Preview Customization & Backdrop Settings"
                className={`p-2.5 rounded-full border transition-all cursor-pointer backdrop-blur-md relative ${
                  !hasSeenCustomizerHighlight
                    ? 'bg-[#caa282] text-[#231814] border-black shadow-[0_0_20px_rgba(202,162,130,0.85)] ring-4 ring-[#caa282]/60 scale-105'
                    : showPreviewArtwork
                      ? 'bg-black/55 border-white/25 text-white hover:bg-black/75'
                      : 'bg-black/30 border-white/10 text-white/40'
                }`}
              >
                <Sliders className={`w-4 h-4 ${!hasSeenCustomizerHighlight ? 'stroke-[2.5]' : ''}`} />
                {!hasSeenCustomizerHighlight && (
                  <span className="absolute -top-1 -right-1 flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#caa282] opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-[#caa282]"></span>
                  </span>
                )}
              </button>

              {/* First-time Callout Tooltip Highlight */}
              {!hasSeenCustomizerHighlight && !isArtworkPopoverOpen && (
                <div className="absolute top-full right-0 mt-2 z-70 flex flex-col items-end pointer-events-none animate-in fade-in slide-in-from-top-1 duration-200">
                  <div className="mr-3 w-2.5 h-2.5 bg-[#caa282] rotate-45 border-t border-l border-black/30" />
                  <div className="bg-[#caa282] text-[#231814] px-3 py-1.5 rounded-xl border border-black/40 shadow-xl text-[11px] font-extrabold whitespace-nowrap flex items-center gap-1.5 -mt-1.5">
                    <Sparkles className="w-3.5 h-3.5 fill-[#231814] text-[#231814]" />
                    <span>Customize Preview Layout</span>
                  </div>
                </div>
              )}

              {isArtworkPopoverOpen && (
                <div className="absolute right-0 top-full mt-2 w-72 p-4 rounded-2xl bg-[#fdf8f3] dark:bg-[#f6e9d7] border-2 border-[#d9c7b8] shadow-[0_25px_60px_rgba(0,0,0,0.5)] z-80 space-y-3.5 animate-in fade-in zoom-in-95 duration-100 text-[#2b1d16]">
                  <div className="flex items-center justify-between border-b border-[#e5d4c5] pb-2">
                    <div className="flex items-center gap-2">
                      <ImageIcon className="w-4 h-4 text-[#c76e3c]" />
                      <span className="text-xs font-extrabold uppercase tracking-wider text-[#2b1d16]">Preview Customizer</span>
                    </div>
                    <button
                      onClick={() => setShowPreviewArtwork(!showPreviewArtwork)}
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold cursor-pointer transition-colors ${
                        showPreviewArtwork
                          ? 'bg-[#2b1d16] text-[#fdf8f3]'
                          : 'bg-[#e5d4c5] text-[#6e5142]'
                      }`}
                    >
                      {showPreviewArtwork ? 'ART ON' : 'ART OFF'}
                    </button>
                  </div>

                  {showPreviewArtwork && (
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-[#6e5142] font-bold">
                          Backdrop Opacity:
                        </span>
                        <span className="font-mono font-bold text-[#c76e3c]">
                          {previewArtworkOpacity}%
                        </span>
                      </div>
                      <input
                        type="range"
                        min="10"
                        max="100"
                        step="5"
                        value={previewArtworkOpacity}
                        onChange={(e) => setPreviewArtworkOpacity(Number(e.target.value))}
                        className="w-full h-1.5 bg-[#e5d4c5] rounded-lg appearance-none cursor-pointer accent-[#c76e3c]"
                      />
                    </div>
                  )}

                  {/* Section Elements On/Off Toggles */}
                  <div className="pt-2 border-t border-[#e5d4c5] space-y-2">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#8a6854] block">
                      Toggle Hero Elements:
                    </span>

                    <div className="space-y-1.5 text-xs">
                      {[
                        { label: 'Title Background Card', val: previewShowTitleCard, set: setPreviewShowTitleCard },
                        { label: 'Tagline Quote', val: previewShowTagline, set: setPreviewShowTagline },
                        { label: 'Genre Pills in Hero', val: previewShowGenres, set: setPreviewShowGenres },
                        { label: '% Match Score', val: previewShowMatchScore, set: setPreviewShowMatchScore },
                        { label: '★ Rating Badge', val: previewShowRatingBadge, set: setPreviewShowRatingBadge },
                        { label: 'HD Quality Badge', val: previewShowQualityBadge, set: setPreviewShowQualityBadge },
                        { label: 'Watch Trailer Button', val: previewShowTrailerButton, set: setPreviewShowTrailerButton },
                        { label: 'Synopsis in Hero', val: previewShowSynopsis, set: setPreviewShowSynopsis },
                        { label: 'Streaming Providers', val: previewShowProviders, set: setPreviewShowProviders },
                      ].map((elem) => (
                        <div key={elem.label} className="flex items-center justify-between py-0.5">
                          <span className="text-[11px] font-semibold text-[#5e4133]">
                            {elem.label}
                          </span>
                          <button
                            onClick={() => elem.set(!elem.val)}
                            className={`px-2 py-0.5 rounded-md text-[10px] font-bold transition-colors cursor-pointer ${
                              elem.val
                                ? 'bg-[#2b1d16] text-[#fdf8f3]'
                                : 'bg-[#e5d4c5] text-[#6e5142]'
                            }`}
                          >
                            {elem.val ? 'Show' : 'Hide'}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Add to List Button Icon (Minimal without highlight) */}
            <div className="relative z-45" ref={listDropdownRef}>
              <button
                onClick={() => setIsListDropdownOpen(!isListDropdownOpen)}
                title="Add to Custom List"
                className="p-2.5 rounded-full bg-black/50 hover:bg-black/75 text-white/90 hover:text-white border border-white/20 transition-colors cursor-pointer backdrop-blur-md"
              >
                <ListPlus className="w-4 h-4 text-white/90" />
              </button>

              {isListDropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-72 rounded-2xl bg-[#fdf8f3] dark:bg-[#f6e9d7] border-2 border-[#d9c7b8] shadow-[0_25px_60px_rgba(0,0,0,0.5)] p-3.5 z-80 space-y-2.5 animate-in fade-in zoom-in-95 duration-100 text-xs text-[#2b1d16]">
                  <div className="font-bold text-[#2b1d16] border-b border-[#e5d4c5] pb-2 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <ListPlus className="w-4 h-4 text-[#c76e3c]" />
                      <span>Add to Custom List</span>
                    </div>
                    <span className="text-[10px] text-[#6e5142] font-normal">
                      {customLists.length} lists
                    </span>
                  </div>

                  {/* Custom Lists List */}
                  <div className="max-h-52 overflow-y-auto space-y-1">
                    {customLists.length === 0 ? (
                      <p className="text-center py-3 text-xs text-[#6e5142]">
                        No custom lists yet. Create one below!
                      </p>
                    ) : (
                      customLists.map((list) => {
                        const isIncluded =
                          (item.customLists || []).includes(list.id) ||
                          items.some(
                            (i) =>
                              (i.id === item.id || (item.tmdbId && i.tmdbId === item.tmdbId)) &&
                              (i.customLists || []).includes(list.id)
                          );
                        return (
                          <button
                            key={list.id}
                            onClick={() => handleToggleCustomList(list.id)}
                            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left transition-colors cursor-pointer ${
                              isIncluded
                                ? 'bg-[#fae5d8] text-[#c76e3c] font-bold'
                                : 'text-[#5e4133] hover:bg-[#ede0d5]'
                            }`}
                          >
                            <span className="flex items-center gap-2.5 truncate">
                              <ListPlus className="w-3.5 h-3.5 shrink-0 opacity-70" />
                              <span className="truncate">{list.name}</span>
                            </span>
                            {isIncluded ? (
                              <Check className="w-4 h-4 text-[#c76e3c] stroke-[3] shrink-0" />
                            ) : (
                              <Plus className="w-3.5 h-3.5 text-[#8a6854] shrink-0" />
                            )}
                          </button>
                        );
                      })
                    )}
                  </div>

                  {/* Quick Create New List */}
                  <div className="pt-2 border-t border-[#e5d4c5] flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="New list name..."
                      value={newListName}
                      onChange={(e) => setNewListName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleQuickCreateList();
                      }}
                      className="flex-1 px-2.5 py-1.5 rounded-lg bg-[#f0e4d7] border border-[#d8c6b5] text-xs text-[#2b1d16] placeholder-[#8a6854] focus:outline-none"
                    />
                    <button
                      onClick={handleQuickCreateList}
                      disabled={!newListName.trim()}
                      className="px-3 py-1.5 rounded-lg bg-[#2b1d16] text-[#fdf8f3] font-bold text-xs disabled:opacity-40 cursor-pointer transition-opacity"
                    >
                      Create
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Favorite Toggle Button (Orange & Minimal when selected) */}
            <button
              onClick={() => {
                if (!isInCollection) addItem(item, 'watchlist');
                toggleFavorite(item.id);
              }}
              title={item.isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
              className={`p-2.5 rounded-full border transition-all cursor-pointer backdrop-blur-md ${
                item.isFavorite
                  ? 'bg-orange-500/10 border-orange-500/30 text-orange-500 hover:bg-orange-500/20'
                  : 'bg-black/50 border-white/20 text-white/90 hover:bg-black/75'
              }`}
            >
              <Heart
                className={`w-4 h-4 transition-all duration-200 ${
                  item.isFavorite ? 'fill-orange-500 text-orange-500 scale-105' : 'text-white/90'
                }`}
              />
            </button>

            {/* Close Button */}
            <button
              onClick={() => setSelectedMedia(null)}
              title="Close (Esc)"
              className="p-2.5 rounded-full bg-black/50 hover:bg-black/75 text-white border border-white/20 transition-colors cursor-pointer backdrop-blur-md"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Video Trailer Stage OR Theatrical Billboard Content (z-20 sits below header overlay z-50) */}
        <div className="relative z-20 max-w-7xl mx-auto w-full pb-4">
          {isPlayingTrailer ? (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="flex items-center justify-between pb-1">
                <div className="flex items-center gap-2 text-xs font-bold text-[#c76e3c]">
                  <Video className="w-4 h-4 animate-pulse" />
                  <span>NOW PLAYING · OFFICIAL THEATRICAL TRAILER</span>
                </div>
                <div className="flex items-center gap-3">
                  <a
                    href={`https://www.youtube.com/watch?v=${activeTrailerKey}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-white/80 hover:underline flex items-center gap-1 font-medium"
                  >
                    <span>Watch on YouTube</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                  <button
                    onClick={() => setIsPlayingTrailer(false)}
                    className="px-4 py-1.5 rounded-full bg-white/20 hover:bg-white/30 text-xs font-bold text-white transition-colors cursor-pointer backdrop-blur-xs"
                  >
                    Back to Details
                  </button>
                </div>
              </div>

              <div className="relative w-full aspect-video max-h-[600px] rounded-2xl overflow-hidden bg-black shadow-2xl border border-white/20 mx-auto">
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${activeTrailerKey}?autoplay=1&rel=0&modestbranding=1`}
                  title={`${item.title} Trailer`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full border-0"
                />
              </div>
            </div>
          ) : (
            /* Restored Theatrical Showcase with Optional Cream Background Card & Movie Poster */
            <div className="relative z-20 flex flex-col sm:flex-row items-center sm:items-end gap-6 lg:gap-8">
              {/* Media Poster Card */}
              <div className="w-36 sm:w-44 md:w-52 lg:w-56 shrink-0 rounded-2xl overflow-hidden shadow-2xl border-2 border-white/20 aspect-[2/3] bg-black/40 hidden sm:block">
                <img
                  src={item.poster || item.banner}
                  alt={item.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Title & Details Container: Cream Background Card (Removable via previewShowTitleCard) */}
              <div
                className={`flex-1 min-w-0 w-full transition-all duration-200 ${
                  previewShowTitleCard
                    ? 'bg-[#fdf8f3] dark:bg-[#f6e9d7] rounded-2xl sm:rounded-3xl p-5 sm:p-7 lg:p-8 border border-[#e8d5c4] shadow-2xl text-[#2b1d16] space-y-4'
                    : 'bg-transparent border-0 shadow-none p-0 sm:p-0 lg:p-0 text-white space-y-4'
                }`}
              >
                {/* Rating Badge Above Title */}
                {previewShowRatingBadge && item.rating > 0 && (
                  <div className="flex items-center">
                    <span className="px-2.5 py-1 rounded-md bg-black/75 backdrop-blur-md text-white text-xs font-bold flex items-center gap-1.5 font-mono border border-white/20 shadow-sm w-fit">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span>{item.rating}</span>
                    </span>
                  </div>
                )}

                {/* Display Title - adaptive to background (Enlarged on mobile) */}
                <h1
                  className={`text-3xl xs:text-4xl sm:text-3xl lg:text-4xl xl:text-5xl font-black tracking-tight leading-tight ${
                    previewShowTitleCard
                      ? 'text-[#2b1d16]'
                      : 'text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)]'
                  }`}
                >
                  {item.title}
                </h1>

                {/* Tagline - adaptive to background */}
                {previewShowTagline && item.tagline && (
                  <p
                    className={`text-xs sm:text-sm font-serif italic tracking-wide ${
                      previewShowTitleCard
                        ? 'text-[#5e4133]'
                        : 'text-white/90 drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)]'
                    }`}
                  >
                    "{item.tagline}"
                  </p>
                )}

                {/* Metadata Badges Row - adaptive to background */}
                <div
                  className={`flex items-center gap-2 text-xs sm:text-sm font-semibold flex-wrap ${
                    previewShowTitleCard ? 'text-[#5e4133]' : 'text-white/95'
                  }`}
                >
                  {previewShowMatchScore && (
                    <>
                      <span className="font-black text-emerald-600 dark:text-emerald-500">
                        {Math.round(item.rating * 10)}% match
                      </span>
                      <span className={previewShowTitleCard ? 'text-[#8a6854] font-bold' : 'text-white/60 font-bold'}>·</span>
                    </>
                  )}

                  {/* Media Type */}
                  <span
                    className={`uppercase font-mono font-bold tracking-wider text-xs ${
                      previewShowTitleCard
                        ? 'text-[#5e4133]'
                        : 'text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]'
                    }`}
                  >
                    {item.type === 'series' ? 'TV SERIES' : 'MOVIE'}
                  </span>

                  <span className={previewShowTitleCard ? 'text-[#8a6854] font-bold' : 'text-white/60 font-bold'}>·</span>

                  {/* Year */}
                  <span
                    className={`font-mono font-bold text-xs ${
                      previewShowTitleCard
                        ? 'text-[#5e4133]'
                        : 'text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]'
                    }`}
                  >
                    {item.year}
                  </span>

                  <span className={previewShowTitleCard ? 'text-[#8a6854] font-bold' : 'text-white/60 font-bold'}>·</span>

                  {/* Runtime / Seasons */}
                  <span
                    className={`font-medium text-xs ${
                      previewShowTitleCard
                        ? 'text-[#5e4133]'
                        : 'text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]'
                    }`}
                  >
                    {isSeries
                      ? `${item.totalSeasons || 1} season${(item.totalSeasons || 1) > 1 ? 's' : ''}`
                      : item.runtime}
                  </span>

                  {/* Quality */}
                  {previewShowQualityBadge && (
                    <>
                      <span className={previewShowTitleCard ? 'text-[#8a6854] font-bold' : 'text-white/60 font-bold'}>·</span>
                      <span
                        className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                          previewShowTitleCard
                            ? 'bg-[#ede0d5] text-[#5e4133] border border-[#d8c6b5]'
                            : 'bg-black/50 text-white border border-white/20'
                        }`}
                      >
                        HD
                      </span>
                    </>
                  )}
                </div>

                {/* Synopsis Excerpt - adaptive to background */}
                {previewShowSynopsis && item.description && (
                  <p
                    className={`text-xs sm:text-sm line-clamp-3 font-normal leading-relaxed max-w-2xl ${
                      previewShowTitleCard
                        ? 'text-[#5e4133]'
                        : 'text-white/90 drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)]'
                    }`}
                  >
                    {item.description}
                  </p>
                )}

                {/* Optional Inline Genre Chips */}
                {previewShowGenres && item.genres && item.genres.length > 0 && (
                  <div className="flex flex-wrap items-center gap-2 pt-0.5">
                    {item.genres.map((g) => (
                      <GenreBadge key={g} genre={g} />
                    ))}
                  </div>
                )}

                {/* Primary Action Buttons */}
                <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 pt-2">
                  {/* Watch Trailer CTA */}
                  {previewShowTrailerButton && (
                    <button
                      onClick={() => setIsPlayingTrailer(true)}
                      className="px-5 py-2.5 rounded-xl backdrop-blur-md bg-white/20 dark:bg-black/40 hover:bg-white/30 dark:hover:bg-black/50 text-white text-xs sm:text-sm font-bold flex items-center gap-2 transition-transform active:scale-95 cursor-pointer border border-white/25 shadow-md"
                    >
                      <Play className="w-4 h-4 fill-current" />
                      <span>Watch Trailer</span>
                    </button>
                  )}

                  {/* Watchlist Button - Pure White filled with black bold text as requested */}
                  <button
                    onClick={() => {
                      if (currentStatus === 'watchlist') {
                        handleStatusChange('not_added');
                      } else {
                        handleStatusChange('watchlist');
                      }
                    }}
                    className="px-4 py-2.5 rounded-xl bg-white hover:bg-neutral-100 text-black border border-white font-extrabold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer shadow-md active:scale-95"
                    title={currentStatus === 'watchlist' ? 'Remove from Watchlist' : 'Add to Watchlist'}
                  >
                    {currentStatus === 'watchlist' ? (
                      <>
                        <Check className="w-4 h-4 text-black stroke-[3]" />
                        <span className="font-extrabold text-black">In Watchlist</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4 text-black stroke-[3]" />
                        <span className="font-extrabold text-black">+ Watchlist</span>
                      </>
                    )}
                  </button>

                  {/* Watched/Pending Button */}
                  <button
                    onClick={() => {
                      if (currentStatus === 'watched') {
                        handleStatusChange('watchlist');
                      } else {
                        handleStatusChange('watched');
                      }
                    }}
                    className="px-4 py-2.5 rounded-xl backdrop-blur-md bg-white/20 dark:bg-black/40 hover:bg-white/30 dark:hover:bg-black/50 text-white text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer border border-white/25 shadow-md active:scale-95"
                    title={
                      currentStatus === 'watched'
                        ? 'Watched! Click to set as Pending'
                        : 'Pending. Click to mark as Watched'
                    }
                  >
                    {currentStatus === 'watched' ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-400 stroke-[3]" />
                        <span>Watched</span>
                      </>
                    ) : (
                      <>
                        <Clock className="w-4 h-4 stroke-[2.5]" />
                        <span>Pending</span>
                      </>
                    )}
                  </button>



                  {/* Details Button & Popover */}
                  {previewShowDetailsButton && (
                    <div className="relative z-40" ref={detailsPopoverRef}>
                      <button
                        onClick={() => setIsDetailsPopoverOpen(!isDetailsPopoverOpen)}
                        className="px-4 py-2.5 rounded-xl backdrop-blur-md bg-[#ede0d5]/85 dark:bg-[#35261e]/85 hover:bg-[#e4d3c3]/95 text-[#2b1d16] dark:text-[#fdf8f3] text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer border border-[#d8c6b5]/80 dark:border-[#4a3528]/80 shadow-md active:scale-95"
                        title="View Cast, Director & Technical Details"
                      >
                        <Info className="w-4 h-4" />
                        <span>Details</span>
                      </button>

                      {/* Popover containing Cast & Tech Specs */}
                      {isDetailsPopoverOpen && (
                        <div className="absolute left-0 sm:left-auto sm:right-0 top-full mt-2 w-80 sm:w-96 rounded-2xl bg-[#fdf8f3] dark:bg-[#f6e9d7] border-2 border-[#d9c7b8] shadow-[0_25px_60px_rgba(0,0,0,0.5)] p-4 sm:p-5 z-80 space-y-3.5 animate-in fade-in zoom-in-95 duration-100 text-xs text-[#2b1d16]">
                          <div className="flex items-center justify-between border-b border-[#e5d4c5] pb-2">
                            <div className="flex items-center gap-2">
                              <Info className="w-4 h-4 text-[#c76e3c]" />
                              <span className="font-extrabold uppercase tracking-wider text-[11px] text-[#8a6854]">
                                Cast &amp; Technical Details
                              </span>
                            </div>
                            <button
                              onClick={() => setIsDetailsPopoverOpen(false)}
                              className="p-1 rounded-md hover:bg-[#ded0c3] cursor-pointer text-[#2b1d16]"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          {/* Genres */}
                          <div className="space-y-1.5">
                            <span className="text-[10px] font-bold text-[#8a6854] uppercase tracking-wider">
                              Genres ({item.genres.length}):
                            </span>
                            <div className="flex flex-wrap gap-1.5">
                              {item.genres.map((g) => (
                                <span
                                  key={g}
                                  className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#fae5d8] text-[#c76e3c] border border-[#f0c2a8]"
                                >
                                  {g}
                                </span>
                              ))}
                            </div>
                          </div>

                          {/* Director & Cast */}
                          <div className="space-y-1 pt-1 border-t border-[#e5d4c5] text-[11px]">
                            {item.director && (
                              <div className="flex items-center justify-between">
                                <span className="text-[#8a6854]">Director:</span>
                                <span className="font-bold text-[#2b1d16]">{item.director}</span>
                              </div>
                            )}
                            {item.cast && item.cast.length > 0 && (
                              <div className="flex items-start justify-between gap-2 pt-0.5">
                                <span className="text-[#8a6854] shrink-0">Cast:</span>
                                <span className="font-medium text-right text-[#2b1d16] truncate">
                                  {item.cast.slice(0, 3).join(', ')}
                                </span>
                              </div>
                            )}
                          </div>

                          {/* Available Streaming Platforms */}
                          <div className="space-y-1.5 pt-1 border-t border-[#e5d4c5]">
                            <span className="text-[10px] font-bold text-[#8a6854] uppercase tracking-wider">
                              Where to Watch:
                            </span>
                            <div className="flex flex-wrap gap-1.5">
                              {providers.map((p) => (
                                <span
                                  key={p.id}
                                  className="px-2 py-0.5 rounded-lg bg-[#ede0d5] text-[10px] font-bold text-[#2b1d16] border border-[#d8c6b5]"
                                >
                                  {p.name}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Sticky Navigation Tabs (z-10 so popovers float above) */}
      <div className="sticky top-0 z-10 bg-[#121316]/95 dark:bg-[#201510]/95 backdrop-blur-md border-b border-white/10 dark:border-[#38261e]">
        <div className="max-w-7xl mx-auto w-full px-4 sm:px-8 flex items-center gap-2 sm:gap-6 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-4 px-2 text-xs sm:text-sm font-bold tracking-tight transition-colors border-b-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'overview'
                ? 'border-[#f5a77b] text-[#f5a77b]'
                : 'border-transparent text-neutral-300 hover:text-white'
            }`}
          >
            Overview
          </button>

          {isSeries && (
            <button
              onClick={() => setActiveTab('episodes')}
              className={`py-4 px-2 text-xs sm:text-sm font-bold tracking-tight transition-colors border-b-2 whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'episodes'
                  ? 'border-[#f5a77b] text-[#f5a77b]'
                  : 'border-transparent text-neutral-300 hover:text-white'
              }`}
            >
              <span>Episodes</span>
              {seasons.length > 0 && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-white/20 text-white font-mono">
                  {seasons.length}S
                </span>
              )}
            </button>
          )}

          <button
            onClick={() => setActiveTab('trailers')}
            className={`py-4 px-2 text-xs sm:text-sm font-bold tracking-tight transition-colors border-b-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'trailers'
                ? 'border-[#f5a77b] text-[#f5a77b]'
                : 'border-transparent text-neutral-300 hover:text-white'
            }`}
          >
            Trailers &amp; Videos
          </button>

          <button
            onClick={() => setActiveTab('cast')}
            className={`py-4 px-2 text-xs sm:text-sm font-bold tracking-tight transition-colors border-b-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'cast'
                ? 'border-[#f5a77b] text-[#f5a77b]'
                : 'border-transparent text-neutral-300 hover:text-white'
            }`}
          >
            Cast &amp; Crew
          </button>

          <button
            onClick={() => setActiveTab('streaming')}
            className={`py-4 px-2 text-xs sm:text-sm font-bold tracking-tight transition-colors border-b-2 whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'streaming'
                ? 'border-[#f5a77b] text-[#f5a77b]'
                : 'border-transparent text-neutral-300 hover:text-white'
            }`}
          >
            <span>Where to Watch</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          </button>

          <button
            onClick={() => setActiveTab('similar')}
            className={`py-4 px-2 text-xs sm:text-sm font-bold tracking-tight transition-colors border-b-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'similar'
                ? 'border-[#f5a77b] text-[#f5a77b]'
                : 'border-transparent text-neutral-300 hover:text-white'
            }`}
          >
            More Like This
          </button>
        </div>
      </div>

      {/* Main Full-Screen Content Viewport */}
      <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-8 py-8 space-y-8">
        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <div className="space-y-3">
                <h3 className="text-xs font-black tracking-widest uppercase text-[#f5a77b] font-mono">
                  Story &amp; Synopsis
                </h3>
                <p className="text-base sm:text-lg text-[#fdf8f3] leading-relaxed font-normal">
                  {item.description}
                </p>
              </div>

              {/* Where to Watch Preview: Cream Overlay Card */}
              <div className="p-5 rounded-2xl bg-[#fbe0b7] border border-[#d9c7b8] text-[#2b1d16] space-y-3 shadow-md">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#2b1d16] flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#c76e3c]" />
                    Available to Stream in Your Region
                  </span>
                  <button
                    onClick={() => setActiveTab('streaming')}
                    className="text-xs text-[#c76e3c] hover:underline font-bold cursor-pointer"
                  >
                    View All Options →
                  </button>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  {providers.slice(0, 4).map((p) => (
                    <div key={p.id} className="flex items-center gap-2">
                      <OttStreamingBadge platform={p.id} size="md" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Top Cast Gallery */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-black tracking-widest uppercase text-[#f5a77b] font-mono">
                    Starring Cast
                  </h3>
                  <button
                    onClick={() => setActiveTab('cast')}
                    className="text-xs text-[#e8d7cb] hover:text-white transition-colors cursor-pointer font-semibold"
                  >
                    Full Cast &amp; Crew →
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {item.castDetails && item.castDetails.length > 0 ? (
                    item.castDetails.slice(0, 4).map((c) => (
                      <div
                        key={c.id}
                        className="p-3.5 rounded-2xl bg-[#fbe0b7] border border-[#d9c7b8] text-[#2b1d16] shadow-sm flex items-center gap-3"
                      >
                        {c.profilePath ? (
                          <img
                            src={c.profilePath}
                            alt={c.name}
                            referrerPolicy="no-referrer"
                            className="w-12 h-12 rounded-full object-cover shrink-0 border border-[#d8c6b5]"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-[#ede0d5] text-[#c76e3c] font-bold flex items-center justify-center shrink-0 text-sm">
                            {c.name.charAt(0)}
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-[#2b1d16] truncate">{c.name}</p>
                          <p className="text-[11px] text-[#5e4133] truncate">{c.character}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    (item.cast || ['Lead Actor', 'Supporting Actor']).slice(0, 4).map((actor) => (
                      <div
                        key={actor}
                        className="p-3.5 rounded-2xl bg-[#fbe0b7] border border-[#d9c7b8] text-[#2b1d16] shadow-sm flex items-center gap-3"
                      >
                        <div className="w-12 h-12 rounded-full bg-[#ede0d5] text-[#c76e3c] font-bold flex items-center justify-center shrink-0 text-sm">
                          {actor.charAt(0)}
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-[#2b1d16] truncate">{actor}</p>
                          <p className="text-[11px] text-[#5e4133] truncate">Actor</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Right Col: Film Specifications */}
            <div className="space-y-6">
              <div className="p-6 rounded-3xl bg-[#fbe0b7] border border-[#d9c7b8] text-[#2b1d16] space-y-4 shadow-md">
                <h3 className="text-xs font-black tracking-widest uppercase text-[#8a6854] font-mono">
                  Film Specifications
                </h3>

                <div className="space-y-3.5 text-xs">
                  <div className="flex justify-between items-baseline border-b border-[#e5d4c5] pb-2.5">
                    <span className="text-[#5e4133]">
                      {isSeries ? 'Creator / Showrunner' : 'Director'}
                    </span>
                    <span className="text-[#2b1d16] font-bold text-right ml-2">
                      {item.director || 'Visionary Director'}
                    </span>
                  </div>

                  {item.writers && item.writers.length > 0 && (
                    <div className="flex justify-between items-baseline border-b border-[#e5d4c5] pb-2.5">
                      <span className="text-[#5e4133]">Screenplay</span>
                      <span className="text-[#2b1d16] font-semibold text-right ml-2">
                        {item.writers.join(', ')}
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between items-baseline border-b border-[#e5d4c5] pb-2.5">
                    <span className="text-[#5e4133]">Release Date</span>
                    <span className="text-[#2b1d16] font-mono font-medium">{item.year}</span>
                  </div>

                  <div className="flex justify-between items-baseline border-b border-[#e5d4c5] pb-2.5">
                    <span className="text-[#5e4133]">Running Time</span>
                    <span className="text-[#2b1d16] font-mono font-medium">{item.runtime}</span>
                  </div>

                  {item.studios && item.studios.length > 0 && (
                    <div className="flex justify-between items-baseline border-b border-[#e5d4c5] pb-2.5">
                      <span className="text-[#5e4133]">Studio</span>
                      <span className="text-[#2b1d16] font-medium text-right ml-2">
                        {item.studios.join(' · ')}
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between items-baseline">
                    <span className="text-[#5e4133]">Audio &amp; Subs</span>
                    <span className="text-[#2b1d16] font-medium">English (Original), Multi-CC</span>
                  </div>
                </div>
              </div>

              {/* Quick Curate In Custom List Card: Cream Overlay Card */}
              <div className="p-5 rounded-3xl bg-[#fbe0b7] border border-[#d9c7b8] text-[#2b1d16] flex items-center justify-between shadow-md">
                <div>
                  <p className="text-xs font-bold text-[#2b1d16]">Curate In Custom List</p>
                  <p className="text-[11px] text-[#5e4133]">Organize into your personal queues</p>
                </div>
                <button
                  onClick={() => setIsListDropdownOpen(true)}
                  className="px-4 py-2 rounded-xl bg-[#2b1d16] text-[#fdf8f3] hover:bg-[#3d2a21] text-xs font-bold transition-colors cursor-pointer"
                >
                  Select List
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: EPISODES */}
        {activeTab === 'episodes' && isSeries && (() => {
          const handleToggleEpisode = (seasonNum: number, epNum: number) => {
            if (!isInCollection) {
              addItem({ ...item, status: 'watching' }, 'watching');
            }
            toggleEpisodeWatched(item.id, seasonNum, epNum);
          };

          const handleToggleAllSeason = () => {
            if (!isInCollection) {
              addItem({ ...item, status: 'watching' }, 'watching');
            }
            const isAllCurrentlyWatched = currentSeasonData?.episodes.every((e) => e.watched);
            toggleSeasonAllEpisodes(item.id, selectedSeasonNumber, !isAllCurrentlyWatched);
          };

          const seasonWatchedCount = currentSeasonData?.episodes.filter((e) => e.watched).length || 0;
          const seasonTotalCount = currentSeasonData?.episodes.length || 0;
          const isSeasonAllWatched = seasonTotalCount > 0 && seasonWatchedCount === seasonTotalCount;
          const seasonProgressPct = seasonTotalCount > 0 ? Math.round((seasonWatchedCount / seasonTotalCount) * 100) : 0;

          return (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-3xl bg-[#fbe0b7] border border-[#d9c7b8] text-[#2b1d16] shadow-md">
              <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
                {seasons.map((s) => (
                  <button
                    key={s.seasonNumber}
                    onClick={() => setSelectedSeasonNumber(s.seasonNumber)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors whitespace-nowrap cursor-pointer ${
                      selectedSeasonNumber === s.seasonNumber
                        ? 'bg-[#2b1d16] text-[#fbe0b7] shadow-md'
                        : 'bg-[#ede0d5] text-[#2b1d16] hover:bg-[#ded0c3]'
                    }`}
                  >
                    {s.name || `Season ${s.seasonNumber}`}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-3 text-xs">
                <span className="text-[#5e4133]">
                  {seasonWatchedCount} / {seasonTotalCount} Watched
                </span>
                <button
                  onClick={handleToggleAllSeason}
                  className="px-3.5 py-2 rounded-xl bg-[#ede0d5] hover:bg-[#ded0c3] text-[#2b1d16] font-semibold transition-colors cursor-pointer"
                >
                  {isSeasonAllWatched ? 'Reset Season' : 'Mark All Watched'}
                </button>
              </div>
            </div>

            {/* Season Progress Bar */}
            <div className="space-y-1.5 px-1">
              <div className="flex justify-between items-center text-xs font-bold text-[#5e4133] dark:text-[#d8c6b5]">
                <span>Season Progress</span>
                <span className="font-mono">{seasonProgressPct}%</span>
              </div>
              <div className="w-full bg-[#ded0c3] dark:bg-[#382820] h-2 rounded-full overflow-hidden border border-[#d9c7b8]/50">
                <div
                  className="bg-[#ea9160] h-full rounded-full transition-all duration-300"
                  style={{ width: `${seasonProgressPct}%` }}
                />
              </div>
            </div>

            {/* 2-Column Episode Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {currentSeasonData && currentSeasonData.episodes.length > 0 ? (
                currentSeasonData.episodes.map((ep) => (
                  <div
                    key={ep.episodeNumber}
                    onClick={() =>
                      handleToggleEpisode(selectedSeasonNumber, ep.episodeNumber)
                    }
                    className={`p-2.5 rounded-xl border transition-all flex items-center justify-between gap-3 cursor-pointer shadow-2xs ${
                      ep.watched
                        ? 'bg-[#f4ebe3] dark:bg-[#2e2019] border-[#caa282] text-[#2b1d16] dark:text-[#faf6f2]'
                        : 'bg-[#fbe0b7] border-[#d9c7b8] text-[#2b1d16] hover:border-[#ea9160]/70'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span
                        className={`w-7 h-7 rounded-lg text-[11px] font-mono font-bold flex items-center justify-center shrink-0 transition-colors ${
                          ep.watched
                            ? 'bg-[#caa282] text-[#231814] font-black shadow-2xs'
                            : 'bg-[#ede0d5] dark:bg-[#e6d0bc] border border-[#d8c6b5] text-[#8a6854]'
                        }`}
                      >
                        {ep.episodeNumber}
                      </span>

                      <div className="min-w-0">
                        <h4 className="text-xs font-bold truncate text-[#2b1d16]">
                          {ep.title || `Episode ${ep.episodeNumber}`}
                        </h4>
                        <div
                          className={`flex items-center gap-1.5 text-[10px] font-mono mt-0.5 ${
                            ep.watched
                              ? 'text-amber-800'
                              : 'text-[#6e5142]'
                          }`}
                        >
                          {ep.runtime && <span>{ep.runtime}</span>}
                          {ep.airDate && <span>· {ep.airDate}</span>}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleEpisode(selectedSeasonNumber, ep.episodeNumber);
                      }}
                      className={`w-7 h-7 rounded-full flex items-center justify-center transition-all cursor-pointer shrink-0 border ${
                        ep.watched
                          ? 'bg-[#caa282] dark:bg-[#caa282] text-[#231814] border-[#caa282] shadow-xs scale-105'
                          : 'bg-[#ede0d5] dark:bg-[#e6d0bc] hover:bg-[#ded0c3] text-transparent hover:text-amber-500 border-[#d8c6b5]'
                      }`}
                      title={ep.watched ? 'Mark Unwatched' : 'Mark Watched'}
                    >
                      <Check className={`w-3.5 h-3.5 stroke-[3] ${ep.watched ? 'text-[#231814]' : 'opacity-20 hover:opacity-100 text-amber-500'}`} />
                    </button>
                  </div>
                ))
              ) : (
                <div className="col-span-full p-8 text-center text-[#5e4133] bg-[#fbe0b7] rounded-2xl border border-[#d9c7b8]">
                  <p>Episodes will be updated automatically as they air.</p>
                </div>
              )}
            </div>
          </div>
        );
        })()}

        {/* TAB 3: TRAILERS */}
        {activeTab === 'trailers' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-black uppercase text-[#f5a77b] font-mono">
                  Official Theatrical Previews
                </h3>
                <p className="text-xs text-[#e8d7cb]">Stream high definition theatrical videos</p>
              </div>

              <a
                href={`https://www.youtube.com/results?search_query=${encodeURIComponent(
                  `${item.title} official trailer`
                )}`}
                target="_blank"
                rel="noreferrer"
                className="text-xs text-[#f5a77b] hover:underline flex items-center gap-1 font-bold"
              >
                <span>More on YouTube</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <div className="relative w-full aspect-video max-h-[650px] rounded-3xl overflow-hidden bg-black shadow-2xl border border-[#d9c7b8]/40 mx-auto">
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${activeTrailerKey}?rel=0&modestbranding=1`}
                title={`${item.title} Official Trailer`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full border-0"
              />
            </div>
          </div>
        )}

        {/* TAB 4: CAST & CREW */}
        {activeTab === 'cast' && (
          <div className="space-y-8">
            <div className="space-y-4">
              <h3 className="text-xs font-black tracking-widest uppercase text-[#f5a77b] font-mono">
                Full Cast Directory
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {item.castDetails && item.castDetails.length > 0 ? (
                  item.castDetails.map((c) => (
                    <div
                      key={c.id}
                      className="p-3.5 rounded-2xl bg-[#fbe0b7] border border-[#d9c7b8] text-[#2b1d16] flex flex-col items-center text-center space-y-2 shadow-sm"
                    >
                      {c.profilePath ? (
                        <img
                          src={c.profilePath}
                          alt={c.name}
                          referrerPolicy="no-referrer"
                          className="w-20 h-20 rounded-full object-cover border-2 border-[#d8c6b5] shadow-md"
                        />
                      ) : (
                        <div className="w-20 h-20 rounded-full bg-[#ede0d5] text-[#c76e3c] font-black flex items-center justify-center text-xl border-2 border-[#d8c6b5]">
                          {c.name.charAt(0)}
                        </div>
                      )}
                      <div>
                        <p className="text-xs font-bold text-[#2b1d16] line-clamp-1">{c.name}</p>
                        <p className="text-[11px] text-[#5e4133] line-clamp-1 mt-0.5">
                          {c.character}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  (item.cast || []).map((actor) => (
                    <div
                      key={actor}
                      className="p-3.5 rounded-2xl bg-[#fbe0b7] border border-[#d9c7b8] text-[#2b1d16] flex flex-col items-center text-center space-y-2 shadow-sm"
                    >
                      <div className="w-16 h-16 rounded-full bg-[#ede0d5] text-[#c76e3c] font-bold flex items-center justify-center text-lg">
                        {actor.charAt(0)}
                      </div>
                      <p className="text-xs font-bold text-[#2b1d16]">{actor}</p>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-xs font-black tracking-widest uppercase text-[#f5a77b] font-mono">
                Key Production Crew
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-4 rounded-2xl bg-[#fbe0b7] border border-[#d9c7b8] text-[#2b1d16] shadow-sm">
                  <span className="text-[#5e4133] block text-[11px]">Director</span>
                  <span className="text-[#2b1d16] font-bold">{item.director || 'Director'}</span>
                </div>
                {item.writers && item.writers.length > 0 && (
                  <div className="p-4 rounded-2xl bg-[#fbe0b7] border border-[#d9c7b8] text-[#2b1d16] shadow-sm">
                    <span className="text-[#5e4133] block text-[11px]">Screenplay</span>
                    <span className="text-[#2b1d16] font-bold">{item.writers.join(', ')}</span>
                  </div>
                )}
                {item.studios && item.studios.length > 0 && (
                  <div className="p-4 rounded-2xl bg-[#fbe0b7] border border-[#d9c7b8] text-[#2b1d16] shadow-sm">
                    <span className="text-[#5e4133] block text-[11px]">Studio</span>
                    <span className="text-[#2b1d16] font-bold">{item.studios[0]}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: STREAMING */}
        {activeTab === 'streaming' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-black uppercase text-[#f5a77b] font-mono">
                Streaming Networks &amp; Providers
              </h3>
              <p className="text-xs text-[#e8d7cb]">
                Confirmed streaming, rental, and purchase availability
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {providers.map((p) => (
                <div
                  key={p.id}
                  className="p-4.5 rounded-2xl bg-[#fbe0b7] border border-[#d9c7b8] text-[#2b1d16] flex items-center justify-between shadow-sm"
                >
                  <OttStreamingBadge platform={p.id} size="lg" />
                  <div className="text-right">
                    <span className="text-[10px] uppercase font-mono font-bold text-[#c76e3c] block">
                      {p.quality || '4K Ultra HD'}
                    </span>
                    <span className="text-[11px] text-[#5e4133] capitalize">{p.type}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-5 rounded-3xl bg-[#fbe0b7] border border-[#d9c7b8] text-[#2b1d16] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-md">
              <div>
                <span className="font-bold text-[#2b1d16] block">
                  Looking for other countries or physical media?
                </span>
                <span className="text-[#5e4133] text-[11px]">
                  Check global schedules on JustWatch and Google Movies.
                </span>
              </div>
              <a
                href={`https://www.google.com/search?q=${encodeURIComponent(`where to watch ${item.title}`)}`}
                target="_blank"
                rel="noreferrer"
                className="px-5 py-2.5 rounded-2xl bg-[#2b1d16] text-[#fdf8f3] hover:bg-[#3d2a21] font-bold flex items-center gap-1.5 transition-colors cursor-pointer w-fit"
              >
                <span>Search Global Providers</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        )}

        {/* TAB 6: MORE LIKE THIS */}
        {activeTab === 'similar' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-black uppercase text-[#f5a77b] font-mono">
                More Like {item.title}
              </h3>
              <p className="text-xs text-[#e8d7cb]">
                Recommendations sharing similar genres, tone, and direction
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {(item.similar && item.similar.length > 0
                ? item.similar
                : items.filter((i) => i.id !== item.id).slice(0, 6)
              ).map((sim) => (
                <div
                  key={sim.id}
                  onClick={() => {
                    setSelectedMedia(sim as MediaItem);
                  }}
                  className="group cursor-pointer rounded-2xl overflow-hidden bg-[#fbe0b7] border border-[#d9c7b8] text-[#2b1d16] hover:border-[#ea9160] transition-all hover:-translate-y-1 shadow-md"
                >
                  <div className="aspect-[2/3] overflow-hidden relative">
                    <MediaPoster
                      src={sim.poster}
                      alt={sim.title}
                      type={sim.type}
                      genres={sim.genres}
                      title={sim.title}
                      year={sim.year}
                      aspectRatio="portrait"
                      stickerSize={40}
                    />
                  </div>
                  <div className="p-3">
                    <h4 className="text-xs font-bold text-[#2b1d16] group-hover:text-[#c76e3c] truncate">
                      {sim.title}
                    </h4>
                    <div className="flex items-center justify-between text-[10px] text-[#5e4133] mt-1">
                      <span>{sim.year}</span>
                      <span className="flex items-center gap-0.5 text-[#c76e3c] font-bold">
                        <Star className="w-2.5 h-2.5 fill-[#c76e3c]" />
                        {sim.rating}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Modal Bottom Sticky Bar */}
      <div className="shrink-0 bg-[#34231b] dark:bg-[#180f0b] border-t border-[#5a4135] dark:border-[#38261e] py-4">
        <div className="max-w-7xl mx-auto w-full px-4 sm:px-8 flex items-center justify-between text-xs">
          <div className="flex items-center gap-3">
            {isInCollection && (
              isConfirmingRemove ? (
                <div className="flex items-center gap-2 animate-in fade-in">
                  <button
                    onClick={() => {
                      removeItem(item.id);
                      setSelectedMedia(null);
                    }}
                    className="px-2.5 py-1 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs active:scale-95"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Confirm Remove?</span>
                  </button>
                  <button
                    onClick={() => setIsConfirmingRemove(false)}
                    className="text-xs text-[#e8d7cb] hover:text-white cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsConfirmingRemove(true)}
                  className="text-rose-400 hover:underline flex items-center gap-1.5 transition-colors cursor-pointer font-semibold"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Remove from Collection</span>
                </button>
              )
            )}
          </div>

          <button
            onClick={() => setSelectedMedia(null)}
            className="px-6 py-2.5 rounded-full bg-white hover:bg-neutral-100 text-black font-extrabold text-xs transition-colors cursor-pointer shadow-md active:scale-95"
          >
            Close Preview
          </button>
        </div>
      </div>
    </div>
  );
};
