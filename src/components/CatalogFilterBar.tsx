import React, { useState } from 'react';
import { Filter, Search, RotateCcw, X, Check } from 'lucide-react';
import { WatchStatus, MediaType } from '../types';
import { GenreBadge } from './GenreBadge';

export interface CatalogFilterOptions {
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  selectedGenre: string;
  setSelectedGenre: (val: string) => void;
  selectedCountry: string;
  setSelectedCountry: (val: string) => void;
  selectedRating: string;
  setSelectedRating: (val: string) => void;
  sortBy: string;
  setSortBy: (val: string) => void;
  selectedType?: string;
  setSelectedType?: (val: string) => void;
  selectedStatus?: string;
  setSelectedStatus?: (val: string) => void;
  showTypeFilter?: boolean;
  showStatusFilter?: boolean;
  totalCount: number;
  filteredCount: number;
  extraControls?: React.ReactNode;
}

export const GENRE_OPTIONS = [
  'all',
  'action',
  'adventure',
  'animation',
  'comedy',
  'crime',
  'documentary',
  'drama',
  'fantasy',
  'horror',
  'mystery',
  'romance',
  'sci-fi',
  'thriller',
];

export const COUNTRY_OPTIONS = [
  { value: 'all', label: 'All Regions (Global)' },
  { value: 'us', label: 'United States (US / Hollywood)' },
  { value: 'uk', label: 'United Kingdom (UK / British)' },
  { value: 'korea', label: 'Korea (K-Drama / Korean)' },
  { value: 'japan', label: 'Japan (Anime / J-Cinema)' },
  { value: 'france', label: 'France / European' },
  { value: 'india', label: 'India (Bollywood / Indian)' },
];

export const RATING_OPTIONS = [
  { value: 'all', label: 'All Ratings' },
  { value: '8.5', label: '8.5+ ⭐ Exceptional' },
  { value: '8.0', label: '8.0+ ⭐ Great' },
  { value: '7.5', label: '7.5+ ⭐ Very Good' },
  { value: '7.0', label: '7.0+ ⭐ Good' },
];

