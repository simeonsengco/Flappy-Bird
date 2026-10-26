import { Bird, Pipe, Particle, ScorePopup, ThemeConfig, BirdSkin } from './types';
import { WORLD_WIDTH, WORLD_HEIGHT, PLAYABLE_HEIGHT } from './physics';
import { SKINS } from './constants';

const MAX_PARTICLES = 160;

export class GameRenderer {
  private ctx: CanvasRenderingContext2D;
  private particles: Particle[] = [];
  private scorePopups: ScorePopup[] = [];
  private groundOffset: number = 0;
  private cloudOffset: number = 0;
  private cityOffset: number = 0;
  private trauma: number = 0;
  private flashAlpha: number = 0;
  public worldWidth: number = WORLD_WIDTH;
  public worldHeight: number = WORLD_HEIGHT;

  constructor(ctx: CanvasRenderingContext2D, initialWidth: number = WORLD_WIDTH) {
    this.ctx = ctx;
    this.worldWidth = initialWidth;
    this.initParticlePool();
  }

  public setDimensions(w: number, h: number = WORLD_HEIGHT) {
    this.worldWidth = w;
    this.worldHeight = h;
  }

  private initParticlePool() {
    this.particles = [];
    for (let i = 0; i < MAX_PARTICLES; i++) {
      this.particles.push({
        active: false,
        x: 0,
        y: 0,
        vx: 0,
        vy: 0,
        size: 0,
        color: '#fff',
        alpha: 1,
        life: 0,
        maxLife: 1,
        shape: 'circle',
        rotation: 0,
        vRot: 0,
      });
    }
  }

  public triggerShake(intensity: number = 0.5) {
    this.trauma = Math.min(1.0, this.trauma + intensity);
  }

  public triggerHitFlash() {
    this.flashAlpha = 0.75;
  }

