import { Redis } from "@upstash/redis"
import { Ratelimit } from "@upstash/ratelimit"

const memoryCache = new Map<string, { value: unknown; expiresAt: number }>()

export const isRedisConfigured = (): boolean => {
  const url = process.env.UPSTASH_REDIS_REST_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN
  return Boolean(
    url &&
      token &&
      !url.includes("xxx.upstash.io") &&
      token !== "xxx"
  )
}

export const redis = isRedisConfigured()
  ? new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL!,
      token: process.env.UPSTASH_REDIS_REST_TOKEN!,
    })
  : null

export const aiRateLimiter = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(3, "1 d"),
      analytics: true,
      prefix: "ratelimit:ai",
    })
  : null

export async function cacheGet<T>(key: string): Promise<T | null> {
  if (redis) {
    try {
      return await redis.get<T>(key)
    } catch {
      // Fallback to in-memory cache
    }
  }
  const entry = memoryCache.get(key)
  if (!entry) return null
  if (Date.now() > entry.expiresAt) {
    memoryCache.delete(key)
    return null
  }
  return entry.value as T
}

export async function cacheSet(key: string, value: unknown, ttlSeconds: number): Promise<void> {
  if (redis) {
    try {
      await redis.set(key, value, { ex: ttlSeconds })
      return
    } catch {
      // Fallback to in-memory cache
    }
  }
  memoryCache.set(key, {
    value,
    expiresAt: Date.now() + ttlSeconds * 1000,
  })
}

export async function checkRateLimit(identifier: string, maxPerDay = 3): Promise<{ success: boolean; remaining: number }> {
  if (aiRateLimiter) {
    try {
      const res = await aiRateLimiter.limit(identifier)
      return { success: res.success, remaining: res.remaining }
    } catch {
      return { success: true, remaining: maxPerDay }
    }
  }
  const key = `rl:${identifier}:${new Date().toISOString().split("T")[0]}`
  const current = (await cacheGet<number>(key)) ?? 0
  if (current >= maxPerDay) {
    return { success: false, remaining: 0 }
  }
  await cacheSet(key, current + 1, 86400)
  return { success: true, remaining: maxPerDay - (current + 1) }
}