export const CatalogFilterBar: React.FC<CatalogFilterOptions> = ({
  searchQuery,
  setSearchQuery,
  selectedGenre,
  setSelectedGenre,
  selectedCountry,
  setSelectedCountry,
  selectedRating,
  setSelectedRating,
  sortBy,
  setSortBy,
  selectedType = 'all',
  setSelectedType,
  selectedStatus = 'all',
  setSelectedStatus,
  showTypeFilter = false,
  showStatusFilter = false,
  totalCount,
  filteredCount,
  extraControls,
}) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Check how many filters are actively applied
  const activeFiltersCount =
    (selectedGenre !== 'all' ? 1 : 0) +
    (selectedCountry !== 'all' ? 1 : 0) +
    (selectedRating !== 'all' ? 1 : 0) +
    (showTypeFilter && selectedType !== 'all' ? 1 : 0) +
    (showStatusFilter && selectedStatus !== 'all' ? 1 : 0) +
    (searchQuery.trim().length > 0 ? 1 : 0);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedGenre('all');
    setSelectedCountry('all');
    setSelectedRating('all');
    if (setSelectedType) setSelectedType('all');
    if (setSelectedStatus) setSelectedStatus('all');
    setSortBy('added');
  };

  return (
    <div className="space-y-3 w-full">
      {/* Search Input Bar + Filter Trigger Button + Quick Sort */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Quick Search in View */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-[#71717a] dark:text-[#a89284] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by title, director, or tags..."
            className="w-full pl-10 pr-9 py-2 rounded-2xl bg-white dark:bg-[#1e1511] border-2 border-white dark:border-white text-xs font-bold text-[#09090b] dark:text-[#faf6f2] placeholder-[#a1a1aa] dark:placeholder-[#a89284] focus:outline-none transition-all shadow-md"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#71717a] hover:text-[#09090b] dark:hover:text-white p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Action Controls: Filter Toggle, Watched Button, Extra Controls */}
        <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap justify-between sm:justify-end">
          {/* Filter Toggle Button */}
          <button
            onClick={() => setIsDrawerOpen((prev) => !prev)}
            className="px-4 py-2 rounded-full border-2 border-black dark:border-black text-xs font-extrabold flex items-center gap-2 transition-all cursor-pointer shadow-md bg-[#caa282] text-[#231814] hover:bg-[#d8b598]"
          >
            <Filter className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Filters</span>
            {activeFiltersCount > 0 ? (
              <span className="w-5 h-5 rounded-full text-[10px] font-black flex items-center justify-center bg-[#231814] text-[#caa282]">
                {activeFiltersCount}
              </span>
            ) : (
              <span className="w-2 h-2 rounded-full bg-black" />
            )}
          </button>

          {/* Watched Button in place of Recently Added */}
          {setSelectedStatus && (
            <button
              onClick={() => {
                if (selectedStatus === 'watched') {
                  setSelectedStatus('all');
                } else {
                  setSelectedStatus('watched');
                }
              }}
              className={`px-3.5 py-2 rounded-2xl border text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs ${
                selectedStatus === 'watched'
                  ? 'bg-[#caa282] text-[#231814] border-[#caa282] shadow-sm'
                  : 'bg-white dark:bg-[#1e1511] text-[#09090b] dark:text-[#faf6f2] border-[#e4e4e7] dark:border-[#382820] hover:bg-[#f4f4f5] dark:hover:bg-[#281c16]'
              }`}
            >
              <Check className="w-3.5 h-3.5 stroke-[3]" />
              <span>Watched</span>
            </button>
          )}

          {/* Optional Extra Controls (e.g. View Mode toggle or Batch select) */}
          {extraControls}
        </div>
      </div>

      {/* Expandable Filter Drawer Panel (matching Recommendation page) */}
      {isDrawerOpen && (
        <div className="p-4 sm:p-5 rounded-2xl bg-[#fdf8f3] dark:bg-[#251b16] border border-[#e4e4e7] dark:border-[#422e23] space-y-4 animate-in fade-in duration-150 shadow-sm">
          <div className="flex items-center justify-between border-b border-[#e4e4e7] dark:border-[#382820] pb-2.5">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-amber-600 dark:text-[#ea9160]" />
              <span className="text-xs font-extrabold text-[#09090b] dark:text-[#faf6f2] uppercase tracking-wider">
                Filter &amp; Refine Titles
              </span>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-[11px] text-[#71717a] dark:text-[#baa698] font-mono">
                Showing {filteredCount} of {totalCount} items
              </span>

              {activeFiltersCount > 0 && (
                <button
                  onClick={handleResetFilters}
                  className="text-xs font-bold text-amber-600 dark:text-[#f0a277] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset All</span>
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
            {/* Sort By selector (Recently Added shifted into filter section) */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-[#71717a] dark:text-[#baa698]">
                Sort By
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-[#f8f9fa] dark:bg-[#1a120e] border border-[#e4e4e7] dark:border-[#422e23] text-xs font-bold text-[#09090b] dark:text-[#faf6f2] cursor-pointer"
              >
                <option value="added">Recently Added</option>
                <option value="rating">Highest Rating</option>
                <option value="year">Release Year</option>
                <option value="title">Title (A - Z)</option>
              </select>
            </div>
            {/* 1. Format / Type filter (if enabled) */}
            {showTypeFilter && setSelectedType && (
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-[#71717a] dark:text-[#baa698]">
                  Type / Format
                </label>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-[#f8f9fa] dark:bg-[#1a120e] border border-[#e4e4e7] dark:border-[#422e23] text-xs font-bold text-[#09090b] dark:text-[#faf6f2] cursor-pointer"
                >
                  <option value="all">All Formats (Movies &amp; Series)</option>
                  <option value="movie">Movies Only</option>
                  <option value="series">Series / TV Shows</option>
                  <option value="anime">Anime / Animation</option>
                </select>
              </div>
            )}

            {/* 1b. Watch Status filter (if enabled) */}
            {showStatusFilter && setSelectedStatus && (
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-[#71717a] dark:text-[#baa698]">
                  Watch Status
                </label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-[#f8f9fa] dark:bg-[#1a120e] border border-[#e4e4e7] dark:border-[#422e23] text-xs font-bold text-[#09090b] dark:text-[#faf6f2] cursor-pointer"
                >
                  <option value="all">All Statuses</option>
                  <option value="watchlist">In Watchlist</option>
                  <option value="watching">Currently Watching</option>
                  <option value="watched">Watched / Completed</option>
                  <option value="favorites">★ Favorites Only</option>
                </select>
              </div>
            )}

            {/* 2. Genre filter */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-bold uppercase tracking-wider text-[#71717a] dark:text-[#baa698]">
                  Genre
                </label>
                {selectedGenre !== 'all' && (
                  <GenreBadge genre={selectedGenre.charAt(0).toUpperCase() + selectedGenre.slice(1)} size="xs" />
                )}
              </div>
              <select
                value={selectedGenre}
                onChange={(e) => setSelectedGenre(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-[#f8f9fa] dark:bg-[#1a120e] border border-[#e4e4e7] dark:border-[#422e23] text-xs font-bold text-[#09090b] dark:text-[#faf6f2] cursor-pointer"
              >
                {GENRE_OPTIONS.map((g) => (
                  <option key={g} value={g}>
                    {g === 'all' ? 'All Genres' : g.charAt(0).toUpperCase() + g.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* 3. Country / Region filter */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-[#71717a] dark:text-[#baa698]">
                Country / Region
              </label>
              <select
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-[#f8f9fa] dark:bg-[#1a120e] border border-[#e4e4e7] dark:border-[#422e23] text-xs font-bold text-[#09090b] dark:text-[#faf6f2] cursor-pointer"
              >
                {COUNTRY_OPTIONS.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>

            {/* 4. Minimum Rating Score */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-[#71717a] dark:text-[#baa698]">
                Minimum Rating Score
              </label>
              <select
                value={selectedRating}
                onChange={(e) => setSelectedRating(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-[#f8f9fa] dark:bg-[#1a120e] border border-[#e4e4e7] dark:border-[#422e23] text-xs font-bold text-[#09090b] dark:text-[#faf6f2] cursor-pointer"
              >
                {RATING_OPTIONS.map((r) => (
                  <option key={r.value} value={r.value}>
                    {r.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
