import type { ReactElement } from 'react'
import { Button, Card } from '@heroui/react'

export const cases: Record<string, () => ReactElement> = {}

for (const variant of ['default', 'secondary', 'tertiary', 'transparent'] as const) {
  cases[`card-${variant}`] = () => (
    <Card variant={variant} className="w-[400px]">
      <Card.Header>
        <Card.Title>Become an Acme Creator!</Card.Title>
        <Card.Description>Visit the Acme Creator Hub to sign up today and start earning credits from your fans and followers.</Card.Description>
      </Card.Header>
      <Card.Content><p>Content body</p></Card.Content>
      <Card.Footer><Button>Join</Button></Card.Footer>
    </Card>
  )
}
cases['card-content-only'] = () => <Card className="w-[300px]"><Card.Content><p>Only content</p></Card.Content></Card>
