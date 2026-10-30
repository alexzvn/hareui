import { flushPromises, mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { h } from 'vue'

import type {
  CommandPaletteGroup,
  CommandPaletteProps,
} from '@/components/command-palette/CommandPalette.types'
import CommandPalette from '@/components/command-palette/CommandPalette.vue'

import { expectAccessible } from './a11y'

const groups: CommandPaletteGroup[] = [
  {
    id: 'files',
    label: 'Files',
    items: [
      { label: 'Open recent', kbds: ['command', 'O'] },
      { label: 'Rename file', description: 'Change the name of this file' },
      { label: 'Archive', disabled: true },
    ],
  },
  {
    id: 'team',
    label: 'Team',
    items: [
      { label: 'Invite teammate', suffix: 'by email' },
      {
        label: 'Switch workspace',
        placeholder: 'Pick a workspace...',
        children: [{ label: 'Orchard' }, { label: 'Lighthouse' }],
      },
    ],
  },
]

const options = () => [...document.querySelectorAll<HTMLElement>('[role=option]')]

const labels = () =>
  options().map((option) =>
    option.querySelector('[data-slot=command-palette-item-label-base]')?.textContent?.trim(),
  )

const input = () =>
  document.querySelector<HTMLInputElement>('[data-slot=command-palette-input-field]')!

const mountPalette = (props: CommandPaletteProps = {}, slots = {}) =>
  mount(CommandPalette, { props: { groups, ...props }, slots, attachTo: document.body })

const type = async (value: string) => {
  input().value = value
  input().dispatchEvent(new Event('input'))
  await flushPromises()
}

const press = async (key: string) => {
  input().dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true }))
  await flushPromises()
}

afterEach(() => {
  document.body.innerHTML = ''
})

