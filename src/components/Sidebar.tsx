import React from 'react';
import {
  Home,
  Bookmark,
  Layers,
  Film,
  Tv,
  Search,
  Settings,
  Plus,
  ChevronLeft,
  ChevronDown,
  Sparkles,
  PanelLeftClose,
  ChevronRight,
  Trash2,
  ListPlus,
} from 'lucide-react';
import { useCollection } from '../context/CollectionContext';
import { ActiveView } from '../types';
import { BrandClapperboardLogo } from './BrandClapperboardLogo';

interface SidebarProps {
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isMobileOpen, setIsMobileOpen }) => {
  const {
    activeView,
    setActiveView,
    activeListId,
    setActiveListId,
    stats,
    customLists,
    setIsListModalOpen,
    setEditingList,
    isSidebarCollapsed,
    setIsSidebarCollapsed,
    isCustomListsCollapsed,
    setIsCustomListsCollapsed,
  } = useCollection();

  const handleNav = (view: ActiveView) => {
    setActiveView(view);
    setActiveListId(null);
    setIsMobileOpen(false);
  };

  const handleListClick = (listId: string) => {
    setActiveListId(listId);
    setActiveView('list');
    setIsMobileOpen(false);
  };

  const navItems = [
    { id: 'home' as ActiveView, label: 'Home', icon: Home, count: null },
    { id: 'collection' as ActiveView, label: 'Watchlist', icon: Bookmark, count: stats.watchlist },
    { id: 'lists' as ActiveView, label: 'Custom Lists', icon: ListPlus, count: customLists.length },
    { id: 'movies' as ActiveView, label: 'Movies', icon: Film, count: stats.moviesCount },
    { id: 'series' as ActiveView, label: 'Series', icon: Tv, count: stats.seriesCount },
    { id: 'search' as ActiveView, label: 'Search', icon: Search, count: null },
    { id: 'settings' as ActiveView, label: 'Settings', icon: Settings, count: null },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          onClick={() => setIsMobileOpen(false)}
          className="fixed inset-0 z-40 bg-[#231814]/70 backdrop-blur-xs md:hidden"
        />
      )}

      {/* Main Sidebar Container (smaller compact width on tablet md:w-40, expands to lg:w-52) */}
      <aside
        className={`fixed md:sticky top-0 left-0 z-40 h-screen shrink-0 hidden md:flex flex-col justify-between border-r transition-all duration-300 ease-in-out bg-[#fbfbfd] dark:bg-[#1e1511] border-[#e4e4e7] dark:border-[#35251d] text-[#09090b] dark:text-[#f8f3ee] overflow-hidden ${
          isMobileOpen
            ? 'translate-x-0 w-44 md:w-40 lg:w-52'
            : isSidebarCollapsed
            ? '-translate-x-full md:w-0 md:opacity-0 md:pointer-events-none border-none'
            : 'translate-x-0 w-44 md:w-40 lg:w-52 opacity-100'
        }`}
      >
        <div className="flex flex-col flex-1 overflow-y-auto px-2.5 lg:px-3.5 py-4 lg:py-5 w-44 md:w-40 lg:w-52">
          {/* Logo Brand Zone with White Outlined Popcorn Cup Icon & Complete Hide Toggle */}
          <div className="flex items-center justify-between mb-5 lg:mb-6 px-1">
            <button
              onClick={() => handleNav('home')}
              className="flex items-center gap-2 lg:gap-3 group text-left cursor-pointer focus-visible:outline-[#09090b] dark:focus-visible:outline-[#fbf8f4]"
            >
              <BrandClapperboardLogo size={32} />
              <div>
                <span className="text-xs lg:text-sm font-extrabold tracking-tight text-[#09090b] dark:text-[#faf6f2] uppercase block leading-tight truncate">
                  EHSAAN
                </span>
                <span className="text-[9px] lg:text-[10px] text-[#71717a] dark:text-[#b49f92] font-bold tracking-wider uppercase block mt-0.5">
                  Cinema Vault
                </span>
              </div>
            </button>

            {/* Mobile close arrow */}
            <button
              onClick={() => setIsMobileOpen(!isMobileOpen)}
              className="md:hidden p-2 rounded-xl text-[#71717a] dark:text-[#baa698] hover:bg-[#f1f2f4] dark:hover:bg-[#2e2019] transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Desktop Complete Hide Button */}
            <button
              onClick={() => setIsSidebarCollapsed(true)}
              title="Hide sidebar behind logo (Full Screen)"
              className="hidden md:flex p-1.5 rounded-xl text-[#71717a] dark:text-[#baa698] hover:text-[#09090b] dark:hover:text-[#faf6f2] hover:bg-[#f1f2f4] dark:hover:bg-[#2e2019] transition-colors cursor-pointer"
            >
              <PanelLeftClose className="w-4 h-4 stroke-[2.4]" />
            </button>

          </div>

          {/* Primary Navigation */}
          <div className="space-y-1 mb-6">
            <span className="px-2.5 text-[10px] font-bold text-[#71717a] dark:text-[#a89284] uppercase tracking-wider block mb-2">
              Navigation
            </span>

            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeView === item.id && activeListId === null;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNav(item.id)}
                  className={`w-full flex items-center justify-between px-2.5 lg:px-3.5 py-2 lg:py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#09090b] dark:bg-[#faf6f2] text-white dark:text-[#231814] shadow-xs'
                      : 'text-[#52525b] dark:text-[#c4b1a4] hover:text-[#09090b] dark:hover:text-[#faf6f2] hover:bg-[#f1f2f4] dark:hover:bg-[#2b1e18]'
                  }`}
                >
                  <div className="flex items-center gap-2 lg:gap-3 truncate">
                    <Icon
                      className={`w-4 h-4 shrink-0 ${
                        isActive
                          ? 'text-white dark:text-[#231814] stroke-[2.4]'
                          : 'text-[#71717a] dark:text-[#a89284]'
                      }`}
                    />
                    <span className="truncate">{item.label}</span>
                  </div>

                  {item.count !== null && item.count !== undefined && (
                    <span
                      className={`text-[10px] lg:text-[11px] px-1.5 lg:px-2 py-0.5 rounded-lg font-mono tabular-nums shrink-0 ${
                        isActive
                          ? 'bg-[#27272a] dark:bg-[#e4d4c5] text-white dark:text-[#231814] font-bold'
                          : 'text-[#52525b] dark:text-[#a89284] bg-[#f4f4f5] dark:bg-[#2d1f19]'
                      }`}
                    >
                      {item.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Custom Lists Navigation with Expand / Collapse Arrow */}
          <div className="space-y-1 pt-3 border-t border-[#e4e4e7] dark:border-[#35251d]">
            <div className="flex items-center justify-between px-2 mb-2">
              <button
                onClick={() => setIsCustomListsCollapsed((prev) => !prev)}
                className="flex items-center gap-1.5 text-[10px] font-bold text-[#71717a] dark:text-[#a89284] uppercase tracking-wider hover:text-[#09090b] dark:hover:text-[#faf6f2] transition-colors cursor-pointer group"
              >
                <span>My Lists</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    isCustomListsCollapsed ? '-rotate-90' : 'rotate-0'
                  }`}
                />
              </button>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleNav('lists')}
                  title="View All Playlists (Spotify Style)"
                  className="text-[10px] text-[#09090b] dark:text-[#caa282] font-bold hover:underline cursor-pointer px-1"
                >
                  All
                </button>
                <button
                  onClick={() => {
                    setEditingList(null);
                    setIsListModalOpen(true);
                  }}
                  title="Create Custom List"
                  className="w-5 h-5 rounded-md hover:bg-[#f1f2f4] dark:hover:bg-[#2d1f19] flex items-center justify-center text-[#71717a] dark:text-[#a89284] hover:text-[#09090b] dark:hover:text-[#faf6f2] transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                </button>
              </div>
            </div>

            {/* Custom Lists Items */}
            {!isCustomListsCollapsed && (
              <div className="space-y-1 animate-in fade-in duration-150">
                {customLists.map((list) => {
                  const isActive = activeView === 'list' && activeListId === list.id;
                  return (
                    <div
                      key={list.id}
                      onClick={() => handleListClick(list.id)}
                      className={`group/item w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer truncate ${
                        isActive
                          ? 'bg-[#09090b] dark:bg-[#faf6f2] text-white dark:text-[#231814] shadow-xs'
                          : 'text-[#52525b] dark:text-[#c4b1a4] hover:text-[#09090b] dark:hover:text-[#faf6f2] hover:bg-[#f1f2f4] dark:hover:bg-[#2b1e18]'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 truncate min-w-0">
                        <ListPlus className="w-3.5 h-3.5 shrink-0 opacity-70" />
                        <span className="truncate">{list.name}</span>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingList(list);
                          setIsListModalOpen(true);
                        }}
                        title="Manage List (Edit or Delete)"
                        className="opacity-0 group-hover/item:opacity-100 p-1 rounded-md hover:bg-black/10 dark:hover:bg-white/15 transition-opacity shrink-0 text-[#71717a] hover:text-rose-500 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};
