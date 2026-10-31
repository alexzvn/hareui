import type { VueWrapper } from '@vue/test-utils'
import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, h, nextTick } from 'vue'

import type {
  ListViewItem,
  ListViewProps,
  ListViewValue,
} from '@/components/list-view/ListView.types'
import ListView from '@/components/list-view/ListView.vue'

import { expectAccessible } from './a11y'

const files: ListViewItem[] = [
  { value: 'docs', label: 'Documents', description: 'Updated today' },
  { value: 'photos', label: 'Photos' },
  { value: 'archive', label: 'Archive.zip', disabled: true },
  { value: 'readme', label: 'README.md' },
  { value: 'pkg', label: 'package.json' },
]

let wrapper: VueWrapper | undefined

afterEach(() => {
  wrapper?.unmount()
  wrapper = undefined
})

type MountOptions = {
  slots?: Record<string, unknown>
  attrs?: Record<string, unknown>
  components?: Record<string, unknown>
}

const mountList = (props: Partial<ListViewProps> = {}, options: MountOptions = {}) => {
  wrapper = mount(ListView, {
    props: { items: files, ariaLabel: 'Files', ...props, ...options.attrs },
    slots: options.slots as never,
    global: { components: options.components as never },
    attachTo: document.body,
  })

  return wrapper
}

const rows = (list: VueWrapper) => list.findAll('[role=row]')

const row = (list: VueWrapper, label: string) => {
  const found = rows(list).find((r) => r.attributes('aria-label') === label)
  if (!found) throw new Error(`No row labelled ${label}`)

  return found
}

const focusRow = (list: VueWrapper, label: string) => {
  const el = row(list, label).element as HTMLElement
  el.focus()
}

const focusedLabel = () => document.activeElement?.getAttribute('aria-label')

const press = async (key: string, init: KeyboardEventInit = {}) => {
  const target = document.activeElement as HTMLElement

  target.dispatchEvent(
    new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true, ...init }),
  )

  await nextTick()
}

const lastModel = (list: VueWrapper) => list.emitted('update:modelValue')?.at(-1)?.[0]

describe('ListView structure', () => {
  it('renders a labelled grid of rows, each with one gridcell', async () => {
    const list = mountList()

    expect(list.get('[role=grid]').attributes('aria-label')).toBe('Files')
    expect(rows(list)).toHaveLength(5)
    expect(rows(list).every((r) => r.findAll('[role=gridcell]').length === 1)).toBe(true)
    expect(row(list, 'Documents').text()).toContain('Updated today')
    await expectAccessible(list)
  })

  it('has no selection state or checkboxes unless selectable', () => {
    const list = mountList()

    expect(list.get('[role=grid]').attributes('aria-multiselectable')).toBeUndefined()
    expect(row(list, 'Documents').attributes('aria-selected')).toBeUndefined()
    expect(list.find('[role=checkbox]').exists()).toBe(false)
  })

  it('marks rows selected in multiple selection, with a labelled checkbox per row', async () => {
    const list = mountList({ selectable: true, multiple: true, defaultValue: ['photos'] })

    expect(list.get('[role=grid]').attributes('aria-multiselectable')).toBe('true')
    expect(row(list, 'Photos').attributes('aria-selected')).toBe('true')
    expect(row(list, 'Documents').attributes('aria-selected')).toBe('false')

    expect(row(list, 'Documents').get('[role=checkbox]').attributes('aria-label')).toBe(
      'Select Documents',
    )

    await expectAccessible(list)
  })

  it('marks disabled rows aria-disabled, without a selected state or tab stop', () => {
    const list = mountList({ selectable: true, multiple: true })
    const archive = row(list, 'Archive.zip')

    expect(archive.attributes('aria-disabled')).toBe('true')
    expect(archive.attributes('aria-selected')).toBeUndefined()
    expect(archive.attributes('tabindex')).toBeUndefined()
  })

  it('is not multiselectable when selectable without multiple', () => {
    const list = mountList({ selectable: true })

    expect(list.get('[role=grid]').attributes('aria-multiselectable')).toBeUndefined()
    expect(row(list, 'Documents').attributes('aria-selected')).toBe('false')
  })

  it('ignores multiple without selectable', () => {
    const list = mountList({ multiple: true })

    expect(list.get('[role=grid]').attributes('aria-multiselectable')).toBeUndefined()
    expect(list.find('[role=checkbox]').exists()).toBe(false)
  })

  it('shows the empty state in a row when there are no items', () => {
    const list = mountList({ items: [] })

    expect(rows(list)).toHaveLength(1)
    expect(list.get('[role=gridcell]').text()).toBe('No results found')
  })

  it('renders the empty slot instead of the default text', () => {
    const list = mountList({ items: [] }, { slots: { empty: () => 'Nothing uploaded yet' } })

    expect(list.get('[role=gridcell]').text()).toBe('Nothing uploaded yet')
  })
})

