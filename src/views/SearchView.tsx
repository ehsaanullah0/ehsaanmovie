import React, { useState, useEffect, useTransition } from 'react';
import {
  Search as SearchIcon,
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
  Calendar,
} from 'lucide-react';
import { useCollection } from '../context/CollectionContext';
import { searchMediaAndPeople, SearchResults } from '../services/movieApi';
import { MediaItem } from '../types';
import { MediaPoster } from '../components/MediaPoster';
import { resolveGenreColor } from '../utils/genreColors';

const GENRE_CHIPS = ['All', 'Action', 'Sci-Fi', 'Drama', 'Crime', 'Animation', 'Horror', 'Comedy', 'Adventure', 'Thriller'];

export const SearchView: React.FC = () => {
  const { addItem, setSelectedMedia, items, genreColors } = useCollection();
  const [query, setQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [results, setResults] = useState<SearchResults>({ movies: [], series: [], people: [] });
  const [isPending, startTransition] = useTransition();

  const handleSearch = (q: string) => {
    startTransition(async () => {
      const res = await searchMediaAndPeople(q);
      setResults(res);
    });
  };

  useEffect(() => {
    handleSearch(query);
  }, [query]);

  const findSavedItem = (item: MediaItem) => {
    return items.find(
      (i) =>
        i.id === item.id ||
        (item.tmdbId && i.tmdbId === item.tmdbId) ||
        i.title.toLowerCase() === item.title.toLowerCase()
    );
  };

  const filterByGenre = (itemsList: MediaItem[]) => {
    if (selectedGenre === 'All') return itemsList;
    return itemsList.filter((item) =>
      item.genres.some((g) => g.toLowerCase() === selectedGenre.toLowerCase())
    );
  };

  const filteredMovies = filterByGenre(results.movies);
  const filteredSeries = filterByGenre(results.series);

  return (
    <div className="space-y-6 pb-20 animate-in fade-in duration-200">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#71717a] dark:text-[#caa282]">
          <SearchIcon className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>Universal TMDB Discovery</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-[#09090b] dark:text-[#faf6f2] mt-1">
          Search Visto
        </h1>
        <p className="text-xs sm:text-sm text-[#71717a] dark:text-[#baa698] mt-0.5">
          Find movies, television series, directors, and actors powered by TMDB
        </p>
      </div>

      {/* Main Search Input */}
      <div className="relative">
        {isPending ? (
          <Loader2 className="w-5 h-5 text-[#71717a] dark:text-[#caa282] absolute left-4 top-1/2 -translate-y-1/2 animate-spin" />
        ) : (
          <SearchIcon className="w-5 h-5 text-[#71717a] dark:text-[#caa282] absolute left-4 top-1/2 -translate-y-1/2" />
        )}
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search e.g. 'dune', 'Interstellar', 'Batman'..."
          className="w-full pl-12 pr-12 py-3.5 rounded-2xl bg-white dark:bg-[#221814] border-2 border-white dark:border-white text-sm sm:text-base text-[#09090b] dark:text-[#faf6f2] placeholder-[#71717a] focus:outline-hidden shadow-md font-medium"
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-[#71717a] hover:text-[#09090b] dark:hover:text-[#faf6f2] p-1.5 rounded-lg bg-[#f4f4f5] dark:bg-[#2e2019] cursor-pointer"
          >
            ✕
          </button>
        )}
      </div>

      {/* Genre Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {GENRE_CHIPS.map((genre) => {
          const isSelected = selectedGenre === genre;
          const gColor = genre !== 'All' ? resolveGenreColor(genre, genreColors) : null;
          return (
            <button
              key={genre}
              onClick={() => setSelectedGenre(genre)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                isSelected
                  ? 'bg-[#09090b] dark:bg-[#faf6f2] text-white dark:text-[#231814] shadow-xs'
                  : 'bg-white dark:bg-[#221814] border border-[#e4e4e7] dark:border-[#382820] text-[#71717a] dark:text-[#baa698] hover:text-[#09090b] dark:hover:text-[#faf6f2]'
              }`}
            >
              {gColor && (
                <span
                  className="w-2 h-2 rounded-full shrink-0 border border-black/20"
                  style={{ backgroundColor: gColor }}
                />
              )}
              <span>{genre}</span>
            </button>
          );
        })}
      </div>

      {/* Results Groups */}
      <div className="space-y-8">
        {/* Empty State */}
        {!isPending && filteredMovies.length === 0 && filteredSeries.length === 0 && results.people.length === 0 && (
          <div className="text-center py-16 px-4 bg-white dark:bg-[#221814] rounded-3xl border border-[#e4e4e7] dark:border-[#382820] shadow-xs">
            <div className="w-12 h-12 rounded-2xl bg-[#f4f4f5] dark:bg-[#2a1d17] border border-[#e4e4e7] dark:border-[#382820] flex items-center justify-center mx-auto mb-3 text-[#71717a] dark:text-[#caa282]">
              <SearchIcon className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-[#09090b] dark:text-[#faf6f2]">No results found on TMDB</h3>
            <p className="text-xs text-[#71717a] dark:text-[#baa698] mt-1 max-w-sm mx-auto">
              We couldn't find any titles matching "{query}". Check spelling or try popular titles like "Dune".
            </p>
          </div>
        )}

        {/* Movies & Series Results */}
        {(filteredMovies.length > 0 || filteredSeries.length > 0) && (
          <div className="space-y-4">
            <div className="text-xs font-bold uppercase tracking-wider text-[#71717a] dark:text-[#caa282]">
              {filteredMovies.length + filteredSeries.length} results
            </div>

            <div className="space-y-3">
              {[...filteredMovies, ...filteredSeries].map((item) => {
                const saved = findSavedItem(item);
                return (
                  <div
                    key={item.id}
                    onClick={() => setSelectedMedia(saved || item)}
                    className="p-3.5 sm:p-4 rounded-3xl bg-white dark:bg-[#221814] border border-[#e4e4e7] dark:border-[#382820] hover:border-[#09090b] dark:hover:border-[#caa282] transition-all cursor-pointer flex items-center justify-between gap-4 group shadow-2xs"
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      {/* Large vertical poster on the left using full height */}
                      <div className="w-24 sm:w-28 self-stretch rounded-2xl overflow-hidden border border-[#e4e4e7] dark:border-neutral-800 shadow-sm shrink-0 flex items-center justify-center bg-[#f4f4f5] dark:bg-[#1e1511]">
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
                      </div>

                      <div className="min-w-0 space-y-1.5">
                        <h3 className="text-base sm:text-lg font-extrabold text-[#09090b] dark:text-[#faf6f2] group-hover:text-amber-600 dark:group-hover:text-[#caa282] transition-colors truncate">
                          {item.title}
                        </h3>

                        <p className="text-xs sm:text-sm text-[#71717a] dark:text-[#baa698] line-clamp-2 leading-relaxed font-medium">
                          {item.description}
                        </p>

                        {/* Bottom Badge Chips for Year & Rating */}
                        <div className="flex flex-wrap items-center gap-2 pt-1">
                          <span className="px-2.5 py-1 rounded-lg bg-[#f4f4f5] dark:bg-[#2e2019] text-xs font-mono font-bold text-[#09090b] dark:text-[#faf6f2] flex items-center gap-1.5 border border-[#e4e4e7] dark:border-[#382820]">
                            <Calendar className="w-3.5 h-3.5 text-[#71717a] dark:text-[#caa282]" />
                            {item.year}
                          </span>

                          {item.rating ? (
                            <span className="px-2.5 py-1 rounded-lg bg-[#f4f4f5] dark:bg-[#2e2019] text-xs font-mono font-bold text-[#09090b] dark:text-[#faf6f2] flex items-center gap-1.5 border border-[#e4e4e7] dark:border-[#382820]">
                              <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500 dark:fill-[#caa282] dark:text-[#caa282]" />
                              {item.rating.toFixed(1)}
                            </span>
                          ) : null}

                          <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-[#f4f4f5] dark:bg-[#34241e] text-[#71717a] dark:text-[#caa282]">
                            {item.type === 'series' ? 'TV Series' : 'Movie'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Action button / saved status */}
                    <div
                      className="shrink-0"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {saved ? (
                        <span className="px-3 py-1.5 text-xs rounded-xl bg-[#09090b] dark:bg-[#faf6f2] text-white dark:text-[#231814] font-bold capitalize flex items-center gap-1.5 shadow-xs">
                          <Check className="w-3.5 h-3.5 stroke-[3]" /> {saved.status.replace('_', ' ')}
                        </span>
                      ) : (
                        <button
                          onClick={() => addItem(item, 'watchlist')}
                          className="px-4 py-2 text-xs font-bold rounded-xl bg-[#f4f4f5] dark:bg-[#2e2019] hover:bg-[#09090b] hover:text-white dark:hover:bg-[#faf6f2] dark:hover:text-[#231814] text-[#09090b] dark:text-[#faf6f2] transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs border border-[#e4e4e7] dark:border-[#382820]"
                        >
                          <Bookmark className="w-3.5 h-3.5" />
                          <span>Queue</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* People Results */}
        {results.people.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#71717a] dark:text-[#caa282] flex items-center gap-1.5">
              <User className="w-3.5 h-3.5" /> Directors &amp; Cast ({results.people.length})
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {results.people.map((person) => (
                <div
                  key={person.id}
                  onClick={() => setQuery(person.name)}
                  className="p-3.5 rounded-2xl bg-white dark:bg-[#221814] border border-[#e4e4e7] dark:border-[#382820] hover:border-[#09090b] dark:hover:border-[#caa282] transition-all cursor-pointer flex items-center justify-between gap-3 group shadow-2xs"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {person.photo ? (
                      <img
                        src={person.photo}
                        alt={person.name}
                        className="w-10 h-10 rounded-full object-cover shrink-0 border border-[#e4e4e7] dark:border-[#382820]"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-[#09090b] dark:bg-[#caa282] text-white dark:text-[#231814] flex items-center justify-center font-bold text-xs shrink-0">
                        {person.name.split(' ').map((n) => n[0]).join('')}
                      </div>
                    )}
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-[#09090b] dark:text-[#faf6f2] group-hover:text-amber-600 dark:group-hover:text-[#caa282] transition-colors truncate">
                        {person.name}
                      </h4>
                      <p className="text-[11px] text-[#71717a] dark:text-[#baa698] truncate">
                        {person.role} · {person.knownFor[0]}
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-[#71717a] group-hover:text-[#09090b] dark:group-hover:text-[#faf6f2] transition-colors shrink-0" />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
