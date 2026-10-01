import { MediaItem, MediaType, Season } from '../types';
import { SEARCH_CATALOG, FAMOUS_PEOPLE, PersonResult } from '../data/searchCatalog';

export const TMDB_API_KEY = 'TMDB API KEY IS PRIVATE ( USE YOUR OWN )';
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p';

// Standard TMDB Genre mappings
const MOVIE_GENRES: Record<number, string> = {
  28: 'Action',
  12: 'Adventure',
  16: 'Animation',
  35: 'Comedy',
  80: 'Crime',
  99: 'Documentary',
  18: 'Drama',
  10751: 'Family',
  14: 'Fantasy',
  36: 'History',
  27: 'Horror',
  10402: 'Music',
  9648: 'Mystery',
  10749: 'Romance',
  878: 'Sci-Fi',
  10770: 'TV Movie',
  53: 'Thriller',
  10752: 'War',
  37: 'Western',
};

const TV_GENRES: Record<number, string> = {
  10759: 'Action & Adventure',
  16: 'Animation',
  35: 'Comedy',
  80: 'Crime',
  99: 'Documentary',
  18: 'Drama',
  10751: 'Family',
  10762: 'Kids',
  9648: 'Mystery',
  10763: 'News',
  10764: 'Reality',
  10765: 'Sci-Fi & Fantasy',
  10766: 'Soap',
  10767: 'Talk',
  10768: 'War & Politics',
  37: 'Western',
};

export interface SearchResults {
  movies: MediaItem[];
  series: MediaItem[];
  people: PersonResult[];
}

// In-memory cache for search queries and details
const searchCache = new Map<string, SearchResults>();
const top10Cache = new Map<string, MediaItem[]>();
const detailsCache = new Map<string, Partial<MediaItem>>();

export function getTmdbPosterUrl(path: string | null | undefined, size: 'w342' | 'w500' | 'w780' | 'original' = 'w500'): string {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  return `${TMDB_IMAGE_BASE}/${size}${path}`;
}

export function getTmdbBackdropUrl(path: string | null | undefined, size: 'w780' | 'w1280' | 'original' = 'w1280'): string {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  return `${TMDB_IMAGE_BASE}/${size}${path}`;
}

export function getTmdbProfileUrl(path: string | null | undefined, size: 'w185' | 'h632' | 'original' = 'w185'): string {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  return `${TMDB_IMAGE_BASE}/${size}${path}`;
}

function mapGenreIds(genreIds?: number[], type: MediaType = 'movie'): string[] {
  if (!genreIds || !genreIds.length) return [type === 'movie' ? 'Movie' : 'Series'];
  const dict = type === 'movie' ? MOVIE_GENRES : TV_GENRES;
  const mapped = genreIds
    .map((id) => dict[id] || MOVIE_GENRES[id] || TV_GENRES[id])
    .filter(Boolean);
  return mapped.length > 0 ? mapped : ['Drama'];
}

/**
 * Helper to shuffle an array using Fisher-Yates algorithm
 */
export function shuffleArray<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/**
 * Fetches top 10 trending movies and TV series for the "Top 10 Today" section.
 */
export async function fetchTop10(): Promise<MediaItem[]> {
  const cacheKey = '__top10_today__';
  if (top10Cache.has(cacheKey)) {
    return top10Cache.get(cacheKey)!;
  }

  const allTop: MediaItem[] = [];

  try {
    const endpoints = [
      `${TMDB_BASE_URL}/trending/movie/day?api_key=${TMDB_API_KEY}&language=en-US`,
      `${TMDB_BASE_URL}/trending/tv/day?api_key=${TMDB_API_KEY}&language=en-US`,
    ];

    const responses = await Promise.allSettled(
      endpoints.map((url) => fetch(url).then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      )
    );

    for (const res of responses) {
      if (res.status === 'fulfilled' && res.value && Array.isArray(res.value.results)) {
        for (const item of res.value.results) {
          if ((item.media_type === 'movie' || item.title) && item.title) {
            allTop.push(formatMovieResult(item));
          } else if ((item.media_type === 'tv' || item.name) && item.name) {
            allTop.push(formatTvResult(item));
          }
        }
      }
    }
  } catch (err) {
    console.warn('Failed to fetch Top 10:', err);
  }

  const top10 = shuffleArray(allTop).slice(0, 10);
  top10Cache.set(cacheKey, top10);
  return top10;
}

