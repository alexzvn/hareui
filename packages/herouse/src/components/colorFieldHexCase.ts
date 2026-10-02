import { colorToString, injectColorFieldRootContext } from 'reka-ui'
import { defineComponent, watch } from 'vue'

/**
 * Internal renderless child of Reka's `ColorFieldRoot`. Reka formats hex values in lowercase. React Aria's ColorField
 * shows `color.toString('hex')`, which is uppercase. Reka only updates `color` on commit, so text that equals the
 * formatted current colour is Reka's own output (initial value, commit, steppers, external updates) and is
 * uppercased. Mid-edit text differs from it and stays as typed.
 */
export default defineComponent({
  name: 'ColorFieldHexCase',
  setup() {
    const ctx = injectColorFieldRootContext()
    watch([ctx.inputValue, ctx.color], ([value, color]) => {
      if (ctx.channel.value || value !== colorToString(color, 'hex'))
        return
      const upper = value.toUpperCase()
      if (upper !== value)
        ctx.inputValue.value = upper
    }, { immediate: true, flush: 'sync' })
    return () => null
  },
})
