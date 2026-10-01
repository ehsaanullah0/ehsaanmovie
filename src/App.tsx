/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { CollectionProvider, useCollection } from './context/CollectionContext';
import { Sidebar } from './components/Sidebar';
import { TopBar } from './components/TopBar';
import { BottomNavBar } from './components/BottomNavBar';
import { UniversalSearchModal } from './components/UniversalSearchModal';
import { MediaDetailModal } from './components/MediaDetailModal';
import { CustomListModal } from './components/CustomListModal';
import { QuickProgressModal } from './components/QuickProgressModal';
import { OfflineIndicator } from './components/OfflineIndicator';
import { EhsaanStudioWelcomeModal } from './components/EhsaanStudioWelcomeModal';

// Views
import { HomeView } from './views/HomeView';
import { CollectionView } from './views/CollectionView';
import { MoviesView } from './views/MoviesView';
import { SeriesView } from './views/SeriesView';
import { SearchView } from './views/SearchView';
import { SettingsView } from './views/SettingsView';
import { CustomListsView } from './views/CustomListsView';

const MainLayout: React.FC = () => {
  const { activeView } = useCollection();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const renderActiveView = () => {
    switch (activeView) {
      case 'home':
        return <HomeView />;
      case 'watchlist':
      case 'collection':
      case 'list':
        return <CollectionView />;
      case 'lists':
        return <CustomListsView />;
      case 'movies':
        return <MoviesView />;
      case 'series':
        return <SeriesView />;
      case 'search':
        return <SearchView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <HomeView />;
    }
  };

  return (
    <div className="min-h-screen flex bg-[var(--color-bg)] text-[#1c120c] dark:text-[#faf6f2] transition-colors duration-200">
      {/* Left Sidebar (Desktop Only) */}
      <Sidebar
        isMobileOpen={isMobileMenuOpen}
        setIsMobileOpen={setIsMobileMenuOpen}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 pb-20 md:pb-0">
        <TopBar
          isMobileOpen={isMobileMenuOpen}
          onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        />

        <main className="flex-1 w-full min-w-0">
          {activeView === 'home' ? (
            <HomeView />
          ) : (
            <div className="p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
              {renderActiveView()}
            </div>
          )}
        </main>
      </div>

      {/* Mobile & Tablet Bottom Navigation Bar */}
      <BottomNavBar />

      {/* Global Universal Modals */}
      <UniversalSearchModal />
      <MediaDetailModal />
      <CustomListModal />
      <QuickProgressModal />
      <OfflineIndicator />
      <EhsaanStudioWelcomeModal />
    </div>
  );
};

export default function App() {
  return (
    <CollectionProvider>
      <MainLayout />
    </CollectionProvider>
  );
}
