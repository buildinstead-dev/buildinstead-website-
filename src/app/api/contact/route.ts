import { contactConfirmation, contactNotification } from "@/lib/email-templates";
import { handleSubmission } from "@/lib/submissions";
import { validateContact, type ContactInput } from "@/lib/validation";

const str = (v: unknown) => (typeof v === "string" ? v : "");

export async function POST(request: Request) {
  return handleSubmission<ContactInput>(request, {
    kind: "contact",
    parse: (b) => ({ topic: str(b.topic) as ContactInput["topic"], name: str(b.name), email: str(b.email), message: str(b.message) }),
    validate: validateContact,
    fingerprint: (i) => [i.topic, i.name, i.email, i.message],
    notification: contactNotification,
    replyTo: (i) => i.email.trim(),
    confirmTo: (i) => i.email.trim(),
    confirmation: contactConfirmation,
    table: "contact_messages",
    row: (i) => ({ topic: i.topic, name: i.name.trim(), email: i.email.trim(), message: i.message.trim() }),
  });
}
