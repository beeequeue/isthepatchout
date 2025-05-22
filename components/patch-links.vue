<template>
  <ul class="mt-2 select-all">
    <li v-for="({ url, name }, i) in prettyLinks" :id="name.toLowerCase()" :key="url">
      <a :href="url" target="_blank" rel="noopener">
        <div
          class="color-primary-400 relative mb-1 overflow-hidden px-2 py-1 text-center text-3xl"
        >
          <span>{{ name }}</span>

          <span
            class="border-primary-400 animate-link absolute bottom-0 left-0 right-0 translate-x-full transform border-b-2"
            :class="`!animate-delay-${250 * i}ms`"
          />
        </div>
      </a>
    </li>
  </ul>
</template>

<script lang="ts" setup>
const props = defineProps<{ links: string[] }>()

const prettifyName = (str: string) =>
  `${str[0].toUpperCase()}${str.slice(1)}`.replaceAll("-_", " ")

const getLinkName = (link: string): string => {
  if (/dota2\.com\/patches/.test(link)) return "Patch notes"

  const { groups } = /dota2\.com\/(?<patchName>\w+)/.exec(link)!
  if (groups?.patchName != null) return prettifyName(groups.patchName)

  return link
}

const prettyLinks = computed(() =>
  props.links?.map((link) => ({
    name: getLinkName(link),
    url: link,
  })),
)
</script>

<style scoped>
@keyframes link {
  0% {
    transform: translateX(-100%);
  }
  80% {
    transform: translateX(101%);
  }
  100% {
    transform: translateX(101%);
  }
}

.animate-link {
  animation: link 1.5s infinite;
}
</style>
