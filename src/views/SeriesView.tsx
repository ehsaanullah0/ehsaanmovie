import React, { useState } from 'react';
import { Tv, Plus, Check, ArrowRight, CheckSquare, Square } from 'lucide-react';
import { useCollection } from '../context/CollectionContext';
import { MediaPoster } from '../components/MediaPoster';
import { RetroTVSticker } from '../components/stickers/Stickers';
import { CatalogFilterBar } from '../components/CatalogFilterBar';
import { filterAndSortMediaItems } from '../utils/filterUtils';

export const SeriesView: React.FC = () => {
  const {
    items,
    setIsSearchOpen,
    setSelectedMedia,
    updateItemStatus,
    setProgressModalItem,
    toggleEpisodeWatched,
    isBatchSelectEnabled,
    deleteMultipleItems,
  } = useCollection();

  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedGenre, setSelectedGenre] = useState<string>('all');
  const [selectedCountry, setSelectedCountry] = useState<string>('all');
  const [selectedRating, setSelectedRating] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<string>('added');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const seriesItems = items.filter((i) => i.type === 'series');

  const filteredSeries = filterAndSortMediaItems(seriesItems, {
    query: searchQuery,
    genre: selectedGenre,
    country: selectedCountry,
    rating: selectedRating,
    sortBy,
    status: statusFilter,
  });

  const toggleSelect = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  return (
    <div className="space-y-6 pb-20 animate-in fade-in duration-200 relative">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#71717a] dark:text-[#caa282]">
            <Tv className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Television Series</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-[#09090b] dark:text-[#faf6f2] mt-1">
            Series
          </h1>
          <p className="text-xs sm:text-sm text-[#71717a] dark:text-[#baa698] mt-0.5">
            {seriesItems.length} television shows with episode and season tracking
          </p>
        </div>

        <button
          onClick={() => setIsSearchOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-[#09090b] dark:bg-[#faf6f2] hover:bg-[#27272a] text-white dark:text-[#231814] text-xs font-bold flex items-center gap-2 transition-all cursor-pointer self-start sm:self-auto shadow-sm active:scale-95"
        >
          <Plus className="w-4 h-4 stroke-[2.8]" />
          <span>Add Series</span>
        </button>
      </div>

      {/* Consistent Catalog Filter Bar */}
      <CatalogFilterBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedGenre={selectedGenre}
        setSelectedGenre={setSelectedGenre}
        selectedCountry={selectedCountry}
        setSelectedCountry={setSelectedCountry}
        selectedRating={selectedRating}
        setSelectedRating={setSelectedRating}
        sortBy={sortBy}
        setSortBy={setSortBy}
        selectedStatus={statusFilter}
        setSelectedStatus={setStatusFilter}
        showStatusFilter={true}
        totalCount={seriesItems.length}
        filteredCount={filteredSeries.length}
      />

      {filteredSeries.length === 0 ? (
        <div className="p-12 sm:p-16 rounded-3xl bg-white dark:bg-[#221814] border border-[#e4e4e7] dark:border-[#382820] text-center space-y-4 max-w-lg mx-auto my-8 shadow-xs">
          <div className="flex justify-center">
            <RetroTVSticker size={80} />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-[#09090b] dark:text-[#faf6f2]">No series found</h3>
            <p className="text-xs text-[#71717a] dark:text-[#baa698]">Search and track TV shows and miniseries.</p>
          </div>
          <button
            onClick={() => setIsSearchOpen(true)}
            className="px-5 py-2.5 rounded-xl bg-[#09090b] dark:bg-[#faf6f2] text-white dark:text-[#231814] text-xs font-bold hover:bg-[#27272a] transition-colors cursor-pointer shadow-sm"
          >
            Search Series
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-5">
          {filteredSeries.map((series) => {
            const progress = series.progressPercentage || 0;
            const isSelected = selectedIds.includes(series.id);
            return (
              <div
                key={series.id}
                onClick={() => setSelectedMedia(series)}
                className={`group flex flex-col cursor-pointer transition-transform duration-200 hover:-translate-y-1 relative ${
                  isSelected ? 'ring-2 ring-rose-600 rounded-2xl p-1 bg-rose-500/5' : ''
                }`}
              >
                {/* Poster Container */}
                <div className="w-full aspect-[2/3] rounded-2xl overflow-hidden mb-2 relative shadow-md group-hover:shadow-xl transition-all border border-black/10 dark:border-white/10">
                  <MediaPoster
                    src={series.poster}
                    alt={series.title}
                    type="series"
                    genres={series.genres}
                    title={series.title}
                    year={series.year}
                    aspectRatio="portrait"
                    stickerSize={48}
                  />

                  {/* Batch Selection Checkbox */}
                  {isBatchSelectEnabled ? (
                    <button
                      onClick={(e) => toggleSelect(series.id, e)}
                      className={`absolute top-2.5 left-2.5 z-20 p-1.5 rounded-lg backdrop-blur-md transition-colors cursor-pointer border ${
                        isSelected
                          ? 'bg-rose-600 text-white border-rose-500'
                          : 'bg-black/60 text-white border-white/20 hover:bg-black/80'
                      }`}
                    >
                      {isSelected ? <CheckSquare className="w-4 h-4" /> : <Square className="w-4 h-4" />}
                    </button>
                  ) : (
                    /* Top Left: Add / Toggle Watchlist (+) Button on hover */
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        updateItemStatus(series.id, 'watchlist');
                      }}
                      title="Add to Watchlist"
                      className="absolute top-2.5 left-2.5 z-20 w-8 h-8 rounded-full bg-black/70 hover:bg-black/95 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 cursor-pointer border border-white/25 shadow-lg active:scale-90 hover:scale-110 backdrop-blur-md"
                    >
                      <Plus className="w-4 h-4 stroke-[3]" />
                    </button>
                  )}

                  {/* Progress Line on bottom of poster if series is in progress */}
                  {progress > 0 && (
                    <div className="absolute inset-x-0 bottom-0 bg-black/60 backdrop-blur-xs h-1.5 overflow-hidden">
                      <div
                        className="bg-amber-500 h-full transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  )}
                </div>

                {/* Typography directly underneath matching reference image */}
                <div className="px-0.5 space-y-0.5">
                  <h4 className="text-xs sm:text-[13px] font-semibold text-[#09090b] dark:text-[#faf6f2] group-hover:text-amber-500 transition-colors truncate leading-tight">
                    {series.title}
                  </h4>
                  <div className="flex items-center gap-1.5 text-[11px] sm:text-xs text-[#71717a] dark:text-[#a1a1aa] font-medium font-mono">
                    <span>{series.year}</span>
                    <span>·</span>
                    <span>TV</span>
                    {series.rating && (
                      <>
                        <span>·</span>
                        <span className="text-[#71717a] dark:text-[#a1a1aa] font-medium">
                          ★ {series.rating.toFixed(1)}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Floating Batch Action Bar */}
      {isBatchSelectEnabled && selectedIds.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-[#09090b] text-white dark:bg-[#faf6f2] dark:text-[#231814] px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-4 animate-in slide-in-from-bottom-4 duration-200 border border-white/20">
          <span className="text-xs font-bold">{selectedIds.length} item{selectedIds.length > 1 ? 's' : ''} selected</span>
          <button
            onClick={() => {
              deleteMultipleItems(selectedIds);
              setSelectedIds([]);
            }}
            className="px-4 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-colors cursor-pointer"
          >
            Delete Selected
          </button>
          <button
            onClick={() => setSelectedIds([])}
            className="text-xs opacity-75 hover:opacity-100 underline cursor-pointer"
          >
            Clear
          </button>
        </div>
      )}
    </div>
  );
};
