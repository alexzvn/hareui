import { injectPopoverRootContext } from 'reka-ui'
import { defineComponent, watchEffect } from 'vue'

/**
 * Renderless: names the picker's popover dialog with `labelledby` (React Aria's `useDatePicker` dialog
 * `aria-labelledby`: the trigger id, then the field label id). Reka's `PopoverContent` labels the dialog with the
 * popover root's `triggerId` and ignores an `aria-labelledby` passed to it; left to Reka, that id is one it generates
 * for the trigger, which dangles because the trigger button keeps its own explicit `id`. The only other reader of
 * `triggerId` is `PopoverTrigger`'s `id`, which the button's own `id` overrides. Render it before the `PopoverTrigger`,
 * whose setup only generates an id when none is set.
 */
export default defineComponent({
  name: 'PopoverLabelledBy',
  props: { labelledby: { type: String, required: true } },
  setup(props) {
    const context = injectPopoverRootContext()
    watchEffect(() => {
      context.triggerId = props.labelledby
    })

    return () => null
  },
})
