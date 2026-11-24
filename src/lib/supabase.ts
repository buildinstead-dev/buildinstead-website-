import "server-only";

/**
 * Minimal Supabase REST client — just enough to insert rows, without
 * pulling in the full SDK. Server-only: the key never reaches the browser.
 */
const url = process.env.SUPABASE_URL?.replace(/\/$/, "");
const key = process.env.SUPABASE_ANON_KEY;

export function isSupabaseConfigured(): boolean {
  return Boolean(url && key);
}

export async function insertRow(table: string, row: Record<string, unknown>) {
  if (!url || !key) throw new Error("Supabase is not configured");
  const res = await fetch(`${url}/rest/v1/${table}`, {
    method: "POST",
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      Prefer: "return=minimal",
    },
    body: JSON.stringify(row),
    cache: "no-store",
  });
  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`Supabase insert into ${table} failed (${res.status}): ${detail.slice(0, 200)}`);
  }
}