/**
 * Fetches a large pool of high-quality discoverable movies and TV series
 * across multiple TMDB pages and categories, combined with local curated catalog.
 */
export async function fetchExploreDiscoveryPool(forceRefresh = false): Promise<MediaItem[]> {
  const cacheKey = '__explore_pool_v2__';
  if (!forceRefresh && searchCache.has(cacheKey)) {
    const cached = searchCache.get(cacheKey)!;
    return [...cached.movies, ...cached.series];
  }

  if (forceRefresh) {
    searchCache.delete(cacheKey);
  }

  const allMovies: MediaItem[] = [];
  const allSeries: MediaItem[] = [];

  // Generate randomized pages between 1 and 8 to get fresh diverse titles
  const moviePage1 = forceRefresh ? Math.floor(Math.random() * 5) + 1 : 1;
  const moviePage2 = moviePage1 + 1;
  const tvPage1 = forceRefresh ? Math.floor(Math.random() * 4) + 1 : 1;
  const tvPage2 = tvPage1 + 1;

  try {
    const endpoints = [
      `${TMDB_BASE_URL}/movie/popular?api_key=${TMDB_API_KEY}&language=en-US&page=${moviePage1}`,
      `${TMDB_BASE_URL}/movie/popular?api_key=${TMDB_API_KEY}&language=en-US&page=${moviePage2}`,
      `${TMDB_BASE_URL}/movie/top_rated?api_key=${TMDB_API_KEY}&language=en-US&page=${moviePage1}`,
      `${TMDB_BASE_URL}/movie/top_rated?api_key=${TMDB_API_KEY}&language=en-US&page=${moviePage2}`,
      `${TMDB_BASE_URL}/tv/popular?api_key=${TMDB_API_KEY}&language=en-US&page=${tvPage1}`,
      `${TMDB_BASE_URL}/tv/popular?api_key=${TMDB_API_KEY}&language=en-US&page=${tvPage2}`,
      `${TMDB_BASE_URL}/tv/top_rated?api_key=${TMDB_API_KEY}&language=en-US&page=${tvPage1}`,
      `${TMDB_BASE_URL}/trending/movie/week?api_key=${TMDB_API_KEY}&language=en-US&page=${moviePage1}`,
      `${TMDB_BASE_URL}/trending/tv/week?api_key=${TMDB_API_KEY}&language=en-US&page=${tvPage1}`,
      `${TMDB_BASE_URL}/discover/movie?api_key=${TMDB_API_KEY}&language=en-US&sort_by=vote_count.desc&vote_average.gte=7.5&page=${moviePage1}`,
      `${TMDB_BASE_URL}/discover/movie?api_key=${TMDB_API_KEY}&language=en-US&sort_by=vote_count.desc&vote_average.gte=7.5&page=${moviePage2}`,
    ];

    const responses = await Promise.allSettled(
      endpoints.map((url) =>
        fetch(url).then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      )
    );

    for (const res of responses) {
      if (res.status === 'fulfilled' && res.value && Array.isArray(res.value.results)) {
        for (const item of res.value.results) {
          if ((item.media_type === 'movie' || item.title) && item.title) {
            allMovies.push(formatMovieResult(item));
          } else if ((item.media_type === 'tv' || item.name) && item.name) {
            allSeries.push(formatTvResult(item));
          }
        }
      }
    }
  } catch (err) {
    console.warn('Failed to fetch live TMDB explore pool:', err);
  }

  // Merge with local search catalog to guarantee a massive rich database
  const catalogMovies = SEARCH_CATALOG.filter((i) => i.type === 'movie');
  const catalogSeries = SEARCH_CATALOG.filter((i) => i.type === 'series');

  const mergedMovies = shuffleArray(mergeUniqueMedia(allMovies, catalogMovies));
  const mergedSeries = shuffleArray(mergeUniqueMedia(allSeries, catalogSeries));

  const poolResult: SearchResults = {
    movies: mergedMovies,
    series: mergedSeries,
    people: [],
  };

  searchCache.set(cacheKey, poolResult);
  return shuffleArray([...mergedMovies, ...mergedSeries]);
}

