<script lang="ts" setup>
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

const files = useLocalStorage('editor-files', defaultValues)

const switches = reactive({
  autoRotate: true,
})
</script>

<template>
  <div class="flex w-screen h-screen">
    <CodeEditor v-model="files" class="flex-1 border-(0 r gray-3 solid)"></CodeEditor>
    <WindowBox title="GLSL Preview" class="w-400px h-400px z-10">
      <GLSLPreview
        auto-update
        :vertex="files.vertex"
        :fragment="files.fragment"
        :auto-rotate="switches.autoRotate"
      />
      <template #action>
        <span class="cursor-pointer" @click="switches.autoRotate = !switches.autoRotate">
          Auto Rotate: {{ switches.autoRotate ? 'ON' : 'OFF' }}
        </span>
      </template>
    </WindowBox>
  </div>
</template>

<style lang="less"></style>
