import type { ReactElement } from 'react'
import { Description, Switch } from '@heroui/react'
import { gear } from '../icons'

type Props = Parameters<typeof Switch>[0]

function sw(props: Omit<Props, 'children'>, label: string | null = 'Enable notifications', extra?: ReactElement) {
  return (
    <Switch {...props}>
      <Switch.Content>
        <Switch.Control>
          <Switch.Thumb />
        </Switch.Control>
        {label}
      </Switch.Content>
      {extra}
    </Switch>
  )
}

export const cases: Record<string, () => ReactElement> = {
  'switch-default': () => sw({}),
  'switch-size-sm': () => sw({ size: 'sm' }),
  'switch-size-lg': () => sw({ size: 'lg' }),
  'switch-checked': () => sw({ defaultSelected: true }),
  'switch-checked-sm': () => sw({ defaultSelected: true, size: 'sm' }),
  'switch-checked-lg': () => sw({ defaultSelected: true, size: 'lg' }),
  'switch-disabled': () => sw({ isDisabled: true }),
  'switch-disabled-checked': () => sw({ isDisabled: true, defaultSelected: true }),
  'switch-with-description': () => sw({}, 'Public profile', <Description>Allow others to see your profile information</Description>),
  'switch-with-description-sm': () => sw({ size: 'sm' }, 'Public profile', <Description>Allow others to see your profile information</Description>),
  'switch-with-description-lg': () => sw({ size: 'lg' }, 'Public profile', <Description>Allow others to see your profile information</Description>),
  'switch-no-label': () => sw({ 'aria-label': 'Enable notifications' }, null),
  'switch-with-icon': () => (
    <Switch defaultSelected size="lg" aria-label="Settings">
      <Switch.Content>
        <Switch.Control>
          <Switch.Thumb>
            <Switch.Icon>{gear()}</Switch.Icon>
          </Switch.Thumb>
        </Switch.Control>
      </Switch.Content>
    </Switch>
  ),
  'switch-control-bg-override': () => (
    <Switch defaultSelected>
      <Switch.Content>
        <Switch.Control className="bg-green-500/80">
          <Switch.Thumb />
        </Switch.Control>
        Enable notifications
      </Switch.Content>
    </Switch>
  ),
  'switch-invalid': () => sw({ isInvalid: true }),
  'switch-readonly': () => sw({ isReadOnly: true, defaultSelected: true }),
}
