import React, { useState, useMemo } from 'react';
import {
  ListPlus,
  Search,
  Plus,
  Play,
  Film,
  Tv,
  Star,
  Sparkles,
  Edit2,
  Trash2,
  ExternalLink,
  ChevronRight,
  FolderHeart,
  Shuffle,
} from 'lucide-react';
import { useCollection } from '../context/CollectionContext';
import { CustomList, MediaItem } from '../types';

export const CustomListsView: React.FC = () => {
  const {
    customLists,
    items,
    setActiveView,
    setActiveListId,
    setIsListModalOpen,
    setEditingList,
    deleteCustomList,
    userName,
    setSelectedMedia,
  } = useCollection();

  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'default' | 'count' | 'name' | 'recent'>('default');
  const [listToDelete, setListToDelete] = useState<CustomList | null>(null);

  // Group items by list
  const listItemsMap = useMemo(() => {
    const map = new Map<string, MediaItem[]>();
    customLists.forEach((l) => map.set(l.id, []));

    items.forEach((item) => {
      (item.customLists || []).forEach((listId) => {
        const current = map.get(listId);
        if (current) {
          current.push(item);
        } else {
          map.set(listId, [item]);
        }
      });
    });

    return map;
  }, [customLists, items]);

  // Total items in all playlists
  const totalPlaylistItemsCount = useMemo(() => {
    let count = 0;
    listItemsMap.forEach((itemList) => {
      count += itemList.length;
    });
    return count;
  }, [listItemsMap]);

  // Filter & sort custom lists
  const filteredLists = useMemo(() => {
    let result = customLists.filter((list) => {
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        list.name.toLowerCase().includes(q) ||
        (list.description || '').toLowerCase().includes(q)
      );
    });

    if (sortBy === 'count') {
      result.sort((a, b) => (listItemsMap.get(b.id)?.length || 0) - (listItemsMap.get(a.id)?.length || 0));
    } else if (sortBy === 'name') {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === 'recent') {
      result.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
    }

    return result;
  }, [customLists, searchQuery, sortBy, listItemsMap]);

  const handleOpenList = (listId: string) => {
    setActiveListId(listId);
    setActiveView('list');
  };

  const handleShuffleList = (listId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const listItems = listItemsMap.get(listId) || [];
    if (listItems.length === 0) {
      handleOpenList(listId);
      return;
    }
    const randomIndex = Math.floor(Math.random() * listItems.length);
    setSelectedMedia(listItems[randomIndex]);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* 1. Spotify-Style Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#2a1d17] via-[#1c130f] to-[#0f0a08] border border-[#483327]/60 dark:border-[#38271e] text-white p-6 sm:p-8 lg:p-10 shadow-2xl">
        {/* Ambient background glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#caa282]/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-mono font-extrabold uppercase tracking-widest text-[#caa282]">
              <Sparkles className="w-4 h-4 text-[#caa282]" />
              <span>YOUR PLAYLIST HUB</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight text-balance">
              Custom Lists
            </h1>

            <p className="text-xs sm:text-sm text-[#e0cfc4] leading-relaxed max-w-xl">
              Organize your movies and series like favorite Spotify albums. Build thematic marathons,
              watchlist collections, and personalized vaults with auto-collaged album art.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-[#baa698]">
              <span className="font-bold text-white font-mono bg-white/10 px-2.5 py-1 rounded-lg">
                {customLists.length} Playlists
              </span>
              <span>•</span>
              <span className="font-bold text-white font-mono bg-white/10 px-2.5 py-1 rounded-lg">
                {totalPlaylistItemsCount} Titles Saved
              </span>
              <span>•</span>
              <span>Curated by {userName}</span>
            </div>
          </div>

          {/* Action button */}
          <button
            onClick={() => {
              setEditingList(null);
              setIsListModalOpen(true);
            }}
            className="flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-[#caa282] hover:bg-[#d8b598] text-[#231814] font-extrabold text-sm transition-all shadow-xl hover:shadow-[#caa282]/20 hover:scale-[1.02] active:scale-95 cursor-pointer shrink-0 self-start md:self-auto"
          >
            <Plus className="w-5 h-5 stroke-[3]" />
            <span>Create New Playlist</span>
          </button>
        </div>
      </div>

      {/* 2. Controls Toolbar (Search & Sort) */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-[#fdf8f3] dark:bg-[#1a120e] p-3 sm:p-4 rounded-2xl border border-[#e8d7c8] dark:border-[#33231b] shadow-xs">
        {/* Search input */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8a6854] dark:text-[#a89284]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter playlists by name or description..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-white dark:bg-[#251b16] border border-[#d9c5b4] dark:border-[#3e2c22] text-xs font-medium text-[#2b1d16] dark:text-[#faf6f2] placeholder-[#8a6854] dark:placeholder-[#8f796c] focus:outline-hidden focus:border-[#2b1d16] dark:focus:border-[#caa282]"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-[#8a6854] hover:text-[#2b1d16] dark:hover:text-white"
            >
              Clear
            </button>
          )}
        </div>

        {/* Sort Selector */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <span className="text-[11px] font-bold text-[#71717a] dark:text-[#baa698] uppercase tracking-wider hidden sm:inline">
            Sort by:
          </span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-2 rounded-xl bg-white dark:bg-[#251b16] border border-[#d9c5b4] dark:border-[#3e2c22] text-xs font-bold text-[#2b1d16] dark:text-[#faf6f2] focus:outline-hidden cursor-pointer"
          >
            <option value="default">Default Order</option>
            <option value="count">Most Titles</option>
            <option value="name">Alphabetical</option>
            <option value="recent">Recently Created</option>
          </select>
        </div>
      </div>

      {/* 3. Spotify Playlist Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
        {/* + Create Playlist Tile */}
        <div
          onClick={() => {
            setEditingList(null);
            setIsListModalOpen(true);
          }}
          className="group relative flex flex-col justify-between p-4 sm:p-5 rounded-2xl sm:rounded-3xl border-2 border-dashed border-[#d9c5b4] dark:border-[#3e2c22] hover:border-[#caa282] dark:hover:border-[#caa282] bg-[#fbf6f0]/50 dark:bg-[#1f1510]/50 hover:bg-[#faebd7] dark:hover:bg-[#261a14] transition-all duration-200 cursor-pointer min-h-[260px] text-center items-center justify-center gap-3"
        >
          <div className="w-14 h-14 rounded-full bg-[#f0dfcf] dark:bg-[#2e1f18] group-hover:bg-[#caa282] flex items-center justify-center text-[#2b1d16] dark:text-[#faf6f2] group-hover:text-[#231814] group-hover:scale-110 transition-all shadow-md">
            <Plus className="w-7 h-7 stroke-[2.5]" />
          </div>
          <div>
            <h3 className="text-sm font-black text-[#2b1d16] dark:text-[#faf6f2] group-hover:text-[#231814] dark:group-hover:text-[#caa282] transition-colors">
              New Playlist
            </h3>
            <p className="text-[11px] text-[#71717a] dark:text-[#baa698] mt-1 max-w-[140px] leading-tight">
              Create a custom list with custom icon &amp; description
            </p>
          </div>
        </div>

        {/* Existing Custom Lists */}
        {filteredLists.map((list) => {
          const listItems = listItemsMap.get(list.id) || [];
          // Get the latest 4 unique poster artworks
          const latestFour = listItems
            .filter((item) => Boolean(item.poster || item.banner))
            .slice(-4)
            .reverse();

          const moviesCount = listItems.filter((i) => i.type === 'movie').length;
          const seriesCount = listItems.filter((i) => i.type === 'series').length;
          const isYouMayLike = list.id === 'list-you-may-like' || list.name.trim().toUpperCase() === 'YOU MAY LIKE';

          return (
            <div
              key={list.id}
              onClick={() => handleOpenList(list.id)}
              className="group relative flex flex-col p-3.5 sm:p-4 rounded-2xl sm:rounded-3xl bg-[#fdf8f3] dark:bg-[#201510] hover:bg-[#f6ebd9] dark:hover:bg-[#2c1d16] border border-[#e8d7c8] dark:border-[#38271e] hover:border-[#caa282] dark:hover:border-[#caa282] transition-all duration-300 shadow-xs hover:shadow-xl hover:-translate-y-1 cursor-pointer"
            >
              {/* Spotify-style Cover Art Container (1:1 Aspect Ratio) */}
              <div className="relative w-full aspect-square rounded-xl sm:rounded-2xl overflow-hidden bg-[#160f0c] shadow-md border border-black/10 dark:border-white/10 shrink-0">
                {latestFour.length >= 4 ? (
                  /* 2x2 Grid of 4 Posters */
                  <div className="grid grid-cols-2 grid-rows-2 w-full h-full gap-0.5 bg-black/40">
                    {latestFour.map((item, idx) => (
                      <div key={idx} className="relative w-full h-full overflow-hidden bg-neutral-900">
                        <img
                          src={item.poster || item.banner}
                          alt={item.title}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                    ))}
                  </div>
                ) : latestFour.length === 2 || latestFour.length === 3 ? (
                  /* Split 2-3 collage */
                  <div className="grid grid-cols-2 w-full h-full gap-0.5 bg-black/40">
                    <div className="relative w-full h-full overflow-hidden bg-neutral-900">
                      <img
                        src={latestFour[0].poster || latestFour[0].banner}
                        alt={latestFour[0].title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="grid grid-rows-2 w-full h-full gap-0.5">
                      <div className="relative w-full h-full overflow-hidden bg-neutral-900">
                        <img
                          src={latestFour[1].poster || latestFour[1].banner}
                          alt={latestFour[1].title}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      <div className="relative w-full h-full overflow-hidden bg-neutral-900">
                        {latestFour[2] ? (
                          <img
                            src={latestFour[2].poster || latestFour[2].banner}
                            alt={latestFour[2].title}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-[#2e1f18] to-[#1a120e] flex items-center justify-center text-lg">
                            <ListPlus className="w-5 h-5 text-[#caa282]/70" />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ) : latestFour.length === 1 ? (
                  /* Single full-bleed poster */
                  <div className="w-full h-full relative overflow-hidden bg-neutral-900">
                    <img
                      src={latestFour[0].poster || latestFour[0].banner}
                      alt={latestFour[0].title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  </div>
                ) : (
                  /* Empty state Spotify aesthetic placeholder */
                  <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#3d271c] via-[#241812] to-[#140e0b] text-[#faf6f2] p-4 text-center">
                    <ListPlus className="w-10 h-10 text-[#caa282] filter drop-shadow-md group-hover:scale-110 transition-transform duration-300 stroke-[1.5]" />
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[#d9c5b4] mt-2 font-bold opacity-80">
                      Empty Playlist
                    </span>
                  </div>
                )}

                {/* Top-Left Floating Tag (only if preloaded) */}
                {isYouMayLike && (
                  <div className="absolute top-2 left-2 z-10 px-2 py-0.5 rounded-lg bg-black/60 backdrop-blur-md border border-white/20 text-xs shadow-sm flex items-center gap-1">
                    <span className="text-[10px] font-bold text-[#caa282] uppercase font-mono">
                      PRELOADED
                    </span>
                  </div>
                )}

                {/* Spotify-style Floating Play / Open Button on Hover (Bottom-Right) */}
                <div className="absolute bottom-2.5 right-2.5 z-10 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-200">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenList(list.id);
                    }}
                    title={`Open ${list.name}`}
                    className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#caa282] hover:bg-[#d8b598] text-[#231814] shadow-xl flex items-center justify-center transition-transform hover:scale-110 active:scale-95 cursor-pointer"
                  >
                    <Play className="w-5 h-5 fill-current ml-0.5" />
                  </button>
                </div>
              </div>

              {/* Playlist Title & Metadata */}
              <div className="mt-3 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between gap-1">
                    <h3 className="font-extrabold text-sm text-[#09090b] dark:text-[#faf6f2] group-hover:text-[#231814] dark:group-hover:text-[#caa282] transition-colors truncate">
                      {list.name}
                    </h3>

                    {/* Shuffle Quick Action */}
                    {listItems.length > 0 && (
                      <button
                        onClick={(e) => handleShuffleList(list.id, e)}
                        title="Pick Random from this list"
                        className="opacity-0 group-hover:opacity-100 p-1 rounded-md text-[#71717a] hover:text-[#09090b] dark:hover:text-[#faf6f2] hover:bg-black/5 dark:hover:bg-white/10 transition-opacity cursor-pointer shrink-0"
                      >
                        <Shuffle className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  {list.description && (
                    <p className="text-[11px] text-[#71717a] dark:text-[#baa698] line-clamp-2 mt-1 leading-snug">
                      {list.description}
                    </p>
                  )}
                </div>

                {/* Subtitle / Stats footer */}
                <div className="pt-2.5 mt-2 border-t border-[#e8d7c8]/60 dark:border-[#35251d] flex items-center justify-between text-[11px] text-[#71717a] dark:text-[#a89284] font-medium">
                  <span>
                    {listItems.length} {listItems.length === 1 ? 'title' : 'titles'}
                  </span>

                  <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingList(list);
                        setIsListModalOpen(true);
                      }}
                      title="Edit playlist"
                      className="p-1 rounded-md hover:bg-black/10 dark:hover:bg-white/15 text-[#71717a] hover:text-[#09090b] dark:hover:text-white transition-colors cursor-pointer"
                    >
                      <Edit2 className="w-3 h-3" />
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setListToDelete(list);
                      }}
                      title="Delete playlist"
                      className="p-1 rounded-md hover:bg-rose-500/20 text-[#71717a] hover:text-rose-600 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Delete Confirmation Modal */}
      {listToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-sm rounded-3xl bg-[#fdf8f3] dark:bg-[#201510] border-2 border-[#d9c5b4] dark:border-[#38271e] p-6 shadow-2xl text-[#2b1d16] dark:text-[#faf6f2] space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-rose-500/10 text-rose-600 flex items-center justify-center">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-extrabold">Delete Playlist?</h3>
                <p className="text-xs text-[#71717a] dark:text-[#baa698]">
                  "{listToDelete.name}"
                </p>
              </div>
            </div>

            <p className="text-xs text-[#5e4133] dark:text-[#d9c5b4] leading-relaxed">
              This will remove the playlist. The movies and series inside will remain safe in your library.
            </p>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setListToDelete(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-[#71717a] hover:bg-black/5 dark:hover:bg-white/10 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  deleteCustomList(listToDelete.id);
                  setListToDelete(null);
                }}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white cursor-pointer shadow-md"
              >
                Delete Playlist
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
