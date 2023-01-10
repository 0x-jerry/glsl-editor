import { EditorState, Extension } from '@codemirror/state'
import { Ref } from 'vue'
import { EditorView, basicSetup } from 'codemirror'
import { keymap } from '@codemirror/view'
import { indentWithTab } from '@codemirror/commands'

export interface UseEditorOption {
  extensions?: Extension[]
}

export function useEditor(el: Ref<HTMLElement | undefined>, opt?: UseEditorOption) {
  const state = EditorState.create({
    extensions: [basicSetup, keymap.of([indentWithTab]), ...(opt?.extensions || [])],
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
