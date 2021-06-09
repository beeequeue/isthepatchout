<template>
  <div class="flex items-center text-4xl select-none animate-intensifies filter blur-1">
    ༼ つ ◕_◕ ༽つ
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
