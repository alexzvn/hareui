import { flushPromises, mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'

import Table from '@/components/table/Table.vue'

import { expectAccessible } from './a11y'

const columns = [
  { key: 'name', label: 'Name', isRowHeader: true, sortable: true },
  { key: 'role', label: 'Role' },
]

const rows = [
  { id: 1, name: 'Kate', role: 'CEO' },
  { id: 2, name: 'John', role: 'CTO', disabled: true },
]

const bodyRows = (wrapper: ReturnType<typeof mount>) => {
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
    expect(
      mount(Table, { props: { columns, rows: [] } })
        .find('tbody tr')
        .exists(),
    ).toBe(false)

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
        rows: [
          { id: 'a', name: 'Folder', role: '-', children: [{ id: 'b', name: 'File', role: '-' }] },
        ],
        treeColumn: 'name',
        defaultExpandedKeys: new Set(['a']),
      },
    })

    const levels = bodyRows(wrapper).map((r) => r.attributes('style'))
    expect(levels).toEqual(['--table-row-level: 1;', '--table-row-level: 2;'])
    expect(bodyRows(wrapper)[1].get('td').attributes('data-tree-column')).toBe('true')
  })

  it('asks for the next page again when the sentinel stays visible after loading', async () => {
    // A sentinel that is always in view: every observe() delivers an intersecting entry.
    vi.stubGlobal(
      'IntersectionObserver',
      class implements IntersectionObserver {
        readonly root = null
        readonly rootMargin = '0px'
        readonly scrollMargin = '0px'
        readonly thresholds = [0]
        constructor(private cb: IntersectionObserverCallback) {}
        observe() {
          this.cb([{ isIntersecting: true } as IntersectionObserverEntry], this)
        }
        unobserve() {}
        takeRecords() {
          return []
        }
        disconnect() {}
      },
    )

    const wrapper = mount(Table, { props: { columns, rows, hasMore: true, loading: false } })
    await flushPromises()
    expect(wrapper.emitted('loadMore')).toHaveLength(1)
    await wrapper.setProps({ loading: true })
    await wrapper.setProps({ loading: false, rows: [...rows, { id: 3, name: 'Ann', role: 'CFO' }] })
    await flushPromises()
    expect(wrapper.emitted('loadMore')).toHaveLength(2)
  })

  it('lays out resizable columns like React Aria (1fr shares clamped by min widths) and freezes left columns on resize', async () => {
    vi.stubGlobal(
      'ResizeObserver',
      class {
        observe() {}
        disconnect() {}
      },
    )

    Object.defineProperty(HTMLElement.prototype, 'clientWidth', {
      configurable: true,
      get: () => 730,
    })

    try {
      const resizable = [
        { key: 'name', label: 'Name', minWidth: 160, resizable: true },
        { key: 'role', label: 'Role', minWidth: 220, resizable: true },
        { key: 'status', label: 'Status', minWidth: 100, resizable: true },
        { key: 'email', label: 'Email', minWidth: 200 },
      ]

      const wrapper = mount(Table, { props: { columns: resizable, rows } })
      await flushPromises()

      const widths = () =>
        wrapper.findAll('th').map((th) => th.attributes('style')?.match(/^width: (\d+)px/)?.[1])

      const resizers = () => wrapper.findAll('[data-slot="table-column-resizer"]')
      expect(widths()).toEqual(['160', '220', '150', '200'])

      // Below its minimum, Role clamps; Name to its left is frozen and Status/Email keep flexing.
      await resizers()[1].trigger('keydown', { key: 'ArrowLeft', shiftKey: true })
      expect(widths()).toEqual(['160', '220', '150', '200'])

      // Role now holds a pixel width, so widening Name takes the space from the flexible columns.
      await resizers()[0].trigger('keydown', { key: 'ArrowRight', shiftKey: true })
      expect(widths()).toEqual(['210', '220', '100', '200'])
    } finally {
      Reflect.deleteProperty(HTMLElement.prototype, 'clientWidth')
    }
  })

  it('announces the resize limits it enforces, defaulting the minimum to 75px', async () => {
    vi.stubGlobal(
      'ResizeObserver',
      class {
        observe() {}
        disconnect() {}
      },
    )

    const wrapper = mount(Table, {
      props: {
        rows,
        columns: [
          { key: 'name', label: 'Name', resizable: true },
          { key: 'role', label: 'Role', resizable: true, minWidth: 120, maxWidth: 300 },
        ],
      },
    })

    const [byDefault, limited] = wrapper.findAll('[data-slot="table-column-resizer"]')
    expect(byDefault.attributes('aria-valuemin')).toBe('75')
    expect(byDefault.attributes()).not.toHaveProperty('aria-valuemax')
    expect(limited.attributes('aria-valuemin')).toBe('120')
    expect(limited.attributes('aria-valuemax')).toBe('300')
  })
})

