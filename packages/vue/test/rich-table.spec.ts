import type { Row } from '@tanstack/vue-table'
import { getGroupedRowModel, getPaginationRowModel } from '@tanstack/vue-table'
import type { VueWrapper } from '@vue/test-utils'
import { flushPromises, mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { h, nextTick, reactive } from 'vue'

import type {
  RichTableApi,
  RichTableColumn,
  RichTableData,
  RichTableProps,
} from '@/components/rich-table'
import RichTable from '@/components/rich-table/RichTable.vue'

import { expectAccessible } from './a11y'

// `mount` cannot infer a generic SFC's type parameter (it resolves `T` to `unknown`): this checks the props against
// `RichTableProps<T>` with `T` inferred from `data`; the `v-model` props (`sorting`, `rowSelection`...) go through the index signature.
const mountTable = <T extends RichTableData>(options: {
  props: RichTableProps<T> & Record<string, unknown>
  slots?: Record<string, string>
  attachTo?: Element
}): VueWrapper => {
  return mount(RichTable as unknown as Parameters<typeof mount>[0], options) as VueWrapper
}

type Person = {
  id: string
  name: string
  role: string
  age: number
}

const people: Person[] = [
  { id: 'a', name: 'Kate', role: 'CEO', age: 41 },
  { id: 'b', name: 'John', role: 'CTO', age: 35 },
  { id: 'c', name: 'Sara', role: 'CEO', age: 29 },
]

const columns: RichTableColumn<Person>[] = [
  {
    accessorKey: 'name',
    header: ({ column }) =>
      h(
        'button',
        { 'data-testid': 'sort-name', onClick: column.getToggleSortingHandler() },
        'Name',
      ),
    enableSorting: true,
  },
  { accessorKey: 'role', header: 'Role' },
]

const tableApiOf = (wrapper: VueWrapper) => {
  return (wrapper.vm as unknown as { tableApi: RichTableApi<Person> }).tableApi
}

const bodyRows = (wrapper: VueWrapper) => {
  return wrapper.findAll('[data-slot="rich-table-row"]')
}

const names = (wrapper: VueWrapper) => {
  return bodyRows(wrapper).map((row) => row.findAll('td')[0]!.text())
}

describe('RichTable', () => {
  it('creates one titled column per key of the first row when columns are omitted', () => {
    const wrapper = mountTable({ props: { data: people } })
    expect(wrapper.findAll('th').map((th) => th.text())).toEqual(['Id', 'Name', 'Role', 'Age'])
    expect(bodyRows(wrapper)).toHaveLength(3)

    expect(
      bodyRows(wrapper)[0]!
        .findAll('td')
        .map((td) => td.text()),
    ).toEqual(['a', 'Kate', 'CEO', '41'])
  })

  it('renders column-id cell, header and footer slots in place of the definition', () => {
    const wrapper = mountTable({
      props: {
        data: people,
        columns: [
          { accessorKey: 'name', header: 'Name', footer: 'End' },
          { accessorKey: 'role', header: 'Role' },
        ],
      },
      slots: {
        'name-cell': '<template #name-cell="{ row }"><b>{{ row.original.name }}!</b></template>',
        'name-header': '<template #name-header="{ column }"><i>{{ column.id }}</i></template>',
        'name-footer': '<template #name-footer><u>total</u></template>',
      },
    })

    expect(bodyRows(wrapper)[0]!.findAll('td')[0]!.html()).toContain('<b>Kate!</b>')
    expect(wrapper.find('thead th').html()).toContain('<i>name</i>')
    expect(wrapper.find('tfoot th').html()).toContain('<u>total</u>')
  })

  it('only renders a footer when a column defines one', () => {
    expect(
      mountTable({ props: { data: people, columns } })
        .find('tfoot')
        .exists(),
    ).toBe(false)

    const withFooter = mountTable({
      props: { data: people, columns: [{ accessorKey: 'name', footer: 'x' }] },
    })

    expect(withFooter.find('tfoot').exists()).toBe(true)
  })

  it('replaces rows when data changes and picks up in-place mutations', async () => {
    const data = [...people]
    const wrapper = mountTable({ props: { data, columns } })
    await wrapper.setProps({ data: people.slice(0, 1) })
    expect(names(wrapper)).toEqual(['Kate'])
    const next = reactive([{ ...people[1]! }])
    await wrapper.setProps({ data: next })
    next[0]!.name = 'Johnny'
    await flushPromises()
    expect(names(wrapper)).toEqual(['Johnny'])
  })

  describe('sorting', () => {
    it('sorts through header handlers and emits update:sorting', async () => {
      const wrapper = mountTable({ props: { data: people, columns } })
      expect(wrapper.find('th').attributes('aria-sort')).toBe('none')
      await wrapper.get('[data-testid="sort-name"]').trigger('click')
      expect(names(wrapper)).toEqual(['John', 'Kate', 'Sara'])
      expect(wrapper.emitted('update:sorting')?.at(-1)).toEqual([[{ id: 'name', desc: false }]])
      expect(wrapper.find('th').attributes('aria-sort')).toBe('ascending')
      await wrapper.get('[data-testid="sort-name"]').trigger('click')
      expect(names(wrapper)).toEqual(['Sara', 'Kate', 'John'])
      expect(wrapper.find('th').attributes('aria-sort')).toBe('descending')
    })

    it('follows a controlled sorting v-model', async () => {
      const wrapper = mountTable({
        props: { data: people, columns, sorting: [{ id: 'name', desc: true }] },
      })

      expect(names(wrapper)).toEqual(['Sara', 'Kate', 'John'])
      await wrapper.setProps({ sorting: [{ id: 'name', desc: false }] })
      expect(names(wrapper)).toEqual(['John', 'Kate', 'Sara'])
    })

    it('does not mark columns without enableSorting as sortable', () => {
      const wrapper = mountTable({ props: { data: people, columns } })
      expect(wrapper.findAll('th')[1]!.attributes('aria-sort')).toBeUndefined()
    })
  })

  describe('filtering', () => {
    it('filters rows with the global filter model', async () => {
      const wrapper = mountTable({ props: { data: people, columns, globalFilter: '' } })
      expect(bodyRows(wrapper)).toHaveLength(3)
      await wrapper.setProps({ globalFilter: 'ceo' })
      expect(names(wrapper)).toEqual(['Kate', 'Sara'])
      await wrapper.setProps({ globalFilter: 'zzz' })
      expect(wrapper.find('[data-slot="rich-table-empty"]').text()).toBe('No data')
    })

    it('filters a column through the exposed table API', async () => {
      const wrapper = mountTable({ props: { data: people, columns } })
      tableApiOf(wrapper).getColumn('role')!.setFilterValue('CTO')
      await nextTick()
      expect(names(wrapper)).toEqual(['John'])

      expect(wrapper.emitted('update:columnFilters')?.at(-1)).toEqual([
        [{ id: 'role', value: 'CTO' }],
      ])
    })
  })

  describe('row selection', () => {
    const selectColumns: RichTableColumn<Person>[] = [
      {
        id: 'select',
        cell: ({ row }) =>
          h('input', {
            type: 'checkbox',
            'data-testid': 'pick',
            checked: row.getIsSelected(),
            onChange: row.getToggleSelectedHandler(),
          }),
      },
      ...columns,
    ]

    it('writes the selection to v-model:row-selection keyed by row id', async () => {
      const wrapper = mountTable({
        props: { data: people, columns: selectColumns, getRowId: (row) => row.id },
      })

      // `getToggleSelectedHandler` reads the checkbox's `checked`: check it, then dispatch `change`
      await wrapper.findAll('[data-testid="pick"]')[1]!.setValue(true)
      expect(wrapper.emitted('update:rowSelection')?.at(-1)).toEqual([{ b: true }])

      expect(bodyRows(wrapper).map((row) => row.attributes('data-selected'))).toEqual([
        'false',
        'true',
        'false',
      ])
    })

    it('reflects a controlled selection', async () => {
      const wrapper = mountTable({
        props: { data: people, columns: selectColumns, rowSelection: { 0: true, 2: true } },
      })

      expect(bodyRows(wrapper).map((row) => row.attributes('data-selected'))).toEqual([
        'true',
        'false',
        'true',
      ])

      await wrapper.setProps({ rowSelection: {} })

      expect(bodyRows(wrapper).every((row) => row.attributes('data-selected') === 'false')).toBe(
        true,
      )
    })
  })

  describe('row events', () => {
    it('calls onSelect on click and Enter/Space, but not for clicks on interactive elements', async () => {
      const onSelect = vi.fn<(event: Event, row: Row<Person>) => void>()
      const wrapper = mountTable({
        props: {
          data: people,
          columns: [
            ...columns,
            { id: 'action', cell: () => h('button', { 'data-testid': 'inner' }, 'x') },
          ],
          onSelect,
        },
      })

      const row = bodyRows(wrapper)[1]!
      expect(row.attributes('tabindex')).toBe('0')
      expect(row.attributes('data-selectable')).toBe('true')
      await row.trigger('click')
      expect(onSelect).toHaveBeenCalledTimes(1)
      expect(onSelect.mock.calls[0]![1].original.name).toBe('John')
      await row.trigger('keydown', { key: 'Enter' })
      expect(onSelect).toHaveBeenCalledTimes(2)
      await row.get('[data-testid="inner"]').trigger('click')
      expect(onSelect).toHaveBeenCalledTimes(2)
    })

    it('reports hover enter and leave, and context menu requests', async () => {
      const onHover = vi.fn<(event: Event, row: Row<Person> | null) => void>()
      const onContextmenu = vi.fn<(event: Event, row: Row<Person>) => void>()
      const second = vi.fn<(event: Event, row: Row<Person>) => void>()
      const wrapper = mountTable({
        props: { data: people, columns, onHover, onContextmenu: [onContextmenu, second] },
      })

      const row = bodyRows(wrapper)[0]!
      await row.trigger('pointerenter')
      expect(onHover.mock.calls[0]![1]!.original.name).toBe('Kate')
      await row.trigger('pointerleave')
      expect(onHover.mock.calls[1]![1]).toBeNull()
      await row.trigger('contextmenu')
      expect(onContextmenu).toHaveBeenCalledTimes(1)
      expect(second).toHaveBeenCalledTimes(1)
    })

    it('is neither focusable nor selectable without handlers', () => {
      const row = bodyRows(mountTable({ props: { data: people, columns } }))[0]!
      expect(row.attributes('tabindex')).toBeUndefined()
      expect(row.attributes('data-selectable')).toBe('false')
    })
  })

  describe('expanded rows', () => {
    it('renders the expanded slot below rows set in v-model:expanded', async () => {
      const wrapper = mountTable({
        props: {
          data: people,
          columns,
          expanded: { 1: true },
          features: { expanded: { getRowCanExpand: () => true } },
        },
        slots: {
          expanded:
            '<template #expanded="{ row }"><p data-testid="detail">{{ row.original.role }}</p></template>',
        },
      })

      const rows = wrapper.findAll('tbody tr')
      expect(rows).toHaveLength(4)
      expect(rows[1]!.attributes('data-expanded')).toBe('true')
      expect(rows[2]!.attributes('data-slot')).toBe('rich-table-expanded-row')
      expect(rows[2]!.get('[data-testid="detail"]').text()).toBe('CTO')
      expect(rows[2]!.get('td').attributes('colspan')).toBe('2')
      await wrapper.setProps({ expanded: {} })
      expect(wrapper.find('[data-testid="detail"]').exists()).toBe(false)
    })

    it('toggles through the row API and emits update:expanded', async () => {
      const wrapper = mountTable({
        props: {
          data: people,
          columns: [
            {
              id: 'toggle',
              cell: ({ row }) =>
                h('button', { 'data-testid': 'toggle', onClick: () => row.toggleExpanded() }),
            },
            ...columns,
          ],
          features: { expanded: { getRowCanExpand: () => true } },
        },
        slots: { expanded: '<template #expanded>more</template>' },
      })

      await wrapper.findAll('[data-testid="toggle"]')[0]!.trigger('click')
      expect(wrapper.emitted('update:expanded')?.at(-1)).toEqual([{ 0: true }])
      expect(wrapper.findAll('[data-slot="rich-table-expanded-row"]')).toHaveLength(1)
    })

    it('renders sub rows from get-sub-rows', async () => {
      type TreeNode = {
        name: string
        children?: TreeNode[]
      }

      const tree: TreeNode[] = [{ name: 'Root', children: [{ name: 'Leaf' }] }]
      const wrapper = mountTable({
        props: {
          data: tree,
          columns: [
            {
              accessorKey: 'name',
              header: 'Name',
              cell: ({ row, getValue }) => `${row.depth}:${getValue<string>()}`,
            },
          ],
          getSubRows: (row) => row.children,
          expanded: true,
        },
      })

      // Rows with sub rows still render the column's `cell`, not TanStack's default `aggregatedCell`
      expect(wrapper.findAll('[data-slot="rich-table-row"]').map((row) => row.text())).toEqual([
        '0:Root',
        '1:Leaf',
      ])

      // Without an `#expanded` slot, expanding only reveals sub rows
      expect(wrapper.findAll('tbody tr')).toHaveLength(2)
    })
  })

  describe('grouping', () => {
    it('renders a group row per distinct value that expands to its rows', async () => {
      const wrapper = mountTable({
        props: {
          data: people,
          columns,
          grouping: ['role'],
          features: { grouping: { getGroupedRowModel: getGroupedRowModel() } },
        },
      })

      expect(bodyRows(wrapper)).toHaveLength(2)
      await wrapper.setProps({ expanded: true })
      expect(bodyRows(wrapper)).toHaveLength(5)
    })

    it('renders aggregated cells on group rows and leaves grouped-by cells of their rows empty', async () => {
      const aggregated: RichTableColumn<Person>[] = [
        { accessorKey: 'role', header: 'Role' },
        {
          accessorKey: 'age',
          header: 'Age',
          aggregationFn: 'sum',
          aggregatedCell: ({ getValue }) => `Total ${getValue<number>()}`,
        },
      ]

      const wrapper = mountTable({
        props: {
          data: people,
          columns: aggregated,
          grouping: ['role'],
          expanded: true,
          features: { grouping: { getGroupedRowModel: getGroupedRowModel() } },
        },
      })

      const cells = bodyRows(wrapper).map((row) => row.findAll('td').map((td) => td.text()))
      expect(cells).toEqual([
        ['CEO', 'Total 70'],
        ['', '41'],
        ['', '29'],
        ['CTO', 'Total 35'],
        ['', '35'],
      ])
    })
  })

  describe('pinning', () => {
    const wide: RichTableColumn<Person>[] = [
      { accessorKey: 'name', header: 'Name', size: 100 },
      { accessorKey: 'role', header: 'Role', size: 80 },
      { accessorKey: 'age', header: 'Age', size: 60 },
      { accessorKey: 'id', header: 'Id', size: 40 },
    ]

    it('marks pinned columns by side and offsets them by the sizes pinned before them', () => {
      const wrapper = mountTable({
        props: {
          data: people,
          columns: wide,
          columnPinning: { left: ['name', 'role'], right: ['id', 'age'] },
        },
      })

      const cells = bodyRows(wrapper)[0]!.findAll('td')

      // Visual order: pinned left, center, pinned right
      expect(cells.map((td) => td.attributes('data-pinned'))).toEqual([
        'left',
        'left',
        'right',
        'right',
      ])

      expect(cells[0]!.attributes('style')).toContain('--rich-table-pin: 0px')
      expect(cells[1]!.attributes('style')).toContain('--rich-table-pin: 100px')

      // `right` offsets count the sizes of the pinned columns after, in the right group
      expect(cells[3]!.attributes('style')).toContain('--rich-table-pin: 0px')
      expect(cells[2]!.attributes('style')).toContain('--rich-table-pin: 60px')

      expect(wrapper.findAll('th').map((th) => th.attributes('data-pinned'))).toEqual([
        'left',
        'left',
        'right',
        'right',
      ])
    })

    it('leaves unpinned columns plain and moves a column when the pinning model changes', async () => {
      const wrapper = mountTable({
        props: { data: people, columns: wide, columnPinning: { left: [], right: [] } },
      })

      expect(wrapper.findAll('th').every((th) => th.attributes('data-pinned') === undefined)).toBe(
        true,
      )

      await wrapper.setProps({ columnPinning: { left: ['age'], right: [] } })
      expect(wrapper.findAll('th').map((th) => th.text())).toEqual(['Age', 'Name', 'Role', 'Id'])
      expect(wrapper.findAll('th')[0]!.attributes('data-pinned')).toBe('left')
      expect(bodyRows(wrapper)[0]!.findAll('td')[0]!.attributes('data-pinned')).toBe('left')
    })

    it('pins rows to the top and bottom', async () => {
      const wrapper = mountTable({
        props: {
          data: people,
          columns,
          rowPinning: { top: ['b'], bottom: ['a'] },
          getRowId: (row: Person) => row.id,
        },
      })

      expect(names(wrapper)).toEqual(['John', 'Sara', 'Kate'])

      expect(bodyRows(wrapper).map((row) => row.attributes('data-pinned'))).toEqual([
        'top',
        undefined,
        'bottom',
      ])
    })
  })

  describe('column visibility, order and sizing', () => {
    it('hides columns from the visibility model', async () => {
      const wrapper = mountTable({
        props: { data: people, columns, columnVisibility: { role: false } },
      })

      expect(wrapper.findAll('th').map((th) => th.text())).toEqual(['Name'])
      await wrapper.setProps({ columnVisibility: {} })
      expect(wrapper.findAll('th')).toHaveLength(2)
    })

    it('applies column order', () => {
      const wrapper = mountTable({
        props: { data: people, columns, columnOrder: ['role', 'name'] },
      })

      expect(wrapper.findAll('th').map((th) => th.text())).toEqual(['Role', 'Name'])
    })

    it('only sets widths once sizing is enabled, and body cells follow sizing changes', async () => {
      const plain = mountTable({
        props: { data: people, columns: [{ accessorKey: 'name', size: 120 }] },
      })

      expect(plain.find('th').attributes('style') ?? '').not.toContain('width')

      const sized = mountTable({
        props: {
          data: people,
          columns: [{ accessorKey: 'name', size: 120 }],
          features: { columnSizing: { enableColumnResizing: true } },
        },
      })

      expect(sized.find('th').attributes('style')).toContain('width: 120px')
      expect(sized.find('td').attributes('style')).toContain('width: 120px')
      await sized.setProps({ columnSizing: { name: 200 } })
      expect(sized.find('td').attributes('style')).toContain('width: 200px')
    })
  })

  describe('pagination', () => {
    it('paginates client-side only with a pagination row model', async () => {
      const many = Array.from({ length: 5 }, (_, i) => ({
        id: String(i),
        name: `P${i}`,
        role: 'x',
        age: i,
      }))

      expect(bodyRows(mountTable({ props: { data: many, columns } }))).toHaveLength(5)

      const wrapper = mountTable({
        props: {
          data: many,
          columns,
          features: { pagination: { getPaginationRowModel: getPaginationRowModel() } },
          pagination: { pageIndex: 0, pageSize: 2 },
        },
      })

      expect(names(wrapper)).toEqual(['P0', 'P1'])
      await wrapper.setProps({ pagination: { pageIndex: 2, pageSize: 2 } })
      expect(names(wrapper)).toEqual(['P4'])
    })

    it('emits update:pagination from the table API', async () => {
      const many = Array.from({ length: 5 }, (_, i) => ({
        id: String(i),
        name: `P${i}`,
        role: 'x',
        age: i,
      }))

      const wrapper = mountTable({
        props: {
          data: many,
          columns,
          features: { pagination: { getPaginationRowModel: getPaginationRowModel() } },
          initialState: { pagination: { pageIndex: 0, pageSize: 2 } },
        },
      })

      tableApiOf(wrapper).nextPage()
      await nextTick()
      expect(wrapper.emitted('update:pagination')?.at(-1)).toEqual([{ pageIndex: 1, pageSize: 2 }])
      expect(names(wrapper)).toEqual(['P2', 'P3'])
    })
  })

  describe('empty and loading states', () => {
    it('shows the empty text, prop and slot, spanning every visible column', () => {
      const wrapper = mountTable({ props: { data: [], columns } })
      const cell = wrapper.get('[data-slot="rich-table-empty"]')
      expect(cell.text()).toBe('No data')
      expect(cell.attributes('colspan')).toBe('2')

      expect(
        mountTable({ props: { data: [], columns, empty: 'Nothing here' } })
          .get('[data-slot="rich-table-empty"]')
          .text(),
      ).toBe('Nothing here')

      const slotted = mountTable({
        props: { data: [], columns },
        slots: { empty: '<template #empty><em>Custom</em></template>' },
      })

      expect(slotted.get('[data-slot="rich-table-empty"]').html()).toContain('<em>Custom</em>')
    })

    it('shows the loading slot instead of the empty state while loading with no rows', async () => {
      const wrapper = mountTable({
        props: { data: [], columns, loading: true },
        slots: { loading: '<template #loading>Loading…</template>' },
      })

      expect(wrapper.find('[data-slot="rich-table-empty"]').exists()).toBe(false)
      expect(wrapper.get('[data-slot="rich-table-loading"]').text()).toBe('Loading…')
      await wrapper.setProps({ loading: false })
      expect(wrapper.find('[data-slot="rich-table-loading"]').exists()).toBe(false)
      expect(wrapper.find('[data-slot="rich-table-empty"]').exists()).toBe(true)
    })

    it('keeps rows while loading', () => {
      const wrapper = mountTable({ props: { data: people, columns, loading: true } })

      expect(bodyRows(wrapper)).toHaveLength(3)
    })
  })

  describe('meta', () => {
    it('merges column and table meta styles and spans into cells and rows', () => {
      const wrapper = mountTable({
        props: {
          data: people,
          columns: [
            {
              accessorKey: 'name',
              header: 'Name',
              meta: {
                style: { td: { color: 'red' } },
                colspan: { td: (cell) => (cell.getValue() === 'Sara' ? '2' : '1') },
              },
            },
            { accessorKey: 'role', header: 'Role' },
          ],
          meta: { style: { tr: { opacity: '0.5' } } },
        },
      })

      const rows = bodyRows(wrapper)
      expect(rows[0]!.attributes('style')).toContain('opacity: 0.5')
      const cells = rows.map((row) => row.find('td'))
      expect(cells[0]!.attributes('style')).toContain('color: red')
      expect(cells[2]!.attributes('colspan')).toBe('2')
    })
  })

  describe('virtualize', () => {
    it('renders a window of rows between spacers instead of every row', async () => {
      // happy-dom has no layout: the virtualizer measures its scroll element's client box, so give it one
      const height = vi.spyOn(HTMLElement.prototype, 'clientHeight', 'get').mockReturnValue(200)
      const width = vi.spyOn(HTMLElement.prototype, 'clientWidth', 'get').mockReturnValue(400)

      const many = Array.from({ length: 1000 }, (_, i) => ({
        id: String(i),
        name: `P${i}`,
        role: 'x',
        age: i,
      }))

      const wrapper = mountTable({
        props: {
          data: many,
          columns,
          virtualize: { estimateSize: 40, overscan: 2 },
        },
      })

      await flushPromises()
      height.mockRestore()
      width.mockRestore()
      const rendered = bodyRows(wrapper)
      expect(rendered.length).toBeGreaterThan(0)
      expect(rendered.length).toBeLessThan(50)
      expect(rendered[0]!.attributes('data-index')).toBe('0')

      // The rows below the window are stood in for by a spacer of their estimated height
      const spacer = wrapper.get('tbody tr[aria-hidden="true"]')
      const spacerHeight = Number.parseInt(
        spacer.attributes('style')!.match(/height:\s*(\d+)/)![1]!,
      )

      expect(spacerHeight).toBeGreaterThan(30_000)
    })

    it('renders every row without virtualize', () => {
      const many = Array.from({ length: 200 }, (_, i) => ({
        id: String(i),
        name: `P${i}`,
        role: 'x',
        age: i,
      }))

      expect(bodyRows(mountTable({ props: { data: many, columns } }))).toHaveLength(200)
    })
  })
})

describe('RichTable option updates', () => {
  it('stays fast across many data and sorting updates', async () => {
    const wrapper = mountTable({
      props: { data: people, columns, getRowId: (row: Person) => row.id },
    })

    const started = performance.now()

    for (let i = 0; i < 40; i++) {
      await wrapper.setProps({
        data: [...people, { id: `n${i}`, name: `New ${i}`, role: 'Dev', age: i }],
        getRowId: (row: Person) => row.id,
      })

      await wrapper.get('[data-testid="sort-name"]').trigger('click')
    }

    expect(wrapper.findAll('tbody tr')).toHaveLength(4)
    expect(wrapper.text()).toContain('New 39')
    expect(performance.now() - started).toBeLessThan(2000)
  })
})

describe('RichTable accessibility', () => {
  // Realistic accessible usage: a caption, a sort button, labelled selection and expand controls
  const sortable: RichTableColumn<Person>[] = [
    {
      accessorKey: 'name',
      header: ({ column }) =>
        h(
          'button',
          { type: 'button', 'data-testid': 'sort-name', onClick: column.getToggleSortingHandler() },
          'Name',
        ),
      enableSorting: true,
    },
    { accessorKey: 'role', header: 'Role' },
  ]

  const interactive: RichTableColumn<Person>[] = [
    {
      id: 'select',
      header: ({ table }) =>
        h('input', {
          type: 'checkbox',
          'aria-label': 'Select all',
          checked: table.getIsAllRowsSelected(),
          onChange: table.getToggleAllRowsSelectedHandler(),
        }),
      cell: ({ row }) =>
        h('input', {
          type: 'checkbox',
          'aria-label': `Select ${row.original.name}`,
          checked: row.getIsSelected(),
          onChange: row.getToggleSelectedHandler(),
        }),
    },
    {
      id: 'expand',
      header: 'Details',
      cell: ({ row }) =>
        h(
          'button',
          {
            type: 'button',
            'aria-expanded': String(row.getIsExpanded()),
            onClick: () => row.toggleExpanded(),
          },
          `Details for ${row.original.name}`,
        ),
    },
    ...sortable,
  ]

  it('is accessible idle and sorted, named by its caption', async () => {
    const wrapper = mountTable({
      props: { data: people, columns: sortable, caption: 'Team' },
      attachTo: document.body,
    })

    expect(wrapper.get('table caption').text()).toBe('Team')
    await expectAccessible(wrapper)
    await wrapper.get('[data-testid="sort-name"]').trigger('click')
    expect(wrapper.get('th').attributes('aria-sort')).toBe('ascending')
    await expectAccessible(wrapper)
    wrapper.unmount()
  })

  it('names the table from the caption slot', () => {
    const wrapper = mountTable({
      props: { data: people, columns },
      slots: { caption: '<b>Staff</b>' },
    })

    expect(wrapper.get('table > caption').text()).toBe('Staff')
  })

  it('is accessible with selected, selectable and expanded rows', async () => {
    const wrapper = mountTable({
      props: {
        data: people,
        columns: interactive,
        caption: 'Team',
        rowSelection: { 1: true },
        expanded: { 0: true },
        features: { expanded: { getRowCanExpand: () => true } },
        onSelect: () => {},
      },
      slots: {
        expanded: '<template #expanded="{ row }"><p>{{ row.original.role }}</p></template>',
      },
      attachTo: document.body,
    })

    expect(wrapper.find('[data-slot="rich-table-expanded-row"]').exists()).toBe(true)
    await expectAccessible(wrapper)
    wrapper.unmount()
  })

  it('is accessible empty, loading with no rows, and loading with rows', async () => {
    const wrappers = [
      mountTable({ props: { data: [], columns, caption: 'Team' }, attachTo: document.body }),
      mountTable({
        props: { data: [], columns, caption: 'Team', loading: true },
        slots: { loading: 'Loading people' },
        attachTo: document.body,
      }),
      mountTable({
        props: { data: people, columns, caption: 'Team', loading: true },
        attachTo: document.body,
      }),
    ]

    for (const wrapper of wrappers) {
      await expectAccessible(wrapper)
      wrapper.unmount()
    }
  })

  it('is accessible with grouped headers and a partial footer, exposing the empty filler slots as cells', async () => {
    const grouped: RichTableColumn<Person>[] = [
      {
        id: 'person',
        header: 'Person',
        columns: [
          { accessorKey: 'name', header: 'Name', footer: 'Total' },
          { accessorKey: 'role', header: 'Role' },
        ],
      },
      { accessorKey: 'age', header: 'Age' },
    ]

    const wrapper = mountTable({
      props: { data: people, columns: grouped, caption: 'Team' },
      attachTo: document.body,
    })

    const [groupRow, leafRow] = wrapper.findAll('thead tr')
    const [person, ageFiller] = groupRow!.findAll('th')
    expect(person!.attributes()).toMatchObject({ scope: 'colgroup', colspan: '2' })
    expect(ageFiller!.attributes('role')).toBe('cell')
    expect(ageFiller!.attributes('scope')).toBeUndefined()

    expect(
      leafRow!
        .findAll('th')
        .map((th) => [th.text(), th.attributes('scope'), th.attributes('role')]),
    ).toEqual([
      ['Name', 'col', undefined],
      ['Role', 'col', undefined],
      ['Age', 'col', undefined],
    ])

    const footer = wrapper.findAll('tfoot th')

    // One footer row per header row: only "Total" is a real footer header, every other slot is an empty filler
    expect(footer.map((th) => [th.text(), th.attributes('role')])).toEqual([
      ['Total', undefined],
      ['', 'cell'],
      ['', 'cell'],
      ['', 'cell'],
      ['', 'cell'],
    ])

    await expectAccessible(wrapper)
    wrapper.unmount()
  })

  it('keeps a filler header that a slot fills as a column header', () => {
    const grouped: RichTableColumn<Person>[] = [
      { id: 'person', header: 'Person', columns: [{ accessorKey: 'name', header: 'Name' }] },
      { accessorKey: 'age', header: 'Age' },
    ]

    const wrapper = mountTable({ props: { data: people, columns: grouped } })
    const filler = wrapper.findAll('thead tr')[0]!.findAll('th')[1]!
    const id = tableApiOf(wrapper).getHeaderGroups()[0]!.headers[1]!.id
    const filled = mountTable({
      props: { data: people, columns: grouped },
      slots: { [`${id}-header`]: 'Years' },
    })

    expect(filler.attributes('role')).toBe('cell')

    expect(filled.findAll('thead tr')[0]!.findAll('th')[1]!.attributes()).toMatchObject({
      scope: 'col',
    })

    expect(filled.findAll('thead tr')[0]!.findAll('th')[1]!.attributes('role')).toBeUndefined()
  })

  it('is accessible virtualized, hiding the spacer rows', async () => {
    const height = vi.spyOn(HTMLElement.prototype, 'clientHeight', 'get').mockReturnValue(200)
    const width = vi.spyOn(HTMLElement.prototype, 'clientWidth', 'get').mockReturnValue(400)

    const many = Array.from({ length: 300 }, (_, i) => ({
      id: String(i),
      name: `P${i}`,
      role: 'x',
      age: i,
    }))

    // Measured detached like the virtualize spec above (attached, happy-dom's zero rects would render no window)
    const wrapper = mountTable({
      props: {
        data: many,
        columns,
        caption: 'Team',
        virtualize: { estimateSize: 40, overscan: 2 },
      },
    })

    await flushPromises()
    height.mockRestore()
    width.mockRestore()
    expect(wrapper.find('tbody tr[aria-hidden="true"]').exists()).toBe(true)
    document.body.append(wrapper.element)
    await expectAccessible(wrapper)
    wrapper.element.remove()
    wrapper.unmount()
  })

  it('reports the direction on the primary sorted column only, and none on the others', async () => {
    const both: RichTableColumn<Person>[] = [
      { accessorKey: 'name', header: 'Name', enableSorting: true },
      { accessorKey: 'role', header: 'Role', enableSorting: true },
    ]

    const wrapper = mountTable({
      props: {
        data: people,
        columns: both,
        sorting: [
          { id: 'role', desc: true },
          { id: 'name', desc: false },
        ],
      },
    })

    expect(wrapper.findAll('th').map((th) => th.attributes('aria-sort'))).toEqual([
      'none',
      'descending',
    ])
  })

  it('activates a focusable row with Space, ignoring key repeats, modified keys and keys from cell controls', async () => {
    const onSelect = vi.fn<(event: Event, row: Row<Person>) => void>()
    const wrapper = mountTable({
      props: { data: people, columns: interactive, caption: 'Team', onSelect },
      attachTo: document.body,
    })

    const row = bodyRows(wrapper)[0]!
    ;(row.element as HTMLElement).focus()
    expect(document.activeElement).toBe(row.element)
    await row.trigger('keydown', { key: ' ' })
    expect(onSelect).toHaveBeenCalledTimes(1)
    expect(onSelect.mock.calls[0]![1].original.name).toBe('Kate')
    await row.trigger('keydown', { key: ' ', repeat: true })
    await row.trigger('keydown', { key: 'Enter', shiftKey: true })
    await row.get('button').trigger('keydown', { key: 'Enter' })
    await row.get('input').trigger('keydown', { key: ' ' })
    expect(onSelect).toHaveBeenCalledTimes(1)
    wrapper.unmount()
  })

  it('leaves rows out of the tab order unless they can be activated', () => {
    const hoverOnly = mountTable({ props: { data: people, columns, onHover: () => {} } })
    expect(bodyRows(hoverOnly).map((r) => r.attributes('tabindex'))).toEqual([
      undefined,
      undefined,
      undefined,
    ])
  })
})
