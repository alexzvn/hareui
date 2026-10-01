import type { ReactElement } from 'react'
import { Description, FieldError, Input, Label, TextField } from '@heroui/react'

function Field(props: { variant?: 'primary' | 'secondary', isRequired?: boolean, isDisabled?: boolean, isInvalid?: boolean, fullWidth?: boolean }) {
  return (
    <TextField {...props}>
      <Label>Email</Label>
      <Input placeholder="john@example.com" />
      <Description>We'll never share your email.</Description>
      {props.isInvalid && <FieldError>Please enter a valid email address</FieldError>}
    </TextField>
  )
}

export const cases: Record<string, () => ReactElement> = {
  'textfield-default': () => <Field />,
  'textfield-secondary': () => <Field variant="secondary" />,
  'textfield-required': () => <Field isRequired />,
  'textfield-disabled': () => <Field isDisabled />,
  'textfield-invalid': () => <Field isInvalid />,
  'textfield-full-width': () => <Field fullWidth />,
  'textfield-readonly': () => (
    <TextField isReadOnly defaultValue="jane@example.com">
      <Label>Email</Label>
      <Input placeholder="john@example.com" />
      <Description>We'll never share your email.</Description>
    </TextField>
  ),
}
