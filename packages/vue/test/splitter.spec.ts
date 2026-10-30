import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { h } from 'vue'

import type { SplitterItem, SplitterPanelApi, SplitterProps } from '@/components/splitter'
import { Splitter } from '@/components/splitter'

import { expectAccessible } from './a11y'
import { settle } from './settle'

const twoPanels: SplitterItem[] = [
  { slot: 'files', defaultSize: 30, minSize: 20, maxSize: 60 },
  { slot: 'editor', defaultSize: 70 },
]

const mountSplitter = async (
  props: SplitterProps = {},
  slots: Record<string, (props: Record<string, unknown>) => unknown> = {},
) => {
  const wrapper = mount(Splitter, {
    props: { items: twoPanels, ...props },
    slots: {
      files: () => 'Files',
      editor: () => 'Editor',
      ...slots,
    },
    attachTo: document.body,
  })

  await settle()

  return wrapper
}

const handles = () => [...document.querySelectorAll<HTMLElement>('[role=separator]')]

const press = async (target: HTMLElement, key: string) => {
  target.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true }))
  await settle()
}

afterEach(() => {
  vi.useRealTimers()
  document.body.innerHTML = ''
  localStorage.clear()
})

describe('Splitter', () => {
  it('renders each item as a panel with a separator between each pair', async () => {
    await mountSplitter(
      {
        items: [{ slot: 'a' }, { slot: 'b' }, { slot: 'c' }],
      },
      { a: () => 'A', b: () => 'B', c: () => 'C' },
    )

    const panels = document.querySelectorAll('[data-slot=splitter-panel]')
    expect([...panels].map((panel) => panel.textContent)).toEqual(['A', 'B', 'C'])
    expect(handles()).toHaveLength(2)
  })

  it('reports the size of the panel before each separator as its value', async () => {
    await mountSplitter()

    const [handle] = handles()
    expect(handle.getAttribute('aria-valuenow')).toBe('30')
    expect(handle.getAttribute('aria-valuemin')).toBe('20')
    expect(handle.getAttribute('aria-valuemax')).toBe('60')

    expect(handle.getAttribute('aria-controls')).toBe(
      document.querySelector('[data-slot=splitter-panel]')!.id,
    )
  })

  it('falls back to a panel-{index} slot and passes the item and index', async () => {
    const items = [{ label: 'Inbox' }, { label: 'Reader' }]
    const panel = ({ index }: Record<string, unknown>) =>
      `${items[Number(index)].label} #${String(index)}`

    await mountSplitter({ items }, { 'panel-0': panel, 'panel-1': panel })

    const panels = document.querySelectorAll('[data-slot=splitter-panel]')
    expect([...panels].map((el) => el.textContent)).toEqual(['Inbox #0', 'Reader #1'])
  })

  it('resizes with the arrow keys by keyboardResizeBy and emits layout and resize', async () => {
    const wrapper = await mountSplitter({ keyboardResizeBy: 5 })
    const [handle] = handles()

    await press(handle, 'ArrowRight')

    expect(handle.getAttribute('aria-valuenow')).toBe('35')
    expect(wrapper.emitted('layout')!.at(-1)).toEqual([[35, 65]])
    expect(wrapper.emitted('resize')).toContainEqual([0, 35, 30])

    await press(handle, 'ArrowLeft')

    expect(handle.getAttribute('aria-valuenow')).toBe('30')
  })

  it('jumps to the minimum and maximum size with Home and End', async () => {
    await mountSplitter()
    const [handle] = handles()

    await press(handle, 'End')
    expect(handle.getAttribute('aria-valuenow')).toBe('60')

    await press(handle, 'Home')
    expect(handle.getAttribute('aria-valuenow')).toBe('20')
  })

  it('resizes with the up and down arrows when vertical', async () => {
    await mountSplitter({ orientation: 'vertical' })
    const [handle] = handles()

    expect(handle.getAttribute('data-orientation')).toBe('vertical')

    await press(handle, 'ArrowDown')
    expect(handle.getAttribute('aria-valuenow')).toBe('40')
  })

  it('locks the layout when disabled', async () => {
    const wrapper = await mountSplitter({ disabled: true })
    const [handle] = handles()
    const layoutsBefore = wrapper.emitted('layout')?.length

    await press(handle, 'ArrowRight')

    expect(handle.hasAttribute('data-disabled')).toBe(true)
    expect(handle.getAttribute('aria-valuenow')).toBe('30')
    expect(wrapper.emitted('layout')?.length).toBe(layoutsBefore)
  })

  it('toggles a collapsible panel with Enter on its handle', async () => {
    const wrapper = await mountSplitter({
      items: [
        { slot: 'files', defaultSize: 30, minSize: 20, collapsible: true, collapsedSize: 5 },
        { slot: 'editor', defaultSize: 70 },
      ],
    })

    const [handle] = handles()
    const expandsOnMount = wrapper.emitted('expand')?.length ?? 0

    await press(handle, 'Enter')

    expect(handle.getAttribute('aria-valuenow')).toBe('5')
    expect(wrapper.emitted('layout')!.at(-1)).toEqual([[5, 95]])
    expect(wrapper.emitted('collapse')).toEqual([[0]])
    expect(wrapper.emitted('expand')?.length ?? 0).toBe(expandsOnMount)

    await press(handle, 'Enter')

    expect(handle.getAttribute('aria-valuenow')).toBe('30')
    expect(wrapper.emitted('layout')!.at(-1)).toEqual([[30, 70]])
    expect(wrapper.emitted('expand')).toHaveLength(expandsOnMount + 1)
    expect(wrapper.emitted('expand')!.at(-1)).toEqual([0])
  })

  it('toggles the panel after the handle with Enter when only that one is collapsible', async () => {
    const wrapper = await mountSplitter({
      items: [
        { slot: 'files', defaultSize: 70 },
        { slot: 'editor', defaultSize: 30, minSize: 20, collapsible: true },
      ],
    })

    const [handle] = handles()

    await press(handle, 'Enter')

    expect(handle.getAttribute('aria-valuenow')).toBe('100')
    expect(wrapper.emitted('collapse')).toEqual([[1]])
  })

  it('exposes collapse, expand and the collapsed state to the panel slot', async () => {
    let api: { collapse: () => void; expand: () => void } | undefined

    await mountSplitter(
      {
        items: [
          { slot: 'files', defaultSize: 30, minSize: 20, collapsible: true },
          { slot: 'editor', defaultSize: 70 },
        ],
      },
      {
        files: (props) => {
          api = props as typeof api

          return props.collapsed ? 'collapsed' : 'expanded'
        },
      },
    )

    const panel = () => document.querySelector('[data-slot=splitter-panel]')!
    expect(panel().textContent).toBe('expanded')

    api!.collapse()
    await settle()
    expect(panel().textContent).toBe('collapsed')
    expect(panel().getAttribute('data-state')).toBe('collapsed')

    api!.expand()
    await settle()
    expect(panel().textContent).toBe('expanded')
  })

  it('exposes the panel instances by index', async () => {
    const wrapper = await mountSplitter()
    const { panelsRef } = wrapper.vm as unknown as { panelsRef: SplitterPanelApi[] }

    expect(panelsRef.map((panel) => panel.getSize())).toEqual([30, 70])

    panelsRef[0].resize(45)
    await settle()

    expect(handles()[0].getAttribute('aria-valuenow')).toBe('45')
  })

  it('derives panel and handle ids from the splitter id', async () => {
    await mountSplitter({ id: 'workspace' })

    const ids = [...document.querySelectorAll('[data-slot^=splitter-]')].map((el) => el.id)
    expect(ids).toEqual(['workspace-panel-0', 'workspace-handle-0', 'workspace-panel-1'])
    const group = document.querySelector('[data-slot=splitter]')!
    expect(group.getAttribute('data-panel-group-id')).toBe('workspace')
  })

  it('persists the layout under autoSaveId in the given storage and restores it', async () => {
    vi.useFakeTimers()
    const saved = new Map<string, string>()
    const storage = {
      getItem: (name: string) => saved.get(name) ?? null,
      setItem: (name: string, value: string) => void saved.set(name, value),
    }

    const first = await mountSplitter({ autoSaveId: 'workspace', storage })
    await press(handles()[0], 'ArrowRight')
    vi.runAllTimers()
    first.unmount()

    expect(saved.size).toBe(1)

    await mountSplitter({ autoSaveId: 'workspace', storage })

    expect(handles()[0].getAttribute('aria-valuenow')).toBe('40')
  })

  it('renders a grip for the drag, pill and handle types and for line handles with indicator', async () => {
    const grips = async (props: SplitterProps) => {
      const wrapper = await mountSplitter(props)
      const grip = document.querySelector('[data-slot=splitter-indicator]')
      const hasIcon = grip?.querySelector('svg') !== null && grip !== null
      wrapper.unmount()

      return { hasGrip: grip !== null, hasIcon }
    }

    expect(await grips({})).toEqual({ hasGrip: false, hasIcon: false })
    expect(await grips({ indicator: true })).toEqual({ hasGrip: true, hasIcon: false })
    expect(await grips({ type: 'pill' })).toEqual({ hasGrip: true, hasIcon: false })
    expect(await grips({ type: 'handle' })).toEqual({ hasGrip: true, hasIcon: false })
    expect(await grips({ type: 'drag' })).toEqual({ hasGrip: true, hasIcon: true })
  })

  it('replaces the grip with the resize-handle slot', async () => {
    await mountSplitter(
      { type: 'drag', items: [{ slot: 'a' }, { slot: 'b' }, { slot: 'c' }] },
      { 'resize-handle': ({ index }) => h('b', `handle ${String(index)}`) },
    )

    expect(handles().map((handle) => handle.textContent)).toEqual(['handle 0', 'handle 1'])
    expect(document.querySelector('[data-slot=splitter-indicator]')).toBeNull()
  })

  it('has no accessibility violations', async () => {
    const wrapper = await mountSplitter({ type: 'drag' })

    await expectAccessible(wrapper)
  })
})
