import { injectListboxRootContext } from 'reka-ui'
import { defineComponent } from 'vue'

/** Reka's listbox root context, as handed over by `ListboxBridge`. */
// oxlint-disable-next-line typescript/consistent-type-definitions -- an interface is emitted by name in .d.ts; the alias would inline Reka's context and reference @vueuse/shared, which consumers can't resolve
export interface ListboxContext extends NonNullable<ReturnType<typeof injectListboxRootContext>> {}

/**
 * Renderless: hands Reka's listbox context to Autocomplete, which drives the virtual focus from the search input.
 */
export default defineComponent({
  name: 'ListboxBridge',
  emits: { ready: (listbox: ListboxContext) => listbox !== undefined },
  setup(_, { emit }) {
    const listbox = injectListboxRootContext()!

    // RAC Autocomplete: focus stays in the search field (or on the popover); options get virtual focus
    listbox.focusable.value = false
    emit('ready', listbox)

    return () => null
  },
})
