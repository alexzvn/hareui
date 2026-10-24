import type { Color, ColorChannel } from 'reka-ui'
import {
  colorToString,
  getChannelRange,
  getChannelValue,
  injectColorFieldRootContext,
  isValidColor,
  parseColor,
  setChannelValue,
  useLocale,
} from 'reka-ui'
import type { PropType } from 'vue'
import { computed, defineComponent, h, shallowRef, watch } from 'vue'

const PERCENT_CHANNELS = new Set<ColorChannel>(['saturation', 'lightness', 'brightness', 'alpha'])

/**
 * Internal child of Reka's `ColorFieldRoot` that patches its context to behave like React Aria's ColorField.
 *
 * Hex case: Reka formats hex values in lowercase. React Aria's ColorField shows `color.toString('hex')`, which is
 * uppercase. Reka only updates `color` on commit, so text that equals the formatted current colour is Reka's own
 * output (initial value, commit, steppers, external updates) and is uppercased. Mid-edit text differs from it and
 * stays as typed. A committed hex drops its alpha digits, as React Aria's hex field does.
 *
 * Channel mode: React Aria formats the number with its unit (`213°`, `50%`), clamps hue to 0–360 (Reka's hex
 * round-trip wraps 360 to 0) and steps PageUp/PageDown by the same step as the arrows. The last value this field set
 * is pinned while the colour still matches it, so `360°` and typed values survive the hex round-trip.
 *
 * Empty value: React Aria's ColorField can hold `null` and then shows an empty input. Reka always holds a colour
 * (`#000000` when none is given), so while `isEmpty()` is true the displayed text is blanked except while the user is
 * typing, and a commit that doesn't produce a colour keeps it blank. Committing blank text in a filled field calls
 * `onClear` (React Aria commits `null` there). Committing a colour equal to Reka's hidden one emits no Reka update, so
 * `onFill` is called instead. The form value is still `#000000`.
 *
 * Form value: rendered here instead of Reka's hidden input (which always submits the hex, even in channel mode), with
 * the channel number in channel mode (alpha on a 0–1 scale). The hex stays lowercase (React Aria submits it uppercase).
 */
