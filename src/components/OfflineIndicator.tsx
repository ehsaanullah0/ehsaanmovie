import React, { useState, useEffect } from 'react';
import { useOnlineStatus } from '../utils/useOnlineStatus';
import { useCollection } from '../context/CollectionContext';
import { WifiOff, Database } from 'lucide-react';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();
  const { offlineCopyCount } = useCollection();
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    if (!isOnline) {
      const timer = setTimeout(() => setIsCollapsed(true), 1000);
      return () => clearTimeout(timer);
    } else {
      setIsCollapsed(false);
    }
  }, [isOnline]);

  if (isOnline) return null;

  return (
    <aside
      aria-label="Offline Mode Notification"
      className={`fixed bottom-4 left-4 z-60 flex items-center gap-2.5 rounded-2xl bg-[#34241d] text-[#faf6f2] px-4 py-2.5 text-xs font-bold border border-[#f0c2a8]/40 shadow-2xl animate-in fade-in slide-in-from-bottom-2 transition-all duration-300 ${isCollapsed ? 'w-10 h-10 p-0 justify-center' : ''}`}
    >
      <div className="relative flex items-center justify-center">
        <span className="h-2.5 w-2.5 rounded-full bg-amber-400 animate-ping absolute opacity-75" />
        <span className="h-2 w-2 rounded-full bg-amber-400" />
      </div>
      {!isCollapsed && (
        <div className="flex items-center gap-1.5 whitespace-nowrap overflow-hidden">
          <WifiOff className="w-3.5 h-3.5 text-amber-300" />
          <span>Offline Mode</span>
          <span className="text-[#baa698] font-normal">·</span>
          <span className="text-[#ebd5c5] font-normal flex items-center gap-1">
            <Database className="w-3 h-3 text-[#f0a277]" />
            Using saved local library ({offlineCopyCount > 0 ? `${offlineCopyCount} titles` : 'active'})
          </span>
        </div>
      )}
    </aside>
  );
};
