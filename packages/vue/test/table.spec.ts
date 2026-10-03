import { flushPromises, mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import Table from '../src/components/table/Table.vue'

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

  it('announces the resize limits it enforces, defaulting the minimum to 75px', async () => {
    vi.stubGlobal('ResizeObserver', class { observe() {} disconnect() {} })
    const wrapper = mount(Table, { props: { rows, columns: [
      { key: 'name', label: 'Name', resizable: true },
      { key: 'role', label: 'Role', resizable: true, minWidth: 120, maxWidth: 300 },
    ] } })
    const [byDefault, limited] = wrapper.findAll('[data-slot="table-column-resizer"]')
    expect(byDefault.attributes('aria-valuemin')).toBe('75')
    expect(byDefault.attributes()).not.toHaveProperty('aria-valuemax')
    expect(limited.attributes('aria-valuemin')).toBe('120')
    expect(limited.attributes('aria-valuemax')).toBe('300')
  })
})

// ---- behaviour-final-check: selection model and single tab stop ----
const people = [1, 2, 3, 4, 5].map(id => ({ id, name: `Person ${id}`, role: 'Dev' }))

function selectedIds(wrapper: ReturnType<typeof mount>) {
  return bodyRows(wrapper).filter(r => r.attributes('data-selected') === 'true').map(r => r.attributes('data-row-key'))
}

function row(wrapper: ReturnType<typeof mount>, id: number) {
  return wrapper.get<HTMLTableRowElement>(`[data-row-key="${id}"]`)
}

/** Dispatches a key on the focused element like the browser does; Space on a button then activates it (native keyup click). */
async function press(key: string, init: KeyboardEventInit = {}) {
  const target = document.activeElement ?? document.body
  const event = new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true, ...init })
  target.dispatchEvent(event)
  if (key === ' ' && !event.defaultPrevented && target instanceof HTMLButtonElement)
    target.click()
  await flushPromises()
}

/** The elements Tab can reach inside the table, in DOM order. */
function tabStops(wrapper: ReturnType<typeof mount>) {
  const root: Element = wrapper.element
  return Array.from(root.querySelectorAll<HTMLElement>('button, a[href], input, select, textarea, [tabindex]'))
    .filter(el => el.getAttribute('tabindex') !== '-1' && !el.hasAttribute('disabled'))
}

describe('Table select-all from a partial selection', () => {
  it('clicking the indeterminate glyph selects every row instead of clearing the selection', async () => {
    // behaviour-final-check B1 (H4)
    const wrapper = mount(Table, { props: { columns, rows: people, selectionMode: 'multiple', defaultSelectedKeys: new Set([2, 4]) }, attachTo: document.body })
    const glyph = wrapper.get('thead [data-slot="checkbox-default-indicator--indeterminate"]')
    // A script-dispatched click never reaches the microtask checkpoint a user click gets between listeners,
    // so re-render right after the checkbox's own handler: that detaches the glyph before the root handler runs.
    wrapper.get('thead button[role="checkbox"]').element.addEventListener('click', () => wrapper.vm.$.update())
    await glyph.trigger('click')
    expect(selectedIds(wrapper)).toEqual(['1', '2', '3', '4', '5'])
    wrapper.unmount()
  })
})

describe('Table keyboard selection model', () => {
  it('Shift+ArrowDown extends the selection from the focused row (range)', async () => {
    // behaviour-final-check B3
    const wrapper = mount(Table, { props: { columns, rows: people, selectionMode: 'multiple' }, attachTo: document.body })
    row(wrapper, 1).element.focus()
    await press('ArrowDown', { shiftKey: true })
    await press('ArrowDown', { shiftKey: true })
    expect(selectedIds(wrapper)).toEqual(['1', '2', '3'])
    wrapper.unmount()
  })

  it('Shift+click selects the range from the last clicked row', async () => {
    // behaviour-final-check B3
    const wrapper = mount(Table, { props: { columns, rows: people, selectionMode: 'multiple' }, attachTo: document.body })
    await row(wrapper, 1).get('td[data-slot="table-cell"]:nth-child(2)').trigger('click')
    await row(wrapper, 4).get('td[data-slot="table-cell"]:nth-child(2)').trigger('click', { shiftKey: true })
    expect(selectedIds(wrapper)).toEqual(['1', '2', '3', '4'])
    wrapper.unmount()
  })

  it.each([
    ['Meta', { metaKey: true }],
    ['Control', { ctrlKey: true }],
  ])('%s+A selects all rows', async (_name, modifier) => {
    // behaviour-final-check B3
    const wrapper = mount(Table, { props: { columns, rows: people, selectionMode: 'multiple' }, attachTo: document.body })
    row(wrapper, 1).element.focus()
    await press('a', modifier)
    expect(selectedIds(wrapper)).toEqual(['1', '2', '3', '4', '5'])
    wrapper.unmount()
  })

  it('Escape clears the selection in multiple mode', async () => {
    // behaviour-final-check B4
    const wrapper = mount(Table, { props: { columns, rows: people, selectionMode: 'multiple', defaultSelectedKeys: new Set([1, 2]) }, attachTo: document.body })
    row(wrapper, 1).element.focus()
    await press('Escape')
    expect(selectedIds(wrapper)).toEqual([])
    wrapper.unmount()
  })
})

describe('Table single tab stop', () => {
  it('has exactly one tab stop: the first row', () => {
    // behaviour-final-check H5/B2
    const wrapper = mount(Table, { props: { columns, rows: people, selectionMode: 'multiple' }, attachTo: document.body })
    expect(tabStops(wrapper).map(el => el.getAttribute('data-row-key') ?? el.getAttribute('aria-label') ?? el.tagName)).toEqual(['1'])
    wrapper.unmount()
  })

  it('keeps the select-all and row checkboxes out of the tab order', () => {
    // behaviour-final-check H5/B2
    const wrapper = mount(Table, { props: { columns, rows: people, selectionMode: 'multiple' }, attachTo: document.body })
    const checkboxes = wrapper.findAll('button[role="checkbox"]')
    expect(checkboxes).toHaveLength(people.length + 1)
    expect(checkboxes.map(c => c.attributes('tabindex'))).toEqual(checkboxes.map(() => '-1'))
    wrapper.unmount()
  })

  it('Space on the element Tab enters selects only that row', async () => {
    // behaviour-final-check H5/B2
    const wrapper = mount(Table, { props: { columns, rows: people, selectionMode: 'multiple' }, attachTo: document.body })
    tabStops(wrapper)[0]!.focus()
    await press(' ')
    expect(selectedIds(wrapper)).toEqual(['1'])
    wrapper.unmount()
  })
})

afterEach(() => vi.unstubAllGlobals())
