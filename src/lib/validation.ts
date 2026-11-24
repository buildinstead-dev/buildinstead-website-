/** Shared by the browser forms and the API routes, so rules never drift. */

export type FieldErrors<T> = Partial<Record<keyof T, string>>;

// Conservative: blocks characters (<>"(),;: and spaces) that could break or inject into email headers.
const EMAIL_RE = /^[A-Za-z0-9._%+'-]+@[A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,}$/;

function len(v: unknown) {
  return typeof v === "string" ? v.trim().length : 0;
}

/* ---------- Suggest a tool ---------- */

export interface SuggestionInput {
  paidTool: string;
  problem: string;
  wish: string;
  email: string;
}

export function validateSuggestion(input: SuggestionInput): FieldErrors<SuggestionInput> {
  const e: FieldErrors<SuggestionInput> = {};
  if (len(input.paidTool) < 2) e.paidTool = "Tell us which tool or service you pay for.";
  else if (len(input.paidTool) > 200) e.paidTool = "Please keep this under 200 characters.";
  if (len(input.problem) < 10) e.problem = "A sentence or two helps (at least 10 characters).";
  else if (len(input.problem) > 2000) e.problem = "Please keep this under 2,000 characters.";
  if (len(input.wish) < 10) e.wish = "Describe what you'd like us to build (at least 10 characters).";
  else if (len(input.wish) > 2000) e.wish = "Please keep this under 2,000 characters.";
  if (len(input.email) > 0 && !EMAIL_RE.test(input.email.trim())) e.email = "That email doesn't look right.";
  return e;
}

/* ---------- Contact ---------- */

export const contactTopics = [
  { value: "general", label: "General enquiry" },
  { value: "collaboration", label: "Collaboration" },
  { value: "suggestion", label: "Tool suggestion" },
  { value: "bug", label: "Bug report" },
  { value: "feedback", label: "Feedback" },
] as const;

export type ContactTopic = (typeof contactTopics)[number]["value"];

export interface ContactInput {
  topic: ContactTopic;
  name: string;
  email: string;
  message: string;
}

export function validateContact(input: ContactInput): FieldErrors<ContactInput> {
  const e: FieldErrors<ContactInput> = {};
  if (!contactTopics.some((t) => t.value === input.topic)) e.topic = "Choose a topic.";
  if (len(input.name) < 1) e.name = "Please add your name.";
  else if (len(input.name) > 120) e.name = "Please keep this under 120 characters.";
  if (!EMAIL_RE.test((input.email ?? "").trim())) e.email = "Please enter a valid email so we can reply.";
  if (len(input.message) < 10) e.message = "Your message needs at least 10 characters.";
  else if (len(input.message) > 5000) e.message = "Please keep this under 5,000 characters.";
  return e;
}

export function hasErrors(e: object) {
  return Object.keys(e).length > 0;
}
