<template>
  <ul class="mt-2 select-all">
    <li v-for="({ url, name }, i) in prettyLinks" :id="name.toLowerCase()" :key="url">
      <a :href="url" target="_blank" rel="noopener">
        <div
          class="relative py-1 px-2 mb-1 text-3xl text-center color-primary-400 overflow-hidden"
        >
          <span>
            {{ name }}
          </span>

          <span
            class="absolute left-0 bottom-0 right-0 transform translate-x-full border-b-2 border-primary-400 animate-link"
            :class="`!animate-delay-${500 * i}ms`"
          />
        </div>
      </a>
    </li>
  </ul>
</template>

<script lang="ts" setup>
import { computed, defineProps } from "vue"

const props = defineProps<{ links: string[] }>()

const prettifyName = (str: string) =>
  `${str[0].toUpperCase()}${str.slice(1)}`.replace(/-_/g, " ")

const getLinkName = (link: string): string => {
  if (/dota2\.com\/patches/.test(link)) return "Patch notes"

  const [, patchName] = /dota2\.com\/(\w+)/.exec(link) ?? []
  if (patchName != null) return prettifyName(patchName)

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
    transform: translateX(100%);
  }
  100% {
    transform: translateX(100%);
  }
}

.animate-link {
  animation: link 2s infinite;
}
</style>
