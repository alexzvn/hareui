import type { VNode } from 'vue'
import { Table } from 'herouse'
import { h } from 'vue'

export const cases: Record<string, () => VNode> = {}

const columns = [
  { key: 'name', label: 'Name', isRowHeader: true },
  { key: 'role', label: 'Role' },
  { key: 'status', label: 'Status' },
  { key: 'email', label: 'Email' },
]
const rows = [
  { id: 1, name: 'Kate Moore', role: 'CEO', status: 'Active', email: 'kate@acme.com' },
  { id: 2, name: 'John Smith', role: 'CTO', status: 'Active', email: 'john@acme.com' },
  { id: 3, name: 'Sara Johnson', role: 'CMO', status: 'On Leave', email: 'sara@acme.com' },
]
const ui = { content: 'min-w-[600px]' }

cases['table-basic'] = () => h(Table, { ariaLabel: 'Team members', columns, rows, ui })
cases['table-secondary'] = () => h(Table, { ariaLabel: 'Team members', columns, rows, ui, variant: 'secondary' })
cases['table-sorting'] = () => h(Table, {
  ariaLabel: 'Sortable',
  columns: columns.map(c => ({ ...c, sortable: true })),
  rows: [...rows].sort((a, b) => b.name.localeCompare(a.name)),
  ui,
  defaultSortDescriptor: { column: 'name', direction: 'descending' },
})
cases['table-empty'] = () => h(Table, { ariaLabel: 'Empty', columns, rows: [], ui }, {
  empty: () => h('div', { class: 'flex h-full w-full items-center justify-center p-8 text-sm text-muted' }, 'No results found'),
})
cases['table-tree'] = () => h(Table, {
  ariaLabel: 'Tree',
  columns: [{ key: 'name', label: 'Name', isRowHeader: true }, { key: 'size', label: 'Size' }],
  rows: [{ id: 'a', name: 'Folder', size: '-', children: [{ id: 'b', name: 'File', size: '1 KB' }] }],
  treeColumn: 'name',
  defaultExpandedKeys: new Set(['a']),
  ui,
})