  /**
   * Spawns skin-specific flap effects (fire, cyber cubes, wind, sonic rings, rockets, rainbow, etc.)
   */
  public spawnSkinFlapEffect(bird: Bird, skin: BirdSkin) {
    const effect = skin.effectType;
    const colors = skin.effectColors;

    switch (effect) {
      case 'fire':
        for (let i = 0; i < 9; i++) {
          this.spawnParticle({
            x: bird.x - 12 + (Math.random() * 8 - 4),
            y: bird.y + 4 + (Math.random() * 8 - 4),
            vx: -70 - Math.random() * 60,
            vy: -40 + Math.random() * 80,
            size: 4 + Math.random() * 4,
            color: colors[Math.floor(Math.random() * colors.length)],
            maxLife: 0.35 + Math.random() * 0.25,
            shape: Math.random() > 0.4 ? 'ember' : 'smoke',
          });
        }
        break;

      case 'cyber':
        for (let i = 0; i < 8; i++) {
          this.spawnParticle({
            x: bird.x - 14 + (Math.random() * 6 - 3),
            y: bird.y + 2 + (Math.random() * 8 - 4),
            vx: -80 - Math.random() * 50,
            vy: (Math.random() - 0.5) * 50,
            size: 3 + Math.random() * 3,
            color: colors[Math.floor(Math.random() * colors.length)],
            maxLife: 0.3 + Math.random() * 0.2,
            shape: 'square',
          });
        }
        break;

      case 'sonic':
        // Sonic pulse ring
        this.spawnParticle({
          x: bird.x - 8,
          y: bird.y,
          vx: -40,
          vy: 0,
          size: 8,
          color: colors[0],
          maxLife: 0.38,
          shape: 'ring',
        });
        // Sonic ripples
        for (let i = 0; i < 4; i++) {
          this.spawnParticle({
            x: bird.x - 10,
            y: bird.y + (Math.random() * 12 - 6),
            vx: -60 - Math.random() * 40,
            vy: (Math.random() - 0.5) * 40,
            size: 2.5 + Math.random() * 2,
            color: colors[1],
            maxLife: 0.3,
            shape: 'circle',
          });
        }
        break;

      case 'rocket':
        // Jet thruster flames
        for (let i = 0; i < 11; i++) {
          this.spawnParticle({
            x: bird.x - 16,
            y: bird.y + (Math.random() * 6 - 3),
            vx: -130 - Math.random() * 90,
            vy: (Math.random() - 0.5) * 40,
            size: 4 + Math.random() * 5,
            color: colors[Math.floor(Math.random() * colors.length)],
            maxLife: 0.25 + Math.random() * 0.2,
            shape: 'ember',
          });
        }
        break;

      case 'gold':
        for (let i = 0; i < 8; i++) {
          this.spawnParticle({
            x: bird.x - 12 + (Math.random() * 8 - 4),
            y: bird.y + (Math.random() * 10 - 5),
            vx: -50 - Math.random() * 40,
            vy: (Math.random() - 0.4) * 60,
            size: 4 + Math.random() * 3,
            color: colors[Math.floor(Math.random() * colors.length)],
            maxLife: 0.4 + Math.random() * 0.25,
            shape: 'star',
          });
        }
        break;

      case 'cosmic':
        for (let i = 0; i < 8; i++) {
          this.spawnParticle({
            x: bird.x - 10 + (Math.random() * 8 - 4),
            y: bird.y + (Math.random() * 8 - 4),
            vx: -40 - Math.random() * 40,
            vy: (Math.random() - 0.5) * 50,
            size: 3 + Math.random() * 3,
            color: colors[Math.floor(Math.random() * colors.length)],
            maxLife: 0.45 + Math.random() * 0.25,
            shape: 'sparkle',
          });
        }
        break;

      case 'rainbow':
        for (let i = 0; i < colors.length; i++) {
          this.spawnParticle({
            x: bird.x - 14 - i * 3,
            y: bird.y + (i - 2) * 3,
            vx: -60 - Math.random() * 30,
            vy: (Math.random() - 0.5) * 30,
            size: 4,
            color: colors[i],
            maxLife: 0.4,
            shape: 'circle',
          });
        }
        break;

      case 'ghost':
        for (let i = 0; i < 6; i++) {
          this.spawnParticle({
            x: bird.x - 12 + (Math.random() * 8 - 4),
            y: bird.y + (Math.random() * 8 - 4),
            vx: -35 - Math.random() * 30,
            vy: -20 - Math.random() * 40, // floats up
            size: 5 + Math.random() * 4,
            color: colors[Math.floor(Math.random() * colors.length)],
            maxLife: 0.5 + Math.random() * 0.3,
            shape: 'smoke',
          });
        }
        break;

      case 'dragon':
        for (let i = 0; i < 7; i++) {
          this.spawnParticle({
            x: bird.x - 12 + (Math.random() * 6 - 3),
            y: bird.y + 4 + (Math.random() * 6 - 3),
            vx: -60 - Math.random() * 50,
            vy: -30 + Math.random() * 60,
            size: 3.5 + Math.random() * 3,
            color: colors[Math.floor(Math.random() * colors.length)],
            maxLife: 0.35 + Math.random() * 0.2,
            shape: Math.random() > 0.5 ? 'ember' : 'smoke',
          });
        }
        break;

      case 'pixel':
        for (let i = 0; i < 6; i++) {
          this.spawnParticle({
            x: bird.x - 12 + (Math.random() * 6 - 3),
            y: bird.y + (Math.random() * 6 - 3),
            vx: -50 - Math.random() * 40,
            vy: (Math.random() - 0.5) * 30,
            size: 3.5,
            color: colors[Math.floor(Math.random() * colors.length)],
            maxLife: 0.35,
            shape: 'square',
          });
        }
        break;

      case 'wind':
        for (let i = 0; i < 5; i++) {
          this.spawnParticle({
            x: bird.x - 10 + (Math.random() * 8 - 4),
            y: bird.y + (Math.random() * 12 - 6),
            vx: -110 - Math.random() * 60,
            vy: (Math.random() - 0.5) * 20,
            size: 2.5 + Math.random() * 2,
            color: colors[Math.floor(Math.random() * colors.length)],
            maxLife: 0.25 + Math.random() * 0.15,
            shape: 'beam',
          });
        }
        break;

      default: // Feathers
        for (let i = 0; i < 5; i++) {
          this.spawnParticle({
            x: bird.x - 10 + (Math.random() * 6 - 3),
            y: bird.y + 6 + (Math.random() * 6 - 3),
            vx: -60 - Math.random() * 40,
            vy: (Math.random() - 0.3) * 60,
            size: 3 + Math.random() * 2,
            color: colors[Math.floor(Math.random() * colors.length)],
            maxLife: 0.35 + Math.random() * 0.2,
            shape: 'feather',
          });
        }
        break;
    }
  }

