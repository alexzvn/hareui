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
  vi.restoreAllMocks()
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
  const event = new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true, ...init })

  target.dispatchEvent(event)
  await nextTick()

  return event
}

const lastModel = (list: VueWrapper) => list.emitted('update:modelValue')?.at(-1)?.[0]

const actionButtons = () => [
  h('button', { type: 'button' }, 'Share'),
  h('button', { type: 'button' }, 'More'),
]

const actionButton = (list: VueWrapper, label: string, text: string) => {
  const found = row(list, label)
    .findAll('button')
    .find((button) => button.text() === text)

  if (!found) throw new Error(`No ${text} button in ${label}`)

  return found
}

// What the browser's Tab order can reach inside the list
const tabbables = (list: VueWrapper) => {
  const root = list.element as HTMLElement

  return [root, ...root.querySelectorAll<HTMLElement>('*')].filter((el) => el.tabIndex >= 0)
}

const manyFiles = Array.from({ length: 1000 }, (_, index) => ({
  value: index,
  label: `File ${index}`,
}))

// happy-dom has no layout: the virtualizer measures its scroll element's box and each row, and clamps scrolling to
// the scroll height, so give them sizes (restored after each test)
const mockLayout = () => {
  vi.spyOn(HTMLElement.prototype, 'clientHeight', 'get').mockReturnValue(300)
  vi.spyOn(HTMLElement.prototype, 'clientWidth', 'get').mockReturnValue(400)
  vi.spyOn(HTMLElement.prototype, 'offsetHeight', 'get').mockReturnValue(300)
  vi.spyOn(HTMLElement.prototype, 'offsetWidth', 'get').mockReturnValue(400)
  vi.spyOn(HTMLElement.prototype, 'scrollHeight', 'get').mockReturnValue(1_000_000)
}

const renderedRowIndices = (list: VueWrapper) =>
  rows(list).map((r) => Number(r.attributes('aria-rowindex')))

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
    const list = mountList({}, { slots: { 'item-action': actionButtons } })
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

  it('ArrowLeft and ArrowRight are mirrored in a right-to-left layout', async () => {
    const list = mountList(
      {},
      { slots: { 'item-action': actionButtons }, attrs: { style: 'direction: rtl' } },
    )

    focusRow(list, 'Documents')

    await press('ArrowLeft')
    expect(document.activeElement?.textContent).toBe('Share')

    await press('ArrowRight')
    expect(focusedLabel()).toBe('Documents')

    await press('ArrowRight')
    expect(document.activeElement?.textContent).toBe('More')
  })

  it('PageDown and PageUp move focus by the height of the scrolling list', async () => {
    const items = manyFiles.slice(0, 8)
    const list = mountList({ items }, { attrs: { style: 'overflow-y: auto' } })

    // A 60px viewport over 20px rows: a page down from a row reaches the row 40px below it
    Object.defineProperties(list.element, {
      clientHeight: { value: 60 },
      scrollHeight: { value: 160 },
    })

    rows(list).forEach((r, index) => {
      Object.defineProperties(r.element, {
        offsetTop: { value: index * 20 },
        offsetHeight: { value: 20 },
      })
    })

    focusRow(list, 'File 0')

    await press('PageDown')
    expect(focusedLabel()).toBe('File 2')

    await press('PageDown')
    expect(focusedLabel()).toBe('File 4')

    await press('PageUp')
    expect(focusedLabel()).toBe('File 2')
  })
})

