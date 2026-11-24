import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";
import { cn } from "@/components/ui/primitives";

const control =
  "w-full rounded-xl border bg-white px-4 text-[15px] text-ink outline-none transition-[border-color,box-shadow] placeholder:text-fog focus:ring-4 focus:ring-lime/40";

export function Field({ id, label, hint, error, optional, children }: { id: string; label: string; hint?: string; error?: string; optional?: boolean; children: ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className="flex items-baseline justify-between gap-3 text-sm font-medium">
        {label}
        {optional && <span className="font-mono text-[11px] font-normal uppercase tracking-wide text-steel">Optional</span>}
      </label>
      {hint && <p id={`${id}-hint`} className="mt-1 text-sm text-steel">{hint}</p>}
      <div className="mt-2">{children}</div>
      {error && (
        <p id={`${id}-error`} role="alert" className="mt-2 text-sm text-red-700">
          {error}
        </p>
      )}
    </div>
  );
}

function describedBy(id: string, hint?: boolean, error?: string) {
  return [hint && `${id}-hint`, error && `${id}-error`].filter(Boolean).join(" ") || undefined;
}

export function TextInput({ id, error, hasHint, className, ...props }: InputHTMLAttributes<HTMLInputElement> & { id: string; error?: string; hasHint?: boolean }) {
  return (
    <input
      id={id}
      name={id}
      aria-invalid={!!error}
      aria-describedby={describedBy(id, hasHint, error)}
      className={cn(control, "h-12", error ? "border-red-600/60" : "border-ink/12 focus:border-ink/30", className)}
      {...props}
    />
  );
}

export function TextArea({ id, error, hasHint, className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement> & { id: string; error?: string; hasHint?: boolean }) {
  return (
    <textarea
      id={id}
      name={id}
      aria-invalid={!!error}
      aria-describedby={describedBy(id, hasHint, error)}
      className={cn(control, "min-h-32 resize-y py-3 leading-relaxed", error ? "border-red-600/60" : "border-ink/12 focus:border-ink/30", className)}
      {...props}
    />
  );
}

export function Select({ id, error, className, children, ...props }: SelectHTMLAttributes<HTMLSelectElement> & { id: string; error?: string }) {
  return (
    <div className="relative">
      <select
        id={id}
        name={id}
        aria-invalid={!!error}
        aria-describedby={describedBy(id, false, error)}
        className={cn(control, "h-12 appearance-none pr-10", error ? "border-red-600/60" : "border-ink/12 focus:border-ink/30", className)}
        {...props}
      >
        {children}
      </select>
      <span aria-hidden className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs text-steel">▾</span>
    </div>
  );
}

/** Hidden field that real people never fill in. */
export function Honeypot({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
      <label htmlFor="company">Company</label>
      <input id="company" name="company" tabIndex={-1} autoComplete="off" value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}

