import { Bird, Pipe, MedalType, Difficulty } from './types';

export const WORLD_WIDTH = 400;
export const WORLD_HEIGHT = 600;
export const GROUND_HEIGHT = 110;
export const PLAYABLE_HEIGHT = WORLD_HEIGHT - GROUND_HEIGHT; // 490px
export const BIRD_X = 90;
export const BIRD_RADIUS = 15;
export const PIPE_WIDTH = 64;

export interface DifficultyConfig {
  gravity: number;
  flapImpulse: number;
  maxFallSpeed: number;
  pipeSpeed: number;
  pipeSpawnInterval: number;
  pipeGap: number;
  minPipeHeight: number;
}

export const DIFFICULTY_CONFIGS: Record<Difficulty, DifficultyConfig> = {
  easy: {
    gravity: 800,
    flapImpulse: -290,
    maxFallSpeed: 450,
    pipeSpeed: 120,
    pipeSpawnInterval: 1.8,
    pipeGap: 135,
    minPipeHeight: 60,
  },
  classic: {
    gravity: 920,
    flapImpulse: -315,
    maxFallSpeed: 500,
    pipeSpeed: 140,
    pipeSpawnInterval: 1.6,
    pipeGap: 118,
    minPipeHeight: 65,
  },
  hard: {
    gravity: 1050,
    flapImpulse: -340,
    maxFallSpeed: 550,
    pipeSpeed: 165,
    pipeSpawnInterval: 1.45,
    pipeGap: 104,
    minPipeHeight: 70,
  },
};

/**
 * Creates initial bird state
 */
export function createBird(skinId = 'yellow', initialX = BIRD_X, initialY = PLAYABLE_HEIGHT * 0.45): Bird {
  return {
    x: initialX,
    y: initialY,
    vy: 0,
    radius: BIRD_RADIUS,
    rotation: 0,
    flapFrame: 0,
    flapTimer: 0,
    skinId,
    isDead: false,
  };
}

/**
 * Updates bird physics for a single step
 */
export function updateBirdPhysics(
  bird: Bird,
  dt: number,
  config: DifficultyConfig,
  isFlapping: boolean
): Bird {
  const nextBird = { ...bird };

  if (isFlapping && !nextBird.isDead) {
    nextBird.vy = config.flapImpulse;
    nextBird.rotation = -0.45; // ~ -26 degrees tilt upward
    nextBird.flapFrame = 1;
    nextBird.flapTimer = 0.2;
  } else {
    // Apply gravity
    nextBird.vy = Math.min(nextBird.vy + config.gravity * dt, config.maxFallSpeed);

    // Update rotation smoothly:
    // If vy < 0 (moving up), keep tilted up
    // If vy > 0 (falling), tilt downward towards 90 deg (PI / 2)
    if (nextBird.vy < 0) {
      nextBird.rotation = Math.max(-0.45, nextBird.rotation - 1.2 * dt);
    } else {
      nextBird.rotation = Math.min(Math.PI / 2, nextBird.rotation + 3.0 * dt);
    }

    if (nextBird.flapTimer > 0) {
      nextBird.flapTimer -= dt;
      if (nextBird.flapTimer <= 0) {
        nextBird.flapFrame = 0;
      }
    }
  }

  nextBird.y += nextBird.vy * dt;

  return nextBird;
}

/**
 * Circle vs Axis-Aligned Bounding Box (AABB) collision test
 */
export function checkCircleRectCollision(
  circleX: number,
  circleY: number,
  radius: number,
  rectX: number,
  rectY: number,
  rectWidth: number,
  rectHeight: number
): boolean {
  // Find the closest point on the rectangle to the circle center
  const closestX = Math.max(rectX, Math.min(circleX, rectX + rectWidth));
  const closestY = Math.max(rectY, Math.min(circleY, rectY + rectHeight));

  const distanceX = circleX - closestX;
  const distanceY = circleY - closestY;

  // Use slightly generous hitbox (0.85 of radius) for arcade game feel
  const effectiveRadius = radius * 0.88;
  return distanceX * distanceX + distanceY * distanceY < effectiveRadius * effectiveRadius;
}

/**
 * Checks all collisions for a bird: ground, ceiling, and pipes
 */
export function checkCollisions(bird: Bird, pipes: Pipe[]): { hitGround: boolean; hitPipe: boolean } {
  // Ground collision
  if (bird.y + bird.radius >= PLAYABLE_HEIGHT) {
    return { hitGround: true, hitPipe: false };
  }

  // Ceiling collision (soft barrier, clamp or hit)
  if (bird.y - bird.radius <= 0) {
    return { hitGround: false, hitPipe: true };
  }

  // Check each pipe
  for (const pipe of pipes) {
    // Top pipe (from 0 to pipe.topHeight)
    const hitTop = checkCircleRectCollision(
      bird.x,
      bird.y,
      bird.radius,
      pipe.x,
      0,
      pipe.width,
      pipe.topHeight
    );

    if (hitTop) {
      return { hitGround: false, hitPipe: true };
    }

    // Bottom pipe (from pipe.bottomY to PLAYABLE_HEIGHT)
    const hitBottom = checkCircleRectCollision(
      bird.x,
      bird.y,
      bird.radius,
      pipe.x,
      pipe.bottomY,
      pipe.width,
      PLAYABLE_HEIGHT - pipe.bottomY
    );

    if (hitBottom) {
      return { hitGround: false, hitPipe: true };
    }
  }

  return { hitGround: false, hitPipe: false };
}

/**
 * Generates a pipe pair with random legal gap position
 */
export function createPipe(
  id: number,
  x: number,
  config: DifficultyConfig,
  randomVal: number = Math.random()
): Pipe {
  const gap = config.pipeGap;
  const minHeight = config.minPipeHeight;
  const maxTopHeight = PLAYABLE_HEIGHT - gap - minHeight;
  
  // Choose random top height between minHeight and maxTopHeight
  const topHeight = Math.floor(minHeight + randomVal * (maxTopHeight - minHeight));
  const bottomY = topHeight + gap;

  return {
    id,
    x,
    topHeight,
    bottomY,
    width: PIPE_WIDTH,
    gap,
    passed: false,
  };
}

/**
 * Updates pipe positions and returns updated pipes plus newly passed score points
 */
export function updatePipes(
  pipes: Pipe[],
  dt: number,
  speed: number,
  birdX: number
): { updatedPipes: Pipe[]; pointsGained: number } {
  let pointsGained = 0;
  const updatedPipes: Pipe[] = [];

  for (const pipe of pipes) {
    const nextX = pipe.x - speed * dt;
    let passed = pipe.passed;

    // Check if bird just passed the middle/end of the pipe
    if (!passed && nextX + pipe.width < birdX) {
      passed = true;
      pointsGained += 1;
    }

    // Only keep pipe if it hasn't moved off the left edge of the screen
    if (nextX + pipe.width > -10) {
      updatedPipes.push({
        ...pipe,
        x: nextX,
        passed,
      });
    }
  }

  return { updatedPipes, pointsGained };
}

/**
 * Calculates medal based on score
 */
export function getMedalForScore(score: number): MedalType {
  if (score >= 40) return 'platinum';
  if (score >= 30) return 'gold';
  if (score >= 20) return 'silver';
  if (score >= 10) return 'bronze';
  return 'none';
}