describe('ListView keyboard', () => {
  it('ArrowDown and ArrowUp move focus between rows, skipping disabled ones', async () => {
    const list = mountList()
    focusRow(list, 'Photos')

    await press('ArrowDown')
    expect(focusedLabel()).toBe('README.md')

    await press('ArrowUp')
    expect(focusedLabel()).toBe('Photos')
  })

  it('Home and End move focus to the first and last enabled rows', async () => {
    const items = [{ value: 0, label: 'Zero', disabled: true }, ...files.slice(0, 2)]
    const list = mountList({ items: [...items, { value: 9, label: 'Nine', disabled: true }] })
    focusRow(list, 'Photos')

    await press('Home')
    expect(focusedLabel()).toBe('Documents')

    await press('End')
    expect(focusedLabel()).toBe('Photos')
  })

  it('focusing the list moves focus to the first selected row and makes it the tab stop', async () => {
    const list = mountList({ selectable: true, multiple: true, defaultValue: ['readme'] })
    const grid = list.get('[role=grid]')
    const gridElement = grid.element as HTMLElement
    expect(grid.attributes('tabindex')).toBe('0')

    gridElement.focus()
    await nextTick()

    expect(focusedLabel()).toBe('README.md')
    expect(row(list, 'README.md').attributes('tabindex')).toBe('0')
    expect(row(list, 'Documents').attributes('tabindex')).toBe('-1')
    expect(grid.attributes('tabindex')).toBe('-1')
  })

  it('typing a label focuses the matching enabled row', async () => {
    const list = mountList()
    focusRow(list, 'Documents')

    await press('p')
    expect(focusedLabel()).toBe('Photos')

    await press('a')
    expect(focusedLabel()).toBe('package.json')
  })

  it('ArrowRight and ArrowLeft move through the action slot and back to the row', async () => {
    const actions = () => [
      h('button', { type: 'button' }, 'Share'),
      h('button', { type: 'button' }, 'More'),
    ]

    const list = mountList({}, { slots: { 'item-action': actions } })
    focusRow(list, 'Documents')

    await press('ArrowRight')
    expect(document.activeElement?.textContent).toBe('Share')

    await press('ArrowRight')
    expect(document.activeElement?.textContent).toBe('More')

    await press('ArrowRight')
    expect(focusedLabel()).toBe('Documents')

    await press('ArrowLeft')
    expect(document.activeElement?.textContent).toBe('More')

    // Up/Down from a control still move between rows
    await press('ArrowDown')
    expect(focusedLabel()).toBe('Photos')
  })
})