describe('ListView tab order', () => {
  it('the focused row is the only tab stop: action controls leave the tab order', async () => {
    const list = mountList({}, { slots: { 'item-action': actionButtons } })
    focusRow(list, 'Photos')
    await nextTick()

    expect(tabbables(list)).toEqual([row(list, 'Photos').element])
    expect(actionButton(list, 'Documents', 'Share').attributes('tabindex')).toBe('-1')
  })

  it('Tab from outside onto a control still in the tab order lands on the focused row', async () => {
    const outside = document.createElement('button')
    document.body.prepend(outside)
    const list = mountList({}, { slots: { 'item-action': actionButtons } })
    focusRow(list, 'Photos')
    outside.focus()

    // A control rendered with tabindex 0, reached before the list takes it out of the tab order
    const share = actionButton(list, 'Documents', 'Share').element as HTMLElement
    share.setAttribute('tabindex', '0')
    share.focus()

    expect(focusedLabel()).toBe('Photos')
    outside.remove()
  })

  it('a control focused by a pointer or script keeps focus, and its row becomes the tab stop', async () => {
    const list = mountList({}, { slots: { 'item-action': actionButtons } })
    focusRow(list, 'Photos')

    const share = actionButton(list, 'Documents', 'Share').element as HTMLElement
    share.focus()
    await nextTick()

    expect(document.activeElement).toBe(share)
    expect(tabbables(list)).toEqual([row(list, 'Documents').element])
  })

  it('Tab leaves the list from the focused row, past the action controls', async () => {
    const list = mountList({}, { slots: { 'item-action': actionButtons } })
    focusRow(list, 'Photos')

    const event = await press('Tab')

    // The browser moves on from the list's last tab stop, the focused row itself
    expect(event.defaultPrevented).toBe(false)
    expect(focusedLabel()).toBe('Photos')
    expect(tabbables(list).at(-1)).toBe(row(list, 'Photos').element)
  })

  it('Shift+Tab leaves the list: focus moves to the list, which is out of the tab order', async () => {
    const list = mountList({}, { slots: { 'item-action': actionButtons } })
    focusRow(list, 'Photos')

    const event = await press('Tab', { shiftKey: true })

    expect(event.defaultPrevented).toBe(false)
    expect(document.activeElement).toBe(list.element)
    expect(list.attributes('tabindex')).toBe('-1')
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

  it('Shift+click selects the range from the last clicked row over enabled rows', async () => {
    const list = mountList({ selectable: true, multiple: true })

    await row(list, 'Documents').trigger('click')
    await row(list, 'README.md').trigger('click', { shiftKey: true })

    expect(lastModel(list)).toEqual(['docs', 'photos', 'readme'])
  })

  it('replace behaviour: a click selects the row alone and Ctrl or Cmd+click adds or removes it', async () => {
    const list = mountList({ selectable: true, multiple: true, selectionBehavior: 'replace' })

    await row(list, 'Documents').trigger('click')
    await row(list, 'README.md').trigger('click', { ctrlKey: true })
    expect(lastModel(list)).toEqual(['docs', 'readme'])

    await row(list, 'Documents').trigger('click', { metaKey: true })
    expect(lastModel(list)).toEqual(['readme'])

    await row(list, 'Photos').trigger('click')
    expect(lastModel(list)).toEqual(['photos'])
  })

  it('replace behaviour: Shift+click extends from the row clicked alone', async () => {
    const list = mountList({ selectable: true, multiple: true, selectionBehavior: 'replace' })

    await row(list, 'Photos').trigger('click')
    await row(list, 'package.json').trigger('click', { shiftKey: true })

    expect(lastModel(list)).toEqual(['photos', 'readme', 'pkg'])
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

  it('a click on a control in the action slot neither presses nor selects the row', async () => {
    const onAction = vi.fn<(value: ListViewValue) => void>()
    const onShare = vi.fn<() => void>()
    const share = () => h('button', { type: 'button', onClick: onShare }, 'Share')

    const list = mountList(
      { selectable: true, multiple: true },
      { attrs: { onAction }, slots: { 'item-action': share } },
    )

    await actionButton(list, 'Documents', 'Share').trigger('click')

    expect(onShare).toHaveBeenCalledTimes(1)
    expect(onAction).not.toHaveBeenCalled()
    expect(list.emitted('update:modelValue')).toBeUndefined()
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

  it('a link row is actionable without an action listener: a click opens it instead of selecting', async () => {
    const dispatch = vi.spyOn(HTMLAnchorElement.prototype, 'dispatchEvent').mockReturnValue(true)

    const list = mountList({
      items: [{ value: 'a', label: 'Alpha', href: '/files/a' }],
      selectable: true,
      multiple: true,
    })

    await row(list, 'Alpha').trigger('click')

    expect(dispatch).toHaveBeenCalledTimes(1)
    expect(list.emitted('action')).toEqual([['a']])
    expect(list.emitted('update:modelValue')).toBeUndefined()
  })
})

describe('ListView virtualize', () => {
  it('renders only a window of a long list', async () => {
    mockLayout()
    const list = mountList({ items: manyFiles, virtualize: { overscan: 3 } })
    await nextTick()
    await nextTick()

    const rendered = rows(list)
    expect(rendered.length).toBeGreaterThan(0)
    expect(rendered.length).toBeLessThan(50)
    expect(list.get('[role=grid]').attributes('aria-rowcount')).toBe('1000')
    expect(rendered[0]!.attributes('aria-rowindex')).toBe('1')
  })

  it('keeps the focused row rendered when it scrolls out of view, so arrow keys still move', async () => {
    mockLayout()
    const list = mountList({ items: manyFiles, virtualize: true })
    await vi.waitFor(() => row(list, 'File 0'))
    focusRow(list, 'File 0')

    const grid = list.element as HTMLElement
    grid.scrollTop = 20_000
    grid.dispatchEvent(new Event('scroll'))

    await vi.waitFor(() => expect(Math.max(...renderedRowIndices(list))).toBeGreaterThan(100))
    expect(document.activeElement).toBe(row(list, 'File 0').element)

    await press('ArrowDown')
    await vi.waitFor(() => expect(focusedLabel()).toBe('File 1'))
  })

  it('End moves focus to the last row while it is off screen', async () => {
    mockLayout()
    const list = mountList({ items: manyFiles, virtualize: true })
    await vi.waitFor(() => row(list, 'File 0'))
    focusRow(list, 'File 0')

    await press('End')

    await vi.waitFor(() => expect(focusedLabel()).toBe('File 999'))
    expect(row(list, 'File 999').attributes('aria-rowindex')).toBe('1000')
  })
})
