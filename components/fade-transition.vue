<template>
  <transition
    mode="out-in"
    class="duration-500 transition-fastest"
    enter-active-class="ease-out"
    leave-active-class="ease-in"
    enter-from-class="opacity-0"
    leave-to-class="opacity-0"
  >
    <slot />
  </transition>
</template>
