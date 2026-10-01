import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  Sun,
  Moon,
  Bell,
  Menu,
  X,
  Clock,
  Sparkles,
  CheckCircle2,
  Camera,
  Download,
  Upload,
  User,
  Edit2,
  Check,
  Trash2,
  Settings,
  PanelLeftOpen,
  Home,
  Bookmark,
  Layers,
  Film,
  Tv,
  ListPlus,
} from 'lucide-react';
import { useCollection } from '../context/CollectionContext';
import { BrandClapperboardLogo } from './BrandClapperboardLogo';

interface TopBarProps {
  onToggleMobileMenu: () => void;
  isMobileOpen: boolean;
}

export const TopBar: React.FC<TopBarProps> = ({ onToggleMobileMenu, isMobileOpen }) => {
  const {
    theme,
    toggleTheme,
    setIsSearchOpen,
    activities,
    setSelectedMedia,
    items,
    customLists,
    userName,
    setUserName,
    userAvatar,
    setUserAvatar,
    exportCollectionJson,
    importCollectionJson,
    activeView,
    setActiveView,
    isSidebarCollapsed,
    setIsSidebarCollapsed,
  } = useCollection();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(userName);
  const [importNotification, setImportNotification] = useState<string | null>(null);

  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setShowProfileMenu(false);
        setIsEditingName(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Update tempName when userName changes
  useEffect(() => {
    setTempName(userName);
  }, [userName]);

  // Keyboard shortcut Ctrl+K or ⌘K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setIsSearchOpen]);

  const handleNotificationClick = (mediaId: string) => {
    const found = items.find((i) => i.id === mediaId);
    if (found) {
      setSelectedMedia(found);
      setShowNotifications(false);
    }
  };

  const handleSaveName = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (tempName.trim()) {
      setUserName(tempName.trim());
    } else {
      setTempName(userName);
    }
    setIsEditingName(false);
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 3 * 1024 * 1024) {
      alert('Please choose an image under 3MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        setUserAvatar(dataUrl);
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleExport = () => {
    const jsonString = exportCollectionJson();
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ehsaan-movie-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setImportNotification('Collection exported successfully as JSON!');
    setTimeout(() => setImportNotification(null), 3500);
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        const result = importCollectionJson(content);
        setImportNotification(result.message);
        setTimeout(() => setImportNotification(null), 4000);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // Compute initials
  const initials = userName
    .split(' ')
    .filter(Boolean)
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase() || 'EM';

  return (
    <header className="sticky top-0 z-30 w-full h-16 border-b flex items-center justify-between px-4 sm:px-6 lg:px-8 bg-white/95 dark:bg-[#17110e]/90 backdrop-blur-md border-[#e4e4e7] dark:border-[#33241c] transition-colors shadow-2xs">
      {/* Left: Popcorn Logo / Sidebar Toggle & Universal Search + Nav Shortcuts */}
      <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0 mr-2 sm:mr-4">
        {/* Mobile Menu Button */}
        <button
          onClick={onToggleMobileMenu}
          className="md:hidden p-2 rounded-xl text-[#52525b] dark:text-[#c4b1a4] hover:text-[#09090b] dark:hover:text-[#faf6f2] hover:bg-[#f1f2f4] dark:hover:bg-[#281c16] transition-colors cursor-pointer"
          aria-label="Toggle Navigation Menu"
        >
          {isMobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

        {/* Brand Popcorn Logo Trigger (Shows when desktop sidebar is hidden so sidebar opens from behind it) */}
        {isSidebarCollapsed && (
          <button
            onClick={() => setIsSidebarCollapsed(false)}
            title="Open Sidebar Navigation"
            className="hidden md:flex items-center gap-2 p-1.5 px-2 lg:pr-3 rounded-2xl bg-[#fafafc] dark:bg-[#221814] border border-[#e4e4e7] dark:border-[#382820] hover:border-[#09090b] dark:hover:border-[#caa282] transition-all cursor-pointer group shadow-2xs shrink-0"
          >
            <BrandClapperboardLogo size={28} />
            <div className="text-left hidden lg:block">
              <span className="text-xs font-extrabold text-[#09090b] dark:text-[#faf6f2] block leading-tight">
                EHSAAN MOVIE
              </span>
              <span className="text-[9px] font-bold text-[#71717a] dark:text-[#caa282] uppercase tracking-wider block">
                Open Menu
              </span>
            </div>
            <PanelLeftOpen className="w-3.5 h-3.5 text-[#71717a] group-hover:text-[#09090b] dark:group-hover:text-[#faf6f2] transition-colors" />
          </button>
        )}

        {/* Universal Search Bar */}
        <div
          onClick={() => setIsSearchOpen(true)}
          className="w-auto max-w-[170px] xs:max-w-[210px] sm:max-w-sm lg:max-w-md flex items-center justify-between gap-2 sm:gap-3 px-3 sm:px-3.5 py-2 rounded-xl bg-[#f4f4f5] hover:bg-white dark:bg-[#241a15] dark:hover:bg-[#2c201a] border border-[#e4e4e7] dark:border-[#3d2c23] text-[#52525b] dark:text-[#bba698] cursor-pointer transition-all shadow-2xs group shrink-0"
        >
          <div className="flex items-center gap-2 sm:gap-2.5 truncate">
            <Search className="w-4 h-4 text-[#71717a] dark:text-[#aa9486] group-hover:text-[#09090b] dark:group-hover:text-[#faf6f2] transition-colors shrink-0" />
            <span className="text-xs sm:text-sm text-[#52525b] dark:text-[#bba698] group-hover:text-[#09090b] dark:group-hover:text-[#faf6f2] truncate font-medium">
              <span className="sm:hidden">Search...</span>
              <span className="hidden sm:inline">Search cinema, series, crew...</span>
            </span>
          </div>

          <kbd className="hidden sm:inline-flex items-center gap-0.5 px-2 py-0.5 text-[10px] font-mono font-semibold text-[#52525b] dark:text-[#d3c0b3] bg-white dark:bg-[#1a120e] border border-[#e4e4e7] dark:border-[#402e24] rounded-md shadow-2xs shrink-0 select-none">
            <span className="text-[9px]">⌘</span>K
          </kbd>
        </div>

        {/* Minimal Icon-Only Navigation Shortcuts (Hidden on Mobile & Tablet, shown on Desktop lg+) */}
        <nav className="hidden lg:flex items-center gap-1 shrink-0 py-1">
          {[
            { id: 'home', label: 'Home', icon: Home, action: () => setActiveView('home') },
            { id: 'watchlist', label: 'Watchlist', icon: Bookmark, action: () => setActiveView('watchlist') },
            { id: 'lists', label: 'Custom Lists', icon: ListPlus, action: () => setActiveView('lists') },
            { id: 'movies', label: 'Movies', icon: Film, action: () => setActiveView('movies') },
            { id: 'series', label: 'Series', icon: Tv, action: () => setActiveView('series') },
            { id: 'search', label: 'Search', icon: Search, action: () => setIsSearchOpen(true) },
            { id: 'settings', label: 'Settings', icon: Settings, action: () => setActiveView('settings'), className: 'hidden md:flex' },
          ].map((nav) => {
            const Icon = nav.icon;
            const isActive = activeView === nav.id;
            return (
              <button
                key={nav.id}
                onClick={nav.action}
                className={`p-2 rounded-xl transition-all cursor-pointer ${nav.className || ''} ${
                  isActive
                    ? 'bg-[#09090b] text-white dark:bg-[#faf6f2] dark:text-[#231814] shadow-xs'
                    : 'text-[#52525b] dark:text-[#c4b1a4] hover:bg-[#f1f2f4] dark:hover:bg-[#281c16] hover:text-[#09090b] dark:hover:text-[#faf6f2]'
                }`}
                title={nav.label}
                aria-label={nav.label}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'stroke-[2.5]' : ''}`} />
              </button>
            );
          })}
        </nav>
      </div>

      {/* Right Controls: Custom Lists Quick Access, Theme Toggle, Notifications, User Profile Menu */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Custom Lists Quick Access Button */}
        <button
          onClick={() => setActiveView('lists')}
          title="Custom Lists / Playlists"
          className={`p-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-center ${
            activeView === 'lists'
              ? 'bg-[#09090b] text-white dark:bg-[#caa282] dark:text-[#231814] shadow-xs'
              : 'text-[#52525b] dark:text-[#c4b1a4] hover:text-[#09090b] dark:hover:text-[#faf6f2] hover:bg-[#f1f2f4] dark:hover:bg-[#281c16]'
          }`}
          aria-label="Custom Lists"
        >
          <ListPlus className={`w-4 h-4 ${activeView === 'lists' ? 'stroke-[2.5]' : ''}`} />
        </button>

        {/* Theme Toggle (Hidden on Mobile View) */}
        <button
          onClick={toggleTheme}
          title={theme === 'dark' ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
          className="hidden sm:flex p-2.5 rounded-xl text-[#52525b] dark:text-[#c4b1a4] hover:text-[#09090b] dark:hover:text-[#faf6f2] hover:bg-[#f1f2f4] dark:hover:bg-[#281c16] transition-colors cursor-pointer"
          aria-label="Toggle Color Theme"
        >
          {theme === 'dark' ? (
            <Sun className="w-4 h-4 text-[#e7d7c8]" />
          ) : (
            <Moon className="w-4 h-4 text-[#09090b]" />
          )}
        </button>

        {/* Notifications Popover */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            title="Activity & Notifications"
            className="relative p-2.5 rounded-xl text-[#52525b] dark:text-[#c4b1a4] hover:text-[#09090b] dark:hover:text-[#faf6f2] hover:bg-[#f1f2f4] dark:hover:bg-[#281c16] transition-colors cursor-pointer"
            aria-label="View recent activity"
          >
            <Bell className="w-4 h-4" />
            {activities.length > 0 && (
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-amber-500 dark:bg-[#caa282] ring-2 ring-white dark:ring-[#17110e]" />
            )}
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white dark:bg-[#231814] border border-[#e4e4e7] dark:border-[#3f2e25] shadow-2xl p-4 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="flex items-center justify-between pb-3 border-b border-[#e4e4e7] dark:border-[#38271e]">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-600 dark:text-[#caa282]" />
                  <span className="text-xs font-bold uppercase tracking-wider text-[#09090b] dark:text-[#faf6f2]">
                    Recent Activity
                  </span>
                </div>
                <span className="text-[11px] text-[#71717a] dark:text-[#ad988b] font-mono">
                  {activities.length} updates
                </span>
              </div>

              <div className="mt-3 max-h-80 overflow-y-auto space-y-2 pr-1">
                {activities.length === 0 ? (
                  <p className="text-xs text-[#71717a] dark:text-[#ad988b] text-center py-6">
                    No recent activity yet.
                  </p>
                ) : (
                  activities.slice(0, 7).map((act) => (
                    <div
                      key={act.id}
                      onClick={() => handleNotificationClick(act.mediaId)}
                      className="p-2.5 rounded-xl bg-[#f8f9fa] dark:bg-[#2d1f19] hover:bg-[#f1f2f4] dark:hover:bg-[#36251e] transition-colors cursor-pointer flex items-start gap-3 text-left group border border-[#e4e4e7] dark:border-transparent"
                    >
                      <div className="mt-0.5 w-6 h-6 rounded-lg bg-[#09090b] dark:bg-[#e4d4c5] text-white dark:text-[#231814] flex items-center justify-center shrink-0">
                        {act.type === 'status_changed' ? (
                          <CheckCircle2 className="w-3.5 h-3.5 stroke-[2.2]" />
                        ) : (
                          <Sparkles className="w-3.5 h-3.5 stroke-[2.2]" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <p className="text-xs font-bold text-[#09090b] dark:text-[#faf6f2] group-hover:text-amber-600 dark:group-hover:text-[#caa282] transition-colors truncate">
                            {act.mediaTitle}
                          </p>
                          <span className="text-[10px] text-[#71717a] dark:text-[#9e887a] shrink-0 font-mono">
                            {act.timestamp}
                          </span>
                        </div>
                        <p className="text-[11px] text-[#52525b] dark:text-[#baa698] truncate mt-0.5">
                          {act.details}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Popover in Top Right Corner */}
        <div className="relative pl-1 border-l border-[#e4e4e7] dark:border-[#33241c]" ref={profileRef}>
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            title={`User Profile: ${userName}`}
            className="flex items-center gap-2 p-1 rounded-full hover:ring-2 hover:ring-[#09090b] dark:hover:ring-[#caa282] transition-all cursor-pointer group"
          >
            {userAvatar ? (
              <img
                src={userAvatar}
                alt={userName}
                className="w-8 h-8 rounded-full object-cover border border-[#e4e4e7] dark:border-[#3f2e25] shadow-xs"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-[#09090b] dark:bg-[#caa282] text-white dark:text-[#231814] font-extrabold text-xs flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
                {initials}
              </div>
            )}
          </button>

          {/* Profile Dropdown Modal */}
          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-80 sm:w-92 rounded-2xl sm:rounded-3xl bg-white dark:bg-[#231814] border border-[#e4e4e7] dark:border-[#3f2e25] shadow-2xl p-5 z-50 animate-in fade-in slide-in-from-top-2 duration-150 text-[#09090b] dark:text-[#faf6f2]">
              {/* Notification inside profile if any */}
              {importNotification && (
                <div className="mb-4 p-2.5 rounded-xl bg-[#09090b] text-white dark:bg-[#faf6f2] dark:text-[#231814] text-[11px] font-bold text-center animate-in fade-in">
                  {importNotification}
                </div>
              )}

              {/* Profile Header with Avatar & Name */}
              <div className="flex items-center gap-4 pb-4 border-b border-[#e4e4e7] dark:border-[#38271e]">
                {/* Avatar with Camera Overlay */}
                <div className="relative group/avatar shrink-0">
                  {userAvatar ? (
                    <img
                      src={userAvatar}
                      alt={userName}
                      className="w-14 h-14 rounded-2xl object-cover border border-[#e4e4e7] dark:border-[#3f2e25] shadow-sm"
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-2xl bg-[#09090b] dark:bg-[#caa282] text-white dark:text-[#231814] font-extrabold text-lg flex items-center justify-center shadow-sm">
                      {initials}
                    </div>
                  )}

                  <button
                    onClick={() => avatarInputRef.current?.click()}
                    title="Upload Profile Picture"
                    className="absolute -bottom-1 -right-1 p-1.5 rounded-lg bg-[#09090b] dark:bg-[#faf6f2] text-white dark:text-[#231814] shadow-md hover:scale-110 transition-transform cursor-pointer"
                  >
                    <Camera className="w-3 h-3 stroke-[2.5]" />
                  </button>

                  <input
                    type="file"
                    ref={avatarInputRef}
                    onChange={handleAvatarUpload}
                    accept="image/*"
                    className="hidden"
                  />
                </div>

                {/* Name & Edit Mode */}
                <div className="flex-1 min-w-0">
                  {isEditingName ? (
                    <form onSubmit={handleSaveName} className="flex items-center gap-1.5">
                      <input
                        type="text"
                        autoFocus
                        value={tempName}
                        onChange={(e) => setTempName(e.target.value)}
                        className="w-full px-2.5 py-1 text-xs font-bold rounded-lg bg-[#f4f4f5] dark:bg-[#1a120e] border border-[#e4e4e7] dark:border-[#382820] text-[#09090b] dark:text-[#faf6f2] focus:outline-hidden focus:border-[#09090b] dark:focus:border-[#caa282]"
                      />
                      <button
                        type="submit"
                        className="p-1.5 rounded-lg bg-[#09090b] dark:bg-[#faf6f2] text-white dark:text-[#231814] cursor-pointer"
                      >
                        <Check className="w-3 h-3 stroke-[3]" />
                      </button>
                    </form>
                  ) : (
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-extrabold text-[#09090b] dark:text-[#faf6f2] truncate">
                        {userName}
                      </h3>
                      <button
                        onClick={() => setIsEditingName(true)}
                        title="Edit Name"
                        className="p-1 rounded text-[#71717a] hover:text-[#09090b] dark:hover:text-[#faf6f2] transition-colors cursor-pointer"
                      >
                        <Edit2 className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                  <p className="text-[11px] text-[#71717a] dark:text-[#baa698] font-mono mt-0.5">
                    {items.length} titles · {customLists.length} lists
                  </p>
                  {userAvatar && (
                    <button
                      onClick={() => setUserAvatar(null)}
                      className="text-[10px] text-rose-600 dark:text-rose-400 font-bold hover:underline mt-1 cursor-pointer"
                    >
                      Remove photo
                    </button>
                  )}
                </div>
              </div>

              {/* Custom Lists (Spotify Style Playlists) Section */}
              <div className="py-3 border-b border-[#e4e4e7] dark:border-[#38271e]">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#71717a] dark:text-[#ad988b] block mb-1.5">
                  Playlists &amp; Collections
                </span>
                <button
                  onClick={() => {
                    setActiveView('lists');
                    setShowProfileMenu(false);
                  }}
                  className="w-full p-2.5 rounded-xl bg-[#f8f9fa] dark:bg-[#2d1f19] hover:bg-[#caa282]/20 dark:hover:bg-[#caa282]/15 hover:border-[#caa282]/40 border border-transparent transition-all flex items-center justify-between text-xs font-bold text-[#09090b] dark:text-[#faf6f2] cursor-pointer group"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-[#09090b] dark:bg-[#faf6f2] text-white dark:text-[#231814] flex items-center justify-center group-hover:scale-105 transition-transform">
                      <ListPlus className="w-4 h-4" />
                    </div>
                    <div className="text-left">
                      <span className="block leading-tight">Custom Lists</span>
                      <span className="text-[10px] text-[#71717a] dark:text-[#baa698] font-normal">
                        Spotify playlist view
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#09090b]/5 dark:bg-white/10 font-mono font-bold text-[#09090b] dark:text-[#faf6f2]">
                    {customLists.length} lists
                  </span>
                </button>
              </div>

              {/* Data Import & Export Actions */}
              <div className="py-4 space-y-2 border-b border-[#e4e4e7] dark:border-[#38271e]">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#71717a] dark:text-[#ad988b] block mb-1">
                  Collection Backup
                </span>

                <button
                  onClick={handleExport}
                  className="w-full p-2.5 rounded-xl bg-[#f8f9fa] dark:bg-[#2d1f19] hover:bg-[#f1f2f4] dark:hover:bg-[#36251e] transition-colors flex items-center justify-between text-xs font-bold text-[#09090b] dark:text-[#faf6f2] cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <Download className="w-4 h-4 text-amber-600 dark:text-[#caa282]" />
                    <span>Export Collection JSON</span>
                  </div>
                  <span className="text-[10px] text-[#71717a] font-mono">Backup</span>
                </button>

                <div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImportFile}
                    accept=".json,application/json"
                    className="hidden"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full p-2.5 rounded-xl bg-[#f8f9fa] dark:bg-[#2d1f19] hover:bg-[#f1f2f4] dark:hover:bg-[#36251e] transition-colors flex items-center justify-between text-xs font-bold text-[#09090b] dark:text-[#faf6f2] cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <Upload className="w-4 h-4 text-amber-600 dark:text-[#caa282]" />
                      <span>Import Collection JSON</span>
                    </div>
                    <span className="text-[10px] text-[#71717a] font-mono">Restore</span>
                  </button>
                </div>
              </div>

              {/* Footer navigation */}
              <div className="pt-3 flex items-center justify-between text-xs">
                <button
                  onClick={() => {
                    setActiveView('settings');
                    setShowProfileMenu(false);
                  }}
                  className="flex items-center gap-1.5 font-bold text-[#71717a] dark:text-[#baa698] hover:text-[#09090b] dark:hover:text-[#faf6f2] transition-colors cursor-pointer"
                >
                  <Settings className="w-3.5 h-3.5" />
                  <span>Preferences &amp; Changelog</span>
                </button>

                <button
                  onClick={() => setShowProfileMenu(false)}
                  className="px-3 py-1 rounded-lg bg-[#09090b] dark:bg-[#faf6f2] text-white dark:text-[#231814] font-bold text-[11px] cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
