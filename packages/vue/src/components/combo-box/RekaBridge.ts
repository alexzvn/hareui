import { injectComboboxRootContext, injectListboxRootContext } from 'reka-ui'
import { defineComponent } from 'vue'

import type { ComboboxContext, ListboxContext } from './ComboBox.types'

// Hands Reka's listbox / combobox contexts to ComboBox, which drives highlight and focus itself
export const RekaBridge = defineComponent({
  emits: {
    ready: (listbox: ListboxContext, combobox: ComboboxContext) =>
      listbox !== undefined && combobox !== undefined,
  },
  setup(_, { emit }) {
    emit('ready', injectListboxRootContext()!, injectComboboxRootContext()!)

    return () => null
  },
})
