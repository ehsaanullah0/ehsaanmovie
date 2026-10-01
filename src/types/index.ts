export type MediaType = 'movie' | 'series';

export type WatchStatus = 'not_added' | 'watchlist' | 'watching' | 'watched';

export interface Episode {
  episodeNumber: number;
  title: string;
  runtime?: string;
  watched: boolean;
  airDate?: string;
  overview?: string;
}

export interface Season {
  seasonNumber: number;
  name: string;
  episodes: Episode[];
}

export interface MediaItem {
  id: string;
  tmdbId?: number;
  title: string;
  type: MediaType;
  poster: string;
  banner?: string;
  year: number | string;
  rating: number; // 0 - 10
  runtime: string; // e.g. "169 min" or "55 min/ep"
  genres: string[];
  description: string;
  director: string;
  cast: string[];
  status: WatchStatus;
  userRating?: number; // 1 - 10
  userNotes?: string;
  isFavorite?: boolean;
  customLists?: string[]; // IDs of CustomList
  tags?: string[];
  addedAt: string;
  updatedAt?: string;
  watchedAt?: string;
  // Movie progress
  progressPercentage?: number; // 0 - 100
  watchedDurationMinutes?: number;
  // Series progress
  totalSeasons?: number;
  totalEpisodes?: number;
  currentSeason?: number;
  currentEpisode?: number;
  seasonsData?: Season[];
  // Enhanced OTT fields
  tagline?: string;
  trailerYoutubeKey?: string;
  maturityRating?: string; // e.g. "PG-13", "R", "TV-MA"
  studios?: string[];
  writers?: string[];
  castDetails?: Array<{
    id: number;
    name: string;
    character: string;
    profilePath?: string;
  }>;
  streamingProviders?: Array<{
    id: string;
    name: string;
    type: 'subscription' | 'rent' | 'free';
    quality?: string;
  }>;
  similar?: Array<{
    id: string;
    tmdbId?: number;
    title: string;
    poster: string;
    banner?: string;
    year: string | number;
    rating: number;
    type: MediaType;
    genres?: string[];
  }>;
}

export interface CustomList {
  id: string;
  name: string;
  icon: string;
  description?: string;
  createdAt: string;
}

export interface UserActivity {
  id: string;
  type: 'added' | 'status_changed' | 'rated' | 'list_added' | 'progress_updated';
  title: string;
  mediaId: string;
  mediaTitle: string;
  mediaType: MediaType;
  poster: string;
  details: string;
  timestamp: string;
}

export type ActiveView = 
  | 'home'
  | 'watchlist'
  | 'collection'
  | 'movies'
  | 'series'
  | 'search'
  | 'settings'
  | 'list'
  | 'lists';

export type GenrePillStyle = 'solid' | 'soft' | 'outline' | 'gradient';
export type GenreBadgeSize = 'xs' | 'sm' | 'md' | 'lg';
