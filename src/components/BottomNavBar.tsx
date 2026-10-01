import React, { useState, useEffect, useRef } from 'react';
import { Home, Bookmark, Film, Tv, Search, Settings, ChevronUp, ListPlus } from 'lucide-react';
import { useCollection } from '../context/CollectionContext';
import { ActiveView } from '../types';

export const BottomNavBar: React.FC = () => {
  const { activeView, setActiveView, setActiveListId, stats } = useCollection();
  const [isNavHidden, setIsNavHidden] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY || document.documentElement.scrollTop;

      // When scrolling down past 50px, hide bottom bar
      if (currentScrollY > lastScrollY.current + 8 && currentScrollY > 50) {
        setIsNavHidden(true);
      }
      // When scrolling up by 15px or near the top, show bottom bar
      else if (currentScrollY < lastScrollY.current - 15 || currentScrollY <= 25) {
        setIsNavHidden(false);
      }

      lastScrollY.current = Math.max(0, currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNav = (view: ActiveView) => {
    setActiveView(view);
    setActiveListId(null);
    setIsNavHidden(false);
  };

  const navItems = [
    { id: 'home' as ActiveView, label: 'Home', icon: Home },
    { id: 'collection' as ActiveView, label: 'Watchlist', icon: Bookmark, badge: stats.watchlist },
    { id: 'lists' as ActiveView, label: 'Lists', icon: ListPlus },
    { id: 'movies' as ActiveView, label: 'Movies', icon: Film },
    { id: 'series' as ActiveView, label: 'Series', icon: Tv },
    { id: 'search' as ActiveView, label: 'Search', icon: Search },
    { id: 'settings' as ActiveView, label: 'Settings', icon: Settings },
  ];

  return (
    <>
      {/* Small floating bubble arrow at very right bottom when bottom bar is hidden */}
      {isNavHidden && (
        <button
          onClick={() => setIsNavHidden(false)}
          className="md:hidden fixed bottom-4 right-4 z-50 w-11 h-11 rounded-full bg-[#caa282] hover:bg-[#d8b598] text-[#231814] shadow-2xl border-2 border-black/80 flex items-center justify-center hover:scale-110 active:scale-90 transition-all cursor-pointer animate-in fade-in zoom-in-90 duration-200"
          title="Show Navigation Bar"
          aria-label="Show Navigation Bar"
        >
          <ChevronUp className="w-5 h-5 stroke-[2.5]" />
        </button>
      )}

      {/* Main Bottom Navigation Bar */}
      <nav
        className={`md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-[#1e1511] border-t border-[#e4e4e7] dark:border-[#35251d] backdrop-blur-md py-2 px-2 flex justify-around items-center shadow-lg transition-all duration-300 ease-in-out ${
          isNavHidden
            ? 'translate-y-full opacity-0 pointer-events-none'
            : 'translate-y-0 opacity-100'
        }`}
      >
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleNav(item.id)}
              className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all cursor-pointer relative ${
                isActive
                  ? 'text-amber-600 dark:text-[#f59e0b]'
                  : 'text-[#71717a] dark:text-[#c4b1a4] hover:text-[#09090b] dark:hover:text-[#faf6f2]'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
              <span className="text-[10px] font-bold mt-1 tracking-tight">{item.label}</span>
              {item.badge !== undefined && item.badge > 0 && (
                <span className="absolute top-1 right-2 w-4 h-4 rounded-full bg-[#f59e0b] text-[#1a120e] text-[9px] font-extrabold flex items-center justify-center">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>
    </>
  );
};
