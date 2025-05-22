<template>
  <div id="background" />
</template>

<style scoped>
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

#background {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  background-image: url("/background.svg");
  opacity: 0;
  animation: fadeIn 1500ms;
  animation-delay: 175ms;
  animation-fill-mode: forwards;
}
</style>
