<script lang="ts" setup>
import { StateField } from '@codemirror/state'
import { cpp } from '@codemirror/lang-cpp'
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

const cursorPos = reactive({
  x: 0,
  y: 0,
})

const cursorPosStyle = computed(() => {
  return {
    left: cursorPos.x + 'px',
    top: cursorPos.y + 'px',
  }
})

const popover = reactive({
  visible: false,
})

const currentFileWatcher = watchPausable(currentFile, switchDoc)

const editor = useEditor(editorEl, {
  extensions: [
    cpp(),
    StateField.define<void>({
      create() {},
      update(_, tr) {
        if (!tr.docChanged) {
          if (tr.selection) {
            const rect = editor.coordsAtPos(tr.selection.main.head)
            if (rect) {
              cursorPos.x = rect.left
              cursorPos.y = rect.top
              // popover.visible = true
            }
          }

          return
        }

        const text = tr.newDoc.toString()

        currentFileWatcher.pause()

        currentFile.value = text

        currentFileWatcher.resume()
      },
    }),
  ],
})

switchDoc()

function switchDoc() {
  const isTheSame = currentFile.value === editor.state.doc.toString()

  if (isTheSame) return

  editor.dispatch({
    changes: {
      from: 0,
      to: editor.state.doc.length,
      insert: currentFile.value,
    },
  })
}

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
</script>

<template>
  <div class="v-editor flex flex-col w-full h-full">
    <div class="editor-header h-30px flex border-(0 b solid gray-3)">
      <span
        class="filename max-w-100px truncate text-gray-5 px-2 flex items-center border-(0 r solid gray-3) cursor-default select-none"
        :class="{
          'bg-blue-1': currentFilename === item,
        }"
        @click="currentFilename = item"
        v-for="item in Object.keys(files!)"
      >
        {{ item }}
      </span>
    </div>
    <div ref="editorEl" class="flex-1 h-0"></div>
    <k-popover
      auto-update
      placement="top"
      v-model="popover.visible"
      class="fixed"
      :style="cursorPosStyle"
    >
      <div>hello</div>
    </k-popover>
  </div>
</template>

<style lang="less">
.v-editor {
  .cm-editor {
    height: 100%;
    outline: none;
  }
}
</style>
