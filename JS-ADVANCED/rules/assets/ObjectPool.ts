/**
 * Object Pool Pattern
 * Reutilización de objetos para performance crítico
 */

export interface Poolable {
  reset(): void;
  isActive: boolean;
}

export interface ObjectPoolOptions {
  initialSize: number;
  maxSize: number;
  autoExpand?: boolean;
}

export class ObjectPool<T extends Poolable> {
  private pool: T[] = [];
  private active: Set<T> = new Set();
  private factory: () => T;
  private options: ObjectPoolOptions;

  constructor(factory: () => T, options: ObjectPoolOptions) {
    this.factory = factory;
    this.options = { autoExpand: true, ...options };
    
    // Pre-allocate durante inicialización
    for (let i = 0; i < options.initialSize; i++) {
      this.pool.push(this.create());
    }
  }

  private create(): T {
    const item = this.factory();
    item.isActive = false;
    return item;
  }

  acquire(): T {
    let item: T | undefined;

    // Buscar en pool disponible
    while (this.pool.length > 0 && !item) {
      const candidate = this.pool.pop()!;
      if (!candidate.isActive) {
        item = candidate;
      }
    }

    // Crear nuevo si permitido
    if (!item && this.active.size < this.options.maxSize) {
      item = this.create();
    }

    if (!item) {
      throw new Error('Object pool exhausted');
    }

    // Reset y activar
    item.reset();
    item.isActive = true;
    this.active.add(item);

    return item;
  }

  release(item: T): void {
    if (!this.active.has(item)) return;

    item.isActive = false;
    this.active.delete(item);

    // Retornar al pool si hay espacio
    if (this.pool.length < this.options.maxSize) {
      this.pool.push(item);
    }
  }

  releaseAll(): void {
    this.active.forEach(item => {
      item.isActive = false;
      item.reset();
      this.pool.push(item);
    });
    this.active.clear();
  }

  forEachActive(callback: (item: T) => void): void {
    this.active.forEach(callback);
  }

  filterActive(predicate: (item: T) => boolean): T[] {
    return Array.from(this.active).filter(predicate);
  }

  getActiveCount(): number {
    return this.active.size;
  }

  getAvailableCount(): number {
    return this.pool.length;
  }

  getTotalCount(): number {
    return this.active.size + this.pool.length;
  }

  clear(): void {
    this.pool = [];
    this.active.clear();
  }
}

// Specialized pools para casos comunes
export class Vector2 {
  x = 0;
  y = 0;
  isActive = false;

  reset(): void {
    this.x = 0;
    this.y = 0;
  }

  set(x: number, y: number): this {
    this.x = x;
    this.y = y;
    return this;
  }

  add(v: Vector2): this {
    this.x += v.x;
    this.y += v.y;
    return this;
  }

  multiply(scalar: number): this {
    this.x *= scalar;
    this.y *= scalar;
    return this;
  }
}

export const vectorPool = new ObjectPool(() => new Vector2(), {
  initialSize: 100,
  maxSize: 1000
});

// Particle system con object pool
export class Particle implements Poolable {
  x = 0;
  y = 0;
  vx = 0;
  vy = 0;
  life = 0;
  maxLife = 0;
  size = 0;
  color = '';
  isActive = false;

  reset(): void {
    this.x = 0;
    this.y = 0;
    this.vx = 0;
    this.vy = 0;
    this.life = 0;
    this.maxLife = 0;
    this.size = 0;
    this.color = '';
  }

  update(deltaTime: number): boolean {
    this.x += this.vx * deltaTime;
    this.y += this.vy * deltaTime;
    this.life -= deltaTime;
    
    return this.life > 0;
  }
}

export class ParticleSystem {
  private pool: ObjectPool<Particle>;

  constructor(maxParticles: number = 1000) {
    this.pool = new ObjectPool(() => new Particle(), {
      initialSize: 100,
      maxSize: maxParticles
    });
  }

  emit(x: number, y: number, config: {
    count: number;
    speed: number;
    life: number;
    size: number;
    color: string;
  }): void {
    for (let i = 0; i < config.count; i++) {
      try {
        const particle = this.pool.acquire();
        particle.x = x;
        particle.y = y;
        particle.vx = (Math.random() - 0.5) * config.speed;
        particle.vy = (Math.random() - 0.5) * config.speed;
        particle.life = config.life;
        particle.maxLife = config.life;
        particle.size = config.size;
        particle.color = config.color;
      } catch {
        break; // Pool exhausted
      }
    }
  }

  update(deltaTime: number): void {
    const toRelease: Particle[] = [];

    this.pool.forEachActive(particle => {
      if (!particle.update(deltaTime)) {
        toRelease.push(particle);
      }
    });

    toRelease.forEach(p => this.pool.release(p));
  }

  render(ctx: CanvasRenderingContext2D): void {
    this.pool.forEachActive(particle => {
      const alpha = particle.life / particle.maxLife;
      ctx.globalAlpha = alpha;
      ctx.fillStyle = particle.color;
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.globalAlpha = 1;
  }

  getActiveCount(): number {
    return this.pool.getActiveCount();
  }
}
