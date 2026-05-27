// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
// import { createClient } from "https://esm.sh/@supabase/supabase-js";

console.log("Hello from Functions!");
const ONESIGNAL_APP_ID = Deno.env.get("APP_ID")!;
const ONE_SIGNAL_API_KEY = Deno.env.get("API_KEY")!;
console.log(ONESIGNAL_APP_ID[2]);
Deno.serve(async (req) => {
  try {
    if (!ONESIGNAL_APP_ID || !ONE_SIGNAL_API_KEY) {
      return new Response(
        JSON.stringify({
          error: "OneSignal API credentials are missing in Supabase Config.",
        }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    if (req.method !== "POST") {
      return new Response("Method Not Allowed", { status: 405 });
    }

    const { title, message } = await req.json();
    if (!title || !message) {
      return new Response(
        JSON.stringify({ error: "Title and message are required." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const response = await fetch(
      "https://api.onesignal.com/notifications?c=push",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Key ${ONE_SIGNAL_API_KEY}`,
        },
        body: JSON.stringify({
          app_id: ONESIGNAL_APP_ID,
          included_segments: ["All"],
          headings: { en: title },
          contents: { en: message },
          small_icon: "ic_stat_icona",
          big_picture:
            "https://msgwords.com/wp-content/uploads/2024/10/Long-Distance-Good-Morning-Messages-for-Her.jpeg",
          android_accent_color: "FF00AAFF",
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`OneSignal API error: ${response.statusText}`);
    }
    const data = await response.json();

    console.log("Notification sent successfully:", data);
    return new Response(
      JSON.stringify({ message: "Notification sent successfully", data }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error sending notification:", error);
    return new Response(
      JSON.stringify({ error: "Failed to send notificationz" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
});

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/customNotification' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
