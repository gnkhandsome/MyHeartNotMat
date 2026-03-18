const DEFAULT_PARTICLE_COUNT = 180;
const MIN_PARTICLE_COUNT = 24;
const MAX_ANIMATION_DURATION = 1400;

const SHRED_PERF_PROFILES = {
  low: {
    level: 'low',
    maxParticleCount: 96,
    velocityScale: 0.82,
    gravityScale: 0.9,
    lifeDecayBoost: 1.35
  },
  medium: {
    level: 'medium',
    maxParticleCount: 160,
    velocityScale: 0.95,
    gravityScale: 1,
    lifeDecayBoost: 1.1
  },
  high: {
    level: 'high',
    maxParticleCount: 240,
    velocityScale: 1,
    gravityScale: 1,
    lifeDecayBoost: 1
  }
};

let cachedPerfProfile = null;

function resolvePerfProfile() {
  if (cachedPerfProfile) return cachedPerfProfile;

  try {
    const info = wx.getSystemInfoSync ? wx.getSystemInfoSync() : {};
    const benchmarkLevel = Number(info.benchmarkLevel);

    if (!Number.isFinite(benchmarkLevel) || benchmarkLevel <= 0) {
      cachedPerfProfile = SHRED_PERF_PROFILES.medium;
      return cachedPerfProfile;
    }

    if (benchmarkLevel <= 20) {
      cachedPerfProfile = SHRED_PERF_PROFILES.low;
    } else if (benchmarkLevel <= 45) {
      cachedPerfProfile = SHRED_PERF_PROFILES.medium;
    } else {
      cachedPerfProfile = SHRED_PERF_PROFILES.high;
    }
  } catch (e) {
    cachedPerfProfile = SHRED_PERF_PROFILES.medium;
  }

  return cachedPerfProfile;
}

function clampParticleCount(requestedCount, maxParticleCount) {
  const safeRequested = Number(requestedCount);
  const expected = Number.isFinite(safeRequested) ? safeRequested : DEFAULT_PARTICLE_COUNT;
  return Math.max(MIN_PARTICLE_COUNT, Math.min(maxParticleCount, expected));
}

class ShredParticle {
  constructor(x, y, color, type, tuning = {}) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.type = type;
    this.opacity = 1;
    this.life = 1;
    this.size = Math.random() * 2.8 + 1.2;
    this.rotate = Math.random() * Math.PI * 2;
    this.lifeDecayBoost = Number(tuning.lifeDecayBoost) || 1;

    const velocityScale = Number(tuning.velocityScale) || 1;
    const gravityScale = Number(tuning.gravityScale) || 1;

    if (this.type === 'petal') {
      this.vx = (Math.random() - 0.5) * 2.2 * velocityScale;
      this.vy = (Math.random() * 1.8 + 0.6) * velocityScale;
      this.gravity = 0.028 * gravityScale;
      this.spin = (Math.random() - 0.5) * 0.08;
    } else {
      this.vx = (Math.random() - 0.5) * 10 * velocityScale;
      this.vy = (Math.random() - 0.6) * 9 * velocityScale;
      this.gravity = 0.38 * gravityScale;
      this.spin = (Math.random() - 0.5) * 0.22;
    }
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.vy += this.gravity;
    this.rotate += this.spin;
    const baseDecay = this.type === 'petal' ? 0.015 : 0.022;
    this.life -= baseDecay * this.lifeDecayBoost;
    this.opacity = Math.max(0, this.life);

    if (this.type === 'petal') {
      this.vx += Math.sin(this.y * 0.08) * 0.03;
    }
  }

  draw(ctx) {
    if (this.opacity <= 0) return;
    ctx.save();
    ctx.globalAlpha = this.opacity;
    ctx.fillStyle = this.color;
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotate);

    if (this.type === 'petal') {
      ctx.beginPath();
      ctx.ellipse(0, 0, this.size, this.size * 1.7, Math.PI / 4, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
    }

    ctx.restore();
  }
}

export function normalizeShredParticleType(particleType) {
  return particleType === 'shatter' ? 'shatter' : 'petal';
}

export function getShredPerformanceProfile() {
  return resolvePerfProfile();
}

