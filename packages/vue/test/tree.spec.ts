import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { h, nextTick } from 'vue'

import { moveTreeItems } from '@/components/tree/moveTreeItems'
import type { TreeItem, TreeMoveEvent } from '@/components/tree/Tree.types'
import Tree from '@/components/tree/Tree.vue'

import { expectAccessible } from './a11y'

const createItems = (): TreeItem[] => [
  {
    label: 'docs',
    defaultExpanded: true,
    children: [
      { label: 'intro.md' },
      { label: 'guides', children: [{ label: 'setup.md' }, { label: 'deploy.md' }] },
    ],
  },
  { label: 'notes', children: [] },
  { label: 'LICENSE' },
]

const rows = (wrapper: ReturnType<typeof mount>) => wrapper.findAll('[role=treeitem]')

const labels = (wrapper: ReturnType<typeof mount>) => rows(wrapper).map((row) => row.text())

const rowByLabel = (wrapper: ReturnType<typeof mount>, label: string) => {
  const row = rows(wrapper).find((r) => r.text() === label)
  if (!row) throw new Error(`No row labelled ${label}`)

  return row
}

const announcement = () => document.querySelector('[data-slot=live-announcer]')?.textContent

const pointer = (type: string, { x = 10, y }: { x?: number; y: number }) =>
  new PointerEvent(type, {
    button: 0,
    pointerId: 1,
    pointerType: 'mouse',
    clientX: x,
    clientY: y,
    bubbles: true,
    cancelable: true,
  })

const dragPreview = () => document.querySelector<HTMLElement>('[data-slot=drag-preview]')

const nextFrame = () => {
  const { promise, resolve } = Promise.withResolvers<void>()
  requestAnimationFrame(() => resolve())

  return promise
}

