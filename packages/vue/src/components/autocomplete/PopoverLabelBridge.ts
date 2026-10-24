import { injectPopoverRootContext } from 'reka-ui'
import { defineComponent, watchEffect } from 'vue'

/**
 * Renderless: Reka names the popover dialog after its PopoverTrigger (`aria-labelledby` = `triggerId`, overriding
 * ours). Autocomplete's trigger is an anchor, so this hands Reka the field's label instead, as RAC Select labels its
 * popover.
 */
export default defineComponent({
  name: 'PopoverLabelBridge',
  props: { labelledBy: { type: String, default: undefined } },
  setup(props) {
    const popover = injectPopoverRootContext()

    watchEffect(() => {
      popover.triggerId = props.labelledBy ?? ''
    })

    return () => null
  },
})
