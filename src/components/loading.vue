<template>
  <div class="flex flex-col items-center relative">
    <div class="text-4xl font-bold whitespace-nowrap opacity-20">Is the Patch Out?</div>

    <div class="text-4xl animate-intensifies filter blur-1">༼ つ ◕_◕ ༽つ</div>
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