describe('ListView selection', () => {
  it('Space toggles rows in multiple selection', async () => {
    const list = mountList({ selectable: true, multiple: true })
    focusRow(list, 'Documents')

    await press(' ')
    expect(lastModel(list)).toEqual(['docs'])

    await press('ArrowDown')
    await press(' ')
    expect(lastModel(list)).toEqual(['docs', 'photos'])

    await press(' ')
    expect(lastModel(list)).toEqual(['docs'])
  })

  it('Space selects the row or clears it in single selection', async () => {
    const list = mountList({ selectable: true })
    focusRow(list, 'Documents')

    await press(' ')
    expect(lastModel(list)).toBe('docs')

    await press(' ')
    expect(lastModel(list)).toBeNull()

    await press('ArrowDown')
    await press(' ')
    expect(lastModel(list)).toBe('photos')
  })

  it('Shift+ArrowDown extends a multiple selection over enabled rows', async () => {
    const list = mountList({ selectable: true, multiple: true })
    focusRow(list, 'Documents')

    await press(' ')
    await press('ArrowDown', { shiftKey: true })
    expect(lastModel(list)).toEqual(['docs', 'photos'])

    await press('ArrowDown', { shiftKey: true })
    expect(lastModel(list)).toEqual(['docs', 'photos', 'readme'])
  })

  it('replace behaviour: Space selects the row alone and the selection follows arrow keys', async () => {
    const list = mountList({
      selectable: true,
      multiple: true,
      selectionBehavior: 'replace',
      defaultValue: ['pkg'],
    })

    focusRow(list, 'Documents')

    await press(' ')
    expect(lastModel(list)).toEqual(['docs'])

    await press('ArrowDown')
    expect(lastModel(list)).toEqual(['photos'])

    // Ctrl moves focus alone, Ctrl+Space then adds the row
    const count = list.emitted('update:modelValue')!.length
    await press('ArrowDown', { ctrlKey: true })
    expect(list.emitted('update:modelValue')).toHaveLength(count)

    await press(' ', { ctrlKey: true })
    expect(lastModel(list)).toEqual(['photos', 'readme'])
  })

  it('Escape clears the selection and Ctrl+A selects every enabled row', async () => {
    const list = mountList({ selectable: true, multiple: true, defaultValue: ['docs'] })
    focusRow(list, 'Documents')

    await press('Escape')
    expect(lastModel(list)).toEqual([])

    await press('a', { ctrlKey: true })
    expect(lastModel(list)).toEqual(['docs', 'photos', 'readme', 'pkg'])
  })

  it('ignores clicks on disabled rows: no selection and no action', async () => {
    const onAction = vi.fn<(value: ListViewValue) => void>()
    const list = mountList({ selectable: true, multiple: true }, { attrs: { onAction } })

    await row(list, 'Archive.zip').trigger('click')
    expect(list.emitted('update:modelValue')).toBeUndefined()
    expect(onAction).not.toHaveBeenCalled()
  })

  it('v-model: the checkbox updates the selection and the bound value drives the rows', async () => {
    const list = mountList({ selectable: true, multiple: true, modelValue: [] })

    await row(list, 'Photos').get('[role=checkbox]').trigger('click')
    expect(lastModel(list)).toEqual(['photos'])

    // Controlled: nothing changes until the parent writes the value back
    expect(row(list, 'Photos').attributes('aria-selected')).toBe('false')

    await list.setProps({ modelValue: ['docs'] })
    expect(row(list, 'Documents').attributes('aria-selected')).toBe('true')
    expect(row(list, 'Photos').attributes('aria-selected')).toBe('false')
  })
})

