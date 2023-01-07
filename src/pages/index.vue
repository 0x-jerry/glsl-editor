<script lang="ts" setup>
const files = reactive({
  vertex: `
varying vec2 vUv;

void main()
{
  vUv = uv;
  vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
  gl_Position = projectionMatrix * mvPosition;
}
`,
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
  `,
})
</script>

<template>
  <div class="flex w-screen h-screen">
    <CodeEditor v-model="files" class="flex-1 border-(0 r gray-3 solid)"></CodeEditor>
    <WindowBox class="w-400px h-400px z-10">
      <Three :vertex="files.vertex" :fragment="files.fragment"></Three>
    </WindowBox>
  </div>
</template>

<style lang="less"></style>
