<script lang="ts" setup>
const overlay = ref<HTMLElement>()

const pos = reactive({
  x: 0,
  y: 0,
})

useDraggable(overlay, {
  onMove(_, e) {
    pos.x -= e.movementX
    pos.y += e.movementY
  },
})

const posStyle = computed(() => {
  return {
    right: `${pos.x}px`,
    top: `${pos.y}px`,
  }
})
</script>

<template>
  <div class="flex w-screen h-screen">
    <CodeEditor class="flex-1 border-(0 r gray-3 solid)"></CodeEditor>
    <div ref="overlay" class="absolute w-400px h-400px z-10 cursor-move" :style="posStyle">
      <Three></Three>
    </div>
  </div>
</template>

<style lang="less"></style>