describe('ListView actions', () => {
  it('Enter emits action with the row value', async () => {
    const onAction = vi.fn<(value: ListViewValue) => void>()
    const list = mountList({}, { attrs: { onAction } })
    focusRow(list, 'Photos')

    await press('Enter')
    expect(onAction).toHaveBeenCalledWith('photos')
  })

  it('a click runs the action while nothing is selected, and selects once something is', async () => {
    const onAction = vi.fn<(value: ListViewValue) => void>()
    const list = mountList({ selectable: true, multiple: true }, { attrs: { onAction } })

    await row(list, 'Documents').trigger('click')
    expect(onAction).toHaveBeenCalledWith('docs')
    expect(list.emitted('update:modelValue')).toBeUndefined()

    await row(list, 'Photos').get('[role=checkbox]').trigger('click')
    await row(list, 'Documents').trigger('click')
    expect(onAction).toHaveBeenCalledTimes(1)
    expect(lastModel(list)).toEqual(['photos', 'docs'])
  })

  it('Enter selects a row when nothing listens to action', async () => {
    const list = mountList({ selectable: true, multiple: true })
    focusRow(list, 'Documents')

    await press('Enter')
    expect(lastModel(list)).toEqual(['docs'])
  })

  it('replace behaviour: a click selects and a double click runs the action', async () => {
    const onAction = vi.fn<(value: ListViewValue) => void>()

    const list = mountList(
      { selectable: true, multiple: true, selectionBehavior: 'replace' },
      { attrs: { onAction } },
    )

    await row(list, 'Documents').trigger('click')
    expect(lastModel(list)).toEqual(['docs'])
    expect(onAction).not.toHaveBeenCalled()

    await row(list, 'Documents').trigger('dblclick')
    expect(onAction).toHaveBeenCalledWith('docs')
  })

  // jsdom has no PointerEvent: a plain event carries the pointer type
  const tap = async (target: { element: Element; trigger: (type: string) => Promise<void> }) => {
    const down = new Event('pointerdown', { bubbles: true })
    Object.defineProperty(down, 'pointerType', { value: 'touch' })
    target.element.dispatchEvent(down)
    await target.trigger('click')
  }

  it('replace behaviour: touch taps add and remove rows instead of replacing the selection', async () => {
    const list = mountList({ selectable: true, multiple: true, selectionBehavior: 'replace' })

    await tap(row(list, 'Documents'))
    await tap(row(list, 'Photos'))
    expect(lastModel(list)).toEqual(['docs', 'photos'])

    await tap(row(list, 'Documents'))
    expect(lastModel(list)).toEqual(['photos'])
  })

  it('replace behaviour: a touch tap runs the action and a double tap does not run it a third time', async () => {
    const onAction = vi.fn<(value: ListViewValue) => void>()

    const list = mountList(
      { selectable: true, multiple: true, selectionBehavior: 'replace' },
      { attrs: { onAction } },
    )

    await tap(row(list, 'Documents'))
    expect(onAction).toHaveBeenCalledWith('docs')
    expect(list.emitted('update:modelValue')).toBeUndefined()

    await tap(row(list, 'Documents'))
    await row(list, 'Documents').trigger('dblclick')
    expect(onAction).toHaveBeenCalledTimes(2)
  })

  it('a link row exposes its href and Enter opens it', async () => {
    const dispatch = vi.spyOn(HTMLAnchorElement.prototype, 'dispatchEvent').mockReturnValue(true)
    const list = mountList({ items: [{ value: 'a', label: 'Alpha', href: '/files/a' }] })

    expect(row(list, 'Alpha').attributes('data-href')).toBe('/files/a')
    focusRow(list, 'Alpha')

    await press('Enter')
    expect(dispatch).toHaveBeenCalledTimes(1)
    expect((dispatch.mock.contexts[0] as HTMLAnchorElement).getAttribute('href')).toBe('/files/a')
    expect(list.emitted('action')).toEqual([['a']])

    dispatch.mockRestore()
  })

  it('a link row navigates through the router on click', async () => {
    const navigate = vi.fn<(to: unknown) => void>()

    // A minimal vue-router RouterLink: it hands the link state to its slot
    const RouterLink = defineComponent({
      props: { to: { type: [String, Object], required: true }, custom: Boolean, replace: Boolean },
      setup(props, { slots }) {
        return () =>
          slots.default?.({
            href: `/app${props.to}`,
            isActive: false,
            isExactActive: false,
            navigate: () => navigate(props.to),
          })
      },
    })

    const list = mountList(
      { items: [{ value: 'b', label: 'Beta', to: '/b' }] },
      { components: { RouterLink } },
    )

    expect(row(list, 'Beta').attributes('data-href')).toBe('/app/b')

    await row(list, 'Beta').trigger('click')
    expect(navigate).toHaveBeenCalledWith('/b')
  })
})

describe('ListView virtualize', () => {
  it('renders only a window of a long list', async () => {
    // happy-dom has no layout: the virtualizer measures its scroll element's box, so give it one
    const sizes = [
      vi.spyOn(HTMLElement.prototype, 'clientHeight', 'get').mockReturnValue(300),
      vi.spyOn(HTMLElement.prototype, 'clientWidth', 'get').mockReturnValue(400),
      vi.spyOn(HTMLElement.prototype, 'offsetHeight', 'get').mockReturnValue(300),
      vi.spyOn(HTMLElement.prototype, 'offsetWidth', 'get').mockReturnValue(400),
    ]

    const items = Array.from({ length: 1000 }, (_, index) => ({
      value: index,
      label: `File ${index}`,
    }))

    const list = mountList({ items, virtualize: { overscan: 3 } })
    await nextTick()
    await nextTick()

    const rendered = rows(list)
    expect(rendered.length).toBeGreaterThan(0)
    expect(rendered.length).toBeLessThan(50)
    expect(list.get('[role=grid]').attributes('aria-rowcount')).toBe('1000')
    expect(rendered[0]!.attributes('aria-rowindex')).toBe('1')

    sizes.forEach((size) => size.mockRestore())
  })
})