describe('CommandPalette', () => {
  it('renders a listbox of grouped options with headings', async () => {
    const wrapper = mountPalette()
    await flushPromises()

    expect(document.querySelector('[role=listbox]')).not.toBeNull()
    expect(document.querySelectorAll('[role=group]')).toHaveLength(2)

    expect(labels()).toEqual([
      'Open recent',
      'Rename file',
      'Archive',
      'Invite teammate',
      'Switch workspace',
    ])

    expect(document.body.textContent).toContain('Files')
    await expectAccessible(wrapper)
    wrapper.unmount()
  })

  it('filters the items by label, description and suffix as the user types', async () => {
    const wrapper = mountPalette()
    await type('rename')
    expect(labels()).toEqual(['Rename file'])
    await type('email')
    expect(labels()).toEqual(['Invite teammate'])
    expect(wrapper.emitted('update:searchTerm')?.at(-1)).toEqual(['email'])
    wrapper.unmount()
  })

  it('shows the empty text when nothing matches', async () => {
    const wrapper = mountPalette()
    await type('zzzz')
    expect(options()).toHaveLength(0)

    expect(document.querySelector('[data-slot=command-palette-empty]')?.textContent).toContain(
      'No matching data for "zzzz"',
    )

    wrapper.unmount()
  })

  it('replaces the empty text with the #empty slot', async () => {
    const wrapper = mountPalette(
      {},
      { empty: ({ searchTerm }: { searchTerm: string }) => `Nothing for ${searchTerm}` },
    )

    await type('qq')

    expect(document.querySelector('[data-slot=command-palette-empty]')?.textContent).toBe(
      'Nothing for qq',
    )

    wrapper.unmount()
  })

  it('selecting an item emits the value without search data and calls its onSelect', async () => {
    const onSelect = vi.fn<(event: Event) => void>()
    const wrapper = mountPalette({ groups: [{ id: 'a', items: [{ label: 'Ping', onSelect }] }] })
    await flushPromises()
    options()[0]!.click()
    await flushPromises()

    expect(onSelect).toHaveBeenCalledOnce()
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([{ label: 'Ping' }])
    expect(options()[0]!.getAttribute('aria-selected')).toBe('true')
    wrapper.unmount()
  })

  it('valueKey selects a field of the item; multiple keeps an array', async () => {
    const items = [
      { label: 'One', id: 1 },
      { label: 'Two', id: 2 },
    ]

    const wrapper = mountPalette({ groups: [{ id: 'n', items }], valueKey: 'id', multiple: true })
    await flushPromises()
    options()[0]!.click()
    await flushPromises()
    options()[1]!.click()
    await flushPromises()

    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([[1, 2]])
    wrapper.unmount()
  })

  it('disabled items are marked and cannot be selected', async () => {
    const wrapper = mountPalette()
    await flushPromises()
    const archive = options()[2]!
    expect(archive.getAttribute('aria-disabled')).toBe('true')
    archive.click()
    await flushPromises()
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    wrapper.unmount()
  })

  it('arrow keys move the highlight and Enter selects the highlighted item', async () => {
    const wrapper = mountPalette()
    await flushPromises()
    input().focus()
    await press('ArrowDown')
    const highlighted = document.querySelector('[role=option][data-highlighted]')
    expect(highlighted?.textContent).toContain('Rename file')
    await press('Enter')

    expect(wrapper.emitted('update:modelValue')?.at(-1)?.[0]).toMatchObject({
      label: 'Rename file',
    })

    wrapper.unmount()
  })

  it('an item with children opens them with its placeholder; back and Backspace return', async () => {
    const wrapper = mountPalette()
    await flushPromises()
    options()[4]!.click()
    await flushPromises()

    expect(labels()).toEqual(['Orchard', 'Lighthouse'])
    expect(input().placeholder).toBe('Pick a workspace...')
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()

    document.querySelector<HTMLElement>('[aria-label=Back]')!.click()
    await flushPromises()
    expect(labels()).toHaveLength(5)

    options()[4]!.click()
    await flushPromises()
    await press('Backspace')
    expect(labels()).toHaveLength(5)
    expect(input().placeholder).toBe('Type a command or search...')
    wrapper.unmount()
  })

  it('the close button emits update:open with false', async () => {
    const wrapper = mountPalette({ close: true })
    await flushPromises()
    document.querySelector<HTMLElement>('[data-slot=command-palette-close]')!.click()
    expect(wrapper.emitted('update:open')).toEqual([[false]])
    wrapper.unmount()
  })

  it('shows a busy indicator while loading', async () => {
    const wrapper = mountPalette({ loading: true })
    await flushPromises()
    expect(document.querySelector('[data-slot=command-palette-loading]')).not.toBeNull()
    wrapper.unmount()
  })

  it('loading.icon replaces the spinner', async () => {
    const wrapper = mountPalette({
      loading: { icon: { render: () => h('svg', { 'data-test': 'busy' }) } },
    })

    await flushPromises()
    const busy = document.querySelector('[data-slot=command-palette-loading][data-test=busy]')
    expect(busy).not.toBeNull()
    wrapper.unmount()
  })

  it('close.icon replaces the close button icon', async () => {
    const wrapper = mountPalette({ close: { icon: () => h('svg', { 'data-test': 'shut' }) } })
    await flushPromises()
    const shut = document.querySelector('[data-slot=command-palette-close] [data-test=shut]')
    expect(shut).not.toBeNull()
    wrapper.unmount()
  })

  it('renders shortcuts, suffixes and descriptions', async () => {
    const wrapper = mountPalette()
    await flushPromises()
    expect(options()[0]!.querySelectorAll('kbd')).toHaveLength(2)
    expect(options()[0]!.querySelector('abbr')?.getAttribute('title')).toBe('Command')
    expect(options()[1]!.textContent).toContain('Change the name of this file')
    expect(options()[3]!.textContent).toContain('by email')
    wrapper.unmount()
  })

  it('#<slot>-leading, #<slot>-label and #<slot>-group-label slots replace their parts', async () => {
    const wrapper = mountPalette(
      { groups: [{ id: 'g', label: 'People', slot: 'person', items: [{ label: 'Mira' }] }] },
      {
        'person-leading': () => h('i', { 'data-test': 'leading' }),
        'person-label': ({ item }: { item: { label: string } }) => `@${item.label}`,
        'person-group-label': ({ label }: { label: string }) => `${label}!`,
      },
    )

    await flushPromises()
    expect(document.querySelector('[data-test=leading]')).not.toBeNull()
    expect(options()[0]!.textContent).toContain('@Mira')
    expect(document.body.textContent).toContain('People!')
    wrapper.unmount()
  })

  it('virtualized rows keep their group slot', async () => {
    // happy-dom has no layout: the virtualizer measures its scroll element's box, so give it one
    const sizes = [
      vi.spyOn(HTMLElement.prototype, 'clientHeight', 'get').mockReturnValue(300),
      vi.spyOn(HTMLElement.prototype, 'offsetHeight', 'get').mockReturnValue(300),
      vi.spyOn(HTMLElement.prototype, 'clientWidth', 'get').mockReturnValue(300),
      vi.spyOn(HTMLElement.prototype, 'offsetWidth', 'get').mockReturnValue(300),
    ]

    const wrapper = mountPalette(
      {
        virtualize: true,
        groups: [
          { id: 'people', slot: 'person', items: [{ label: 'Mira' }] },
          { id: 'server', slot: 'person', ignoreFilter: true, items: [{ label: 'Remote' }] },
        ],
      },
      { 'person-label': ({ item }: { item: { label: string } }) => `@${item.label}` },
    )

    await flushPromises()
    sizes.forEach((size) => size.mockRestore())

    expect(options().map((option) => option.textContent?.trim())).toEqual(['@Mira', '@Remote'])
    wrapper.unmount()
  })

  it('ignoreFilter keeps a group unfiltered; postFilter narrows the matches', async () => {
    const wrapper = mountPalette({
      groups: [
        { id: 'server', ignoreFilter: true, items: [{ label: 'Remote result' }] },
        {
          id: 'local',
          items: [{ label: 'Local alpha' }, { label: 'Local beta' }],
          postFilter: (_term, items) => items.filter((item) => item.label !== 'Local beta'),
        },
      ],
    })

    await type('local')
    expect(labels()).toEqual(['Remote result', 'Local alpha'])
    wrapper.unmount()
  })

  it('marks matched characters when includeMatches is on', async () => {
    const wrapper = mountPalette({ fuse: { fuseOptions: { includeMatches: true } } })
    await type('rename')
    expect(options()[0]!.querySelector('mark')?.textContent).toBe('Rename')
    wrapper.unmount()
  })

  it('hides the input when input is false', async () => {
    const wrapper = mountPalette({ input: false })
    await flushPromises()
    expect(document.querySelector('[data-slot=command-palette-input-field]')).toBeNull()
    expect(options()).toHaveLength(5)
    wrapper.unmount()
  })

  it('renders link items as anchors', async () => {
    const wrapper = mountPalette({
      groups: [
        { id: 'l', items: [{ label: 'Docs', href: 'https://example.com', target: '_blank' }] },
      ],
    })

    await flushPromises()
    const anchor = options()[0]!
    expect(anchor.tagName).toBe('A')
    expect(anchor.getAttribute('href')).toBe('https://example.com')
    expect(anchor.getAttribute('rel')).toBe('noopener noreferrer')
    wrapper.unmount()
  })

  it('header and footer slots render around the list', async () => {
    const wrapper = mountPalette({}, { header: () => 'Scope: all', footer: () => 'Enter to run' })
    await flushPromises()

    expect(document.querySelector('[data-slot=command-palette-header]')?.textContent).toBe(
      'Scope: all',
    )

    expect(document.querySelector('[data-slot=command-palette-footer]')?.textContent).toBe(
      'Enter to run',
    )

    wrapper.unmount()
  })
})

