<script lang="ts">
import type { ValidateFn, ValidationResult } from '../../composables/useFieldValidation'
import type { ComponentSlots, ComponentVariants } from '../../types/tv'
import type { ValidationBehavior } from '../form/context'
import type { FormFieldProps } from '../form/types'
import theme from './theme'

type InputOtp = typeof theme

export interface InputOtpProps extends FormFieldProps {
  /** The current code. Bind with `v-model`. */
  modelValue?: string
  /** The initial code when uncontrolled (no `v-model`). */
  defaultValue?: string
  /**
   * Number of slots (characters) the code has.
   * @defaultValue 6
   */
  length?: number
  /**
   * Number of slots per visual group. A separator is rendered between groups, e.g. `[3, 3]` for a
   * 6-digit code split in half. Defaults to a single group of `length` slots (no separator).
   */
  groups?: number[]
  /**
   * Restricts which characters can be entered, mirroring HeroUI's exported `REGEXP_ONLY_*` patterns:
   * `'digits'` only allows `0-9`, `'chars'` only allows `a-z`/`A-Z`, `'alphanumeric'` allows both.
   * Unset allows any character, matching HeroUI's default since `input-otp` 1.4.
   */
  pattern?: 'digits' | 'chars' | 'alphanumeric'
  /**
   * Visual variant of the slots.
   * @defaultValue 'primary'
   */
  variant?: ComponentVariants<InputOtp>['variant']
  /** Label text rendered above the field. */
  label?: string
  /** Help text rendered above the box, below the label. */
  description?: string
  /** Error message rendered below the field while invalid. Defaults to the validation errors. */
  errorMessage?: string
  /**
   * Whether the field is disabled.
   * @defaultValue false
   */
  disabled?: boolean
  /**
   * Whether the field is invalid. Overrides validation when set.
   * @defaultValue undefined
   */
  invalid?: boolean
  /**
   * Whether all slots must be filled before form submission.
   * @defaultValue false
   */
  required?: boolean
  /** Validates the code. Return an error message (or several) when invalid, `true`/`null`/`undefined` when valid. */
  validate?: ValidateFn<string>
  /**
   * `native` blocks form submission and shows errors on change or submit; `aria` shows errors in realtime.
   * Defaults to the surrounding `Form`.
   * @defaultValue 'native'
   */
  validationBehavior?: ValidationBehavior
  /** The name of the field, used when submitting an HTML form. */
  name?: string
  /** The id of the underlying input; label, description and error ids derive from it. Generated when omitted. */
  id?: string
  /** Additional classes merged into the root element. */
  class?: any
  /** Per-slot class overrides. */
  ui?: ComponentSlots<InputOtp>
}

export interface InputOtpSlots {
  /** Label content. Replaces the `label` prop. */
  label?: () => any
  /** Description content. Replaces the `description` prop. */
  description?: () => any
  /** Error content, rendered while invalid. Replaces the `errorMessage` prop. */
  error?: (props: ValidationResult) => any
}

export interface InputOtpEmits {
  /** Emitted once, when every slot has just become filled. */
  complete: [value: string]
}
</script>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, useId, useSlots, useTemplateRef, watch } from 'vue'
import { useComponentUI } from '../../composables/useComponentUI'
import { useFieldValidation } from '../../composables/useFieldValidation'
import Description from '../description/Description.vue'
import FieldError from '../field-error/FieldError.vue'
import { useFieldsetDisabled } from '../fieldset/context'
import Label from '../label/Label.vue'

const props = withDefaults(defineProps<InputOtpProps>(), { length: 6, invalid: undefined })
const emit = defineEmits<InputOtpEmits>()
const slots = useSlots()
defineSlots<InputOtpSlots>()

/** The code. Bind with `v-model`. */
const modelValue = defineModel<string>()
if (modelValue.value === undefined && props.defaultValue !== undefined)
  modelValue.value = props.defaultValue

const root = useTemplateRef<HTMLElement>('root')
const input = useTemplateRef<HTMLInputElement>('input')
const box = useTemplateRef<HTMLElement>('box')
// Like the `input-otp` library: the invisible input's glyphs are sized to the box height via `--root-height`
watch(box, (el, _, onCleanup) => {
  if (!el || typeof ResizeObserver === 'undefined')
    return
  const measure = () => el.style.setProperty('--root-height', `${el.clientHeight}px`)
  measure()
  const observer = new ResizeObserver(measure)
  observer.observe(el)
  onCleanup(() => observer.disconnect())
}, { flush: 'post' })
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

const ui = useComponentUI('inputOtp', theme, () => ({ variant: props.variant }))