/**
 * Searches TMDB for Movies, TV Series, and People.
 * Falls back smoothly to local catalog if query is empty or on network disruption.
 */
export async function searchMediaAndPeople(query: string): Promise<SearchResults> {
  const cleanQuery = query.trim();

  if (!cleanQuery) {
    // Return trending/popular items or local curated fallback
    try {
      if (searchCache.has('__trending__')) {
        return searchCache.get('__trending__')!;
      }

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3500);
      const res = await fetch(
        `${TMDB_BASE_URL}/trending/all/day?api_key=${TMDB_API_KEY}&language=en-US`,
        { signal: controller.signal }
      );
      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        const results = data.results || [];
        const trendingMovies: MediaItem[] = [];
        const trendingSeries: MediaItem[] = [];

        for (const item of results) {
          if (item.media_type === 'movie' && item.title) {
            trendingMovies.push(formatMovieResult(item));
          } else if (item.media_type === 'tv' && item.name) {
            trendingSeries.push(formatTvResult(item));
          }
        }

        const fallbackPeople = FAMOUS_PEOPLE.slice(0, 4);
        const compiled = {
          movies: trendingMovies.length > 0 ? trendingMovies.slice(0, 8) : SEARCH_CATALOG.filter((i) => i.type === 'movie'),
          series: trendingSeries.length > 0 ? trendingSeries.slice(0, 8) : SEARCH_CATALOG.filter((i) => i.type === 'series'),
          people: fallbackPeople,
        };

        searchCache.set('__trending__', compiled);
        return compiled;
      }
    } catch {
      // Return local default catalog if TMDB trending fetch fails
    }

    return {
      movies: SEARCH_CATALOG.filter((i) => i.type === 'movie'),
      series: SEARCH_CATALOG.filter((i) => i.type === 'series'),
      people: FAMOUS_PEOPLE.slice(0, 4),
    };
  }

  const cacheKey = cleanQuery.toLowerCase();
  if (searchCache.has(cacheKey)) {
    return searchCache.get(cacheKey)!;
  }

  // 1. Live TMDB Multi-Search
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);
    const url = `${TMDB_BASE_URL}/search/multi?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(cleanQuery)}&include_adult=false&language=en-US&page=1`;

    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      const rawResults = data.results || [];

      const tmdbMovies: MediaItem[] = [];
      const tmdbSeries: MediaItem[] = [];
      const tmdbPeople: PersonResult[] = [];

      for (const item of rawResults) {
        if (item.media_type === 'movie') {
          if (!item.title && !item.original_title) continue;
          tmdbMovies.push(formatMovieResult(item));
        } else if (item.media_type === 'tv') {
          if (!item.name && !item.original_name) continue;
          tmdbSeries.push(formatTvResult(item));
        } else if (item.media_type === 'person') {
          if (!item.name) continue;
          const knownForTitles = (item.known_for || [])
            .map((k: any) => k.title || k.name)
            .filter(Boolean);

          tmdbPeople.push({
            id: `tmdb-person-${item.id}`,
            name: item.name,
            role:
              item.known_for_department === 'Directing'
                ? 'Director'
                : item.known_for_department === 'Writing'
                ? 'Writer'
                : 'Actor',
            knownFor: knownForTitles.length > 0 ? knownForTitles : ['Cinema'],
            photo: getTmdbProfileUrl(item.profile_path),
          });
        }
      }

      // Also check if local search catalog has exact matches not in TMDB or supplementary
      const localMatches = searchLocalCatalog(cleanQuery);
      
      // Deduplicate with local catalog (prefer TMDB results if found)
      const mergedMovies = mergeUniqueMedia(tmdbMovies, localMatches.movies);
      const mergedSeries = mergeUniqueMedia(tmdbSeries, localMatches.series);
      const mergedPeople = mergeUniquePeople(tmdbPeople, localMatches.people);

      const finalResults: SearchResults = {
        movies: mergedMovies,
        series: mergedSeries,
        people: mergedPeople,
      };

      searchCache.set(cacheKey, finalResults);
      return finalResults;
    }
  } catch (err) {
    console.warn('TMDB search error, falling back to local catalog:', err);
  }

  // Graceful fallback to local catalog
  const fallback = searchLocalCatalog(cleanQuery);
  return fallback;
}

