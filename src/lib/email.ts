import "server-only";

/**
 * Minimal Resend client over its REST API (no SDK dependency).
 * Server-only: the API key never reaches the browser.
 *
 *   RESEND_API_KEY   Resend API key (re_…)
 *   CONTACT_EMAIL    Inbox that receives submissions
 *   EMAIL_FROM       Sender on a domain verified in Resend, e.g. "BuildInstead <hello@buildinstead.com>"
 */
const API_BASE = (process.env.RESEND_API_BASE_URL || "https://api.resend.com").replace(/\/$/, "");
const EMAIL_RE = /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]{2,}$/;

function config() {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const to = process.env.CONTACT_EMAIL?.trim();
  const from = process.env.EMAIL_FROM?.trim();
  const fromAddress = from?.match(/<([^>]+)>\s*$/)?.[1] ?? from;
  if (!apiKey || !to || !from || !EMAIL_RE.test(to) || !fromAddress || !EMAIL_RE.test(fromAddress)) return null;
  return { apiKey, to, from };
}

export function isEmailConfigured(): boolean {
  return config() !== null;
}

export function contactInbox(): string | undefined {
  return config()?.to;
}

export class EmailError extends Error {
  constructor(message: string, readonly status?: number) {
    super(message);
  }
}

export async function sendEmail(msg: {
  to?: string;
  subject: string;
  html: string;
  text: string;
  replyTo?: string;
  idempotencyKey?: string;
}): Promise<{ id: string }> {
  const cfg = config();
  if (!cfg) throw new EmailError("Email is not configured");

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10_000);
  try {
    const res = await fetch(`${API_BASE}/emails`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${cfg.apiKey}`,
        "Content-Type": "application/json",
        ...(msg.idempotencyKey && { "Idempotency-Key": msg.idempotencyKey }),
      },
      body: JSON.stringify({
        from: cfg.from,
        to: [msg.to ?? cfg.to],
        subject: msg.subject,
        html: msg.html,
        text: msg.text,
        ...(msg.replyTo && { reply_to: msg.replyTo }),
      }),
      cache: "no-store",
      signal: controller.signal,
    });
    const data = (await res.json().catch(() => ({}))) as { id?: string; message?: string };
    if (!res.ok || !data.id) {
      // Log the provider's reason server-side only; never echo it to visitors.
      throw new EmailError(`Resend ${res.status}: ${data.message ?? "no message"}`, res.status);
    }
    return { id: data.id };
  } catch (err) {
    if (err instanceof EmailError) throw err;
    throw new EmailError(controller.signal.aborted ? "Resend request timed out" : `Resend request failed: ${(err as Error).message}`);
  } finally {
    clearTimeout(timeout);
  }
}
