import type { DOMWrapper, VueWrapper } from '@vue/test-utils'
import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it } from 'vitest'
import { h, nextTick } from 'vue'

import type {
  RichTableColumn,
  RichTableData,
  RichTableProps,
  RichTableReorderEvent,
} from '@/components/rich-table'
import RichTable from '@/components/rich-table/RichTable.vue'

const mounted: VueWrapper[] = []

afterEach(() => {
  for (const wrapper of mounted.splice(0)) wrapper.unmount()
})

// `mount` cannot infer a generic SFC's type parameter: this checks the props against `RichTableProps<T>`, and attaches
// the table to the document so its handles and headers take focus.
const mountTable = <T extends RichTableData>(
  props: RichTableProps<T> & Record<string, unknown>,
) => {
  const wrapper = mount(RichTable as unknown as Parameters<typeof mount>[0], {
    props,
    attachTo: document.body,
  }) as VueWrapper

  mounted.push(wrapper)

  return wrapper
}

type Task = {
  id: string
  title: string
  owner: string
  points: number
}

const tasks: Task[] = [
  { id: 't1', title: 'Plan', owner: 'Mia', points: 3 },
  { id: 't2', title: 'Build', owner: 'Leo', points: 8 },
  { id: 't3', title: 'Test', owner: 'Ava', points: 5 },
  { id: 't4', title: 'Ship', owner: 'Noah', points: 2 },
]

const [plan, build, test, ship] = tasks as [Task, Task, Task, Task]

const columns: RichTableColumn<Task>[] = [
  { accessorKey: 'title', header: 'Title' },
  { accessorKey: 'owner', header: 'Owner' },
  { accessorKey: 'points', header: 'Points' },
]

const getRowId = (task: Task) => task.id

const bodyRows = (wrapper: VueWrapper) => wrapper.findAll('[data-slot="rich-table-row"]')

const dragHandles = (wrapper: VueWrapper) => {
  return wrapper.findAll('[data-slot="rich-table-drag-handle"]')
}

const dragHandleLabels = (wrapper: VueWrapper) => {
  return dragHandles(wrapper).map((handle) => handle.attributes('aria-label'))
}

const isDisabled = (element: Pick<DOMWrapper<Element>, 'attributes'>) => {
  return element.attributes('disabled') !== undefined
}

const dragHandleOf = (wrapper: VueWrapper, title: string) => {
  return wrapper.get(`[data-slot="rich-table-drag-handle"][aria-label="Drag ${title}"]`)
}

const rowOf = (wrapper: VueWrapper, title: string) => {
  const row = bodyRows(wrapper).find((candidate) => candidate.text().startsWith(title))
  if (!row) throw new Error(`No row for ${title}`)

  return row
}

const headerOf = (wrapper: VueWrapper, label: string) => {
  const header = wrapper.findAll('thead th').find((candidate) => candidate.text() === label)
  if (!header) throw new Error(`No header labelled ${label}`)

  return header
}

const headerTexts = (wrapper: VueWrapper) => wrapper.findAll('thead th').map((th) => th.text())

// Once a keyboard drag starts, the drag listens to the keys on `window`: these bubble up from the element
const press = async (element: Pick<DOMWrapper<Element>, 'trigger'>, keys: string[]) => {
  for (const key of keys) await element.trigger('keydown', { key })
}

