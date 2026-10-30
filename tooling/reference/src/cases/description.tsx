import type { ReactElement } from 'react'
import { Description } from '@heroui/react'

export const cases: Record<string, () => ReactElement> = {
  'description-default': () => <Description>We'll never share your email with anyone else.</Description>,
}