const autoId = useId()
const id = computed(() => props.id ?? autoId)
const descriptionId = computed(() => `${id.value}-description`)
const errorId = computed(() => `${id.value}-error`)
const hasLabel = computed(() => !!(props.label || slots.label))
const hasDescription = computed(() => !!(props.description || slots.description))
const hasError = computed(() => invalid.value && !!(props.errorMessage || slots.error || validation.value.validationErrors.length))
const describedBy = computed(() => [
  hasDescription.value ? descriptionId.value : undefined,
  hasError.value ? errorId.value : undefined,
].filter(Boolean).join(' ') || undefined)

// Slots are laid out in groups, a separator rendered between each; `[length]` (one group, no separator)
// when `groups` isn't given.
const groupSizes = computed(() => props.groups?.length ? props.groups : [props.length])
const groupSlots = computed(() => {
  let index = 0
  return groupSizes.value.map(size => Array.from({ length: size }, () => index++))
})

const patternRegex = computed(() => {
  if (props.pattern === 'digits')
    return /^\d+$/
  if (props.pattern === 'chars')
    return /^[a-z]+$/i
  if (props.pattern === 'alphanumeric')
    return /^[a-z0-9]+$/i
  return null
})
// A numeric virtual keyboard makes no sense once letters are allowed
const inputMode = computed(() => props.pattern === 'chars' || props.pattern === 'alphanumeric' ? 'text' : 'numeric')

function charAt(index: number) {
  return (modelValue.value ?? '')[index]
}

// `input-otp` is a single real (invisible) `<input>` overlaying decorative slot `<div>`s: typing,
// backspace, arrow-key movement and OS-level text selection are the browser's native text-editing
// behavior, not custom per-slot focus management. `selStart`/`selEnd` mirror the input's own selection
// so each slot can tell whether it's the active one (or part of an active range selection).
const isFocused = ref(false)
// The `input-otp` library's password-manager badge push (`pushPasswordManagerStrategy: 'increase-width'`, its
// default): once focused while the box is at least 40px wide, the invisible input is widened by 40px and clipped
// back, so a manager's badge sits outside the visible box. It stays on for the component's lifetime, as there.
const PWM_BADGE_SPACE = 40
const pushPwmBadge = ref(false)
const selStart = ref<number | null>(null)
const selEnd = ref<number | null>(null)
// The selection last mirrored, as the library's `inputMetadataRef.prev`: tells a backward caret move from a forward one
let prevSelection: [number | null, number | null] = [null, null]
// The `input-otp` library's selection model (its `selectionchange` listener): outside insert mode (caret at the
// end of a partial value) a collapsed caret is widened to select the active slot's character, so typing replaces
// it and Delete removes it. On a full field that is the last character.
function syncSelection() {
  const el = input.value
  if (!el)
    return
  const value = el.value
  const max = props.length
  let start = -1
  let end = -1
  let direction: 'forward' | 'backward' | undefined
  const caret = el.selectionStart
  if (value.length !== 0 && caret !== null && el.selectionEnd !== null && caret === el.selectionEnd) {
    const insertMode = caret === value.length && value.length < max
    if (!insertMode) {
      if (caret === 0) {
        start = 0
        end = 1
        direction = 'forward'
      }
      else if (caret === max) {
        start = caret - 1
        end = caret
        direction = 'backward'
      }
      else if (max > 1 && value.length > 1) {
        let offset = 0
        const [prevStart, prevEnd] = prevSelection
        if (prevStart !== null && prevEnd !== null) {
          direction = caret < prevEnd ? 'backward' : 'forward'
          const wasInserting = prevStart === prevEnd && prevStart < max
          if (direction === 'backward' && !wasInserting)
            offset = -1
        }
        start = offset + caret
        end = offset + caret + 1
      }
    }
    if (start !== -1 && end !== -1 && start !== end)
      el.setSelectionRange(start, end, direction)
  }
  selStart.value = el.selectionStart
  selEnd.value = el.selectionEnd
  prevSelection = [selStart.value, selEnd.value]
}
// The browser fires `selectionchange` for every caret move (arrow keys, clicks, typing), as the library listens to
function onSelectionChange() {
  if (document.activeElement === input.value)
    syncSelection()
}

function isActive(index: number) {
  if (!isFocused.value || selStart.value === null || selEnd.value === null)
    return false
  if (selStart.value === selEnd.value)
    return index === Math.min(selStart.value, props.length - 1)
  return index >= selStart.value && index < selEnd.value
}
function hasFakeCaret(index: number) {
  return isActive(index) && !charAt(index)
}

function commit(next: string) {
  const previous = modelValue.value ?? ''
  modelValue.value = next
  if (next.length === props.length && previous.length < props.length)
    emit('complete', next)
}

