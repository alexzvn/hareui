import type { ReactElement } from 'react'
import { Button, Spinner } from '@heroui/react'
import { gear } from '../icons'

export const cases: Record<string, () => ReactElement> = {}

for (const variant of ['primary', 'secondary', 'tertiary', 'ghost', 'outline', 'danger', 'danger-soft'] as const)
  cases[`button-${variant}`] = () => <Button variant={variant}>Button</Button>
for (const size of ['sm', 'lg'] as const)
  cases[`button-size-${size}`] = () => <Button size={size}>Button</Button>
cases['button-full-width'] = () => <div className="w-80"><Button fullWidth>Button</Button></div>
for (const size of ['sm', 'md', 'lg'] as const)
  cases[`button-icon-only-${size}`] = () => <Button isIconOnly size={size} variant="secondary" aria-label="Settings">{gear()}</Button>
cases['button-with-icon'] = () => <Button>{gear()}Settings</Button>
cases['button-disabled'] = () => <Button isDisabled>Button</Button>
cases['button-pending'] = () => (
  <Button isPending>
    {({ isPending }) => (
      <>
        {isPending ? <Spinner color="current" size="sm" /> : null}
        Uploading...
      </>
    )}
  </Button>
)
