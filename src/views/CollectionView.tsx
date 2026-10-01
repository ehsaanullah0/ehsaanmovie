import React, { useState, useRef } from 'react';
import {
  Layers,
  Search,
  Plus,
  Star,
  Film,
  Tv,
  Heart,
  Edit2,
  Trash2,
  CheckSquare,
  Square,
  Check,
  Shuffle,
  Bookmark,
  ArrowLeft,
} from 'lucide-react';
import { useCollection } from '../context/CollectionContext';
import { MediaPoster } from '../components/MediaPoster';
import { ClapperboardSticker } from '../components/stickers/Stickers';
import { WatchStatus, MediaType } from '../types';
import { CatalogFilterBar } from '../components/CatalogFilterBar';
import { filterAndSortMediaItems } from '../utils/filterUtils';

export const CollectionView: React.FC = () => {
  const {
    items,
    customLists,
    activeListId,
    setActiveListId,
    setIsListModalOpen,
    setEditingList,
    deleteCustomList,
    toggleItemInList,
    setIsSearchOpen,
    setSelectedMedia,
    isBatchSelectEnabled,
    selectedItems,
    setSelectedItems,
    deleteMultipleItems,
    setActiveView,
  } = useCollection();

  const [isConfirmingDeleteList, setIsConfirmingDeleteList] = useState(false);
  const [isConfirmingBatchDelete, setIsConfirmingBatchDelete] = useState(false);

  const handleSelectAll = () => {
    if (selectedItems.size === filteredItems.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(filteredItems.map((item) => item.id)));
    }
  };

  const handleDeleteSelected = () => {
    if (selectedItems.size > 0) {
      deleteMultipleItems(Array.from(selectedItems));
      setSelectedItems(new Set());
      setIsConfirmingBatchDelete(false);
    }
  };

  const recentPickedRandomIdsRef = useRef<string[]>([]);

  const handlePickRandom = () => {
    const pool = filteredItems.length > 0 ? filteredItems : (baseItems.length > 0 ? baseItems : items);
    if (pool.length === 0) return;

    // Filter out recently picked items to prevent repeating the same results
    const recentSet = new Set(recentPickedRandomIdsRef.current);
    const fresh = pool.filter((item) => !recentSet.has(item.id));
    const targetPool = fresh.length > 0 ? fresh : pool;

    const randomIndex = Math.floor(Math.random() * targetPool.length);
    const picked = targetPool[randomIndex];

    recentPickedRandomIdsRef.current = [picked.id, ...recentPickedRandomIdsRef.current].slice(0, 20);
    setSelectedMedia(picked);
  };

  const toggleItemSelection = (id: string) => {
    const next = new Set(selectedItems);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setSelectedItems(next);
  };

  // Watchlist defaults to showing "In Watchlist" items (hiding watched & watching by default)
  const [statusFilter, setStatusFilter] = useState<string>('watchlist');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [selectedGenre, setSelectedGenre] = useState<string>('all');
  const [selectedCountry, setSelectedCountry] = useState<string>('all');
  const [selectedRating, setSelectedRating] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<string>('added');

  // If a custom list is active
  const currentList = customLists.find((l) => l.id === activeListId);

  // Base items (full collection or scoped to active custom list)
  const baseItems = activeListId
    ? items.filter((item) => item.customLists?.includes(activeListId))
    : items;

  // Filter and sort items using unified filter logic
  const filteredItems = filterAndSortMediaItems(baseItems, {
    query: searchQuery,
    genre: selectedGenre,
    country: selectedCountry,
    rating: selectedRating,
    sortBy,
    type: typeFilter,
    status: statusFilter,
  });

  const handleDeleteCurrentList = () => {
    if (currentList) {
      deleteCustomList(currentList.id);
      setIsConfirmingDeleteList(false);
    }
  };

  return (
    <div className="space-y-6 pb-24 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          {currentList ? (
            <button
              onClick={() => {
                setActiveView('lists');
                setActiveListId(null);
              }}
              className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#09090b] dark:text-[#caa282] hover:underline cursor-pointer mb-1"
            >
              <ArrowLeft className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>All Custom Lists</span>
            </button>
          ) : (
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#71717a] dark:text-[#caa282]">
              <Bookmark className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Watchlist</span>
            </div>
          )}

          <div className="flex items-center gap-3 mt-1">
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-[#09090b] dark:text-[#faf6f2]">
              {currentList ? currentList.name : 'Watchlist'}
            </h1>
            {currentList && (
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => {
                    setEditingList(currentList);
                    setIsListModalOpen(true);
                  }}
                  title="Edit List Details"
                  className="p-1.5 rounded-lg text-[#71717a] hover:text-[#09090b] dark:hover:text-[#faf6f2] hover:bg-[#f4f4f5] dark:hover:bg-[#2b1e18] transition-colors cursor-pointer"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                {isConfirmingDeleteList ? (
                  <div className="flex items-center gap-1 animate-in fade-in duration-150">
                    <button
                      onClick={handleDeleteCurrentList}
                      title="Confirm delete this list"
                      className="px-2.5 py-1 rounded-lg text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 flex items-center gap-1 transition-colors cursor-pointer shadow-xs active:scale-95"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Confirm Delete?</span>
                    </button>
                    <button
                      onClick={() => setIsConfirmingDeleteList(false)}
                      className="px-2 py-1 text-xs font-semibold text-[#71717a] hover:text-[#09090b] dark:text-[#baa698] cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setIsConfirmingDeleteList(true)}
                    title="Delete Custom List"
                    className="p-1.5 rounded-lg text-rose-600 hover:text-rose-700 hover:bg-rose-500/15 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            )}
          </div>

          <p className="text-xs sm:text-sm text-[#71717a] dark:text-[#baa698] mt-0.5">
            {currentList?.description || `${items.length} total titles cataloged in your library`}
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto flex-wrap">
          {isBatchSelectEnabled && (
            <>
              <button
                onClick={handleSelectAll}
                className="px-4 py-2.5 text-xs font-bold rounded-xl text-[#09090b] dark:text-[#faf6f2] bg-white dark:bg-[#241a15] border border-[#e4e4e7] dark:border-[#382820] hover:bg-[#f4f4f5] cursor-pointer"
              >
                {selectedItems.size === filteredItems.length ? 'Deselect All' : 'Select All'}
              </button>
              {isConfirmingBatchDelete ? (
                <div className="flex items-center gap-1.5 animate-in fade-in">
                  <button
                    onClick={handleDeleteSelected}
                    className="px-3.5 py-2 text-xs font-bold rounded-xl text-white bg-rose-600 hover:bg-rose-700 cursor-pointer shadow-xs active:scale-95"
                  >
                    Confirm Delete ({selectedItems.size})?
                  </button>
                  <button
                    onClick={() => setIsConfirmingBatchDelete(false)}
                    className="px-2 py-2 text-xs font-semibold text-[#71717a] dark:text-[#baa698] cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsConfirmingBatchDelete(true)}
                  disabled={selectedItems.size === 0}
                  className="px-4 py-2.5 text-xs font-bold rounded-xl text-white bg-rose-600 hover:bg-rose-700 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  Delete Selected ({selectedItems.size})
                </button>
              )}
            </>
          )}

          {activeListId && (
            <button
              onClick={() => setActiveListId(null)}
              className="px-4 py-2.5 text-xs font-bold rounded-xl text-[#09090b] dark:text-[#faf6f2] bg-white dark:bg-[#241a15] border border-[#e4e4e7] dark:border-[#382820] hover:bg-[#f4f4f5] cursor-pointer"
            >
              Back to Full Archive
            </button>
          )}

          {/* Random Title Picker Button */}
          <button
            onClick={handlePickRandom}
            disabled={items.length === 0}
            title="Pick a random movie or series from collection and open preview"
            className="px-3.5 sm:px-4 py-2.5 rounded-xl bg-[#caa282] hover:bg-[#d8b598] text-[#231814] border-2 border-black dark:border-[#382820] text-xs font-extrabold flex items-center gap-2 transition-all cursor-pointer shadow-md active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Shuffle className="w-4 h-4 text-[#231814] stroke-[3]" />
            <span>Pick</span>
          </button>

          <button
            onClick={() => setIsSearchOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-[#09090b] dark:bg-[#faf6f2] hover:bg-[#27272a] text-white dark:text-[#231814] text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-sm active:scale-95"
          >
            <Plus className="w-4 h-4 stroke-[2.8]" />
            <span>Add Title</span>
          </button>
        </div>
      </div>

      {/* Consistent Catalog Filter Bar matching Recommendation, Watchlist, Movies & Series */}
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
        selectedType={typeFilter}
        setSelectedType={setTypeFilter}
        showTypeFilter={true}
        selectedStatus={statusFilter}
        setSelectedStatus={setStatusFilter}
        showStatusFilter={true}
        totalCount={baseItems.length}
        filteredCount={filteredItems.length}
      />

      {/* Content Rendering: Grid View Only */}
      {filteredItems.length === 0 ? (
        <div className="p-12 sm:p-16 rounded-3xl bg-white dark:bg-[#221814] border border-[#e4e4e7] dark:border-[#382820] text-center space-y-4 max-w-lg mx-auto my-8 shadow-xs">
          <div className="flex justify-center">
            <ClapperboardSticker size={80} />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-[#09090b] dark:text-[#faf6f2]">
              No matching titles found
            </h3>
            <p className="text-xs text-[#71717a] dark:text-[#baa698] max-w-xs mx-auto">
              {searchQuery
                ? `No collection titles matched "${searchQuery}".`
                : 'Your watchlist is currently empty for this filter.'}
            </p>
          </div>
          <button
            onClick={() => setIsSearchOpen(true)}
            className="px-5 py-2.5 rounded-xl bg-[#09090b] dark:bg-[#faf6f2] text-white dark:text-[#231814] text-xs font-bold hover:bg-[#27272a] transition-colors cursor-pointer shadow-sm"
          >
            Add Movies or Series
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-5">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              onClick={() => !isBatchSelectEnabled && setSelectedMedia(item)}
              className={`group flex flex-col cursor-pointer transition-transform duration-200 hover:-translate-y-1 relative ${
                selectedItems.has(item.id) ? 'ring-2 ring-[#09090b] dark:ring-[#faf6f2] rounded-2xl p-1 bg-neutral-500/5' : ''
              }`}
            >
              {/* Poster Container */}
              <div className="w-full aspect-[2/3] rounded-2xl overflow-hidden mb-2 relative shadow-md group-hover:shadow-xl transition-all border border-black/10 dark:border-white/10">
                <MediaPoster
                  src={item.poster}
                  alt={item.title}
                  type={item.type}
                  genres={item.genres}
                  title={item.title}
                  year={item.year}
                  aspectRatio="portrait"
                  stickerSize={48}
                />

                {isBatchSelectEnabled ? (
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleItemSelection(item.id);
                    }}
                    className={`absolute top-2.5 left-2.5 z-20 p-1.5 rounded-lg border cursor-pointer ${
                      selectedItems.has(item.id)
                        ? 'bg-[#09090b] border-[#09090b] dark:bg-[#faf6f2] dark:border-[#faf6f2]'
                        : 'bg-black/60 border-white/20 text-white'
                    }`}
                  >
                    <Check className={`w-3.5 h-3.5 ${selectedItems.has(item.id) ? 'text-white dark:text-[#231814]' : 'text-transparent'}`} />
                  </div>
                ) : (
                  /* Top Left: Add / Status Indicator (+) on hover */
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleItemInList(item.id, activeListId || '');
                    }}
                    title="Quick Manage"
                    className="absolute top-2.5 left-2.5 z-20 w-8 h-8 rounded-full bg-black/70 hover:bg-black/95 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 cursor-pointer border border-white/25 shadow-lg active:scale-90 hover:scale-110 backdrop-blur-md"
                  >
                    <Plus className="w-4 h-4 stroke-[3]" />
                  </button>
                )}

                {/* Favorite indicator */}
                {item.isFavorite && (
                  <div className="absolute bottom-2.5 left-2.5 p-1 rounded-md bg-black/75 backdrop-blur-xs text-rose-400">
                    <Heart className="w-3.5 h-3.5 fill-rose-400" />
                  </div>
                )}
              </div>

              {/* Typography directly underneath matching reference image */}
              <div className="px-0.5 space-y-0.5">
                <h4 className="text-xs sm:text-[13px] font-semibold text-[#09090b] dark:text-[#faf6f2] group-hover:text-amber-500 transition-colors truncate leading-tight">
                  {item.title}
                </h4>
                <div className="flex items-center gap-1.5 text-[11px] sm:text-xs text-[#71717a] dark:text-[#a1a1aa] font-medium font-mono">
                  <span>{item.year}</span>
                  <span>·</span>
                  <span className="uppercase">{item.type === 'series' ? 'TV' : 'Movie'}</span>
                  {item.rating && (
                    <>
                      <span>·</span>
                      <span className="text-[#71717a] dark:text-[#a1a1aa] font-medium">
                        ★ {item.rating.toFixed(1)}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
