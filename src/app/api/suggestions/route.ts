import { NextResponse } from "next/server";
import { insertRow, isSupabaseConfigured } from "@/lib/supabase";
import { hasErrors, validateSuggestion, type SuggestionInput } from "@/lib/validation";

export async function POST(request: Request) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ ok: false, error: "Submissions are not configured on this site yet." }, { status: 503 });
  }

  let body: Partial<SuggestionInput> & { company?: string };
  try {
    const text = await request.text();
    if (text.length > 10_000) return NextResponse.json({ ok: false, error: "Request too large." }, { status: 413 });
    body = JSON.parse(text);
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  // Honeypot: a hidden field only bots fill in.
  if (body.company) return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });

  const input: SuggestionInput = {
    paidTool: String(body.paidTool ?? ""),
    problem: String(body.problem ?? ""),
    wish: String(body.wish ?? ""),
    email: String(body.email ?? ""),
  };
  const errors = validateSuggestion(input);
  if (hasErrors(errors)) return NextResponse.json({ ok: false, errors }, { status: 422 });

  try {
    await insertRow("tool_suggestions", {
      paid_tool: input.paidTool.trim(),
      problem: input.problem.trim(),
      wish: input.wish.trim(),
      email: input.email.trim() || null,
    });
    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ ok: false, error: "We couldn't save your suggestion. Please try again." }, { status: 502 });
  }
}
