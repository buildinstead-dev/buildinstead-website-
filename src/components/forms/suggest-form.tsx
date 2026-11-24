"use client";

import { useState, type FormEvent } from "react";
import { ArrowRight, CheckCircle2, Loader2, Mail } from "lucide-react";
import { ConfigNotice, Field, Honeypot, TextArea, TextInput } from "@/components/forms/fields";
import { buttonClasses } from "@/components/ui/primitives";
import { hasErrors, validateSuggestion, type FieldErrors, type SuggestionInput } from "@/lib/validation";

type State = { kind: "idle" } | { kind: "submitting" } | { kind: "saved" } | { kind: "mailto" } | { kind: "error"; message: string };

const empty: SuggestionInput = { paidTool: "", problem: "", wish: "", email: "" };

export function SuggestForm({ dbEnabled, contactEmail }: { dbEnabled: boolean; contactEmail: string }) {
  const [values, setValues] = useState<SuggestionInput>(empty);
  const [errors, setErrors] = useState<FieldErrors<SuggestionInput>>({});
  const [touched, setTouched] = useState(false);
  const [honey, setHoney] = useState("");
  const [state, setState] = useState<State>({ kind: "idle" });

  function update<K extends keyof SuggestionInput>(key: K, value: string) {
    const next = { ...values, [key]: value };
    setValues(next);
    if (touched) setErrors(validateSuggestion(next));
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setTouched(true);
    const v = validateSuggestion(values);
    setErrors(v);
    if (hasErrors(v)) {
      document.getElementById(Object.keys(v)[0])?.focus();
      return;
    }

    if (!dbEnabled) {
      const body = [
        `What I pay for: ${values.paidTool}`,
        "",
        `The problem it solves:\n${values.problem}`,
        "",
        `What I'd like you to build:\n${values.wish}`,
        values.email ? `\nReply to: ${values.email}` : "",
      ].join("\n");
      window.location.href = `mailto:${contactEmail}?subject=${encodeURIComponent(`Tool suggestion: ${values.paidTool}`)}&body=${encodeURIComponent(body)}`;
      setState({ kind: "mailto" });
      return;
    }

    setState({ kind: "submitting" });
    try {
      const res = await fetch("/api/suggestions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, company: honey }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.ok) {
        setState({ kind: "saved" });
        setValues(empty);
        setTouched(false);
      } else {
        if (data.errors) setErrors(data.errors);
        setState({ kind: "error", message: data.error ?? "Something went wrong. Please try again." });
      }
    } catch {
      setState({ kind: "error", message: "Network error — check your connection and try again." });
    }
  }

  if (state.kind === "saved") {
    return (
      <div className="rounded-3xl border border-lime-deep/20 bg-white p-8 text-center sm:p-12" role="status">
        <CheckCircle2 className="mx-auto size-12 text-lime-deep" strokeWidth={1.6} />
        <h2 className="mt-5 text-2xl font-semibold">Got it — thank you.</h2>
        <p className="mx-auto mt-2 max-w-sm text-steel">Your suggestion is in our idea list. If we build it, you&rsquo;ll see it on Instagram first.</p>
        <button type="button" onClick={() => setState({ kind: "idle" })} className={buttonClasses("outline", "md", "mt-8")}>
          Suggest another
        </button>
      </div>
    );
  }

  const submitting = state.kind === "submitting";

  return (
    <form onSubmit={onSubmit} noValidate className="relative space-y-6 rounded-3xl border border-ink/[0.08] bg-white p-6 sm:p-10">
      {!dbEnabled && <ConfigNotice email={contactEmail} />}

      <Field id="paidTool" label="What tool or service do you currently pay for?" error={errors.paidTool}>
        <TextInput id="paidTool" value={values.paidTool} error={errors.paidTool} onChange={(e) => update("paidTool", e.target.value)} placeholder="e.g. a PDF editor, a password manager, a budgeting app" maxLength={200} autoComplete="off" />
      </Field>

      <Field id="problem" label="What problem does it solve?" error={errors.problem}>
        <TextArea id="problem" value={values.problem} error={errors.problem} onChange={(e) => update("problem", e.target.value)} placeholder="What do you actually use it for?" maxLength={2000} rows={4} />
      </Field>

      <Field id="wish" label="What would you like us to build?" error={errors.wish}>
        <TextArea id="wish" value={values.wish} error={errors.wish} onChange={(e) => update("wish", e.target.value)} placeholder="The simplest version that would still be useful to you." maxLength={2000} rows={4} />
      </Field>

      <Field id="email" label="Email" optional hint="Only if you'd like a heads-up when we build it." error={errors.email}>
        <TextInput id="email" type="email" hasHint value={values.email} error={errors.email} onChange={(e) => update("email", e.target.value)} placeholder="you@example.com" autoComplete="email" inputMode="email" maxLength={254} />
      </Field>

      <Honeypot value={honey} onChange={setHoney} />

      {state.kind === "error" && (
        <p role="alert" className="rounded-xl bg-red-50 p-4 text-sm text-red-800">{state.message}</p>
      )}
      {state.kind === "mailto" && (
        <p role="status" className="rounded-xl bg-mist/60 p-4 text-sm leading-relaxed text-ink/80">
          Your email app should now be open with your suggestion ready. <strong>It hasn&rsquo;t been sent yet</strong> — press send there. Nothing opened? Email us at{" "}
          <a className="font-medium underline underline-offset-4" href={`mailto:${contactEmail}`}>{contactEmail}</a>.
        </p>
      )}

      <div className="flex flex-col-reverse gap-4 pt-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-steel">We read every suggestion. We&rsquo;ll only use your email to reply.</p>
        <button type="submit" disabled={submitting} className={buttonClasses("ink", "lg", "w-full sm:w-auto")}>
          {submitting ? (
            <><Loader2 className="size-4 animate-spin" /> Sending…</>
          ) : dbEnabled ? (
            <>Send suggestion <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" /></>
          ) : (
            <><Mail className="size-4" /> Open in email app</>
          )}
        </button>
      </div>
    </form>
  );
}
