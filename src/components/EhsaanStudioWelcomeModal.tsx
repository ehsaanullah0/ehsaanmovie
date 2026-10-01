import React from 'react';
import {
  HardDrive,
  Film,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  Info,
  CheckCircle2,
  Database,
} from 'lucide-react';
import { useCollection } from '../context/CollectionContext';
import { BrandClapperboardLogo } from './BrandClapperboardLogo';

export const EhsaanStudioWelcomeModal: React.FC = () => {
  const { showWelcomeModal, dismissWelcomeModal } = useCollection();

  if (!showWelcomeModal) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="welcome-modal-title"
      className="fixed inset-0 z-100 flex items-center justify-center p-4 sm:p-6 md:p-8 bg-black/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-300"
    >
      <div className="relative w-full max-w-2xl bg-white dark:bg-[#1a120e] text-[#09090b] dark:text-[#faf6f2] border border-[#e4e4e7] dark:border-[#382820] rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-4 duration-300 my-auto">
        {/* Subtle Ambient Decorative Glow */}
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-amber-500/10 dark:bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-[#caa282]/10 dark:bg-[#caa282]/15 rounded-full blur-3xl pointer-events-none" />

        {/* Header Section */}
        <div className="text-center space-y-2 relative z-10">
          <BrandClapperboardLogo size={56} className="mx-auto mb-2 shadow-md rounded-2xl" />

          <div className="inline-flex items-center gap-1.5 text-[10px] sm:text-[11px] font-mono font-extrabold uppercase tracking-[0.2em] text-[#1c120c] dark:text-[#231814] bg-[#caa282] border border-black/20 px-3 py-1 rounded-full shadow-xs">
            <Sparkles className="w-3.5 h-3.5" />
            <span>EHSAAN MOVIE • WELCOME &amp; NOTICE</span>
          </div>

          <h1
            id="welcome-modal-title"
            className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#09090b] dark:text-[#faf6f2]"
          >
            Welcome to EHSAAN MOVIE
          </h1>

          <p className="text-xs sm:text-sm text-[#71717a] dark:text-[#baa698] max-w-lg mx-auto leading-relaxed">
            Your personal, distraction-free cinema vault, discovery hub, and offline-resilient watchlist tracker.
          </p>
        </div>

        {/* 3 Core Notice & Information Cards */}
        <div className="space-y-3.5 my-6 sm:my-7 relative z-10">
          {/* 1. Local Storage & Privacy Notice */}
          <div className="p-4 sm:p-4.5 rounded-2xl bg-[#fdf8f3] dark:bg-[#231814] border border-[#e4e4e7] dark:border-[#382820] space-y-2 shadow-2xs">
            <div className="flex items-center gap-2 text-amber-700 dark:text-[#ea9160]">
              <HardDrive className="w-4 h-4 shrink-0 stroke-[2.5]" />
              <h3 className="text-xs sm:text-sm font-extrabold uppercase tracking-wide text-[#09090b] dark:text-[#faf6f2]">
                1. 100% Local Storage &amp; Privacy First
              </h3>
            </div>
            <p className="text-xs text-[#52525b] dark:text-[#c4b1a4] leading-relaxed">
              All your queued watchlist titles, watched statuses, episode checkmarks, custom lists, personal notes, and ratings are stored directly in your browser's persistent local storage. No tracking, cookies, or external databases are used.
            </p>
            <div className="flex items-center gap-1.5 text-[11px] font-medium text-amber-800 dark:text-[#f0a277] bg-amber-500/10 dark:bg-amber-400/10 px-2.5 py-1 rounded-lg">
              <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
              <span>Offline continuity supported — export JSON backups or save a local copy anytime in Settings.</span>
            </div>
          </div>

          {/* 2. TMDB API Integration */}
          <div className="p-4 sm:p-4.5 rounded-2xl bg-[#fdf8f3] dark:bg-[#231814] border border-[#e4e4e7] dark:border-[#382820] space-y-2 shadow-2xs">
            <div className="flex items-center gap-2 text-amber-700 dark:text-[#ea9160]">
              <Database className="w-4 h-4 shrink-0 stroke-[2.5]" />
              <h3 className="text-xs sm:text-sm font-extrabold uppercase tracking-wide text-[#09090b] dark:text-[#faf6f2]">
                2. Live TMDB API Metadata
              </h3>
            </div>
            <p className="text-xs text-[#52525b] dark:text-[#c4b1a4] leading-relaxed">
              Global cinema discovery, theatrical posters, high-resolution backdrops, trailers, release dates, and cast rosters are fetched in real-time using The Movie Database (TMDB) API for non-commercial personal cataloging.
            </p>
          </div>

          {/* 3. Trademark, Copyright & Legal Notice */}
          <div className="p-4 sm:p-4.5 rounded-2xl bg-[#fdf8f3] dark:bg-[#231814] border border-[#e4e4e7] dark:border-[#382820] space-y-2 shadow-2xs">
            <div className="flex items-center gap-2 text-amber-700 dark:text-[#ea9160]">
              <ShieldCheck className="w-4 h-4 shrink-0 stroke-[2.5]" />
              <h3 className="text-xs sm:text-sm font-extrabold uppercase tracking-wide text-[#09090b] dark:text-[#faf6f2]">
                3. Trademark &amp; Copyright Notice
              </h3>
            </div>
            <p className="text-xs text-[#52525b] dark:text-[#c4b1a4] leading-relaxed">
              All film and television titles, artwork, stills, studio logos, and character names are the trademarks and copyrighted property of their respective production studios, networks, and copyright owners. This application uses the TMDB API but is not endorsed or certified by TMDB.
            </p>
          </div>
        </div>

        {/* Visual Hierarchy Footer / Action Buttons */}
        <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-3 pt-4 border-t border-[#e4e4e7] dark:border-[#33241c] relative z-10">
          <button
            type="button"
            onClick={dismissWelcomeModal}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl text-xs font-bold text-[#71717a] dark:text-[#baa698] hover:text-[#09090b] dark:hover:text-[#faf6f2] transition-colors cursor-pointer text-center"
          >
            Acknowledge &amp; Close
          </button>

          <button
            type="button"
            onClick={dismissWelcomeModal}
            className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-[#caa282] hover:bg-[#d8b598] text-[#231814] border-2 border-black dark:border-[#382820] font-extrabold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
          >
            <span>Enter EHSAAN MOVIE</span>
            <ArrowRight className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>
      </div>
    </div>
  );
};