function onFocus() {
  isFocused.value = true
  if (box.value && box.value.offsetWidth >= PWM_BADGE_SPACE)
    pushPwmBadge.value = true
  const el = input.value
  if (el) {
    const length = (modelValue.value ?? '').length
    const start = Math.min(length, props.length - 1)
    el.setSelectionRange(start, length)
  }
  syncSelection()
}
function onBlur() {
  isFocused.value = false
  selStart.value = null
  selEnd.value = null
  prevSelection = [null, null]
}
onMounted(() => document.addEventListener('selectionchange', onSelectionChange))
onBeforeUnmount(() => document.removeEventListener('selectionchange', onSelectionChange))

function onInput(event: Event) {
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
  if (el.value.length > next.length)
    el.value = next
  commit(next)
  syncSelection()
}

function onPaste(event: ClipboardEvent) {
  if (disabled.value)
    return
  event.preventDefault()
  const el = input.value
  if (!el)
    return
  const text = event.clipboardData?.getData('text/plain') ?? ''
  const current = modelValue.value ?? ''
  const start = el.selectionStart ?? current.length
  const end = el.selectionEnd ?? start
  const next = (current.slice(0, start) + text + current.slice(end)).slice(0, props.length)
  if (next.length > 0 && patternRegex.value && !patternRegex.value.test(next))
    return
  el.value = next
  commit(next)
  const pos = Math.min(next.length, props.length - 1)
  el.setSelectionRange(pos, next.length)
  syncSelection()
}
</script>

<template>
  <div
    ref="root"
    :class="ui.base({ class: [props.ui?.base, props.class] })"
  >
    <!-- `base` is HareUI's own wrapper (HeroUI composes Label/InputOTP/Description itself), so it carries no data-slot -->
    <!-- Each part renders the `<slot>` outlet only when that slot is passed: a forwarded slot would otherwise make Vue force-update the child on every render -->
    <Label v-if="hasLabel && $slots.label" :for="id" :disabled="disabled" :invalid="invalid" :required="required">
      <slot name="label">{{ label }}</slot>
    </Label>
    <Label v-else-if="hasLabel" :for="id" :disabled="disabled" :invalid="invalid" :required="required">{{ label }}</Label>
    <!-- Like the `input-otp` library's container: HeroUI's `data-slot="input-otp"` and state attributes land on the <input> -->
    <div
      ref="box"
      data-input-otp-container="true"
      :class="ui.root({ class: props.ui?.root })"
    >
      <template v-for="(indexes, groupIndex) in groupSlots" :key="groupIndex">
        <div data-slot="input-otp-group" :class="ui.group({ class: props.ui?.group })">
          <div
            v-for="index in indexes"
            :key="index"
            data-slot="input-otp-slot"
            :data-active="isActive(index) ? 'true' : undefined"
            :data-filled="charAt(index) ? 'true' : undefined"
            :data-disabled="disabled ? 'true' : undefined"
            :data-invalid="invalid ? 'true' : undefined"
            :class="ui.slot({ class: props.ui?.slot })"
          >
            <div v-if="charAt(index)" data-slot="input-otp-slot-value" :class="ui.slotValue({ class: props.ui?.slotValue })">
              {{ charAt(index) }}
            </div>
            <div v-if="hasFakeCaret(index)" data-slot="input-otp-caret" :class="ui.caret({ class: props.ui?.caret })" />
          </div>
        </div>
        <div
          v-if="groupIndex < groupSlots.length - 1"
          data-slot="input-otp-separator"
          :class="ui.separator({ class: props.ui?.separator })"
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
        :aria-invalid="invalid ? 'true' : undefined"
        :aria-describedby="describedBy"
        data-slot="input-otp"
        :data-disabled="disabled ? 'true' : undefined"
        :data-invalid="invalid ? 'true' : undefined"
        :class="ui.input({ class: props.ui?.input })"
        :style="pushPwmBadge ? { width: `calc(100% + ${PWM_BADGE_SPACE}px)`, clipPath: `inset(0 ${PWM_BADGE_SPACE}px 0 0)` } : undefined"
        @input="onInput"
        @paste="onPaste"
        @focus="onFocus"
        @blur="onBlur"
        @click="syncSelection"
        @keyup="syncSelection"
        @select="syncSelection"
      >
    </div>
    <Description v-if="hasDescription && $slots.description" :id="descriptionId">
      <slot name="description">{{ description }}</slot>
    </Description>
    <Description v-else-if="hasDescription" :id="descriptionId">{{ description }}</Description>
    <FieldError v-if="hasError && $slots.error" :id="errorId">
      <slot name="error" v-bind="validation">{{ errorMessage ?? validation.validationErrors.join(' ') }}</slot>
    </FieldError>
    <FieldError v-else-if="hasError" :id="errorId">{{ errorMessage ?? validation.validationErrors.join(' ') }}</FieldError>
  </div>
</template>
