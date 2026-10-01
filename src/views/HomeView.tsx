import React, { useState, useEffect, useRef } from 'react';
import {
  Plus,
  Play,
  Clock,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Filter,
  Star,
  Info,
  RotateCw,
  Shuffle,
  Dices,
  X,
} from 'lucide-react';
import { useCollection } from '../context/CollectionContext';
import { MediaPoster } from '../components/MediaPoster';
import { MediaItem } from '../types';
import { fetchExploreDiscoveryPool, fetchTop10 } from '../services/movieApi';

export const HomeView: React.FC = () => {
  const {
    items,
    setSelectedMedia,
    addItem,
    updateItemStatus,
  } = useCollection();

  const [exploreItems, setExploreItems] = useState<MediaItem[]>([]);
  const [top10Items, setTop10Items] = useState<MediaItem[]>([]);
  const [isLoadingExplore, setIsLoadingExplore] = useState(true);

  // Anti-repetition tracking: keeps recent shown/picked IDs so randomize doesn't repeat after 2-3 clicks
  const recentRandomTopIdsRef = useRef<string[]>([]);
  const recentPickedRecommendationIdsRef = useRef<string[]>([]);

  // Fetch rich pool of movies and TV series across popular & top-rated TMDB categories
  const loadExplorePool = async (forceRefresh = false) => {
    setIsLoadingExplore(true);
    try {
      const [pool, top10] = await Promise.all([
        fetchExploreDiscoveryPool(forceRefresh),
        fetchTop10(),
      ]);
      if (pool && pool.length > 0) {
        setExploreItems(pool);
        if (forceRefresh) {
          recentRandomTopIdsRef.current = [];
          setCurrentPage(1);
        }
        try {
          localStorage.setItem('ehsaan_explore_pool_cache', JSON.stringify(pool.slice(0, 100)));
        } catch {
          // ignore quota error
        }
      } else {
        const cached = localStorage.getItem('ehsaan_explore_pool_cache');
        if (cached) setExploreItems(JSON.parse(cached));
      }
      if (top10 && top10.length > 0) {
        setTop10Items(top10);
      }
    } catch (err) {
      console.warn('Failed to load explore pool, checking offline local copy:', err);
      const cached = localStorage.getItem('ehsaan_explore_pool_cache');
      if (cached) {
        try {
          setExploreItems(JSON.parse(cached));
        } catch {
          // fallback to initial
        }
      }
    } finally {
      setIsLoadingExplore(false);
    }
  };

  const handleRandomizeRecommendations = () => {
    if (exploreItems.length === 0) return;
    
    // Anti-repetition: partition items not recently in the top view
    const recentSet = new Set(recentRandomTopIdsRef.current);
    const unshown = exploreItems.filter((item) => !recentSet.has(item.id));
    const poolToShuffle = unshown.length >= 30 ? unshown : exploreItems;

    // Fisher-Yates shuffle
    const shuffled = [...poolToShuffle];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    // Remainder items appended behind so front 30 are completely fresh
    const remainder = exploreItems.filter((item) => !shuffled.some((s) => s.id === item.id));
    const newExplore = [...shuffled, ...remainder];

    // Record top 30 IDs into history
    const topIds = shuffled.slice(0, 30).map((i) => i.id);
    recentRandomTopIdsRef.current = [...topIds, ...recentRandomTopIdsRef.current].slice(0, 90);

    setExploreItems(newExplore);
    setCurrentPage(1);
  };

  const handlePickRandomRecommendation = () => {
    const available = filteredRecommendations;
    if (available.length === 0) return;

    // Anti-repetition: filter out recent picks
    const recentSet = new Set(recentPickedRecommendationIdsRef.current);
    const fresh = available.filter((i) => !recentSet.has(i.id));
    const targetPool = fresh.length > 0 ? fresh : available;
    const picked = targetPool[Math.floor(Math.random() * targetPool.length)];

    recentPickedRecommendationIdsRef.current = [picked.id, ...recentPickedRecommendationIdsRef.current].slice(0, 25);
    setSelectedMedia(picked);
  };

  useEffect(() => {
    loadExplorePool();
  }, []);

  // Full-bleed Hero Slideshow items (combines collection banners + popular discovery banners)
  const bannerItems = items.filter((i) => i.banner && i.banner.trim() !== '');
  const heroItems =
    bannerItems.length >= 4
      ? bannerItems.slice(0, 6)
      : [...bannerItems, ...exploreItems.filter((e) => e.banner && e.banner.trim() !== '')].slice(0, 6);

  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-advance slideshow every 6.5 seconds
  useEffect(() => {
    if (heroItems.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroItems.length);
    }, 6500);
    return () => clearInterval(interval);
  }, [heroItems.length]);

  const continueWatchingItems = items.filter((i) => i.status === 'watching');

  // Recommendation Filter states
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<string>('all');
  const [selectedGenreFilter, setSelectedGenreFilter] = useState<string>('all');
  const [selectedCountryFilter, setSelectedCountryFilter] = useState<string>('all');
  const [selectedRatingFilter, setSelectedRatingFilter] = useState<string>('all');

  // Pagination for Recommendations: Exactly 30 items per page
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 30;

  // Filter logic for explore items:
  // 1. AUTOMATICALLY REMOVE ANY MOVIE/SERIES ALREADY IN USER COLLECTION
  // 2. Apply active filters
  const filteredRecommendations = exploreItems.filter((exploreItem) => {
    const isAlreadyAdded = items.some(
      (saved) =>
        (saved.tmdbId && exploreItem.tmdbId && saved.tmdbId === exploreItem.tmdbId) ||
        saved.id === exploreItem.id ||
        saved.title.toLowerCase().trim() === exploreItem.title.toLowerCase().trim()
    );
    if (isAlreadyAdded) return false;

    // Type filter
    if (selectedTypeFilter !== 'all') {
      if (selectedTypeFilter === 'anime') {
        if (!exploreItem.genres.map((g) => g.toLowerCase()).includes('animation')) return false;
      } else if (exploreItem.type !== selectedTypeFilter) {
        return false;
      }
    }

    // Genre filter
    if (selectedGenreFilter !== 'all') {
      if (!exploreItem.genres.map((g) => g.toLowerCase()).includes(selectedGenreFilter.toLowerCase())) {
        return false;
      }
    }

    // Country filter
    if (selectedCountryFilter !== 'all') {
      const text = (
        exploreItem.description +
        ' ' +
        exploreItem.title +
        ' ' +
        (exploreItem.tags || []).join(' ')
      ).toLowerCase();
      if (!text.includes(selectedCountryFilter.toLowerCase())) {
        return false;
      }
    }

    // Rating filter
    if (selectedRatingFilter !== 'all') {
      const minRating = parseFloat(selectedRatingFilter);
      if (exploreItem.rating < minRating) return false;
    }

    return true;
  });

  const totalPages = Math.ceil(filteredRecommendations.length / itemsPerPage) || 1;

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(Math.max(1, totalPages));
    }
  }, [totalPages, currentPage]);

  const paginatedRecommendations = filteredRecommendations.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const activeSlideItem = heroItems[currentSlide] || heroItems[0];

  return (
    <div className="w-full pb-20 animate-in fade-in duration-200">
      {/* 1. Full-Bleed Borderless Hero Billboard Slideshow (No background card, no empty side gutters, crisp vivid artwork) */}
      {heroItems.length > 0 && activeSlideItem && (
        <section className="relative w-full min-h-[500px] sm:min-h-[540px] md:min-h-[620px] flex flex-col justify-end p-5 sm:p-12 lg:p-16 pb-14 sm:pb-12 text-white overflow-hidden select-none">
          {/* Edge-to-edge Background Banner Image with Crisp Saturation & Full Clarity */}
          <div className="absolute inset-0 z-0 bg-[#0e0907]">
            {heroItems.map((slide, idx) => (
              <img
                key={slide.id}
                src={slide.banner || slide.poster}
                alt={slide.title}
                referrerPolicy="no-referrer"
                className={`absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-700 ${
                  idx === currentSlide ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}
              />
            ))}

            {/* Clear, focused readability gradient only behind left text and bottom edge (no heavy washed/faded effect) */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/40 to-transparent z-10" />
            <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[var(--color-bg)] via-[var(--color-bg)]/30 to-transparent z-10" />
          </div>

          {/* Left Arrow Navigation Chevron (Hidden on Mobile View, visible on Tablet/Desktop) */}
          <button
            onClick={() => setCurrentSlide((prev) => (prev - 1 + heroItems.length) % heroItems.length)}
            aria-label="Previous Slide"
            className="hidden sm:flex absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full bg-black/40 hover:bg-black/70 backdrop-blur-xs text-white/80 hover:text-white transition-all cursor-pointer border border-white/15 active:scale-95 shadow-lg items-center justify-center"
          >
            <ChevronLeft className="w-6 h-6 stroke-[2.5]" />
          </button>

          {/* Right Arrow Navigation Chevron (Hidden on Mobile View, visible on Tablet/Desktop) */}
          <button
            onClick={() => setCurrentSlide((prev) => (prev + 1) % heroItems.length)}
            aria-label="Next Slide"
            className="hidden sm:flex absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full bg-black/40 hover:bg-black/70 backdrop-blur-xs text-white/80 hover:text-white transition-all cursor-pointer border border-white/15 active:scale-95 shadow-lg items-center justify-center"
          >
            <ChevronRight className="w-6 h-6 stroke-[2.5]" />
          </button>

          {/* Hero Content Container (Aligned Left exactly like image reference) */}
          <div className="relative z-20 max-w-2xl space-y-4">
            {/* Trending Kicker */}
            <div className="flex items-center gap-1.5 text-xs font-black tracking-widest text-[#ff5c5c] uppercase font-mono">
              <span className="text-sm">🔥</span>
              <span>TRENDING NOW</span>
            </div>

            {/* Massive Display Title (Enlarged on mobile for premium look) */}
            <h1 className="text-4xl xs:text-5xl sm:text-5xl lg:text-6xl font-black tracking-tight drop-shadow-md text-white text-balance leading-none sm:leading-tight">
              {activeSlideItem.title}
            </h1>

            {/* Metadata Badges Row */}
            <div className="flex items-center gap-2.5 text-xs sm:text-sm font-semibold flex-wrap">
              {/* Rating Pill */}
              <span className="px-2 py-0.5 rounded-md bg-black/50 backdrop-blur-md text-white/90 text-xs font-medium flex items-center gap-1 font-mono border border-white/15 shadow-xs">
                <Star className="w-3 h-3 fill-white/80 text-white/80" />
                <span>{activeSlideItem.rating}</span>
              </span>

              <span className="text-white/50 font-bold">·</span>

              {/* Media Type */}
              <span className="uppercase font-mono font-bold tracking-wider text-white text-xs">
                {activeSlideItem.type === 'series' ? 'TV SERIES' : 'MOVIE'}
              </span>

              {/* Quality Tag */}
              <span className="px-1.5 py-0.5 rounded bg-white/20 text-[10px] font-mono font-bold text-white uppercase border border-white/20">
                HD
              </span>
            </div>

            {/* Synopsis Excerpt */}
            <p className="text-xs sm:text-sm text-neutral-200/90 line-clamp-3 font-normal leading-relaxed max-w-xl">
              {activeSlideItem.description}
            </p>

            {/* Primary Action Buttons (with comfortable spacing above bubbles) */}
            <div className="flex flex-wrap items-center gap-3 pt-2 pb-5 sm:pb-0">
              {/* Watch Now Button: Moves to Watching List & Opens Preview */}
              <button
                onClick={() => {
                  const existing = items.find(
                    (i) => i.id === activeSlideItem.id || (i.tmdbId && i.tmdbId === activeSlideItem.tmdbId)
                  );
                  if (existing) {
                    updateItemStatus(existing.id, 'watching');
                    setSelectedMedia({ ...existing, status: 'watching' });
                  } else {
                    const added = addItem(activeSlideItem, 'watching');
                    setSelectedMedia(added || { ...activeSlideItem, status: 'watching' });
                  }
                }}
                className="px-6 py-2.5 rounded-lg bg-white hover:bg-neutral-200 text-black text-xs sm:text-sm font-black flex items-center gap-2 transition-transform active:scale-95 cursor-pointer shadow-lg"
              >
                <Play className="w-4 h-4 fill-black" />
                <span>Watch Now</span>
              </button>

              {/* More Info Button */}
              <button
                onClick={() => setSelectedMedia(activeSlideItem)}
                className="px-6 py-2.5 rounded-lg bg-white/20 hover:bg-white/30 backdrop-blur-md text-white text-xs sm:text-sm font-bold flex items-center gap-2 transition-colors cursor-pointer border border-white/20 shadow-md"
              >
                <Info className="w-4 h-4" />
                <span>More Info</span>
              </button>
            </div>
          </div>

          {/* Bottom Center Slideshow Pagination Dots */}
          <div className="absolute bottom-4 sm:bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-20">
            {heroItems.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                className={`transition-all duration-300 cursor-pointer ${
                  currentSlide === idx
                    ? 'w-6 h-1.5 rounded-full bg-white shadow-xs'
                    : 'w-1.5 h-1.5 rounded-full bg-white/40 hover:bg-white/70'
                }`}
              />
            ))}
          </div>
        </section>
      )}

      {/* Main Home Sections Container (with comfortable centered padding) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 pt-6 sm:pt-8">
        {/* 2. Continue Watching / In Progress Row */}
      {continueWatchingItems.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-extrabold text-[#09090b] dark:text-[#faf6f2] tracking-tight flex items-center gap-2">
              <Clock className="w-5 h-5 text-sky-500" />
              <span>Continue Watching</span>
              <span className="text-xs font-mono font-bold text-[#71717a] dark:text-[#baa698] bg-[#f4f4f5] dark:bg-[#31251f] px-2.5 py-0.5 rounded-full">
                {continueWatchingItems.length}
              </span>
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-5">
            {continueWatchingItems.map((item) => {
              const progress = item.progressPercentage || 0;
              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedMedia(item)}
                  className="group flex flex-col cursor-pointer transition-transform duration-200 hover:-translate-y-1 relative"
                >
                  <div className="w-full aspect-[2/3] rounded-2xl overflow-hidden mb-2 relative shadow-md group-hover:shadow-xl transition-all border border-black/10 dark:border-white/10">
                    {/* Top Left: Quick Status / Remove */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        updateItemStatus(item.id, 'watchlist');
                      }}
                      title="Move back to Watchlist"
                      className="absolute top-2.5 left-2.5 w-7 h-7 rounded-full bg-black/70 hover:bg-black/90 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all z-20 backdrop-blur-md cursor-pointer border border-white/20 shadow-md active:scale-90"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                    <MediaPoster
                      src={item.poster}
                      alt={item.title}
                      type={item.type}
                      genres={item.genres}
                      title={item.title}
                      year={item.year}
                      aspectRatio="portrait"
                      stickerSize={40}
                    />

                    {/* Progress Line on bottom of poster */}
                    <div className="absolute inset-x-0 bottom-0 bg-black/60 backdrop-blur-xs h-1.5 overflow-hidden">
                      <div
                        className="bg-amber-500 h-full transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>

                  <div className="px-0.5 space-y-0.5">
                    <h4 className="text-xs sm:text-[13px] font-semibold text-[#09090b] dark:text-[#faf6f2] group-hover:text-amber-500 transition-colors truncate leading-tight">
                      {item.title}
                    </h4>
                    <div className="flex items-center gap-1.5 text-[11px] text-[#71717a] dark:text-[#a1a1aa] font-medium font-mono">
                      <span>{item.year}</span>
                      <span>·</span>
                      <span className="uppercase">{item.type === 'series' ? 'TV' : 'Movie'}</span>
                      {item.rating && (
                        <>
                          <span>·</span>
                          <span className="text-[#71717a] dark:text-[#a1a1aa] font-medium">★ {item.rating}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Top 10 Today Section */}
      {top10Items.length > 0 && (
        <section className="space-y-4 pt-2">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-extrabold text-[#09090b] dark:text-[#faf6f2] tracking-tight flex items-center gap-2">
              <span className="w-1.5 h-5 bg-amber-500 rounded-full inline-block" />
              <span>Top 10 Today</span>
            </h2>
          </div>

          <div className="flex items-center gap-6 overflow-x-auto pb-4 pt-2 scrollbar-none">
            {top10Items.map((item, index) => (
              <div
                key={item.id}
                onClick={() => setSelectedMedia(item)}
                className="group relative flex items-center shrink-0 cursor-pointer pl-10 sm:pl-12"
              >
                {/* Giant Number (1, 2, 3...) */}
                <span className="absolute left-0 bottom-0 text-7xl sm:text-8xl font-black font-mono text-transparent [-webkit-text-stroke:2px_#d97706] transition-all select-none z-0">
                  {index + 1}
                </span>
                {/* Poster Card */}
                <div className="relative z-10 w-28 sm:w-32 aspect-[2/3] rounded-2xl overflow-hidden shadow-xl border border-black/10 dark:border-white/15 bg-black/40 group-hover:scale-105 transition-transform">
                  <MediaPoster
                    src={item.poster || item.banner}
                    alt={item.title}
                    type={item.type}
                    genres={item.genres}
                    title={item.title}
                    year={item.year}
                    aspectRatio="portrait"
                    stickerSize={36}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 3. Explore & Recommendations Section (30 Titles Per Page with Arrow Navigation) */}
      <section className="space-y-6 pt-4 border-t border-[#e4e4e7] dark:border-[#3b2b22]">
        {/* Header & Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div>
              <h2 className="text-xl font-extrabold text-[#09090b] dark:text-[#faf6f2] tracking-tight flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-500" />
                <span>Explore World Cinema &amp; Series</span>
              </h2>
              <p className="text-xs text-[#71717a] dark:text-[#baa698] mt-0.5">
                Discover acclaimed movies and shows. Saved titles automatically vanish from exploration ({filteredRecommendations.length} available).
              </p>
            </div>

            <div className="flex items-center gap-1.5">
              {/* Reload Button */}
              <button
                onClick={() => loadExplorePool(true)}
                disabled={isLoadingExplore}
                title="Reload fresh discovery pool"
                className="p-2.5 rounded-full bg-white hover:bg-[#f4f4f5] dark:bg-[#2a1d17] dark:hover:bg-[#382820] text-[#09090b] dark:text-[#faf6f2] transition-all cursor-pointer shadow-xs border border-[#e4e4e7] dark:border-[#382820] active:scale-95 disabled:opacity-50"
              >
                <RotateCw className={`w-4 h-4 ${isLoadingExplore ? 'animate-spin' : ''}`} />
              </button>

              {/* Randomize Button */}
              <button
                onClick={handleRandomizeRecommendations}
                disabled={isLoadingExplore || exploreItems.length === 0}
                title="Shuffle recommendation order with fresh variety (guaranteed no quick repeats)"
                className="px-3 sm:px-3.5 py-2 rounded-full bg-white hover:bg-[#f4f4f5] dark:bg-[#2a1d17] dark:hover:bg-[#382820] text-[#09090b] dark:text-[#faf6f2] transition-all cursor-pointer shadow-xs border border-[#e4e4e7] dark:border-[#382820] flex items-center gap-1.5 text-xs font-bold active:scale-95"
              >
                <Shuffle className="w-3.5 h-3.5 text-amber-500" />
                <span>Shuffle</span>
              </button>

              {/* Surprise Me / Pick Random Title */}
              <button
                onClick={handlePickRandomRecommendation}
                disabled={filteredRecommendations.length === 0}
                title="Pick one recommended title and view its details (anti-repetition)"
                className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-full bg-[#f4f4f5] hover:bg-[#e4e4e7] dark:bg-[#2c1d16] dark:hover:bg-[#38241b] text-[#09090b] dark:text-[#f0a277] transition-all cursor-pointer shadow-xs border border-[#e4e4e7] dark:border-[#4d3224] text-xs font-bold active:scale-95"
              >
                <Dices className="w-3.5 h-3.5 text-amber-500" />
                <span>Pick</span>
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3 self-start sm:self-auto">
            {/* Filter Toggle Button */}
            <button
              onClick={() => setIsFilterOpen((prev) => !prev)}
              className="px-4 py-2.5 rounded-full bg-white text-[#09090b] border border-[#e4e4e7] dark:bg-[#2c1d16] dark:border-[#4d3224] dark:text-[#f0a277] hover:bg-[#f4f4f5] dark:hover:bg-[#38241b] text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-xs"
            >
              <Filter className="w-4 h-4 stroke-[2.5]" />
              <span>Filters</span>
              {(selectedTypeFilter !== 'all' ||
                selectedGenreFilter !== 'all' ||
                selectedCountryFilter !== 'all' ||
                selectedRatingFilter !== 'all') && (
                <span className="w-2 h-2 rounded-full bg-[#ea580c] dark:bg-[#f0a277]" />
              )}
            </button>

            {/* Quick Arrow Navigation in Header */}
            {totalPages > 1 && (
              <div className="flex items-center gap-1.5 bg-white dark:bg-[#241a15] p-1 rounded-full border border-[#e4e4e7] dark:border-[#382820]">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  title="Previous page"
                  className="p-1.5 rounded-full hover:bg-[#f4f4f5] dark:hover:bg-[#382820] disabled:opacity-30 transition-colors cursor-pointer text-[#09090b] dark:text-white"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-xs font-mono font-bold px-2 text-[#71717a] dark:text-[#baa698]">
                  {currentPage}/{totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  title="Next page"
                  className="p-1.5 rounded-full hover:bg-[#f4f4f5] dark:hover:bg-[#382820] disabled:opacity-30 transition-colors cursor-pointer text-[#09090b] dark:text-white"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Filter Drawer / Panel */}
        {isFilterOpen && (
          <div className="p-5 rounded-2xl bg-white dark:bg-[#251b16] border border-[#e4e4e7] dark:border-[#422e23] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-in fade-in duration-200 shadow-sm">
            {/* 1. Type filter */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-[#71717a] dark:text-[#baa698]">
                Type / Format
              </label>
              <select
                value={selectedTypeFilter}
                onChange={(e) => {
                  setSelectedTypeFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full p-2.5 rounded-xl bg-[#f4f4f5] dark:bg-[#1a120e] border border-[#e4e4e7] dark:border-[#422e23] text-xs font-bold text-[#09090b] dark:text-[#faf6f2] cursor-pointer"
              >
                <option value="all">All Types (Movie / Series)</option>
                <option value="movie">Movies Only</option>
                <option value="series">Series / TV Only</option>
                <option value="anime">Anime / Animation</option>
              </select>
            </div>

            {/* 2. Genre filter */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-[#71717a] dark:text-[#baa698]">
                Genre
              </label>
              <select
                value={selectedGenreFilter}
                onChange={(e) => {
                  setSelectedGenreFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full p-2.5 rounded-xl bg-[#f4f4f5] dark:bg-[#1a120e] border border-[#e4e4e7] dark:border-[#422e23] text-xs font-bold text-[#09090b] dark:text-[#faf6f2] cursor-pointer"
              >
                <option value="all">All Genres</option>
                <option value="crime">Crime</option>
                <option value="thriller">Thriller</option>
                <option value="comedy">Comedy</option>
                <option value="action">Action</option>
                <option value="horror">Horror</option>
                <option value="drama">Drama</option>
                <option value="sci-fi">Sci-Fi &amp; Fantasy</option>
                <option value="mystery">Mystery</option>
              </select>
            </div>

            {/* 3. Country / Region filter */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-[#71717a] dark:text-[#baa698]">
                Country / Region
              </label>
              <select
                value={selectedCountryFilter}
                onChange={(e) => {
                  setSelectedCountryFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full p-2.5 rounded-xl bg-[#f4f4f5] dark:bg-[#1a120e] border border-[#e4e4e7] dark:border-[#422e23] text-xs font-bold text-[#09090b] dark:text-[#faf6f2] cursor-pointer"
              >
                <option value="all">All Regions (Global, US, UK, Korea, etc.)</option>
                <option value="us">United States (US)</option>
                <option value="korea">Korea</option>
                <option value="uk">United Kingdom</option>
                <option value="japan">Japan</option>
                <option value="france">France / Europe</option>
              </select>
            </div>

            {/* 4. Rating filter */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-[#71717a] dark:text-[#baa698]">
                Minimum Rating Score
              </label>
              <select
                value={selectedRatingFilter}
                onChange={(e) => {
                  setSelectedRatingFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full p-2.5 rounded-xl bg-[#f4f4f5] dark:bg-[#1a120e] border border-[#e4e4e7] dark:border-[#422e23] text-xs font-bold text-[#09090b] dark:text-[#faf6f2] cursor-pointer"
              >
                <option value="all">All Ratings</option>
                <option value="8.5">8.5+ ⭐ Exceptional</option>
                <option value="8.0">8.0+ ⭐ Great</option>
                <option value="7.5">7.5+ ⭐ Very Good</option>
                <option value="7.0">7.0+ ⭐ Good</option>
              </select>
            </div>
          </div>
        )}

        {/* Explore Grid: Exactly 30 Items per page */}
        {paginatedRecommendations.length === 0 ? (
          <div className="p-12 rounded-3xl bg-white dark:bg-[#221814] text-center space-y-4 border border-[#e4e4e7] dark:border-[#382820] shadow-sm">
            <Sparkles className="w-8 h-8 text-amber-500 mx-auto opacity-70" />
            <h3 className="text-base font-bold text-[#09090b] dark:text-[#faf6f2]">
              All available titles in this filter are already added or none match.
            </h3>
            <p className="text-xs text-[#71717a] dark:text-[#baa698] max-w-md mx-auto">
              Try adjusting your filter preferences or refresh the discovery pool to explore fresh releases.
            </p>
            <button
              onClick={() => {
                setSelectedTypeFilter('all');
                setSelectedGenreFilter('all');
                setSelectedCountryFilter('all');
                setSelectedRatingFilter('all');
                setCurrentPage(1);
              }}
              className="px-5 py-2.5 rounded-full text-xs font-extrabold bg-[#09090b] text-white dark:bg-[#faf6f2] dark:text-[#231814] cursor-pointer hover:opacity-90 transition-opacity shadow-sm"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-5">
            {paginatedRecommendations.map((exploreItem) => (
              <div
                key={exploreItem.id}
                onClick={() => setSelectedMedia(exploreItem)}
                className="group flex flex-col cursor-pointer transition-transform duration-200 hover:-translate-y-1 relative"
              >
                {/* Poster Container */}
                <div className="w-full aspect-[2/3] rounded-2xl overflow-hidden mb-2 relative shadow-md group-hover:shadow-xl transition-all border border-black/10 dark:border-white/10">
                  <MediaPoster
                    src={exploreItem.poster}
                    alt={exploreItem.title}
                    type={exploreItem.type}
                    genres={exploreItem.genres}
                    title={exploreItem.title}
                    year={exploreItem.year}
                    aspectRatio="portrait"
                    stickerSize={48}
                  />

                  {/* Top Left: Add to Watchlist (+) button appearing on hover */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      addItem(exploreItem, 'watchlist');
                    }}
                    title="Add to Watchlist"
                    className="absolute top-2.5 left-2.5 z-20 w-8 h-8 rounded-full bg-black/70 hover:bg-black/95 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 cursor-pointer border border-white/25 shadow-lg active:scale-90 hover:scale-110 backdrop-blur-md"
                  >
                    <Plus className="w-4 h-4 stroke-[3]" />
                  </button>
                </div>

                {/* Typography directly underneath matching reference image */}
                <div className="px-0.5 space-y-0.5">
                  <h4 className="text-xs sm:text-[13px] font-semibold text-[#09090b] dark:text-[#faf6f2] group-hover:text-amber-500 transition-colors truncate leading-tight">
                    {exploreItem.title}
                  </h4>
                  <div className="flex items-center gap-1.5 text-[11px] sm:text-xs text-[#71717a] dark:text-[#a1a1aa] font-medium font-mono">
                    <span>{exploreItem.year}</span>
                    <span>·</span>
                    <span className="uppercase">{exploreItem.type === 'series' ? 'TV' : 'Movie'}</span>
                    {exploreItem.rating && (
                      <>
                        <span>·</span>
                        <span className="text-[#71717a] dark:text-[#a1a1aa] font-medium">
                          ★ {exploreItem.rating}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Bottom Pagination Arrow Navigation */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-3 pt-6">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2.5 rounded-xl bg-white dark:bg-[#241a15] text-xs font-bold text-[#09090b] dark:text-[#faf6f2] hover:bg-[#f4f4f5] dark:hover:bg-[#382820] disabled:opacity-30 cursor-pointer flex items-center gap-1.5 border border-[#e4e4e7] dark:border-[#382820] transition-colors shadow-2xs"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>

            {/* Direct Page Selector Pills */}
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages) }).map((_, idx) => {
                let pageNum = idx + 1;
                if (totalPages > 5) {
                  if (currentPage > 3) {
                    pageNum = Math.min(currentPage - 2 + idx, totalPages - 4 + idx);
                  }
                }
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`w-8 h-8 rounded-xl text-xs font-mono font-bold transition-colors cursor-pointer ${
                      currentPage === pageNum
                        ? 'bg-[#09090b] text-white dark:bg-[#faf6f2] dark:text-[#231814]'
                        : 'bg-white text-[#09090b] hover:bg-[#f4f4f5] border border-[#e4e4e7] dark:border-transparent dark:bg-[#241a15] dark:text-neutral-300'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-4 py-2.5 rounded-xl bg-white dark:bg-[#241a15] text-xs font-bold text-[#09090b] dark:text-[#faf6f2] hover:bg-[#f4f4f5] dark:hover:bg-[#382820] disabled:opacity-30 cursor-pointer flex items-center gap-1.5 border border-[#e4e4e7] dark:border-[#382820] transition-colors shadow-2xs"
            >
              <span>Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </section>
      </div>
    </div>
  );
};
