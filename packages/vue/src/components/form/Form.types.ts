import type { VNode } from 'vue'

import type { ValidationBehavior, ValidationErrors } from './context'
import type {
  FormData,
  FormError,
  FormErrorEvent,
  FormErrorWithId,
  FormInputEvents,
  FormSchema,
  FormState,
  FormSubmitEvent,
  InferInput,
} from './types'

/** Props of `Form`: a `<form>` that validates its fields with a schema or a function, and shares validation behavior and server errors with them. */
export type FormProps<S extends FormSchema, T extends boolean = true, N extends boolean = false> = {
  /**
   * Validation behavior for the fields inside. `native` blocks submission and shows errors on change or submit;
   * `aria` shows errors in realtime and never blocks submission. A field's own `validationBehavior` wins.
   * A `nested` form inherits its parent's.
   * @defaultValue 'native'
   */
  validationBehavior?: ValidationBehavior
  /** Server-side errors keyed by field `name`. Shown immediately; a field's error clears once the user changes it. */
  validationErrors?: ValidationErrors
  /** Schema to validate the form state: any [Standard Schema](https://standardschema.dev) (Zod, Valibot, ArkType, Yup, Effect Schema, …) or a Superstruct struct. */
  schema?: S
  /** A reactive object holding the form's state. A `nested` form reads its parent's. */
  state?: N extends false ? FormState<S> : never
  /** Custom validation of the form state. Returns errors with the `name` of the field they belong to. */
  validate?: (state: Partial<InferInput<S>>) => FormError[] | Promise<FormError[]>
  /**
   * The field events that trigger validation of that field. The form always validates on submit.
   * @defaultValue ['input', 'blur', 'change']
   */
  validateOn?: FormInputEvents[]
  /**
   * Delay in milliseconds before validating on input.
   * @defaultValue 300
   */
  validateOnInputDelay?: number
  /**
   * Whether `@submit` receives the schema's output (with its transformations) instead of the state.
   * @defaultValue true
   */
  transform?: T
  /**
   * Disables every field inside.
   * @defaultValue false
   */
  disabled?: boolean
  /** The `name` of the `<form>`. For a `nested` form, the path of its state within the parent's. */
  name?: string
  /**
   * Attaches the form to its parent `Form`, which validates it along with its own fields. Renders a `<div>`.
   * @defaultValue false
   */
  nested?: N & boolean
  /**
   * Disables the fields while `@submit` runs, until its promise settles.
   * @defaultValue true
   */
  loadingAuto?: boolean
  /**
   * Called on submission. With a `state`, `schema`, `validate` or nested forms, only once validation passes, with the
   * validated state as `event.data`, and the native submission is prevented; a returned promise is awaited
   * (`loadingAuto`). Otherwise it receives the native event, without `data`.
   */
  onSubmit?: (event: FormSubmitEvent<FormData<S, T>>) => unknown
}

/** Events emitted by `Form`. `submit` is the `onSubmit` prop instead, so the form can await it (`loadingAuto`). */
export type FormEmits = {
  /** Submission was blocked by validation errors. */
  error: [event: FormErrorEvent]
}

/** Props passed to the `default` slot. */
export type FormSlotProps = {
  /** The current `schema` / `validate` errors. */
  errors: FormErrorWithId[]
  /** Whether a submission is in progress. */
  loading: boolean
}

/** Slots of `Form`. */
export type FormSlots = {
  /** Fields and buttons. */
  default?: (props: FormSlotProps) => VNode[]
}
