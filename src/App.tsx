/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  GameState,
  Bird,
  Pipe,
  BirdSkin,
  ThemeConfig,
  Difficulty,
  RunHistoryItem,
} from './game/types';
import {
  WORLD_WIDTH,
  WORLD_HEIGHT,
  PLAYABLE_HEIGHT,
  DIFFICULTY_CONFIGS,
  createBird,
  updateBirdPhysics,
  checkCollisions,
  createPipe,
  updatePipes,
  getMedalForScore,
} from './game/physics';
import { SKINS, THEMES } from './game/constants';
import { soundEngine } from './game/audio';
import { GameRenderer } from './game/renderer';
import { TitleScreen } from './components/TitleScreen';
import { HUD } from './components/HUD';
import { PauseModal } from './components/PauseModal';
import { GameOverModal } from './components/GameOverModal';
import { SkinSelectorModal } from './components/SkinSelectorModal';
import { LeaderboardModal } from './components/LeaderboardModal';

export default function App() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const rendererRef = useRef<GameRenderer | null>(null);

  // Landscape vs Cabinet display mode
  const [isLandscapeWide, setIsLandscapeWide] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth > window.innerHeight && window.innerWidth >= 640;
    }
    return false;
  });

  const [worldWidth, setWorldWidth] = useState<number>(() => {
    if (typeof window !== 'undefined' && window.innerWidth > window.innerHeight && window.innerWidth >= 640) {
      return 800;
    }
    return WORLD_WIDTH;
  });

  // Discrete React state for HUD / Modals
  const [gameState, setGameState] = useState<GameState>('title');
  const [score, setScore] = useState<number>(0);
  const [bestScore, setBestScore] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('flappy_best_score');
      return saved ? parseInt(saved, 10) || 0 : 0;
    } catch {
      return 0;
    }
  });
  const [isNewHigh, setIsNewHigh] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(() => soundEngine.getMuted());
  const [difficulty, setDifficulty] = useState<Difficulty>(() => {
    try {
      const saved = localStorage.getItem('flappy_diff') as Difficulty;
      return saved && DIFFICULTY_CONFIGS[saved] ? saved : 'classic';
    } catch {
      return 'classic';
    }
  });
  const [selectedSkin, setSelectedSkin] = useState<BirdSkin>(() => {
    try {
      const savedId = localStorage.getItem('flappy_skin_id');
      return SKINS.find((s) => s.id === savedId) || SKINS[0];
    } catch {
      return SKINS[0];
    }
  });
  const [theme, setTheme] = useState<ThemeConfig>(THEMES[0]);
  const [runHistory, setRunHistory] = useState<RunHistoryItem[]>(() => {
    try {
      const saved = localStorage.getItem('flappy_history');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Modal dialog states
  const [showSkinsModal, setShowSkinsModal] = useState<boolean>(false);
  const [showLeaderboardModal, setShowLeaderboardModal] = useState<boolean>(false);

  // Mutable Game Loop State stored in refs
  const stateRef = useRef({
    gameState: 'title' as GameState,
    worldWidth: worldWidth,
    bird: createBird(selectedSkin.id),
    pipes: [] as Pipe[],
    pipeSpawnTimer: 0,
    pipeIdCounter: 1,
    score: 0,
    bestScore: bestScore,
    difficulty: difficulty,
    skin: selectedSkin,
    theme: theme,
    pendingFlap: false,
    hitstopTimer: 0,
    isDyingFall: false,
  });

  // Sync state machine to document.body.dataset.state
  useEffect(() => {
    document.body.dataset.state = gameState;
  }, [gameState]);

  // Keep refs updated
  useEffect(() => {
    stateRef.current.skin = selectedSkin;
    stateRef.current.bird.skinId = selectedSkin.id;
  }, [selectedSkin]);

  useEffect(() => {
    stateRef.current.theme = theme;
  }, [theme]);

  useEffect(() => {
    stateRef.current.difficulty = difficulty;
  }, [difficulty]);

  useEffect(() => {
    stateRef.current.bestScore = bestScore;
  }, [bestScore]);

  useEffect(() => {
    stateRef.current.worldWidth = worldWidth;
    if (rendererRef.current) {
      rendererRef.current.setDimensions(worldWidth, WORLD_HEIGHT);
    }
  }, [worldWidth]);

  // Handle window resize & responsive orientation detection
  useEffect(() => {
    const handleResize = () => {
      const isLandscape = window.innerWidth > window.innerHeight;
      if (isLandscape && window.innerWidth >= 640) {
        setIsLandscapeWide(true);
        setWorldWidth(800);
      } else if (!isLandscape) {
        setIsLandscapeWide(false);
        setWorldWidth(WORLD_WIDTH);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleLayoutMode = useCallback(() => {
    setIsLandscapeWide((prev) => {
      const next = !prev;
      setWorldWidth(next ? 800 : WORLD_WIDTH);
      soundEngine.playTap();
      return next;
    });
  }, []);

  // Canvas context & renderer setup
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    const renderer = new GameRenderer(ctx, stateRef.current.worldWidth);
    rendererRef.current = renderer;

    let lastTime = performance.now();
    let animationFrameId: number;

    const gameLoop = (currentTime: number) => {
      const rawDt = (currentTime - lastTime) / 1000;
      lastTime = currentTime;

      const dt = Math.min(rawDt, 0.05);
      const s = stateRef.current;
      const config = DIFFICULTY_CONFIGS[s.difficulty];

      // Handle hitstop freeze
      if (s.hitstopTimer > 0) {
        s.hitstopTimer -= dt;
        renderer.update(dt, config.pipeSpeed, false);
        renderer.render(s.bird, s.pipes, s.theme, false, s.gameState === 'title');
        animationFrameId = requestAnimationFrame(gameLoop);
        return;
      }

      if (s.gameState === 'playing') {
        // 1. Process Bird Flap input
        const didFlap = s.pendingFlap;
        s.pendingFlap = false;

        if (didFlap && !s.bird.isDead) {
          s.bird = updateBirdPhysics(s.bird, dt, config, true);
          soundEngine.playFlap(s.skin.soundType);
          renderer.spawnSkinFlapEffect(s.bird, s.skin);
        } else {
          s.bird = updateBirdPhysics(s.bird, dt, config, false);
        }

        // 2. Spawn and update pipes
        s.pipeSpawnTimer += dt;
        if (s.pipeSpawnTimer >= config.pipeSpawnInterval) {
          s.pipeSpawnTimer = 0;
          const newPipe = createPipe(s.pipeIdCounter++, s.worldWidth + 20, config);
          s.pipes.push(newPipe);
        }

        const { updatedPipes, pointsGained } = updatePipes(
          s.pipes,
          dt,
          config.pipeSpeed,
          s.bird.x
        );
        s.pipes = updatedPipes;

        if (pointsGained > 0) {
          s.score += pointsGained;
          setScore(s.score);
          soundEngine.playScore();
          renderer.spawnScoreSparkles(s.bird.x + 20, s.bird.y - 10);
          renderer.addScorePopup(s.bird.x + 15, s.bird.y - 20, `+${pointsGained}`);
        }

        // 3. Check Collisions
        const { hitGround, hitPipe } = checkCollisions(s.bird, s.pipes);

        if (hitPipe && !s.bird.isDead) {
          s.bird.isDead = true;
          s.hitstopTimer = 0.06;
          soundEngine.playHit();
          renderer.triggerShake(0.7);
          renderer.triggerHitFlash();
          renderer.spawnImpactBurst(s.bird.x, s.bird.y, s.skin.bodyColor);
          soundEngine.playFall();
        }

        if (hitGround) {
          if (!s.bird.isDead) {
            soundEngine.playHit();
            renderer.triggerShake(0.8);
            renderer.triggerHitFlash();
            renderer.spawnImpactBurst(s.bird.x, s.bird.y, s.skin.bodyColor);
          }

          s.bird.y = PLAYABLE_HEIGHT - s.bird.radius;
          s.bird.vy = 0;
          s.bird.isDead = true;

          handleGameOver(s.score);
        }

        renderer.update(dt, config.pipeSpeed, true);
      } else if (s.gameState === 'title') {
        renderer.update(dt, config.pipeSpeed * 0.4, true);
      } else {
        renderer.update(dt, 0, false);
      }

      // Render frame
      renderer.render(
        s.bird,
        s.pipes,
        s.theme,
        s.gameState === 'playing',
        s.gameState === 'title'
      );

      animationFrameId = requestAnimationFrame(gameLoop);
    };

    animationFrameId = requestAnimationFrame(gameLoop);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const handleGameOver = useCallback((finalScore: number) => {
    const s = stateRef.current;
    s.gameState = 'gameover';
    setGameState('gameover');

    const isNew = finalScore > s.bestScore;
    setIsNewHigh(isNew);

    let newBest = s.bestScore;
    if (isNew) {
      newBest = finalScore;
      setBestScore(finalScore);
      try {
        localStorage.setItem('flappy_best_score', String(finalScore));
      } catch {
        // ignore
      }
      soundEngine.playFanfare();
    }

    const medal = getMedalForScore(finalScore);
    const newRun: RunHistoryItem = {
      id: String(Date.now()),
      score: finalScore,
      date: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      skinId: s.skin.id,
      medal,
      difficulty: s.difficulty,
    };

    setRunHistory((prev) => {
      const updated = [newRun, ...prev].slice(0, 10);
      try {
        localStorage.setItem('flappy_history', JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
  }, []);

  // Primary Start / Restart Handler
  const startGame = useCallback(() => {
    soundEngine.unlock();
    const s = stateRef.current;
    const initialBirdX = s.worldWidth > 500 ? 110 : 90;
    s.bird = createBird(selectedSkin.id, initialBirdX);
    s.pipes = [];
    s.pipeSpawnTimer = -0.6; // 2.2s runway before first pipe
    s.pipeIdCounter = 1;
    s.score = 0;
    s.pendingFlap = true;
    s.gameState = 'playing';
    s.hitstopTimer = 0;

    setScore(0);
    setIsNewHigh(false);
    setGameState('playing');
    setShowSkinsModal(false);
    setShowLeaderboardModal(false);
  }, [selectedSkin.id]);

  const triggerFlap = useCallback(() => {
    soundEngine.unlock();
    if (stateRef.current.gameState === 'title') {
      startGame();
      return;
    }
    if (stateRef.current.gameState === 'playing') {
      stateRef.current.pendingFlap = true;
    }
  }, [startGame]);

  const pauseGame = useCallback(() => {
    if (stateRef.current.gameState === 'playing') {
      stateRef.current.gameState = 'paused';
      setGameState('paused');
    }
  }, []);

  const resumeGame = useCallback(() => {
    if (stateRef.current.gameState === 'paused') {
      stateRef.current.gameState = 'playing';
      setGameState('playing');
    }
  }, []);

  const returnToTitle = useCallback(() => {
    const s = stateRef.current;
    const initialBirdX = s.worldWidth > 500 ? 110 : 90;
    s.bird = createBird(selectedSkin.id, initialBirdX);
    s.pipes = [];
    s.gameState = 'title';
    setGameState('title');
  }, [selectedSkin.id]);

  const toggleMute = useCallback(() => {
    const nextMuted = soundEngine.toggleMute();
    setIsMuted(nextMuted);
  }, []);

  const cycleTheme = useCallback(() => {
    const currentIndex = THEMES.findIndex((t) => t.id === theme.id);
    const nextTheme = THEMES[(currentIndex + 1) % THEMES.length];
    setTheme(nextTheme);
  }, [theme.id]);

  const handleSelectSkin = useCallback((skin: BirdSkin) => {
    setSelectedSkin(skin);
    try {
      localStorage.setItem('flappy_skin_id', skin.id);
    } catch {
      // ignore
    }
    soundEngine.playTap();
  }, []);

  const handleChangeDifficulty = useCallback((diff: Difficulty) => {
    setDifficulty(diff);
    try {
      localStorage.setItem('flappy_diff', diff);
    } catch {
      // ignore
    }
    soundEngine.playTap();
  }, []);

  const handleClearHistory = useCallback(() => {
    setRunHistory([]);
    try {
      localStorage.removeItem('flappy_history');
    } catch {
      // ignore
    }
  }, []);

  // Keyboard navigation & edge triggers
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }

      if (e.code === 'Space' || e.code === 'ArrowUp' || e.code === 'KeyW') {
        e.preventDefault();
        if (stateRef.current.gameState === 'title') {
          startGame();
        } else if (stateRef.current.gameState === 'gameover') {
          startGame();
        } else if (stateRef.current.gameState === 'playing') {
          triggerFlap();
        }
      } else if (e.code === 'Escape' || e.code === 'KeyP') {
        e.preventDefault();
        if (stateRef.current.gameState === 'playing') {
          pauseGame();
        } else if (stateRef.current.gameState === 'paused') {
          resumeGame();
        }
      } else if (e.code === 'KeyM') {
        e.preventDefault();
        toggleMute();
      } else if (e.code === 'KeyR') {
        e.preventDefault();
        if (stateRef.current.gameState === 'playing' || stateRef.current.gameState === 'paused') {
          startGame();
        }
      } else if (e.code === 'Enter') {
        if (stateRef.current.gameState === 'title' || stateRef.current.gameState === 'gameover') {
          startGame();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [startGame, triggerFlap, pauseGame, resumeGame, toggleMute]);

  // Support ?autostart=1 query parameter
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('autostart') === '1') {
      startGame();
    }
  }, [startGame]);

  return (
    <div className="relative w-screen h-screen bg-[#0d0f17] flex items-center justify-center overflow-hidden font-fun p-0 sm:p-4">
      {/* Responsive Cabinet Frame Container */}
      <div
        ref={containerRef}
        className={`relative w-full h-full bg-black shadow-[0_0_80px_rgba(0,0,0,0.95)] overflow-hidden flex flex-col justify-center transition-all duration-300 ${
          isLandscapeWide
            ? 'max-w-[1040px] max-h-[640px] sm:rounded-3xl sm:border-[6px] sm:border-slate-800'
            : 'max-w-[430px] max-h-[780px] sm:rounded-3xl sm:border-[6px] sm:border-slate-800'
        }`}
        onPointerDown={(e) => {
          if ((e.target as HTMLElement).closest('button')) return;
          triggerFlap();
        }}
        style={{ touchAction: 'none' }}
      >
        {/* The 60FPS Game Canvas */}
        <canvas
          ref={canvasRef}
          width={worldWidth}
          height={WORLD_HEIGHT}
          className="w-full h-full object-cover block cursor-pointer"
          data-testid="game-canvas"
        />

        {/* Title Screen Overlay */}
        {gameState === 'title' && (
          <TitleScreen
            onStart={startGame}
            bestScore={bestScore}
            currentSkin={selectedSkin}
            onOpenSkins={() => setShowSkinsModal(true)}
            difficulty={difficulty}
            onChangeDifficulty={handleChangeDifficulty}
            currentTheme={theme}
            onCycleTheme={cycleTheme}
            isMuted={isMuted}
            onToggleMute={toggleMute}
            onOpenScores={() => setShowLeaderboardModal(true)}
            isLandscapeWide={isLandscapeWide}
            onToggleLayoutMode={toggleLayoutMode}
          />
        )}

        {/* Playing HUD Overlay */}
        {gameState === 'playing' && (
          <HUD
            score={score}
            currentMedal={getMedalForScore(score)}
            isMuted={isMuted}
            onToggleMute={toggleMute}
            onPause={pauseGame}
          />
        )}

        {/* Paused Modal */}
        {gameState === 'paused' && (
          <PauseModal
            onResume={resumeGame}
            onRestart={startGame}
            onTitle={returnToTitle}
            currentScore={score}
            bestScore={bestScore}
            isMuted={isMuted}
            onToggleMute={toggleMute}
          />
        )}

        {/* Game Over Modal */}
        {gameState === 'gameover' && (
          <GameOverModal
            score={score}
            bestScore={bestScore}
            isNewHigh={isNewHigh}
            medal={getMedalForScore(score)}
            currentSkin={selectedSkin}
            onRestart={startGame}
            onTitle={returnToTitle}
            onOpenSkins={() => setShowSkinsModal(true)}
            onOpenScores={() => setShowLeaderboardModal(true)}
          />
        )}

        {/* Character Garage Skin Selector Modal */}
        {showSkinsModal && (
          <SkinSelectorModal
            selectedSkinId={selectedSkin.id}
            onSelectSkin={handleSelectSkin}
            onClose={() => setShowSkinsModal(false)}
          />
        )}

        {/* High Scores Leaderboard Modal */}
        {showLeaderboardModal && (
          <LeaderboardModal
            history={runHistory}
            bestScore={bestScore}
            onClose={() => setShowLeaderboardModal(false)}
            onClearHistory={handleClearHistory}
          />
        )}
      </div>
    </div>
  );
}
