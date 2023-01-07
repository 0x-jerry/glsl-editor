<script lang="ts" setup>
import { StateField, Text } from '@codemirror/state'
import { useEditor } from './hooks/useEditor'

export interface CodeEditorProps {
  modelValue?: Record<string, string>
  current?: string
}

const props = defineProps<CodeEditorProps>()

const emit = defineEmits<{
  (type: 'update:modelValue', files: Record<string, string>): void
  (type: 'update:current', filename: string): void
}>()

const editorEl = ref<HTMLElement>()

const files = useVModel(props, 'modelValue', emit, {
  defaultValue: {
    untitled: '',
  },
  passive: true,
})

const currentFilename = useVModel(props, 'current', emit, {
  passive: true,
  defaultValue: Object.keys(files.value!)[0],
})

const currentFile = computed({
  get() {
    return files.value![currentFilename.value!] || ''
  },
  set(v: string) {
    files.value![currentFilename.value!] = v
  },
})

const editor = useEditor(editorEl, {
  extensions: [
    StateField.define<void>({
      create() {},
      update(_, tr) {
        if (!tr.docChanged) {
          return
        }

        const text = tr.newDoc.toString()

        currentFile.value = text
      },
    }),
  ],
})

function newDoc() {
  const names = Object.keys(files.value!)
  let validName = 'untitled'
  let idx = 1

  while (names.includes(validName)) {
    validName = 'untitled ' + idx++
  }

  files.value = {
    ...files.value,
    [validName]: '',
  }
}

function switchDoc(name: string) {
  if (currentFilename.value === name) {
    return
  }

  currentFilename.value = name

  editor.dispatch({
    changes: {
      from: 0,
      to: editor.state.doc.length,
      insert: currentFile.value,
    },
  })
}
</script>

<template>
  <div class="v-editor flex flex-col w-full h-full">
    <div class="editor-header h-30px flex border-(0 b solid gray-3)" @dblclick.self="newDoc">
      <span
        class="filename max-w-100px truncate text-gray-5 px-2 flex items-center border-(0 r solid gray-3) cursor-default select-none"
        :class="{
          'bg-blue-1': currentFilename === item,
        }"
        @click="switchDoc(item)"
        v-for="item in Object.keys(files!)"
      >
        {{ item }}
      </span>
    </div>
    <div ref="editorEl" class="flex-1 h-0"></div>
  </div>
</template>

<style lang="less">
.v-editor {
  .cm-editor {
    height: 100%;
  }
}
</style>