/**
 * Format raw TMDB movie object into standardized MediaItem
 */
function formatMovieResult(m: any): MediaItem {
  const releaseYear = m.release_date
    ? m.release_date.split('-')[0] || new Date(m.release_date).getFullYear()
    : 'TBA';

  const genres = mapGenreIds(m.genre_ids, 'movie');
  const posterUrl = getTmdbPosterUrl(m.poster_path);
  const backdropUrl = getTmdbBackdropUrl(m.backdrop_path);

  return {
    id: `tmdb-movie-${m.id}`,
    tmdbId: m.id,
    title: m.title || m.original_title || 'Untitled',
    type: 'movie',
    poster: posterUrl,
    banner: backdropUrl,
    year: releaseYear,
    rating: m.vote_average ? Number(m.vote_average.toFixed(1)) : 7.0,
    runtime: '120 min', // Will be populated with exact runtime on detail fetch
    genres: genres,
    description: m.overview || 'No synopsis available for this title.',
    director: '',
    cast: [],
    status: 'not_added',
    addedAt: new Date().toISOString(),
  };
}

/**
 * Format raw TMDB TV object into standardized MediaItem
 */
function formatTvResult(t: any): MediaItem {
  const airYear = t.first_air_date
    ? t.first_air_date.split('-')[0] || new Date(t.first_air_date).getFullYear()
    : 'TBA';

  const genres = mapGenreIds(t.genre_ids, 'series');
  const posterUrl = getTmdbPosterUrl(t.poster_path);
  const backdropUrl = getTmdbBackdropUrl(t.backdrop_path);

  return {
    id: `tmdb-tv-${t.id}`,
    tmdbId: t.id,
    title: t.name || t.original_name || 'Untitled',
    type: 'series',
    poster: posterUrl,
    banner: backdropUrl,
    year: airYear,
    rating: t.vote_average ? Number(t.vote_average.toFixed(1)) : 7.5,
    runtime: '45 min/ep',
    genres: genres,
    description: t.overview || 'No synopsis available for this television series.',
    director: 'Creator',
    cast: [],
    status: 'not_added',
    totalSeasons: 1,
    totalEpisodes: 10,
    addedAt: new Date().toISOString(),
  };
}

/**
 * Fetches comprehensive details for a specific TMDB Movie or TV Series.
 * Includes accurate runtime, director, full cast list, backdrop, and seasons data.
 */
