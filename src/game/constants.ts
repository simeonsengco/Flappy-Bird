import { BirdSkin, ThemeConfig } from './types';

export const SKINS: BirdSkin[] = [
  {
    id: 'yellow',
    name: 'Classic Faby',
    tier: 'common',
    bodyColor: '#FACC15', // yellow-400
    wingColor: '#EAB308', // yellow-500
    bellyColor: '#FEF08A', // yellow-200
    beakColor: '#F97316', // orange-500
    eyeColor: '#FFFFFF',
    effectType: 'feathers',
    effectColors: ['#FACC15', '#EAB308', '#FFFFFF'],
    soundType: 'classic',
    tagline: 'The timeless arcade champion',
  },
  {
    id: 'blue',
    name: 'Azure Jay',
    tier: 'common',
    bodyColor: '#38BDF8', // sky-400
    wingColor: '#0284C7', // sky-600
    bellyColor: '#E0F2FE', // sky-100
    beakColor: '#FB923C', // orange-400
    eyeColor: '#FFFFFF',
    effectType: 'wind',
    effectColors: ['#BAE6FD', '#7DD3FC', '#38BDF8'],
    soundType: 'classic',
    tagline: 'Agile speedster riding the wind gusts',
  },
  {
    id: 'retro',
    name: '8-Bit Pixel',
    tier: 'rare',
    bodyColor: '#84CC16', // lime-500
    wingColor: '#4D7C0F', // lime-700
    bellyColor: '#BEF264', // lime-300
    beakColor: '#15803D', // green-700
    eyeColor: '#14532D',
    accessory: 'sunglasses',
    effectType: 'pixel',
    effectColors: ['#84CC16', '#A3E635', '#4D7C0F'],
    soundType: 'retro',
    tagline: 'Cool shades and nostalgic 8-bit square dust',
  },
  {
    id: 'bat',
    name: 'Midnight Bat',
    tier: 'rare',
    bodyColor: '#581C87', // purple-900
    wingColor: '#3B0764', // purple-950
    bellyColor: '#9333EA', // purple-600
    beakColor: '#E2E8F0', // slate-200
    eyeColor: '#FACC15', // yellow-400
    accessory: 'bat',
    effectType: 'sonic',
    effectColors: ['#C084FC', '#E879F9', '#38BDF8'],
    soundType: 'classic',
    tagline: 'Echolocates through tight pipes with sonic pulses',
  },
  {
    id: 'phoenix',
    name: 'Crimson Phoenix',
    tier: 'epic',
    bodyColor: '#EF4444', // red-500
    wingColor: '#F59E0B', // amber-500
    bellyColor: '#FDE047', // yellow-300
    beakColor: '#7F1D1D', // red-900
    eyeColor: '#FEF08A',
    accessory: 'flame',
    effectType: 'fire',
    effectColors: ['#F97316', '#EF4444', '#FBBF24'],
    soundType: 'heavy',
    auraGlow: 'rgba(239, 68, 68, 0.4)',
    tagline: 'Emits blazing fire embers with every flap',
  },
  {
    id: 'cyber',
    name: 'Neon Cyber',
    tier: 'epic',
    bodyColor: '#06B6D4', // cyan-500
    wingColor: '#EC4899', // pink-500
    bellyColor: '#22D3EE', // cyan-400
    beakColor: '#A855F7', // purple-500
    eyeColor: '#F43F5E', // rose-500
    accessory: 'visor',
    effectType: 'cyber',
    effectColors: ['#22D3EE', '#F43F5E', '#A855F7'],
    soundType: 'cyber',
    auraGlow: 'rgba(6, 182, 212, 0.45)',
    tagline: 'HUD laser visor and digital matrix particles',
  },
  {
    id: 'dragon',
    name: 'Jade Drake',
    tier: 'epic',
    bodyColor: '#059669', // emerald-600
    wingColor: '#047857', // emerald-700
    bellyColor: '#6EE7B7', // emerald-300
    beakColor: '#D97706', // amber-600
    eyeColor: '#FEF08A',
    accessory: 'horns',
    effectType: 'dragon',
    effectColors: ['#34D399', '#10B981', '#F59E0B'],
    soundType: 'heavy',
    auraGlow: 'rgba(16, 185, 129, 0.35)',
    tagline: 'Mythical scaled wyvern breathing emerald sparks',
  },
  {
    id: 'mecha',
    name: 'Mecha Jet',
    tier: 'epic',
    bodyColor: '#64748B', // slate-500
    wingColor: '#334155', // slate-700
    bellyColor: '#CBD5E1', // slate-300
    beakColor: '#EAB308', // yellow-500
    eyeColor: '#06B6D4', // cyan-500
    accessory: 'jetpack',
    effectType: 'rocket',
    effectColors: ['#F97316', '#38BDF8', '#FDE047'],
    soundType: 'rocket',
    auraGlow: 'rgba(249, 115, 22, 0.4)',
    tagline: 'Twin jet thrusters with explosive afterburners',
  },
  {
    id: 'gold',
    name: 'Golden Monarch',
    tier: 'legendary',
    bodyColor: '#F59E0B', // amber-500
    wingColor: '#D97706', // amber-600
    bellyColor: '#FEF3C7', // amber-100
    beakColor: '#B45309', // amber-700
    eyeColor: '#FFFFFF',
    accessory: 'crown',
    effectType: 'gold',
    effectColors: ['#FDE047', '#FACC15', '#FFFFFF'],
    soundType: 'magic',
    auraGlow: 'rgba(234, 179, 8, 0.5)',
    tagline: 'Crowned in 24k gold with sparkling diamond bursts',
  },
  {
    id: 'cosmic',
    name: 'Cosmic Voyager',
    tier: 'legendary',
    bodyColor: '#312E81', // indigo-900
    wingColor: '#4338CA', // indigo-700
    bellyColor: '#818CF8', // indigo-400
    beakColor: '#C084FC', // purple-400
    eyeColor: '#38BDF8', // sky-400
    accessory: 'space_helmet',
    effectType: 'cosmic',
    effectColors: ['#C084FC', '#38BDF8', '#F472B6'],
    soundType: 'magic',
    auraGlow: 'rgba(129, 140, 248, 0.5)',
    tagline: 'Navigates gravitational orbits with nebula stardust',
  },
  {
    id: 'rainbow',
    name: 'Prism Chroma',
    tier: 'legendary',
    bodyColor: '#EC4899', // pink-500
    wingColor: '#8B5CF6', // purple-500
    bellyColor: '#F472B6', // pink-400
    beakColor: '#F59E0B', // amber-500
    eyeColor: '#06B6D4', // cyan-500
    accessory: 'rainbow_crest',
    effectType: 'rainbow',
    effectColors: ['#EF4444', '#F59E0B', '#10B981', '#06B6D4', '#8B5CF6'],
    soundType: 'magic',
    auraGlow: 'rgba(236, 72, 153, 0.45)',
    tagline: 'Draws flowing rainbow light ribbons through the air',
  },
  {
    id: 'ghost',
    name: 'Phantom Wraith',
    tier: 'legendary',
    bodyColor: '#CCFBF1', // teal-100
    wingColor: '#5EEAD4', // teal-300
    bellyColor: '#F0FDFA', // teal-50
    beakColor: '#2DD4BF', // teal-400
    eyeColor: '#0F766E', // teal-700
    accessory: 'halo',
    effectType: 'ghost',
    effectColors: ['#5EEAD4', '#99F6E4', '#E0E7FF'],
    soundType: 'ghost',
    auraGlow: 'rgba(94, 234, 212, 0.5)',
    tagline: 'Spectral apparition leaving ectoplasm vapor trails',
  },
];

