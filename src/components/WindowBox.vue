<script lang="ts" setup>
const props = defineProps<{
  title?: string
}>()

const overlay = ref<HTMLElement>()

const pos = useLocalStorage(`window-box-${props.title}`, { x: 0, y: 0 })

useDraggable(overlay, {
  onMove(_, e) {
    const p = pos.value
    p.x -= e.movementX
    p.y += e.movementY
  },
})

const posStyle = computed(() => {
  const p = pos.value

  return {
    right: `${p.x}px`,
    top: `${p.y}px`,
  }
})
</script>

<template>
  <div class="flex flex-col absolute border-(1 solid gray-3)" :style="posStyle">
    <div
      class="titlebar cursor-move h-30px border-(0 b solid gray-3) bg-white flex px-2 items-center select-none flex"
      ref="overlay"
    >
      <span class="flex-1 w-0">
        {{ title || 'untitled' }}
      </span>
      <span class="action flex gap-2 items-center" v-if="$slots.action">
        <slot name="action"></slot>
      </span>
    </div>
    <div class="flex-1">
      <slot></slot>
    </div>
  </div>
</template>

<style lang="less"></style>
