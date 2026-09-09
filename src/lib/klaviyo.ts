// Server-only Klaviyo client. Uses the private API key (never exposed to the
// browser), so this file must only ever be imported from route handlers /
// server components — not from "use client" components.

const KLAVIYO_API_KEY = process.env.KLAVIYO_PRIVATE_API_KEY;
const KLAVIYO_LIST_ID = process.env.KLAVIYO_LIST_ID;
const KLAVIYO_REVISION = "2024-10-15";

export const isKlaviyoConfigured = Boolean(KLAVIYO_API_KEY);

type QuizKlaviyoPayload = {
  email: string;
  firstName?: string;
  answers: Record<string, string>;
  // The add-ons (Slow-Fold Strut / Garage Stand) the quiz recommended —
  // pushed to its own "quiz_recommendations" custom property, both on the
  // event and on the profile itself, so it's usable as a Klaviyo segment
  // filter (e.g. "quiz_recommendations contains Garage Stand"), not just
  // buried in a one-off event's properties.
  recommendedAddons?: string[];
};

/**
 * Creates/updates a Klaviyo profile and logs a "Quiz Completed" event with
 * every quiz answer as an event property. One call does both — Klaviyo's
 * Events API upserts the referenced profile automatically. No-ops (returns
 * false) when KLAVIYO_PRIVATE_API_KEY isn't set, rather than throwing, so
 * the quiz submission itself never fails for lack of Klaviyo credentials.
 */
export async function trackQuizCompletionInKlaviyo({ email, firstName, answers, recommendedAddons }: QuizKlaviyoPayload): Promise<boolean> {
  if (!KLAVIYO_API_KEY) return false;

  const headers = {
    Authorization: `Klaviyo-API-Key ${KLAVIYO_API_KEY}`,
    "Content-Type": "application/json",
    revision: KLAVIYO_REVISION,
  };

  const hasRecommendations = Boolean(recommendedAddons && recommendedAddons.length > 0);

  try {
    const eventRes = await fetch("https://a.klaviyo.com/api/events/", {
      method: "POST",
      headers,
      body: JSON.stringify({
        data: {
          type: "event",
          attributes: {
            properties: {
              ...answers,
              ...(hasRecommendations ? { quiz_recommendations: recommendedAddons } : {}),
            },
            metric: { data: { type: "metric", attributes: { name: "Quiz Completed" } } },
            profile: {
              data: {
                type: "profile",
                attributes: {
                  email,
                  ...(firstName ? { first_name: firstName } : {}),
                  ...(hasRecommendations ? { properties: { quiz_recommendations: recommendedAddons } } : {}),
                },
              },
            },
          },
        },
      }),
    });

    if (!eventRes.ok) {
      console.error("Klaviyo event tracking failed:", eventRes.status, await eventRes.text());
      return false;
    }

    // Optional: subscribe the profile to a specific list (e.g. the "Quiz
    // Leads" list) if KLAVIYO_LIST_ID is configured. Skipped otherwise.
    if (KLAVIYO_LIST_ID) {
      const subscribeRes = await fetch("https://a.klaviyo.com/api/profile-subscription-bulk-create-jobs/", {
        method: "POST",
        headers,
        body: JSON.stringify({
          data: {
            type: "profile-subscription-bulk-create-job",
            attributes: {
              profiles: {
                data: [
                  {
                    type: "profile",
                    attributes: {
                      email,
                      ...(firstName ? { first_name: firstName } : {}),
                      subscriptions: { email: { marketing: { consent: "SUBSCRIBED" } } },
                    },
                  },
                ],
              },
            },
            relationships: {
              list: { data: { type: "list", id: KLAVIYO_LIST_ID } },
            },
          },
        }),
      });
      if (!subscribeRes.ok) {
        console.error("Klaviyo list subscription failed:", subscribeRes.status, await subscribeRes.text());
      }
    }

    return true;
  } catch (err) {
    console.error("Klaviyo request failed:", err);
    return false;
  }
}
