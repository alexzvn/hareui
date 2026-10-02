import type { ReactElement, ReactNode } from 'react'
import { Button, Description, Dropdown, Header, Kbd, Label, Separator } from '@heroui/react'

export const cases: Record<string, () => ReactElement> = {}

function Menu({ children, label = 'Actions', popoverClassName, ...menuProps }: { children: ReactNode, label?: string, popoverClassName?: string, selectionMode?: 'single' | 'multiple', defaultSelectedKeys?: string[], disabledKeys?: string[] }) {
  return (
    <Dropdown defaultOpen>
      <Button aria-label="Menu" variant="secondary">{label}</Button>
      <Dropdown.Popover className={popoverClassName}>
        <Dropdown.Menu {...menuProps}>{children}</Dropdown.Menu>
      </Dropdown.Popover>
    </Dropdown>
  )
}

type Key = 'command' | 'shift'

function Shortcut({ keys, content }: { keys: Key[], content: string }) {
  return (
    <Kbd className="ms-auto" slot="keyboard" variant="light">
      {keys.map(k => <Kbd.Abbr key={k} keyValue={k} />)}
      <Kbd.Content>{content}</Kbd.Content>
    </Kbd>
  )
}

function Item({ id, label, danger, description, kbd, indicator, submenu }: { id: string, label: string, danger?: boolean, description?: string, kbd?: [Key[], string], indicator?: 'checkmark' | 'dot', submenu?: boolean }) {
  return (
    <Dropdown.Item id={id} textValue={label} variant={danger ? 'danger' : undefined}>
      {indicator && <Dropdown.ItemIndicator type={indicator} />}
      {description
        ? (
            <div className="flex flex-col">
              <Label>{label}</Label>
              <Description>{description}</Description>
            </div>
          )
        : <Label>{label}</Label>}
      {kbd && <Shortcut keys={kbd[0]} content={kbd[1]} />}
      {submenu && <Dropdown.SubmenuIndicator />}
    </Dropdown.Item>
  )
}

cases['dropdown-default'] = () => (
  <Menu>
    <Item id="new-file" label="New file" />
    <Item id="copy-link" label="Copy link" />
    <Item id="edit-file" label="Edit file" />
    <Item id="delete-file" label="Delete file" danger />
  </Menu>
)

cases['dropdown-descriptions'] = () => (
  <Menu>
    <Item id="new-file" label="New file" description="Create a new file" kbd={[['command'], 'N']} />
    <Item id="edit-file" label="Edit file" description="Make changes" kbd={[['command'], 'E']} />
    <Item id="delete-file" label="Delete file" description="Move to trash" danger kbd={[['command', 'shift'], 'D']} />
  </Menu>
)

cases['dropdown-keyboard-shortcuts'] = () => (
  <Menu>
    <Item id="new" label="New" kbd={[['command'], 'N']} />
    <Item id="open" label="Open" kbd={[['command'], 'O']} />
    <Item id="save" label="Save" kbd={[['command'], 'S']} />
    <Item id="delete" label="Delete" danger kbd={[['command', 'shift'], 'D']} />
  </Menu>
)

cases['dropdown-sections'] = () => (
  <Menu>
    <Dropdown.Section>
      <Header>Actions</Header>
      <Item id="new-file" label="New file" />
      <Item id="edit-file" label="Edit file" />
    </Dropdown.Section>
    <Separator />
    <Dropdown.Section>
      <Header>Danger zone</Header>
      <Item id="delete-file" label="Delete file" danger />
    </Dropdown.Section>
  </Menu>
)

cases['dropdown-disabled'] = () => (
  <Menu disabledKeys={['copy-link', 'delete-file']}>
    <Item id="new-file" label="New file" />
    <Item id="copy-link" label="Copy link" />
    <Item id="edit-file" label="Edit file" />
    <Item id="delete-file" label="Delete file" danger />
  </Menu>
)

function Fruits({ selected, mode, indicator = 'checkmark' }: { selected: string[], mode: 'single' | 'multiple', indicator?: 'checkmark' | 'dot' }) {
  return (
    <Menu label="Fruit" popoverClassName="min-w-[256px]" selectionMode={mode} defaultSelectedKeys={selected}>
      <Dropdown.Section>
        <Header>Select a fruit</Header>
        <Item id="apple" label="Apple" indicator={indicator} />
        <Item id="banana" label="Banana" indicator={indicator} />
        <Item id="cherry" label="Cherry" indicator={indicator} />
      </Dropdown.Section>
      <Item id="orange" label="Orange" indicator={indicator} />
      <Item id="pear" label="Pear" indicator={indicator} />
    </Menu>
  )
}

cases['dropdown-single-selection'] = () => <Fruits selected={['apple']} mode="single" />
cases['dropdown-multiple-selection'] = () => <Fruits selected={['apple', 'orange']} mode="multiple" />
cases['dropdown-dot-indicator'] = () => <Fruits selected={['banana']} mode="single" indicator="dot" />

cases['dropdown-submenu'] = () => (
  <Menu>
    <Item id="new-file" label="New file" />
    <Dropdown.SubmenuTrigger>
      <Item id="share" label="Share" submenu />
      <Dropdown.Popover>
        <Dropdown.Menu>
          <Item id="whatsapp" label="WhatsApp" />
          <Item id="telegram" label="Telegram" />
        </Dropdown.Menu>
      </Dropdown.Popover>
    </Dropdown.SubmenuTrigger>
    <Item id="delete-file" label="Delete file" danger />
  </Menu>
)
