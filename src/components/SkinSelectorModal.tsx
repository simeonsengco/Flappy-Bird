import React from 'react';
import { SKINS } from '../game/constants';
import { BirdSkin, SkinTier } from '../game/types';
import { X, Check, Sparkles, Flame, Zap, Wind, Orbit } from 'lucide-react';

interface SkinSelectorModalProps {
  selectedSkinId: string;
  onSelectSkin: (skin: BirdSkin) => void;
  onClose: () => void;
}

export const SkinSelectorModal: React.FC<SkinSelectorModalProps> = ({
  selectedSkinId,
  onSelectSkin,
  onClose,
}) => {
  const getTierColor = (tier: SkinTier) => {
    switch (tier) {
      case 'legendary':
        return 'text-amber-300 bg-amber-400/20 border-amber-400/50';
      case 'epic':
        return 'text-purple-300 bg-purple-500/20 border-purple-500/50';
      case 'rare':
        return 'text-cyan-300 bg-cyan-500/20 border-cyan-500/50';
      default:
        return 'text-slate-300 bg-slate-700/50 border-slate-600';
    }
  };

  const getEffectIcon = (effect: string) => {
    switch (effect) {
      case 'fire':
      case 'dragon':
        return <Flame className="w-3 h-3 text-orange-400" />;
      case 'cyber':
        return <Zap className="w-3 h-3 text-cyan-400" />;
      case 'rocket':
        return <Flame className="w-3 h-3 text-red-400" />;
      case 'cosmic':
        return <Orbit className="w-3 h-3 text-indigo-400" />;
      case 'wind':
        return <Wind className="w-3 h-3 text-sky-400" />;
      default:
        return <Sparkles className="w-3 h-3 text-yellow-300" />;
    }
  };

  return (
    <div className="absolute inset-0 bg-black/80 flex items-center justify-center p-3 sm:p-5 z-30 select-none animate-fadeIn">
      <div className="w-full max-w-2xl bg-slate-900 border-4 border-cyan-400 rounded-3xl p-4 sm:p-6 shadow-[0_12px_45px_rgba(0,0,0,0.95)] text-white flex flex-col max-h-[94vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-3">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-cyan-400 animate-pulse" />
            <h2 className="font-arcade text-xs sm:text-sm text-cyan-300 arcade-stroke">
              FLAPPER GARAGE ({SKINS.length} SKINS)
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-300 hover:text-white transition cursor-pointer"
            aria-label="Close skin selector"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Responsive Multi-Column Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 overflow-y-auto pr-1 flex-1 py-1">
          {SKINS.map((skin) => {
            const isSelected = skin.id === selectedSkinId;
            return (
              <button
                key={skin.id}
                onClick={() => onSelectSkin(skin)}
                className={`flex flex-col justify-between p-3 rounded-2xl border-2 transition cursor-pointer text-left relative ${
                  isSelected
                    ? 'bg-cyan-950/70 border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.35)]'
                    : 'bg-slate-800/80 border-white/10 hover:border-white/40 hover:bg-slate-800'
                }`}
                aria-label={`Select ${skin.name}`}
              >
                {/* Top Row: Mini Avatar + Info */}
                <div className="flex items-start gap-2.5 mb-2">
                  {/* Visual Bird Mini Icon */}
                  <div
                    className="w-11 h-11 shrink-0 rounded-xl flex items-center justify-center border-2 border-slate-950 shadow-inner relative overflow-hidden"
                    style={{ backgroundColor: skin.bodyColor }}
                  >
                    {/* Mini wing */}
                    <div
                      className="w-5 h-4 rounded-full border border-black absolute -left-1 bottom-1.5"
                      style={{ backgroundColor: skin.wingColor }}
                    />
                    {/* Mini eye */}
                    <div
                      className="w-3.5 h-3.5 rounded-full border border-black absolute right-2 top-1.5 flex items-center justify-center"
                      style={{ backgroundColor: skin.eyeColor }}
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-black ml-0.5" />
                    </div>
                    {/* Mini beak */}
                    <div
                      className="w-3 h-2 rounded-r-md border border-black absolute -right-0.5 top-3"
                      style={{ backgroundColor: skin.beakColor }}
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <span className="font-arcade text-[10px] sm:text-xs text-white truncate">
                        {skin.name}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 mt-1">
                      <span
                        className={`text-[9px] uppercase font-bold px-1.5 py-0.5 rounded border ${getTierColor(
                          skin.tier
                        )}`}
                      >
                        {skin.tier}
                      </span>
                      <span className="inline-flex items-center gap-0.5 text-[9px] text-slate-300 bg-white/5 px-1.5 py-0.5 rounded capitalize">
                        {getEffectIcon(skin.effectType)}
                        <span>{skin.effectType}</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Tagline description */}
                <div className="text-[10px] text-slate-400 line-clamp-2 mb-2 leading-tight">
                  {skin.tagline}
                </div>

                {/* Select / Active Button Footer */}
                <div className="pt-1.5 border-t border-white/10 flex items-center justify-between">
                  {isSelected ? (
                    <div className="flex items-center gap-1.5 text-cyan-400 font-arcade text-[9px] font-bold">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                      <span>EQUIPPED</span>
                    </div>
                  ) : (
                    <span className="text-[10px] font-bold text-slate-400 group-hover:text-white">
                      Tap to Equip
                    </span>
                  )}
                  <span className="text-[9px] text-slate-500 uppercase">{skin.soundType} SFX</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Footer Done Button */}
        <button
          onClick={onClose}
          className="mt-3 w-full py-2.5 sm:py-3 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-arcade text-xs rounded-xl shadow active:scale-95 transition cursor-pointer"
          aria-label="Confirm skin selection"
        >
          READY TO FLY
        </button>
      </div>
    </div>
  );
};
