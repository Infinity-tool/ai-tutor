/**
 * Redis Client — Upstash yoki mock (Redis yo'q bo'lganda)
 *
 * UPSTASH_REDIS_REST_URL sozlanmagan bo'lsa — in-memory mock ishlatiladi.
 * Bu development uchun yetarli. Production da real Upstash kerak.
 */

export const CACHE_TTL = {
  STATS: 30,
  LEADERBOARD: 60,
  SESSION: 3600,
  USER: 300,
} as const;

// ── In-memory mock Redis (Redis yo'q bo'lganda) ───────────────────────────────
const memoryStore = new Map<string, { value: string; expires: number }>();

const mockRedis = {
  get: async <T>(key: string): Promise<T | null> => {
    const item = memoryStore.get(key);
    if (!item) return null;
    if (item.expires < Date.now()) {
      memoryStore.delete(key);
      return null;
    }
    try {
      return JSON.parse(item.value) as T;
    } catch {
      return item.value as unknown as T;
    }
  },
  set: async (key: string, value: unknown): Promise<void> => {
    memoryStore.set(key, {
      value: JSON.stringify(value),
      expires: Date.now() + 3600_000, // 1 soat
    });
  },
  setex: async (key: string, ttl: number, value: unknown): Promise<void> => {
    memoryStore.set(key, {
      value: typeof value === "string" ? value : JSON.stringify(value),
      expires: Date.now() + ttl * 1000,
    });
  },
  del: async (key: string): Promise<void> => {
    memoryStore.delete(key);
  },
};

// ── Real Redis yoki Mock tanlash ─────────────────────────────────────────────
function createRedisClient() {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (
    url &&
    token &&
    url !== "https://your-redis.upstash.io" &&
    token !== "your-upstash-token"
  ) {
    // Real Upstash Redis
    const { Redis } = require("@upstash/redis");
    return new Redis({ url, token });
  }

  // Mock — development uchun
  console.info("[redis] Using in-memory mock (Upstash not configured)");
  return mockRedis;
}

export const redis = createRedisClient();

/**
 * Cached helper — Redis bor bo'lsa cache ishlatadi, yo'q bo'lsa to'g'ri qaytaradi.
 */
export async function cached<T>(
  key: string,
  ttl: number,
  fn: () => Promise<T>
): Promise<T> {
  try {
    const hit = await (redis as typeof mockRedis).get<T>(key);
    if (hit !== null) return hit;
  } catch {
    // Redis xatosi bo'lsa — skip cache
  }

  const fresh = await fn();

  try {
    await redis.setex(key, ttl, JSON.stringify(fresh));
  } catch {
    // Cache yozilmasa ham ishlayveradi
  }

  return fresh;
}
