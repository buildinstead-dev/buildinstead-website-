/** Shared client-side submit for the contact and suggestion forms. */

export type SubmitResult<T> =
  | { ok: true; confirmation: boolean }
  | { ok: false; message: string; errors?: Partial<Record<keyof T, string>> };

const FALLBACK = "Something went wrong on our side. Please try again in a few minutes.";

export async function submitForm<T>(url: string, payload: T & { company: string; startedAt: number }): Promise<SubmitResult<T>> {
  let res: Response;
  try {
    res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch {
    return { ok: false, message: "We couldn't reach the server. Check your connection and try again." };
  }
  const data = (await res.json().catch(() => ({}))) as { ok?: boolean; confirmation?: boolean; error?: string; errors?: Partial<Record<keyof T, string>> };
  if (res.ok && data.ok) return { ok: true, confirmation: !!data.confirmation };
  return { ok: false, message: data.error || FALLBACK, errors: data.errors };
}