  public spawnImpactBurst(x: number, y: number, color: string) {
    for (let i = 0; i < 24; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 70 + Math.random() * 180;
      this.spawnParticle({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 3 + Math.random() * 5,
        color: Math.random() > 0.4 ? color : '#FFFFFF',
        maxLife: 0.5 + Math.random() * 0.4,
        shape: Math.random() > 0.5 ? 'feather' : 'circle',
      });
    }
  }

  public spawnScoreSparkles(x: number, y: number) {
    for (let i = 0; i < 14; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 50 + Math.random() * 110;
      this.spawnParticle({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 3 + Math.random() * 3,
        color: Math.random() > 0.5 ? '#FEF08A' : '#FDE047',
        maxLife: 0.6 + Math.random() * 0.3,
        shape: 'star',
      });
    }
  }

  public addScorePopup(x: number, y: number, text: string = '+1') {
    this.scorePopups.push({
      id: Math.random(),
      x,
      y,
      text,
      alpha: 1,
      scale: 1.4,
      life: 0.8,
    });
  }

  private spawnParticle(opts: {
    x: number;
    y: number;
    vx: number;
    vy: number;
    size: number;
    color: string;
    maxLife: number;
    shape: 'circle' | 'feather' | 'star' | 'sparkle' | 'square' | 'ring' | 'smoke' | 'ember' | 'beam';
  }) {
    const p = this.particles.find((item) => !item.active);
    if (!p) return;

    p.active = true;
    p.x = opts.x;
    p.y = opts.y;
    p.vx = opts.vx;
    p.vy = opts.vy;
    p.size = opts.size;
    p.color = opts.color;
    p.alpha = 1;
    p.life = opts.maxLife;
    p.maxLife = opts.maxLife;
    p.shape = opts.shape;
    p.rotation = Math.random() * Math.PI * 2;
    p.vRot = (Math.random() - 0.5) * 8;
  }

  public update(dt: number, speed: number, isPlaying: boolean) {
    if (isPlaying) {
      this.groundOffset = (this.groundOffset + speed * dt) % 24;
      this.cityOffset = (this.cityOffset + speed * 0.3 * dt) % 400;
      this.cloudOffset = (this.cloudOffset + speed * 0.12 * dt) % 400;
    }

    // Decay trauma for screen shake
    if (this.trauma > 0) {
      this.trauma = Math.max(0, this.trauma - dt * 2.2);
    }

    // Decay hit flash
    if (this.flashAlpha > 0) {
      this.flashAlpha = Math.max(0, this.flashAlpha - dt * 3.5);
    }

    // Update particles
    for (const p of this.particles) {
      if (!p.active) continue;
      p.life -= dt;
      if (p.life <= 0) {
        p.active = false;
        continue;
      }
      p.x += p.vx * dt;
      p.y += p.vy * dt;

      if (p.shape === 'smoke') {
        p.size += dt * 8; // smoke expands
      } else if (p.shape === 'ring') {
        p.size += dt * 50; // ring expands outwards
      } else if (p.shape !== 'square' && p.shape !== 'beam') {
        p.vy += 220 * dt; // gentle particle gravity
      }

      p.rotation += p.vRot * dt;
      p.alpha = p.life / p.maxLife;
    }

    // Update score popups
    for (let i = this.scorePopups.length - 1; i >= 0; i--) {
      const sp = this.scorePopups[i];
      sp.life -= dt;
      sp.y -= 45 * dt;
      sp.scale = Math.max(1.0, sp.scale - dt);
      sp.alpha = sp.life / 0.8;
      if (sp.life <= 0) {
        this.scorePopups.splice(i, 1);
      }
    }
  }

  public render(
    bird: Bird,
    pipes: Pipe[],
    theme: ThemeConfig,
    isPlaying: boolean,
    isIdleMode: boolean = false
  ) {
    const ctx = this.ctx;
    const w = this.worldWidth;
    const h = this.worldHeight;

    ctx.save();

    // Screen shake transform
    if (this.trauma > 0) {
      const shakeAmount = this.trauma * this.trauma * 14;
      const offsetX = (Math.random() * 2 - 1) * shakeAmount;
      const offsetY = (Math.random() * 2 - 1) * shakeAmount;
      ctx.translate(offsetX, offsetY);
    }

    // 1. Sky Gradient Background
    const skyGrad = ctx.createLinearGradient(0, 0, 0, PLAYABLE_HEIGHT);
    skyGrad.addColorStop(0, theme.skyTop);
    skyGrad.addColorStop(1, theme.skyBottom);
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, w, h);

