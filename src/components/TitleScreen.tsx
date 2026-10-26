import React from 'react';
import { BirdSkin, Difficulty, ThemeConfig } from '../game/types';
import { Volume2, VolumeX, Sparkles, Trophy, Palette, SunMoon, Maximize2, Smartphone } from 'lucide-react';

interface TitleScreenProps {
  onStart: () => void;
  bestScore: number;
  currentSkin: BirdSkin;
  onOpenSkins: () => void;
  difficulty: Difficulty;
  onChangeDifficulty: (d: Difficulty) => void;
  currentTheme: ThemeConfig;
  onCycleTheme: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
  onOpenScores: () => void;
  isLandscapeWide: boolean;
  onToggleLayoutMode: () => void;
}

export const TitleScreen: React.FC<TitleScreenProps> = ({
  onStart,
  bestScore,
  currentSkin,
  onOpenSkins,
  difficulty,
  onChangeDifficulty,
  currentTheme,
  onCycleTheme,
  isMuted,
  onToggleMute,
  onOpenScores,
  isLandscapeWide,
  onToggleLayoutMode,
}) => {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-between p-3 sm:p-6 pointer-events-none select-none z-10 overflow-y-auto">
      {/* Top Bar Utilities */}
      <div className="w-full flex justify-between items-center pointer-events-auto shrink-0">
        {/* Best Score Pill */}
        <div className="flex items-center gap-2 bg-black/60 border border-white/20 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full text-white shadow-lg">
          <Trophy className="w-4 h-4 text-yellow-400" />
          <span className="text-[11px] sm:text-xs uppercase tracking-wider text-slate-300 font-bold">Best</span>
          <span className="font-arcade text-xs sm:text-sm text-yellow-300">{bestScore}</span>
        </div>

        {/* Top Controls: Layout, Theme, Mute */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            onClick={onToggleLayoutMode}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-black/60 border border-white/20 text-white flex items-center justify-center hover:bg-black/80 hover:border-cyan-400 transition active:scale-95 shadow-lg cursor-pointer"
            title={isLandscapeWide ? 'Switch to Arcade Cabinet View' : 'Switch to Widescreen Landscape'}
            aria-label="Toggle viewport layout"
          >
            {isLandscapeWide ? (
              <Smartphone className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-300" />
            ) : (
              <Maximize2 className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-300" />
            )}
          </button>

          <button
            onClick={onCycleTheme}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-black/60 border border-white/20 text-white flex items-center justify-center hover:bg-black/80 hover:border-yellow-400 transition active:scale-95 shadow-lg cursor-pointer"
            title={`Theme: ${currentTheme.name}`}
            aria-label="Cycle theme"
          >
            <SunMoon className="w-4 h-4 sm:w-5 sm:h-5 text-amber-300" />
          </button>

          <button
            onClick={onToggleMute}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-black/60 border border-white/20 text-white flex items-center justify-center hover:bg-black/80 hover:border-yellow-400 transition active:scale-95 shadow-lg cursor-pointer"
            title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
            aria-label={isMuted ? 'Unmute Audio' : 'Mute Audio'}
          >
            {isMuted ? (
              <VolumeX className="w-4 h-4 sm:w-5 sm:h-5 text-rose-400" />
            ) : (
              <Volume2 className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400" />
            )}
          </button>
        </div>
      </div>

      {/* Hero Title & Start Section */}
      <div className="flex flex-col items-center text-center my-auto pt-1 sm:pt-4 pointer-events-auto max-w-xl">
        {/* Custom SVG Arcade Title Lockup */}
        <div className="mb-2 sm:mb-4 drop-shadow-2xl">
          <svg className="w-48 sm:w-72 max-w-full" viewBox="0 0 340 100">
            <defs>
              <linearGradient id="titleGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#FEF08A" />
                <stop offset="45%" stopColor="#FACC15" />
                <stop offset="100%" stopColor="#EA580C" />
              </linearGradient>
              <filter id="titleShadow" x="-10%" y="-10%" width="120%" height="120%">
                <feDropShadow dx="0" dy="5" stdDeviation="2" floodColor="#000000" floodOpacity="0.8" />
              </filter>
            </defs>
            <text
              x="170"
              y="52"
              textAnchor="middle"
              className="font-arcade"
              fill="url(#titleGrad)"
              stroke="#000000"
              strokeWidth="7"
              paintOrder="stroke fill"
              fontSize="38"
              fontWeight="900"
              filter="url(#titleShadow)"
              letterSpacing="2"
            >
              FLAPPY
            </text>
            <text
              x="170"
              y="90"
              textAnchor="middle"
              className="font-arcade"
              fill="#FFFFFF"
              stroke="#000000"
              strokeWidth="6"
              paintOrder="stroke fill"
              fontSize="30"
              fontWeight="900"
              letterSpacing="3"
            >
              BIRD
            </text>
          </svg>
        </div>

        {/* Primary Start CTA Button */}
        <button
          data-start="true"
          onClick={onStart}
          className="group relative px-6 py-2 sm:px-8 sm:py-3.5 bg-gradient-to-b from-yellow-400 via-amber-500 to-amber-600 rounded-2xl border-4 border-slate-900 shadow-[0_4px_0_#0f172a,0_8px_16px_rgba(0,0,0,0.4)] hover:shadow-[0_2px_0_#0f172a,0_4px_8px_rgba(0,0,0,0.3)] hover:translate-y-0.5 active:translate-y-1.5 active:shadow-[0_1px_0_#0f172a] transition-all cursor-pointer font-arcade text-white text-xs sm:text-sm tracking-wider arcade-stroke mb-2 sm:mb-4"
          aria-label="Start Game"
        >
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-white animate-ping" />
            START FLAP
          </span>
        </button>

        {/* Secondary Action Row: Skins & High Scores */}
        <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-3 mb-2 sm:mb-3">
          <button
            onClick={onOpenSkins}
            className="flex items-center gap-1.5 px-3 py-1 sm:px-4 sm:py-2 bg-slate-900/85 hover:bg-slate-900 border-2 border-white/30 hover:border-yellow-400 text-white text-[10px] sm:text-xs font-bold rounded-xl transition shadow active:scale-95 cursor-pointer"
            aria-label="Customize bird skin"
          >
            <Palette className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-cyan-400" />
            <span className="truncate max-w-[130px] sm:max-w-none">Skin: {currentSkin.name}</span>
          </button>

          <button
            onClick={onOpenScores}
            className="flex items-center gap-1.5 px-3 py-1 sm:px-4 sm:py-2 bg-slate-900/85 hover:bg-slate-900 border-2 border-white/30 hover:border-yellow-400 text-white text-[10px] sm:text-xs font-bold rounded-xl transition shadow active:scale-95 cursor-pointer"
            aria-label="View leaderboards"
          >
            <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-yellow-400" />
            <span>Leaderboard</span>
          </button>
        </div>

        {/* Difficulty Selector */}
        <div className="flex items-center gap-1 bg-black/60 p-1 sm:p-1.5 rounded-xl border border-white/20 text-[10px] sm:text-xs font-bold">
          <span className="text-slate-400 px-1 uppercase text-[9px] sm:text-[10px] tracking-wider">Mode:</span>
          {(['easy', 'classic', 'hard'] as Difficulty[]).map((d) => (
            <button
              key={d}
              onClick={() => onChangeDifficulty(d)}
              className={`px-2 py-0.5 sm:px-3 sm:py-1 rounded-lg capitalize transition cursor-pointer ${
                difficulty === d
                  ? 'bg-amber-500 text-slate-950 font-black shadow'
                  : 'text-slate-300 hover:text-white hover:bg-white/10'
              }`}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      {/* Clean Control Hint in Bottom Safe Margin */}
      <div className="text-white/80 text-[10px] sm:text-[11px] font-semibold tracking-wide drop-shadow pointer-events-none pb-1 sm:pb-2 text-center shrink-0">
        SPACE / TAP to Flap · ESC / P to Pause · M to Mute
      </div>
    </div>
  );
};