export const THEMES: ThemeConfig[] = [
  {
    id: 'day',
    name: 'Sunny Day',
    skyTop: '#4ec0ca',
    skyBottom: '#8be5ee',
    cloudColor: 'rgba(255, 255, 255, 0.85)',
    buildingFar: '#95d8da',
    buildingNear: '#7ccbce',
    pipeMain: '#73bf2e',
    pipeShadow: '#558022',
    pipeHighlight: '#9ce659',
    pipeLipShadow: '#406316',
    groundTop: '#5ee270',
    groundMain: '#ded895',
    groundStripe: '#d0c878',
    isNight: false,
  },
  {
    id: 'sunset',
    name: 'Sunset Glow',
    skyTop: '#ea580c',
    skyBottom: '#fdba74',
    cloudColor: 'rgba(254, 215, 170, 0.75)',
    buildingFar: '#9a3412',
    buildingNear: '#7c2d12',
    pipeMain: '#15803d',
    pipeShadow: '#14532d',
    pipeHighlight: '#4ade80',
    pipeLipShadow: '#052e16',
    groundTop: '#f97316',
    groundMain: '#9a3412',
    groundStripe: '#7c2d12',
    isNight: false,
  },
  {
    id: 'night',
    name: 'Midnight Stars',
    skyTop: '#090d16',
    skyBottom: '#1e293b',
    cloudColor: 'rgba(148, 163, 184, 0.3)',
    buildingFar: '#111827',
    buildingNear: '#0f172a',
    pipeMain: '#22c55e',
    pipeShadow: '#15803d',
    pipeHighlight: '#86efac',
    pipeLipShadow: '#14532d',
    groundTop: '#15803d',
    groundMain: '#334155',
    groundStripe: '#1e293b',
    isNight: true,
  },
];
