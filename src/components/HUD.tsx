import React from 'react';
import { Volume2, VolumeX, Pause } from 'lucide-react';
import { MedalType } from '../game/types';

interface HUDProps {
  score: number;
  currentMedal: MedalType;
  isMuted: boolean;
  onToggleMute: () => void;
  onPause: () => void;
}

export const HUD: React.FC<HUDProps> = ({
  score,
  currentMedal,
  isMuted,
  onToggleMute,
  onPause,
}) => {
  return (
    <div className="absolute inset-0 pointer-events-none select-none z-10 flex flex-col justify-between p-4">
      {/* Top HUD Row */}
      <div className="w-full flex items-start justify-between">
        {/* Current Run Medal Pip if any */}
        <div className="w-24">
          {currentMedal !== 'none' && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-black/50 border border-white/20 rounded-full text-white text-xs font-bold animate-pulse shadow-lg">
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
              <span className="capitalize text-yellow-300 font-arcade text-[10px]">{currentMedal}</span>
            </div>
          )}
        </div>

        {/* Large Arcade Score Readout (Centered) */}
        <div className="flex flex-col items-center">
          <span
            className="font-arcade text-5xl sm:text-6xl text-white arcade-stroke tabular-nums tracking-wider filter drop-shadow-lg"
            data-testid="hud-score"
          >
            {score}
          </span>
        </div>

        {/* Top-Right Controls */}
        <div className="flex items-center gap-2 pointer-events-auto">
          <button
            onClick={onToggleMute}
            tabIndex={-1}
            className="w-10 h-10 rounded-xl bg-black/50 border border-white/20 text-white flex items-center justify-center hover:bg-black/75 hover:border-yellow-400/60 transition active:scale-95 shadow cursor-pointer"
            title={isMuted ? 'Unmute' : 'Mute'}
            aria-label={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? <VolumeX className="w-5 h-5 text-rose-400" /> : <Volume2 className="w-5 h-5 text-emerald-400" />}
          </button>
          <button
            onClick={onPause}
            tabIndex={-1}
            className="w-10 h-10 rounded-xl bg-black/50 border border-white/20 text-white flex items-center justify-center hover:bg-black/75 hover:border-yellow-400/60 transition active:scale-95 shadow cursor-pointer"
            title="Pause (P or Esc)"
            aria-label="Pause game"
          >
            <Pause className="w-5 h-5 text-amber-300" />
          </button>
        </div>
      </div>

      {/* Bottom Hint on First Few Seconds */}
      {score === 0 && (
        <div className="w-full text-center pb-2 text-white/80 font-bold text-xs tracking-wider arcade-stroke-sm animate-pulse">
          TAP OR PRESS SPACE TO FLAP
        </div>
      )}
    </div>
  );
};
