import type { DropdownEntry, DropdownValue } from '@hareui/vue'
import type { VNode } from 'vue'
import { Button, Dropdown } from '@hareui/vue'
import { h } from 'vue'

export const cases: Record<string, () => VNode> = {}

function menu(items: DropdownEntry[], props: Record<string, unknown> = {}, label = 'Actions') {
  return () => h(Dropdown, { defaultOpen: true, items, ...props }, { default: () => h(Button, { 'aria-label': 'Menu', 'variant': 'secondary' }, () => label) })
}

const fruits = (selected: DropdownValue[], selectionMode: 'single' | 'multiple', indicator: 'checkmark' | 'dot' = 'checkmark') => menu([
  { type: 'section', label: 'Select a fruit', items: [
    { value: 'apple', label: 'Apple' },
    { value: 'banana', label: 'Banana' },
    { value: 'cherry', label: 'Cherry' },
  ] },
  { value: 'orange', label: 'Orange' },
  { value: 'pear', label: 'Pear' },
], { selectionMode, indicator, defaultValue: selected, class: 'min-w-[256px]' }, 'Fruit')

cases['dropdown-default'] = menu([
  { value: 'new-file', label: 'New file' },
  { value: 'copy-link', label: 'Copy link' },
  { value: 'edit-file', label: 'Edit file' },
  { value: 'delete-file', label: 'Delete file', variant: 'danger' },
])

cases['dropdown-descriptions'] = menu([
  { value: 'new-file', label: 'New file', description: 'Create a new file', kbd: { keys: 'command', content: 'N' } },
  { value: 'edit-file', label: 'Edit file', description: 'Make changes', kbd: { keys: 'command', content: 'E' } },
  { value: 'delete-file', label: 'Delete file', description: 'Move to trash', variant: 'danger', kbd: { keys: ['command', 'shift'], content: 'D' } },
])

cases['dropdown-keyboard-shortcuts'] = menu([
  { value: 'new', label: 'New', kbd: { keys: 'command', content: 'N' } },
  { value: 'open', label: 'Open', kbd: { keys: 'command', content: 'O' } },
  { value: 'save', label: 'Save', kbd: { keys: 'command', content: 'S' } },
  { value: 'delete', label: 'Delete', variant: 'danger', kbd: { keys: ['command', 'shift'], content: 'D' } },
])

const sections: DropdownEntry[] = [
  { type: 'section', label: 'Actions', items: [
    { value: 'new-file', label: 'New file' },
    { value: 'edit-file', label: 'Edit file' },
  ] },
  { type: 'separator' },
  { type: 'section', label: 'Danger zone', items: [
    { value: 'delete-file', label: 'Delete file', variant: 'danger' },
  ] },
]
cases['dropdown-sections'] = menu(sections)

cases['dropdown-disabled'] = menu([
  { value: 'new-file', label: 'New file' },
  { value: 'copy-link', label: 'Copy link', disabled: true },
  { value: 'edit-file', label: 'Edit file' },
  { value: 'delete-file', label: 'Delete file', variant: 'danger', disabled: true },
])

cases['dropdown-single-selection'] = fruits(['apple'], 'single')
cases['dropdown-multiple-selection'] = fruits(['apple', 'orange'], 'multiple')
cases['dropdown-dot-indicator'] = fruits(['banana'], 'single', 'dot')

cases['dropdown-submenu'] = menu([
  { value: 'new-file', label: 'New file' },
  { value: 'share', label: 'Share', items: [
    { value: 'whatsapp', label: 'WhatsApp' },
    { value: 'telegram', label: 'Telegram' },
  ] },
  { value: 'delete-file', label: 'Delete file', variant: 'danger' },
])
