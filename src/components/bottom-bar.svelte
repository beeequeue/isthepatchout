<script lang="ts">
  import DiscordNotifications from "#/components/discord.svelte"
  import Notifications from "#/components/notifications.svelte"
</script>

<div class="fixed bottom-5 flex-col items-center gap-5">
  <DiscordNotifications />
  <Notifications />
</div>
