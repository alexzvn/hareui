import type { InjectionKey, Ref } from 'vue'

import type { ValidationResult } from '@/composables/useFieldValidation'

/** The control a `FormField` labels: the HareUI field or custom control that claimed the field's context. */
export type FormFieldControl = {
  /** The id the field's label points at (`for`); `undefined` for controls a label can't target, such as groups. */
  labelTarget: () => string | undefined
  /** The control's validation state; its errors show in the field. `undefined` when the control doesn't validate. */
  validation: () => ValidationResult | undefined
  /** Whether the control is disabled; dims the field's label. */
  disabled: () => boolean | undefined
  /** Whether the control is required; adds the marker to the field's label. */
  required: () => boolean | undefined
}

/** State a `FormField` provides to the control inside it. */
export type FormFieldContext = {
  /** The id a control without an id of its own takes, so the field's label points at it. */
  controlId: string
  /** The id of the field's label; `undefined` when no label renders. */
  labelId: Readonly<Ref<string | undefined>>
  /** The id of the field's description; `undefined` when no description renders. */
  descriptionId: Readonly<Ref<string | undefined>>
  /** Space-separated ids of the rendered description, hint, help and error elements. */
  describedBy: Readonly<Ref<string | undefined>>
  /** The field's `name`, used by the control when it has none. */
  name: Readonly<Ref<string | undefined>>
  /** The field's `size`. */
  size: Readonly<Ref<'sm' | 'md' | 'lg' | undefined>>
  /** The field's `required`. */
  required: Readonly<Ref<boolean>>
  /** The field's own `error` prop: a truthy value marks the control invalid. */
  errorProp: Readonly<Ref<string | boolean | undefined>>
  /** The displayed error: the `error` prop, the control's validation errors or the `Form` error for `name`. */
  error: Readonly<Ref<string | true | undefined>>
  /** Whether the field has an error. */
  invalid: Readonly<Ref<boolean>>
  /** The field's `errorPattern`, used by the control when it sets none. */
  errorPattern: Readonly<Ref<RegExp | undefined>>
  /** The field's `eagerValidation`, used by the control when it sets none. */
  eagerValidation: Readonly<Ref<boolean | undefined>>
  /** The field's `validateOnInputDelay`, used by the control when it sets none. */
  validateOnInputDelay: Readonly<Ref<number | undefined>>
  /** Registers the control the field labels. Returns the unregister function. */
  register: (control: FormFieldControl) => () => void
}

/** Injection key for the enclosing `FormField`'s {@link FormFieldContext}; `null` below the control that claimed it. */
export const formFieldContextKey: InjectionKey<FormFieldContext | null> =
  Symbol('hareui-form-field')
