interface CacheEntry<T> { data: T; ts: number; }
const store = new Map<string, CacheEntry<unknown>>();
const TTL = 60 * 60 * 1000; // 1 hour

export function cacheGet<T>(key: string): T | null {
  const entry = store.get(key);
  if (!entry) return null;
  if (Date.now() - entry.ts > TTL) { store.delete(key); return null; }
  return entry.data as T;
}

export function cacheSet<T>(key: string, data: T): void {
  store.set(key, { data, ts: Date.now() });
}
