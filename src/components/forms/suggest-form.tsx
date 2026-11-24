"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { ArrowRight, CheckCircle2, Loader2 } from "lucide-react";
import { Field, Honeypot, TextArea, TextInput } from "@/components/forms/fields";
import { submitForm } from "@/components/forms/submit";
import { buttonClasses } from "@/components/ui/primitives";
import { hasErrors, validateSuggestion, type FieldErrors, type SuggestionInput } from "@/lib/validation";

type State = { kind: "idle" } | { kind: "submitting" } | { kind: "saved"; confirmation: boolean } | { kind: "error"; message: string };

const empty: SuggestionInput = { paidTool: "", problem: "", wish: "", email: "" };

export function SuggestForm() {
  const [values, setValues] = useState<SuggestionInput>(empty);
  const [errors, setErrors] = useState<FieldErrors<SuggestionInput>>({});
  const [touched, setTouched] = useState(false);
  const [honey, setHoney] = useState("");
  const [state, setState] = useState<State>({ kind: "idle" });
  const startedAt = useRef(0);
  useEffect(() => {
    if (state.kind === "idle") startedAt.current = Date.now();
  }, [state.kind]);

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

    setState({ kind: "submitting" });
    const result = await submitForm("/api/suggestions", { ...values, company: honey, startedAt: startedAt.current });
    if (result.ok) {
      setState({ kind: "saved", confirmation: result.confirmation });
      setValues(empty);
      setTouched(false);
    } else {
      if (result.errors) setErrors(result.errors);
      setState({ kind: "error", message: result.message });
    }
  }

  if (state.kind === "saved") {
    return (
      <div className="rounded-3xl border border-lime-deep/20 bg-white p-8 text-center sm:p-12" role="status">
        <CheckCircle2 className="mx-auto size-12 text-lime-deep" strokeWidth={1.6} />
        <h2 className="mt-5 text-2xl font-semibold">Got it — thank you.</h2>
        <p className="mx-auto mt-2 max-w-sm text-steel">Your suggestion is in our idea list. If we build it, you&rsquo;ll see it on Instagram first.</p>
        {state.confirmation && <p className="mx-auto mt-2 max-w-sm text-sm text-steel">We&rsquo;ve also sent a confirmation to your email.</p>}
        <button type="button" onClick={() => setState({ kind: "idle" })} className={buttonClasses("outline", "md", "mt-8")}>
          Suggest another
        </button>
      </div>
    );
  }

  const submitting = state.kind === "submitting";

  return (
    <form onSubmit={onSubmit} noValidate aria-busy={submitting} className="relative space-y-6 rounded-3xl border border-ink/[0.08] bg-white p-6 sm:p-10">
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

      <div className="flex flex-col-reverse gap-4 pt-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-steel">We read every suggestion. We&rsquo;ll only use your email to reply.</p>
        <button type="submit" disabled={submitting} className={buttonClasses("ink", "lg", "w-full sm:w-auto")}>
          {submitting ? (
            <><Loader2 className="size-4 animate-spin" /> Sending…</>
          ) : (
            <>Send suggestion <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" /></>
          )}
        </button>
      </div>
    </form>
  );
}
