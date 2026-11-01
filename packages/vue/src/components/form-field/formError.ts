import type { FormError } from '@/components/form/types'

/** The field whose `Form` errors to look up. */
type FormErrorOwner = {
  /** The field's name: errors for exactly this name belong to it. */
  name?: string
  /** Errors whose name matches it belong to the field too. */
  pattern?: RegExp
}

const belongsTo = (error: FormError, { name, pattern }: FormErrorOwner) =>
  (!!name && error.name === name) ||
  (!!pattern && error.name !== undefined && pattern.test(error.name))

/** The first of `errors` that belongs to `owner`, by name or pattern; `undefined` when none does. */
export const getFormError = <E extends FormError>(errors: readonly E[], owner: FormErrorOwner) =>
  errors.find((error) => belongsTo(error, owner))
