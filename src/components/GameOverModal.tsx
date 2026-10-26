import React from 'react';
import { MedalType, BirdSkin } from '../game/types';
import { RotateCcw, Home, Trophy, Palette, Sparkles } from 'lucide-react';

interface GameOverModalProps {
  score: number;
  bestScore: number;
  isNewHigh: boolean;
  medal: MedalType;
  currentSkin: BirdSkin;
  onRestart: () => void;
  onTitle: () => void;
  onOpenSkins: () => void;
  onOpenScores: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  score,
  bestScore,
  isNewHigh,
  medal,
  currentSkin,
  onRestart,
  onTitle,
  onOpenSkins,
  onOpenScores,
}) => {
  const getMedalBadge = () => {
    switch (medal) {
      case 'platinum':
        return (
          <div className="w-16 h-16 rounded-full platinum-shimmer border-4 border-cyan-100 flex flex-col items-center justify-center shadow-lg transform hover:scale-105 transition">
            <Sparkles className="w-6 h-6 text-cyan-900" />
            <span className="font-arcade text-[8px] text-cyan-950 font-black mt-0.5">PLAT</span>
          </div>
        );
      case 'gold':
        return (
          <div className="w-16 h-16 rounded-full gold-shimmer border-4 border-yellow-200 flex flex-col items-center justify-center shadow-lg transform hover:scale-105 transition">
            <Trophy className="w-6 h-6 text-yellow-950" />
            <span className="font-arcade text-[8px] text-yellow-950 font-black mt-0.5">GOLD</span>
          </div>
        );
      case 'silver':
        return (
          <div className="w-16 h-16 rounded-full silver-shimmer border-4 border-white flex flex-col items-center justify-center shadow-lg transform hover:scale-105 transition">
            <Trophy className="w-6 h-6 text-slate-700" />
            <span className="font-arcade text-[8px] text-slate-800 font-black mt-0.5">SILVER</span>
          </div>
        );
      case 'bronze':
        return (
          <div className="w-16 h-16 rounded-full bronze-shimmer border-4 border-amber-200 flex flex-col items-center justify-center shadow-lg transform hover:scale-105 transition">
            <Trophy className="w-6 h-6 text-amber-950" />
            <span className="font-arcade text-[8px] text-amber-950 font-black mt-0.5">BRONZE</span>
          </div>
        );
      default:
        return (
          <div className="w-16 h-16 rounded-full bg-slate-800 border-2 border-dashed border-slate-600 flex flex-col items-center justify-center text-slate-500">
            <span className="text-[10px] font-bold">10+ for</span>
            <span className="text-[10px] font-bold text-amber-500">Medal</span>
          </div>
        );
    }
  };

  return (
    <div className="absolute inset-0 bg-black/60 flex items-center justify-center p-3 sm:p-4 z-20 select-none animate-fadeIn">
      <div className="w-full max-w-sm max-h-[94vh] overflow-y-auto bg-slate-900 border-4 border-amber-500 rounded-3xl p-4 sm:p-6 text-center shadow-[0_12px_45px_rgba(0,0,0,0.85)] text-white">
        {/* Game Over Title */}
        <h2 className="font-arcade text-xl sm:text-2xl text-rose-500 arcade-stroke tracking-wider mb-3 sm:mb-4">
          GAME OVER
        </h2>

        {/* Arcade Scoreboard Card */}
        <div className="relative bg-gradient-to-b from-amber-100 to-amber-200 rounded-2xl p-4 border-4 border-amber-700 text-slate-900 shadow-inner mb-6">
          {/* "NEW" Ribbon Badge */}
          {isNewHigh && (
            <div className="absolute -top-3 -right-2 bg-rose-600 text-white font-arcade text-[9px] px-2.5 py-1 rounded-md border-2 border-white shadow-md animate-bounce">
              NEW BEST!
            </div>
          )}

          <div className="flex items-center justify-between gap-4">
            {/* Medal Showcase */}
            <div className="flex flex-col items-center">
              <span className="font-arcade text-[9px] text-amber-900 font-bold mb-1.5 uppercase">
                Medal
              </span>
              {getMedalBadge()}
            </div>

            {/* Score & Best */}
            <div className="flex flex-col items-end gap-2 flex-1">
              <div>
                <div className="font-arcade text-[9px] text-amber-900 font-bold uppercase tracking-wider">
                  Score
                </div>
                <div className="font-arcade text-2xl text-slate-950 tabular-nums" data-testid="gameover-score">
                  {score}
                </div>
              </div>
              <div>
                <div className="font-arcade text-[9px] text-amber-900 font-bold uppercase tracking-wider">
                  Best
                </div>
                <div className="font-arcade text-xl text-amber-700 tabular-nums">
                  {bestScore}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2.5">
          {/* Primary Restart CTA with data-start="true" */}
          <button
            data-start="true"
            onClick={onRestart}
            className="w-full py-3.5 bg-gradient-to-b from-yellow-400 via-amber-500 to-amber-600 rounded-2xl border-4 border-slate-950 font-arcade text-xs text-white tracking-wider flex items-center justify-center gap-2 shadow-[0_4px_0_#0f172a] hover:shadow-[0_2px_0_#0f172a] hover:translate-y-0.5 active:translate-y-1 active:shadow-none transition arcade-stroke cursor-pointer"
            aria-label="Play Again"
          >
            <RotateCcw className="w-4 h-4 stroke-[3]" />
            PLAY AGAIN (SPACE)
          </button>

          <div className="flex gap-2">
            <button
              onClick={onOpenSkins}
              className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 border border-white/20 rounded-xl text-xs font-bold text-slate-300 flex items-center justify-center gap-1.5 transition cursor-pointer"
              aria-label="Switch bird skin"
            >
              <Palette className="w-4 h-4 text-cyan-400" />
              <span>Skins</span>
            </button>

            <button
              onClick={onOpenScores}
              className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 border border-white/20 rounded-xl text-xs font-bold text-slate-300 flex items-center justify-center gap-1.5 transition cursor-pointer"
              aria-label="View leaderboards"
            >
              <Trophy className="w-4 h-4 text-yellow-400" />
              <span>Ranks</span>
            </button>

            <button
              onClick={onTitle}
              className="px-3 py-2.5 bg-slate-800 hover:bg-slate-700 border border-white/20 rounded-xl text-xs font-bold text-slate-300 flex items-center justify-center transition cursor-pointer"
              title="Menu"
              aria-label="Back to main menu"
            >
              <Home className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
