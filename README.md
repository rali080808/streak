# Streak

A habit / goal tracking web app. Add goals with a deadline, tick them off as you
finish them, and keep a daily streak alive for as long as you never let a goal
run past its due date. A push notification nudges you once a day.

React + Vite, Supabase (Postgres, auth, edge functions), OneSignal for push,
hosted on Netlify.

Working today: signup/login, adding and completing goals, the completed list,
streak calculation, daily push. Friend comparisons and a leaderboard are still
just ideas.

## Getting started

```bash
npm install
npm run dev
```

Needs a `.env.local` in the project root:

```
VITE_SUPABASE_URL=https://<your-project>.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=<supabase publishable / anon key>
VITE_ONESIGNAL_APP_ID=<onesignal app id>
```

`dev` / `build` / `preview` / `lint`. The dev server binds to `0.0.0.0` so you
can open it from your phone. Push prompts only appear on the deployed HTTPS
site — OneSignal is initialised with `allowLocalhostAsSecureOrigin: false`.

## How it works

| Path | Page | Purpose |
| --- | --- | --- |
| `/` | `StreakPage` | Current streak and last update date |
| `/addgoal` | `AddGoal` | Open goals, form to add one, tap a goal to complete it |
| `/completed` | `Completed` | Finished goals, newest first |
| `/login` | `Login` | One form toggling between sign up and log in |

Every page renders `Login` instead of itself when you are not signed in.
[`src/DataProvider.jsx`](src/DataProvider.jsx) holds all shared state in one
context: session, goals, streak, `fetchGoals()`.

**Auth.** Username + password, no real email — the username becomes
`<username>@fakeemail.com` before it reaches Supabase auth, and the display name
lives in user metadata. Signing up also inserts a row into `profiles`.

**Streak rules**, computed once per day on load in
[`src/pages/StreakPage.jsx`](src/pages/StreakPage.jsx), comparing dates at local
midnight:

- already updated today → nothing changes
- nothing overdue, last update was yesterday → streak + 1
- nothing overdue, older than that → streak resets to 1
- any goal past its deadline → streak drops to 0

**Tables.** `profiles` (`user_id`, `streak`, `lastStreakUpdate`, `updateDate`)
and `goals` (`id`, `user_id`, `name`, `endDate`, `importance` low/medium/high,
`completed`, `completeDate`).

## Notifications

OneSignal delivers the push, but none of the scheduling is its own — a cron-job.org
job pings a Supabase edge function on a timer:

**cron-job.org -> edge function -> OneSignal REST API -> push**

Three functions in [`supabase/functions/`](supabase/functions/):

- `customScheduledNotification` — **the live one**, called by the cron job for
  the 9 AM reminder. Answers GET (so a plain ping works) and POST, with an
  optional `{ heading, message, segment }` body.
- `customNotification` — manual one-off, POST `{ title, message }`.
- `fixedScheduleNotification` — earlier attempt that let OneSignal do the timing
  (`delayed_option: "timezone"`). Superseded, kept for reference.

The live one reads `ONESIGNAL_APP_ID` and `ONESIGNAL_REST_API_KEY` from Supabase
secrets; the older two read `APP_ID` / `API_KEY`.

```bash
npx supabase secrets set ONESIGNAL_APP_ID="..."
npx supabase functions deploy customScheduledNotification
```

## Deploying

Work on `local-dev`, merge into `production` — Netlify watches `production` and
deploys on push.
