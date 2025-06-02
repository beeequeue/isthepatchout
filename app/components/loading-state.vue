<template>
  <div class="relative flex flex-col items-center">
    <div class="whitespace-nowrap text-4xl font-bold opacity-20">Is the Patch Out?</div>

    <div class="animate-intensifies blur-1 text-4xl filter">༼ つ ◕_◕ ༽つ</div>
  </div>
</template>

<style>
@keyframes intensifies {
  0% {
    transform: translate(0, 0);
  }
  20% {
    transform: translate(-4px, -4px);
  }
  40% {
    transform: translate(-4px, 4px);
  }
  60% {
    transform: translate(4px, 4px);
  }
  80% {
    transform: translate(-4px, 4px);
  }
  100% {
    transform: translate(0, 0);
  }
}

.animate-intensifies {
  animation: intensifies 50ms linear forwards infinite;
}
</style>