// ---- behaviour-final-check: selection model and single tab stop ----
const people = [1, 2, 3, 4, 5].map((id) => ({ id, name: `Person ${id}`, role: 'Dev' }))

const selectedIds = (wrapper: ReturnType<typeof mount>) => {
  return bodyRows(wrapper)
    .filter((r) => r.attributes('data-selected') === 'true')
    .map((r) => r.attributes('data-row-key'))
}

const row = (wrapper: ReturnType<typeof mount>, id: number) => {
  return wrapper.get<HTMLTableRowElement>(`[data-row-key="${id}"]`)
}

/** Dispatches a key on the focused element like the browser does; Space on a button then activates it (native keyup click). */
const press = async (key: string, init: KeyboardEventInit = {}) => {
  const target = document.activeElement ?? document.body
  const event = new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true, ...init })
  target.dispatchEvent(event)
  if (key === ' ' && !event.defaultPrevented && target instanceof HTMLButtonElement) target.click()
  await flushPromises()
}

/** The elements Tab can reach inside the table, in DOM order. */
const tabStops = (wrapper: ReturnType<typeof mount>) => {
  const root: Element = wrapper.element
  return Array.from(
    root.querySelectorAll<HTMLElement>('button, a[href], input, select, textarea, [tabindex]'),
  ).filter((el) => el.getAttribute('tabindex') !== '-1' && !el.hasAttribute('disabled'))
}

describe('Table select-all from a partial selection', () => {
  it('clicking the indeterminate glyph selects every row instead of clearing the selection', async () => {
    // behaviour-final-check B1 (H4)
    const wrapper = mount(Table, {
      props: {
        columns,
        rows: people,
        selectionMode: 'multiple',
        defaultSelectedKeys: new Set([2, 4]),
      },
      attachTo: document.body,
    })

    const glyph = wrapper.get('thead [data-slot="checkbox-default-indicator--indeterminate"]')

    // A script-dispatched click never reaches the microtask checkpoint a user click gets between listeners,
    // so re-render right after the checkbox's own handler: that detaches the glyph before the root handler runs.
    wrapper
      .get('thead button[role="checkbox"]')
      .element.addEventListener('click', () => wrapper.vm.$.update())

    await glyph.trigger('click')
    expect(selectedIds(wrapper)).toEqual(['1', '2', '3', '4', '5'])
    wrapper.unmount()
  })
})

describe('Table keyboard selection model', () => {
  it('Shift+ArrowDown extends the selection from the focused row (range)', async () => {
    // behaviour-final-check B3
    const wrapper = mount(Table, {
      props: { columns, rows: people, selectionMode: 'multiple' },
      attachTo: document.body,
    })

    row(wrapper, 1).element.focus()
    await press('ArrowDown', { shiftKey: true })
    await press('ArrowDown', { shiftKey: true })
    expect(selectedIds(wrapper)).toEqual(['1', '2', '3'])
    wrapper.unmount()
  })

  it('Shift+click selects the range from the last clicked row', async () => {
    // behaviour-final-check B3
    const wrapper = mount(Table, {
      props: { columns, rows: people, selectionMode: 'multiple' },
      attachTo: document.body,
    })

    await row(wrapper, 1).get('td[data-slot="table-cell"]:nth-child(2)').trigger('click')

    await row(wrapper, 4)
      .get('td[data-slot="table-cell"]:nth-child(2)')
      .trigger('click', { shiftKey: true })

    expect(selectedIds(wrapper)).toEqual(['1', '2', '3', '4'])
    wrapper.unmount()
  })

  it.each([
    ['Meta', { metaKey: true }],
    ['Control', { ctrlKey: true }],
  ])('%s+A selects all rows', async (_name, modifier) => {
    // behaviour-final-check B3
    const wrapper = mount(Table, {
      props: { columns, rows: people, selectionMode: 'multiple' },
      attachTo: document.body,
    })

    row(wrapper, 1).element.focus()
    await press('a', modifier)
    expect(selectedIds(wrapper)).toEqual(['1', '2', '3', '4', '5'])
    wrapper.unmount()
  })

  it('Escape clears the selection in multiple mode', async () => {
    // behaviour-final-check B4
    const wrapper = mount(Table, {
      props: {
        columns,
        rows: people,
        selectionMode: 'multiple',
        defaultSelectedKeys: new Set([1, 2]),
      },
      attachTo: document.body,
    })

    row(wrapper, 1).element.focus()
    await press('Escape')
    expect(selectedIds(wrapper)).toEqual([])
    wrapper.unmount()
  })
})

