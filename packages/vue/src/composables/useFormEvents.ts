import { inject, onScopeDispose } from 'vue'

import { formFieldContextKey } from '@/components/form-field/context'
import type { FormInputEvent } from '@/components/form/context'
import { formContextKey } from '@/components/form/context'
import type { FormInputEvents } from '@/components/form/types'

/** Options of {@link useFormEvents}. */
type UseFormEventsOptions = {
  /** The name events are reported under; without one, nothing is reported. */
  name: () => string | undefined
  /** The control's own `validateOnInputDelay`, ahead of its `FormField`'s and its `Form`'s. */
  validateOnInputDelay?: () => number | undefined
}

/** Flags of a reported event besides its type and name. */
type FormEventFlags = Omit<FormInputEvent, 'type' | 'name'>

/** Reports a control's events to the surrounding `Form`, which tracks them and validates per its `validateOn`. */
export const useFormEvents = (options: UseFormEventsOptions) => {
  const form = inject(formContextKey, null)
  const field = inject(formFieldContextKey, null)

  const emitFormEvent = (type: FormInputEvents, flags?: FormEventFlags) => {
    const name = options.name()
    if (form && name) form.emit({ type, name, ...flags })
  }

  let inputTimer: ReturnType<typeof setTimeout> | undefined
  onScopeDispose(() => clearTimeout(inputTimer))

  // Tracked right away so a submit within the delay isn't followed by a late dirty mark or validation
  const emitFormInput = (eager: boolean) => {
    emitFormEvent('input', { validate: false })
    clearTimeout(inputTimer)

    const delay =
      options.validateOnInputDelay?.() ??
      field?.validateOnInputDelay.value ??
      form?.validateOnInputDelay.value ??
      0

    inputTimer = setTimeout(() => emitFormEvent('input', { eager, track: false }), delay)
  }

  return { emitFormEvent, emitFormInput }
}
