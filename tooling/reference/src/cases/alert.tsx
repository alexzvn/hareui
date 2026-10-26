import type { ReactElement } from 'react'
import { Alert, Button, CloseButton, Spinner } from '@heroui/react'

export const cases: Record<string, () => ReactElement> = {}

const title = 'New features available'
const description = 'Check out our latest updates including dark mode support and improved accessibility features.'

for (const status of ['default', 'accent', 'success', 'warning', 'danger'] as const) {
  cases[`alert-${status}`] = () => (
    <Alert status={status} className="w-[480px]">
      <Alert.Indicator />
      <Alert.Content>
        <Alert.Title>{title}</Alert.Title>
        <Alert.Description>{description}</Alert.Description>
      </Alert.Content>
    </Alert>
  )
}

cases['alert-title-only'] = () => (
  <Alert status="success" className="w-[480px]">
    <Alert.Indicator />
    <Alert.Content>
      <Alert.Title>Profile updated successfully</Alert.Title>
    </Alert.Content>
    <CloseButton />
  </Alert>
)
cases['alert-custom-indicator'] = () => (
  <Alert status="accent" className="w-[480px]">
    <Alert.Indicator>
      <Spinner size="sm" />
    </Alert.Indicator>
    <Alert.Content>
      <Alert.Title>Processing your request</Alert.Title>
      <Alert.Description>Please wait while we sync your data.</Alert.Description>
    </Alert.Content>
  </Alert>
)
cases['alert-actions'] = () => (
  <Alert status="danger" className="w-[480px]">
    <Alert.Indicator />
    <Alert.Content>
      <Alert.Title>Unable to connect to server</Alert.Title>
      <Alert.Description>We're experiencing connection issues.</Alert.Description>
      <Button className="mt-2" size="sm" variant="danger">Retry</Button>
    </Alert.Content>
    <Button size="sm" variant="danger">Retry</Button>
  </Alert>
)
cases['alert-no-indicator'] = () => (
  <Alert className="w-[480px]">
    <Alert.Content>
      <Alert.Title>{title}</Alert.Title>
      <Alert.Description>{description}</Alert.Description>
    </Alert.Content>
  </Alert>
)
cases['alert-ui-override'] = () => (
  <Alert status="warning" className="w-[480px] rounded-xl border border-warning/20 shadow-sm">
    <Alert.Indicator className="text-warning" />
    <Alert.Content>
      <Alert.Title className="text-base">{title}</Alert.Title>
      <Alert.Description className="text-xs">{description}</Alert.Description>
    </Alert.Content>
  </Alert>
)