export default defineComponent({
  name: 'ColorFieldBridge',
  props: {
    isEmpty: { type: Function as PropType<() => boolean>, required: true },
    onClear: { type: Function as PropType<() => void>, required: true },
    onFill: { type: Function as PropType<(color: Color) => void>, required: true },
    name: { type: String, default: undefined },
    step: { type: Number, default: undefined },
    locale: { type: String, default: undefined },
  },
  setup(props) {
    const ctx = injectColorFieldRootContext()
    const configLocale = useLocale()
    const hex = (color: Color) => colorToString(color, 'hex')
    // True between the user's first keystroke and the next commit
    let typing = false
    // True while this bridge writes raw numbers through Reka's commit
    let writing = false
    const pinned = shallowRef<{ value: number; hex: string } | null>(null)

    const channelValue = (): number => {
      const channel = ctx.channel.value!
      if (pinned.value && pinned.value.hex === hex(ctx.color.value)) return pinned.value.value
      return getChannelValue(ctx.color.value, channel)
    }
    // Rebuilt only when the locale or channel changes, not per keystroke/step.
    const channelFormat = computed(() => {
      const channel = ctx.channel.value!
      const locale = props.locale ?? configLocale.value
      if (channel === 'hue')
        return {
          formatter: new Intl.NumberFormat(locale, {
            style: 'unit',
            unit: 'degree',
            unitDisplay: 'narrow',
            maximumFractionDigits: 0,
          }),
          divisor: 1,
        }
      if (PERCENT_CHANNELS.has(channel))
        return {
          formatter: new Intl.NumberFormat(locale, { style: 'percent', maximumFractionDigits: 0 }),
          divisor: 100,
        }
      return {
        formatter: new Intl.NumberFormat(locale, { maximumFractionDigits: 0, useGrouping: false }),
        divisor: 1,
      }
    })
    const format = (value: number): string => {
      return channelFormat.value.formatter.format(value / channelFormat.value.divisor)
    }

    const updateValue = ctx.updateValue
    ctx.updateValue = (value: string) => {
      typing = true
      updateValue(value)
    }

    watch(
      [ctx.inputValue, ctx.color, () => props.isEmpty()],
      ([value, color, empty]) => {
        if (writing) return
        if (empty) {
          if (value !== '' && !typing) ctx.inputValue.value = ''
          return
        }
        if (ctx.channel.value) {
          const formatted = format(channelValue())
          if (!typing && value !== formatted) ctx.inputValue.value = formatted
          return
        }
        if (value !== hex(color)) return
        const upper = value.toUpperCase()
        if (upper !== value) ctx.inputValue.value = upper
      },
      { immediate: true, flush: 'sync' },
    )

    const commit = ctx.commit
    const editable = () => !ctx.readonly.value && !ctx.disabled.value

    // Sets the channel through Reka's own number commit, then pins the value against the hex it produced.
    const setChannel = (value: number) => {
      const channel = ctx.channel.value!
      const range = getChannelRange(channel)
      const clamped = Math.max(range.min, Math.min(range.max, value))
      const target = hex(setChannelValue(ctx.color.value, channel, clamped))
      typing = false
      writing = true
      try {
        ctx.inputValue.value = String(clamped)
        commit()
      } finally {
        writing = false
      }
      pinned.value = { value: clamped, hex: target }
      ctx.inputValue.value = props.isEmpty() ? '' : format(clamped)
    }

    ctx.commit = () => {
      typing = false
      const text = ctx.inputValue.value.trim()
      if (text === '' && !props.isEmpty() && editable()) {
        props.onClear()
        ctx.inputValue.value = ''
        return
      }
      if (ctx.channel.value) {
        const number = Number.parseFloat(text.replace(/[^\d.-]/g, ''))
        if (editable() && !Number.isNaN(number)) setChannel(number)
        else ctx.inputValue.value = props.isEmpty() ? '' : format(channelValue())
        return
      }
      const before = hex(ctx.color.value)
      // React Aria's hex field has no alpha: `#FF0000AA` commits as `#FF0000`
      if (isValidColor(text)) ctx.inputValue.value = hex({ ...parseColor(text), alpha: 1 } as Color)
      commit()
      if (!props.isEmpty()) return
      if (
        editable() &&
        isValidColor(text) &&
        hex({ ...parseColor(text), alpha: 1 } as Color) === before
      ) {
        props.onFill(ctx.color.value)
        ctx.inputValue.value = ctx.inputValue.value.toUpperCase()
        return
      }
      ctx.inputValue.value = ''
    }

    // React Aria steps PageUp/PageDown by the same step as the arrows (hex: 1, channels: the channel step).
    const step = (direction: 1 | -1) => {
      if (!editable()) return
      if (!ctx.channel.value) return direction > 0 ? increment() : decrement()
      setChannel(
        channelValue() + direction * (props.step ?? getChannelRange(ctx.channel.value).step),
      )
    }
    const { increment, decrement, incrementToMax, decrementToMin } = ctx
    ctx.increment = () => step(1)
    ctx.decrement = () => step(-1)
    ctx.incrementPage = () => step(1)
    ctx.decrementPage = () => step(-1)
    // Reka's hue max (360) wraps to 0 through the hex round-trip; React Aria shows 360°.
    ctx.incrementToMax = () => {
      if (!ctx.channel.value) return incrementToMax()
      if (editable()) setChannel(getChannelRange(ctx.channel.value).max)
    }
    ctx.decrementToMin = () => {
      if (!ctx.channel.value) return decrementToMin()
      if (editable()) setChannel(getChannelRange(ctx.channel.value).min)
    }
    ctx.handleWheel = (event: WheelEvent) => {
      if (ctx.disableWheelChange.value || !editable()) return
      event.preventDefault()
      step(event.deltaY > 0 ? -1 : 1)
    }

    const formValue = (): string => {
      if (props.isEmpty()) return '#000000'
      const channel = ctx.channel.value
      if (!channel) return hex({ ...ctx.color.value, alpha: 1 } as Color).toLowerCase()
      const value = channelValue()
      return String(channel === 'alpha' ? value / 100 : value)
    }

    return () =>
      props.name
        ? h('input', {
            type: 'hidden',
            name: props.name,
            value: formValue(),
            disabled: ctx.disabled.value,
          })
        : null
  },
})
