import { flushPromises, mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import Table from '../src/components/Table.vue'

const columns = [
  { key: 'name', label: 'Name', isRowHeader: true, sortable: true },
  { key: 'role', label: 'Role' },
]
const rows = [
  { id: 1, name: 'Kate', role: 'CEO' },
  { id: 2, name: 'John', role: 'CTO', disabled: true },
]

function bodyRows(wrapper: ReturnType<typeof mount>) {
  return wrapper.findAll('[data-slot="table-row"]')
}

describe('Table', () => {
  it('renders row header cells as td[role=rowheader] and cell slots per column', () => {
    const wrapper = mount(Table, {
      props: { columns, rows },
      slots: { 'role-cell': '<template #role-cell="{ value }"><b>{{ value }}</b></template>' },
    })
    const cells = bodyRows(wrapper)[0].findAll('td')
    expect(cells[0].attributes('role')).toBe('rowheader')
    expect(cells[1].html()).toContain('<b>CEO</b>')
  })

  it('cycles sort direction on the header and emits sortDescriptor', async () => {
    const wrapper = mount(Table, { props: { columns, rows } })
    const header = wrapper.get('th[data-allows-sorting="true"]')
    expect(header.attributes('aria-sort')).toBe('none')
    await header.trigger('click')
    await header.trigger('click')
    expect(wrapper.emitted('update:sortDescriptor')).toEqual([
      [{ column: 'name', direction: 'ascending' }],
      [{ column: 'name', direction: 'descending' }],
    ])
    expect(header.attributes('aria-sort')).toBe('descending')
  })

  it('renders no empty row unless the #empty slot is given', () => {
    expect(mount(Table, { props: { columns, rows: [] } }).find('tbody tr').exists()).toBe(false)
    const wrapper = mount(Table, { props: { columns, rows: [] }, slots: { empty: 'Nothing' } })
    expect(wrapper.get('tbody').attributes('data-empty')).toBe('true')
    expect(wrapper.get('tbody td').attributes('colspan')).toBe('2')
    expect(wrapper.get('tbody td').text()).toBe('Nothing')
  })

  it('multiple selection skips disabled rows and select-all selects the rest', async () => {
    const wrapper = mount(Table, { props: { columns, rows, selectionMode: 'multiple' } })
    await wrapper.get('thead button[role="checkbox"]').trigger('click')
    const [kate, john] = bodyRows(wrapper)
    expect(kate.attributes('data-selected')).toBe('true')
    expect(john.attributes('data-selected')).toBeUndefined()
    expect(john.attributes('aria-disabled')).toBe('true')
  })

  it('tree rows set the 1-based --table-row-level used to indent the tree column', () => {
    const wrapper = mount(Table, {
      props: {
        columns,
        rows: [{ id: 'a', name: 'Folder', role: '-', children: [{ id: 'b', name: 'File', role: '-' }] }],
        treeColumn: 'name',
        defaultExpandedKeys: new Set(['a']),
      },
    })
    const levels = bodyRows(wrapper).map(r => r.attributes('style'))
    expect(levels).toEqual(['--table-row-level: 1;', '--table-row-level: 2;'])
    expect(bodyRows(wrapper)[1].get('td').attributes('data-tree-column')).toBe('true')
  })

  it('asks for the next page again when the sentinel stays visible after loading', async () => {
    // A sentinel that is always in view: every observe() delivers an intersecting entry.
    vi.stubGlobal('IntersectionObserver', class {
      constructor(private cb: IntersectionObserverCallback) {}
      observe() { this.cb([{ isIntersecting: true } as IntersectionObserverEntry], this as any) }
      disconnect() {}
    })
    const wrapper = mount(Table, { props: { columns, rows, hasMore: true, loading: false } })
    await flushPromises()
    expect(wrapper.emitted('loadMore')).toHaveLength(1)
    await wrapper.setProps({ loading: true })
    await wrapper.setProps({ loading: false, rows: [...rows, { id: 3, name: 'Ann', role: 'CFO' }] })
    await flushPromises()
    expect(wrapper.emitted('loadMore')).toHaveLength(2)
  })

  it('lays out resizable columns like React Aria (1fr shares clamped by min widths) and freezes left columns on resize', async () => {
    vi.stubGlobal('ResizeObserver', class { observe() {} disconnect() {} })
    Object.defineProperty(HTMLElement.prototype, 'clientWidth', { configurable: true, get: () => 730 })
    try {
      const resizable = [
        { key: 'name', label: 'Name', minWidth: 160, resizable: true },
        { key: 'role', label: 'Role', minWidth: 220, resizable: true },
        { key: 'status', label: 'Status', minWidth: 100, resizable: true },
        { key: 'email', label: 'Email', minWidth: 200 },
      ]
      const wrapper = mount(Table, { props: { columns: resizable, rows } })
      await flushPromises()
      const widths = () => wrapper.findAll('th').map(th => th.attributes('style')?.match(/^width: (\d+)px/)?.[1])
      const resizers = () => wrapper.findAll('[data-slot="table-column-resizer"]')
      expect(widths()).toEqual(['160', '220', '150', '200'])

      // Below its minimum, Role clamps; Name to its left is frozen and Status/Email keep flexing.
      await resizers()[1].trigger('keydown', { key: 'ArrowLeft', shiftKey: true })
      expect(widths()).toEqual(['160', '220', '150', '200'])
      // Role now holds a pixel width, so widening Name takes the space from the flexible columns.
      await resizers()[0].trigger('keydown', { key: 'ArrowRight', shiftKey: true })
      expect(widths()).toEqual(['210', '220', '100', '200'])
    }
    finally {
      delete (HTMLElement.prototype as any).clientWidth
    }
  })
})

afterEach(() => vi.unstubAllGlobals())