describe('CommandPalette match highlighting', () => {
  const marks = (slot: string) =>
    [...document.querySelectorAll(`[data-slot=command-palette-item-${slot}] mark`)].map(
      (mark) => mark.textContent,
    )

  const mountHighlighting = (items: CommandPaletteGroup['items']) =>
    mountPalette({
      groups: [{ id: 'g', items }],
      fuse: { fuseOptions: { includeMatches: true } },
    })

  it('marks the matched part of the label', async () => {
    const wrapper = mountHighlighting([{ label: 'Rename file' }])
    await type('rename')
    expect(marks('label-base')).toEqual(['Rename'])
    wrapper.unmount()
  })

  it('leaves a field without matches unmarked', async () => {
    const wrapper = mountHighlighting([{ label: 'Rename', description: 'Pick a new name' }])
    await type('rename')
    expect(marks('description')).toEqual([])
    wrapper.unmount()
  })

  it('cuts a long start so the first match stays visible', async () => {
    const wrapper = mountHighlighting([{ label: `${'x'.repeat(40)}target` }])
    await type('target')
    const label = document.querySelector('[data-slot=command-palette-item-label-base]')
    expect(label?.textContent).toBe(`...${'x'.repeat(13)}target`)
    wrapper.unmount()
  })

  it('starts a cut-off snippet at a word, not inside one', async () => {
    const wrapper = mountHighlighting([
      { label: 'Keep working without a connection, then sync your notes' },
    ])

    await type('notes')
    const label = document.querySelector('[data-slot=command-palette-item-label-base]')
    expect(label?.textContent).toBe('...sync your notes')
    wrapper.unmount()
  })
})
