<script lang="ts">
  import "uno.css"
  import "../fonts.css"

  const { children } = $props()
</script>

<svelte:head>
  <link rel="me" href="https://bsky.app/profile/haglund.dev" />

  <style>
    html {
      background-color: #0c0c0c;
    }

    html,
    body {
      width: 100%;
      height: 100%;
      margin: 0;
      padding: 0;
      overflow: hidden;
    }

    body {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      background-image: url("/background.svg");
    }

    #app {
      color: #eee;
      text-shadow:
        3px 3px 6px #000,
        0 0 5px #000;
    }

    * {
      user-select: none;
    }
  </style>
</svelte:head>

{@render children()}