export function createPageShredHelper(options = {}) {
  const {
    canvasSelector,
    canvasVisibleKey = 'isShredCanvasVisible',
    getTheme = (page) => (page && page.data ? page.data.theme : null)
  } = options;

  const runningPages = new WeakSet();

  return {
    async shred(page, payload = {}) {
      const {
        targetSelector,
        particleCount = DEFAULT_PARTICLE_COUNT,
        color,
        particleType,
        force = false
      } = payload;

      if (!page || !targetSelector || !canvasSelector) {
        return false;
      }

      if (!force && runningPages.has(page)) {
        return false;
      }

      runningPages.add(page);

      const perfProfile = getShredPerformanceProfile();
      const resolvedCount = clampParticleCount(particleCount, perfProfile.maxParticleCount);

      await new Promise((resolve) => {
        if (typeof page.setData === 'function') {
          page.setData({ [canvasVisibleKey]: true }, resolve);
        } else {
          resolve();
        }
      });

      try {
        const theme = typeof getTheme === 'function' ? getTheme(page) : null;
        const resolvedType = normalizeShredParticleType(particleType || (theme && theme.particleType));
        const resolvedColor = color || (theme && theme.primaryColor) || '#FF8A7A';

        return await runShredAnimation(page, {
          canvasSelector,
          targetSelector,
          particleType: resolvedType,
          color: resolvedColor,
          particleCount: resolvedCount,
          performanceProfile: perfProfile
        });
      } finally {
        if (typeof page.setData === 'function') {
          page.setData({ [canvasVisibleKey]: false });
        }
        runningPages.delete(page);
      }
    }
  };
}

export function runShredAnimation(page, options = {}) {
  const {
    canvasSelector,
    targetSelector,
    particleType = 'petal',
    color = '#FF8A7A',
    particleCount = DEFAULT_PARTICLE_COUNT,
    performanceProfile = getShredPerformanceProfile()
  } = options;

  if (!page || !canvasSelector || !targetSelector) {
    return Promise.resolve(false);
  }

  const count = clampParticleCount(
    particleCount,
    Number(performanceProfile?.maxParticleCount) || DEFAULT_PARTICLE_COUNT
  );

  return new Promise((resolve) => {
    const query = page.createSelectorQuery();
    query.select(canvasSelector).fields({ node: true, size: true });
    query.select(targetSelector).boundingClientRect();
    let done = false;
    const safeResolve = (result) => {
      if (done) return;
      done = true;
      resolve(result);
    };

    const timeoutId = setTimeout(() => {
      safeResolve(true);
    }, MAX_ANIMATION_DURATION);

    query.exec((res = []) => {
      const canvasRes = res[0];
      const targetRect = res[1];

      if (!canvasRes || !canvasRes.node || !targetRect) {
        clearTimeout(timeoutId);
        safeResolve(false);
        return;
      }

      const canvas = canvasRes.node;
      const ctx = canvas.getContext('2d');
      const dpr = wx.getSystemInfoSync().pixelRatio || 1;

      canvas.width = canvasRes.width * dpr;
      canvas.height = canvasRes.height * dpr;
      ctx.scale(dpr, dpr);

      const particles = [];
      const type = normalizeShredParticleType(particleType);
      for (let i = 0; i < count; i += 1) {
        const px = targetRect.left + Math.random() * targetRect.width;
        const py = targetRect.top + Math.random() * targetRect.height;
        particles.push(new ShredParticle(px, py, color, type, performanceProfile));
      }

      const raf = canvas.requestAnimationFrame
        ? canvas.requestAnimationFrame.bind(canvas)
        : (fn) => setTimeout(fn, 16);

      const clearCanvas = () => {
        ctx.clearRect(0, 0, canvasRes.width, canvasRes.height);
      };

      const animate = () => {
        clearCanvas();
        for (let i = particles.length - 1; i >= 0; i -= 1) {
          const item = particles[i];
          item.update();
          item.draw(ctx);
          if (item.opacity <= 0) {
            particles.splice(i, 1);
          }
        }

        if (particles.length > 0) {
          raf(animate);
        } else {
          clearCanvas();
          clearTimeout(timeoutId);
          safeResolve(true);
        }
      };

      animate();
    });
  });
}
