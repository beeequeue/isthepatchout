# isthepatchout

A website that automatically notifies when a new patch is released.

It also supports notifications via the [Web Push API](https://developer.mozilla.org/en-US/docs/Web/API/Push_API) and [Discord Webhooks](https://support.discord.com/hc/en-us/articles/228383668-Intro-to-Webhooks). Notifications are sent via the [`notifications`](https://github.com/isthepatchout/notifications) service.

This is accomplished by using [Supabase](https://supabase.com) and their real-time services to watch the `patches` table for new patches, and then doing what needs to be done based on it!

## Removing notifications

<details>
<summary>Discord</summary>

1. Go to the channel's settings <br/> ![image](https://user-images.githubusercontent.com/472500/185675016-6410de81-32fe-4bb4-95e9-269a39c91620.png)
1. Go to the integrations <br/> ![image](https://user-images.githubusercontent.com/472500/185675105-8226e486-8fdb-48a9-b3bf-3abb2ca1d20b.png)
1. Delete the `isthepatchout` integration <br/> ![image](https://user-images.githubusercontent.com/472500/185675191-92833356-adcd-4287-a17e-c3f040c738e0.png)

</details>

<details>
<summary>Web Push</summary>

Click the button that does it

![image](https://user-images.githubusercontent.com/472500/185674949-e6dc073f-1c75-46de-ab6d-67f136c6f763.png)

or...

Deny the website access to notifications - google it!

</details>

## Privacy & GDPR

No PII data is stored. It only stores the data needed to send notifications, which is either:

- A Discord Webhook URL (e.g. `https://discord.com/api/webhooks/{random number}/{random string}`)
- Web Push API URL (e.g. `https://fcm.googleapis.com/fcm/send/{random string}`)

as well as which patch number was last sent to the recipient.

## Architecture

```mermaid
graph TD
worker(Cloudflare Worker)
vercel(Vercel)
supa(Supabase)
browser([Browser])
notif(fa:fa-arrow-up-right-from-square notifications service)
discord([Discord Channels])

worker -- Triggers checks on a cron schedule --> vercel
supa -- patch data, real-time updates --> browser
vercel -- hosts SPA, lambda functions --> browser
vercel -- updates patch, push notif data --> supa
supa -- real-time updates --> notif
notif -- push notifications --> browser
notif -- webhooks --> discord

click notif href "https://github.com/isthepatchout/notifications" "Repo"

style supa stroke:#1d9065
style worker stroke:orange
```

## Development

Requires Node ^16, Supabase CLI, Vercel CLI

### Setup

1. Install dependencies: `$ pnpm i`
1. Set up a local supabase instance: `$ supabase start`
1. Set up the `.env` file
   1. Create the file: `$ cp .env.example .env`
   1. Insert the values from starting the supabase instance, etc.
1. Install the Vercel CLI: `$ npm i -g vercel`
1. Run dev server: `$ vercel dev`

_Optional unless you need to work with realtime:_

Execute the following SQL query in the database:

```sql
ALTER PUBLICATION supabase_realtime ADD TABLE patches;
```
