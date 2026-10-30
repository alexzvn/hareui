import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { h, nextTick } from 'vue'

import type { TreeItem } from '@/components/tree/Tree.types'
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
})
