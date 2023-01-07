import { Ref } from 'vue'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { Tracker } from '../Tracker'

export interface UseThreeOption {}

export function useThree(ele: Ref<HTMLElement | undefined>, opt?: UseThreeOption) {
  const scene = new THREE.Scene()

  const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000)
  const renderer = new THREE.WebGLRenderer()
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.domElement.style.position = 'absolute'
  const orbitControls = new OrbitControls(camera, renderer.domElement)
  const tracker = new Tracker()

  tracker.add(renderer, orbitControls)

  onMounted(() => {
    const el = ele.value
    if (!el) return

    resize()
    el.appendChild(renderer.domElement)
  })

  onUnmounted(() => {
    tracker.dispose()
    renderer.domElement.remove()
  })

  function resize() {
    const el = ele.value
    if (!el) return

    renderer.setSize(el.clientWidth, el.clientHeight)
    camera.aspect = el.clientWidth / el.clientHeight
    camera.updateMatrix()
  }

  useRafFn(() => {
    renderer.render(scene, camera)
  })

  return {
    renderer,
    scene,
    camera,
    tracker,
    orbitControls,
    resize,
  }
}
