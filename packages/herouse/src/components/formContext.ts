import type { InjectionKey, Ref } from 'vue'

/** A validation error: one message or several. */
export type ValidationError = string | string[]

/** Server-side errors keyed by field `name`, as passed to `Form`'s `validationErrors`. */
export type ValidationErrors = Record<string, ValidationError>

/**
 * `native` blocks form submission and shows errors on change / submit; `aria` shows errors in realtime
 * and never blocks submission.
 */
export type ValidationBehavior = 'native' | 'aria'

export interface FormContext {
  validationBehavior: Readonly<Ref<ValidationBehavior>>
  validationErrors: Readonly<Ref<ValidationErrors | undefined>>
}

export const formContextKey: InjectionKey<FormContext> = Symbol('herouse-form')
