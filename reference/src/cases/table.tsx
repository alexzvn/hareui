import type { ReactElement } from 'react'
import { Table } from '@heroui/react'

export const cases: Record<string, () => ReactElement> = {}

const rows = [
  { id: 1, name: 'Kate Moore', role: 'CEO', status: 'Active', email: 'kate@acme.com' },
  { id: 2, name: 'John Smith', role: 'CTO', status: 'Active', email: 'john@acme.com' },
  { id: 3, name: 'Sara Johnson', role: 'CMO', status: 'On Leave', email: 'sara@acme.com' },
]
const cols = [['name', 'Name'], ['role', 'Role'], ['status', 'Status'], ['email', 'Email']] as const

function T(props: { variant?: 'primary' | 'secondary', sortable?: boolean, empty?: boolean }): ReactElement {
  return (
    <Table variant={props.variant}>
      <Table.ScrollContainer>
        <Table.Content
          aria-label="Team members"
          className="min-w-[600px]"
          sortDescriptor={props.sortable ? { column: 'name', direction: 'descending' } : undefined}
        >
          <Table.Header>
            {cols.map(([id, label]) => (
              <Table.Column key={id} allowsSorting={props.sortable} id={id} isRowHeader={id === 'name'}>
                {props.sortable
                  ? ({ sortDirection }) => <Table.SortableColumnHeader sortDirection={sortDirection}>{label}</Table.SortableColumnHeader>
                  : label}
              </Table.Column>
            ))}
          </Table.Header>
          <Table.Body
            renderEmptyState={props.empty ? () => <div className="flex h-full w-full items-center justify-center p-8 text-sm text-muted">No results found</div> : undefined}
          >
            {(props.empty ? [] : (props.sortable ? [...rows].sort((a, b) => b.name.localeCompare(a.name)) : rows)).map(r => (
              <Table.Row key={r.id} id={r.id}>
                <Table.Cell>{r.name}</Table.Cell>
                <Table.Cell>{r.role}</Table.Cell>
                <Table.Cell>{r.status}</Table.Cell>
                <Table.Cell>{r.email}</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Content>
      </Table.ScrollContainer>
    </Table>
  )
}

cases['table-basic'] = () => <T />
cases['table-secondary'] = () => <T variant="secondary" />
cases['table-sorting'] = () => <T sortable />
cases['table-empty'] = () => <T empty />
cases['table-tree'] = () => (
  <Table>
    <Table.ScrollContainer>
      <Table.Content aria-label="Tree" className="min-w-[600px]" defaultExpandedKeys={['a']} treeColumn="name">
        <Table.Header>
          <Table.Column isRowHeader id="name">Name</Table.Column>
          <Table.Column id="size">Size</Table.Column>
        </Table.Header>
        <Table.Body>
          <Table.Row id="a">
            <Table.Cell>Folder</Table.Cell>
            <Table.Cell>-</Table.Cell>
            <Table.Row id="b">
              <Table.Cell>File</Table.Cell>
              <Table.Cell>1 KB</Table.Cell>
            </Table.Row>
          </Table.Row>
        </Table.Body>
      </Table.Content>
    </Table.ScrollContainer>
  </Table>
)
