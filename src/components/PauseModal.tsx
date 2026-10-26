import React from 'react';
import { Play, RotateCcw, Home, Volume2, VolumeX } from 'lucide-react';

interface PauseModalProps {
  onResume: () => void;
  onRestart: () => void;
  onTitle: () => void;
  currentScore: number;
  bestScore: number;
  isMuted: boolean;
  onToggleMute: () => void;
}

export const PauseModal: React.FC<PauseModalProps> = ({
  onResume,
  onRestart,
  onTitle,
  currentScore,
  bestScore,
  isMuted,
  onToggleMute,
}) => {
  return (
    <div className="absolute inset-0 bg-black/60 flex items-center justify-center p-4 z-20 select-none animate-fadeIn">
      <div className="w-full max-w-xs bg-slate-900 border-4 border-amber-400/80 rounded-3xl p-6 text-center shadow-[0_12px_40px_rgba(0,0,0,0.8)] text-white">
        <h2 className="font-arcade text-2xl text-amber-300 arcade-stroke tracking-wider mb-4">
          PAUSED
        </h2>

        {/* Stats Strip */}
        <div className="grid grid-cols-2 gap-3 mb-6 bg-slate-800/80 p-3 rounded-2xl border border-white/10">
          <div>
            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Score</div>
            <div className="font-arcade text-xl text-white tabular-nums">{currentScore}</div>
          </div>
          <div>
            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Best</div>
            <div className="font-arcade text-xl text-yellow-400 tabular-nums">{bestScore}</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2.5">
          <button
            onClick={onResume}
            className="w-full py-3 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 rounded-xl font-arcade text-xs text-white tracking-wider flex items-center justify-center gap-2 border-2 border-slate-900 shadow active:scale-95 transition cursor-pointer"
            aria-label="Resume game"
          >
            <Play className="w-4 h-4 fill-white" />
            RESUME (ESC / P)
          </button>

          <button
            onClick={onRestart}
            className="w-full py-3 bg-slate-800 hover:bg-slate-700 border border-white/20 hover:border-amber-400 rounded-xl font-arcade text-xs text-amber-300 tracking-wider flex items-center justify-center gap-2 shadow active:scale-95 transition cursor-pointer"
            aria-label="Restart run"
          >
            <RotateCcw className="w-4 h-4" />
            RESTART (R)
          </button>

          <div className="flex gap-2">
            <button
              onClick={onToggleMute}
              className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 border border-white/20 rounded-xl text-xs font-bold text-slate-300 flex items-center justify-center gap-1.5 transition cursor-pointer"
              aria-label={isMuted ? 'Unmute sound' : 'Mute sound'}
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
              <span>{isMuted ? 'Unmute' : 'Mute'}</span>
            </button>

            <button
              onClick={onTitle}
              className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 border border-white/20 rounded-xl text-xs font-bold text-slate-300 flex items-center justify-center gap-1.5 transition cursor-pointer"
              aria-label="Exit to title screen"
            >
              <Home className="w-4 h-4 text-cyan-400" />
              <span>Menu</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
