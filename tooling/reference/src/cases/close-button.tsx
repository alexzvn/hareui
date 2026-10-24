import type { ReactElement } from 'react'
import { CloseButton } from '@heroui/react'

export const cases: Record<string, () => ReactElement> = {
  'close-button-default': () => <CloseButton />,
  'close-button-disabled': () => <CloseButton isDisabled />,
}
