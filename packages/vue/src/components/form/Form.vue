<template>
  <component
    :is="parent ? 'div' : 'form'"
    ref="form"
    :name="parent ? undefined : name"
    :novalidate="(!parent && validationBehavior !== 'native') || undefined"
    @submit="onSubmit"
    @reset="clear()"
  >
    <slot :errors="errors" :loading="loading" />
  </component>
</template>

<script lang="ts">
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

export interface FormProps<
  S extends FormSchema,
  T extends boolean = true,
  N extends boolean = false,
> {
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

// `submit` is the `onSubmit` prop, so the form can await it (`loadingAuto`)
export interface FormEmits {
  /** Submission was blocked by validation errors. */
  error: [event: FormErrorEvent]
}

export interface FormSlotProps {
  /** The current `schema` / `validate` errors. */
  errors: FormErrorWithId[]
  /** Whether a submission is in progress. */
  loading: boolean
}

export interface FormSlots {
  /** Fields and buttons. */
  default?: (props: FormSlotProps) => any
}
</script>

<script
  setup
  lang="ts"
  generic="S extends FormSchema, T extends boolean = true, N extends boolean = false"
>
import {
  computed,
  inject,
  nextTick,
  onBeforeUnmount,
  onMounted,
  provide,
  reactive,
  ref,
  shallowReactive,
  toRaw,
  useId,
  useTemplateRef,
} from 'vue'

import { getAtPath, setAtPath, validateSchema } from '../../utils/form'
import { fieldsetContextKey, useFieldsetDisabled } from '../fieldset/context'
import type { FormInput, FormInputEvent, NestedForm } from './context'
import { formContextKey } from './context'
import type { Form } from './types'
import { FormValidationException } from './types'

const props = withDefaults(defineProps<FormProps<S, T, N>>(), {
  validationBehavior: undefined,
  validateOn: () => ['input', 'blur', 'change'],
  validateOnInputDelay: 300,
  transform: () => true as T,
  disabled: false,
  loadingAuto: true,
})
const emit = defineEmits<FormEmits>()
defineSlots<FormSlots>()

const formId = useId()
const formEl = useTemplateRef<HTMLFormElement | HTMLDivElement>('form')

const parentForm = inject(formContextKey, null)
// Whether the form is nested is fixed at creation, as its element and its state source depend on it
const parent = props.nested ? parentForm : null

const state = computed<unknown>(() => {
  const parentState = parent?.state.value
  if (parentState) return getAtPath(parentState, props.name)
  return props.state
})

const validationBehavior = computed<ValidationBehavior>(
  () => props.validationBehavior ?? parent?.validationBehavior.value ?? 'native',
)
// A nested form's fields are named relative to its `name`
const validationErrors = computed<ValidationErrors | undefined>(() => {
  const inherited = parent?.validationErrors.value
  if (props.validationErrors || !inherited || !props.name)
    return props.validationErrors ?? inherited
  const prefix = `${props.name}.`
  return Object.fromEntries(
    Object.entries(inherited)
      .filter(([name]) => name.startsWith(prefix))
      .map(([name, error]) => [name.slice(prefix.length), error]),
  )
})

const errors = ref<FormErrorWithId[]>([])
const inputs = new Map<string, FormInput>()
const nestedForms = shallowReactive(new Map<string, NestedForm>())

const dirtyFields = reactive(new Set<string>())
const touchedFields = reactive(new Set<string>())
const blurredFields = reactive(new Set<string>())

// Bumped on every full validation (submit, `validate()`, a parent validating its nested forms):
// input typed and field validations started before it are stale
let epoch = 0
const inputEpochs = new Map<string, number>()
const validationRuns = new Map<string, number>()
const dirtyEpochs = new Map<string, number>()

const loading = ref(false)
const disabled = useFieldsetDisabled(() => props.disabled || loading.value)

function clearDirty() {
  // Fields edited since the last full validation (during an async `@submit`) stay dirty
  for (const field of dirtyFields) {
    if (dirtyEpochs.get(field) !== epoch) dirtyFields.delete(field)
  }
  for (const form of nestedForms.values()) form.clearDirty()
}

function resolveErrorIds(errs: FormError[]): FormErrorWithId[] {
  return errs.map((error) => ({
    ...error,
    id: error.name ? inputs.get(error.name)?.id() : undefined,
  }))
}

let transformedState: unknown = null

async function getErrors(): Promise<FormErrorWithId[]> {
  let errs = props.validate
    ? ((await props.validate(state.value as Partial<InferInput<S>>)) ?? [])
    : []
  if (props.schema) {
    const result = await validateSchema(state.value, props.schema)
    if (result.errors) errs = errs.concat(result.errors)
    else transformedState = result.result
  }
  return resolveErrorIds(errs)
}

function addFormPath(error: FormErrorWithId, formPath?: string): FormErrorWithId {
  return formPath && error.name ? { ...error, name: `${formPath}.${error.name}` } : error
}

type NestedResult =
  | { name?: string; output: unknown; error?: undefined }
  | { name?: string; output?: undefined; error: FormValidationException }

async function validateNestedForm(form: NestedForm, opts: ValidateOptions): Promise<NestedResult> {
  try {
    return { name: form.name, output: await form.validate({ ...opts, silent: false }) }
  } catch (error) {
    if (!(error instanceof FormValidationException)) throw error
    return { name: form.name, error }
  }
}

function nameMatcher(names: string[]): (error: FormErrorWithId) => boolean {
  const nameSet = new Set(names)
  const patterns = names
    .map((name) => inputs.get(name)?.pattern())
    .filter((pattern): pattern is RegExp => !!pattern)
  return (error) =>
    !!error.name &&
    (nameSet.has(error.name) || patterns.some((pattern) => pattern.test(error.name!)))
}

interface ValidateOptions {
  name?: string | string[]
  silent?: boolean
  nested?: boolean
  transform?: boolean
  /** Whether this field validation is still the latest one; a stale one is dropped. */
  isCurrent?: () => boolean
}

async function validate(
  opts: ValidateOptions = { silent: false, nested: false, transform: false },
): Promise<unknown> {
  const names =
    opts.name === undefined ? undefined : Array.isArray(opts.name) ? opts.name : [opts.name]
  if (!names) epoch++

  let nestedResults: NestedResult[] = []
  let nestedErrors: FormErrorWithId[] = []
  if (!names && opts.nested) {
    const results = await Promise.all(
      [...nestedForms.values()].map((form) => validateNestedForm(form, opts)),
    )
    nestedErrors = results.flatMap((r) =>
      r.error ? r.error.errors.map((e) => addFormPath(e, r.name)) : [],
    )
    nestedResults = results.filter((r) => r.output !== undefined)
  }

  const currentErrors = await getErrors()
  if (opts.isCurrent?.() === false) return false

  // Nested errors already carry their nested form's control ids
  const allErrors = [...currentErrors, ...nestedErrors]

  // Only the targeted fields decide the result; errors on other fields are kept as they are
  let failedErrors = allErrors
  if (names) {
    const matches = nameMatcher(names)
    failedErrors = allErrors.filter(matches)
    errors.value = [...errors.value.filter((error) => !matches(error)), ...failedErrors]
  } else {
    errors.value = allErrors
  }

  if (failedErrors.length) {
    if (opts.silent) return false
    throw new FormValidationException(formId, failedErrors)
  }

  if (opts.transform) {
    let output = transformedState
    for (const result of nestedResults) {
      if (result.name && output && typeof output === 'object')
        setAtPath(output, result.name, result.output)
      else
        // A parent without a schema has no output yet: merge into a copy of the state
        output = Object.assign(output ?? { ...toRaw(state.value as object) }, result.output)
    }
    return output ?? state.value
  }
  return state.value
}

async function onInputEvent(event: FormInputEvent) {
  if (event.track !== false) {
    if (event.type === 'blur') blurredFields.add(event.name)
    if (event.type === 'change' || event.type === 'input') {
      dirtyFields.add(event.name)
      dirtyEpochs.set(event.name, epoch)
    }
    if (event.type === 'input') inputEpochs.set(event.name, epoch)
    touchedFields.add(event.name)
  }

  if (event.validate === false || !props.validateOn.includes(event.type) || loading.value) return
  // Input validation waits for the field's first blur (unless eager), and is dropped if a full validation ran since
  if (
    event.type === 'input' &&
    (inputEpochs.get(event.name) !== epoch || !(event.eager || blurredFields.has(event.name)))
  )
    return

  const run = (validationRuns.get(event.name) ?? 0) + 1
  validationRuns.set(event.name, run)
  const startEpoch = epoch
  await validate({
    name: event.name,
    silent: true,
    nested: false,
    isCurrent: () => validationRuns.get(event.name) === run && epoch === startEpoch,
  })
}

// Whether submission goes through validation; a bare form submits natively, as before
const managed = computed(
  () => !!(props.schema || props.validate || props.state !== undefined || nestedForms.size),
)

async function onSubmit(payload: Event) {
  if (!managed.value) {
    props.onSubmit?.(payload as FormSubmitEvent<FormData<S, T>>)
    return
  }
  payload.preventDefault()
  loading.value = props.loadingAuto
  const event = payload as FormSubmitEvent<FormData<S, T>>
  try {
    event.data = (await validate({ nested: true, transform: props.transform })) as FormData<S, T>
    await props.onSubmit?.(event)
    clearDirty()
  } catch (error) {
    if (!(error instanceof FormValidationException)) throw error
    // Re-enable the fields first, so an `@error` handler can focus the first invalid one
    loading.value = false
    await nextTick()
    emit('error', Object.assign(payload as SubmitEvent, { errors: error.errors }))
  } finally {
    loading.value = false
  }
}

function isLocalError(error: FormError) {
  return !error.name || inputs.has(error.name)
}

function matchesTarget(target: string | RegExp | undefined, path?: string) {
  if (!target || !path) return true
  if (target instanceof RegExp) return target.test(path)
  return path === target || target.startsWith(`${path}.`)
}

function nestedTarget(target: string | RegExp | undefined, formPath: string) {
  if (!target || target instanceof RegExp) return target
  if (formPath === target) return undefined
  return target.startsWith(`${formPath}.`) ? target.slice(formPath.length + 1) : target
}

function matchesName(error: FormError, name: string | RegExp) {
  return name instanceof RegExp ? !!error.name && name.test(error.name) : error.name === name
}

function nestedFormErrors(form: NestedForm): FormErrorWithId[] {
  return form.getErrors().map((e) => addFormPath(e, form.name))
}

// This form's own errors: the ones not collected from a nested form (an unnamed nested error looks local)
function ownErrors(): FormErrorWithId[] {
  const fromNested = new Set(
    [...nestedForms.values()].flatMap((form) => form.getErrors().map((e) => toRaw(e))),
  )
  return errors.value.filter((error) => !fromNested.has(toRaw(error)))
}

function stripFormPath(errs: FormError[], formPath?: string): FormError[] {
  if (!formPath) return errs
  const prefix = `${formPath}.`
  return errs
    .filter((e) => e.name?.startsWith(prefix))
    .map((e) => ({ ...e, name: e.name!.slice(prefix.length) }))
}

function setErrors(errs: FormError[], name?: string | RegExp) {
  const localErrors = resolveErrorIds(errs.filter(isLocalError))
  const nested: FormErrorWithId[] = []
  for (const form of nestedForms.values()) {
    if (matchesTarget(name, form.name)) {
      form.setErrors(stripFormPath(errs, form.name), nestedTarget(name, form.name ?? ''))
      nested.push(...nestedFormErrors(form))
    }
  }
  errors.value = name
    ? [
        ...ownErrors().filter((error) => !error.name || !matchesName(error, name)),
        ...localErrors,
        ...nested,
      ]
    : [...localErrors, ...nested]
}

function getFormErrors(name?: string | RegExp) {
  return name ? errors.value.filter((error) => matchesName(error, name)) : errors.value
}

function clear(name?: string | RegExp) {
  const localErrors = name
    ? ownErrors().filter((error) => isLocalError(error) && !matchesName(error, name))
    : []
  const nested: FormErrorWithId[] = []
  for (const form of nestedForms.values()) {
    // A RegExp is written against this form's prefixed names, so it clears a nested form whole
    if (matchesTarget(name, form.name))
      form.clear(name instanceof RegExp ? undefined : nestedTarget(name, form.name ?? ''))
    nested.push(...nestedFormErrors(form))
  }
  errors.value = [...localErrors, ...nested]
}

const dirty = computed(
  () => dirtyFields.size > 0 || [...nestedForms.values()].some((form) => form.dirty()),
)

async function submit() {
  if (formEl.value instanceof HTMLFormElement && !formEl.value.reportValidity()) return
  await onSubmit(new Event('submit', { cancelable: true }))
}

let detach: (() => void) | undefined
onMounted(() => {
  detach = parent?.attach({
    id: formId,
    name: props.name,
    validate,
    clearDirty,
    dirty: () => dirty.value,
    getErrors: () => getFormErrors(),
    setErrors,
    clear,
  })
})
onBeforeUnmount(() => detach?.())

provide(formContextKey, {
  validationBehavior,
  validationErrors,
  errors,
  validateOnInputDelay: computed(() => props.validateOnInputDelay),
  state,
  emit: onInputEvent,
  registerInput(name, input) {
    inputs.set(name, input)
    return () => {
      if (inputs.get(name) === input) inputs.delete(name)
    }
  },
  attach(form) {
    nestedForms.set(form.id, form)
    return () => {
      nestedForms.delete(form.id)
    }
  },
})
provide(fieldsetContextKey, { disabled })

// Refs are unwrapped on the component instance, which matches `FormInstance`
defineExpose({
  validate: validate as Form<S>['validate'],
  errors,
  setErrors: setErrors as Form<S>['setErrors'],
  getErrors: getFormErrors as Form<S>['getErrors'],
  clear: clear as Form<S>['clear'],
  submit,
  disabled,
  loading,
  dirty,
  dirtyFields,
  touchedFields,
  blurredFields,
})
</script>
