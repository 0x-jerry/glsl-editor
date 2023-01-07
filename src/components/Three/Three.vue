<script lang="ts" setup>
import { useThree } from './hooks/useThree'

const root = ref<HTMLElement>()

const { renderer, camera, scene, resize } = useThree(root)

const containerSize = useElementSize(root)

watch(() => containerSize, resize, { deep: true })
</script>

<template>
  <div class="v-three w-full h-full relative overflow-hidden" ref="root"></div>
</template>

<style lang="less"></style>
