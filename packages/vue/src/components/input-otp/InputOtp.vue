<template>
  <div ref="root" v-bind="rootAttrs" :class="ui.base()">
    <!-- `base` is HareUI's own wrapper (HeroUI composes Label/InputOTP/Description itself), so it carries no data-slot -->
    <FieldLabel :for="id" />
    <!-- Like the `input-otp` library's container: HeroUI's `data-slot="input-otp"` and state attributes land on the <input> -->
    <div ref="box" data-input-otp-container="true" :class="ui.root()">
      <template v-for="(indexes, groupIndex) in groupSlots" :key="groupIndex">
        <div data-slot="input-otp-group" :class="ui.group()">
          <div
            v-for="index in indexes"
            :key="index"
            data-slot="input-otp-slot"
            :data-active="isActive(index) ? 'true' : undefined"
            :data-filled="charAt(index) ? 'true' : undefined"
            :data-disabled="disabled ? 'true' : undefined"
            :data-invalid="invalid ? 'true' : undefined"
            :class="ui.slot()"
          >
            <div v-if="charAt(index)" data-slot="input-otp-slot-value" :class="ui.slotValue()">
              {{ charAt(index) }}
            </div>
            <div v-if="hasFakeCaret(index)" data-slot="input-otp-caret" :class="ui.caret()" />
          </div>
        </div>
        <div
          v-if="groupIndex < groupSlots.length - 1"
          data-slot="input-otp-separator"
          :class="ui.separator()"
        />
      </template>
      <input
        :id="id"
        ref="input"
        type="text"
        :value="modelValue ?? ''"
        :maxlength="length"
        :name="name"
        :disabled="disabled || undefined"
        :required="required || undefined"
        :pattern="patternRegex?.source"
        :inputmode="inputMode"
        autocomplete="one-time-code"
        autocapitalize="off"
        autocorrect="off"
        spellcheck="false"
        :aria-label="attrs['aria-label'] as string | undefined"
        :aria-labelledby="attrs['aria-labelledby'] as string | undefined"
        :aria-invalid="invalid ? 'true' : undefined"
        :aria-describedby="describedBy"
        data-slot="input-otp"
        :data-disabled="disabled ? 'true' : undefined"
        :data-invalid="invalid ? 'true' : undefined"
        :class="ui.input()"
        :style="
          shouldPushPwmBadge
            ? {
                width: `calc(100% + ${PWM_BADGE_SPACE}px)`,
                clipPath: `inset(0 ${PWM_BADGE_SPACE}px 0 0)`,
              }
            : undefined
        "
        @input="onInput"
        @paste="onPaste"
        @focus="onFocus"
        @blur="onBlur"
        @click="syncSelection"
        @keyup="syncSelection"
        @select="syncSelection"
      />
    </div>
    <FieldDescription />
    <FieldError />
  </div>
</template>

<script setup lang="ts">
import {
  computed,
  onBeforeUnmount,
  onMounted,
  onWatcherCleanup,
  ref,
  shallowReactive,
  useAttrs,
  useSlots,
  useTemplateRef,
  watch,
} from 'vue'

import { useFieldsetDisabled } from '@/components/fieldset/context'
import { useComponentUI } from '@/composables/useComponentUI'
import { useFieldChrome } from '@/composables/useFieldChrome'
import { useFieldValidation } from '@/composables/useFieldValidation'

import type { InputOtpProps, InputOtpSlots, InputOtpEmits } from './InputOtp.types'
import theme from './theme'

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<InputOtpProps>(), { length: 6, invalid: undefined })
const emit = defineEmits<InputOtpEmits>()
const slots = useSlots()
defineSlots<InputOtpSlots>()

// `aria-label` / `aria-labelledby` name the input (as the `input-otp` library spreads them onto it), not the wrapper div
const attrs = useAttrs()
const rootAttrs = computed(() => {
  const { 'aria-label': _label, 'aria-labelledby': _labelledby, ...rest } = attrs
  return rest
})

