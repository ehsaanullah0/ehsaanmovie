import React, { createContext, useContext, useState, useEffect } from 'react';
import { MediaItem, CustomList, UserActivity, WatchStatus, ActiveView, GenrePillStyle, GenreBadgeSize } from '../types';
import {
  INITIAL_MEDIA_ITEMS,
  INITIAL_CUSTOM_LISTS,
  INITIAL_USER_ACTIVITIES,
  YOU_MAY_LIKE_LIST_ID,
  YOU_MAY_LIKE_PRELOADED_ITEMS,
} from '../data/initialData';
import { STANDARD_GENRES, DEFAULT_GENRE_COLOR } from '../utils/genreColors';

interface CollectionContextType {
  // Theme
  theme: 'dark' | 'light';
  setTheme: (t: 'dark' | 'light') => void;
  toggleTheme: () => void;

  // User Profile
  userName: string;
  setUserName: (name: string) => void;
  userAvatar: string | null;
  setUserAvatar: (avatar: string | null) => void;

  // Sidebar Layout State
  isSidebarCollapsed: boolean;
  setIsSidebarCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
  isCustomListsCollapsed: boolean;
  setIsCustomListsCollapsed: React.Dispatch<React.SetStateAction<boolean>>;

  // View Navigation
  activeView: ActiveView;
  setActiveView: (view: ActiveView) => void;
  activeListId: string | null;
  setActiveListId: (id: string | null) => void;

  // Data
  items: MediaItem[];
  customLists: CustomList[];
  activities: UserActivity[];

  // Computed Stats
  stats: {
    total: number;
    watchlist: number;
    watched: number;
    watching: number;
    moviesCount: number;
    seriesCount: number;
  };

  // Actions
  addItem: (item: Partial<MediaItem>, status?: WatchStatus) => MediaItem;
  updateItemStatus: (id: string, status: WatchStatus) => void;
  updateItem: (id: string, updates: Partial<MediaItem>) => void;
  removeItem: (id: string) => void;
  toggleFavorite: (id: string) => void;
  updateProgress: (id: string, percentage: number) => void;
  toggleEpisodeWatched: (mediaId: string, seasonNumber: number, episodeNumber: number) => void;
  toggleSeasonAllEpisodes: (mediaId: string, seasonNumber: number, forceWatched?: boolean) => void;
  setMediaRating: (id: string, rating: number) => void;
  setMediaNotes: (id: string, notes: string) => void;
  
  // Custom Lists
  createCustomList: (name: string, icon: string, description?: string) => CustomList;
  updateCustomList: (id: string, name: string, icon: string, description?: string) => void;
  deleteCustomList: (id: string) => void;
  toggleItemInList: (itemOrId: string | MediaItem, listId: string) => boolean;

  // Modals & UI Controls
  selectedMedia: MediaItem | null;
  setSelectedMedia: (item: MediaItem | null) => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  isListModalOpen: boolean;
  setIsListModalOpen: (open: boolean) => void;
  editingList: CustomList | null;
  setEditingList: (list: CustomList | null) => void;
  progressModalItem: MediaItem | null;
  setProgressModalItem: (item: MediaItem | null) => void;

  // Import / Export
  exportCollectionJson: () => string;
  importCollectionJson: (jsonString: string) => { success: boolean; message: string };
  resetToDefaultData: () => void;
  removeAllData: () => void;

  // Batch Selection & Deletion Feature
  isBatchSelectEnabled: boolean;
  setIsBatchSelectEnabled: (enabled: boolean) => void;
  selectedItems: Set<string>;
  setSelectedItems: (items: Set<string>) => void;
  deleteMultipleItems: (ids: string[]) => void;

  // Movie Preview Artwork Setting
  showPreviewArtwork: boolean;
  setShowPreviewArtwork: (show: boolean) => void;
  previewArtworkOpacity: number;
  setPreviewArtworkOpacity: (opacity: number) => void;

  // Preview Window Minimalist Element Toggles
  previewShowTagline: boolean;
  setPreviewShowTagline: (show: boolean) => void;
  previewShowGenres: boolean;
  setPreviewShowGenres: (show: boolean) => void;
  previewShowMatchScore: boolean;
  setPreviewShowMatchScore: (show: boolean) => void;
  previewShowRatingBadge: boolean;
  setPreviewShowRatingBadge: (show: boolean) => void;
  previewShowQualityBadge: boolean;
  setPreviewShowQualityBadge: (show: boolean) => void;
  previewShowTrailerButton: boolean;
  setPreviewShowTrailerButton: (show: boolean) => void;
  previewShowCuratedListButton: boolean;
  setPreviewShowCuratedListButton: (show: boolean) => void;
  previewShowSynopsis: boolean;
  setPreviewShowSynopsis: (show: boolean) => void;
  previewShowProviders: boolean;
  setPreviewShowProviders: (show: boolean) => void;
  previewShowTitleCard: boolean;
  setPreviewShowTitleCard: (show: boolean) => void;
  previewShowDetailsButton: boolean;
  setPreviewShowDetailsButton: (show: boolean) => void;

  // Offline Local Storage Copy Feature
  saveLocalOfflineCopy: () => { success: boolean; message: string; timestamp: string; count: number };
  loadLocalOfflineCopy: () => { success: boolean; message: string };
  lastOfflineSavedAt: string | null;
  offlineCopyCount: number;
  isOffline: boolean;

  // First-Visit Welcome Experience (EHSAAN STUDIO)
  showWelcomeModal: boolean;
  openWelcomeModal: () => void;
  dismissWelcomeModal: () => void;

  // Custom Genre Colors & Look
  genreColors: Record<string, string>;
  setGenreColors: (colors: Record<string, string>) => void;
  updateGenreColor: (genre: string, color: string) => void;
  resetGenreColors: () => void;
  genrePillStyle: GenrePillStyle;
  setGenrePillStyle: (style: GenrePillStyle) => void;
  genreBadgeSize: GenreBadgeSize;
  setGenreBadgeSize: (size: GenreBadgeSize) => void;
}

