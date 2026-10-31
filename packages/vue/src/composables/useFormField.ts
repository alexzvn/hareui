import type { ComputedRef, MaybeRefOrGetter } from 'vue'
import { computed, inject, onScopeDispose, provide, toValue } from 'vue'

import { formFieldContextKey } from '@/components/form-field/context'
import { formContextKey } from '@/components/form/context'
import type { FormInputEvents } from '@/components/form/types'

import type { ValidationResult } from './useFieldValidation'

/** Options of {@link useFormField}. */
export type UseFormFieldOptions = {
  /** The control's own id. The field's label points at it instead of the field's generated id. */
  id?: MaybeRefOrGetter<string | undefined>
  /** The control's own name. Wins over the field's `name`. */
  name?: MaybeRefOrGetter<string | undefined>
  /**
   * The id the field's label points at, when it isn't the control id. Return `undefined` for a control a label can't
   * target, such as a group named with `aria-labelledby`.
   */
  labelTarget?: () => string | undefined
  /** The control's validation state. While invalid, its errors show in the field instead of the `Form` error. */
  validation?: MaybeRefOrGetter<ValidationResult | undefined>
  /** Whether the control is disabled; dims the field's label. */
  disabled?: MaybeRefOrGetter<boolean | undefined>
  /** Whether the control is required; adds the marker to the field's label. */
  required?: MaybeRefOrGetter<boolean | undefined>
}

/** Attributes that point a control at its `FormField`'s description, hint, help and error. */
export type FormFieldAriaAttrs = {
  /** Ids of the field's rendered description, hint, help and error. */
  'aria-describedby'?: string
  /** `'true'` while the field has an error. */
  'aria-invalid'?: 'true'
}

/** What {@link useFormField} returns. Without a surrounding `FormField`, each value is the control's own or empty. */
export type UseFormFieldReturn = {
  /** Whether a `FormField` wraps the control. */
  isInFormField: boolean
  /** The id to put on the control: its own `id`, else the one the field's label points at. */
  id: ComputedRef<string | undefined>
  /** The id of the field's label, for `aria-labelledby` on controls a `<label>` can't target. */
  labelId: ComputedRef<string | undefined>
  /** The id of the field's description; `undefined` when none renders. */
  descriptionId: ComputedRef<string | undefined>
  /** Ids of the field's rendered description, hint, help and error, for `aria-describedby`. */
  describedBy: ComputedRef<string | undefined>
  /** The control's own `name`, else the field's. */
  name: ComputedRef<string | undefined>
  /** The field's `size`. */
  size: ComputedRef<'sm' | 'md' | 'lg' | undefined>
  /** Whether the field is marked required. */
  required: ComputedRef<boolean>
  /** The field's displayed error: a message, `true` for an error without one, or `undefined`. */
  error: ComputedRef<string | true | undefined>
  /** Whether the field has an error. */
  invalid: ComputedRef<boolean>
  /** `aria-describedby` and `aria-invalid` to bind on the control. */
  ariaAttrs: ComputedRef<FormFieldAriaAttrs>
  /** Reports a blur to the surrounding `Form`, which validates `name` if its `validateOn` includes `blur`. */
  emitFormBlur: () => void
  /** Reports a focus to the surrounding `Form`. */
  emitFormFocus: () => void
  /** Reports a committed change to the surrounding `Form`, which validates `name` if its `validateOn` includes `change`. */
  emitFormChange: () => void
  /**
   * Reports an input to the surrounding `Form`: tracked right away, validated after `validateOnInputDelay` (once the
   * control was first left, unless `eagerValidation`).
   */
  emitFormInput: () => void
}

/**
 * Connects a control to the `FormField` around it: the id its label points at, the ids of its description, hint, help
 * and error, its name and error state, and `Form` event reporting. HareUI fields call it already; call it in a custom
 * or third-party control's `setup`. The first control to call it claims the field: controls nested inside it don't
 * see the field.
 */
export const useFormField = (options: UseFormFieldOptions = {}): UseFormFieldReturn => {
  const field = inject(formFieldContextKey, null)
  const form = inject(formContextKey, null)

  // Controls nested inside this one (a group's items, a field's input) neither claim the field nor duplicate its events
  provide(formFieldContextKey, null)

  if (field) {
    const unregister = field.register({
      labelTarget: options.labelTarget ?? (() => toValue(options.id) ?? field.controlId),
      validation: () => toValue(options.validation),
      disabled: () => toValue(options.disabled),
      required: () => toValue(options.required),
    })

    onScopeDispose(unregister)
  }

  const name = computed(() => toValue(options.name) ?? field?.name.value)
  const describedBy = computed(() => field?.describedBy.value)
  const isInvalid = computed(() => !!field?.invalid.value)

  const emitFormEvent = (
    type: FormInputEvents,
    flags?: { eager?: boolean; track?: boolean; validate?: boolean },
  ) => {
    if (form && field && name.value) form.emit({ type, name: name.value, ...flags })
  }

  let inputTimer: ReturnType<typeof setTimeout> | undefined
  onScopeDispose(() => clearTimeout(inputTimer))

  const emitFormInput = () => {
    emitFormEvent('input', { validate: false })
    clearTimeout(inputTimer)
    const delay = field?.validateOnInputDelay.value ?? form?.validateOnInputDelay.value ?? 0
    const isEager = !!field?.eagerValidation.value
    inputTimer = setTimeout(() => emitFormEvent('input', { eager: isEager, track: false }), delay)
  }

  return {
    isInFormField: !!field,
    id: computed(() => toValue(options.id) ?? field?.controlId),
    labelId: computed(() => field?.labelId.value),
    descriptionId: computed(() => field?.descriptionId.value),
    describedBy,
    name,
    size: computed(() => field?.size.value),
    required: computed(() => !!field?.required.value),
    error: computed(() => field?.error.value),
    invalid: isInvalid,
    ariaAttrs: computed(() => ({
      'aria-describedby': describedBy.value,
      'aria-invalid': isInvalid.value ? ('true' as const) : undefined,
    })),
    emitFormBlur: () => emitFormEvent('blur'),
    emitFormFocus: () => emitFormEvent('focus'),
    emitFormChange: () => emitFormEvent('change'),
    emitFormInput,
  }
}
