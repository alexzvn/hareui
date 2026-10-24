import type { MaybeRefOrGetter, Slot } from 'vue'
import type { ValidationResult } from './useFieldValidation'
import { computed, defineComponent, h, onBeforeUpdate, shallowRef, toValue, useId } from 'vue'
import Description from '../components/description/Description.vue'
import FieldError from '../components/field-error/FieldError.vue'
import Label from '../components/label/Label.vue'
import { useSlotOutlet } from './useSlotOutlet'

const VALID_RESULT: ValidationResult = {
  isInvalid: false,
  validationErrors: [],
  validationDetails: {
    badInput: false,
    customError: false,
    patternMismatch: false,
    rangeOverflow: false,
    rangeUnderflow: false,
    stepMismatch: false,
    tooLong: false,
    tooShort: false,
    typeMismatch: false,
    valueMissing: false,
    valid: true,
  },
}

export interface FieldChromeSlots {
  label?: Slot<any>
  description?: Slot<any>
  error?: Slot<any>
}

export interface FieldChromeOptions {
  /** The component's props; reads `id` (unless `baseId` is given), `label`, `description` and `errorMessage`. */
  props: { id?: string, label?: string, description?: string, errorMessage?: string }
  /**
   * Base of the returned `id` and the label / description / error ids, replacing `props.id ?? useId()`. For fields
   * whose `id` prop names an inner control while the chrome ids stay generated (e.g. ComboBox).
   */
  baseId?: MaybeRefOrGetter<string>
  /** The component's slots (`useSlots()` / `defineSlots()`); reads `label`, `description` and `error`. */
  slots: FieldChromeSlots
  /** Whether the field is invalid; gates the error. Absent: never invalid. */
  invalid?: MaybeRefOrGetter<boolean>
  /** The validation result: fallback error text and `error` slot props. Absent: a valid result with no errors. */
  validation?: MaybeRefOrGetter<ValidationResult>
  disabled?: MaybeRefOrGetter<boolean | undefined>
  required?: MaybeRefOrGetter<boolean | undefined>
  /**
   * Drop the description from the DOM and from `describedBy` while invalid. Turn on wherever the theme hides the
   * description while invalid: a `display: none` node referenced by `aria-describedby` is still announced
   * (accname reads hidden referenced nodes), so hiding it with CSS alone leaves a stale description.
   * @defaultValue false
   */
  hideDescriptionWhenInvalid?: boolean
  /** The caller's own `aria-describedby` (usually `attrs['aria-describedby']`); listed first. */
  ariaDescribedBy?: MaybeRefOrGetter<string | undefined>
  /** Extra ids listed after `ariaDescribedBy` and before the description (e.g. a value element's id). Falsy entries are skipped. */
  describedByIds?: MaybeRefOrGetter<(string | false | null | undefined)[]>
  /** Props passed to the `label` / `description` slots (e.g. `{ state }`). */
  slotProps?: MaybeRefOrGetter<Record<string, unknown> | undefined>
}

/**
 * The label / description / error chrome every form field repeats: derived ids, presence flags, the
 * `aria-describedby` composition and single-branch part components.
 *
 * Invariants:
 * - Ids derive from `baseId`, else `props.id ?? useId()`: `${id}-label`, `${id}-description`, `${id}-error`.
 * - `describedBy` order: `ariaDescribedBy`, then `describedByIds`, then description id, then error id; `undefined` when empty.
 * - A part is referenced by `describedBy` exactly when it is rendered.
 * - The error shows only while invalid with an `errorMessage`, an `error` slot or validation errors; its text
 *   falls back to the joined validation errors. The `error` slot receives the validation result.
 * - Slot content wins over the matching prop; parts render the prop text when the slot is absent.
 *
 * Must be called in `setup`.
 */
export function useFieldChrome(options: FieldChromeOptions) {
  const { props, slots } = options
  const autoId = useId()
  const id = computed(() => toValue(options.baseId) ?? props.id ?? autoId)
  const labelId = computed(() => `${id.value}-label`)
  const descriptionId = computed(() => `${id.value}-description`)
  const errorId = computed(() => `${id.value}-error`)

  // `slots` isn't reactive: mirror slot presence into refs (like `useSlotOutlet` does) so presence flags, and the
  // parts that read them, follow `<template v-if #label>` swaps.
  const present = shallowRef({ label: !!slots.label, description: !!slots.description, error: !!slots.error })
  onBeforeUpdate(() => {
    const next = { label: !!slots.label, description: !!slots.description, error: !!slots.error }
    const prev = present.value
    if (next.label !== prev.label || next.description !== prev.description || next.error !== prev.error)
      present.value = next
  })

  const invalid = computed(() => !!toValue(options.invalid))
  const validation = computed(() => toValue(options.validation) ?? VALID_RESULT)
  const hasLabel = computed(() => !!(props.label || present.value.label))
  const hasDescription = computed(() => !!(props.description || present.value.description)
    && !(options.hideDescriptionWhenInvalid && invalid.value))
  const hasError = computed(() => invalid.value
    && !!(props.errorMessage || present.value.error || validation.value.validationErrors.length))
  const errorText = computed(() => props.errorMessage ?? validation.value.validationErrors.join(' '))
  const describedBy = computed(() => [
    toValue(options.ariaDescribedBy),
    ...(toValue(options.describedByIds) ?? []),
    hasDescription.value ? descriptionId.value : undefined,
    hasError.value ? errorId.value : undefined,
  ].filter(Boolean).join(' ') || undefined)

  // Outlets instead of forwarded `<slot>`s: a forwarded slot makes Vue force-update the part on every render
  const LabelOutlet = useSlotOutlet(slots, 'label')
  const DescriptionOutlet = useSlotOutlet(slots, 'description')
  const ErrorOutlet = useSlotOutlet(slots, 'error')

  /** `<Label>` when the field has a label. Attrs (`for`, or `id` + `as="span"` for groups) pass to `Label`. */
  const FieldLabel = defineComponent({
    name: 'FieldLabel',
    inheritAttrs: false,
    setup(_, { attrs }) {
      return () => hasLabel.value
        ? h(Label, {
            disabled: toValue(options.disabled),
            invalid: invalid.value,
            required: toValue(options.required),
            ...attrs,
          }, () => h(LabelOutlet, toValue(options.slotProps), () => props.label))
        : null
    },
  })

  /** `<Description>` with the description id, when shown. */
  const FieldDescription = defineComponent({
    name: 'FieldDescription',
    inheritAttrs: false,
    setup(_, { attrs }) {
      return () => hasDescription.value
        ? h(Description, { ...attrs, id: descriptionId.value }, () => h(DescriptionOutlet, toValue(options.slotProps), () => props.description))
        : null
    },
  })

  /** `<FieldError>` with the error id, when shown. */
  const FieldErrorPart = defineComponent({
    name: 'FieldErrorPart',
    inheritAttrs: false,
    setup(_, { attrs }) {
      return () => hasError.value
        ? h(FieldError, { ...attrs, id: errorId.value }, () => h(ErrorOutlet, validation.value, () => errorText.value))
        : null
    },
  })

  return {
    id,
    labelId,
    descriptionId,
    errorId,
    hasLabel,
    hasDescription,
    hasError,
    errorText,
    describedBy,
    FieldLabel,
    FieldDescription,
    FieldError: FieldErrorPart,
  }
}
