<template>
  <client-only>
    <slot />

    <template #fallback>
      <span v-if="false" />
    </template>
  </client-only>
</template>

<script></script>
