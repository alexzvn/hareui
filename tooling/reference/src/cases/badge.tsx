import type { ReactElement } from 'react'
import { Badge } from '@heroui/react'

const box = <div className="size-10 rounded-full bg-default" />
const icon = <svg className="size-2.5" viewBox="0 0 16 16"><path d="M2 2h12v12H2z" fill="currentColor" /></svg>

export const cases: Record<string, () => ReactElement> = {
  'badge-basic': () => <Badge.Anchor>{box}<Badge color="danger" size="sm">5</Badge></Badge.Anchor>,
  'badge-dot': () => <Badge.Anchor>{box}<Badge color="success" size="sm" /></Badge.Anchor>,
  'badge-sm': () => <Badge.Anchor>{box}<Badge size="sm">New</Badge></Badge.Anchor>,
  'badge-lg': () => <Badge.Anchor>{box}<Badge color="danger" size="lg">99+</Badge></Badge.Anchor>,
  'badge-secondary-warning': () => <Badge.Anchor>{box}<Badge color="warning" variant="secondary">5</Badge></Badge.Anchor>,
  'badge-soft-accent': () => <Badge.Anchor>{box}<Badge color="accent" variant="soft">5</Badge></Badge.Anchor>,
  'badge-primary-success': () => <Badge.Anchor>{box}<Badge color="success">5</Badge></Badge.Anchor>,
  'badge-top-left': () => <Badge.Anchor>{box}<Badge color="accent" placement="top-left" size="sm" /></Badge.Anchor>,
  'badge-bottom-right': () => <Badge.Anchor>{box}<Badge color="accent" placement="bottom-right" size="sm" /></Badge.Anchor>,
  'badge-bottom-left': () => <Badge.Anchor>{box}<Badge color="accent" placement="bottom-left" size="sm" /></Badge.Anchor>,
  'badge-icon': () => <Badge.Anchor>{box}<Badge color="accent" size="sm">{icon}</Badge></Badge.Anchor>,
  'badge-custom': () => <Badge.Anchor>{box}<Badge className="min-w-5 font-semibold tabular-nums" color="accent" size="sm" variant="soft">5</Badge></Badge.Anchor>,
  'badge-standalone': () => <div className="relative size-10"><Badge color="danger">3</Badge></div>,
}
