import type { ReactElement } from 'react'
import { Description, Header, Label, ListBox, Separator } from '@heroui/react'

const users = [
  { id: '1', label: 'Bob', description: 'bob@heroui.com' },
  { id: '2', label: 'Fred', description: 'fred@heroui.com' },
  { id: '3', label: 'Martha', description: 'martha@heroui.com' },
]

function Users({ indicator = true, disabled = false, itemClass, ...props }: { indicator?: boolean, disabled?: boolean, itemClass?: string } & Record<string, any>) {
  const list = disabled ? users.slice(0, 2) : users
  return (
    <ListBox aria-label="Users" className="w-[220px]" selectionMode="single" disabledKeys={disabled ? ['2'] : undefined} {...props}>
      {list.map(u => (
        <ListBox.Item key={u.id} className={itemClass} id={u.id} textValue={u.label}>
          <div className="flex flex-col">
            <Label>{u.label}</Label>
            <Description>{u.description}</Description>
          </div>
          {indicator && <ListBox.ItemIndicator />}
        </ListBox.Item>
      ))}
    </ListBox>
  )
}

export const cases: Record<string, () => ReactElement> = {
  'list-box-default': () => <Users />,
  'list-box-focus': () => <Users />,
  'list-box-selected': () => <Users defaultSelectedKeys={['2']} />,
  'list-box-multiple': () => <Users selectionMode="multiple" defaultSelectedKeys={['1', '3']} />,
  'list-box-sections': () => (
    <ListBox aria-label="File actions" className="w-[256px] p-2" selectionMode="none">
      <ListBox.Section>
        <Header>Actions</Header>
        <ListBox.Item id="new" textValue="New file">
          <div className="flex flex-col">
            <Label>New file</Label>
            <Description>Create a new file</Description>
          </div>
        </ListBox.Item>
        <ListBox.Item id="edit" textValue="Edit file">
          Edit file
        </ListBox.Item>
      </ListBox.Section>
      <Separator />
      <ListBox.Section>
        <Header>Danger zone</Header>
        <ListBox.Item id="delete" textValue="Delete file" variant="danger">
          <div className="flex flex-col">
            <Label>Delete file</Label>
            <Description>Move to trash</Description>
          </div>
        </ListBox.Item>
      </ListBox.Section>
    </ListBox>
  ),
  'list-box-disabled-item': () => <Users disabled />,
  'list-box-action': () => <Users indicator={false} selectionMode="none" />,
  'list-box-user-overrides': () => <Users className="w-56 rounded-xl border border-border/80 bg-surface p-1 shadow-sm" defaultSelectedKeys={['1']} itemClass="rounded-lg data-[focused=true]:bg-accent/10 data-[selected=true]:bg-accent/5" />,
}
