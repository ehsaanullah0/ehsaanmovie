import React, { useState, useEffect, useRef, useTransition } from 'react';
import {
  Search,
  X,
  Plus,
  Bookmark,
  Check,
  Star,
  Film,
  Tv,
  User,
  ArrowRight,
  Sparkles,
  Loader2,
} from 'lucide-react';
import { useCollection } from '../context/CollectionContext';
import { searchMediaAndPeople, SearchResults } from '../services/movieApi';
import { MediaItem } from '../types';
import { MediaPoster } from './MediaPoster';

export const UniversalSearchModal: React.FC = () => {
  const { isSearchOpen, setIsSearchOpen, addItem, setSelectedMedia, items } = useCollection();
  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'movies' | 'series' | 'people'>('all');
  const [results, setResults] = useState<SearchResults>({ movies: [], series: [], people: [] });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isPending, startTransition] = useTransition();

  const inputRef = useRef<HTMLInputElement>(null);
  const resultsContainerRef = useRef<HTMLDivElement>(null);

  // Focus input on open and run initial search (trending)
  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      performSearch(query);
    } else {
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isSearchOpen]);

  const performSearch = (q: string) => {
    startTransition(async () => {
      const res = await searchMediaAndPeople(q);
      setResults(res);
      setSelectedIndex(0);
    });
  };

  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    performSearch(val);
  };

  // Compile flat list for keyboard navigation
  const visibleItems: Array<{ type: 'media' | 'person'; data: any }> = [];
  if (activeTab === 'all' || activeTab === 'movies') {
    results.movies.forEach((m) => visibleItems.push({ type: 'media', data: m }));
  }
  if (activeTab === 'all' || activeTab === 'series') {
    results.series.forEach((s) => visibleItems.push({ type: 'media', data: s }));
  }
  if (activeTab === 'all' || activeTab === 'people') {
    results.people.forEach((p) => visibleItems.push({ type: 'person', data: p }));
  }

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isSearchOpen) return;

      if (e.key === 'Escape') {
        e.preventDefault();
        setIsSearchOpen(false);
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev < visibleItems.length - 1 ? prev + 1 : 0));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : visibleItems.length - 1));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        const selected = visibleItems[selectedIndex];
        if (selected) {
          if (selected.type === 'media') {
            handleOpenDetail(selected.data);
          } else {
            // Searched for a person, populate search with their name
            setQuery(selected.data.name);
            performSearch(selected.data.name);
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen, selectedIndex, visibleItems]);

  if (!isSearchOpen) return null;

  const handleOpenDetail = (item: MediaItem) => {
    const existing = items.find(
      (i) =>
        i.id === item.id ||
        (item.tmdbId && i.tmdbId === item.tmdbId) ||
        i.title.toLowerCase() === item.title.toLowerCase()
    );
    setSelectedMedia(existing || item);
    setIsSearchOpen(false);
  };

  const handleQuickAdd = (
    e: React.MouseEvent,
    item: MediaItem,
    status: 'watchlist' | 'watching' | 'watched'
  ) => {
    e.stopPropagation();
    addItem(item, status);
  };

  const findSavedItem = (item: MediaItem) => {
    return items.find(
      (i) =>
        i.id === item.id ||
        (item.tmdbId && i.tmdbId === item.tmdbId) ||
        i.title.toLowerCase() === item.title.toLowerCase()
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-10 sm:pt-16 px-3 sm:px-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div
        className="w-full max-w-3xl rounded-2xl sm:rounded-3xl bg-white dark:bg-[#1e1511] border border-[#e4e4e7] dark:border-[#382820] shadow-2xl flex flex-col overflow-hidden max-h-[85vh] animate-in zoom-in-95 duration-150 text-[#09090b] dark:text-[#faf6f2]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-5 py-4 border-2 border-white dark:border-white m-3 sm:m-4 rounded-2xl bg-[#fafafc] dark:bg-[#251a15] shadow-md">
          {isPending ? (
            <Loader2 className="w-5 h-5 text-amber-600 dark:text-[#caa282] shrink-0 animate-spin" />
          ) : (
            <Search className="w-5 h-5 text-[#71717a] dark:text-[#caa282] shrink-0" />
          )}
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={handleQueryChange}
            placeholder="Search TMDB for movies, series, directors, actors..."
            className="flex-1 bg-transparent text-base sm:text-lg text-[#09090b] dark:text-[#faf6f2] placeholder-[#a1a1aa] focus:outline-hidden font-bold"
          />
          {query && (
            <button
              onClick={() => {
                setQuery('');
                performSearch('');
              }}
              className="p-1 rounded-md text-[#71717a] hover:text-[#09090b] dark:hover:text-[#faf6f2] hover:bg-[#f1f2f4] cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={() => setIsSearchOpen(false)}
            className="hidden sm:inline-flex px-2 py-1 text-xs font-mono font-bold text-[#71717a] dark:text-[#baa698] bg-[#f4f4f5] dark:bg-[#2d1f19] border border-[#e4e4e7] dark:border-[#382820] rounded-md cursor-pointer hover:bg-[#e4e4e7]"
          >
            Esc
          </button>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-2 px-5 py-2.5 bg-[#f8f9fa] dark:bg-[#201712] border-b border-[#e4e4e7] dark:border-[#382820] overflow-x-auto">
          {[
            { id: 'all', label: 'All Results' },
            { id: 'movies', label: `Movies (${results.movies.length})` },
            { id: 'series', label: `Series (${results.series.length})` },
            { id: 'people', label: `People (${results.people.length})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3.5 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-[#09090b] dark:bg-[#faf6f2] text-white dark:text-[#231814]'
                  : 'text-[#52525b] dark:text-[#b49e91] hover:text-[#09090b] dark:hover:text-[#faf6f2] hover:bg-[#f1f2f4]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search Results Area */}
        <div
          ref={resultsContainerRef}
          className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-6 divide-y divide-[#e4e4e7] dark:divide-[#382820]"
        >
          {visibleItems.length === 0 ? (
            <div className="text-center py-16 px-4">
              <div className="w-12 h-12 rounded-2xl bg-[#f4f4f5] dark:bg-[#251a15] border border-[#e4e4e7] dark:border-[#382820] flex items-center justify-center mx-auto mb-3 text-amber-600 dark:text-[#caa282]">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-[#09090b] dark:text-[#faf6f2]">No titles or creators found</h3>
              <p className="text-xs text-[#71717a] dark:text-[#baa698] mt-1 max-w-sm mx-auto">
                Try searching for "Interstellar", "Batman", "Breaking Bad", "Avengers", or a director.
              </p>
            </div>
          ) : (
            <>
              {/* Movies Group */}
              {(activeTab === 'all' || activeTab === 'movies') && results.movies.length > 0 && (
                <div className="space-y-3 pt-2 first:pt-0">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#09090b] dark:text-[#caa282] uppercase tracking-wider flex items-center gap-1.5">
                      <Film className="w-3.5 h-3.5 text-amber-600" /> Movies ({results.movies.length})
                    </span>
                    <span className="text-[11px] text-[#71717a] font-mono">TMDB Catalog</span>
                  </div>

                  <div className="space-y-2">
                    {results.movies.map((movie) => {
                      const saved = findSavedItem(movie);
                      return (
                        <div
                          key={movie.id}
                          onClick={() => handleOpenDetail(movie)}
                          className="group p-3 rounded-2xl bg-[#f8f9fa] dark:bg-[#251a15] hover:bg-[#f1f2f4] dark:hover:bg-[#2e2019] border border-[#e4e4e7] dark:border-[#382820] transition-all cursor-pointer flex items-center justify-between gap-4"
                        >
                          <div className="flex items-center gap-3.5 min-w-0">
                            <div className="w-12 h-16 shrink-0 rounded-lg overflow-hidden border border-[#e4e4e7] dark:border-neutral-800">
                              <MediaPoster
                                src={movie.poster}
                                alt={movie.title}
                                type="movie"
                                genres={movie.genres}
                                title={movie.title}
                                year={movie.year}
                                aspectRatio="portrait"
                                stickerSize={36}
                              />
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <h4 className="text-sm font-bold text-[#09090b] dark:text-[#faf6f2] group-hover:text-amber-600 dark:group-hover:text-[#caa282] transition-colors truncate">
                                  {movie.title}
                                </h4>
                                <span className="text-[10px] uppercase font-extrabold px-1.5 py-0.5 rounded bg-[#f4f4f5] dark:bg-[#34241e] text-amber-700 dark:text-[#caa282] border border-[#e4e4e7]">
                                  Movie
                                </span>
                                <span className="text-xs text-[#71717a] font-mono shrink-0">
                                  {movie.year}
                                </span>
                              </div>

                              <div className="flex items-center gap-2 mt-1 text-xs text-[#71717a] dark:text-[#baa698]">
                                {movie.rating > 0 && (
                                  <div className="flex items-center gap-1 font-mono font-bold text-amber-600 dark:text-[#caa282]">
                                    <Star className="w-3 h-3 fill-current" />
                                    <span>{movie.rating.toFixed(1)}</span>
                                  </div>
                                )}
                                <span className="text-[#71717a]">·</span>
                                <span className="truncate">{movie.genres.slice(0, 2).join(', ')}</span>
                              </div>

                              {movie.description && (
                                <p className="text-[11px] text-[#71717a] line-clamp-1 mt-0.5 font-normal">
                                  {movie.description}
                                </p>
                              )}
                            </div>
                          </div>

                          {/* Quick Action Buttons */}
                          <div
                            className="flex items-center gap-1.5 shrink-0"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {saved ? (
                              <span className="px-2.5 py-1 text-xs rounded-lg bg-[#09090b] dark:bg-[#faf6f2] text-white dark:text-[#231814] font-bold capitalize flex items-center gap-1">
                                <Check className="w-3 h-3 stroke-[3]" /> {saved.status.replace('_', ' ')}
                              </span>
                            ) : (
                              <>
                                <button
                                  onClick={(e) => handleQuickAdd(e, movie, 'watchlist')}
                                  title="Add to Watchlist"
                                  className="px-2.5 py-1.5 rounded-lg text-xs font-bold bg-white dark:bg-[#2d1f19] border border-[#e4e4e7] hover:bg-[#09090b] hover:text-white dark:hover:bg-[#faf6f2] dark:hover:text-[#231814] text-[#09090b] dark:text-[#faf6f2] transition-colors flex items-center gap-1 cursor-pointer"
                                >
                                  <Bookmark className="w-3.5 h-3.5" />
                                  <span className="hidden sm:inline">Queue</span>
                                </button>
                                <button
                                  onClick={(e) => handleQuickAdd(e, movie, 'watched')}
                                  title="Mark as Watched"
                                  className="px-2.5 py-1.5 rounded-lg text-xs font-bold bg-white dark:bg-[#2d1f19] border border-[#e4e4e7] hover:bg-[#09090b] hover:text-white dark:hover:bg-[#faf6f2] dark:hover:text-[#231814] text-[#09090b] dark:text-[#faf6f2] transition-colors flex items-center gap-1 cursor-pointer"
                                >
                                  <Check className="w-3.5 h-3.5" />
                                  <span className="hidden sm:inline">Watched</span>
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Series Group */}
              {(activeTab === 'all' || activeTab === 'series') && results.series.length > 0 && (
                <div className="space-y-3 pt-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#09090b] dark:text-[#caa282] uppercase tracking-wider flex items-center gap-1.5">
                      <Tv className="w-3.5 h-3.5 text-amber-600" /> TV Series ({results.series.length})
                    </span>
                    <span className="text-[11px] text-[#71717a] font-mono">TMDB Catalog</span>
                  </div>

                  <div className="space-y-2">
                    {results.series.map((series) => {
                      const saved = findSavedItem(series);
                      return (
                        <div
                          key={series.id}
                          onClick={() => handleOpenDetail(series)}
                          className="group p-3 rounded-2xl bg-[#f8f9fa] dark:bg-[#251a15] hover:bg-[#f1f2f4] dark:hover:bg-[#2e2019] border border-[#e4e4e7] dark:border-[#382820] transition-all cursor-pointer flex items-center justify-between gap-4"
                        >
                          <div className="flex items-center gap-3.5 min-w-0">
                            <div className="w-12 h-16 shrink-0 rounded-lg overflow-hidden border border-[#e4e4e7] dark:border-neutral-800">
                              <MediaPoster
                                src={series.poster}
                                alt={series.title}
                                type="series"
                                genres={series.genres}
                                title={series.title}
                                year={series.year}
                                aspectRatio="portrait"
                                stickerSize={36}
                              />
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <h4 className="text-sm font-bold text-[#09090b] dark:text-[#faf6f2] group-hover:text-amber-600 dark:group-hover:text-[#caa282] transition-colors truncate">
                                  {series.title}
                                </h4>
                                <span className="text-[10px] uppercase font-extrabold px-1.5 py-0.5 rounded bg-[#f4f4f5] dark:bg-[#34241e] text-amber-700 dark:text-[#caa282] border border-[#e4e4e7]">
                                  Series
                                </span>
                                <span className="text-xs text-[#71717a] font-mono shrink-0">
                                  {series.year}
                                </span>
                              </div>

                              <div className="flex items-center gap-2 mt-1 text-xs text-[#71717a] dark:text-[#baa698]">
                                {series.rating > 0 && (
                                  <div className="flex items-center gap-1 font-mono font-bold text-amber-600 dark:text-[#caa282]">
                                    <Star className="w-3 h-3 fill-current" />
                                    <span>{series.rating.toFixed(1)}</span>
                                  </div>
                                )}
                                <span className="text-[#71717a]">·</span>
                                <span className="truncate">{series.genres.slice(0, 2).join(', ')}</span>
                              </div>

                              {series.description && (
                                <p className="text-[11px] text-[#71717a] line-clamp-1 mt-0.5 font-normal">
                                  {series.description}
                                </p>
                              )}
                            </div>
                          </div>

                          {/* Quick Action Buttons */}
                          <div
                            className="flex items-center gap-1.5 shrink-0"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {saved ? (
                              <span className="px-2.5 py-1 text-xs rounded-lg bg-[#09090b] dark:bg-[#faf6f2] text-white dark:text-[#231814] font-bold capitalize flex items-center gap-1">
                                <Check className="w-3 h-3 stroke-[3]" /> {saved.status.replace('_', ' ')}
                              </span>
                            ) : (
                              <>
                                <button
                                  onClick={(e) => handleQuickAdd(e, series, 'watchlist')}
                                  title="Add to Watchlist"
                                  className="px-2.5 py-1.5 rounded-lg text-xs font-bold bg-white dark:bg-[#2d1f19] border border-[#e4e4e7] hover:bg-[#09090b] hover:text-white dark:hover:bg-[#faf6f2] dark:hover:text-[#231814] text-[#09090b] dark:text-[#faf6f2] transition-colors flex items-center gap-1 cursor-pointer"
                                >
                                  <Bookmark className="w-3.5 h-3.5" />
                                  <span className="hidden sm:inline">Queue</span>
                                </button>
                                <button
                                  onClick={(e) => handleQuickAdd(e, series, 'watched')}
                                  title="Mark as Watched"
                                  className="px-2.5 py-1.5 rounded-lg text-xs font-bold bg-white dark:bg-[#2d1f19] border border-[#e4e4e7] hover:bg-[#09090b] hover:text-white dark:hover:bg-[#faf6f2] dark:hover:text-[#231814] text-[#09090b] dark:text-[#faf6f2] transition-colors flex items-center gap-1 cursor-pointer"
                                >
                                  <Check className="w-3.5 h-3.5" />
                                  <span className="hidden sm:inline">Watched</span>
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
              {/* People Group */}
              {(activeTab === 'all' || activeTab === 'people') && results.people.length > 0 && (
                <div className="space-y-3 pt-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#09090b] dark:text-[#caa282] uppercase tracking-wider flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-amber-600" /> People &amp; Directors
                    </span>
                    <span className="text-[11px] text-[#71717a] font-mono">
                      {results.people.length} found
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {results.people.map((person) => (
                      <div
                        key={person.id}
                        onClick={() => {
                          setQuery(person.name);
                          performSearch(person.name);
                        }}
                        className="p-3 rounded-2xl bg-[#f8f9fa] dark:bg-[#251a15] hover:bg-[#f1f2f4] dark:hover:bg-[#2e2019] border border-[#e4e4e7] dark:border-[#382820] transition-all cursor-pointer flex items-center justify-between gap-2 group"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          {person.photo ? (
                            <img
                              src={person.photo}
                              alt={person.name}
                              className="w-9 h-9 rounded-full object-cover shrink-0 border border-[#e4e4e7] dark:border-[#382820]"
                              loading="lazy"
                            />
                          ) : (
                            <div className="w-9 h-9 rounded-full bg-[#09090b] dark:bg-[#caa282] text-white dark:text-[#231814] flex items-center justify-center font-bold text-xs shrink-0">
                              {person.name.split(' ').map((n: string) => n[0]).join('')}
                            </div>
                          )}
                          <div className="min-w-0">
                            <h4 className="text-xs font-bold text-[#09090b] dark:text-[#faf6f2] group-hover:text-amber-600 dark:group-hover:text-[#caa282] transition-colors truncate">
                              {person.name}
                            </h4>
                            <p className="text-[11px] text-[#71717a] dark:text-[#baa698] truncate">
                              {person.role} · Known for {person.knownFor[0]}
                            </p>
                          </div>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-[#71717a] group-hover:text-[#09090b] dark:group-hover:text-[#faf6f2] transition-colors shrink-0" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer info & shortcut guide */}
        <div className="px-5 py-3 bg-[#fafafc] dark:bg-[#18110e] border-t border-[#e4e4e7] dark:border-[#382820] flex items-center justify-between text-xs text-[#71717a] dark:text-[#baa698]">
          <div className="flex items-center gap-4">
            <span>
              <kbd className="px-1.5 py-0.5 rounded bg-[#f4f4f5] dark:bg-[#281d17] text-[10px] text-[#09090b] dark:text-[#faf6f2] mr-1 font-mono font-bold border border-[#e4e4e7] dark:border-transparent">
                ↑
              </kbd>
              <kbd className="px-1.5 py-0.5 rounded bg-[#f4f4f5] dark:bg-[#281d17] text-[10px] text-[#09090b] dark:text-[#faf6f2] mr-1 font-mono font-bold border border-[#e4e4e7] dark:border-transparent">
                ↓
              </kbd>
              Navigate
            </span>
            <span>
              <kbd className="px-1.5 py-0.5 rounded bg-[#f4f4f5] dark:bg-[#281d17] text-[10px] text-[#09090b] dark:text-[#faf6f2] mr-1 font-mono font-bold border border-[#e4e4e7] dark:border-transparent">
                ↵
              </kbd>
              Open
            </span>
          </div>
          <span className="text-[11px] font-mono">TMDB &amp; Local Engine</span>
        </div>
      </div>
    </div>
  );
};