const STORAGE_KEYS = {
  THEME: 'ehsaan_movie_theme',
  ITEMS: 'ehsaan_movie_items_v1',
  LISTS: 'ehsaan_movie_lists_v1',
  ACTIVITIES: 'ehsaan_movie_activities_v1',
  USER_NAME: 'ehsaan_movie_user_name_v1',
  USER_AVATAR: 'ehsaan_movie_user_avatar_v1',
  SIDEBAR_COLLAPSED: 'ehsaan_movie_sidebar_collapsed_v1',
  CUSTOM_LISTS_COLLAPSED: 'ehsaan_movie_custom_lists_collapsed_v1',
  GENRE_COLORS: 'ehsaan_movie_genre_colors_v1',
  GENRE_PILL_STYLE: 'ehsaan_movie_genre_pill_style_v1',
  GENRE_BADGE_SIZE: 'ehsaan_movie_genre_badge_size_v1',
  OFFLINE_VAULT: 'ehsaan_movie_offline_vault_v1',
  OFFLINE_SAVED_AT: 'ehsaan_movie_offline_saved_at_v1',
  OFFLINE_COUNT: 'ehsaan_movie_offline_count_v1',
};

const CollectionContext = createContext<CollectionContextType | undefined>(undefined);

export const CollectionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Theme state: defaults to 'light'
  const [theme, setThemeState] = useState<'dark' | 'light'>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEYS.THEME);
      if (saved === 'light' || saved === 'dark') return saved;
    }
    return 'dark';
  });

  // User Profile
  const [userName, setUserNameState] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEYS.USER_NAME);
      if (saved) return saved;
    }
    return 'Ehsaan';
  });

  const [userAvatar, setUserAvatarState] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(STORAGE_KEYS.USER_AVATAR);
    }
    return null;
  });

  const setUserName = (name: string) => {
    const trimmed = name.trim() || 'Ehsaan';
    setUserNameState(trimmed);
    localStorage.setItem(STORAGE_KEYS.USER_NAME, trimmed);
  };

  const setUserAvatar = (avatar: string | null) => {
    setUserAvatarState(avatar);
    if (avatar) {
      localStorage.setItem(STORAGE_KEYS.USER_AVATAR, avatar);
    } else {
      localStorage.removeItem(STORAGE_KEYS.USER_AVATAR);
    }
  };

  // Sidebar Layout States: defaults to collapsed (true)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEYS.SIDEBAR_COLLAPSED);
      if (saved !== null) return saved === 'true';
    }
    return true;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SIDEBAR_COLLAPSED, String(isSidebarCollapsed));
  }, [isSidebarCollapsed]);

  const [isCustomListsCollapsed, setIsCustomListsCollapsed] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(STORAGE_KEYS.CUSTOM_LISTS_COLLAPSED) === 'true';
    }
    return false;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CUSTOM_LISTS_COLLAPSED, String(isCustomListsCollapsed));
  }, [isCustomListsCollapsed]);

  // Batch Selection Feature State
  const [isBatchSelectEnabled, setIsBatchSelectEnabledState] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('ehsaan_movie_batch_select_enabled') === 'true';
    }
    return false;
  });

  const setIsBatchSelectEnabled = (enabled: boolean) => {
    setIsBatchSelectEnabledState(enabled);
    localStorage.setItem('ehsaan_movie_batch_select_enabled', String(enabled));
  };

  // Movie Preview Artwork setting state
  const [showPreviewArtwork, setShowPreviewArtworkState] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('ehsaan_movie_show_preview_artwork');
      if (saved !== null) return saved === 'true';
    }
    return true;
  });

  const setShowPreviewArtwork = (show: boolean) => {
    setShowPreviewArtworkState(show);
    localStorage.setItem('ehsaan_movie_show_preview_artwork', String(show));
  };

  const [previewArtworkOpacity, setPreviewArtworkOpacityState] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('ehsaan_movie_preview_artwork_opacity');
      if (saved !== null) {
        const num = parseInt(saved, 10);
        if (!isNaN(num)) return Math.min(100, Math.max(0, num));
      }
    }
    return 100;
  });

  const setPreviewArtworkOpacity = (opacity: number) => {
    const clamped = Math.min(100, Math.max(0, opacity));
    setPreviewArtworkOpacityState(clamped);
    localStorage.setItem('ehsaan_movie_preview_artwork_opacity', String(clamped));
  };

  // Preview Window Customization States (stored in localStorage)
  const [previewShowTagline, setPreviewShowTaglineState] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('ehsaan_preview_show_tagline');
      if (saved !== null) return saved === 'true';
    }
    return false; // tagline disabled by default
  });
  const setPreviewShowTagline = (show: boolean) => {
    setPreviewShowTaglineState(show);
    localStorage.setItem('ehsaan_preview_show_tagline', String(show));
  };

  const [previewShowGenres, setPreviewShowGenresState] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('ehsaan_preview_show_genres');
      if (saved !== null) return saved === 'true';
    }
    return true; // genres enabled by default
  });
  const setPreviewShowGenres = (show: boolean) => {
    setPreviewShowGenresState(show);
    localStorage.setItem('ehsaan_preview_show_genres', String(show));
  };

  const [previewShowMatchScore, setPreviewShowMatchScoreState] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('ehsaan_preview_show_match');
      if (saved !== null) return saved === 'true';
    }
    return false; // match score disabled by default
  });
  const setPreviewShowMatchScore = (show: boolean) => {
    setPreviewShowMatchScoreState(show);
    localStorage.setItem('ehsaan_preview_show_match', String(show));
  };

  const [previewShowRatingBadge, setPreviewShowRatingBadgeState] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('ehsaan_preview_show_rating');
      if (saved !== null) return saved === 'true';
    }
    return true; // rating badge enabled by default
  });
  const setPreviewShowRatingBadge = (show: boolean) => {
    setPreviewShowRatingBadgeState(show);
    localStorage.setItem('ehsaan_preview_show_rating', String(show));
  };

  const [previewShowQualityBadge, setPreviewShowQualityBadgeState] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('ehsaan_preview_show_quality');
      if (saved !== null) return saved === 'true';
    }
    return false; // quality badge disabled by default
  });
  const setPreviewShowQualityBadge = (show: boolean) => {
    setPreviewShowQualityBadgeState(show);
    localStorage.setItem('ehsaan_preview_show_quality', String(show));
  };

  const [previewShowTrailerButton, setPreviewShowTrailerButtonState] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('ehsaan_preview_show_trailer');
      if (saved !== null) return saved === 'true';
    }
    return false; // trailer button disabled by default
  });
  const setPreviewShowTrailerButton = (show: boolean) => {
    setPreviewShowTrailerButtonState(show);
    localStorage.setItem('ehsaan_preview_show_trailer', String(show));
  };

  const [previewShowCuratedListButton, setPreviewShowCuratedListButtonState] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('ehsaan_preview_show_curated');
      if (saved !== null) return saved === 'true';
    }
    return false; // curated list button disabled by default
  });
  const setPreviewShowCuratedListButton = (show: boolean) => {
    setPreviewShowCuratedListButtonState(show);
    localStorage.setItem('ehsaan_preview_show_curated', String(show));
  };

  const [previewShowSynopsis, setPreviewShowSynopsisState] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('ehsaan_preview_show_synopsis');
      if (saved !== null) return saved === 'true';
    }
    return false; // synopsis disabled by default
  });
  const setPreviewShowSynopsis = (show: boolean) => {
    setPreviewShowSynopsisState(show);
    localStorage.setItem('ehsaan_preview_show_synopsis', String(show));
  };

  const [previewShowProviders, setPreviewShowProvidersState] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('ehsaan_preview_show_providers');
      if (saved !== null) return saved === 'true';
    }
    return false; // providers disabled by default
  });
  const setPreviewShowProviders = (show: boolean) => {
    setPreviewShowProvidersState(show);
    localStorage.setItem('ehsaan_preview_show_providers', String(show));
  };

  // Preview Window Title Background Card Toggle State
  const [previewShowTitleCard, setPreviewShowTitleCardState] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('ehsaan_preview_show_title_card');
      if (saved !== null) return saved === 'true';
    }
    return false; // title card disabled by default
  });
  const setPreviewShowTitleCard = (show: boolean) => {
    setPreviewShowTitleCardState(show);
    localStorage.setItem('ehsaan_preview_show_title_card', String(show));
  };

  // Preview Window Details Button Toggle State
  const [previewShowDetailsButton, setPreviewShowDetailsButtonState] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('ehsaan_preview_show_details_button');
      if (saved !== null) return saved === 'true';
    }
    return false; // details button disabled by default
  });
  const setPreviewShowDetailsButton = (show: boolean) => {
    setPreviewShowDetailsButtonState(show);
    localStorage.setItem('ehsaan_preview_show_details_button', String(show));
  };

  // First-Visit Welcome Experience State (EHSAAN STUDIO)
  const [showWelcomeModal, setShowWelcomeModal] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const seen = localStorage.getItem('ehsaanStudioWelcomeSeen');
      return seen !== 'true';
    }
    return false;
  });

  const openWelcomeModal = () => {
    setShowWelcomeModal(true);
  };

  const dismissWelcomeModal = () => {
    setShowWelcomeModal(false);
    if (typeof window !== 'undefined') {
      localStorage.setItem('ehsaanStudioWelcomeSeen', 'true');
    }
  };

  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());

  const deleteMultipleItems = (ids: string[]) => {
    setItems((prev) => prev.filter((item) => !ids.includes(item.id)));
  };

  const removeAllData = () => {
    setItems([]);
    setCustomLists([]);
    setActivities([]);
    localStorage.removeItem(STORAGE_KEYS.ITEMS);
    localStorage.removeItem(STORAGE_KEYS.LISTS);
    localStorage.removeItem(STORAGE_KEYS.ACTIVITIES);
  };

  // Custom Genre Colors & Pill Style State
  const [genreColors, setGenreColorsState] = useState<Record<string, string>>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(STORAGE_KEYS.GENRE_COLORS);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (typeof parsed === 'object' && parsed !== null) {
            return parsed;
          }
        }
      } catch (e) {
        console.error('Failed to parse genre colors from storage:', e);
      }
    }
    return STANDARD_GENRES.reduce((acc, g) => ({ ...acc, [g]: DEFAULT_GENRE_COLOR }), {});
  });

  const setGenreColors = (colors: Record<string, string>) => {
    setGenreColorsState(colors);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.GENRE_COLORS, JSON.stringify(colors));
    }
  };

  const updateGenreColor = (genre: string, color: string) => {
    setGenreColorsState((prev) => {
      const next = { ...prev, [genre]: color };
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEYS.GENRE_COLORS, JSON.stringify(next));
      }
      return next;
    });
  };

  const [genrePillStyle, setGenrePillStyleState] = useState<GenrePillStyle>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEYS.GENRE_PILL_STYLE) as GenrePillStyle;
      if (saved && ['solid', 'soft', 'outline', 'gradient'].includes(saved)) {
        return saved;
      }
    }
    return 'solid';
  });

  const setGenrePillStyle = (style: GenrePillStyle) => {
    setGenrePillStyleState(style);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.GENRE_PILL_STYLE, style);
    }
  };

  const [genreBadgeSize, setGenreBadgeSizeState] = useState<GenreBadgeSize>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEYS.GENRE_BADGE_SIZE) as GenreBadgeSize;
      if (saved && ['xs', 'sm', 'md', 'lg'].includes(saved)) {
        return saved;
      }
    }
    return 'sm';
  });

  const setGenreBadgeSize = (size: GenreBadgeSize) => {
    setGenreBadgeSizeState(size);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.GENRE_BADGE_SIZE, size);
    }
  };

  const resetGenreColors = () => {
    const defaultMap = STANDARD_GENRES.reduce((acc, g) => ({ ...acc, [g]: DEFAULT_GENRE_COLOR }), {});
    setGenreColorsState(defaultMap);
    setGenrePillStyleState('solid');
    setGenreBadgeSizeState('sm');
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.GENRE_COLORS, JSON.stringify(defaultMap));
      localStorage.setItem(STORAGE_KEYS.GENRE_PILL_STYLE, 'solid');
      localStorage.setItem(STORAGE_KEYS.GENRE_BADGE_SIZE, 'sm');
    }
  };

  // Apply theme to <html> and <body> elements
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.setAttribute('data-theme', 'dark');
      document.body.classList.add('dark');
    } else {
      root.classList.remove('dark');
      root.setAttribute('data-theme', 'light');
      document.body.classList.remove('dark');
    }
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
  }, [theme]);

  const setTheme = (newTheme: 'dark' | 'light') => {
    setThemeState(newTheme);
  };

  const toggleTheme = () => {
    setThemeState((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Active View
  const [activeView, setActiveView] = useState<ActiveView>('home');
  const [activeListId, setActiveListId] = useState<string | null>(null);

  // Modals state
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isListModalOpen, setIsListModalOpen] = useState(false);
  const [editingList, setEditingList] = useState<CustomList | null>(null);
  const [progressModalItem, setProgressModalItem] = useState<MediaItem | null>(null);

  // Items State (Prioritizes localStorage, falls back to saved offline vault if available)
  const deduplicateMediaItems = (raw: MediaItem[]): MediaItem[] => {
    if (!Array.isArray(raw)) return [];
    const seen = new Set<string>();
    const result: MediaItem[] = [];
    for (const item of raw) {
      if (item && item.id) {
        if (!seen.has(item.id)) {
          seen.add(item.id);
          result.push(item);
        }
      }
    }
    return result;
  };

  const [items, setItems] = useState<MediaItem[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(STORAGE_KEYS.ITEMS);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            return deduplicateMediaItems(parsed);
          }
        }
        // Fallback to offline vault
        const rawVault = localStorage.getItem(STORAGE_KEYS.OFFLINE_VAULT);
        if (rawVault) {
          const vault = JSON.parse(rawVault);
          if (Array.isArray(vault.items) && vault.items.length > 0) {
            return deduplicateMediaItems(vault.items);
          }
        }
      } catch (e) {
        console.error('Failed to load items from storage:', e);
      }
    }
    return deduplicateMediaItems(INITIAL_MEDIA_ITEMS);
  });

  // Custom Lists State (falls back to saved offline vault)
  const [customLists, setCustomLists] = useState<CustomList[]>(() => {
    const OLD_EMPTY_DEFAULT_LIST_IDS = new Set([
      'list-weekend',
      'list-favorites',
      'list-nolan',
      'list-horror',
      'list-later',
    ]);

    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(STORAGE_KEYS.LISTS);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            return parsed
              .filter((l: CustomList) => !OLD_EMPTY_DEFAULT_LIST_IDS.has(l.id))
              .map((l: CustomList) => ({ ...l, icon: '' }));
          }
        }
        const rawVault = localStorage.getItem(STORAGE_KEYS.OFFLINE_VAULT);
        if (rawVault) {
          const vault = JSON.parse(rawVault);
          if (Array.isArray(vault.customLists) && vault.customLists.length > 0) {
            return vault.customLists
              .filter((l: CustomList) => !OLD_EMPTY_DEFAULT_LIST_IDS.has(l.id))
              .map((l: CustomList) => ({ ...l, icon: '' }));
          }
        }
      } catch (e) {
        console.error('Failed to load lists from storage:', e);
      }
    }
    return INITIAL_CUSTOM_LISTS;
  });

  // User Activities State
  const [activities, setActivities] = useState<UserActivity[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(STORAGE_KEYS.ACTIVITIES);
        if (saved) return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to load activities from storage:', e);
      }
    }
    return INITIAL_USER_ACTIVITIES;
  });

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ITEMS, JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.LISTS, JSON.stringify(customLists));
  }, [customLists]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(activities));
  }, [activities]);

  // Guarantee preloaded "YOU MAY LIKE" list and its 10 +8.5 rated movies/series exist, while removing empty default lists and stickers
  useEffect(() => {
    const OLD_EMPTY_DEFAULT_LIST_IDS = new Set([
      'list-weekend',
      'list-favorites',
      'list-nolan',
      'list-horror',
      'list-later',
    ]);

    // 1. Ensure list exists in customLists and remove empty default lists
    setCustomLists((prevLists) => {
      const filtered = prevLists
        .filter((l) => !OLD_EMPTY_DEFAULT_LIST_IDS.has(l.id))
        .map((l) => ({ ...l, icon: '' }));

      const exists = filtered.some(
        (l) => l.id === YOU_MAY_LIKE_LIST_ID || l.name.trim().toUpperCase() === 'YOU MAY LIKE'
      );

      if (exists) {
        return filtered.map((l) =>
          l.id === YOU_MAY_LIKE_LIST_ID || l.name.trim().toUpperCase() === 'YOU MAY LIKE'
            ? { ...l, name: 'YOU MAY LIKE', icon: '' }
            : l
        );
      }

      const youMayLikeList: CustomList = {
        id: YOU_MAY_LIKE_LIST_ID,
        name: 'YOU MAY LIKE',
        icon: '',
        description: 'Handpicked cinema masterpieces and prestige series with 8.5+ ratings.',
        createdAt: '2026-09-01T10:00:00.000Z',
      };
      return [youMayLikeList, ...filtered];
    });

    // 2. Ensure all 10 +8.5 rated items are in items and tagged with YOU_MAY_LIKE_LIST_ID
    setItems((prevItems) => {
      let changed = false;
      const updated = [...prevItems];

      YOU_MAY_LIKE_PRELOADED_ITEMS.forEach((preItem) => {
        const existingIdx = updated.findIndex(
          (i) =>
            i.id === preItem.id ||
            (preItem.tmdbId && i.tmdbId === preItem.tmdbId) ||
            i.title.toLowerCase() === preItem.title.toLowerCase()
        );

        if (existingIdx >= 0) {
          const item = updated[existingIdx];
          const lists = item.customLists || [];
          if (!lists.includes(YOU_MAY_LIKE_LIST_ID)) {
            updated[existingIdx] = {
              ...item,
              customLists: [...lists, YOU_MAY_LIKE_LIST_ID],
              rating: Math.max(item.rating || 0, preItem.rating),
            };
            changed = true;
          }
        } else {
          updated.push(preItem);
          changed = true;
        }
      });

      return deduplicateMediaItems(changed ? updated : prevItems);
    });
  }, []);

  // Helper to add activity
  const recordActivity = (activity: Omit<UserActivity, 'id' | 'timestamp'>) => {
    const newAct: UserActivity = {
      ...activity,
      id: `act-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      timestamp: 'Just now',
    };
    setActivities((prev) => [newAct, ...prev.slice(0, 19)]);
  };

  // Computed statistics
  const stats = {
    total: items.length,
    watchlist: items.filter((i) => i.status === 'watchlist').length,
    watched: items.filter((i) => i.status === 'watched').length,
    watching: items.filter((i) => i.status === 'watching').length,
    moviesCount: items.filter((i) => i.type === 'movie').length,
    seriesCount: items.filter((i) => i.type === 'series').length,
  };

  // Add Item to Collection
  const addItem = (itemData: Partial<MediaItem>, status: WatchStatus = 'watchlist'): MediaItem => {
    // Check if item already exists by ID, TMDB ID or title
    const existing = items.find(
      (i) =>
        (itemData.id && i.id === itemData.id) ||
        (itemData.tmdbId && i.tmdbId === itemData.tmdbId) ||
        i.title.toLowerCase() === itemData.title?.toLowerCase()
    );

    if (existing) {
      updateItemStatus(existing.id, status);
      return existing;
    }

    const newItem: MediaItem = {
      id: itemData.id || (itemData.tmdbId ? `tmdb-${itemData.type || 'movie'}-${itemData.tmdbId}` : `item-${Date.now()}`),
      tmdbId: itemData.tmdbId,
      title: itemData.title || 'Untitled',
      type: itemData.type || 'movie',
      poster: itemData.poster || '',
      banner: itemData.banner || '',
      year: itemData.year || new Date().getFullYear(),
      rating: itemData.rating || 8.0,
      runtime: itemData.runtime || (itemData.type === 'series' ? '45 min/ep' : '120 min'),
      genres: itemData.genres || ['Drama'],
      description: itemData.description || 'No description provided.',
      director: itemData.director || 'Director',
      cast: itemData.cast || [],
      status: status,
      userRating: itemData.userRating || 0,
      userNotes: itemData.userNotes || '',
      isFavorite: itemData.isFavorite || false,
      customLists: itemData.customLists || [],
      tags: itemData.tags || [],
      addedAt: new Date().toISOString(),
      progressPercentage: status === 'watched' ? 100 : status === 'watching' ? 25 : 0,
      totalSeasons: itemData.totalSeasons || (itemData.type === 'series' ? 1 : undefined),
      totalEpisodes: itemData.totalEpisodes || (itemData.type === 'series' ? 10 : undefined),
      currentSeason: itemData.type === 'series' ? 1 : undefined,
      currentEpisode: itemData.type === 'series' ? 1 : undefined,
      seasonsData: itemData.seasonsData,
    };

    setItems((prev) => [newItem, ...prev]);

    recordActivity({
      type: 'added',
      title: status === 'watchlist' ? 'Added to Watchlist' : 'Added to Collection',
      mediaId: newItem.id,
      mediaTitle: newItem.title,
      mediaType: newItem.type,
      poster: newItem.poster,
      details: `Saved as ${status.replace('_', ' ')}`,
    });

    return newItem;
  };

  // Update Status
  const updateItemStatus = (id: string, status: WatchStatus) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const updated: MediaItem = {
            ...item,
            status,
            updatedAt: new Date().toISOString(),
            watchedAt: status === 'watched' ? new Date().toISOString() : item.watchedAt,
            progressPercentage:
              status === 'watched'
                ? 100
                : status === 'watching' && (!item.progressPercentage || item.progressPercentage === 0)
                ? 25
                : item.progressPercentage,
          };

          recordActivity({
            type: 'status_changed',
            title:
              status === 'watched'
                ? 'Marked as Watched'
                : status === 'watching'
                ? 'Started Watching'
                : status === 'watchlist'
                ? 'Moved to Watchlist'
                : 'Status Updated',
            mediaId: item.id,
            mediaTitle: item.title,
            mediaType: item.type,
            poster: item.poster,
            details: `Status is now ${status.replace('_', ' ')}`,
          });

          // Sync selectedMedia if open
          if (selectedMedia && selectedMedia.id === id) {
            setSelectedMedia(updated);
          }

          return updated;
        }
        return item;
      })
    );
  };

  // Update Item fields
  const updateItem = (id: string, updates: Partial<MediaItem>) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const updated = { ...item, ...updates, updatedAt: new Date().toISOString() };
          if (selectedMedia && selectedMedia.id === id) {
            setSelectedMedia(updated);
          }
          return updated;
        }
        return item;
      })
    );
  };

  // Remove Item
  const removeItem = (id: string) => {
    const item = items.find((i) => i.id === id);
    if (!item) return;

    setItems((prev) => prev.filter((i) => i.id !== id));
    if (selectedMedia && selectedMedia.id === id) {
      setSelectedMedia(null);
    }
  };

  // Toggle Favorite
  const toggleFavorite = (id: string) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const isFav = !item.isFavorite;
          const updated = { ...item, isFavorite: isFav };
          if (selectedMedia && selectedMedia.id === id) {
            setSelectedMedia(updated);
          }
          return updated;
        }
        return item;
      })
    );
  };

  // Update Progress
  const updateProgress = (id: string, percentage: number) => {
    const clamped = Math.max(0, Math.min(100, Math.round(percentage)));
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const newStatus: WatchStatus =
            clamped >= 100 ? 'watched' : clamped > 0 ? 'watching' : item.status;
          const updated: MediaItem = {
            ...item,
            progressPercentage: clamped,
            status: newStatus,
            updatedAt: new Date().toISOString(),
          };

          if (selectedMedia && selectedMedia.id === id) {
            setSelectedMedia(updated);
          }

          recordActivity({
            type: 'progress_updated',
            title: 'Updated Progress',
            mediaId: item.id,
            mediaTitle: item.title,
            mediaType: item.type,
            poster: item.poster,
            details: `Progress set to ${clamped}%`,
          });

          return updated;
        }
        return item;
      })
    );
  };

  // Series Episode Tracking
  const toggleEpisodeWatched = (mediaId: string, seasonNumber: number, episodeNumber: number) => {
    setItems((prev) => {
      let workingPrev = [...prev];
      const exists = workingPrev.some((i) => i.id === mediaId);

      if (!exists && selectedMedia && selectedMedia.id === mediaId) {
        const newItem: MediaItem = {
          ...selectedMedia,
          status: 'watching',
          addedAt: new Date().toISOString(),
          seasonsData: selectedMedia.seasonsData || [
            {
              seasonNumber: 1,
              name: 'Season 1',
              episodes: Array.from({ length: 10 }).map((_, idx) => ({
                episodeNumber: idx + 1,
                title: `Episode ${idx + 1}`,
                watched: idx + 1 === episodeNumber,
              })),
            },
          ],
        };
        workingPrev = [newItem, ...workingPrev];
      }

      return workingPrev.map((item) => {
        if (item.id !== mediaId || !item.seasonsData) return item;

        let totalEpisodesCount = 0;
        let watchedEpisodesCount = 0;

        const newSeasonsData = item.seasonsData.map((season) => {
          if (season.seasonNumber !== seasonNumber) {
            season.episodes.forEach((ep) => {
              totalEpisodesCount++;
              if (ep.watched) watchedEpisodesCount++;
            });
            return season;
          }

          const newEpisodes = season.episodes.map((ep) => {
            totalEpisodesCount++;
            if (ep.episodeNumber === episodeNumber) {
              const newWatched = !ep.watched;
              if (newWatched) watchedEpisodesCount++;
              return { ...ep, watched: newWatched };
            }
            if (ep.watched) watchedEpisodesCount++;
            return ep;
          });

          return { ...season, episodes: newEpisodes };
        });

        const newProgress =
          totalEpisodesCount > 0
            ? Math.round((watchedEpisodesCount / totalEpisodesCount) * 100)
            : item.progressPercentage || 0;

        const newStatus: WatchStatus =
          newProgress >= 100 ? 'watched' : newProgress > 0 ? 'watching' : item.status;

        const updated: MediaItem = {
          ...item,
          seasonsData: newSeasonsData,
          progressPercentage: newProgress,
          currentSeason: seasonNumber,
          currentEpisode: episodeNumber,
          status: newStatus,
          updatedAt: new Date().toISOString(),
        };

        if (selectedMedia && selectedMedia.id === mediaId) {
          setSelectedMedia(updated);
        }

        recordActivity({
          type: 'progress_updated',
          title: 'Watched Episode',
          mediaId: item.id,
          mediaTitle: item.title,
          mediaType: 'series',
          poster: item.poster,
          details: `S${seasonNumber} E${episodeNumber} ${
            newProgress >= 100 ? '(Series Completed!)' : `(${newProgress}%)`
          }`,
        });

        return updated;
      });
    });
  };

  // Mark all episodes in a season as watched (atomic update)
  const toggleSeasonAllEpisodes = (mediaId: string, seasonNumber: number, forceWatched?: boolean) => {
    setItems((prev) => {
      let workingPrev = [...prev];
      const exists = workingPrev.some((i) => i.id === mediaId);

      if (!exists && selectedMedia && (selectedMedia.id === mediaId || String(selectedMedia.tmdbId) === mediaId)) {
        const newItem: MediaItem = {
          ...selectedMedia,
          status: 'watching',
          addedAt: new Date().toISOString(),
          seasonsData: selectedMedia.seasonsData || [
            {
              seasonNumber: seasonNumber,
              name: `Season ${seasonNumber}`,
              episodes: Array.from({ length: 10 }).map((_, idx) => ({
                episodeNumber: idx + 1,
                title: `Episode ${idx + 1}`,
                watched: false,
              })),
            },
          ],
        };
        workingPrev = [newItem, ...workingPrev];
      }

      return workingPrev.map((item) => {
        if (item.id !== mediaId || !item.seasonsData) return item;

        const targetSeason = item.seasonsData.find((s) => s.seasonNumber === seasonNumber);
        const shouldWatch =
          forceWatched !== undefined
            ? forceWatched
            : targetSeason
            ? targetSeason.episodes.some((e) => !e.watched)
            : true;

        let totalEpisodesCount = 0;
        let watchedEpisodesCount = 0;

        const newSeasonsData = item.seasonsData.map((season) => {
          if (season.seasonNumber !== seasonNumber) {
            season.episodes.forEach((ep) => {
              totalEpisodesCount++;
              if (ep.watched) watchedEpisodesCount++;
            });
            return season;
          }

          const newEpisodes = season.episodes.map((ep) => {
            totalEpisodesCount++;
            if (shouldWatch) watchedEpisodesCount++;
            return { ...ep, watched: shouldWatch };
          });

          return { ...season, episodes: newEpisodes };
        });

        const newProgress =
          totalEpisodesCount > 0
            ? Math.round((watchedEpisodesCount / totalEpisodesCount) * 100)
            : item.progressPercentage || 0;

        const newStatus: WatchStatus =
          newProgress >= 100 ? 'watched' : newProgress > 0 ? 'watching' : item.status;

        const updated: MediaItem = {
          ...item,
          seasonsData: newSeasonsData,
          progressPercentage: newProgress,
          currentSeason: seasonNumber,
          status: newStatus,
          updatedAt: new Date().toISOString(),
        };

        if (selectedMedia && selectedMedia.id === mediaId) {
          setSelectedMedia(updated);
        }

        recordActivity({
          type: 'progress_updated',
          title: shouldWatch ? 'Completed Season' : 'Reset Season',
          mediaId: item.id,
          mediaTitle: item.title,
          mediaType: 'series',
          poster: item.poster,
          details: `Season ${seasonNumber} marked as ${shouldWatch ? 'watched' : 'unwatched'}`,
        });

        return updated;
      });
    });
  };

  // User Rating
  const setMediaRating = (id: string, rating: number) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const updated = { ...item, userRating: rating };
          if (selectedMedia && selectedMedia.id === id) {
            setSelectedMedia(updated);
          }
          recordActivity({
            type: 'rated',
            title: 'Rated Title',
            mediaId: item.id,
            mediaTitle: item.title,
            mediaType: item.type,
            poster: item.poster,
            details: `Rated ${rating}/10`,
          });
          return updated;
        }
        return item;
      })
    );
  };

  // User Notes
  const setMediaNotes = (id: string, notes: string) => {
    updateItem(id, { userNotes: notes });
  };

  // Custom Lists Management
  const createCustomList = (name: string, icon: string, description?: string): CustomList => {
    const newList: CustomList = {
      id: `list-${Date.now()}`,
      name: name.trim() || 'New List',
      icon: icon || '🎬',
      description: description?.trim(),
      createdAt: new Date().toISOString(),
    };
    setCustomLists((prev) => [...prev, newList]);
    return newList;
  };

  const updateCustomList = (id: string, name: string, icon: string, description?: string) => {
    setCustomLists((prev) =>
      prev.map((list) =>
        list.id === id
          ? { ...list, name: name.trim() || list.name, icon, description: description?.trim() }
          : list
      )
    );
  };

  const deleteCustomList = (id: string) => {
    setCustomLists((prev) => prev.filter((list) => list.id !== id));
    // Remove list ID from any items
    setItems((prev) =>
      prev.map((item) => {
        if (item.customLists?.includes(id)) {
          return {
            ...item,
            customLists: item.customLists.filter((l) => l !== id),
          };
        }
        return item;
      })
    );
    if (activeListId === id) {
      setActiveListId(null);
      setActiveView('collection');
    }
  };

  const toggleItemInList = (itemOrId: string | MediaItem, listId: string): boolean => {
    const targetId = typeof itemOrId === 'string' ? itemOrId : itemOrId.id;
    const mediaObj = typeof itemOrId === 'object' ? itemOrId : null;

    let isNowInList = false;

    setItems((prev) => {
      const idx = prev.findIndex(
        (i) =>
          i.id === targetId ||
          (mediaObj?.tmdbId && i.tmdbId === mediaObj.tmdbId) ||
          (mediaObj?.title && i.title.toLowerCase() === mediaObj.title.toLowerCase())
      );

      if (idx !== -1) {
        const item = prev[idx];
        const current = item.customLists || [];
        const exists = current.includes(listId);
        isNowInList = !exists;
        const next = exists ? current.filter((l) => l !== listId) : [...current, listId];
        const updated: MediaItem = { ...item, customLists: next };
        const copy = [...prev];
        copy[idx] = updated;

        if (
          selectedMedia &&
          (selectedMedia.id === item.id ||
            (item.tmdbId && selectedMedia.tmdbId === item.tmdbId) ||
            (item.title && selectedMedia.title && item.title.toLowerCase() === selectedMedia.title.toLowerCase()))
        ) {
          setSelectedMedia({ ...selectedMedia, ...updated, customLists: next });
        }

        const targetList = customLists.find((l) => l.id === listId);
        recordActivity({
          type: isNowInList ? 'added' : 'status_changed',
          title: isNowInList ? 'Added to List' : 'Removed from List',
          mediaId: item.id,
          mediaTitle: item.title,
          mediaType: item.type,
          poster: item.poster,
          details: `${isNowInList ? 'Added to' : 'Removed from'} ${targetList?.name || 'custom list'}`,
        });

        return copy;
      } else if (mediaObj) {
        // Create new item in collection and assign to this list
        isNowInList = true;
        const newItem: MediaItem = {
          id: mediaObj.id || (mediaObj.tmdbId ? `tmdb-${mediaObj.type || 'movie'}-${mediaObj.tmdbId}` : `item-${Date.now()}`),
          tmdbId: mediaObj.tmdbId,
          title: mediaObj.title || 'Untitled',
          type: mediaObj.type || 'movie',
          poster: mediaObj.poster || '',
          banner: mediaObj.banner || '',
          year: mediaObj.year || new Date().getFullYear(),
          rating: mediaObj.rating || 8.0,
          runtime: mediaObj.runtime || '120 min',
          genres: mediaObj.genres || ['Drama'],
          description: mediaObj.description || '',
          director: mediaObj.director || 'Director',
          cast: mediaObj.cast || [],
          status: 'watchlist',
          userRating: 0,
          userNotes: '',
          isFavorite: false,
          customLists: [listId],
          tags: mediaObj.tags || [],
          addedAt: new Date().toISOString(),
          progressPercentage: 0,
        };

        if (selectedMedia) {
          setSelectedMedia({ ...selectedMedia, ...newItem, customLists: [listId] });
        }

        const targetList = customLists.find((l) => l.id === listId);
        recordActivity({
          type: 'added',
          title: 'Added to List',
          mediaId: newItem.id,
          mediaTitle: newItem.title,
          mediaType: newItem.type,
          poster: newItem.poster,
          details: `Added to ${targetList?.name || 'custom list'}`,
        });

        return [...prev, newItem];
      }
      return prev;
    });

    return isNowInList;
  };

  // Export JSON
  const exportCollectionJson = (): string => {
    const data = {
      exportVersion: '2.0',
      exportedAt: new Date().toISOString(),
      appName: 'EHSAAN MOVIE',
      userName,
      items,
      customLists,
      activities,
      theme,
    };
    return JSON.stringify(data, null, 2);
  };

  // Import JSON
  const importCollectionJson = (jsonString: string): { success: boolean; message: string } => {
    try {
      const data = JSON.parse(jsonString);
      if (!data || !Array.isArray(data.items)) {
        return {
          success: false,
          message: 'Invalid file format. "items" array was not found in JSON.',
        };
      }

      setItems(deduplicateMediaItems(data.items));
      if (Array.isArray(data.customLists)) {
        setCustomLists(data.customLists);
      }
      if (Array.isArray(data.activities)) {
        setActivities(data.activities);
      }
      if (data.theme === 'light' || data.theme === 'dark') {
        setTheme(data.theme);
      }
      if (data.userName && typeof data.userName === 'string') {
        setUserName(data.userName);
      }

      return {
        success: true,
        message: `Successfully imported ${data.items.length} titles and ${(data.customLists || []).length} custom lists!`,
      };
    } catch (e: any) {
      return {
        success: false,
        message: `Could not parse file: ${e?.message || 'Unknown error'}`,
      };
    }
  };

  // Reset to default data
  const resetToDefaultData = () => {
    setItems(deduplicateMediaItems(INITIAL_MEDIA_ITEMS));
    setCustomLists(INITIAL_CUSTOM_LISTS);
    setActivities(INITIAL_USER_ACTIVITIES);
    setTheme('dark');
  };

  // Offline Local Storage Copy Management
  const [lastOfflineSavedAt, setLastOfflineSavedAt] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(STORAGE_KEYS.OFFLINE_SAVED_AT);
    }
    return null;
  });

  const [offlineCopyCount, setOfflineCopyCount] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEYS.OFFLINE_COUNT);
      if (saved) return parseInt(saved, 10) || 0;
    }
    return 0;
  });

  const [isOffline, setIsOffline] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return !navigator.onLine;
    }
    return false;
  });

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => {
      setIsOffline(true);
      try {
        const raw = localStorage.getItem(STORAGE_KEYS.OFFLINE_VAULT);
        if (raw) {
          const data = JSON.parse(raw);
          if (Array.isArray(data.items) && data.items.length > 0) {
            setItems((curr) => (curr.length === 0 ? data.items : curr));
          }
        }
      } catch (e) {
        console.error('Offline fallback check error:', e);
      }
    };
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const saveLocalOfflineCopy = () => {
    try {
      const now = new Date().toISOString();
      const vaultPayload = {
        version: 1,
        savedAt: now,
        items,
        customLists,
        activities,
        theme,
        userName,
        preferences: {
          showPreviewArtwork,
          previewArtworkOpacity,
          previewShowTagline,
          previewShowGenres,
          previewShowMatchScore,
          previewShowRatingBadge,
          previewShowQualityBadge,
          previewShowTrailerButton,
          previewShowCuratedListButton,
          previewShowSynopsis,
          previewShowProviders,
          previewShowTitleCard,
        },
      };

      // Store in both offline archive vault and primary localStorage keys
      localStorage.setItem(STORAGE_KEYS.OFFLINE_VAULT, JSON.stringify(vaultPayload));
      localStorage.setItem(STORAGE_KEYS.ITEMS, JSON.stringify(items));
      localStorage.setItem(STORAGE_KEYS.LISTS, JSON.stringify(customLists));
      localStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(activities));
      localStorage.setItem(STORAGE_KEYS.OFFLINE_SAVED_AT, now);
      localStorage.setItem(STORAGE_KEYS.OFFLINE_COUNT, String(items.length));

      setLastOfflineSavedAt(now);
      setOfflineCopyCount(items.length);

      return {
        success: true,
        message: `Local copy successfully saved in local storage! (${items.length} titles saved. Whenever internet goes, the app will work with this saved data.)`,
        timestamp: now,
        count: items.length,
      };
    } catch (err) {
      console.error('Failed to save offline copy:', err);
      return {
        success: false,
        message: 'Could not save local copy. Local storage quota exceeded or disabled.',
        timestamp: new Date().toISOString(),
        count: items.length,
      };
    }
  };

  const loadLocalOfflineCopy = () => {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.OFFLINE_VAULT);
      if (!raw) {
        return { success: false, message: 'No saved local copy found in local storage.' };
      }
      const data = JSON.parse(raw);
      if (Array.isArray(data.items)) {
        setItems(deduplicateMediaItems(data.items));
        if (Array.isArray(data.customLists)) setCustomLists(data.customLists);
        if (Array.isArray(data.activities)) setActivities(data.activities);
        if (data.theme === 'light' || data.theme === 'dark') setTheme(data.theme);
        return { success: true, message: `Loaded ${data.items.length} titles from saved local copy.` };
      }
      return { success: false, message: 'Saved local copy format is invalid.' };
    } catch (err) {
      return { success: false, message: 'Failed to restore local offline copy.' };
    }
  };

  return (
    <CollectionContext.Provider
      value={{
        theme,
        setTheme,
        toggleTheme,
        userName,
        setUserName,
        userAvatar,
        setUserAvatar,
        isSidebarCollapsed,
        setIsSidebarCollapsed,
        isCustomListsCollapsed,
        setIsCustomListsCollapsed,
        activeView,
        setActiveView,
        activeListId,
        setActiveListId,
        items,
        customLists,
        activities,
        stats,
        addItem,
        updateItemStatus,
        updateItem,
        removeItem,
        toggleFavorite,
        updateProgress,
        toggleEpisodeWatched,
        toggleSeasonAllEpisodes,
        setMediaRating,
        setMediaNotes,
        createCustomList,
        updateCustomList,
        deleteCustomList,
        toggleItemInList,
        selectedMedia,
        setSelectedMedia,
        isSearchOpen,
        setIsSearchOpen,
        isListModalOpen,
        setIsListModalOpen,
        editingList,
        setEditingList,
        progressModalItem,
        setProgressModalItem,
        exportCollectionJson,
        importCollectionJson,
        resetToDefaultData,
        removeAllData,
        isBatchSelectEnabled,
        setIsBatchSelectEnabled,
        selectedItems,
        setSelectedItems,
        deleteMultipleItems,
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
        saveLocalOfflineCopy,
        loadLocalOfflineCopy,
        lastOfflineSavedAt,
        offlineCopyCount,
        isOffline,
        showWelcomeModal,
        openWelcomeModal,
        dismissWelcomeModal,
        genreColors,
        setGenreColors,
        updateGenreColor,
        resetGenreColors,
        genrePillStyle,
        setGenrePillStyle,
        genreBadgeSize,
        setGenreBadgeSize,
      }}
    >
      {children}
    </CollectionContext.Provider>
  );
};

export const useCollection = () => {
  const context = useContext(CollectionContext);
  if (!context) {
    throw new Error('useCollection must be used within a CollectionProvider');
  }
  return context;
};
