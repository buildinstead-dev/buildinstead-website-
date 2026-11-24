import { NextResponse } from "next/server";
import { insertRow, isSupabaseConfigured } from "@/lib/supabase";
import { hasErrors, validateContact, type ContactInput } from "@/lib/validation";

export async function POST(request: Request) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ ok: false, error: "The contact form is not configured on this site yet." }, { status: 503 });
  }

  let body: Partial<ContactInput> & { company?: string };
  try {
    const text = await request.text();
    if (text.length > 12_000) return NextResponse.json({ ok: false, error: "Request too large." }, { status: 413 });
    body = JSON.parse(text);
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  if (body.company) return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });

  const input = {
    topic: String(body.topic ?? "") as ContactInput["topic"],
    name: String(body.name ?? ""),
    email: String(body.email ?? ""),
    message: String(body.message ?? ""),
  };
  const errors = validateContact(input);
  if (hasErrors(errors)) return NextResponse.json({ ok: false, errors }, { status: 422 });

  try {
    await insertRow("contact_messages", {
      topic: input.topic,
      name: input.name.trim(),
      email: input.email.trim(),
      message: input.message.trim(),
    });
    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ ok: false, error: "We couldn't send your message. Please try again or email us directly." }, { status: 502 });
  }
}
