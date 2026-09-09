// Server-only notification email via Resend's REST API (no SDK — matches the
// pattern used for Shopify/Klaviyo elsewhere: raw fetch, no new dependency).
// Only ever import this from route handlers, never from "use client" code.

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const RESEND_FROM_EMAIL = process.env.RESEND_FROM_EMAIL || "JB Racks Quiz <onboarding@resend.dev>";
const QUIZ_NOTIFY_EMAIL = process.env.QUIZ_NOTIFY_EMAIL || "reed@jbracks.com";

export const isResendConfigured = Boolean(RESEND_API_KEY);

type QuizNotificationPayload = {
  name?: string;
  email?: string;
  reasonText?: string;
  recommendedRack?: string;
  answers: Record<string, string>;
};

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c] as string);
}

/**
 * Emails every quiz submission (email-capture or open-text path) to
 * QUIZ_NOTIFY_EMAIL. No-ops (returns false) when RESEND_API_KEY isn't set,
 * so a missing key never breaks the quiz submission itself.
 */
export async function sendQuizNotificationEmail(payload: QuizNotificationPayload): Promise<boolean> {
  if (!RESEND_API_KEY) return false;

  const { name, email, reasonText, recommendedRack, answers } = payload;

  const answerRows = Object.entries(answers)
    .map(([step, answer]) => `<tr><td style="padding:4px 12px 4px 0;color:#666;">Step ${escapeHtml(step)}</td><td style="padding:4px 0;font-weight:600;">${escapeHtml(answer)}</td></tr>`)
    .join("");

  const html = `
    <div style="font-family:sans-serif;max-width:560px;margin:0 auto;">
      <h2 style="margin:0 0 12px;">New quiz submission</h2>
      ${email ? `<p style="margin:0 0 4px;"><strong>Email:</strong> ${escapeHtml(email)}</p>` : ""}
      ${name ? `<p style="margin:0 0 4px;"><strong>Name:</strong> ${escapeHtml(name)}</p>` : ""}
      ${recommendedRack ? `<p style="margin:0 0 12px;"><strong>Recommended rack:</strong> ${escapeHtml(recommendedRack)}</p>` : ""}
      ${reasonText ? `<p style="margin:0 0 12px;"><strong>What's stopping them:</strong><br />${escapeHtml(reasonText)}</p>` : ""}
      <table style="border-collapse:collapse;margin-top:12px;">${answerRows}</table>
    </div>
  `;

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: RESEND_FROM_EMAIL,
        to: [QUIZ_NOTIFY_EMAIL],
        reply_to: email || undefined,
        subject: `Quiz lead: ${name || email || "anonymous"}${recommendedRack ? ` — ${recommendedRack}` : ""}`,
        html,
      }),
    });

    if (!res.ok) {
      console.error("Resend notification email failed:", res.status, await res.text());
      return false;
    }
    return true;
  } catch (err) {
    console.error("Resend request failed:", err);
    return false;
  }
}
