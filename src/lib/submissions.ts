import "server-only";
import { after, NextResponse } from "next/server";
import { EmailError, isEmailConfigured, sendEmail } from "@/lib/email";
import { clientIp, fingerprint, markSeen, rateLimit, refundRateLimit, wasRecentlySeen } from "@/lib/rate-limit";
import { insertRow, isSupabaseConfigured } from "@/lib/supabase";
import { hasErrors, type FieldErrors } from "@/lib/validation";

const MAX_BODY_BYTES = 12_000;
const MIN_FILL_MS = 1_500; // humans don't complete these forms in under 1.5s
const RATE_LIMIT = { max: 5, windowMs: 10 * 60_000 }; // per IP, per form
const CONFIRM_LIMIT = { max: 3, windowMs: 60 * 60_000 }; // per recipient address
const DUPLICATE_TTL_MS = 10 * 60_000;

type Email = { subject: string; html: string; text: string };

export interface SubmissionSpec<T extends object> {
  kind: "contact" | "suggestion";
  parse: (body: Record<string, unknown>) => T;
  validate: (input: T) => FieldErrors<T>;
  fingerprint: (input: T) => string[];
  notification: (input: T) => Email;
  replyTo: (input: T) => string | undefined;
  /** Where to send the visitor's confirmation (undefined = none). */
  confirmTo: (input: T) => string | undefined;
  confirmation: () => Email;
  /** Optional Supabase archive. */
  table: string;
  row: (input: T) => Record<string, unknown>;
}

const json = (status: number, body: Record<string, unknown>, headers?: HeadersInit) => NextResponse.json(body, { status, headers });

export function isDirectSubmissionEnabled() {
  return isEmailConfigured() || isSupabaseConfigured();
}

export async function handleSubmission<T extends object>(request: Request, spec: SubmissionSpec<T>) {
  if (!isDirectSubmissionEnabled()) {
    return json(503, { ok: false, error: "Submissions are temporarily unavailable. Please try again later or message us on Instagram." });
  }

  // ---- Parse (bounded size, JSON only) ----
  if (!request.headers.get("content-type")?.includes("application/json")) {
    return json(415, { ok: false, error: "Invalid request." });
  }
  let body: Record<string, unknown>;
  try {
    const text = await request.text();
    if (text.length > MAX_BODY_BYTES) return json(413, { ok: false, error: "Your message is too long." });
    const parsed = JSON.parse(text);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) throw new Error();
    body = parsed;
  } catch {
    return json(400, { ok: false, error: "Invalid request." });
  }

  // ---- Bot checks: honeypot + implausibly fast completion ----
  const startedAt = Number(body.startedAt);
  if (body.company || !Number.isFinite(startedAt) || Date.now() - startedAt < MIN_FILL_MS) {
    return json(400, { ok: false, error: "We couldn't accept that submission. Please try again." });
  }

  // ---- Rate limit per IP ----
  const rlKey = `${spec.kind}:${clientIp(request)}`;
  const retryAfter = rateLimit(rlKey, RATE_LIMIT.max, RATE_LIMIT.windowMs);
  if (retryAfter) {
    return json(
      429,
      { ok: false, error: `Too many submissions. Please wait ${Math.ceil(retryAfter / 60)} minute${retryAfter > 60 ? "s" : ""} and try again.` },
      { "Retry-After": String(retryAfter) },
    );
  }

  // ---- Validate ----
  const input = spec.parse(body);
  const errors = spec.validate(input);
  if (hasErrors(errors)) {
    refundRateLimit(rlKey); // typos shouldn't use up someone's allowance
    return json(422, { ok: false, error: "Please fix the highlighted fields.", errors });
  }

  // ---- Duplicate guard (same content recently delivered) ----
  const fp = await fingerprint(spec.kind, ...spec.fingerprint(input));
  if (wasRecentlySeen(fp)) {
    return json(200, { ok: true, duplicate: true });
  }

  // ---- Deliver: email (primary) and/or database (optional) ----
  const delivered: string[] = [];
  if (isEmailConfigured()) {
    try {
      const n = spec.notification(input);
      await sendEmail({ ...n, replyTo: spec.replyTo(input), idempotencyKey: `bi-${spec.kind}-${fp.slice(0, 40)}` });
      delivered.push("email");
    } catch (err) {
      console.error(`[${spec.kind}] email delivery failed:`, err instanceof EmailError ? err.message : err);
    }
  }
  if (isSupabaseConfigured()) {
    try {
      await insertRow(spec.table, spec.row(input));
      delivered.push("database");
    } catch (err) {
      console.error(`[${spec.kind}] database insert failed:`, (err as Error).message);
    }
  }

  if (delivered.length === 0) {
    refundRateLimit(rlKey);
    return json(502, { ok: false, error: "We couldn't send your submission right now. Please try again in a few minutes." });
  }
  markSeen(fp, DUPLICATE_TTL_MS);

  // ---- Confirmation to the visitor (after the response; never blocks or fails the submission) ----
  const confirmTo = isEmailConfigured() ? spec.confirmTo(input) : undefined;
  const willConfirm = !!confirmTo && rateLimit(`confirm:${confirmTo.toLowerCase()}`, CONFIRM_LIMIT.max, CONFIRM_LIMIT.windowMs) === 0;
  if (willConfirm) {
    after(async () => {
      try {
        await sendEmail({ ...spec.confirmation(), to: confirmTo, idempotencyKey: `bi-${spec.kind}-confirm-${fp.slice(0, 32)}` });
      } catch (err) {
        console.error(`[${spec.kind}] confirmation failed:`, err instanceof EmailError ? err.message : err);
      }
    });
  }

  return json(201, { ok: true, confirmation: willConfirm });
}