describe('tree', () => {
  it('renders a tree of treeitems with level, position and expanded state', async () => {
    const wrapper = mount(Tree, { props: { items: createItems() }, attachTo: document.body })

    expect(wrapper.find('[role=tree]').exists()).toBe(true)
    expect(labels(wrapper)).toEqual(['docs', 'intro.md', 'guides', 'notes', 'LICENSE'])

    const docs = rowByLabel(wrapper, 'docs')
    expect(docs.attributes('aria-expanded')).toBe('true')
    expect(docs.attributes('aria-level')).toBe('1')
    expect(docs.attributes('aria-posinset')).toBe('1')
    expect(docs.attributes('aria-setsize')).toBe('3')

    const guides = rowByLabel(wrapper, 'guides')
    expect(guides.attributes('aria-expanded')).toBe('false')
    expect(guides.attributes('aria-level')).toBe('2')
    expect(guides.attributes('aria-posinset')).toBe('2')
    expect(wrapper.findAll('[role=group]')).toHaveLength(1)

    await expectAccessible(wrapper)
    wrapper.unmount()
  })

  it('treats an empty children array as a folder without an expand state', () => {
    const wrapper = mount(Tree, { props: { items: createItems() } })
    const notes = rowByLabel(wrapper, 'notes')

    expect(notes.attributes('aria-expanded')).toBeUndefined()
    expect(notes.find('[data-slot=tree-leading-icon]').exists()).toBe(true)

    expect(rowByLabel(wrapper, 'LICENSE').find('[data-slot=tree-leading-icon]').exists()).toBe(
      false,
    )
  })

  it('clicking a folder toggles it and emits update:expanded and toggle', async () => {
    const wrapper = mount(Tree, { props: { items: createItems() } })

    await rowByLabel(wrapper, 'guides').trigger('click')
    expect(labels(wrapper)).toContain('setup.md')
    expect(wrapper.emitted('update:expanded')!.at(-1)).toEqual([['docs', 'guides']])
    expect((wrapper.emitted('toggle')![0]![1] as TreeItem).label).toBe('guides')

    await rowByLabel(wrapper, 'docs').trigger('click')
    expect(labels(wrapper)).toEqual(['docs', 'notes', 'LICENSE'])
  })

  it('v-model:expanded controls which folders are open', async () => {
    const wrapper = mount(Tree, { props: { items: createItems(), expanded: ['docs', 'guides'] } })
    expect(labels(wrapper)).toContain('deploy.md')

    await wrapper.setProps({ expanded: [] })
    expect(labels(wrapper)).toEqual(['docs', 'notes', 'LICENSE'])
  })

  it('selects one item with v-model and marks it aria-selected', async () => {
    const items = createItems()
    const wrapper = mount(Tree, { props: { items } })

    await rowByLabel(wrapper, 'intro.md').trigger('click')
    expect(wrapper.emitted('update:modelValue')!.at(-1)).toEqual([items[0]!.children![0]])

    await wrapper.setProps({ modelValue: items[2] })
    expect(rowByLabel(wrapper, 'LICENSE').attributes('aria-selected')).toBe('true')
    expect(rowByLabel(wrapper, 'intro.md').attributes('aria-selected')).toBe('false')
  })

  it('multiple with propagateSelect selects a folder and its descendants', async () => {
    const wrapper = mount(Tree, {
      props: {
        items: createItems(),
        multiple: true,
        propagateSelect: true,
        expanded: ['docs', 'guides'],
      },
    })

    await rowByLabel(wrapper, 'guides').trigger('click')
    const selected = wrapper.emitted('update:modelValue')!.at(-1)![0] as TreeItem[]
    expect(selected.map((item) => item.label)).toEqual(['guides', 'setup.md', 'deploy.md'])
  })

  it('bubbleSelect selects a folder once all of its children are selected', async () => {
    const wrapper = mount(Tree, {
      props: {
        items: createItems(),
        multiple: true,
        bubbleSelect: true,
        expanded: ['docs', 'guides'],
      },
    })

    await rowByLabel(wrapper, 'setup.md').trigger('click')
    await rowByLabel(wrapper, 'deploy.md').trigger('click')
    const selected = wrapper.emitted('update:modelValue')!.at(-1)![0] as TreeItem[]
    expect(selected.map((item) => item.label)).toContain('guides')
  })

  it('an item onSelect replaces the select event and can cancel the selection', async () => {
    const items = createItems()
    items[2]!.onSelect = (event) => event.preventDefault()
    const wrapper = mount(Tree, { props: { items } })

    await rowByLabel(wrapper, 'LICENSE').trigger('click')
    expect(wrapper.emitted('select')).toBeUndefined()
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()

    await rowByLabel(wrapper, 'intro.md').trigger('click')
    expect(wrapper.emitted('select')).toHaveLength(1)
  })

  const mountReplace = () => {
    const items = createItems()
    const wrapper = mount(Tree, {
      props: { items, multiple: true, selectionBehavior: 'replace', expanded: ['docs', 'guides'] },
    })

    return wrapper
  }

  const selectedLabels = (wrapper: ReturnType<typeof mount>) =>
    (wrapper.emitted('update:modelValue')!.at(-1)![0] as TreeItem[]).map((item) => item.label)

  it('replace selection: a plain click selects only that row', async () => {
    const wrapper = mountReplace()

    await rowByLabel(wrapper, 'intro.md').trigger('click')
    await rowByLabel(wrapper, 'LICENSE').trigger('click')
    expect(selectedLabels(wrapper)).toEqual(['LICENSE'])
  })

  it('replace selection: Ctrl or Cmd-click adds a row and removes a selected one', async () => {
    const wrapper = mountReplace()

    await rowByLabel(wrapper, 'intro.md').trigger('click')
    await rowByLabel(wrapper, 'LICENSE').trigger('click', { metaKey: true })
    expect(selectedLabels(wrapper)).toEqual(['intro.md', 'LICENSE'])

    await rowByLabel(wrapper, 'intro.md').trigger('click', { ctrlKey: true })
    expect(selectedLabels(wrapper)).toEqual(['LICENSE'])
  })

  it('replace selection: Shift-click selects the visible rows from the last clicked row', async () => {
    const wrapper = mountReplace()

    await rowByLabel(wrapper, 'deploy.md').trigger('click')
    await rowByLabel(wrapper, 'intro.md').trigger('click', { shiftKey: true })
    expect(selectedLabels(wrapper)).toEqual(['intro.md', 'guides', 'setup.md', 'deploy.md'])
  })

  it('disabled items and a disabled tree ignore clicks', async () => {
    const items = createItems()
    items[2]!.disabled = true
    const wrapper = mount(Tree, { props: { items } })

    await rowByLabel(wrapper, 'LICENSE').trigger('click')
    expect(rowByLabel(wrapper, 'LICENSE').attributes('aria-disabled')).toBe('true')
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()

    await wrapper.setProps({ disabled: true })
    await rowByLabel(wrapper, 'intro.md').trigger('click')
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
  })

  // Arrow-key focus movement goes through the roving focus group, which happy-dom doesn't run; the browser check
  // covers it.
  it('ArrowRight and ArrowLeft expand and collapse a folder, Enter selects it', async () => {
    const wrapper = mount(Tree, { props: { items: createItems() }, attachTo: document.body })
    const guides = rowByLabel(wrapper, 'guides')

    await guides.trigger('keydown', { key: 'ArrowRight' })
    expect(guides.attributes('aria-expanded')).toBe('true')

    await guides.trigger('keydown', { key: 'ArrowLeft' })
    expect(guides.attributes('aria-expanded')).toBe('false')

    await guides.trigger('keydown', { key: 'Enter' })
    expect(guides.attributes('aria-selected')).toBe('true')
    wrapper.unmount()
  })

  it('reads labels and keys from labelKey and getKey', async () => {
    const items = [
      { name: 'src', id: 'a', defaultExpanded: true, children: [{ name: 'main.ts', id: 'b' }] },
    ]

    const wrapper = mount(Tree, {
      props: { items, labelKey: 'name', getKey: (item: TreeItem) => item.id as string },
    })

    expect(labels(wrapper)).toEqual(['src', 'main.ts'])

    await rowByLabel(wrapper, 'src').trigger('click')
    expect(wrapper.emitted('update:expanded')!.at(-1)).toEqual([[]])
  })

  it('renders the item-leading, item-label and item-trailing slots with the item state', () => {
    const wrapper = mount(Tree, {
      props: { items: createItems() },
      slots: {
        'item-leading': ({ expanded, level }: { expanded: boolean; level: number }) =>
          h('i', { 'data-test': 'leading' }, `${level}:${expanded}`),
        'item-label': ({ item }: { item: TreeItem }) => item.label?.toUpperCase(),
        'item-trailing': ({ selected }: { selected: boolean }) => h('em', String(selected)),
      },
    })

    expect(wrapper.find('[data-slot=tree-label]').text()).toBe('DOCS')
    expect(wrapper.find('em').text()).toBe('false')

    expect(wrapper.findAll('[data-test=leading]').map((el) => el.text())).toEqual([
      '1:true',
      '2:false',
      '2:false',
      '1:false',
      '1:false',
    ])
  })

  it('the item slot replaces the row content and an item slot field picks its own slots', () => {
    const items: TreeItem[] = [{ label: 'a' }, { label: 'b', slot: 'special' }]
    const wrapper = mount(Tree, {
      props: { items },
      slots: {
        item: ({ item }: { item: TreeItem }) => `item ${item.label}`,
        special: ({ item }: { item: TreeItem }) => `special ${item.label}`,
      },
    })

    expect(labels(wrapper)).toEqual(['item a', 'special b'])
  })

  it('the item-wrapper slot element becomes the treeitem', async () => {
    const wrapper = mount(Tree, {
      props: { items: createItems() },
      slots: {
        'item-wrapper': ({ item }: { item: TreeItem }) =>
          h('div', { 'data-test': 'row' }, item.label),
      },
    })

    const docs = rowByLabel(wrapper, 'docs')
    expect(docs.attributes('data-test')).toBe('row')

    await docs.trigger('click')
    expect(wrapper.findAll('[data-test=row]')).toHaveLength(3)
  })

  it('nested false renders every visible row as a sibling', async () => {
    const wrapper = mount(Tree, { props: { items: createItems(), nested: false } })

    expect(wrapper.find('[role=group]').exists()).toBe(false)
    expect(labels(wrapper)).toEqual(['docs', 'intro.md', 'guides', 'notes', 'LICENSE'])
    expect(rowByLabel(wrapper, 'guides').attributes('aria-level')).toBe('2')

    await rowByLabel(wrapper, 'guides').trigger('click')

    expect(labels(wrapper)).toEqual([
      'docs',
      'intro.md',
      'guides',
      'setup.md',
      'deploy.md',
      'notes',
      'LICENSE',
    ])
  })

  it('checkbox puts a checkbox before the chevron that selects the row', async () => {
    const wrapper = mount(Tree, {
      props: {
        items: createItems(),
        multiple: true,
        checkbox: true,
        bubbleSelect: true,
        expanded: ['docs', 'guides'],
      },
      attachTo: document.body,
    })

    const setup = rowByLabel(wrapper, 'setup.md')
    const parts = setup.findAll('[data-slot]').map((part) => part.attributes('data-slot'))
    expect(parts.indexOf('checkbox')).toBeLessThan(parts.indexOf('tree-chevron'))

    const control = setup.find('[data-slot=checkbox-content]')
    expect(control.attributes('aria-label')).toBe('Select setup.md')
    expect(control.attributes('tabindex')).toBe('-1')

    await control.trigger('click')
    expect(selectedLabels(wrapper)).toEqual(['setup.md'])
    expect(wrapper.emitted('select')).toBeUndefined()
    expect(setup.attributes('aria-selected')).toBe('true')
    expect(setup.find('[data-slot=checkbox]').attributes('data-state')).toBe('checked')

    const guides = rowByLabel(wrapper, 'guides').find('[data-slot=checkbox]')
    expect(guides.attributes('data-state')).toBe('indeterminate')

    await expectAccessible(wrapper)
    wrapper.unmount()
  })

  it('shows the empty text or the #empty slot when there are no items', async () => {
    const wrapper = mount(Tree, { props: { items: [] }, attachTo: document.body })
    expect(wrapper.find('[data-slot=tree-empty]').exists()).toBe(false)

    await wrapper.setProps({ empty: 'No files' })
    expect(wrapper.find('[data-slot=tree-empty]').text()).toBe('No files')
    await expectAccessible(wrapper)

    await wrapper.setProps({ items: createItems() })
    expect(wrapper.find('[data-slot=tree-empty]').exists()).toBe(false)
    wrapper.unmount()

    const slotted = mount(Tree, {
      props: { items: [], empty: 'No files' },
      slots: { empty: () => h('strong', 'Nothing to show') },
    })

    expect(slotted.find('[data-slot=tree-empty]').text()).toBe('Nothing to show')
  })

  it('virtualize renders only a window of a large tree', async () => {
    // happy-dom has no layout: the virtualizer measures its scroll element's box, so give it one
    const sizes = [
      vi.spyOn(HTMLElement.prototype, 'clientHeight', 'get').mockReturnValue(280),
      vi.spyOn(HTMLElement.prototype, 'clientWidth', 'get').mockReturnValue(300),
      vi.spyOn(HTMLElement.prototype, 'offsetHeight', 'get').mockReturnValue(280),
      vi.spyOn(HTMLElement.prototype, 'offsetWidth', 'get').mockReturnValue(300),
    ]

    const items = Array.from({ length: 500 }, (_, index) => ({ label: `file-${index}.ts` }))
    const wrapper = mount(Tree, { props: { items, virtualize: { overscan: 5 } } })
    await nextTick()
    await nextTick()

    const rendered = rows(wrapper)
    expect(rendered.length).toBeGreaterThan(0)
    expect(rendered.length).toBeLessThan(50)
    expect(rendered[0]!.attributes('aria-setsize')).toBe('500')

    sizes.forEach((size) => size.mockRestore())
  })

  it('virtualize: End scrolls to the last row and focuses it', async () => {
    const sizes = [
      vi.spyOn(HTMLElement.prototype, 'clientHeight', 'get').mockReturnValue(280),
      vi.spyOn(HTMLElement.prototype, 'clientWidth', 'get').mockReturnValue(300),
      vi.spyOn(HTMLElement.prototype, 'offsetHeight', 'get').mockReturnValue(280),
      vi.spyOn(HTMLElement.prototype, 'offsetWidth', 'get').mockReturnValue(300),
      vi.spyOn(HTMLElement.prototype, 'scrollHeight', 'get').mockReturnValue(500 * 28),
    ]

    const items = Array.from({ length: 500 }, (_, index) => ({ label: `file-${index}.ts` }))
    const wrapper = mount(Tree, { props: { items, virtualize: true }, attachTo: document.body })
    await nextTick()
    await nextTick()

    const first = rows(wrapper)[0]!.element as HTMLElement
    first.focus()

    first.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'End', bubbles: true, cancelable: true }),
    )

    // happy-dom doesn't fire `scroll` when scrollTop is set
    wrapper.element.dispatchEvent(new Event('scroll'))
    await vi.waitFor(() => expect(document.activeElement?.textContent).toBe('file-499.ts'))
    expect(document.activeElement!.getAttribute('tabindex')).toBe('0')

    sizes.forEach((size) => size.mockRestore())
    wrapper.unmount()
  })

  it('draggable: rows say how to start a keyboard drag, disabled rows do not', async () => {
    const items = createItems()
    items[1]!.disabled = true
    const wrapper = mount(Tree, { props: { items, draggable: true }, attachTo: document.body })

    expect(rowByLabel(wrapper, 'LICENSE').attributes('aria-description')).toBe(
      'Press Enter to start dragging.',
    )

    expect(rowByLabel(wrapper, 'notes').attributes('aria-description')).toBeUndefined()

    await expectAccessible(wrapper)
    wrapper.unmount()
  })

  it('draggable: Enter picks up a row, the arrow keys choose the spot and Enter drops it', async () => {
    const items = createItems()
    const wrapper = mount(Tree, { props: { items, draggable: true }, attachTo: document.body })
    const license = rowByLabel(wrapper, 'LICENSE')

    await license.trigger('keydown', { key: 'Enter' })
    expect(license.attributes('data-dragging')).toBe('')

    expect(announcement()).toBe(
      'Picked up LICENSE. Press the arrow keys to choose where it goes, Enter to drop it, Escape to cancel.',
    )

    await license.trigger('keydown', { key: 'ArrowUp' })
    expect(rowByLabel(wrapper, 'notes').attributes('data-drop-target')).toBe('inside')
    expect(announcement()).toBe('Drop inside notes')

    // After the open docs folder: the line runs below its last row, at the folder's level
    await license.trigger('keydown', { key: 'ArrowUp' })
    expect(rowByLabel(wrapper, 'docs').attributes('data-drop-target')).toBe('after')
    expect(announcement()).toBe('Drop after docs')

    const line = rowByLabel(wrapper, 'guides').find('[data-slot=tree-drop-indicator]')
    expect(line.attributes('data-position')).toBe('after')

    await license.trigger('keydown', { key: 'Enter' })

    expect(wrapper.emitted('move')).toEqual([
      [{ items: [items[2]], target: items[0], position: 'after' }],
    ])

    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    expect(announcement()).toBe('Moved LICENSE after docs.')
    expect(wrapper.find('[data-dragging]').exists()).toBe(false)
    expect(wrapper.find('[data-drop-target]').exists()).toBe(false)
    wrapper.unmount()
  })

  it('draggable: the first arrow key moves the row one spot, Home and End jump to the ends', async () => {
    const items = createItems()
    const wrapper = mount(Tree, { props: { items, draggable: true }, attachTo: document.body })
    const notes = rowByLabel(wrapper, 'notes')

    await notes.trigger('keydown', { key: 'Enter' })
    await notes.trigger('keydown', { key: 'ArrowDown' })
    expect(announcement()).toBe('Drop after LICENSE')

    await notes.trigger('keydown', { key: 'Home' })
    expect(announcement()).toBe('Drop before docs')

    await notes.trigger('keydown', { key: 'End' })
    await notes.trigger('keydown', { key: ' ' })

    expect(wrapper.emitted('move')).toEqual([
      [{ items: [items[1]], target: items[2], position: 'after' }],
    ])

    wrapper.unmount()
  })

  it('draggable: Escape cancels a keyboard drag', async () => {
    const wrapper = mount(Tree, {
      props: { items: createItems(), draggable: true },
      attachTo: document.body,
    })

    const license = rowByLabel(wrapper, 'LICENSE')

    await license.trigger('keydown', { key: 'Enter' })
    await license.trigger('keydown', { key: 'ArrowUp' })
    await license.trigger('keydown', { key: 'Escape' })

    expect(wrapper.emitted('move')).toBeUndefined()
    expect(announcement()).toBe('Drop cancelled.')
    expect(wrapper.find('[data-dragging]').exists()).toBe(false)
    expect(wrapper.find('[data-drop-target]').exists()).toBe(false)

    // The drag is over: the arrow keys no longer choose drop spots
    await license.trigger('keydown', { key: 'ArrowUp' })
    expect(announcement()).toBe('Drop cancelled.')
    wrapper.unmount()
  })

  it('draggable: dragging a selected row moves every selected row, in tree order', async () => {
    const items = createItems()
    const intro = items[0]!.children![0]!
    const wrapper = mount(Tree, {
      props: { items, draggable: true, multiple: true, modelValue: [items[2]!, intro] },
      attachTo: document.body,
    })

    const license = rowByLabel(wrapper, 'LICENSE')

    await license.trigger('keydown', { key: 'Enter' })

    expect(announcement()).toBe(
      'Picked up 2 items. Press the arrow keys to choose where they go, Enter to drop them, Escape to cancel.',
    )

    const dragged = rows(wrapper).filter((row) => row.attributes('data-dragging') === '')
    expect(dragged.map((row) => row.text())).toEqual(['intro.md', 'LICENSE'])

    await license.trigger('keydown', { key: 'Home' })
    await license.trigger('keydown', { key: 'Enter' })

    expect(wrapper.emitted('move')).toEqual([
      [{ items: [intro, items[2]], target: items[0], position: 'before' }],
    ])

    wrapper.unmount()
  })

  it('draggable: an unselected row drags alone, and a folder never drops into itself', async () => {
    const items = createItems()
    const wrapper = mount(Tree, {
      props: { items, draggable: true, multiple: true, modelValue: [items[2]!] },
      attachTo: document.body,
    })

    const docs = rowByLabel(wrapper, 'docs')

    await docs.trigger('keydown', { key: 'Enter' })
    expect(wrapper.findAll('[data-dragging]')).toHaveLength(1)

    // docs is open, yet the arrow keys skip its own rows
    await docs.trigger('keydown', { key: 'ArrowDown' })
    expect(announcement()).toBe('Drop inside notes')

    await docs.trigger('keydown', { key: 'Enter' })

    expect(wrapper.emitted('move')).toEqual([
      [{ items: [items[0]], target: items[1], position: 'inside' }],
    ])

    wrapper.unmount()
  })

  it('draggable: canDrop refuses spots, and the arrow keys skip them', async () => {
    const items = createItems()
    const canDrop = vi.fn<(move: TreeMoveEvent) => boolean>(({ position }) => position !== 'inside')
    const wrapper = mount(Tree, {
      props: { items, draggable: true, canDrop },
      attachTo: document.body,
    })

    const license = rowByLabel(wrapper, 'LICENSE')

    await license.trigger('keydown', { key: 'Enter' })
    await license.trigger('keydown', { key: 'ArrowUp' })
    expect(announcement()).toBe('Drop after docs')

    expect(canDrop).toHaveBeenCalledWith({
      items: [items[2]],
      target: items[1],
      position: 'inside',
    })

    wrapper.unmount()
  })

  it('draggable: a disabled row or tree does not start a drag', async () => {
    const items = createItems()
    items[2]!.disabled = true
    const wrapper = mount(Tree, { props: { items, draggable: true }, attachTo: document.body })

    await rowByLabel(wrapper, 'LICENSE').trigger('keydown', { key: 'Enter' })
    expect(wrapper.find('[data-dragging]').exists()).toBe(false)

    await wrapper.setProps({ disabled: true })
    await rowByLabel(wrapper, 'notes').trigger('keydown', { key: 'Enter' })
    expect(wrapper.find('[data-dragging]').exists()).toBe(false)
    wrapper.unmount()
  })

  it('draggable: a pointer drag drops a row inside a folder', async () => {
    const items = createItems()
    const wrapper = mount(Tree, { props: { items, draggable: true }, attachTo: document.body })
    const license = rowByLabel(wrapper, 'LICENSE')
    const notes = rowByLabel(wrapper, 'notes')

    // happy-dom has no layout: put the pointer over the middle of the notes row
    const spies = [
      vi
        .spyOn(document, 'elementFromPoint')
        .mockReturnValue(notes.find('[data-slot=tree-label]').element),
      vi
        .spyOn(notes.element, 'getBoundingClientRect')
        .mockReturnValue(DOMRect.fromRect({ x: 0, y: 190, width: 280, height: 20 })),
    ]

    license.element.dispatchEvent(pointer('pointerdown', { y: 300 }))
    window.dispatchEvent(pointer('pointermove', { y: 200 }))
    await nextTick()
    expect(license.attributes('data-dragging')).toBe('')
    expect(notes.attributes('data-drop-target')).toBe('inside')

    window.dispatchEvent(pointer('pointerup', { y: 200 }))

    expect(wrapper.emitted('move')).toEqual([
      [{ items: [items[2]], target: items[1], position: 'inside' }],
    ])

    // The click that ends the drag doesn't select the row under it
    await notes.trigger('click')
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()

    spies.forEach((spy) => spy.mockRestore())
    wrapper.unmount()
  })

  it('draggable: a drop inside a collapsed folder opens it', async () => {
    const items = createItems()
    const wrapper = mount(Tree, { props: { items, draggable: true }, attachTo: document.body })
    const license = rowByLabel(wrapper, 'LICENSE')

    await license.trigger('keydown', { key: 'Enter' })
    await license.trigger('keydown', { key: 'ArrowUp' })
    await license.trigger('keydown', { key: 'Enter' })

    expect(announcement()).toBe('Moved LICENSE into notes.')
    expect(wrapper.emitted('toggle')?.[0]?.[1]).toEqual(items[1])
    expect(wrapper.emitted('update:expanded')?.at(-1)?.[0]).toContain('notes')
    wrapper.unmount()
  })

  it('draggable: Right opens the collapsed folder a keyboard drag is inside, and its rows become spots', async () => {
    const items = createItems()
    items[0]!.defaultExpanded = false
    const wrapper = mount(Tree, { props: { items, draggable: true }, attachTo: document.body })
    const license = rowByLabel(wrapper, 'LICENSE')

    await license.trigger('keydown', { key: 'Enter' })
    await license.trigger('keydown', { key: 'Home' })
    await license.trigger('keydown', { key: 'ArrowDown' })
    expect(rowByLabel(wrapper, 'docs').attributes('data-drop-target')).toBe('inside')

    await license.trigger('keydown', { key: 'ArrowRight' })
    await nextTick()
    expect(labels(wrapper)).toContain('intro.md')
    expect(rowByLabel(wrapper, 'docs').attributes('data-drop-target')).toBe('inside')

    await license.trigger('keydown', { key: 'ArrowDown' })
    expect(rowByLabel(wrapper, 'intro.md').attributes('data-drop-target')).toBe('before')

    await license.trigger('keydown', { key: 'Escape' })
    wrapper.unmount()
  })

  it('draggable: a pointer resting inside a collapsed folder opens it', async () => {
    vi.useFakeTimers()
    const items = createItems()
    items[0]!.defaultExpanded = false
    const wrapper = mount(Tree, { props: { items, draggable: true }, attachTo: document.body })
    const license = rowByLabel(wrapper, 'LICENSE')
    const docs = rowByLabel(wrapper, 'docs')

    const spies = [
      vi
        .spyOn(document, 'elementFromPoint')
        .mockReturnValue(docs.find('[data-slot=tree-label]').element),
      vi
        .spyOn(docs.element, 'getBoundingClientRect')
        .mockReturnValue(DOMRect.fromRect({ x: 0, y: 190, width: 280, height: 20 })),
    ]

    license.element.dispatchEvent(pointer('pointerdown', { y: 300 }))
    window.dispatchEvent(pointer('pointermove', { y: 200 }))
    await nextTick()
    expect(docs.attributes('data-drop-target')).toBe('inside')

    vi.advanceTimersByTime(300)
    expect(wrapper.emitted('update:expanded')).toBeUndefined()
    vi.advanceTimersByTime(300)
    expect(wrapper.emitted('update:expanded')?.[0]?.[0]).toEqual(['docs'])

    window.dispatchEvent(new PointerEvent('pointercancel', { pointerId: 1 }))
    spies.forEach((spy) => spy.mockRestore())
    wrapper.unmount()
    vi.useRealTimers()
  })

  it('draggable: a pointer drag carries a copy of the row beside the pointer until the drop', async () => {
    const wrapper = mount(Tree, {
      props: { items: createItems(), draggable: true },
      attachTo: document.body,
    })

    const license = rowByLabel(wrapper, 'LICENSE')
    const notes = rowByLabel(wrapper, 'notes')
    const spies = [
      vi
        .spyOn(document, 'elementFromPoint')
        .mockReturnValue(notes.find('[data-slot=tree-label]').element),
      vi
        .spyOn(notes.element, 'getBoundingClientRect')
        .mockReturnValue(DOMRect.fromRect({ x: 0, y: 190, width: 280, height: 30 })),
    ]

    license.element.dispatchEvent(pointer('pointerdown', { y: 300 }))
    expect(dragPreview()).toBeNull()

    // The copy shows the icon and label only, 14px after the pointer and 4px below the hovered row
    window.dispatchEvent(pointer('pointermove', { y: 200 }))
    await nextFrame()
    const preview = dragPreview()
    expect(preview?.textContent).toBe('LICENSE')
    expect(preview?.getAttribute('aria-hidden')).toBe('true')
    expect(preview?.querySelector('[data-slot=tree-chevron]')).toBeNull()
    expect(preview?.style.transform).toBe('translate(24px, 224px)')
    expect(document.head.textContent).toContain('cursor: grabbing')

    // Past the hovered row, it keeps 14px below the pointer too
    window.dispatchEvent(pointer('pointermove', { x: 40, y: 230 }))
    await nextFrame()
    expect(preview?.style.transform).toBe('translate(54px, 244px)')

    window.dispatchEvent(pointer('pointerup', { x: 40, y: 230 }))
    expect(dragPreview()).toBeNull()
    expect(document.head.textContent).not.toContain('cursor: grabbing')

    spies.forEach((spy) => spy.mockRestore())
    wrapper.unmount()
  })

  it('draggable: the cursor turns not-allowed over a row that refuses the drop', async () => {
    const wrapper = mount(Tree, {
      props: { items: createItems(), draggable: true, canDrop: () => false },
      attachTo: document.body,
    })

    const notes = rowByLabel(wrapper, 'notes')
    const spy = vi
      .spyOn(document, 'elementFromPoint')
      .mockReturnValue(notes.find('[data-slot=tree-label]').element)

    rowByLabel(wrapper, 'LICENSE').element.dispatchEvent(pointer('pointerdown', { y: 300 }))
    window.dispatchEvent(pointer('pointermove', { y: 200 }))
    expect(document.head.textContent).toContain('cursor: not-allowed')

    window.dispatchEvent(pointer('pointerup', { y: 200 }))
    expect(document.head.textContent).not.toContain('cursor: not-allowed')
    expect(wrapper.emitted('move')).toBeUndefined()

    spy.mockRestore()
    wrapper.unmount()
  })

  it('draggable: Escape cancels a pointer drag and removes its copy', async () => {
    const wrapper = mount(Tree, {
      props: { items: createItems(), draggable: true },
      attachTo: document.body,
    })

    const license = rowByLabel(wrapper, 'LICENSE')
    license.element.dispatchEvent(pointer('pointerdown', { y: 300 }))
    window.dispatchEvent(pointer('pointermove', { y: 200 }))
    expect(dragPreview()).not.toBeNull()

    license.element.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true }),
    )

    await nextTick()
    expect(dragPreview()).toBeNull()
    expect(license.attributes('data-dragging')).toBeUndefined()

    // The release that follows neither drops nor selects the row under it
    window.dispatchEvent(pointer('pointerup', { y: 200 }))
    await license.trigger('click')
    expect(wrapper.emitted('move')).toBeUndefined()
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    wrapper.unmount()
  })

  it('draggable: a pointer press that does not move still selects the row', async () => {
    const wrapper = mount(Tree, {
      props: { items: createItems(), draggable: true },
      attachTo: document.body,
    })

    const license = rowByLabel(wrapper, 'LICENSE')

    license.element.dispatchEvent(pointer('pointerdown', { y: 300 }))
    window.dispatchEvent(pointer('pointermove', { y: 302 }))
    window.dispatchEvent(pointer('pointerup', { y: 302 }))
    await license.trigger('click')

    expect(wrapper.emitted('move')).toBeUndefined()
    expect(license.attributes('aria-selected')).toBe('true')
    wrapper.unmount()
  })

  it('virtualize: a keyboard drag reaches rows outside the rendered window', async () => {
    const sizes = [
      vi.spyOn(HTMLElement.prototype, 'clientHeight', 'get').mockReturnValue(280),
      vi.spyOn(HTMLElement.prototype, 'clientWidth', 'get').mockReturnValue(300),
      vi.spyOn(HTMLElement.prototype, 'offsetHeight', 'get').mockReturnValue(280),
      vi.spyOn(HTMLElement.prototype, 'offsetWidth', 'get').mockReturnValue(300),
    ]

    const items = Array.from({ length: 500 }, (_, index) => ({ label: `file-${index}.ts` }))
    const wrapper = mount(Tree, {
      props: { items, virtualize: true, draggable: true },
      attachTo: document.body,
    })

    await nextTick()
    await nextTick()

    const first = rows(wrapper)[0]!
    await first.trigger('keydown', { key: 'Enter' })
    await first.trigger('keydown', { key: 'End' })
    expect(announcement()).toBe('Drop after file-499.ts')

    await first.trigger('keydown', { key: 'Enter' })

    expect(wrapper.emitted('move')).toEqual([
      [{ items: [items[0]], target: items[499], position: 'after' }],
    ])

    sizes.forEach((size) => size.mockRestore())
    wrapper.unmount()
  })
})

describe('moveTreeItems', () => {
  it('moves items before, after or inside a target and keeps untouched folders', () => {
    const items = createItems()
    const [docs, notes, license] = items as [TreeItem, TreeItem, TreeItem]
    const [intro, guides] = docs.children as [TreeItem, TreeItem]

    const after = moveTreeItems(items, { items: [license], target: intro, position: 'after' })
    expect(after.map((item) => item.label)).toEqual(['docs', 'notes'])
    expect(after[0]!.children!.map((item) => item.label)).toEqual(['intro.md', 'LICENSE', 'guides'])
    expect(after[1]).toBe(notes)
    expect(docs.children).toHaveLength(2)

    const inside = moveTreeItems(items, {
      items: [guides, license],
      target: notes,
      position: 'inside',
    })

    expect(inside[1]!.children).toEqual([guides, license])
    expect(inside[1]!.children![0]!.children).toBe(guides.children)

    const before = moveTreeItems(items, { items: [license], target: docs, position: 'before' })
    expect(before).toEqual([license, docs, notes])
    expect(before[1]).toBe(docs)
  })
})
