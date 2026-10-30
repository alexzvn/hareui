import type { ReactElement } from 'react'
import { Label } from '@heroui/react'

export const cases: Record<string, () => ReactElement> = {
  'label-default': () => <Label>Email</Label>,
  'label-disabled': () => <Label isDisabled>Email</Label>,
  'label-invalid': () => <Label isInvalid>Email</Label>,
  'label-required': () => <Label isRequired>Email</Label>,
}
