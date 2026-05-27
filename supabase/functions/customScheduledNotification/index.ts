import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const ONESIGNAL_APP_ID = Deno.env.get("ONESIGNAL_APP_ID")!;
const ONE_SIGNAL_API_KEY = Deno.env.get("ONESIGNAL_REST_API_KEY")!;

Deno.serve(async (req) => {
  // Handle OPTIONS preflight request (for CORS)
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  }

  // Allow both POST and GET for testing
  if (req.method !== "POST" && req.method !== "GET") {
    return new Response("Method Not Allowed", { 
      status: 405,
      headers: { "Access-Control-Allow-Origin": "*" }
    });
  }

  try {
    let heading = "Daily Goal Reminder";
    let message = "Time to check your progress! 🎯";
    let segment = ["All"];

    // If POST, get values from body
    if (req.method === "POST") {
      const body = await req.json();
      heading = body.heading || heading;
      message = body.message || message;
      segment = body.segment || segment;
    }

    console.log("Sending notification:", { heading, message, segment });

    const notificationPayload = {
      app_id: ONESIGNAL_APP_ID,
      included_segments: segment,
      headings: { en: heading },
      contents: { en: message },
    };

    const response = await fetch("https://api.onesignal.com/notifications", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${ONE_SIGNAL_API_KEY}`,
      },
      body: JSON.stringify(notificationPayload),
    });

    const data = await response.json();
    console.log("OneSignal response:", data);

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (error) {
    console.error("Error:", error.message);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  }
});