import type { ReactElement } from 'react'
import { Switch, SwitchGroup } from '@heroui/react'

type Props = Parameters<typeof SwitchGroup>[0]

function group(props: Omit<Props, 'children'> = {}) {
  return (
    <SwitchGroup {...props}>
      <Switch name="notifications">
        <Switch.Content>
          <Switch.Control>
            <Switch.Thumb />
          </Switch.Control>
          Allow Notifications
        </Switch.Content>
      </Switch>
      <Switch name="marketing">
        <Switch.Content>
          <Switch.Control>
            <Switch.Thumb />
          </Switch.Control>
          Marketing emails
        </Switch.Content>
      </Switch>
      <Switch name="social">
        <Switch.Content>
          <Switch.Control>
            <Switch.Thumb />
          </Switch.Control>
          Social media updates
        </Switch.Content>
      </Switch>
    </SwitchGroup>
  )
}

export const cases: Record<string, () => ReactElement> = {
  'switch-group-vertical': () => group(),
  'switch-group-horizontal': () => group({ orientation: 'horizontal' }),
}
