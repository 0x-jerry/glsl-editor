import { EditorState, Extension } from '@codemirror/state'
import { Ref } from 'vue'
import { EditorView, basicSetup } from 'codemirror'

export interface UseEditorOption {
  extensions?: Extension[]
}

export function useEditor(el: Ref<HTMLElement | undefined>, opt?: UseEditorOption) {
  const state = EditorState.create({
    extensions: [basicSetup, ...(opt?.extensions || [])],
  })

  const editor = new EditorView({
    state,
  })

  onMounted(() => {
    el.value?.appendChild(editor.dom)
    editor.dom
  })

  onUnmounted(() => {
    editor.destroy()
  })

  return editor
}
