import test from 'node:test';
import assert from 'node:assert/strict';
import {
  createBird,
  updateBirdPhysics,
  checkCircleRectCollision,
  checkCollisions,
  createPipe,
  updatePipes,
  getMedalForScore,
  DIFFICULTY_CONFIGS,
  PLAYABLE_HEIGHT,
  BIRD_RADIUS,
} from './physics';

test('createBird creates bird with default position and zero velocity', () => {
  const bird = createBird('yellow');
  assert.equal(bird.skinId, 'yellow');
  assert.equal(bird.vy, 0);
  assert.equal(bird.isDead, false);
  assert.equal(bird.radius, BIRD_RADIUS);
  assert.ok(bird.y > 0 && bird.y < PLAYABLE_HEIGHT);
});

test('updateBirdPhysics applies flap impulse and tilts bird up', () => {
  const bird = createBird();
  const config = DIFFICULTY_CONFIGS.classic;
  const flappedBird = updateBirdPhysics(bird, 0.016, config, true);
  
  assert.equal(flappedBird.vy, config.flapImpulse);
  assert.equal(flappedBird.rotation, -0.45);
  assert.equal(flappedBird.flapFrame, 1);
});

test('updateBirdPhysics applies gravity over time and clamps max fall speed', () => {
  const bird = createBird();
  const config = DIFFICULTY_CONFIGS.classic;
  
  // Update with zero flap for 2 seconds
  let currentBird = bird;
  for (let i = 0; i < 120; i++) {
    currentBird = updateBirdPhysics(currentBird, 0.016, config, false);
  }
  
  assert.equal(currentBird.vy, config.maxFallSpeed);
  assert.ok(currentBird.y > bird.y);
  assert.ok(currentBird.rotation > 0);
});

test('checkCircleRectCollision correctly detects overlaps and non-overlaps', () => {
  // Overlapping
  const hit = checkCircleRectCollision(100, 100, 15, 90, 90, 50, 50);
  assert.equal(hit, true);

  // Clearly separated
  const miss = checkCircleRectCollision(10, 10, 15, 100, 100, 50, 50);
  assert.equal(miss, false);

  // Edge grazing with arcade forgiving margin
  const graze = checkCircleRectCollision(100, 75, 15, 100, 100, 50, 50);
  assert.equal(graze, false);
});

test('checkCollisions triggers on ground contact', () => {
  const bird = createBird();
  bird.y = PLAYABLE_HEIGHT - bird.radius + 1; // touching ground
  
  const result = checkCollisions(bird, []);
  assert.equal(result.hitGround, true);
  assert.equal(result.hitPipe, false);
});

test('checkCollisions triggers on pipe contact and passes through safe gap', () => {
  const config = DIFFICULTY_CONFIGS.classic;
  const pipe = createPipe(1, 100, config, 0.5);
  
  // Safe bird centered in pipe gap
  const safeBird = createBird();
  safeBird.x = pipe.x + pipe.width / 2;
  safeBird.y = pipe.topHeight + pipe.gap / 2;
  
  const safeResult = checkCollisions(safeBird, [pipe]);
  assert.equal(safeResult.hitPipe, false);

  // Bird hitting top pipe
  const crashingTopBird = createBird();
  crashingTopBird.x = pipe.x + pipe.width / 2;
  crashingTopBird.y = pipe.topHeight - 5;
  const topResult = checkCollisions(crashingTopBird, [pipe]);
  assert.equal(topResult.hitPipe, true);

  // Bird hitting bottom pipe
  const crashingBottomBird = createBird();
  crashingBottomBird.x = pipe.x + pipe.width / 2;
  crashingBottomBird.y = pipe.bottomY + 10;
  const bottomResult = checkCollisions(crashingBottomBird, [pipe]);
  assert.equal(bottomResult.hitPipe, true);
});

test('updatePipes moves pipes and awards point when passing bird', () => {
  const config = DIFFICULTY_CONFIGS.classic;
  const pipe = createPipe(1, 100, config, 0.5);
  const birdX = 90;

  // Before passing (pipe.x = 100, pipe.width = 64, right edge = 164 > birdX)
  const { updatedPipes: p1, pointsGained: points1 } = updatePipes([pipe], 0.1, 100, birdX);
  assert.equal(points1, 0);
  assert.equal(p1[0].passed, false);

  // After passing pipe
  const passedPipe = { ...pipe, x: 20 }; // right edge = 20 + 64 = 84 < 90
  const { updatedPipes: p2, pointsGained: points2 } = updatePipes([passedPipe], 0.01, 100, birdX);
  assert.equal(points2, 1);
  assert.equal(p2[0].passed, true);
});

test('getMedalForScore assigns medals according to thresholds', () => {
  assert.equal(getMedalForScore(0), 'none');
  assert.equal(getMedalForScore(9), 'none');
  assert.equal(getMedalForScore(10), 'bronze');
  assert.equal(getMedalForScore(19), 'bronze');
  assert.equal(getMedalForScore(20), 'silver');
  assert.equal(getMedalForScore(29), 'silver');
  assert.equal(getMedalForScore(30), 'gold');
  assert.equal(getMedalForScore(39), 'gold');
  assert.equal(getMedalForScore(40), 'platinum');
  assert.equal(getMedalForScore(100), 'platinum');
});