describe('RichTable row reorder', () => {
  it('adds a named handle column before the rows, outside the table columns', () => {
    const wrapper = mountTable({ data: tasks, columns, getRowId, reorderable: true })
    const types = dragHandles(wrapper).map((handle) => handle.attributes('type'))

    expect(headerTexts(wrapper)).toEqual(['Reorder', 'Title', 'Owner', 'Points'])
    expect(types).toEqual(['button', 'button', 'button', 'button'])

    expect(dragHandleLabels(wrapper)).toEqual(['Drag Plan', 'Drag Build', 'Drag Test', 'Drag Ship'])

    expect(dragHandleOf(wrapper, 'Plan').attributes('aria-description')).toBe(
      'Press Enter to start dragging.',
    )
  })

  it('names a handle after the row number when the row has no text or number cell', () => {
    const wrapper = mountTable({
      data: [{ isDone: true }, { isDone: false }],
      columns: [{ accessorKey: 'isDone', header: 'Done' }],
      reorderable: true,
    })

    expect(dragHandleLabels(wrapper)).toEqual(['Drag Row 1', 'Drag Row 2'])
  })

  it('spans the handle column with full-width rows', () => {
    const wrapper = mountTable({ data: [], columns, reorderable: true })

    expect(wrapper.get('[data-slot="rich-table-empty"]').attributes('colspan')).toBe('4')
  })

  it('sticks the handle column before the left-pinned columns, which stick after it', () => {
    const sized: RichTableColumn<Task>[] = [
      { accessorKey: 'title', header: 'Title', size: 100 },
      { accessorKey: 'owner', header: 'Owner', size: 80 },
      { accessorKey: 'points', header: 'Points', size: 60 },
    ]

    const wrapper = mountTable({
      data: tasks,
      columns: sized,
      reorderable: true,
      columnPinning: { left: ['title', 'owner'] },
    })

    const cells = rowOf(wrapper, 'Plan').findAll('td')

    expect(cells.map((td) => td.attributes('data-pinned'))).toEqual([
      'left',
      'left',
      'left',
      undefined,
    ])

    // Offset by the 32px handle column, then by the pinned column before
    expect(cells[1]!.attributes('style')).toContain('--rich-table-pin: 32px')
    expect(cells[2]!.attributes('style')).toContain('--rich-table-pin: 132px')
  })

  it('moves a row with the keyboard and emits the reordered data', async () => {
    const wrapper = mountTable({ data: tasks, columns, getRowId, reorderable: true })
    const handle = dragHandleOf(wrapper, 'Build')

    await press(handle, ['Enter'])
    expect(rowOf(wrapper, 'Build').attributes('data-dragging')).toBe('')

    await press(handle, ['ArrowDown', 'ArrowDown'])
    expect(rowOf(wrapper, 'Ship').attributes('data-drop-target')).toBe('after')
    expect(wrapper.emitted('reorder')).toBeUndefined()

    await press(handle, ['Enter'])

    const expected: RichTableReorderEvent<Task> = {
      keys: ['t2'],
      target: { key: 't4', position: 'after' },
      data: [plan, test, ship, build],
    }

    expect(wrapper.emitted('reorder')).toEqual([[expected]])
    expect(wrapper.emitted('update:data')).toEqual([[expected.data]])
    expect(wrapper.find('[data-dragging]').exists()).toBe(false)
    expect(wrapper.find('[data-drop-target]').exists()).toBe(false)
  })

  it('moves a row before the first row with ArrowUp', async () => {
    const wrapper = mountTable({ data: tasks, columns, getRowId, reorderable: true })
    const handle = dragHandleOf(wrapper, 'Build')

    await press(handle, ['Enter', 'ArrowUp'])
    expect(rowOf(wrapper, 'Plan').attributes('data-drop-target')).toBe('before')

    await press(handle, ['Enter'])

    const expected: RichTableReorderEvent<Task> = {
      keys: ['t2'],
      target: { key: 't1', position: 'before' },
      data: [build, plan, test, ship],
    }

    expect(wrapper.emitted('reorder')).toEqual([[expected]])
  })

  it('keeps the focus on the moved row handle after a keyboard drop', async () => {
    const wrapper = mountTable({ data: tasks, columns, getRowId, reorderable: true })
    wrapper.setProps({
      onReorder: ({ data }: RichTableReorderEvent<Task>) => wrapper.setProps({ data }),
    })

    const handle = dragHandleOf(wrapper, 'Plan')
    ;(handle.element as HTMLElement).focus()
    await press(handle, ['Enter', 'ArrowDown', 'ArrowDown', 'Enter'])
    await nextTick()
    await nextTick()

    expect(bodyRows(wrapper).map((row) => row.text())).toEqual([
      'BuildLeo8',
      'TestAva5',
      'PlanMia3',
      'ShipNoah2',
    ])

    expect(document.activeElement).toBe(dragHandleOf(wrapper, 'Plan').element)
  })

  it('cancels a keyboard drag with Escape', async () => {
    const wrapper = mountTable({ data: tasks, columns, getRowId, reorderable: true })

    await press(dragHandleOf(wrapper, 'Plan'), ['Enter', 'ArrowDown', 'Escape'])

    expect(wrapper.emitted('reorder')).toBeUndefined()
    expect(wrapper.find('[data-dragging]').exists()).toBe(false)
    expect(wrapper.find('[data-drop-target]').exists()).toBe(false)
  })

  it('moves every selected row together when a selected row is dragged', async () => {
    const wrapper = mountTable({
      data: tasks,
      columns,
      getRowId,
      reorderable: true,
      rowSelection: { t1: true, t3: true },
    })

    // An unselected row drags alone
    await press(dragHandleOf(wrapper, 'Build'), ['Enter'])
    expect(wrapper.findAll('[data-dragging]')).toHaveLength(1)
    await press(dragHandleOf(wrapper, 'Build'), ['Escape'])

    const handle = dragHandleOf(wrapper, 'Test')

    await press(handle, ['Enter'])
    expect(rowOf(wrapper, 'Plan').attributes('data-dragging')).toBe('')
    expect(rowOf(wrapper, 'Test').attributes('data-dragging')).toBe('')

    await press(handle, ['ArrowDown', 'ArrowDown', 'Enter'])

    const expected: RichTableReorderEvent<Task> = {
      keys: ['t1', 't3'],
      target: { key: 't4', position: 'after' },
      data: [build, ship, plan, test],
    }

    expect(wrapper.emitted('reorder')).toEqual([[expected]])
  })

  it('disables the handles while the rows are sorted', async () => {
    const wrapper = mountTable({
      data: tasks,
      columns,
      getRowId,
      reorderable: true,
      sorting: [{ id: 'points', desc: false }],
    })

    expect(dragHandles(wrapper).every(isDisabled)).toBe(true)

    await wrapper.setProps({ sorting: [] })
    expect(dragHandles(wrapper).some(isDisabled)).toBe(false)
  })

  it('gives sub rows no handle', () => {
    type Item = { id: string; title: string; children?: Item[] }

    const items: Item[] = [
      { id: 'epic', title: 'Epic', children: [{ id: 'story', title: 'Story' }] },
      { id: 'bug', title: 'Bug' },
    ]

    const wrapper = mountTable({
      data: items,
      columns: [{ accessorKey: 'title', header: 'Title' }],
      getRowId: (item: Item) => item.id,
      getSubRows: (item: Item) => item.children,
      expanded: true,
      reorderable: true,
    })

    expect(bodyRows(wrapper)).toHaveLength(3)
    expect(dragHandleLabels(wrapper)).toEqual(['Drag Epic', 'Drag Bug'])
  })
})

