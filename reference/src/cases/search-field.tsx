import type { ReactElement } from 'react'
import { FieldError, Label, SearchField } from '@heroui/react'

interface FieldProps {
  variant?: 'primary' | 'secondary'
  isRequired?: boolean
  isDisabled?: boolean
  isInvalid?: boolean
  isReadOnly?: boolean
  fullWidth?: boolean
  value?: string
  ui?: { group?: string, input?: string }
}

function Field({ value, ui = {}, ...props }: FieldProps) {
  return (
    <SearchField value={value} {...props}>
      <Label>Search</Label>
      <SearchField.Group className={ui.group}>
        <SearchField.SearchIcon />
        <SearchField.Input className={ui.input} placeholder="Search..." />
        <SearchField.ClearButton />
      </SearchField.Group>
      {props.isInvalid && <FieldError>Search query must be at least 3 characters</FieldError>}
    </SearchField>
  )
}

export const cases: Record<string, () => ReactElement> = {
  'search-field-default': () => <Field />,
  'search-field-focus': () => <Field />,
  'search-field-with-value': () => <Field value="cats" />,
  'search-field-secondary': () => <Field variant="secondary" />,
  'search-field-required': () => <Field isRequired />,
  'search-field-disabled': () => <Field isDisabled value="Disabled search" />,
  'search-field-invalid': () => <Field isInvalid />,
  'search-field-full-width': () => <Field fullWidth />,
  'search-field-readonly': () => <Field isReadOnly value="jane@example.com" />,
  'search-field-user-overrides': () => <Field variant="secondary" ui={{ group: 'rounded-xl bg-default', input: 'text-center' }} />,
}
