// Port of React Aria's `useFormValidationState` (react-stately) and `useFormValidation` (react-aria).
// Precedence: controlled `invalid` > server errors (`Form` `validationErrors`) > `validate()` and the `Form`'s
// `schema` / `validate` errors > native constraint validity.
// `native`: errors appear once committed (on `change`, on the form's `invalid` event) and block submission via
// `setCustomValidity`. `aria`: errors appear in realtime and never block submission.
// The `Form`'s `schema` / `validate` errors show as soon as the form reports them (per its `validateOn`), and never
// block native submission: the form validates again on submit.
import type { ComputedRef } from 'vue'
import type { FormInputEvent, ValidationBehavior, ValidationError } from '../components/form/context'
import type { FormFieldProps, FormInputEvents } from '../components/form/types'
import { computed, inject, nextTick, onBeforeUnmount, onMounted, ref, shallowRef, watch } from 'vue'
import { formContextKey } from '../components/form/context'

/** Snapshot of the native `ValidityState` flags. */
export interface ValidationDetails {
  badInput: boolean
  customError: boolean
  patternMismatch: boolean
  rangeOverflow: boolean
  rangeUnderflow: boolean
  stepMismatch: boolean
  tooLong: boolean
  tooShort: boolean
  typeMismatch: boolean
  valueMissing: boolean
  valid: boolean
}

export interface ValidationResult {
  /** Whether the field is currently displayed as invalid. */
  isInvalid: boolean
  /** The current error messages. */
  validationErrors: string[]
  /** The native validity flags behind the errors. */
  validationDetails: ValidationDetails
}

/** Returns an error message (or several) for an invalid value; `true`, `null` or `undefined` when valid. */
export type ValidateFn<T> = (value: T) => ValidationError | true | null | undefined

export interface FieldValidationOptions<T> {
  value: () => T | null | undefined
  validate: () => ValidateFn<T> | undefined
  /** The controlled `invalid` prop; `undefined` when not set. */
  invalid: () => boolean | undefined
  validationBehavior: () => ValidationBehavior | undefined
  /** Field name, used to look up server and form errors. */
  name: () => string | undefined
  /** Element that is or contains the native form control(s). */
  root: () => Element | null | undefined
  /** Called on form reset, to restore the initial value. */
  onReset?: () => void
  /** The field's form-validation props. */
  formField?: FormFieldProps
}

const VALID: ValidationDetails = {
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
}
const CUSTOM: ValidationDetails = { ...VALID, customError: true, valid: false }
const DEFAULT: ValidationResult = { isInvalid: false, validationErrors: [], validationDetails: VALID }

type Control = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
const CONTROLS = 'input:not([type="hidden"]), select, textarea'
// Where focus goes when the field is the form's first invalid one: the visible control, or Reka's checkbox / switch / radio button
const FOCUSABLE = 'input:not([type="hidden"]):not([aria-hidden="true"]), select, textarea, [role="checkbox"], [role="switch"], [role="radio"][tabindex="0"]'

function asArray(v: ValidationError | null | undefined): string[] {
  if (!v)
    return []
  return Array.isArray(v) ? v : [v]
}

function errorResult(errors: string[]): ValidationResult | null {
  return errors.length ? { isInvalid: true, validationErrors: errors, validationDetails: CUSTOM } : null
}

function isEqual(a: ValidationResult, b: ValidationResult) {
  return a === b || (a.isInvalid === b.isInvalid
    && a.validationErrors.length === b.validationErrors.length
    && a.validationErrors.every((e, i) => e === b.validationErrors[i])
    && (Object.keys(VALID) as (keyof ValidationDetails)[]).every(k => a.validationDetails[k] === b.validationDetails[k]))
}

function controls(root: Element): Control[] {
  return root.matches(CONTROLS) ? [root as Control] : [...root.querySelectorAll<Control>(CONTROLS)]
}

function nativeValidity(controls: Control[]): ValidationResult {
  const errors = new Set<string>()
  const details = { ...VALID }
  for (const el of controls) {
    if (el.validationMessage)
      errors.add(el.validationMessage)
    for (const k of Object.keys(VALID) as (keyof ValidationDetails)[]) {
      if (k !== 'valid')
        details[k] ||= el.validity[k]
    }
  }
  details.valid = controls.every(el => el.validity.valid)
  return { isInvalid: !details.valid, validationErrors: [...errors], validationDetails: details }
}

