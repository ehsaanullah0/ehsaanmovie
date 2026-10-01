import { MediaItem, WatchStatus, MediaType } from '../types';

export interface FilterCriteria {
  query: string;
  genre: string;
  country: string;
  rating: string;
  sortBy: string;
  type?: string;
  status?: string;
}

export function filterAndSortMediaItems(
  items: MediaItem[],
  criteria: FilterCriteria
): MediaItem[] {
  return items
    .filter((item) => {
      // 1. Search query filter
      if (criteria.query.trim()) {
        const q = criteria.query.toLowerCase().trim();
        const inTitle = item.title.toLowerCase().includes(q);
        const inDirector = item.director?.toLowerCase().includes(q);
        const inGenres = item.genres.some((g) => g.toLowerCase().includes(q));
        const inTags = (item.tags || []).some((t) => t.toLowerCase().includes(q));
        const inCast = (item.cast || []).some((c) => c.toLowerCase().includes(q));
        if (!inTitle && !inDirector && !inGenres && !inTags && !inCast) return false;
      }

      // 2. Type / Format filter
      if (criteria.type && criteria.type !== 'all') {
        if (criteria.type === 'anime') {
          if (!item.genres.map((g) => g.toLowerCase()).includes('animation')) return false;
        } else if (item.type !== criteria.type) {
          return false;
        }
      }

      // 3. Status filter
      if (criteria.status && criteria.status !== 'all') {
        if (criteria.status === 'favorites') {
          if (!item.isFavorite) return false;
        } else if (item.status !== criteria.status) {
          return false;
        }
      }

      // 4. Genre filter
      if (criteria.genre !== 'all') {
        const itemGenres = item.genres.map((g) => g.toLowerCase());
        if (!itemGenres.includes(criteria.genre.toLowerCase())) {
          return false;
        }
      }

      // 5. Country / Region filter
      if (criteria.country !== 'all') {
        const target = criteria.country.toLowerCase();
        const text = (
          (item.description || '') +
          ' ' +
          item.title +
          ' ' +
          (item.tags || []).join(' ') +
          ' ' +
          (item.studios || []).join(' ')
        ).toLowerCase();

        if (target === 'us' && !text.includes('united states') && !text.includes('usa') && !text.includes('american') && !text.includes('hollywood')) {
          // Check if fallback to global
        } else if (!text.includes(target)) {
          // Specific country tag check
          const hasTag = (item.tags || []).some((t) => t.toLowerCase().includes(target));
          if (!hasTag) return false;
        }
      }

      // 6. Minimum Rating filter
      if (criteria.rating !== 'all') {
        const minRating = parseFloat(criteria.rating);
        if (item.rating < minRating) return false;
      }

      return true;
    })
    .sort((a, b) => {
      if (criteria.sortBy === 'title') return a.title.localeCompare(b.title);
      if (criteria.sortBy === 'year') return Number(b.year) - Number(a.year);
      if (criteria.sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
      if (criteria.sortBy === 'watched') {
        return new Date(b.watchedAt || 0).getTime() - new Date(a.watchedAt || 0).getTime();
      }
      return new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime();
    });
}
