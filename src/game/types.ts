export type GameState = 'title' | 'playing' | 'paused' | 'gameover';

export type MedalType = 'none' | 'bronze' | 'silver' | 'gold' | 'platinum';

export type Difficulty = 'easy' | 'classic' | 'hard';

export type SkinEffectType =
  | 'feathers'
  | 'wind'
  | 'fire'
  | 'cyber'
  | 'sonic'
  | 'gold'
  | 'cosmic'
  | 'pixel'
  | 'dragon'
  | 'rocket'
  | 'rainbow'
  | 'ghost';

export type SkinSoundType = 'classic' | 'cyber' | 'rocket' | 'magic' | 'heavy' | 'retro' | 'ghost';

export type SkinTier = 'common' | 'rare' | 'epic' | 'legendary';

export interface BirdSkin {
  id: string;
  name: string;
  tier: SkinTier;
  bodyColor: string;
  wingColor: string;
  bellyColor: string;
  beakColor: string;
  eyeColor: string;
  accessory?:
    | 'visor'
    | 'flame'
    | 'bat'
    | 'crown'
    | 'halo'
    | 'jetpack'
    | 'horns'
    | 'sunglasses'
    | 'space_helmet'
    | 'rainbow_crest';
  effectType: SkinEffectType;
  effectColors: string[];
  soundType: SkinSoundType;
  tagline: string;
  auraGlow?: string;
}

export interface ThemeConfig {
  id: string;
  name: string;
  skyTop: string;
  skyBottom: string;
  cloudColor: string;
  buildingFar: string;
  buildingNear: string;
  pipeMain: string;
  pipeShadow: string;
  pipeHighlight: string;
  pipeLipShadow: string;
  groundTop: string;
  groundMain: string;
  groundStripe: string;
  isNight: boolean;
}

export interface Bird {
  x: number;
  y: number;
  vy: number;
  radius: number;
  rotation: number;
  flapFrame: number;
  flapTimer: number;
  skinId: string;
  isDead: boolean;
}

export interface Pipe {
  id: number;
  x: number;
  topHeight: number;
  bottomY: number;
  width: number;
  gap: number;
  passed: boolean;
}

export interface Particle {
  active: boolean;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  life: number;
  maxLife: number;
  shape: 'circle' | 'feather' | 'star' | 'sparkle' | 'square' | 'ring' | 'smoke' | 'ember' | 'beam';
  rotation: number;
  vRot: number;
}

export interface ScorePopup {
  id: number;
  x: number;
  y: number;
  text: string;
  alpha: number;
  scale: number;
  life: number;
}

export interface RunHistoryItem {
  id: string;
  score: number;
  date: string;
  skinId: string;
  medal: MedalType;
  difficulty: Difficulty;
}
