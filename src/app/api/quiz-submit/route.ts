import { NextResponse } from "next/server";
import { trackQuizCompletionInKlaviyo, isKlaviyoConfigured } from "@/lib/klaviyo";
import { sendQuizNotificationEmail, isResendConfigured } from "@/lib/email";

type QuizSubmitBody = {
  answers?: Record<string, string>;
  name?: string;
  email?: string;
  reasonText?: string;
  recommendedRack?: string;
  recommendedAddons?: string[];
};

export async function POST(request: Request) {
  let body: QuizSubmitBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const { answers = {}, name, email, reasonText, recommendedRack, recommendedAddons } = body;

  // Stubbed for now, per the spec — this is where the payload would get
  // written to a sheet/CRM/etc. once there's a real destination for it.
  console.log("[quiz-submit]", { answers, name, email, reasonText, recommendedRack, recommendedAddons });

  const recommendedAddonsStr = recommendedAddons && recommendedAddons.length > 0 ? recommendedAddons.join(", ") : undefined;

  let klaviyo = false;
  if (email) {
    klaviyo = await trackQuizCompletionInKlaviyo({
      email,
      firstName: name,
      answers: {
        ...answers,
        ...(reasonText ? { reasonText } : {}),
        ...(recommendedRack ? { recommendedRack } : {}),
      },
      // Sent as its own "quiz_recommendations" property (event + profile),
      // not flattened into `answers` — see lib/klaviyo.ts.
      recommendedAddons,
    });
  }

  // Every submission — email-capture or open-text — gets emailed to
  // QUIZ_NOTIFY_EMAIL (defaults to reed@jbracks.com) as a lead notification.
  const notified = await sendQuizNotificationEmail({
    name,
    email,
    reasonText,
    recommendedRack: recommendedAddonsStr ? `${recommendedRack} + ${recommendedAddonsStr}` : recommendedRack,
    answers,
  });

  return NextResponse.json({
    success: true,
    klaviyo: email ? klaviyo : "skipped (no email)",
    klaviyoConfigured: isKlaviyoConfigured,
    notified,
    resendConfigured: isResendConfigured,
  });
}