describe('RichTable column reorder', () => {
  it('moves a column with the keyboard and updates the column order', async () => {
    const wrapper = mountTable({ data: tasks, columns, reorderableColumns: true })
    const title = headerOf(wrapper, 'Title')

    expect(title.attributes('tabindex')).toBe('0')
    expect(title.attributes('aria-description')).toBe('Press Enter to start dragging.')

    await press(title, ['Enter'])
    expect(title.attributes('data-dragging')).toBe('')

    await press(title, ['ArrowRight'])
    expect(headerOf(wrapper, 'Owner').attributes('data-drop-target')).toBe('after')

    await press(title, ['Enter'])
    expect(wrapper.emitted('update:columnOrder')).toEqual([[['owner', 'title', 'points']]])
    await nextTick()
    expect(headerTexts(wrapper)).toEqual(['Owner', 'Title', 'Points'])
  })

  it('keeps the focus on the moved header after a keyboard drop', async () => {
    const wrapper = mountTable({ data: tasks, columns, reorderableColumns: true })
    const title = headerOf(wrapper, 'Title')
    ;(title.element as HTMLElement).focus()

    await press(title, ['Enter', 'ArrowRight', 'ArrowRight', 'Enter'])
    await nextTick()

    expect(headerTexts(wrapper)).toEqual(['Owner', 'Points', 'Title'])
    expect(document.activeElement).toBe(headerOf(wrapper, 'Title').element)
  })

  it('does not pick a column up from a control inside its header', async () => {
    const withButton: RichTableColumn<Task>[] = [
      { accessorKey: 'title', header: () => h('button', { type: 'button' }, 'Title') },
      { accessorKey: 'owner', header: 'Owner' },
    ]

    const wrapper = mountTable({ data: tasks, columns: withButton, reorderableColumns: true })

    await wrapper.get('thead button').trigger('keydown', { key: 'Enter' })

    expect(wrapper.find('[data-dragging]').exists()).toBe(false)
  })

  it('keeps a column within its pinned side', async () => {
    const wrapper = mountTable({
      data: tasks,
      columns,
      reorderableColumns: true,
      columnPinning: { left: ['points'] },
    })

    const title = headerOf(wrapper, 'Title')

    expect(headerTexts(wrapper)).toEqual(['Points', 'Title', 'Owner'])

    // The pinned Points column is out of reach: there is no spot before Title
    await press(title, ['Enter', 'ArrowLeft'])
    expect(wrapper.find('[data-drop-target]').exists()).toBe(false)

    await press(title, ['Enter'])
    expect(wrapper.emitted('update:columnOrder')).toBeUndefined()

    await press(title, ['Enter', 'End', 'Enter'])
    expect(wrapper.emitted('update:columnOrder')).toEqual([[['owner', 'title', 'points']]])
    expect(wrapper.emitted('update:columnPinning')).toBeUndefined()
  })

  it('updates the pinning order when a pinned column moves', async () => {
    const wrapper = mountTable({
      data: tasks,
      columns,
      reorderableColumns: true,
      columnPinning: { left: ['title', 'owner'] },
    })

    await press(headerOf(wrapper, 'Owner'), ['Enter', 'ArrowLeft', 'Enter'])

    expect(wrapper.emitted('update:columnOrder')).toEqual([[['owner', 'title', 'points']]])

    expect(wrapper.emitted('update:columnPinning')).toEqual([
      [expect.objectContaining({ left: ['owner', 'title'] })],
    ])
  })
})

describe('RichTable column-resize-end', () => {
  it('emits every column width once a resize ends', async () => {
    const sized: RichTableColumn<Task>[] = [
      {
        accessorKey: 'title',
        size: 120,
        header: ({ header }) =>
          h('div', {
            role: 'separator',
            'data-testid': 'resize',
            onMousedown: header.getResizeHandler(),
          }),
      },
      { accessorKey: 'points', header: 'Points' },
    ]

    const wrapper = mountTable({
      data: tasks,
      columns: sized,
      features: { columnSizing: { enableColumnResizing: true } },
    })

    await wrapper.get('[data-testid="resize"]').trigger('mousedown', { clientX: 100 })
    document.dispatchEvent(new MouseEvent('mousemove', { clientX: 130 }))
    await nextTick()
    expect(wrapper.emitted('columnResizeEnd')).toBeUndefined()

    document.dispatchEvent(new MouseEvent('mouseup', { clientX: 160 }))
    await nextTick()
    expect(wrapper.emitted('columnResizeEnd')).toEqual([[{ title: 180 }]])
  })
})
