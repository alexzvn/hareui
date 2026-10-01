import type { ReactElement } from 'react'
import { Input } from '@heroui/react'

const placeholder = 'Enter your name'

export const cases: Record<string, () => ReactElement> = {
  'input-primary': () => <Input placeholder={placeholder} />,
  'input-secondary': () => <Input placeholder={placeholder} variant="secondary" />,
  'input-full-width': () => <Input fullWidth placeholder={placeholder} />,
  'input-disabled': () => <Input disabled placeholder={placeholder} />,
  'input-invalid': () => <Input aria-invalid placeholder={placeholder} />,
  'input-secondary-invalid': () => <Input aria-invalid placeholder={placeholder} variant="secondary" />,
  'input-value': () => <Input defaultValue="Jane Doe" />,
  'input-readonly-default-value': () => <Input readOnly defaultValue="Jane Doe" />,
}
