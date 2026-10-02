import type { PropType } from 'vue'
import type { Color } from 'reka-ui'
import { colorToString, injectColorFieldRootContext, isValidColor, parseColor } from 'reka-ui'
import { defineComponent, watch } from 'vue'

/**
 * Internal renderless child of Reka's `ColorFieldRoot`.
 *
 * Hex case: Reka formats hex values in lowercase. React Aria's ColorField shows `color.toString('hex')`, which is
 * uppercase. Reka only updates `color` on commit, so text that equals the formatted current colour is Reka's own
 * output (initial value, commit, steppers, external updates) and is uppercased. Mid-edit text differs from it and
 * stays as typed.
 *
 * Empty value: React Aria's ColorField can hold `null` and then shows an empty input. Reka always holds a colour
 * (`#000000` when none is given), so while `isEmpty()` is true the displayed text is blanked except while the user is
 * typing, and a commit that doesn't produce a colour keeps it blank. Committing blank text in a filled field calls
 * `onClear` (React Aria commits `null` there). Committing a colour equal to Reka's hidden one emits no Reka update, so
 * `onFill` is called instead. The hidden form input still carries Reka's `#000000`.
 */
export default defineComponent({
  name: 'ColorFieldHexCase',
  props: {
    isEmpty: { type: Function as PropType<() => boolean>, required: true },
    onClear: { type: Function as PropType<() => void>, required: true },
    onFill: { type: Function as PropType<(color: Color) => void>, required: true },
  },
  setup(props) {
    const ctx = injectColorFieldRootContext()
    // True between the user's first keystroke and the next commit
    let typing = false
    const updateValue = ctx.updateValue
    ctx.updateValue = (value: string) => {
      typing = true
      updateValue(value)
    }

    watch([ctx.inputValue, ctx.color, () => props.isEmpty()], ([value, color, empty]) => {
      if (empty) {
        if (value !== '' && !typing)
          ctx.inputValue.value = ''
        return
      }
      if (ctx.channel.value || value !== colorToString(color, 'hex'))
        return
      const upper = value.toUpperCase()
      if (upper !== value)
        ctx.inputValue.value = upper
    }, { immediate: true, flush: 'sync' })

    const commit = ctx.commit
    ctx.commit = () => {
      typing = false
      const text = ctx.inputValue.value.trim()
      const editable = !ctx.readonly.value && !ctx.disabled.value
      if (text === '' && !props.isEmpty() && editable) {
        props.onClear()
        ctx.inputValue.value = ''
        return
      }
      const before = colorToString(ctx.color.value, 'hex')
      commit()
      if (!props.isEmpty())
        return
      if (editable && !ctx.channel.value && isValidColor(text) && colorToString(parseColor(text), 'hex') === before) {
        props.onFill(ctx.color.value)
        ctx.inputValue.value = ctx.inputValue.value.toUpperCase()
        return
      }
      ctx.inputValue.value = ''
    }

    return () => null
  },
})
