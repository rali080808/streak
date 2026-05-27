// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts";

console.log("Hello from Fixed Scheduled notifications");
const ONESIGNAL_APP_ID = Deno.env.get("APP_ID")!;
const ONE_SIGNAL_API_KEY = Deno.env.get("API_KEY")!;

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

    const morningNotification = {
      heading: "⏰ Time to Clock In!",
      message: "Start your work on time and have a great day!",
      image:
        "https://media.onesignal.com/automated_push_templates/reminder_template.png",
      time: "9:30AM",
    };

    const eveningNotification = {
      heading: "🏁 Time to Clock Out!",
      message: "Wrap up your day and enjoy your evening!",
      image:
        "https://media.onesignal.com/automated_push_templates/reminder_template.png",
      time: "6:30PM",
    };

    const sendNotification = async (notification: any) => {
      const response = await fetch(
        "https://onesignal.com/api/v1/notifications",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Key ${ONE_SIGNAL_API_KEY}`,
          },
          body: JSON.stringify({
            app_id: ONESIGNAL_APP_ID,
            included_segments: ["All"],
            headings: { en: notification.heading },
            contents: { en: notification.message },
            small_icon: "ic_stat_icona",
            big_picture: notification.image,
            android_accent_color: "FF00AAFF",
            delayed_option: "timezone",
            delivery_time_of_day: notification.time,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`OneSignal API error: ${response.statusText}`);
      }

      return response.json();
    };

    const morningResult = await sendNotification(morningNotification);
    const eveningResult = await sendNotification(eveningNotification);

    return new Response(
      JSON.stringify({
        message: "Notifications scheduled successfully",
        morningResult,
        eveningResult,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error scheduling notifications:", error);
    return new Response(
      JSON.stringify({ error: "Failed to schedule notifications" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
});

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/fixedScheduleNotification' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
