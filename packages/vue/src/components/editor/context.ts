import type { ComputedRef, InjectionKey } from 'vue'

import type { EditorHandlers } from './Editor.types'

/** The handlers an `Editor` shares with the toolbars rendered inside it. */
export const editorHandlersKey: InjectionKey<ComputedRef<EditorHandlers>> =
  Symbol('hareui-editor-handlers')