describe('Table single tab stop', () => {
  it('has exactly one tab stop: the first row', () => {
    // behaviour-final-check H5/B2
    const wrapper = mount(Table, {
      props: { columns, rows: people, selectionMode: 'multiple' },
      attachTo: document.body,
    })

    expect(
      tabStops(wrapper).map(
        (el) => el.getAttribute('data-row-key') ?? el.getAttribute('aria-label') ?? el.tagName,
      ),
    ).toEqual(['1'])

    wrapper.unmount()
  })

  it('keeps the select-all and row checkboxes out of the tab order', () => {
    // behaviour-final-check H5/B2
    const wrapper = mount(Table, {
      props: { columns, rows: people, selectionMode: 'multiple' },
      attachTo: document.body,
    })

    const checkboxes = wrapper.findAll('button[role="checkbox"]')
    expect(checkboxes).toHaveLength(people.length + 1)
    expect(checkboxes.map((c) => c.attributes('tabindex'))).toEqual(checkboxes.map(() => '-1'))
    wrapper.unmount()
  })

  it('Space on the element Tab enters selects only that row', async () => {
    // behaviour-final-check H5/B2
    const wrapper = mount(Table, {
      props: { columns, rows: people, selectionMode: 'multiple' },
      attachTo: document.body,
    })

    tabStops(wrapper)[0]!.focus()
    await press(' ')
    expect(selectedIds(wrapper)).toEqual(['1'])
    wrapper.unmount()
  })
})

