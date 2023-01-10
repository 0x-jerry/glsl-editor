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

const { camera, scene, resize, tracker, render } = useThree(root)

const containerSize = useElementSize(root)

camera.position.z = 1.5
camera.position.y = 1
camera.position.x = 1

watch(() => containerSize, resize, { deep: true })

let material: THREE.ShaderMaterial | undefined
tracker.add(() => material?.dispose())
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
  const uniforms: Record<string, THREE.IUniform> = {
    mouse: {
      value: { x: 0, y: 0 },
    },
    resolution: {
      value: {
        x: root.value?.clientWidth || 1,
        y: root.value?.clientHeight || 1,
      },
    },
    time: {
      value: performance.now() / 1000,
    },
  }

  const newShaderMaterial = new THREE.ShaderMaterial({
    vertexShader: props.vertex,
    fragmentShader: props.fragment,
    uniforms: uniforms,
  })

  newShaderMaterial.needsUpdate = true
  newShaderMaterial.uniformsNeedUpdate = true

  material?.dispose()
  material = newShaderMaterial

  mesh.material = newShaderMaterial
}

const pos = useMouseInElement(root)

useRafFn(() => {
  if (!material) return
  if (!root.value) return
  if (!material) return

  const resolution = {
    x: root.value.clientWidth || 1,
    y: root.value.clientHeight || 1,
  }

  material.uniforms.resolution = { value: resolution }

  if (!pos.isOutside.value) {
    const mouse = {
      x: pos.elementX.value / resolution.x,
      y: pos.elementY.value / resolution.y,
    }

    material.uniforms.mouse = {
      value: mouse,
    }
  }

  material.uniforms.time = {
    value: performance.now() / 1000,
  }

  render()
})

defineExpose({
  updateMaterial,
})
</script>

<template>
  <div class="v-three w-full h-full relative overflow-hidden" ref="root"></div>
</template>

<style lang="less"></style>
