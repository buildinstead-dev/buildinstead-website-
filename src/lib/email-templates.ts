import "server-only";
import { siteConfig } from "@/config/site";
import { contactTopics, type ContactInput, type SuggestionInput } from "@/lib/validation";

/* ---------- Sanitising helpers ---------- */

/** Escape text for safe inclusion in HTML email bodies. */
export function escapeHtml(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}

/** Remove control characters (keeps newlines and tabs) and trim. */
export function cleanText(s: string) {
  // eslint-disable-next-line no-control-regex
  return s.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "").replace(/\r\n?/g, "\n").trim();
}

/** Single-line value safe for an email subject/header: no line breaks, limited length. */
export function headerSafe(s: string, max = 80) {
  return cleanText(s).replace(/\s+/g, " ").slice(0, max);
}

const paragraphs = (s: string) => escapeHtml(s).replace(/\n/g, "<br />");

function layout(title: string, rows: [string, string][], footer: string) {
  const body = rows
    .map(
      ([k, v]) =>
        `<tr><td style="padding:12px 0;border-top:1px solid #E6E8E1;vertical-align:top">` +
        `<div style="font:600 11px/1.4 monospace;letter-spacing:.08em;text-transform:uppercase;color:#6B7066">${escapeHtml(k)}</div>` +
        `<div style="margin-top:4px;font:15px/1.6 -apple-system,Segoe UI,Arial,sans-serif;color:#0D0F0B">${v}</div></td></tr>`,
    )
    .join("");
  return (
    `<!doctype html><html><body style="margin:0;padding:24px;background:#F7F8F4">` +
    `<table role="presentation" width="100%" style="max-width:600px;margin:0 auto;background:#fff;border:1px solid #E6E8E1;border-radius:12px">` +
    `<tr><td style="padding:24px 28px 8px"><div style="font:700 18px/1.3 -apple-system,Segoe UI,Arial,sans-serif;color:#0D0F0B">${escapeHtml(title)}</div></td></tr>` +
    `<tr><td style="padding:0 28px 16px"><table role="presentation" width="100%">${body}</table></td></tr>` +
    `<tr><td style="padding:16px 28px 24px;font:12px/1.5 -apple-system,Segoe UI,Arial,sans-serif;color:#8B9086">${footer}</td></tr>` +
    `</table></body></html>`
  );
}

const textBlock = (rows: [string, string][]) => rows.map(([k, v]) => `${k}:\n${v}`).join("\n\n");

/* ---------- Notifications to the BuildInstead inbox ---------- */

export function contactNotification(input: ContactInput) {
  const topic = contactTopics.find((t) => t.value === input.topic)?.label ?? "Message";
  const name = headerSafe(input.name, 120);
  const email = headerSafe(input.email, 254);
  const message = cleanText(input.message);
  const subject = `[${topic}] ${headerSafe(input.name, 60)} via BuildInstead`;
  const rows: [string, string][] = [
    ["Topic", escapeHtml(topic)],
    ["Name", escapeHtml(name)],
    ["Email", escapeHtml(email)],
    ["Message", paragraphs(message)],
  ];
  return {
    subject,
    html: layout(`New ${topic.toLowerCase()}`, rows, "Sent from the contact form on BuildInstead. Reply to this email to answer the sender directly."),
    text: `New ${topic.toLowerCase()} from the BuildInstead contact form\n\n${textBlock([["Topic", topic], ["Name", name], ["Email", email], ["Message", message]])}`,
  };
}

export function suggestionNotification(input: SuggestionInput) {
  const paidTool = headerSafe(input.paidTool, 200);
  const problem = cleanText(input.problem);
  const wish = cleanText(input.wish);
  const email = headerSafe(input.email, 254);
  const subject = `Tool suggestion: ${headerSafe(input.paidTool, 70)}`;
  const rows: [string, string][] = [
    ["Currently pays for", escapeHtml(paidTool)],
    ["Problem it solves", paragraphs(problem)],
    ["What they'd like us to build", paragraphs(wish)],
    ["Email", email ? escapeHtml(email) : "Not provided"],
  ];
  return {
    subject,
    html: layout("New tool suggestion", rows, "Sent from the Suggest a Tool form on BuildInstead."),
    text: `New tool suggestion from BuildInstead\n\n${textBlock([["Currently pays for", paidTool], ["Problem it solves", problem], ["What they'd like us to build", wish], ["Email", email || "Not provided"]])}`,
  };
}

/* ---------- Confirmations to the visitor ----------
 * Deliberately contain NO visitor-supplied text, so the form can't be
 * abused to send arbitrary content to someone else's inbox.
 */

export function contactConfirmation() {
  const lines = [
    "Thanks for getting in touch with BuildInstead. We've received your message and will reply to this address as soon as we can.",
    `In the meantime, you can follow our daily builds on Instagram: ${siteConfig.instagram.url}`,
    "If you didn't send this message, you can safely ignore this email.",
  ];
  return confirmation("We got your message", lines);
}

export function suggestionConfirmation() {
  const lines = [
    "Thanks for suggesting a tool to BuildInstead. Your idea is now on our list. If we build it, you'll see it on Instagram first.",
    `Follow the daily builds: ${siteConfig.instagram.url}`,
    "If you didn't send this suggestion, you can safely ignore this email.",
  ];
  return confirmation("Thanks for your suggestion", lines);
}

function confirmation(title: string, lines: string[]) {
  const html =
    `<!doctype html><html><body style="margin:0;padding:24px;background:#F7F8F4">` +
    `<table role="presentation" width="100%" style="max-width:560px;margin:0 auto;background:#fff;border:1px solid #E6E8E1;border-radius:12px">` +
    `<tr><td style="padding:28px">` +
    `<div style="font:700 20px/1.3 -apple-system,Segoe UI,Arial,sans-serif;color:#0D0F0B">${escapeHtml(title)}</div>` +
    lines.map((l) => `<p style="margin:14px 0 0;font:15px/1.6 -apple-system,Segoe UI,Arial,sans-serif;color:#3a3d36">${escapeHtml(l)}</p>`).join("") +
    `<p style="margin:24px 0 0;font:600 13px/1.5 monospace;color:#3A8F00">${escapeHtml(siteConfig.tagline)}</p>` +
    `</td></tr></table></body></html>`;
  return { subject: `${title} — BuildInstead`, html, text: `${title}\n\n${lines.join("\n\n")}\n\n— BuildInstead\n${siteConfig.tagline}` };
}
