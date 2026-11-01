import type { InjectionKey, Ref } from 'vue'

import type { FormError, FormErrorWithId, FormInputEvents } from './types'

/** A validation error: one message or several. */
export type ValidationError = string | string[]

/** Errors keyed by field `name` (dotted for nested values, e.g. `address.city`), as passed to `Form`'s `validationErrors`. */
export type ValidationErrors = Record<string, ValidationError>

/**
 * `native` blocks form submission and shows errors on change / submit; `aria` shows errors in realtime
 * and never blocks submission.
 */
export type ValidationBehavior = 'native' | 'aria'

/** A field event reported to the form. */
export type FormInputEvent = {
  type: FormInputEvents
  name: string
  /** Validate on input before the field was first left. */
  eager?: boolean
  /** Record the event in the dirty / touched / blurred fields. */
  track?: boolean
  /** Validate the field for this event. */
  validate?: boolean
}

/** A field registered with the form, so errors can point at its control. */
export type FormInput = {
  id: () => string | undefined
  pattern: () => RegExp | undefined
}

/** A `nested` form, as attached to its parent. */
export type NestedForm = {
  id: string
  name?: string
  validate: (opts: { silent?: boolean; nested?: boolean; transform?: boolean }) => Promise<unknown>
  clearDirty: () => void
  dirty: () => boolean
  getErrors: () => FormErrorWithId[]
  setErrors: (errors: FormError[], name?: string | RegExp) => void
  clear: (name?: string | RegExp) => void
}

export type FormContext = {
  validationBehavior: Readonly<Ref<ValidationBehavior>>
  validationErrors: Readonly<Ref<ValidationErrors | undefined>>
  /** The form's `schema` / `validate` errors. */
  errors: Readonly<Ref<FormErrorWithId[]>>
  /** The form's `validateOnInputDelay`. */
  validateOnInputDelay: Readonly<Ref<number>>
  /** The form's state, which `nested` forms read from. */
  state: Readonly<Ref<unknown>>
  /** Whether a submission is in progress (`loadingAuto`): a `loadingAuto` submit `Button` shows pending meanwhile. */
  loading: Readonly<Ref<boolean>>
  /** Reports a field's input, change, blur or focus; the form tracks it and validates the field per `validateOn`. */
  emit: (event: FormInputEvent) => void
  /** Registers a named field. Returns the unregister function. */
  registerInput: (name: string, input: FormInput) => () => void
  /** Attaches a `nested` form, validated along with this one. Returns the detach function. */
  attach: (form: NestedForm) => () => void
}

export const formContextKey: InjectionKey<FormContext> = Symbol('hareui-form')
