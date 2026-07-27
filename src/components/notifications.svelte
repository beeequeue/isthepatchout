<script lang="ts">
  import { usePushNotifications } from "#/hooks/notifications.svelte.ts"
  import { browser } from "$app/env"

  const notifications = usePushNotifications()

  const toggleSubscribed = () => {
    !notifications.state.subscribed ? notifications.enable() : notifications.disable()
  }

  // ... or if it's being rendered on the server
  const supportsNotifications = $derived(!browser || notifications.supported)
</script>

<button
  onclick={toggleSubscribed}
  class="bg-trans b-0 text-#eee flex cursor-pointer items-center rounded-xl px-3 font-sans text-lg select-auto"
  class:grayed-out={!supportsNotifications}
  class:pointer-events-none={!supportsNotifications}
>
  <i
    class="animate-infinite animate-slow color-white mr-2 size-6 transition-all"
    class:animate-heartBeat={notifications.state.subscribing}
    class:fill-gray-400={notifications.state.subscribed}
    class:shine={notifications.state.subscribed}
    class:i-lucide:bell={!notifications.state.subscribed}
    class:i-lucide:bell-off={notifications.state.subscribed}
  ></i>

  {#if supportsNotifications}
    {!notifications.state.subscribed ? "Enable" : "Disable"} push notifications
  {:else}
    Device doesn't support notifications.
  {/if}
</button>