    // 2. Stars (if night) or Clouds (if day/sunset)
    if (theme.isNight) {
      this.renderStars(ctx, w);
      this.renderMoon(ctx, w);
    } else {
      this.renderSun(ctx, theme, w);
      this.renderClouds(ctx, theme, w);
    }

    // 3. City / Hills Skyline (Parallax)
    this.renderSkyline(ctx, theme, w);

    // 4. Pipes
    this.renderPipes(ctx, pipes, theme);

    // 5. Ground / Foreground
    this.renderGround(ctx, theme, w, h);

    // 6. Particles
    this.renderParticles(ctx);

    // 7. The Bird
    this.renderBird(ctx, bird, isIdleMode);

    // 8. Score Popups
    this.renderScorePopups(ctx);

    // 9. Hit Flash Overlay
    if (this.flashAlpha > 0) {
      ctx.fillStyle = `rgba(255, 255, 255, ${this.flashAlpha})`;
      ctx.fillRect(0, 0, w, h);
    }

    ctx.restore();
  }

  private renderSun(ctx: CanvasRenderingContext2D, theme: ThemeConfig, w: number) {
    ctx.save();
    const isSunset = theme.id === 'sunset';
    const sunX = w * (isSunset ? 0.75 : 0.82);
    const sunY = isSunset ? PLAYABLE_HEIGHT * 0.65 : 70;
    const sunRadius = isSunset ? 32 : 24;

    const sunGlow = ctx.createRadialGradient(sunX, sunY, 5, sunX, sunY, sunRadius * 2);
    sunGlow.addColorStop(0, isSunset ? 'rgba(254, 215, 170, 0.9)' : 'rgba(254, 240, 138, 0.8)');
    sunGlow.addColorStop(1, 'rgba(254, 240, 138, 0)');
    ctx.fillStyle = sunGlow;
    ctx.beginPath();
    ctx.arc(sunX, sunY, sunRadius * 2, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = isSunset ? '#FED7AA' : '#FEF08A';
    ctx.beginPath();
    ctx.arc(sunX, sunY, sunRadius, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  private renderMoon(ctx: CanvasRenderingContext2D, w: number) {
    ctx.save();
    const moonX = w * 0.82;
    const moonY = 80;
    const r = 24;

    const glow = ctx.createRadialGradient(moonX, moonY, r * 0.5, moonX, moonY, r * 2.2);
    glow.addColorStop(0, 'rgba(224, 231, 255, 0.4)');
    glow.addColorStop(1, 'rgba(224, 231, 255, 0)');
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(moonX, moonY, r * 2.2, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#F8FAFC';
    ctx.beginPath();
    ctx.arc(moonX, moonY, r, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#090d16'; // shadow cutout
    ctx.beginPath();
    ctx.arc(moonX - 8, moonY - 4, r * 0.85, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  private renderStars(ctx: CanvasRenderingContext2D, w: number) {
    ctx.save();
    ctx.fillStyle = '#FFFFFF';
    const count = Math.floor(w / 30);
    for (let i = 0; i < count; i++) {
      const sx = ((i * 37 + 13) % w);
      const sy = ((i * 53 + 29) % (PLAYABLE_HEIGHT - 60));
      const sz = (i % 3 === 0) ? 2 : 1.2;
      ctx.beginPath();
      ctx.arc(sx, sy, sz, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  private renderClouds(ctx: CanvasRenderingContext2D, theme: ThemeConfig, w: number) {
    ctx.save();
    ctx.fillStyle = theme.cloudColor;
    const cloudSpan = Math.max(w + 100, 600);

    for (let cx = 0; cx < cloudSpan; cx += 140) {
      const drawX = ((cx - this.cloudOffset + cloudSpan * 2) % cloudSpan) - 80;
      const cy = 60 + ((cx * 7) % 80);
      const s = 0.85 + ((cx * 3) % 4) * 0.1;
      this.drawFluffyCloud(ctx, drawX, cy, s);
    }

    ctx.restore();
  }

  private drawFluffyCloud(ctx: CanvasRenderingContext2D, x: number, y: number, s: number) {
    ctx.beginPath();
    ctx.arc(x, y, 16 * s, 0, Math.PI * 2);
    ctx.arc(x + 18 * s, y - 8 * s, 22 * s, 0, Math.PI * 2);
    ctx.arc(x + 40 * s, y - 4 * s, 18 * s, 0, Math.PI * 2);
    ctx.arc(x + 56 * s, y, 14 * s, 0, Math.PI * 2);
    ctx.rect(x, y - 2 * s, 56 * s, 16 * s);
    ctx.fill();
  }

  private renderSkyline(ctx: CanvasRenderingContext2D, theme: ThemeConfig, w: number) {
    ctx.save();
    const baseY = PLAYABLE_HEIGHT;
    const span = Math.max(w + 150, 600);

    // Distant skyline
    ctx.fillStyle = theme.buildingFar;
    for (let bx = 0; bx < span; bx += 48) {
      const bh = 70 + ((bx * 13) % 85);
      const bw = 38 + ((bx * 7) % 22);
      const renderX = ((bx - this.cityOffset * 0.5 + span * 2) % span) - 50;
      ctx.fillRect(renderX, baseY - bh, bw, bh);
    }

    // Closer skyline
    ctx.fillStyle = theme.buildingNear;
    for (let bx = 10; bx < span; bx += 52) {
      const bh = 50 + ((bx * 17) % 70);
      const bw = 35 + ((bx * 11) % 25);
      const renderX = ((bx - this.cityOffset + span * 2) % span) - 50;
      ctx.fillRect(renderX, baseY - bh, bw, bh);

      // Cute building windows
      if (theme.isNight) {
        ctx.fillStyle = '#FDE047';
        for (let wy = baseY - bh + 10; wy < baseY - 10; wy += 18) {
          for (let wx = renderX + 6; wx < renderX + bw - 8; wx += 12) {
            if ((wx + wy) % 4 !== 0) {
              ctx.fillRect(wx, wy, 3.5, 5);
            }
          }
        }
        ctx.fillStyle = theme.buildingNear;
      }
    }

    // Foliage hedge line
    ctx.fillStyle = theme.isNight ? '#064e3b' : '#34d399';
    for (let tx = -20; tx < w + 40; tx += 35) {
      const treeX = ((tx - this.cityOffset * 0.8 + (w + 60) * 2) % (w + 60)) - 25;
      ctx.beginPath();
      ctx.arc(treeX, baseY - 6, 16, Math.PI, 0);
      ctx.fill();
    }

    ctx.restore();
  }

  private renderPipes(ctx: CanvasRenderingContext2D, pipes: Pipe[], theme: ThemeConfig) {
    const lipHeight = 24;
    const lipOverhang = 3;

    for (const pipe of pipes) {
      // 1. TOP PIPE
      this.drawPipeSegment(
        ctx,
        pipe.x,
        0,
        pipe.width,
        pipe.topHeight,
        theme,
        'down',
        lipHeight,
        lipOverhang
      );

      // 2. BOTTOM PIPE
      this.drawPipeSegment(
        ctx,
        pipe.x,
        pipe.bottomY,
        pipe.width,
        PLAYABLE_HEIGHT - pipe.bottomY,
        theme,
        'up',
        lipHeight,
        lipOverhang
      );
    }
  }

  private drawPipeSegment(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number,
    theme: ThemeConfig,
    lipSide: 'up' | 'down',
    lipHeight: number,
    lipOverhang: number
  ) {
    if (h <= 0) return;
    ctx.save();

    // Pipe body shaft
    const shaftGrad = ctx.createLinearGradient(x, 0, x + w, 0);
    shaftGrad.addColorStop(0, theme.pipeHighlight);
    shaftGrad.addColorStop(0.25, theme.pipeMain);
    shaftGrad.addColorStop(0.85, theme.pipeShadow);
    shaftGrad.addColorStop(1, theme.pipeLipShadow);

    ctx.fillStyle = shaftGrad;
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 2.5;

    // Body rectangle
    ctx.beginPath();
    ctx.rect(x, y, w, h);
    ctx.fill();
    ctx.stroke();

    // Specular shine line
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.fillRect(x + 5, y, 4, h);

    // Collar / Lip
    const lipX = x - lipOverhang;
    const lipW = w + lipOverhang * 2;
    const lipY = lipSide === 'down' ? y + h - lipHeight : y;

    const lipGrad = ctx.createLinearGradient(lipX, 0, lipX + lipW, 0);
    lipGrad.addColorStop(0, theme.pipeHighlight);
    lipGrad.addColorStop(0.25, theme.pipeMain);
    lipGrad.addColorStop(0.85, theme.pipeShadow);
    lipGrad.addColorStop(1, theme.pipeLipShadow);

    ctx.fillStyle = lipGrad;
    ctx.beginPath();
    ctx.rect(lipX, lipY, lipW, lipHeight);
    ctx.fill();
    ctx.stroke();

    // Lip specular line
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.fillRect(lipX + 6, lipY, 4, lipHeight);

    // Lip drop shadow on shaft
    ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
    if (lipSide === 'down') {
      ctx.fillRect(x, lipY - 5, w, 5);
    } else {
      ctx.fillRect(x, lipY + lipHeight, w, 5);
    }

    ctx.restore();
  }

  private renderGround(ctx: CanvasRenderingContext2D, theme: ThemeConfig, w: number, h: number) {
    ctx.save();
    const groundY = PLAYABLE_HEIGHT;
    const groundH = h - groundY;

    // Ground base dirt
    ctx.fillStyle = theme.groundMain;
    ctx.fillRect(0, groundY, w, groundH);

    // Lush top grass border
    ctx.fillStyle = theme.groundTop;
    ctx.fillRect(0, groundY, w, 14);

    // Dark border line
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, groundY);
    ctx.lineTo(w, groundY);
    ctx.moveTo(0, groundY + 14);
    ctx.lineTo(w, groundY + 14);
    ctx.stroke();

    // Scrolling stripes
    ctx.fillStyle = theme.groundStripe;
    const stripeGap = 24;

    for (let sx = -stripeGap; sx < w + stripeGap; sx += stripeGap) {
      const rx = sx - this.groundOffset;
      ctx.beginPath();
      ctx.moveTo(rx, groundY + 15);
      ctx.lineTo(rx + 8, groundY + 15);
      ctx.lineTo(rx + 8 - 14, groundY + groundH);
      ctx.lineTo(rx - 14, groundY + groundH);
      ctx.closePath();
      ctx.fill();
    }

    ctx.restore();
  }

  private renderBird(ctx: CanvasRenderingContext2D, bird: Bird, isIdle: boolean) {
    ctx.save();
    const skin = SKINS.find((s) => s.id === bird.skinId) || SKINS[0];

    const isWidescreen = this.worldWidth > 600;
    const drawX = isIdle
      ? (isWidescreen ? this.worldWidth / 2 - 175 : this.worldWidth / 2)
      : bird.x;
    const drawY = isIdle
      ? (isWidescreen ? 165 + Math.sin(Date.now() * 0.005) * 8 : 120 + Math.sin(Date.now() * 0.005) * 6)
      : bird.y;
    const rotation = isIdle ? Math.sin(Date.now() * 0.004) * 0.12 : bird.rotation;
    const idleWingFlap = isIdle && Math.sin(Date.now() * 0.012) > 0;

    ctx.translate(drawX, drawY);
    ctx.rotate(rotation);

    if (isIdle) {
      ctx.scale(1.25, 1.25);
    }

    // Aura glow (if skin has auraGlow)
    if (skin.auraGlow) {
      const glowGrad = ctx.createRadialGradient(0, 0, 8, 0, 0, 32);
      glowGrad.addColorStop(0, skin.auraGlow);
      glowGrad.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = glowGrad;
      ctx.beginPath();
      ctx.arc(0, 0, 32, 0, Math.PI * 2);
      ctx.fill();
    }

    // Outer dark stroke
    ctx.strokeStyle = '#18181b';
    ctx.lineWidth = 2.5;

    // 1. Tail feather
    ctx.fillStyle = skin.wingColor;
    ctx.beginPath();
    ctx.ellipse(-14, 2, 7, 4, -0.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // 2. Main Body
    ctx.fillStyle = skin.bodyColor;
    ctx.beginPath();
    ctx.ellipse(0, 0, 16, 13, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // 3. Belly
    ctx.fillStyle = skin.bellyColor;
    ctx.beginPath();
    ctx.ellipse(2, 4, 10, 7, 0.2, 0, Math.PI * 2);
    ctx.fill();

    // 4. Wing
    ctx.fillStyle = skin.wingColor;
    const isFlapping = isIdle ? idleWingFlap : bird.flapFrame === 1;
    const wingY = isFlapping ? -6 : 2;
    const wingAngle = isFlapping ? -0.4 : 0.2;
    ctx.beginPath();
    ctx.ellipse(-4, wingY, 9, 6, wingAngle, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // 5. Eye
    ctx.fillStyle = skin.eyeColor;
    ctx.beginPath();
    ctx.arc(7, -4, 5.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Pupil
    const pupilOffsetX = bird.isDead ? 0 : 2;
    const pupilOffsetY = bird.isDead ? 0 : Math.min(2, Math.max(-1, bird.vy * 0.005));

    if (bird.isDead) {
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.moveTo(5, -6);
      ctx.lineTo(9, -2);
      ctx.moveTo(9, -6);
      ctx.lineTo(5, -2);
      ctx.stroke();
    } else {
      ctx.fillStyle = '#000000';
      ctx.beginPath();
      ctx.arc(7 + pupilOffsetX, -4 + pupilOffsetY, 2.5, 0, Math.PI * 2);
      ctx.fill();

      // Catchlight
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.arc(6.5 + pupilOffsetX, -5.5 + pupilOffsetY, 1.0, 0, Math.PI * 2);
      ctx.fill();
    }

    // 6. Beak
    ctx.fillStyle = skin.beakColor;
    ctx.beginPath();
    ctx.moveTo(12, -2);
    ctx.lineTo(21, 1);
    ctx.lineTo(12, 5);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(12, 1.5);
    ctx.lineTo(19, 1.5);
    ctx.stroke();

    // 7. Custom Accessories per skin
    if (skin.accessory === 'visor') {
      ctx.fillStyle = '#06B6D4';
      ctx.beginPath();
      ctx.roundRect(3, -7, 10, 6, 2);
      ctx.fill();
      ctx.strokeStyle = '#EC4899';
      ctx.lineWidth = 1.2;
      ctx.stroke();
      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.fillRect(4, -6, 2.5, 4);
    } else if (skin.accessory === 'flame') {
      ctx.fillStyle = '#F59E0B';
      ctx.beginPath();
      ctx.moveTo(-4, -12);
      ctx.lineTo(1, -19);
      ctx.lineTo(5, -12);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = '#EF4444';
      ctx.beginPath();
      ctx.moveTo(-1, -12);
      ctx.lineTo(2, -16);
      ctx.lineTo(4, -12);
      ctx.closePath();
      ctx.fill();
    } else if (skin.accessory === 'crown') {
      // Golden Monarch Crown
      ctx.fillStyle = '#FACC15';
      ctx.strokeStyle = '#78350F';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(-5, -12);
      ctx.lineTo(-7, -20);
      ctx.lineTo(-1, -15);
      ctx.lineTo(4, -22);
      ctx.lineTo(9, -15);
      ctx.lineTo(15, -20);
      ctx.lineTo(13, -12);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      // Crown Ruby
      ctx.fillStyle = '#EF4444';
      ctx.beginPath();
      ctx.arc(4, -14, 1.8, 0, Math.PI * 2);
      ctx.fill();
    } else if (skin.accessory === 'bat') {
      ctx.fillStyle = '#3B0764';
      ctx.strokeStyle = '#18181b';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(2, -12);
      ctx.lineTo(6, -19);
      ctx.lineTo(9, -12);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    } else if (skin.accessory === 'horns') {
      // Dragon Horns
      ctx.fillStyle = '#D97706';
      ctx.strokeStyle = '#18181b';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(0, -12);
      ctx.quadraticCurveTo(-6, -20, -10, -16);
      ctx.quadraticCurveTo(-4, -12, 2, -10);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    } else if (skin.accessory === 'jetpack') {
      // Mecha Jet thruster pack
      ctx.fillStyle = '#334155';
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.roundRect(-16, -6, 8, 14, 2);
      ctx.fill();
      ctx.stroke();
      // Exhaust nozzle
      ctx.fillStyle = '#EF4444';
      ctx.fillRect(-17, 4, 6, 3);
    } else if (skin.accessory === 'halo') {
      // Angelic Halo
      ctx.strokeStyle = '#5EEAD4';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.ellipse(3, -19, 11, 4, 0, 0, Math.PI * 2);
      ctx.stroke();
    } else if (skin.accessory === 'sunglasses') {
      // 8-bit Pixel Shades
      ctx.fillStyle = '#000000';
      ctx.fillRect(4, -6, 9, 5);
      ctx.fillRect(1, -5, 4, 4);
      // Glint
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(5, -5, 2, 2);
    } else if (skin.accessory === 'space_helmet') {
      // Space bubble helmet
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(4, -3, 14, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fillStyle = 'rgba(56, 189, 248, 0.2)';
      ctx.fill();
    } else if (skin.accessory === 'rainbow_crest') {
      // Prismatic Rainbow Crest
      const rColors = ['#EF4444', '#F59E0B', '#10B981', '#06B6D4', '#8B5CF6'];
      rColors.forEach((c, idx) => {
        ctx.fillStyle = c;
        ctx.beginPath();
        ctx.ellipse(-6 + idx * 3, -13 - idx * 1.5, 3, 6, -0.2, 0, Math.PI * 2);
        ctx.fill();
      });
    }

    ctx.restore();
  }

  private renderParticles(ctx: CanvasRenderingContext2D) {
    ctx.save();
    for (const p of this.particles) {
      if (!p.active) continue;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);
      ctx.globalAlpha = p.alpha;
      ctx.fillStyle = p.color;

      if (p.shape === 'feather') {
        ctx.beginPath();
        ctx.ellipse(0, 0, p.size * 1.6, p.size * 0.7, 0, 0, Math.PI * 2);
        ctx.fill();
      } else if (p.shape === 'star') {
        this.drawStar(ctx, 0, 0, 4, p.size * 1.5, p.size * 0.6);
        ctx.fill();
      } else if (p.shape === 'square') {
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
      } else if (p.shape === 'ring') {
        ctx.strokeStyle = p.color;
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.arc(0, 0, p.size, 0, Math.PI * 2);
        ctx.stroke();
      } else if (p.shape === 'ember') {
        ctx.beginPath();
        ctx.moveTo(0, -p.size * 1.4);
        ctx.lineTo(p.size * 0.7, p.size * 0.7);
        ctx.lineTo(-p.size * 0.7, p.size * 0.7);
        ctx.closePath();
        ctx.fill();
      } else if (p.shape === 'smoke') {
        ctx.beginPath();
        ctx.arc(0, 0, p.size, 0, Math.PI * 2);
        ctx.fill();
      } else if (p.shape === 'beam') {
        ctx.fillRect(-p.size * 4, -p.size / 2, p.size * 8, p.size);
      } else if (p.shape === 'sparkle') {
        this.drawStar(ctx, 0, 0, 4, p.size * 1.8, p.size * 0.4);
        ctx.fill();
      } else {
        ctx.beginPath();
        ctx.arc(0, 0, p.size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }
    ctx.restore();
  }

  private drawStar(
    ctx: CanvasRenderingContext2D,
    cx: number,
    cy: number,
    spikes: number,
    outerR: number,
    innerR: number
  ) {
    let rot = (Math.PI / 2) * 3;
    let x = cx;
    let y = cy;
    const step = Math.PI / spikes;

    ctx.beginPath();
    ctx.moveTo(cx, cy - outerR);
    for (let i = 0; i < spikes; i++) {
      x = cx + Math.cos(rot) * outerR;
      y = cy + Math.sin(rot) * outerR;
      ctx.lineTo(x, y);
      rot += step;

      x = cx + Math.cos(rot) * innerR;
      y = cy + Math.sin(rot) * innerR;
      ctx.lineTo(x, y);
      rot += step;
    }
    ctx.lineTo(cx, cy - outerR);
    ctx.closePath();
  }

  private renderScorePopups(ctx: CanvasRenderingContext2D) {
    ctx.save();
    for (const sp of this.scorePopups) {
      ctx.save();
      ctx.translate(sp.x, sp.y);
      ctx.scale(sp.scale, sp.scale);
      ctx.globalAlpha = sp.alpha;
      ctx.font = 'bold 22px "Press Start 2P", monospace';
      ctx.fillStyle = '#FEF08A';
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 4;
      ctx.textAlign = 'center';
      ctx.strokeText(sp.text, 0, 0);
      ctx.fillText(sp.text, 0, 0);
      ctx.restore();
    }
    ctx.restore();
  }
}
