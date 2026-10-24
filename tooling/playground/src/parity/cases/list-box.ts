import type { VNode } from 'vue'
import { ListBox } from '@hareui/vue'
import { h } from 'vue'

const users = [
  { value: '1', label: 'Bob', description: 'bob@heroui.com' },
  { value: '2', label: 'Fred', description: 'fred@heroui.com' },
  { value: '3', label: 'Martha', description: 'martha@heroui.com' },
]
const base = { 'aria-label': 'Users', 'class': 'w-[220px]', 'items': users }

export const cases: Record<string, () => VNode> = {
  'list-box-default': () => h(ListBox, base),
  'list-box-focus': () => h(ListBox, base),
  'list-box-selected': () => h(ListBox, { ...base, defaultValue: '2' }),
  'list-box-multiple': () => h(ListBox, { ...base, selectionMode: 'multiple', defaultValue: ['1', '3'] }),
  'list-box-sections': () => h(ListBox, {
    'aria-label': 'File actions',
    'class': 'w-[256px] p-2',
    'selectionMode': 'none',
    'items': [
      { type: 'section', label: 'Actions', items: [{ value: 'new', label: 'New file', description: 'Create a new file' }, { value: 'edit', label: 'Edit file' }] },
      { type: 'separator' },
      { type: 'section', label: 'Danger zone', items: [{ value: 'delete', label: 'Delete file', description: 'Move to trash', variant: 'danger' }] },
    ],
  }),
  'list-box-disabled-item': () => h(ListBox, { ...base, items: [users[0]!, { ...users[1]!, disabled: true }] }),
  'list-box-action': () => h(ListBox, { ...base, selectionMode: 'none' }),
  'list-box-user-overrides': () => h(ListBox, { ...base, defaultValue: '1', class: 'w-56 rounded-xl border border-border/80 bg-surface p-1 shadow-sm', ui: { item: 'rounded-lg data-[focused=true]:bg-accent/10 data-[selected=true]:bg-accent/5' } }),
}
