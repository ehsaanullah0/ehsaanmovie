import React, { useState } from 'react';
import { X, Check, ArrowRight, Play, RotateCcw } from 'lucide-react';
import { useCollection } from '../context/CollectionContext';
import { MediaPoster } from './MediaPoster';

export const QuickProgressModal: React.FC = () => {
  const {
    progressModalItem,
    setProgressModalItem,
    updateProgress,
    toggleEpisodeWatched,
  } = useCollection();

  if (!progressModalItem) return null;

  const item = progressModalItem;
  const isSeries = item.type === 'series';
  const currentProgress = item.progressPercentage || 0;

  const handleAdjust = (delta: number) => {
    updateProgress(item.id, currentProgress + delta);
  };

  const handleNextEpisode = () => {
    if (item.seasonsData && item.currentSeason) {
      const season = item.seasonsData.find((s) => s.seasonNumber === item.currentSeason);
      if (season) {
        const nextEpNum = (item.currentEpisode || 1) + 1;
        const nextEp = season.episodes.find((e) => e.episodeNumber === nextEpNum);
        if (nextEp) {
          toggleEpisodeWatched(item.id, season.seasonNumber, nextEpNum);
          return;
        }
      }
    }
    // Fallback step progress
    handleAdjust(10);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div
        className="w-full max-w-md rounded-2xl sm:rounded-3xl bg-white dark:bg-[#1e1511] border border-[#e4e4e7] dark:border-[#382820] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150 text-[#09090b] dark:text-[#faf6f2]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#e4e4e7] dark:border-[#382820] bg-[#fafafc] dark:bg-[#251a15]">
          <h3 className="text-sm font-extrabold text-[#09090b] dark:text-[#faf6f2]">Update Watching Progress</h3>
          <button
            onClick={() => setProgressModalItem(null)}
            className="p-1 rounded-lg text-[#71717a] hover:text-[#09090b] dark:hover:text-[#faf6f2] hover:bg-[#f1f2f4] dark:hover:bg-[#2e2019] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Item Preview */}
          <div className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-[#f8f9fa] dark:bg-[#251a15] border border-[#e4e4e7] dark:border-[#382820]">
            <div className="w-12 h-16 shrink-0 rounded-lg overflow-hidden border border-[#e4e4e7] dark:border-neutral-800">
              <MediaPoster
                src={item.poster}
                alt={item.title}
                type={item.type}
                genres={item.genres}
                title={item.title}
                year={item.year}
                aspectRatio="portrait"
                stickerSize={36}
              />
            </div>
            <div className="min-w-0">
              <h4 className="text-sm font-bold text-[#09090b] dark:text-[#faf6f2] truncate">{item.title}</h4>
              <p className="text-xs text-[#71717a] dark:text-[#baa698] font-mono mt-0.5">
                {isSeries
                  ? `Series · S${item.currentSeason || 1} E${item.currentEpisode || 1}`
                  : `Movie · ${item.runtime}`}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs font-mono font-extrabold text-[#09090b] dark:text-[#faf6f2]">
                  {currentProgress}%
                </span>
                <span className="text-[11px] text-[#71717a]">watched</span>
              </div>
            </div>
          </div>

          {/* Slider */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-[#71717a] dark:text-[#baa698] font-medium">
              <span>Adjust timeline:</span>
              <span className="font-mono text-[#09090b] dark:text-[#faf6f2] font-bold">{currentProgress}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={currentProgress}
              onChange={(e) => updateProgress(item.id, Number(e.target.value))}
              className="w-full h-2.5 bg-[#e4e4e7] dark:bg-[#382820] rounded-lg appearance-none cursor-pointer accent-[#09090b] dark:accent-[#caa282]"
            />
          </div>

          {/* Quick Increment Buttons */}
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => handleAdjust(5)}
              className="py-2 px-3 rounded-xl text-xs font-bold bg-[#f4f4f5] dark:bg-[#281d17] border border-[#e4e4e7] dark:border-transparent hover:bg-[#09090b] hover:text-white dark:hover:bg-[#faf6f2] dark:hover:text-[#231814] text-[#09090b] dark:text-[#faf6f2] transition-colors cursor-pointer"
            >
              + 5%
            </button>
            <button
              onClick={() => handleAdjust(10)}
              className="py-2 px-3 rounded-xl text-xs font-bold bg-[#f4f4f5] dark:bg-[#281d17] border border-[#e4e4e7] dark:border-transparent hover:bg-[#09090b] hover:text-white dark:hover:bg-[#faf6f2] dark:hover:text-[#231814] text-[#09090b] dark:text-[#faf6f2] transition-colors cursor-pointer"
            >
              + 10%
            </button>
            <button
              onClick={() => handleAdjust(25)}
              className="py-2 px-3 rounded-xl text-xs font-bold bg-[#f4f4f5] dark:bg-[#281d17] border border-[#e4e4e7] dark:border-transparent hover:bg-[#09090b] hover:text-white dark:hover:bg-[#faf6f2] dark:hover:text-[#231814] text-[#09090b] dark:text-[#faf6f2] transition-colors cursor-pointer"
            >
              + 25%
            </button>
          </div>

          {/* Series Next Episode or Movie Mark Watched */}
          {isSeries ? (
            <button
              onClick={handleNextEpisode}
              className="w-full py-3 px-4 rounded-xl text-xs font-bold bg-[#09090b] dark:bg-[#faf6f2] hover:bg-[#27272a] text-white dark:text-[#231814] transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs active:scale-95"
            >
              <ArrowRight className="w-4 h-4" />
              <span>Next Episode (S{item.currentSeason || 1} E{(item.currentEpisode || 1) + 1})</span>
            </button>
          ) : (
            <button
              onClick={() => {
                updateProgress(item.id, 100);
                setProgressModalItem(null);
              }}
              className="w-full py-3 px-4 rounded-xl text-xs font-bold bg-[#09090b] dark:bg-[#faf6f2] hover:bg-[#27272a] text-white dark:text-[#231814] transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs active:scale-95"
            >
              <Check className="w-4 h-4 stroke-[3]" />
              <span>Mark as Completed (100%)</span>
            </button>
          )}

          <div className="flex items-center justify-between pt-1 text-xs">
            <button
              onClick={() => updateProgress(item.id, 0)}
              className="text-[#71717a] hover:text-[#09090b] dark:hover:text-[#faf6f2] flex items-center gap-1 cursor-pointer font-semibold"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reset to 0%
            </button>
            <button
              onClick={() => setProgressModalItem(null)}
              className="text-[#09090b] dark:text-[#faf6f2] font-bold hover:underline cursor-pointer"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