export async function fetchTmdbMediaDetails(
  tmdbId: number,
  type: MediaType
): Promise<Partial<MediaItem>> {
  const cacheKey = `${type}-${tmdbId}`;
  if (detailsCache.has(cacheKey)) {
    return detailsCache.get(cacheKey)!;
  }

  try {
    const endpoint = type === 'movie' ? 'movie' : 'tv';
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4500);

    const res = await fetch(
      `${TMDB_BASE_URL}/${endpoint}/${tmdbId}?api_key=${TMDB_API_KEY}&language=en-US&append_to_response=credits,videos,similar`,
      { signal: controller.signal }
    );
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      const credits = data.credits || {};
      const crew = credits.crew || [];
      const castMembers = (credits.cast || [])
        .slice(0, 12)
        .map((c: any) => c.name)
        .filter(Boolean);

      const castDetails = (credits.cast || []).slice(0, 12).map((c: any) => ({
        id: c.id,
        name: c.name,
        character: c.character || 'Actor',
        profilePath: getTmdbProfileUrl(c.profile_path, 'w185'),
      }));

      // Extract director / creators
      let director = '';
      if (type === 'movie') {
        const directCrew = crew.find((c: any) => c.job === 'Director');
        director = directCrew ? directCrew.name : '';
      } else {
        if (data.created_by && data.created_by.length > 0) {
          director = data.created_by.map((c: any) => c.name).join(', ');
        } else {
          const directCrew = crew.find(
            (c: any) => c.job === 'Director' || c.job === 'Executive Producer'
          );
          director = directCrew ? directCrew.name : 'Creator';
        }
      }

      // Extract writers / screenwriters
      const writers = (crew.filter((c: any) => c.job === 'Screenplay' || c.job === 'Writer' || c.job === 'Story') || [])
        .slice(0, 3)
        .map((w: any) => w.name);

      // Extract studios
      const studios = (data.production_companies || []).slice(0, 4).map((p: any) => p.name);

      // Extract trailer youtube key
      const videos = data.videos?.results || [];
      const primaryTrailer = videos.find((v: any) => v.site === 'YouTube' && v.type === 'Trailer') ||
        videos.find((v: any) => v.site === 'YouTube' && (v.type === 'Teaser' || v.type === 'Clip')) ||
        videos.find((v: any) => v.site === 'YouTube');
      const trailerYoutubeKey = primaryTrailer ? primaryTrailer.key : undefined;

      // Extract similar titles
      const similar = (data.similar?.results || []).slice(0, 8).map((s: any) => ({
        id: `tmdb-${type}-${s.id}`,
        tmdbId: s.id,
        title: s.title || s.name || 'Untitled',
        poster: getTmdbPosterUrl(s.poster_path),
        banner: getTmdbBackdropUrl(s.backdrop_path),
        year: (s.release_date || s.first_air_date || '').split('-')[0] || '2024',
        rating: s.vote_average ? Number(s.vote_average.toFixed(1)) : 7.2,
        type: type,
        genres: mapGenreIds(s.genre_ids, type),
      }));

      // Extract genres
      const genres = data.genres && data.genres.length > 0
        ? data.genres.map((g: any) => g.name)
        : type === 'movie' ? ['Feature Movie'] : ['TV Series'];

      // Extract runtime
      let runtimeStr = '';
      if (type === 'movie') {
        runtimeStr = data.runtime ? `${data.runtime} min` : '120 min';
      } else {
        const epRuntime = data.episode_run_time?.[0] || (data.last_episode_to_air?.runtime);
        runtimeStr = epRuntime ? `${epRuntime} min/ep` : '45 min/ep';
      }

      // Build structured seasons data for TV series
      let seasonsData: Season[] | undefined = undefined;
      if (type === 'series' && Array.isArray(data.seasons)) {
        seasonsData = data.seasons
          .filter((s: any) => s.season_number > 0) // Filter out specials season 0 by default for clean presentation
          .map((s: any) => {
            const epCount = s.episode_count || 10;
            return {
              seasonNumber: s.season_number,
              name: s.name || `Season ${s.season_number}`,
              episodes: Array.from({ length: epCount }).map((_, idx) => ({
                episodeNumber: idx + 1,
                title: `Episode ${idx + 1}`,
                runtime: runtimeStr,
                watched: false,
                airDate: s.air_date,
              })),
            };
          });

        if (seasonsData && seasonsData.length === 0 && data.number_of_seasons) {
          seasonsData = Array.from({ length: data.number_of_seasons }).map((_, sIdx) => ({
            seasonNumber: sIdx + 1,
            name: `Season ${sIdx + 1}`,
            episodes: Array.from({ length: 10 }).map((_, eIdx) => ({
              episodeNumber: eIdx + 1,
              title: `Episode ${eIdx + 1}`,
              runtime: runtimeStr,
              watched: false,
            })),
          }));
        }
      }

      const validSeasons = seasonsData || [];
      const calculatedEpisodes = validSeasons.reduce((acc, s) => acc + s.episodes.length, 0);

      // Default mock OTT streaming providers with realistic platform assignments
      const streamingProviders: Array<{ id: string; name: string; type: 'subscription' | 'rent' | 'free'; quality?: string }> = [];
      const genreStr = genres.join(' ').toLowerCase();
      if (genreStr.includes('sci-fi') || genreStr.includes('action') || genreStr.includes('thriller')) {
        streamingProviders.push({ id: 'netflix', name: 'Netflix', type: 'subscription', quality: '4K Ultra HD' });
        streamingProviders.push({ id: 'prime', name: 'Prime Video', type: 'rent', quality: 'HDR' });
        streamingProviders.push({ id: 'apple', name: 'Apple TV+', type: 'rent', quality: '4K Dolby Vision' });
      } else if (genreStr.includes('animation') || genreStr.includes('family')) {
        streamingProviders.push({ id: 'disney', name: 'Disney+', type: 'subscription', quality: '4K Atmos' });
        streamingProviders.push({ id: 'apple', name: 'Apple TV', type: 'rent', quality: '4K' });
      } else {
        streamingProviders.push({ id: 'max', name: 'Max (HBO)', type: 'subscription', quality: '4K UHD' });
        streamingProviders.push({ id: 'prime', name: 'Prime Video', type: 'rent', quality: 'HD' });
        streamingProviders.push({ id: 'apple', name: 'Apple TV', type: 'rent', quality: '4K' });
      }

      const details: Partial<MediaItem> = {
        tmdbId,
        title: data.title || data.name || data.original_title || data.original_name,
        poster: getTmdbPosterUrl(data.poster_path),
        banner: getTmdbBackdropUrl(data.backdrop_path),
        rating: data.vote_average ? Number(data.vote_average.toFixed(1)) : 7.5,
        runtime: runtimeStr,
        genres,
        description: data.overview || 'No synopsis available.',
        director: director || 'Director',
        cast: castMembers,
        castDetails,
        writers,
        studios,
        tagline: data.tagline || '',
        trailerYoutubeKey,
        maturityRating: type === 'movie' ? (genres.includes('Horror') || genres.includes('Crime') ? 'R' : 'PG-13') : 'TV-MA',
        streamingProviders,
        similar,
        totalSeasons: data.number_of_seasons || (validSeasons.length > 0 ? validSeasons.length : 1),
        totalEpisodes: data.number_of_episodes || (calculatedEpisodes > 0 ? calculatedEpisodes : 10),
        seasonsData,
      };

      if (type === 'movie' && data.release_date) {
        details.year = data.release_date.split('-')[0];
      } else if (type === 'series' && data.first_air_date) {
        details.year = data.first_air_date.split('-')[0];
      }

      detailsCache.set(cacheKey, details);
      return details;
    }
  } catch (err) {
    console.warn('Failed to fetch TMDB details:', err);
  }

  return {};
}

