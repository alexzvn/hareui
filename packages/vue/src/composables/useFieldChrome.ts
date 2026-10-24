import type { MaybeRefOrGetter, Slot } from 'vue'
import type { ValidationResult } from './useFieldValidation'
import { computed, defineComponent, h, onBeforeUpdate, shallowRef, toValue, useId } from 'vue'
import Description from '../components/description/Description.vue'
import ErrorMessage from '../components/error-message/ErrorMessage.vue'
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

export type FieldChromeSlots = {
  label?: Slot<any>
  description?: Slot<any>
  error?: Slot<any>
  /** Read instead of `error` when `errorPart` is `'errorMessage'`. */
  errorMessage?: Slot<any>
}

export type FieldChromeOptions = {
  /** The component's props; reads `id` (unless `baseId` is given), `label`, `description` and `errorMessage`. */
  props: { id?: string, label?: string, description?: string, errorMessage?: string }
  /**
   * Base of the returned `id` and the label / description / error ids, replacing `props.id ?? useId()`. For fields
   * whose `id` prop names an inner control while the chrome ids stay generated (e.g. ComboBox).
   */
  baseId?: MaybeRefOrGetter<string>
  /** The component's slots (`useSlots()` / `defineSlots()`); reads `label`, `description` and `error` (or `errorMessage`, per `errorPart`). */
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
  /** Extra ids listed after `ariaDescribedBy`, placed around the description per `describedByIdsPosition`. Falsy entries are skipped. */
  describedByIds?: MaybeRefOrGetter<(string | false | null | undefined)[]>
  /**
   * Where `describedByIds` sit relative to the description id: `'beforeDescription'` for ids that frame the
   * field (e.g. a value element), `'afterDescription'` for content read after the description (e.g. a card's extra
   * content followed by its group's ids).
   * @defaultValue 'beforeDescription'
   */
  describedByIdsPosition?: 'beforeDescription' | 'afterDescription'
  /**
   * The error part. `'fieldError'`: a `<FieldError>` (`role="alert"`) shown while invalid, fed by the `error` slot,
   * `errorMessage` and validation errors. `'errorMessage'`: HeroUI's always-mounted `<ErrorMessage>`, shown whenever
   * `errorMessage` is given (even `''`) or the `errorMessage` slot is, regardless of `invalid` and validation.
   * @defaultValue 'fieldError'
   */
  errorPart?: 'fieldError' | 'errorMessage'
  /** Props passed to the `label` / `description` slots (e.g. `{ state }`). */
  slotProps?: MaybeRefOrGetter<Record<string, unknown> | undefined>
}

/**
 * The label / description / error chrome every form field repeats: derived ids, presence flags, the
 * `aria-describedby` composition and single-branch part components.
 *
 * Invariants:
 * - Ids derive from `baseId`, else `props.id ?? useId()`: `${id}-label`, `${id}-description`, `${id}-error`.
 * - `describedBy` order: `ariaDescribedBy`, then `describedByIds` and the description id (in `describedByIdsPosition`
 *   order), then the error id; `undefined` when empty.
 * - A part is referenced by `describedBy` exactly when it is rendered.
 * - `errorPart: 'fieldError'`: the error shows only while invalid with an `errorMessage`, an `error` slot or
 *   validation errors; its text falls back to the joined validation errors. The `error` slot receives the validation
 *   result. `errorPart: 'errorMessage'`: the error shows whenever `errorMessage` or the `errorMessage` slot is given.
 * - Slot content wins over the matching prop; parts render the prop text when the slot is absent.
 *
 * Must be called in `setup`.
 */
export const useFieldChrome = (options: FieldChromeOptions) => {
  const { props, slots } = options
  const isMessagePart = options.errorPart === 'errorMessage'
  const errorSlot = isMessagePart ? 'errorMessage' : 'error'
  const autoId = useId()
  const id = computed(() => toValue(options.baseId) ?? props.id ?? autoId)
  const labelId = computed(() => `${id.value}-label`)
  const descriptionId = computed(() => `${id.value}-description`)
  const errorId = computed(() => `${id.value}-error`)

  // `slots` isn't reactive: mirror slot presence into refs (like `useSlotOutlet` does) so presence flags, and the
  // parts that read them, follow `<template v-if #label>` swaps.
  const present = shallowRef({ label: !!slots.label, description: !!slots.description, error: !!slots[errorSlot] })
  onBeforeUpdate(() => {
    const next = { label: !!slots.label, description: !!slots.description, error: !!slots[errorSlot] }
    const prev = present.value
    if (next.label !== prev.label || next.description !== prev.description || next.error !== prev.error)
      present.value = next
  })

  const invalid = computed(() => !!toValue(options.invalid))
  const validation = computed(() => toValue(options.validation) ?? VALID_RESULT)
  const hasLabel = computed(() => !!(props.label || present.value.label))
  const hasDescription = computed(() => !!(props.description || present.value.description)
    && !(options.hideDescriptionWhenInvalid && invalid.value))
  const hasMessageError = computed(() => props.errorMessage !== undefined || present.value.error)
  const hasInvalidError = computed(() => invalid.value
    && !!(props.errorMessage || present.value.error || validation.value.validationErrors.length))
  const hasError = isMessagePart ? hasMessageError : hasInvalidError
  const errorText = computed(() => props.errorMessage ?? validation.value.validationErrors.join(' '))
  const describedBy = computed(() => {
    const description = hasDescription.value ? descriptionId.value : undefined
    const ids = toValue(options.describedByIds) ?? []
    const around = options.describedByIdsPosition === 'afterDescription' ? [description, ...ids] : [...ids, description]
    return [toValue(options.ariaDescribedBy), ...around, hasError.value ? errorId.value : undefined]
      .filter(Boolean)
      .join(' ') || undefined
  })

  // Outlets instead of forwarded `<slot>`s: a forwarded slot makes Vue force-update the part on every render
  const LabelOutlet = useSlotOutlet(slots, 'label')
  const DescriptionOutlet = useSlotOutlet(slots, 'description')
  const ErrorOutlet = useSlotOutlet(slots, errorSlot)

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

  /** The error part (`<FieldError>`, or `<ErrorMessage>` per `errorPart`) with the error id, when shown. */
  const FieldErrorPart = defineComponent({
    name: 'FieldErrorPart',
    inheritAttrs: false,
    setup(_, { attrs }) {
      const renderMessage = () => h(ErrorMessage, { ...attrs, id: errorId.value }, () => h(ErrorOutlet, null, () => props.errorMessage))
      const renderFieldError = () => h(FieldError, { ...attrs, id: errorId.value }, () => h(ErrorOutlet, validation.value, () => errorText.value))
      const render = isMessagePart ? renderMessage : renderFieldError
      return () => hasError.value ? render() : null
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
