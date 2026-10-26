# 🐦 Flappy Bird Arcade

> A modern, ultra-responsive web adaptation of the classic **Flappy Bird** arcade game, built with pure HTML5 Canvas 2D, zero-latency procedural Web Audio synthesis, 12 unlockable bird skins with unique particle effects, multiple atmospheric themes, and seamless landscape widescreen & portrait cabinet modes.

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React_19-20232A?style=flat&logo=react&logoColor=61DAFB)](https://react.dev/)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_CSS_v4-38B2AC?style=flat&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Web Audio API](https://img.shields.io/badge/Web_Audio_API-Procedural_SFX-orange?style=flat)](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)

---

## 🌟 Features

### 🕹️ Authentic 60 FPS Physics & Game Feel
- **Pixel-Accurate Collision & Fair Hitboxes**: Circle-vs-AABB bounding detection with forgiving arcade margins to eliminate frustrating edge-grazing deaths.
- **Dynamic Bird Aerodynamics**: Flap impulse tilts the bird upward (`-26°`), followed by a smooth velocity-driven dive curve (`+70°` to `+90°`).
- **Hitstop & Screen Shake**: Sim-level freeze frames (`0.06s`) and quadratic trauma decay (`trauma²`) on collisions for visceral arcade feedback.
- **Smooth Encounter Design**: Generous 2.2-second initial runway before oncoming obstacles appear, allowing players to calibrate flap cadence.

### 🎨 12 Unlockable Skins & Bespoke Effects
Every bird character comes with its own visual accessory, rarity tier, unique flap particle effect, and procedurally synthesized audio profile:

| Tier | Skin | Accessory | In-Game Flap Particle Effect | Sound Profile |
| :--- | :--- | :--- | :--- | :--- |
| **Common** | **Classic Faby** | Original Beak | Soft fluttering feather trail | Classic Arcade Chirp |
| **Common** | **Azure Jay** | Crest Plumage | High-velocity wind streak beams | Air Breeze Whoosh |
| **Rare** | **8-Bit Pixel** | Pixel Sunglasses | Retro 8-bit square dust blocks | 8-Bit Square Wave Blip |
| **Rare** | **Midnight Bat** | Bat Wings & Ears | Expanding echolocation sonic wave rings | Sonic Echo Chirp |
| **Epic** | **Crimson Phoenix** | Flame Crest & Glow | Blazing fire sparks & rising embers | Fiery Warm Flap |
| **Epic** | **Neon Cyber** | Laser HUD Visor | Cyan/magenta rotating digital matrix cubes | Synthwave Cyber Beep |
| **Epic** | **Jade Drake** | Dragon Horns | Emerald flame cinders & smoke puffs | Dragon Roar-Whistle |
| **Epic** | **Mecha Jet** | Thruster Pack | Twin jet engine afterburner flame blast | Jet Turbine Boost |
| **Legendary** | **Golden Monarch** | 24k Gold Crown | Sparkling diamond stars & gold coin glints | Royal Chime Arpeggio |
| **Legendary** | **Cosmic Voyager** | Space Helmet | Cosmic nebula dust & orbiting stellar ring | Celestial Space Synth |
| **Legendary** | **Prism Chroma** | Prismatic Crest | Flowing multi-colored rainbow light ribbon | Melodic Harp Arpeggio |
| **Legendary** | **Phantom Wraith** | Angelic Halo | Ethereal ectoplasm vapor mist & spirit orbs | Spectral Flutter Glide |

### 🔊 100% Procedural Web Audio Engine
- Zero external `.mp3` or `.wav` dependencies—no loading delays, no missing assets, and zero network latency.
- Real-time oscillator and gain synthesis for wing flaps, retro two-tone score chimes, impact hits, falling slide whistles, and celebratory fanfare arpeggios.
- Keyboard toggle (`M`) and persistent sound state saved in `localStorage`.

### 🖥️ Adaptive Widescreen Landscape & Mobile Responsive
- **Panoramic Landscape Mode**: Automatically expands virtual resolution (up to `1040x600`) in landscape viewports, offering an expansive horizontal flight corridor with scrolling panoramic skylines.
- **Classic Arcade Cabinet Mode**: Play in traditional portrait framing with a rounded cabinet border.
- **One-Click Viewport Toggle**: Switch instantly between Widescreen Landscape and Cabinet modes via the top bar icon.
- **Mobile Touch Optimized**: Low-latency `pointerdown` and `touch-action: none` prevent mobile double-tap zoom delay and unwanted scroll gestures.

### 🌅 Atmospheric Themes & Difficulty Modes
- **3 Day/Night Themes**:
  - ☀️ *Sunny Day* (Classic azure skies and lush greenery)
  - 🌇 *Sunset Glow* (Golden dusk skyline and warm amber pipes)
  - 🌙 *Midnight Stars* (Starry night skies, glowing city windows, and crescent moon)
- **3 Difficulty Presets**: *Easy* (wider gaps, gentle gravity), *Classic* (authentic arcade specs), and *Hard* (tighter gaps and faster scrolling speed).
- **Hall of Fame Leaderboard**: Tracks high scores and records your top 10 runs with date, difficulty, skin used, and medal earned (Bronze, Silver, Gold, Platinum).

---

## 🎮 Controls

| Action | Keyboard | Mouse / Touch |
| :--- | :--- | :--- |
| **Flap / Jump** | `Space` / `Arrow Up` / `W` | Click / Tap anywhere on screen |
| **Start / Restart** | `Space` / `Enter` / `R` | Tap **Start Flap** or **Play Again** |
| **Pause / Resume** | `P` / `Esc` | Tap Pause button in top right |
| **Mute Audio** | `M` | Tap Speaker icon in top right |
| **Toggle Layout** | — | Tap Viewport icon (Cabinet / Widescreen) |

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or bun

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/flappy-bird-arcade.git
   cd flappy-bird-arcade
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```
   Open your browser at `http://localhost:3000` (or the port shown in terminal).

4. **Build for production**:
   ```bash
   npm run build
   ```

---

## 🏗️ Project Architecture

```
flappy-bird-arcade/
├── index.html                   # HTML5 entry with retro Google Fonts & meta tags
├── src/
│   ├── main.tsx                 # React DOM root entry
│   ├── App.tsx                  # Main game controller & viewport wrapper
│   ├── index.css                # Tailwind CSS v4 directives & typography layers
│   ├── components/
│   │   ├── TitleScreen.tsx      # Arcade title lockup, settings, and start CTA
│   │   ├── HUD.tsx              # Unobtrusive 60 FPS score & top bar controls
│   │   ├── PauseModal.tsx       # Pause card with Resume, Restart, and Menu
│   │   ├── GameOverModal.tsx    # Retro scoreboard, medal awards, and stats
│   │   ├── SkinSelectorModal.tsx# Responsive multi-column character garage
│   │   └── LeaderboardModal.tsx # Hall of fame recent runs and best scores
│   └── game/
│       ├── types.ts             # TypeScript interfaces (Bird, Pipe, Skins, etc.)
│       ├── constants.ts         # Skin definitions, theme colors, and presets
│       ├── physics.ts           # Decoupled deterministic math & collision rules
│       ├── physics.test.ts      # Unit tests using Node.js built-in test runner
│       ├── audio.ts             # Web Audio API procedural synthesizer
│       └── renderer.ts          # High-performance Canvas 2D multi-layer renderer
├── tsconfig.json
└── vite.config.ts
```

---

## 🧪 Testing

Deterministic physics and collision math are fully tested with Node's native test runner (`node:test`):

```bash
npx --yes tsx --test src/game/physics.test.ts
```

---

## 📄 License

This project is open-source and available under the [Apache-2.0 License](LICENSE).
