import type { ReactElement } from 'react'
import { Button, Card } from '@heroui/react'
import { gear } from '../icons'

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
cases['card-leading'] = () => (
  <Card className="w-[400px]">
    <div className="size-6">{gear()}</div>
    <Card.Header>
      <Card.Title>Become an Acme Creator!</Card.Title>
      <Card.Description>Visit the Acme Creator Hub to sign up today.</Card.Description>
    </Card.Header>
    <Card.Footer><Button>Join</Button></Card.Footer>
  </Card>
)
cases['card-horizontal'] = () => (
  <Card className="w-[500px] items-stretch flex-row">
    <div className="size-[120px] shrink-0 rounded-2xl bg-accent" />
    <Card.Content className="gap-3">
      <p>Content body</p>
      <Button className="mt-auto">Apply Now</Button>
    </Card.Content>
  </Card>
)
