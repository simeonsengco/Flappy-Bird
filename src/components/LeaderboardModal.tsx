import React from 'react';
import { RunHistoryItem } from '../game/types';
import { X, Trophy, Medal } from 'lucide-react';
import { SKINS } from '../game/constants';

interface LeaderboardModalProps {
  history: RunHistoryItem[];
  bestScore: number;
  onClose: () => void;
  onClearHistory: () => void;
}

export const LeaderboardModal: React.FC<LeaderboardModalProps> = ({
  history,
  bestScore,
  onClose,
  onClearHistory,
}) => {
  const getSkinName = (skinId: string) => {
    return SKINS.find((s) => s.id === skinId)?.name || 'Classic';
  };

  return (
    <div className="absolute inset-0 bg-black/75 flex items-center justify-center p-4 z-30 select-none animate-fadeIn">
      <div className="w-full max-w-sm bg-slate-900 border-4 border-yellow-400 rounded-3xl p-5 shadow-[0_12px_40px_rgba(0,0,0,0.9)] text-white flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-400" />
            <h2 className="font-arcade text-sm text-yellow-300 arcade-stroke">HALL OF FAME</h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-300 hover:text-white transition cursor-pointer"
            aria-label="Close leaderboard"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Top Record Spotlight */}
        <div className="bg-gradient-to-r from-amber-500/20 via-yellow-500/20 to-amber-500/20 border border-yellow-500/40 rounded-2xl p-3.5 flex items-center justify-between mb-4">
          <div>
            <div className="text-[10px] uppercase font-bold text-yellow-400 tracking-wider">All-Time Best</div>
            <div className="text-xs text-slate-300 mt-0.5">Personal High Record</div>
          </div>
          <div className="font-arcade text-2xl text-yellow-300 arcade-stroke tabular-nums">
            {bestScore}
          </div>
        </div>

        {/* Runs List */}
        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 px-1">
          Recent Runs
        </div>

        <div className="flex flex-col gap-2 overflow-y-auto pr-1 flex-1">
          {history.length === 0 ? (
            <div className="text-center py-8 text-slate-500 text-xs">
              No runs recorded yet. Flap your wings to get on the board!
            </div>
          ) : (
            history.map((run, index) => (
              <div
                key={run.id}
                className="flex items-center justify-between p-2.5 rounded-xl bg-slate-800/80 border border-white/10"
              >
                <div className="flex items-center gap-2.5">
                  <span className="font-arcade text-xs text-slate-400 w-4">#{index + 1}</span>
                  <div>
                    <div className="font-bold text-xs text-white flex items-center gap-1.5">
                      <span>{getSkinName(run.skinId)}</span>
                      {run.medal !== 'none' && (
                        <span className="inline-flex items-center px-1.5 py-0.2 rounded text-[9px] uppercase font-bold bg-amber-400/20 text-yellow-300 border border-yellow-400/40">
                          <Medal className="w-2.5 h-2.5 mr-0.5" />
                          {run.medal}
                        </span>
                      )}
                    </div>
                    <div className="text-[10px] text-slate-400 capitalize">
                      {run.difficulty} · {run.date}
                    </div>
                  </div>
                </div>

                <div className="font-arcade text-base text-yellow-300 tabular-nums">
                  {run.score}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex gap-2 mt-4">
          {history.length > 0 && (
            <button
              onClick={onClearHistory}
              className="py-2.5 px-3 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-rose-400 text-xs font-bold rounded-xl transition cursor-pointer"
              aria-label="Clear run history"
            >
              Clear
            </button>
          )}
          <button
            onClick={onClose}
            className="flex-1 py-2.5 bg-yellow-500 hover:bg-yellow-400 text-slate-950 font-arcade text-xs rounded-xl shadow active:scale-95 transition cursor-pointer"
            aria-label="Close leaderboard"
          >
            CLOSE
          </button>
        </div>
      </div>
    </div>
  );
};