function firstInvalid(form: HTMLFormElement) {
  return [...form.elements].find(el => (el as Control).validity?.valid === false)
}

export function useFieldValidation<T>(options: FieldValidationOptions<T>): {
  /** The validation state to display (drives `invalid`, `aria-invalid` and FieldError). */
  validation: ComputedRef<ValidationResult>
  /** Commits the current value's validation (native behavior), e.g. after a stepper press that fires no `change`. */
  commitValidation: () => void
} {
  const form = inject(formContextKey, null)
  const behavior = computed(() => options.validationBehavior() ?? form?.validationBehavior.value ?? 'native')
  const controlledError = computed<ValidationResult | null>(() => {
    const invalid = options.invalid()
    return invalid === undefined ? null : { isInvalid: invalid, validationErrors: [], validationDetails: CUSTOM }
  })
  const clientError = computed(() => {
    const validate = options.validate()
    const value = options.value()
    if (!validate || value == null)
      return null
    const error = validate(value)
    return errorResult(error && typeof error !== 'boolean' ? asArray(error) : [])
  })

  // The first form error for this field, by name or `errorPattern`
  const formError = computed(() => {
    const name = options.name()
    const pattern = options.formField?.errorPattern
    if (!form || (!name && !pattern))
      return null
    const match = form.errors.value.find(error => (!!name && error.name === name) || (!!pattern && error.name !== undefined && pattern.test(error.name)))
    return match ? errorResult([match.message]) : null
  })
  function withFormError(shown: ValidationResult): ValidationResult {
    const error = formError.value
    if (!error)
      return shown
    return shown.isInvalid
      ? { isInvalid: true, validationErrors: [...shown.validationErrors, ...error.validationErrors], validationDetails: shown.validationDetails }
      : error
  }

  // Server errors show when the form receives a new `validationErrors` object and clear once the user commits a change
  const serverErrorCleared = ref(false)
  watch(() => form?.validationErrors.value, () => {
    serverErrorCleared.value = false
  })
  const serverError = computed(() => {
    const name = options.name()
    return serverErrorCleared.value || !name ? null : errorResult(asArray(form?.validationErrors.value?.[name]))
  })

  const current = shallowRef(DEFAULT)
  // Native validity captured while no custom error is set, committed on change / invalid
  let nextValidation = DEFAULT

  const realtime = computed(() => controlledError.value ?? serverError.value ?? clientError.value ?? DEFAULT)
  const validation = computed(() => controlledError.value ?? serverError.value ?? withFormError(behavior.value === 'native'
    ? current.value
    : clientError.value ?? current.value))

  function sync() {
    const root = options.root()
    if (!root)
      return
    const els = controls(root).filter(el => !el.disabled)
    const native = behavior.value === 'native'
    const message = native && realtime.value.isInvalid ? realtime.value.validationErrors.join(' ') || 'Invalid value.' : ''
    for (const el of els) {
      el.setCustomValidity(message)
      // Suppress the browser's validation tooltip on hover
      if (native && !el.hasAttribute('title'))
        el.title = ''
    }
    if (native && !realtime.value.isInvalid)
      nextValidation = nativeValidity(els)
  }
  watch([realtime, () => options.value(), behavior], sync, { flush: 'post' })

  // Reports a field event to the surrounding `Form`, which tracks it and validates the field per its `validateOn`
  function emitFormEvent(type: FormInputEvents, flags?: Omit<FormInputEvent, 'type' | 'name'>) {
    const name = options.name()
    if (form && name)
      form.emit({ type, name, ...flags })
  }
  let inputTimer: ReturnType<typeof setTimeout> | undefined
  // Tracked right away so a submit within the delay isn't followed by a late dirty mark or validation
  function emitFormInput(eager: boolean) {
    emitFormEvent('input', { validate: false })
    clearTimeout(inputTimer)
    const delay = options.formField?.validateOnInputDelay ?? form?.validateOnInputDelay.value ?? 0
    inputTimer = setTimeout(() => emitFormEvent('input', { eager, track: false }), delay)
  }
  onBeforeUnmount(() => clearTimeout(inputTimer))

  function commit() {
    serverErrorCleared.value = true
    if (behavior.value !== 'native')
      return
    // After the next render, so the latest value has been validated
    nextTick(() => {
      sync()
      const next = clientError.value ?? nextValidation
      if (!isEqual(next, current.value))
        current.value = next
    })
  }

  // Called by fields whose user changes fire no native `change` (Reka controls, stepper presses): a committed change
  // that also counts as input, validated right away
  function commitValidation() {
    commit()
    emitFormEvent('change')
    emitFormInput(true)
  }

  function resetValidation() {
    current.value = DEFAULT
    serverErrorCleared.value = true
  }

  // Whether focus at `node` is still within the field: inside its root, or in a popup one of its controls owns
  function isWithin(root: Element, node: EventTarget | null) {
    if (!(node instanceof Node))
      return false
    if (root.contains(node))
      return true
    return [...root.querySelectorAll('[aria-controls]')].some(el => el.getAttribute('aria-controls')!.split(/\s+/)
      .some(id => !!id && !!document.getElementById(id)?.contains(node)))
  }

  watch(() => options.name(), (name, _, onCleanup) => {
    if (!form || !name)
      return
    onCleanup(form.registerInput(name, {
      id: () => {
        const root = options.root()
        return (root?.querySelector<HTMLElement>(FOCUSABLE) ?? root)?.id || undefined
      },
      pattern: () => options.formField?.errorPattern,
    }))
  }, { immediate: true })

  // Attached on mount (template refs are set by then) and re-attached if the root element changes
  let attached: Element | null | undefined
  let detach: (() => void) | undefined
  function attach() {
    const root = options.root()
    if (root === attached)
      return
    detach?.()
    detach = undefined
    attached = root
    if (!root)
      return
    const formEl = root.closest('form')
    const onInvalid = (event: Event) => {
      if (!(event.target instanceof Element) || !controls(root).includes(event.target as Control))
        return
      // Only commit when nothing is displayed yet, so server errors the user didn't fix stay visible
      if (!validation.value.isInvalid)
        commit()
      const targetForm = (event.target as Control).form
      if (!event.defaultPrevented && targetForm && firstInvalid(targetForm) === event.target)
        (root.querySelector<HTMLElement>(FOCUSABLE) ?? root as HTMLElement).focus({ focusVisible: true } as FocusOptions)
      // No browser error bubble
      event.preventDefault()
    }
    // Reka's hidden mirror inputs (checkbox, switch, radio) fire `input` / `change` on every value change, programmatic
    // or form reset included; those components commit from their user-driven update handler instead
    const fromUser = (event: Event) => !(event.target instanceof Element) || event.target.getAttribute('aria-hidden') !== 'true'
    const onChange = (event: Event) => {
      if (!fromUser(event))
        return
      commit()
      emitFormEvent('change')
    }
    // Typing validates once the field was first left, unless `eagerValidation`
    const onInput = (event: Event) => {
      if (fromUser(event))
        emitFormInput(!!options.formField?.eagerValidation)
    }
    const onFocusIn = (event: FocusEvent) => {
      if (!isWithin(root, event.relatedTarget))
        emitFormEvent('focus')
    }
    const onFocusOut = (event: FocusEvent) => {
      if (!isWithin(root, event.relatedTarget))
        emitFormEvent('blur')
    }
    const onReset = () => {
      resetValidation()
      options.onReset?.()
    }
    root.addEventListener('invalid', onInvalid, true)
    root.addEventListener('change', onChange)
    root.addEventListener('input', onInput)
    root.addEventListener('focusin', onFocusIn as EventListener)
    root.addEventListener('focusout', onFocusOut as EventListener)
    formEl?.addEventListener('reset', onReset)
    detach = () => {
      root.removeEventListener('invalid', onInvalid, true)
      root.removeEventListener('change', onChange)
      root.removeEventListener('input', onInput)
      root.removeEventListener('focusin', onFocusIn as EventListener)
      root.removeEventListener('focusout', onFocusOut as EventListener)
      formEl?.removeEventListener('reset', onReset)
    }
    sync()
  }
  onMounted(attach)
  watch(() => options.root(), attach, { flush: 'post' })
  onBeforeUnmount(() => detach?.())

  return { validation, commitValidation }
}
