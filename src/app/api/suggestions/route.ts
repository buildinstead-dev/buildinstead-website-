import { suggestionConfirmation, suggestionNotification } from "@/lib/email-templates";
import { handleSubmission } from "@/lib/submissions";
import { validateSuggestion, type SuggestionInput } from "@/lib/validation";

const str = (v: unknown) => (typeof v === "string" ? v : "");

export async function POST(request: Request) {
  return handleSubmission<SuggestionInput>(request, {
    kind: "suggestion",
    parse: (b) => ({ paidTool: str(b.paidTool), problem: str(b.problem), wish: str(b.wish), email: str(b.email) }),
    validate: validateSuggestion,
    fingerprint: (i) => [i.paidTool, i.problem, i.wish, i.email],
    notification: suggestionNotification,
    replyTo: (i) => i.email.trim() || undefined,
    confirmTo: (i) => i.email.trim() || undefined,
    confirmation: suggestionConfirmation,
    table: "tool_suggestions",
    row: (i) => ({ paid_tool: i.paidTool.trim(), problem: i.problem.trim(), wish: i.wish.trim(), email: i.email.trim() || null }),
  });
}
