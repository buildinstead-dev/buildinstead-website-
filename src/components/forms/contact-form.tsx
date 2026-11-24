"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { ArrowRight, CheckCircle2, Loader2 } from "lucide-react";
import { Field, Honeypot, TextArea, TextInput } from "@/components/forms/fields";
import { submitForm } from "@/components/forms/submit";
import { buttonClasses, cn } from "@/components/ui/primitives";
import { contactTopics, hasErrors, validateContact, type ContactInput, type ContactTopic, type FieldErrors } from "@/lib/validation";

type State = { kind: "idle" } | { kind: "submitting" } | { kind: "saved"; confirmation: boolean } | { kind: "error"; message: string };

export function ContactForm({ initialTopic = "general" }: { initialTopic?: ContactTopic }) {
  const [values, setValues] = useState<ContactInput>({ topic: initialTopic, name: "", email: "", message: "" });
  const [errors, setErrors] = useState<FieldErrors<ContactInput>>({});
  const [touched, setTouched] = useState(false);
  const [honey, setHoney] = useState("");
  const [state, setState] = useState<State>({ kind: "idle" });
  const startedAt = useRef(0);
  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  function update<K extends keyof ContactInput>(key: K, value: ContactInput[K]) {
    const next = { ...values, [key]: value };
    setValues(next);
    if (touched) setErrors(validateContact(next));
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setTouched(true);
    const v = validateContact(values);
    setErrors(v);
    if (hasErrors(v)) {
      document.getElementById(Object.keys(v)[0])?.focus();
      return;
    }

    setState({ kind: "submitting" });
    const result = await submitForm("/api/contact", { ...values, company: honey, startedAt: startedAt.current });
    if (result.ok) {
      setState({ kind: "saved", confirmation: result.confirmation });
    } else {
      if (result.errors) setErrors(result.errors);
      setState({ kind: "error", message: result.message });
    }
  }

  if (state.kind === "saved") {
    return (
      <div className="rounded-3xl border border-lime-deep/20 bg-white p-8 text-center sm:p-12" role="status">
        <CheckCircle2 className="mx-auto size-12 text-lime-deep" strokeWidth={1.6} />
        <h2 className="mt-5 text-2xl font-semibold">Message received.</h2>
        <p className="mx-auto mt-2 max-w-sm text-steel">Thanks, {values.name.split(" ")[0]}. We&rsquo;ll reply to {values.email}.</p>
        {state.confirmation && <p className="mx-auto mt-2 max-w-sm text-sm text-steel">A confirmation is on its way to your inbox.</p>}
      </div>
    );
  }

  const submitting = state.kind === "submitting";

  return (
    <form onSubmit={onSubmit} noValidate aria-busy={submitting} className="relative space-y-6 rounded-3xl border border-ink/[0.08] bg-white p-6 sm:p-10">
      <fieldset>
        <legend className="text-sm font-medium">What&rsquo;s this about?</legend>
        <div className="mt-3 flex flex-wrap gap-2">
          {contactTopics.map((t) => (
            <label
              key={t.value}
              className={cn(
                "inline-flex h-10 cursor-pointer items-center rounded-lg border px-3.5 text-sm transition-colors has-[:focus-visible]:ring-4 has-[:focus-visible]:ring-lime/40",
                values.topic === t.value ? "border-ink bg-ink text-white" : "border-ink/12 text-ink/80 hover:border-ink/30",
              )}
            >
              <input type="radio" name="topic" value={t.value} checked={values.topic === t.value} onChange={() => update("topic", t.value)} className="sr-only" />
              {t.label}
            </label>
          ))}
        </div>      </fieldset>

      <div className="grid gap-6 sm:grid-cols-2">
        <Field id="name" label="Your name" error={errors.name}>
          <TextInput id="name" value={values.name} error={errors.name} onChange={(e) => update("name", e.target.value)} autoComplete="name" maxLength={120} />
        </Field>
        <Field id="email" label="Email" error={errors.email}>
          <TextInput id="email" type="email" value={values.email} error={errors.email} onChange={(e) => update("email", e.target.value)} autoComplete="email" inputMode="email" maxLength={254} placeholder="you@example.com" />
        </Field>
      </div>

      <Field id="message" label="Message" error={errors.message}>
        <TextArea
          id="message"
          value={values.message}
          error={errors.message}
          onChange={(e) => update("message", e.target.value)}
          rows={6}
          maxLength={5000}
          placeholder={values.topic === "bug" ? "Which tool, what you did, what happened and what you expected." : "How can we help?"}
        />
      </Field>

      <Honeypot value={honey} onChange={setHoney} />

      {state.kind === "error" && <p role="alert" className="rounded-xl bg-red-50 p-4 text-sm text-red-800">{state.message}</p>}
      <div className="flex justify-end pt-2">
        <button type="submit" disabled={submitting} className={buttonClasses("ink", "lg", "w-full sm:w-auto")}>
          {submitting ? (
            <><Loader2 className="size-4 animate-spin" /> Sending…</>
          ) : (
            <>Send message <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" /></>
          )}
        </button>
      </div>
    </form>
  );
}
