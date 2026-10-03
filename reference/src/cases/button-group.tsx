import type { ReactElement } from 'react'
import { Button, ButtonGroup, Description, Dropdown, Label } from '@heroui/react'

const three = (props: Record<string, unknown> = {}, separator = true) => (
  <ButtonGroup {...props}>
    <Button>First</Button>
    <Button>{separator && <ButtonGroup.Separator />}Second</Button>
    <Button>{separator && <ButtonGroup.Separator />}Third</Button>
  </ButtonGroup>
)

const chevronDown = (
  <svg aria-hidden="true" fill="none" height="1em" viewBox="0 0 16 16" width="1em">
    <path d="M3.5 6 8 10.5 12.5 6" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
  </svg>
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
  // docs/demos/button-group/basic.vue split button, menu open
  'button-group-dropdown': () => (
    <div style={{ marginBottom: '320px' }}>
      <ButtonGroup>
        <Button>Merge pull request</Button>
        <Dropdown defaultOpen>
          <Button isIconOnly aria-label="More options">
            <ButtonGroup.Separator />
            {chevronDown}
          </Button>
          <Dropdown.Popover className="max-w-[290px]" placement="bottom end">
            <Dropdown.Menu>
              <Dropdown.Item className="flex flex-col items-start gap-1" id="merge" textValue="Create a merge commit">
                <Label>Create a merge commit</Label>
                <Description>All commits from this branch will be added to the base branch</Description>
              </Dropdown.Item>
              <Dropdown.Item className="flex flex-col items-start gap-1" id="squash-and-merge" textValue="Squash and merge">
                <Label>Squash and merge</Label>
                <Description>The 14 commits from this branch will be combined into one commit in the base branch</Description>
              </Dropdown.Item>
              <Dropdown.Item className="flex flex-col items-start gap-1" id="rebase-and-merge" textValue="Rebase and merge">
                <Label>Rebase and merge</Label>
                <Description>The 14 commits from this branch will be rebased and added to the base branch</Description>
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown.Popover>
        </Dropdown>
      </ButtonGroup>
    </div>
  ),
}