/** The code. Bind with `v-model`. */
const modelValue = defineModel<string>()
if (modelValue.value === undefined && props.defaultValue !== undefined)
  modelValue.value = props.defaultValue

const root = useTemplateRef<HTMLElement>('root')
const input = useTemplateRef<HTMLInputElement>('input')
const box = useTemplateRef<HTMLElement>('box')

// Like the `input-otp` library: the invisible input's glyphs are sized to the box height via `--root-height`
watch(
  box,
  (el) => {
    if (!el || typeof ResizeObserver === 'undefined') return
    const measure = () => el.style.setProperty('--root-height', `${el.clientHeight}px`)
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(el)
    onWatcherCleanup(() => observer.disconnect())
  },
  { flush: 'post' },
)

const { validation } = useFieldValidation({
  value: () => modelValue.value ?? '',
  validate: () => props.validate,
  invalid: () => props.invalid,
  validationBehavior: () => props.validationBehavior,
  name: () => props.name,
  root: () => root.value,
  formField: props,
  onReset: () => {
    modelValue.value = props.defaultValue ?? ''
  },
})

const disabled = useFieldsetDisabled(() => props.disabled)
const invalid = computed(() => validation.value.isInvalid)

const ui = useComponentUI('inputOtp', {
  theme,
  variantProps: () => ({ variant: props.variant }),
  props,
})

const { id, describedBy, FieldLabel, FieldDescription, FieldError } = useFieldChrome({
  props,
  slots,
  invalid,
  validation,
  disabled,
  required: () => props.required,
})

// Slots are laid out in groups, a separator rendered between each; `[length]` (one group, no separator)
// when `groups` isn't given.
const groupSizes = computed(() => (props.groups?.length ? props.groups : [props.length]))
const groupSlots = computed(() => {
  let index = 0
  return groupSizes.value.map((size) => Array.from({ length: size }, () => index++))
})

const patternRegex = computed(() => {
  if (props.pattern === 'digits') return /^\d+$/
  if (props.pattern === 'chars') return /^[a-z]+$/i
  if (props.pattern === 'alphanumeric') return /^[a-z0-9]+$/i

  return null
})

// A numeric virtual keyboard makes no sense once letters are allowed
const inputMode = computed(() =>
  props.pattern === 'chars' || props.pattern === 'alphanumeric' ? 'text' : 'numeric',
)

const charAt = (index: number) => {
  return (modelValue.value ?? '')[index]
}

// `input-otp` is a single real (invisible) `<input>` overlaying decorative slot `<div>`s: typing,
// backspace, arrow-key movement and OS-level text selection are the browser's native text-editing
// behavior, not custom per-slot focus management. `inputSelection` mirrors the input's focus and its own
// selection so each slot can tell whether it's the active one (or part of an active range selection).
const inputSelection = shallowReactive({
  isFocused: false,
  start: null as number | null,
  end: null as number | null,
})

// The `input-otp` library's password-manager badge push (`pushPasswordManagerStrategy: 'increase-width'`, its
// default): once focused while the box is at least 40px wide, the invisible input is widened by 40px and clipped
// back, so a manager's badge sits outside the visible box. It stays on for the component's lifetime, as there.
const PWM_BADGE_SPACE = 40
const shouldPushPwmBadge = ref(false)

type CaretSelection = [number | null, number | null]

type SlotSelection = { start: number; end: number; direction?: 'forward' | 'backward' }

// The selection last mirrored, as the library's `inputMetadataRef.prev`: tells a backward caret move from a forward one
let prevSelection: CaretSelection = [null, null]