describe('Table accessibility', () => {
  const named = { columns, ariaLabel: 'People' }
  const focused = () => document.activeElement as HTMLElement | null

  it('is accessible idle, sorted, and with a disabled row', async () => {
    const wrapper = mount(Table, {
      props: { ...named, rows, defaultSortDescriptor: { column: 'name', direction: 'ascending' } },
      attachTo: document.body,
    })

    expect(wrapper.get('table').attributes('aria-label')).toBe('People')
    await expectAccessible(wrapper)
    wrapper.unmount()
  })

  it.each([
    ['multiple, partly selected', { selectionMode: 'multiple', defaultSelectedKeys: new Set([1]) }],
    ['multiple, all selected', { selectionMode: 'multiple', defaultSelectedKeys: 'all' }],
    ['single', { selectionMode: 'single', defaultSelectedKeys: new Set([1]) }],
  ] as const)('is accessible with %s selection', async (_name, selection) => {
    const wrapper = mount(Table, {
      props: { ...named, rows, ...selection },
      attachTo: document.body,
    })

    await expectAccessible(wrapper)
    wrapper.unmount()
  })

  it('is accessible empty, loading more, as a tree and with resizable columns', async () => {
    vi.stubGlobal(
      'ResizeObserver',
      class {
        observe() {}
        disconnect() {}
      },
    )

    const tree = [
      { id: 'a', name: 'Folder', role: '-', children: [{ id: 'b', name: 'File', role: '-' }] },
    ]

    const resizable = [
      { key: 'name', label: 'Name', isRowHeader: true, resizable: true },
      { key: 'role', label: 'Role', resizable: true },
    ]

    const wrappers = [
      mount(Table, {
        props: { ...named, rows: [] },
        slots: { empty: 'No people' },
        attachTo: document.body,
      }),
      mount(Table, {
        props: { ...named, rows, hasMore: true, loading: true },
        attachTo: document.body,
      }),
      mount(Table, {
        props: { ...named, rows: tree, treeColumn: 'name', defaultExpandedKeys: new Set(['a']) },
        attachTo: document.body,
      }),
      mount(Table, { props: { ...named, rows, columns: resizable }, attachTo: document.body }),
    ]

    for (const wrapper of wrappers) {
      await expectAccessible(wrapper)
      wrapper.unmount()
    }
  })

  it('reflects selection on rows and the select-all checkbox, and labels every checkbox', async () => {
    const wrapper = mount(Table, {
      props: {
        ...named,
        rows: people,
        selectionMode: 'multiple',
        defaultSelectedKeys: new Set([2]),
      },
      attachTo: document.body,
    })

    const selectAll = () => wrapper.get('thead [role="checkbox"]')
    expect(selectAll().attributes('aria-label')).toBe('Select all')
    expect(selectAll().attributes('aria-checked')).toBe('mixed')

    expect(bodyRows(wrapper).map((r) => r.attributes('aria-selected'))).toEqual([
      'false',
      'true',
      'false',
      'false',
      'false',
    ])

    expect(
      wrapper.findAll('tbody [role="checkbox"]').map((c) => c.attributes('aria-label')),
    ).toEqual(people.map((_, i) => `Select row ${i + 1}`))

    row(wrapper, 1).element.focus()
    await press('a', { ctrlKey: true })
    expect(selectAll().attributes('aria-checked')).toBe('true')
    expect(bodyRows(wrapper).every((r) => r.attributes('aria-selected') === 'true')).toBe(true)
    wrapper.unmount()
  })

  it('exposes no selection state without a selection mode', () => {
    const wrapper = mount(Table, { props: { ...named, rows } })
    expect(bodyRows(wrapper).map((r) => r.attributes('aria-selected'))).toEqual([
      undefined,
      undefined,
    ])

    expect(wrapper.find('[role="checkbox"]').exists()).toBe(false)
  })

  it('disables the header checkbox in single selection, so it can never select every row', async () => {
    const wrapper = mount(Table, {
      props: { ...named, rows: people, selectionMode: 'single' },
      attachTo: document.body,
    })

    const header = wrapper.get('thead [role="checkbox"]')
    expect(header.attributes('aria-label')).toBe('Select')
    expect(header.attributes('disabled')).toBeDefined()
    await header.trigger('click')
    expect(selectedIds(wrapper)).toEqual([])
    wrapper.unmount()
  })

  it('exposes disabled rows and keeps them out of the selection, while still letting focus pass through', async () => {
    const wrapper = mount(Table, {
      props: { ...named, rows, selectionMode: 'multiple' },
      attachTo: document.body,
    })

    const john = row(wrapper, 2)
    expect(john.attributes('aria-disabled')).toBe('true')
    expect(john.get('[role="checkbox"]').attributes('disabled')).toBeDefined()
    row(wrapper, 1).element.focus()
    await press('ArrowDown')
    expect(focused()).toBe(john.element)
    await press(' ')
    await press('Enter')
    expect(selectedIds(wrapper)).toEqual([])
    wrapper.unmount()
  })

  it('moves focus between rows with ArrowUp/ArrowDown/Home/End and keeps one roving tab stop', async () => {
    const wrapper = mount(Table, { props: { ...named, rows: people }, attachTo: document.body })
    row(wrapper, 1).element.focus()
    await press('ArrowDown')
    expect(focused()).toBe(row(wrapper, 2).element)
    await press('End')
    expect(focused()).toBe(row(wrapper, 5).element)
    await press('ArrowDown')
    expect(focused()).toBe(row(wrapper, 5).element)
    await press('ArrowUp')
    expect(focused()).toBe(row(wrapper, 4).element)
    await press('Home')
    expect(focused()).toBe(row(wrapper, 1).element)
    await press('End')
    expect(tabStops(wrapper)).toEqual([row(wrapper, 5).element])
    wrapper.unmount()
  })

  it('ArrowUp from the first row enters the header row, Left/Right/Home/End move across it, ArrowDown returns', async () => {
    const wrapper = mount(Table, {
      props: { ...named, rows: people, selectionMode: 'multiple' },
      attachTo: document.body,
    })

    const headers = wrapper.findAll('th').map((th) => th.element)
    row(wrapper, 1).element.focus()
    await press('ArrowUp')
    expect(focused()).toBe(headers[0])
    await press('ArrowRight')
    expect(focused()).toBe(headers[1])
    await press('End')
    expect(focused()).toBe(headers[2])
    await press('ArrowRight')
    expect(focused()).toBe(headers[2])
    await press('Home')
    expect(focused()).toBe(headers[0])
    expect(tabStops(wrapper)).toEqual([headers[0]])
    await press('ArrowDown')
    expect(focused()).toBe(row(wrapper, 1).element)
    wrapper.unmount()
  })

  it('Space/Enter on the select-all header cell selects every row and clears them again', async () => {
    const wrapper = mount(Table, {
      props: { ...named, rows: people, selectionMode: 'multiple' },
      attachTo: document.body,
    })

    wrapper.get('th').element.focus()
    await press(' ')
    expect(selectedIds(wrapper)).toEqual(['1', '2', '3', '4', '5'])
    await press('Enter')
    expect(selectedIds(wrapper)).toEqual([])
    wrapper.unmount()
  })

  it('Enter and Space on a focused sortable header sort it and update aria-sort', async () => {
    const wrapper = mount(Table, { props: { ...named, rows }, attachTo: document.body })
    const header = wrapper.get('th[data-allows-sorting="true"]')
    row(wrapper, 1).element.focus()
    await press('ArrowUp')
    expect(focused()).toBe(header.element)
    await press('Enter')
    expect(header.attributes('aria-sort')).toBe('ascending')
    await press(' ')
    expect(header.attributes('aria-sort')).toBe('descending')
    expect(wrapper.findAll('th')[1]!.attributes('aria-sort')).toBeUndefined()
    wrapper.unmount()
  })

  it('Space selects only the focused row in single selection, replacing the previous one', async () => {
    const wrapper = mount(Table, {
      props: { ...named, rows: people, selectionMode: 'single' },
      attachTo: document.body,
    })

    row(wrapper, 1).element.focus()
    await press(' ')
    await press('ArrowDown')
    await press(' ')
    expect(selectedIds(wrapper)).toEqual(['2'])

    expect(bodyRows(wrapper).map((r) => r.attributes('aria-selected'))).toEqual([
      'false',
      'true',
      'false',
      'false',
      'false',
    ])

    wrapper.unmount()
  })

  it('leaves keys typed into interactive cell content to that content', async () => {
    const wrapper = mount(Table, {
      props: { ...named, rows: people, selectionMode: 'multiple' },
      slots: {
        'role-cell':
          '<template #role-cell="{ value }"><button type="button" class="edit">{{ value }}</button></template>',
      },
      attachTo: document.body,
    })

    const edit = row(wrapper, 1).get<HTMLButtonElement>('.edit').element
    edit.focus()
    await press('ArrowDown')
    await press('Enter')
    expect(focused()).toBe(edit)
    expect(selectedIds(wrapper)).toEqual([])
    wrapper.unmount()
  })

  it('moves the tab stop to the first row when the focused row goes away', async () => {
    const wrapper = mount(Table, { props: { ...named, rows: people }, attachTo: document.body })
    row(wrapper, 3).element.focus()
    await press('ArrowDown')
    await wrapper.setProps({ rows: people.filter((p) => p.id !== 4) })
    expect(tabStops(wrapper)).toEqual([row(wrapper, 1).element])
    wrapper.unmount()
  })

  it('names each column resizer after its column and announces its width, which arrows change', async () => {
    vi.stubGlobal(
      'ResizeObserver',
      class {
        observe() {}
        disconnect() {}
      },
    )

    Object.defineProperty(HTMLElement.prototype, 'clientWidth', {
      configurable: true,
      get: () => 400,
    })

    try {
      const wrapper = mount(Table, {
        props: {
          ...named,
          rows,
          columns: [
            { key: 'name', label: 'Name', resizable: true },
            { key: 'role', label: 'Role' },
          ],
        },
        attachTo: document.body,
      })

      await flushPromises()
      const resizer = wrapper.get('[data-slot="table-column-resizer"]')
      const ids = resizer.attributes('aria-labelledby')!.split(' ')
      expect(ids.map((id) => document.getElementById(id))).toEqual([
        resizer.element,
        wrapper.get('th').element,
      ])

      expect(resizer.attributes('aria-label')).toBe('Resizer')
      expect(wrapper.get('th').text()).toBe('Name')
      expect(resizer.attributes('aria-valuenow')).toBe('200')
      expect(resizer.attributes('aria-valuetext')).toBe('200 pixels')
      ;(resizer.element as HTMLElement).focus()
      await press('ArrowRight')
      expect(resizer.attributes('aria-valuenow')).toBe('210')
      await press('ArrowLeft', { shiftKey: true })
      expect(resizer.attributes('aria-valuenow')).toBe('160')
      expect(focused()).toBe(resizer.element)
      wrapper.unmount()
    } finally {
      Reflect.deleteProperty(HTMLElement.prototype, 'clientWidth')
    }
  })

  it('gives a resizer of an unmeasured table its minimum width as value', () => {
    vi.stubGlobal(
      'ResizeObserver',
      class {
        observe() {}
        disconnect() {}
      },
    )

    const wrapper = mount(Table, {
      props: {
        ...named,
        rows,
        columns: [{ key: 'name', label: 'Name', resizable: true, minWidth: 90 }],
      },
    })

    expect(wrapper.get('[data-slot="table-column-resizer"]').attributes('aria-valuenow')).toBe('90')
  })
})

afterEach(() => vi.unstubAllGlobals())
