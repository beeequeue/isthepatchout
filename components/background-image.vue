<template>
  <div id="background" />
</template>

<style scoped>
#background {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  background-image: url("/background.svg");
  opacity: 0;
  transition: opacity 500ms;
  transition-delay: 250ms;
}
</style>