// The `input-otp` library's selection model (its `selectionchange` listener): outside insert mode (caret at the
// end of a partial value) a collapsed caret is widened to select the active slot's character, so typing replaces
// it and Delete removes it. On a full field that is the last character. `null` leaves the caret as is.
const resolveSlotSelection = (options: {
  caret: number
  value: string
  max: number
  prev: CaretSelection
}): SlotSelection | null => {
  const { caret, value, max, prev } = options
  const isInsertMode = caret === value.length && value.length < max
  if (isInsertMode) return null
  if (caret === 0) return { start: 0, end: 1, direction: 'forward' }
  if (caret === max) return { start: caret - 1, end: caret, direction: 'backward' }
  if (max <= 1 || value.length <= 1) return null

  const [prevStart, prevEnd] = prev
  if (prevStart === null || prevEnd === null) return { start: caret, end: caret + 1 }

  const direction = caret < prevEnd ? 'backward' : 'forward'
  const isPrevInsertCaret = prevStart === prevEnd && prevStart < max
  const offset = direction === 'backward' && !isPrevInsertCaret ? -1 : 0

  return { start: offset + caret, end: offset + caret + 1, direction }
}

const syncSelection = () => {
  const el = input.value
  if (!el) return

  const caret = el.selectionStart
  const isCollapsed = caret !== null && caret === el.selectionEnd
  if (el.value.length !== 0 && isCollapsed) {
    const range = resolveSlotSelection({
      caret,
      value: el.value,
      max: props.length,
      prev: prevSelection,
    })

    if (range) el.setSelectionRange(range.start, range.end, range.direction)
  }

  inputSelection.start = el.selectionStart
  inputSelection.end = el.selectionEnd
  prevSelection = [inputSelection.start, inputSelection.end]
}

// The browser fires `selectionchange` for every caret move (arrow keys, clicks, typing), as the library listens to
const onSelectionChange = () => {
  if (document.activeElement === input.value) syncSelection()
}

const isActive = (index: number) => {
  if (!inputSelection.isFocused || inputSelection.start === null || inputSelection.end === null) {
    return false
  }

  if (inputSelection.start === inputSelection.end) {
    return index === Math.min(inputSelection.start, props.length - 1)
  }

  return index >= inputSelection.start && index < inputSelection.end
}

const hasFakeCaret = (index: number) => {
  return isActive(index) && !charAt(index)
}

const commit = (next: string) => {
  const previous = modelValue.value ?? ''
  modelValue.value = next
  if (next.length === props.length && previous.length < props.length) emit('complete', next)
}

const onFocus = () => {
  inputSelection.isFocused = true
  if (box.value && box.value.offsetWidth >= PWM_BADGE_SPACE) shouldPushPwmBadge.value = true
  const el = input.value
  if (el) {
    const length = (modelValue.value ?? '').length
    const start = Math.min(length, props.length - 1)
    el.setSelectionRange(start, length)
  }

  syncSelection()
}

const onBlur = () => {
  inputSelection.isFocused = false
  inputSelection.start = null
  inputSelection.end = null
  prevSelection = [null, null]
}

onMounted(() => document.addEventListener('selectionchange', onSelectionChange))
onBeforeUnmount(() => document.removeEventListener('selectionchange', onSelectionChange))

const onInput = (event: Event) => {
  const el = event.target as HTMLInputElement
  const next = el.value.slice(0, props.length)
  if (next.length > 0 && patternRegex.value && !patternRegex.value.test(next)) {
    // Reject the keystroke: restore the last valid value, caret where it was typed from
    const previous = modelValue.value ?? ''
    el.value = previous
    const pos = Math.min(previous.length, props.length)
    el.setSelectionRange(pos, pos)
    syncSelection()

    return
  }

  if (el.value.length > next.length) el.value = next
  commit(next)
  syncSelection()
}

const onPaste = (event: ClipboardEvent) => {
  if (disabled.value) return
  event.preventDefault()
  const el = input.value
  if (!el) return
  const text = event.clipboardData?.getData('text/plain') ?? ''
  const current = modelValue.value ?? ''
  const start = el.selectionStart ?? current.length
  const end = el.selectionEnd ?? start
  const next = (current.slice(0, start) + text + current.slice(end)).slice(0, props.length)
  if (next.length > 0 && patternRegex.value && !patternRegex.value.test(next)) return
  el.value = next
  commit(next)
  const pos = Math.min(next.length, props.length - 1)
  el.setSelectionRange(pos, next.length)
  syncSelection()
}
</script>