// Local search helper
function searchLocalCatalog(cleanQuery: string): SearchResults {
  const matchingMovies: MediaItem[] = [];
  const matchingSeries: MediaItem[] = [];

  for (const item of SEARCH_CATALOG) {
    const titleMatch = item.title.toLowerCase().includes(cleanQuery);
    const genreMatch = item.genres.some((g) => g.toLowerCase().includes(cleanQuery));
    const directorMatch = item.director?.toLowerCase().includes(cleanQuery);
    const castMatch = item.cast?.some((c) => c.toLowerCase().includes(cleanQuery));

    if (titleMatch || genreMatch || directorMatch || castMatch) {
      if (item.type === 'movie') {
        matchingMovies.push(item);
      } else {
        matchingSeries.push(item);
      }
    }
  }

  const matchingPeople = FAMOUS_PEOPLE.filter(
    (p) =>
      p.name.toLowerCase().includes(cleanQuery) ||
      p.role.toLowerCase().includes(cleanQuery) ||
      p.knownFor.some((k) => k.toLowerCase().includes(cleanQuery))
  );

  return {
    movies: matchingMovies,
    series: matchingSeries,
    people: matchingPeople,
  };
}

function mergeUniqueMedia(primary: MediaItem[], secondary: MediaItem[]): MediaItem[] {
  const titles = new Set<string>();
  const merged: MediaItem[] = [];

  for (const item of primary) {
    const norm = item.title.toLowerCase().trim();
    if (!titles.has(norm)) {
      titles.add(norm);
      merged.push(item);
    }
  }

  for (const item of secondary) {
    const norm = item.title.toLowerCase().trim();
    if (!titles.has(norm)) {
      titles.add(norm);
      merged.push(item);
    }
  }

  return merged;
}

function mergeUniquePeople(primary: PersonResult[], secondary: PersonResult[]): PersonResult[] {
  const names = new Set<string>();
  const merged: PersonResult[] = [];

  for (const p of primary) {
    const norm = p.name.toLowerCase().trim();
    if (!names.has(norm)) {
      names.add(norm);
      merged.push(p);
    }
  }

  for (const p of secondary) {
    const norm = p.name.toLowerCase().trim();
    if (!names.has(norm)) {
      names.add(norm);
      merged.push(p);
    }
  }

  return merged;
}
