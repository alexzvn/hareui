import type { ReactElement } from 'react'
import { Button, ButtonGroup } from '@heroui/react'

const three = (props: Record<string, unknown> = {}, separator = true) => (
  <ButtonGroup {...props}>
    <Button>First</Button>
    <Button>{separator && <ButtonGroup.Separator />}Second</Button>
    <Button>{separator && <ButtonGroup.Separator />}Third</Button>
  </ButtonGroup>
)

export const cases: Record<string, () => ReactElement> = {
  'button-group-basic': () => three({}, false),
  'button-group-separator': () => three({ variant: 'tertiary' }),
  'button-group-outline': () => three({ variant: 'outline' }),
  'button-group-vertical': () => three({ orientation: 'vertical', variant: 'secondary' }),
  'button-group-single': () => <ButtonGroup variant="outline"><Button>Only</Button></ButtonGroup>,
  'button-group-sm-secondary': () => three({ size: 'sm', variant: 'secondary' }),
  'button-group-full-width': () => <div className="w-[400px]">{three({ fullWidth: true })}</div>,
  'button-group-disabled': () => (
    <ButtonGroup isDisabled>
      <Button>First</Button>
      <Button isDisabled={false}><ButtonGroup.Separator />Enabled</Button>
    </ButtonGroup>
  ),
  'button-group-rounded-override': () => (
    <ButtonGroup>
      <Button className="rounded-none">Square</Button>
      <Button className="rounded-none"><ButtonGroup.Separator />Edges</Button>
    </ButtonGroup>
  ),
}
