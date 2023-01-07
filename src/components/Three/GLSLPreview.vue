<script lang="ts" setup>
import * as THREE from 'three'
import { useThree } from './hooks/useThree'

const props = defineProps<{
  uniforms?: Record<string, any>
  vertex: string
  fragment: string
  autoUpdate?: boolean
  autoRotate?: boolean
}>()

const root = ref<HTMLElement>()

const { camera, scene, resize, tracker } = useThree(root)

const containerSize = useElementSize(root)

camera.position.z = 1.5
camera.position.y = 1
camera.position.x = 1

watch(() => containerSize, resize, { deep: true })

let material: THREE.Material = new THREE.MeshStandardMaterial()
tracker.add(() => material.dispose())
const geometry = new THREE.BoxGeometry(0.75, 0.75, 0.75)
tracker.add(geometry)
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)

mesh.onBeforeRender = () => {
  if (!props.autoRotate) return

  mesh.rotateY(0.015)
}

camera.lookAt(mesh.position)

// light
const light = new THREE.AmbientLight(0x404040) // soft white light
tracker.add(light)
scene.add(light)

watch(
  () => [props.fragment, props.vertex],
  () => {
    if (!props.autoUpdate) return
    updateMaterial()
  },
  {
    immediate: true,
  },
)

function updateMaterial() {
  const newShaderMaterial = new THREE.ShaderMaterial({
    vertexShader: props.vertex,
    fragmentShader: props.fragment,
    uniforms: props.uniforms || {},
  })

  material.dispose()
  material = newShaderMaterial

  mesh.material = newShaderMaterial
}

defineExpose({
  updateMaterial,
})
</script>

<template>
  <div class="v-three w-full h-full relative overflow-hidden" ref="root"></div>
</template>

<style lang="less"></style>
