<script lang="ts" setup>
import { useRouteQuery } from '@0x-jerry/vue-kit'

const defaultValues = {
  vertex: `
varying vec2 vUv;

void main()
{
  vUv = uv;
  vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
  gl_Position = projectionMatrix * mvPosition;
}
`.trim(),
  fragment: `
uniform float time;

varying vec2 vUv;

void main( void ) {

  vec2 position = - 1.0 + 2.0 * vUv;

  float red = abs( sin( position.x * position.y + time / 5.0 ) );
  float green = abs( sin( position.x * position.y + time / 4.0 ) );
  float blue = abs( sin( position.x * position.y + time / 3.0 ) );
  gl_FragColor = vec4( red, green, blue, 1.0 );

}
  `.trim(),
}

const filename = useRouteQuery('filename', Object.keys(defaultValues)[0])

const editor = useLocalStorage('editor-config', {
  files: defaultValues,
  autoRotate: true,
})
</script>

<template>
  <div class="flex w-screen h-screen">
    <CodeEditor
      v-model="editor.files"
      v-model:current="filename"
      class="flex-1 border-(0 r gray-3 solid)"
    ></CodeEditor>
    <WindowBox title="GLSL Preview" class="w-400px h-400px z-10">
      <GLSLPreview
        auto-update
        :vertex="editor.files.vertex"
        :fragment="editor.files.fragment"
        :auto-rotate="editor.autoRotate"
      />
      <template #action>
        <span class="cursor-pointer" @click="editor.autoRotate = !editor.autoRotate">
          Auto Rotate: {{ editor.autoRotate ? 'ON' : 'OFF' }}
        </span>
      </template>
    </WindowBox>
  </div>
</template>

<style lang="less"></style>
