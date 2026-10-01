import type { ReactElement } from 'react'
import { FieldError, Input, Label, TextField } from '@heroui/react'

export const cases: Record<string, () => ReactElement> = {
  'field-error-default': () => (
    <TextField isInvalid>
      <Label>Email</Label>
      <Input placeholder="john@example.com" />
      <FieldError>Please enter a valid email address</FieldError>
    </TextField>
  ),
}
