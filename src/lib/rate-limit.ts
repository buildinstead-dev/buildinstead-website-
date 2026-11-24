import "server-only";

/**
 * Small in-memory sliding-window limiter and duplicate guard.
 *
 * On serverless hosts (Vercel) each running instance keeps its own memory,
 * so this is best-effort: it stops rapid repeats and simple scripts, but a
 * distributed attacker could spread requests across instances. For stronger
 * guarantees, swap the store for a shared one (e.g. Upstash Redis).
 */
const hits = new Map<string, number[]>();
const seen = new Map<string, number>();
let lastSweep = Date.now();

function sweep(now: number) {
  if (now - lastSweep < 60_000) return;
  lastSweep = now;
  for (const [k, list] of hits) if (list.every((t) => now - t > 3_600_000)) hits.delete(k);
  for (const [k, exp] of seen) if (exp < now) seen.delete(k);
}

/** Returns 0 when allowed, otherwise seconds until the next attempt is allowed. */
export function rateLimit(key: string, limit: number, windowMs: number): number {
  const now = Date.now();
  sweep(now);
  const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
  if (recent.length >= limit) {
    hits.set(key, recent);
    return Math.max(1, Math.ceil((recent[0] + windowMs - now) / 1000));
  }
  recent.push(now);
  hits.set(key, recent);
  return 0;
}

/** Undo the most recent hit (used when a request fails for reasons that aren't the visitor's fault). */
export function refundRateLimit(key: string) {
  hits.get(key)?.pop();
}

export function wasRecentlySeen(key: string): boolean {
  const exp = seen.get(key);
  return exp !== undefined && exp > Date.now();
}

export function markSeen(key: string, ttlMs: number) {
  seen.set(key, Date.now() + ttlMs);
}

export function clientIp(request: Request): string {
  const fwd = request.headers.get("x-forwarded-for");
  return fwd?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "unknown";
}

export async function fingerprint(...parts: string[]): Promise<string> {
  const data = new TextEncoder().encode(parts.map((p) => p.trim().toLowerCase().replace(/\s+/g, " ")).join("\u0000"));
  const hash = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hash), (b) => b.toString(16).padStart(2, "0")).join("");
}
