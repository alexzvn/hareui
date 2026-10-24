import type { StandardSchemaV1, SuperstructSchema } from '@/utils/form'

/** A schema the form can validate with: any Standard Schema (Zod, Valibot, ArkType, Yup, Effect Schema, …) or a Superstruct struct. */
export type FormSchema<I extends object = object, O extends object = I> =
  | StandardSchemaV1<I, O>
  | SuperstructSchema<O>

/** The schema's input type: what the form's `state` holds once filled in. */
export type InferInput<S> = S extends StandardSchemaV1
  ? StandardSchemaV1.InferInput<S>
  : S extends SuperstructSchema<infer I>
    ? I
    : never

/** The schema's output type: the parsed values `@submit` receives. */
export type InferOutput<S> = S extends StandardSchemaV1
  ? StandardSchemaV1.InferOutput<S>
  : S extends SuperstructSchema<infer O>
    ? O
    : never

type FormStateLeaf =
  | Date
  | Blob
  | RegExp
  | Map<unknown, unknown>
  | Set<unknown>
  | ((...args: never[]) => unknown)

type FormStateValue<T> = T extends FormStateLeaf
  ? T | null | undefined
  : T extends object
    ? { [K in keyof T]?: FormStateValue<T[K]> } | null | undefined
    : T extends number | bigint
      ? T | '' | null | undefined
      : T | null | undefined

/** The form's values before validation: any value can be empty, and a cleared number input holds `''`. */
export type FormState<S extends FormSchema> = NonNullable<FormStateValue<InferInput<S>>>

/** The schema's output when `T` (the form's `transform`) is `true`, its input otherwise. */
export type FormData<S extends FormSchema, T extends boolean = true> = T extends true
  ? InferOutput<S>
  : InferInput<S>

/** A field name of the schema's input; dotted paths (`address.city`) are accepted too. */
export type FormFieldName<S extends FormSchema> = (keyof InferInput<S> & string) | (string & {})

/** The field events that trigger validation. */
export type FormInputEvents = 'input' | 'blur' | 'change' | 'focus'

export type FormError<P extends string = string> = {
  /** The `name` of the field the error belongs to; empty for form-level errors. */
  name?: P
  message: string
}

export type FormErrorWithId = {
  /** The id of the field's control, to focus or scroll to it. */
  id?: string
} & FormError

export type FormSubmitEvent<T> = SubmitEvent & {
  /** The validated state: the schema's output unless `transform` is `false`. */
  data: T
}

export type FormErrorEvent = SubmitEvent & {
  /** The errors that blocked submission. */
  errors: FormErrorWithId[]
}

/** Thrown by `validate()` (without `silent`) when the form has errors. */
export class FormValidationException extends Error {
  formId: string
  errors: FormErrorWithId[]

  constructor(formId: string, errors: FormErrorWithId[]) {
    super('Form validation exception')
    this.formId = formId
    this.errors = errors
    Object.setPrototypeOf(this, FormValidationException.prototype)
  }
}

export type FormValidateOptions<S extends FormSchema, T extends boolean = false> = {
  /** Only validate these fields; errors on other fields are kept. */
  name?: FormFieldName<S> | FormFieldName<S>[]
  /** Resolve to `false` instead of throwing a `FormValidationException` when invalid. */
  silent?: boolean
  /** Also validate the nested forms. */
  nested?: boolean
  /** Resolve to the schema's output instead of the state. */
  transform?: T
}

/** The form's exposed instance, from a template ref. */
export type Form<S extends FormSchema> = {
  /** Validates the state, shows the errors, and resolves to the state (or the schema's output with `transform`). */
  validate: <T extends boolean = false>(
    opts?: FormValidateOptions<S, T>,
  ) => Promise<FormData<S, T> | false>
  /** Clears the errors of a field (by name or pattern), or all errors. */
  clear: (path?: FormFieldName<S> | RegExp) => void
  /** The current `schema` / `validate` errors. */
  errors: FormErrorWithId[]
  /** Replaces the errors of a field (by name or pattern), or all errors. */
  setErrors: (errors: FormError[], name?: FormFieldName<S> | RegExp) => void
  /** The errors of a field (by name or pattern), or all errors. */
  getErrors: (name?: FormFieldName<S> | RegExp) => FormErrorWithId[]
  /** Runs native constraint validation, then submits like a submit button. */
  submit: () => Promise<void>
  /** Whether the form's fields are disabled: its `disabled` prop, or a submission in progress with `loadingAuto`. */
  disabled: boolean
  /** Whether the user changed a field since the last successful submission. */
  dirty: boolean
  /** Whether a submission is in progress. */
  loading: boolean
  /** Fields the user changed. */
  dirtyFields: ReadonlySet<string>
  /** Fields the user focused, changed or left. */
  touchedFields: ReadonlySet<string>
  /** Fields the user left. */
  blurredFields: ReadonlySet<string>
}

/** Form-validation props shared by every field. */
export type FormFieldProps = {
  /** Shows form errors whose name matches this pattern too, e.g. `/^tags\..+/` for errors on array items (`tags.0`). */
  errorPattern?: RegExp
  /**
   * Validates on input right away, instead of after the field is first left.
   * @defaultValue false
   */
  eagerValidation?: boolean
  /** Delay in milliseconds before validating on input. Defaults to the form's `validateOnInputDelay`. */
  validateOnInputDelay?: number
}
