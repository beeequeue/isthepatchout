<script lang="ts">
  import { page } from "$app/state"

  const searchParams = new URLSearchParams({
    scope: "webhook.incoming",
    response_type: "code",
    client_id: "945801741864165427",
    redirect_uri: encodeURI(`${page.url.protocol}//${page.url.host}/callback/discord`),
  })
  const url = new URL(`https://discord.com/api/oauth2/authorize?${searchParams.toString()}`)
</script>

<a
  href={url.toString()}
  class="bg-trans b-0 decoration-none text-#eee flex cursor-pointer items-center rounded-xl px-3 font-sans text-lg select-auto"
>
  <i class="i-simple-icons:discord color-white mr-2 size-6"></i>

  Get notified in Discord
</a>
