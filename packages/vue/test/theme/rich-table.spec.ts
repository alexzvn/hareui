import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import RichTable from '@/components/rich-table/RichTable.vue'

type Person = {
  id: string
  name: string
  role: string
}

const people: Person[] = [
  { id: 'a', name: 'Kate', role: 'CEO' },
  { id: 'b', name: 'John', role: 'CTO' },
  { id: 'c', name: 'Sara', role: 'CEO' },
]

const columns = [
  { accessorKey: 'name', header: 'Name' },
  { accessorKey: 'role', header: 'Role' },
]

describe('RichTable theme', () => {
  it('maps the loading bar color and animation onto the header while loading', async () => {
    const wrapper = mount(RichTable, {
      props: {
        data: people,
        columns,
        loading: true,
        loadingBar: { color: 'danger', animation: 'swing' },
      },
    })

    const thead = wrapper.get('thead').classes().join(' ')
    expect(thead).toContain('after:bg-danger')
    expect(thead).toContain('motion-safe:after:animate-rich-table-swing')
    await wrapper.setProps({ loading: false })
    expect(wrapper.get('thead').classes().join(' ')).not.toContain('after:bg-danger')
  })

  it.each([
    [true, true, true],
    ['header', true, false],
    ['footer', false, true],
  ] as const)('sticky=%s', (sticky, header, footer) => {
    const wrapper = mount(RichTable, {
      props: { data: people, columns: [{ accessorKey: 'name', footer: 'x' }], sticky },
    })

    expect(wrapper.get('thead').classes().includes('sticky')).toBe(header)
    expect(wrapper.get('tfoot').classes().includes('sticky')).toBe(footer)
  })

  it('merges column and table meta classes into cells and rows', () => {
    const wrapper = mount(RichTable, {
      props: {
        data: people,
        columns: [
          {
            accessorKey: 'name',
            header: 'Name',
            meta: {
              class: {
                th: 'th-meta',
                td: (cell) => (cell.getValue() === 'John' ? 'td-john' : 'td-meta'),
              },
            },
          },
          { accessorKey: 'role', header: 'Role' },
        ],
        meta: { class: { tr: (row) => `row-${(row.original as Person).id}` } },
      },
    })

    expect(wrapper.find('th').classes()).toContain('th-meta')
    const rows = wrapper.findAll('[data-slot="rich-table-row"]')
    expect(rows.map((row) => row.classes().find((c) => c.startsWith('row-')))).toEqual([
      'row-a',
      'row-b',
      'row-c',
    ])

    const cells = rows.map((row) => row.find('td'))
    expect(cells[0]!.classes()).toContain('td-meta')
    expect(cells[1]!.classes()).toContain('td-john')
  })
})
