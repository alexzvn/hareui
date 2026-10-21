import type { DashboardContext, DashboardStorageAdapter } from '../src/composables/useDashboard'
import { mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, h, nextTick, ref } from 'vue'
import DashboardGroup from '../src/components/dashboard-group/DashboardGroup.vue'
import DashboardPanel from '../src/components/dashboard-panel/DashboardPanel.vue'
import DashboardSidebar from '../src/components/dashboard-sidebar/DashboardSidebar.vue'
import { useDashboard } from '../src/composables/useDashboard'

async function settle() {
  for (let i = 0; i < 4; i++)
    await nextTick()
}

function clearCookies() {
  for (const part of document.cookie.split(';')) {
    const name = part.split('=')[0]?.trim()
    if (name)
      document.cookie = `${name}=; path=/; max-age=0`
  }
}

function cookieValue(key: string): unknown {
  const entry = document.cookie.split(';').map(p => p.trim()).find(p => p.startsWith(`${encodeURIComponent(key)}=`))
  return entry ? JSON.parse(decodeURIComponent(entry.slice(entry.indexOf('=') + 1))) : undefined
}

const aside = (root: ParentNode = document) => root.querySelector<HTMLElement>('[data-slot=dashboard-sidebar]')!
const handle = (root: ParentNode = document) => root.querySelector<HTMLElement>('[data-slot=dashboard-resize-handle]')!
const width = (el: HTMLElement) => el.style.getPropertyValue('--width')

/** happy-dom has no layout: give the sidebar and its parent a width for the drag maths (parent 1000px). */
function layout(el: HTMLElement, elWidth: number, parentWidth = 1000) {
  vi.spyOn(el, 'getBoundingClientRect').mockReturnValue({ width: elWidth } as DOMRect)
  vi.spyOn(el.parentElement!, 'getBoundingClientRect').mockReturnValue({ width: parentWidth } as DOMRect)
}

function press(target: Element, clientX: number) {
  target.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, button: 0, clientX, pointerId: 1, pointerType: 'mouse' }))
}
function move(clientX: number) {
  document.dispatchEvent(new PointerEvent('pointermove', { bubbles: true, clientX, pointerId: 1, pointerType: 'mouse' }))
}
function release() {
  document.dispatchEvent(new PointerEvent('pointerup', { bubbles: true, pointerId: 1, pointerType: 'mouse' }))
}
/** Press the handle at `from`, drag to `to`, release (release flushes the pending animation frame). */
async function drag(from: number, to: number) {
  press(handle(), from)
  move(to)
  release()
  await nextTick()
}

async function key(target: Element, k: string, init: KeyboardEventInit = {}) {
  target.dispatchEvent(new KeyboardEvent('keydown', { key: k, bubbles: true, cancelable: true, ...init }))
  await nextTick()
}

type Props = Record<string, unknown>
function mountSidebar(sidebar: Props = {}, group: Props = {}) {
  return mount(DashboardGroup, {
    props: { class: 'relative', ...group },
    slots: { default: () => h(DashboardSidebar, { id: 'main', resizable: true, ...sidebar }, { default: () => 'Body' }) },
    attachTo: document.body,
  })
}

describe('dashboard sidebar', () => {
  beforeEach(() => {
    clearCookies()
    localStorage.clear()
  })
  afterEach(() => {
    vi.restoreAllMocks()
    document.body.innerHTML = ''
    document.body.style.cssText = ''
  })

  describe('resizing', () => {
    it('starts at defaultSize and clamps drags to minSize / maxSize', async () => {
      const wrapper = mountSidebar({ minSize: 10, maxSize: 20, defaultSize: 15 })
      expect(width(aside())).toBe('15%')
      layout(aside(), 150)

      await drag(150, 400) // 400px = 40%
      expect(width(aside())).toBe('20%')

      layout(aside(), 200)
      await drag(200, 50) // 50px = 5%
      expect(width(aside())).toBe('10%')

      layout(aside(), 100)
      await drag(100, 160) // 160px = 16%
      expect(width(aside())).toBe('16%')
      wrapper.unmount()
    })

    it('a right sidebar grows when dragged to the left', async () => {
      const wrapper = mountSidebar({ side: 'right', minSize: 10, maxSize: 30, defaultSize: 15 })
      layout(aside(), 150)
      await drag(850, 750) // 100px to the left: 150 + 100 = 250px
      expect(width(aside())).toBe('25%')
      wrapper.unmount()
    })

    it('uses the group unit: px and rem', async () => {
      const px = mountSidebar({ minSize: 100, maxSize: 400, defaultSize: 200 }, { unit: 'px' })
      expect(width(aside())).toBe('200px')
      layout(aside(), 200)
      await drag(200, 280)
      expect(width(aside())).toBe('280px')
      px.unmount()
      clearCookies() // same storage key: a persisted px size must not leak into the rem mount

      const rem = mountSidebar({ minSize: 5, maxSize: 30, defaultSize: 10 }, { unit: 'rem' })
      expect(width(aside())).toBe('10rem')
      layout(aside(), 160)
      await drag(160, 240) // +80px at a 16px root font size = +5rem
      expect(width(aside())).toBe('15rem')
      rem.unmount()
    })

    it('coalesces pointer moves into one animation frame and applies the last position', async () => {
      const frames: FrameRequestCallback[] = []
      vi.spyOn(globalThis, 'requestAnimationFrame').mockImplementation((cb) => {
        frames.push(cb)
        return frames.length
      })
      const wrapper = mountSidebar({ minSize: 10, maxSize: 40, defaultSize: 15 })
      layout(aside(), 150)

      press(handle(), 150)
      move(200)
      move(250)
      move(300)
      expect(frames).toHaveLength(1)
      expect(width(aside())).toBe('15%') // nothing applied before the frame

      frames[0]!(0)
      await nextTick()
      expect(width(aside())).toBe('30%')
      release()
      wrapper.unmount()
    })

    it('locks body selection and cursor only while dragging, and drops transitions via data-dragging', async () => {
      const wrapper = mountSidebar()
      layout(aside(), 150)
      document.body.style.cursor = 'pointer'

      press(handle(), 150)
      await nextTick()
      expect(document.body.style.userSelect).toBe('none')
      expect(document.body.style.cursor).toBe('col-resize')
      expect(aside().dataset.dragging).toBe('true')
      expect(handle().dataset.dragging).toBe('true')

      release()
      await nextTick()
      expect(document.body.style.userSelect).toBe('')
      expect(document.body.style.cursor).toBe('pointer')
      expect(aside().dataset.dragging).toBe('false')
      wrapper.unmount()
    })

    it('ignores non-primary mouse buttons and stops listening after release', async () => {
      const wrapper = mountSidebar({ minSize: 10, maxSize: 40 })
      layout(aside(), 150)

      handle().dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, button: 2, clientX: 150, pointerId: 1, pointerType: 'mouse' }))
      move(300)
      expect(width(aside())).toBe('15%')

      await drag(150, 200)
      expect(width(aside())).toBe('20%')
      move(350)
      expect(width(aside())).toBe('20%')
      wrapper.unmount()
    })

    it('does not render a handle unless resizable', async () => {
      const wrapper = mountSidebar({ resizable: false })
      expect(handle()).toBeNull()
      wrapper.unmount()
    })

    it('double click restores the default size and expands a collapsed sidebar', async () => {
      const wrapper = mountSidebar({ collapsible: true, minSize: 10, maxSize: 40, defaultSize: 15 })
      layout(aside(), 150)
      await drag(150, 300)
      expect(width(aside())).toBe('30%')

      handle().dispatchEvent(new MouseEvent('dblclick', { bubbles: true, cancelable: true }))
      await nextTick()
      expect(width(aside())).toBe('15%')

      await key(handle(), 'Enter')
      await nextTick()
      expect(aside().dataset.collapsed).toBe('true')
      handle().dispatchEvent(new MouseEvent('dblclick', { bubbles: true, cancelable: true }))
      await nextTick()
      expect(aside().dataset.collapsed).toBe('false')
      expect(width(aside())).toBe('15%')
      wrapper.unmount()
    })
  })

  describe('collapsing', () => {
    it('collapses when dragged within 4 units of collapsedSize and expands again when dragged back', async () => {
      const wrapper = mountSidebar({ collapsible: true, minSize: 10, maxSize: 30, defaultSize: 15, collapsedSize: 0 })
      layout(aside(), 150)

      await drag(150, 20) // 20px = 2% < 4%
      await nextTick()
      expect(aside().dataset.collapsed).toBe('true')
      expect(width(aside())).toBe('0%')

      layout(aside(), 48)
      await drag(48, 200) // 200px = 20%
      await nextTick()
      expect(aside().dataset.collapsed).toBe('false')
      expect(width(aside())).toBe('20%')
      wrapper.unmount()
    })

    it('does not collapse a sidebar that is not collapsible', async () => {
      const wrapper = mountSidebar({ minSize: 10, maxSize: 30 })
      layout(aside(), 150)
      await drag(150, 5)
      expect(aside().dataset.collapsed).toBe('false')
      expect(width(aside())).toBe('10%')
      wrapper.unmount()
    })

    it('hides the handle while it renders collapsed at 0px (nothing to drag from), but not on a 48px rail', async () => {
      // happy-dom has no layout: record the observers and replay a resize after mocking the width.
      const observers: (() => void)[] = []
      vi.stubGlobal('ResizeObserver', class {
        constructor(private cb: () => void) {}
        observe() { observers.push(this.cb) }
        disconnect() {}
      })
      const resized = async (el: HTMLElement, w: number) => {
        layout(el, w)
        for (const cb of observers) cb()
        await nextTick()
      }

      const wrapper = mountSidebar({ collapsible: true, minSize: 10, maxSize: 30, defaultSize: 15, collapsedSize: 0 })
      await resized(aside(), 150)
      expect(handle().hidden).toBe(false)
      await drag(150, 20)
      expect(aside().dataset.collapsed).toBe('true')

      // The default rail: collapsed, but still 48px wide by its CSS minimum, so it stays draggable.
      await resized(aside(), 48)
      expect(handle().hidden).toBe(false)
      await drag(48, 200)
      expect(aside().dataset.collapsed).toBe('false')
      expect(width(aside())).toBe('20%')

      // Off-canvas: collapsed to 0px. A press starts no drag (as in Nuxt UI), so the handle hides.
      await drag(200, 20)
      await resized(aside(), 0)
      expect(handle().hidden).toBe(true)
      press(handle(), 0)
      expect(handle().dataset.dragging).toBe('false')
      expect(document.body.style.cursor).toBe('')
      release()

      // Reopening (here: Enter, as a collapse button would) brings it back once the sidebar has a width again.
      await key(handle(), 'Enter')
      expect(aside().dataset.collapsed).toBe('false')
      await resized(aside(), 150)
      expect(handle().hidden).toBe(false)
      wrapper.unmount()
      vi.unstubAllGlobals()
    })

    it('reports the collapsed size while collapsed and passes collapsed/collapse to slots', async () => {
      const seen: boolean[] = []
      const wrapper = mount(DashboardGroup, {
        slots: {
          default: () => h(DashboardSidebar, { id: 'main', collapsible: true, collapsedSize: 5, defaultSize: 15 }, {
            default: ({ collapsed, collapse }: { collapsed: boolean, collapse: (v: boolean) => void }) => {
              seen.push(collapsed)
              return h('button', { id: 'c', onClick: () => collapse(!collapsed) }, collapsed ? 'open' : 'close')
            },
          }),
        },
        attachTo: document.body,
      })
      expect(width(aside())).toBe('15%')
      document.querySelector<HTMLElement>('#c')!.click()
      await nextTick()
      expect(aside().dataset.collapsed).toBe('true')
      expect(width(aside())).toBe('5%')
      expect(document.querySelector('#c')!.textContent).toBe('open')
      expect(seen).toContain(true)
      wrapper.unmount()
    })
  })

  describe('persistence', () => {
    it('cookie: writes after the drag (not during) and the next mount starts at the stored size', async () => {
      const first = mountSidebar({ minSize: 10, maxSize: 40, defaultSize: 15 })
      layout(aside(), 150)

      press(handle(), 150)
      move(250)
      expect(cookieValue('dashboard-sidebar-main')).toBeUndefined()
      release()
      expect(cookieValue('dashboard-sidebar-main')).toEqual({ size: 25, collapsed: false })
      first.unmount()

      const second = mountSidebar({ minSize: 10, maxSize: 40, defaultSize: 15 })
      // Read synchronously at setup: the very first render already has the stored size.
      expect(width(aside())).toBe('25%')
      second.unmount()
    })

    it('local: reads and writes localStorage under `${storageKey}-sidebar-${id}`', async () => {
      localStorage.setItem('app-sidebar-main', JSON.stringify({ size: 18, collapsed: false }))
      const wrapper = mountSidebar({ minSize: 10, maxSize: 40 }, { storage: 'local', storageKey: 'app' })
      expect(width(aside())).toBe('18%')
      expect(aside().id).toBe('app-sidebar-main')

      layout(aside(), 180)
      await drag(180, 300)
      expect(JSON.parse(localStorage.getItem('app-sidebar-main')!)).toEqual({ size: 30, collapsed: false })
      expect(document.cookie).not.toContain('app-sidebar-main')
      wrapper.unmount()
    })

    it('adapter: uses getItem/setItem of a custom storage', async () => {
      const data = new Map<string, string>([['dashboard-sidebar-main', JSON.stringify({ size: 22, collapsed: false })]])
      const adapter: DashboardStorageAdapter = {
        getItem: vi.fn((k: string) => data.get(k)),
        setItem: vi.fn((k: string, v: string) => void data.set(k, v)),
      }
      const wrapper = mountSidebar({ minSize: 10, maxSize: 40 }, { storage: adapter })
      expect(adapter.getItem).toHaveBeenCalledWith('dashboard-sidebar-main')
      expect(width(aside())).toBe('22%')

      layout(aside(), 220)
      await drag(220, 320)
      expect(adapter.setItem).toHaveBeenLastCalledWith('dashboard-sidebar-main', JSON.stringify({ size: 32, collapsed: false }))
      wrapper.unmount()
    })

    it('persists and restores the collapsed state', async () => {
      const first = mountSidebar({ collapsible: true, defaultSize: 15, collapsedSize: 0 })
      await key(handle(), 'Enter')
      await nextTick()
      expect(cookieValue('dashboard-sidebar-main')).toEqual({ size: 15, collapsed: true })
      first.unmount()

      const second = mountSidebar({ collapsible: true, defaultSize: 15, collapsedSize: 0 })
      expect(aside().dataset.collapsed).toBe('true')
      expect(width(aside())).toBe('0%')
      second.unmount()
    })

    it('persistent=false neither reads nor writes', async () => {
      localStorage.setItem('dashboard-sidebar-main', JSON.stringify({ size: 30, collapsed: false }))
      const adapter: DashboardStorageAdapter = { getItem: vi.fn(() => JSON.stringify({ size: 30, collapsed: false })), setItem: vi.fn() }
      const wrapper = mountSidebar({ minSize: 10, maxSize: 40, defaultSize: 15 }, { storage: adapter, persistent: false })
      expect(adapter.getItem).not.toHaveBeenCalled()
      expect(width(aside())).toBe('15%')

      layout(aside(), 150)
      await drag(150, 250)
      expect(width(aside())).toBe('25%')
      expect(adapter.setItem).not.toHaveBeenCalled()
      expect(document.cookie).toBe('')
      wrapper.unmount()
    })

    it('a sidebar that is neither resizable nor collapsible is not persisted', async () => {
      const adapter: DashboardStorageAdapter = { getItem: vi.fn(), setItem: vi.fn() }
      const wrapper = mountSidebar({ resizable: false, collapsible: false }, { storage: adapter })
      expect(adapter.getItem).not.toHaveBeenCalled()
      wrapper.unmount()
    })

    it('ignores corrupted entries, clamps stored sizes and survives failing storage', async () => {
      document.cookie = `dashboard-sidebar-main=${encodeURIComponent('not json')}; path=/`
      const corrupted = mountSidebar({ defaultSize: 15 })
      expect(width(aside())).toBe('15%')
      corrupted.unmount()

      document.cookie = `dashboard-sidebar-main=${encodeURIComponent(JSON.stringify({ size: 99, collapsed: 'yes' }))}; path=/`
      const clamped = mountSidebar({ minSize: 10, maxSize: 20, defaultSize: 15 })
      expect(width(aside())).toBe('20%')
      expect(aside().dataset.collapsed).toBe('false')
      clamped.unmount()

      const failing: DashboardStorageAdapter = { getItem: () => { throw new Error('denied') }, setItem: () => { throw new Error('denied') } }
      const broken = mountSidebar({ minSize: 10, maxSize: 40, defaultSize: 15 }, { storage: failing })
      expect(width(aside())).toBe('15%')
      layout(aside(), 150)
      await expect(drag(150, 250)).resolves.toBeUndefined()
      expect(width(aside())).toBe('25%')
      broken.unmount()
    })
  })

  describe('keyboard', () => {
    it('exposes a focusable vertical separator with aria values', async () => {
      const wrapper = mountSidebar({ minSize: 10, maxSize: 20, defaultSize: 15, collapsible: true, collapsedSize: 4 })
      const el = handle()
      expect(el.getAttribute('role')).toBe('separator')
      expect(el.getAttribute('aria-orientation')).toBe('vertical')
      expect(el.getAttribute('tabindex')).toBe('0')
      expect(el.getAttribute('aria-controls')).toBe(aside().id)
      expect(el.getAttribute('aria-valuenow')).toBe('15')
      expect(el.getAttribute('aria-valuemin')).toBe('4')
      expect(el.getAttribute('aria-valuemax')).toBe('20')

      await key(el, 'Enter')
      await nextTick()
      expect(el.getAttribute('aria-valuenow')).toBe('4')
      wrapper.unmount()
    })

    it('arrow keys resize by one unit (shift: five), Home/End jump to the limits, all clamped', async () => {
      const wrapper = mountSidebar({ minSize: 10, maxSize: 20, defaultSize: 15 })
      const el = handle()

      await key(el, 'ArrowRight')
      await nextTick()
      expect(width(aside())).toBe('16%')
      await key(el, 'ArrowLeft')
      await key(el, 'ArrowLeft')
      await nextTick()
      expect(width(aside())).toBe('14%')
      await key(el, 'ArrowRight', { shiftKey: true })
      await key(el, 'ArrowRight', { shiftKey: true })
      await nextTick()
      expect(width(aside())).toBe('20%')
      await key(el, 'Home')
      await nextTick()
      expect(width(aside())).toBe('10%')
      await key(el, 'ArrowLeft')
      await nextTick()
      expect(width(aside())).toBe('10%')
      await key(el, 'End')
      await nextTick()
      expect(width(aside())).toBe('20%')
      expect(el.getAttribute('aria-valuenow')).toBe('20')
      expect(cookieValue('dashboard-sidebar-main')).toEqual({ size: 20, collapsed: false })
      wrapper.unmount()
    })

    it('a right sidebar grows with ArrowLeft', async () => {
      const wrapper = mountSidebar({ side: 'right', minSize: 10, maxSize: 20, defaultSize: 15 })
      await key(handle(), 'ArrowLeft')
      await nextTick()
      expect(width(aside())).toBe('16%')
      await key(handle(), 'ArrowRight')
      await key(handle(), 'ArrowRight')
      await nextTick()
      expect(width(aside())).toBe('14%')
      wrapper.unmount()
    })

    it('collapsible: shrinking below minSize collapses, growing expands, Enter toggles', async () => {
      const wrapper = mountSidebar({ collapsible: true, minSize: 10, maxSize: 20, defaultSize: 10 })
      const el = handle()

      await key(el, 'ArrowLeft')
      await nextTick()
      expect(aside().dataset.collapsed).toBe('true')

      await key(el, 'ArrowRight')
      await nextTick()
      expect(aside().dataset.collapsed).toBe('false')
      expect(width(aside())).toBe('10%')

      await key(el, 'Enter')
      await nextTick()
      expect(aside().dataset.collapsed).toBe('true')
      await key(el, 'Enter')
      await nextTick()
      expect(aside().dataset.collapsed).toBe('false')
      wrapper.unmount()
    })

    it('Enter does nothing when not collapsible; unrelated keys are not swallowed', async () => {
      const wrapper = mountSidebar({ minSize: 10, maxSize: 20, defaultSize: 15 })
      const enter = new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true })
      handle().dispatchEvent(enter)
      expect(enter.defaultPrevented).toBe(false)
      expect(aside().dataset.collapsed).toBe('false')

      const tab = new KeyboardEvent('keydown', { key: 'Tab', bubbles: true, cancelable: true })
      handle().dispatchEvent(tab)
      expect(tab.defaultPrevented).toBe(false)

      const arrow = new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true, cancelable: true })
      handle().dispatchEvent(arrow)
      expect(arrow.defaultPrevented).toBe(true)
      wrapper.unmount()
    })
  })

  describe('group context', () => {
    function mountWithContext(sidebarProps: Props = {}) {
      let ctx!: DashboardContext
      const Probe = defineComponent({
        setup() {
          ctx = useDashboard()!
          return () => null
        },
      })
      const open = ref(false)
      const collapsed = ref(false)
      const wrapper = mount({
        render: () => h(DashboardGroup, null, {
          default: () => [
            h(Probe),
            h(DashboardSidebar, {
              'id': 'main',
              'collapsible': true,
              'open': open.value,
              'onUpdate:open': (v: boolean) => (open.value = v),
              'collapsed': collapsed.value,
              'onUpdate:collapsed': (v: boolean) => (collapsed.value = v),
              ...sidebarProps,
            }, { default: () => 'Body' }),
          ],
        }),
      }, { attachTo: document.body })
      return { wrapper, ctx: () => ctx, open, collapsed }
    }

    it('toggleSidebar / collapseSidebar drive v-model:open and v-model:collapsed', async () => {
      const { wrapper, ctx, open, collapsed } = mountWithContext()
      expect(ctx().sidebarOpen.value).toBe(false)

      ctx().toggleSidebar()
      await nextTick()
      expect(open.value).toBe(true)

      ctx().toggleSidebar()
      await nextTick()
      expect(open.value).toBe(false)

      ctx().collapseSidebar(true)
      await nextTick()
      expect(collapsed.value).toBe(true)
      expect(aside().dataset.collapsed).toBe('true')
      expect(ctx().sidebarCollapsed.value).toBe(true)
      wrapper.unmount()
    })

    it('v-model changes are mirrored into the context', async () => {
      const { wrapper, ctx, open, collapsed } = mountWithContext()
      open.value = true
      collapsed.value = true
      await settle()
      expect(ctx().sidebarOpen.value).toBe(true)
      expect(ctx().sidebarCollapsed.value).toBe(true)
      expect(aside().dataset.collapsed).toBe('true')

      collapsed.value = false
      await settle()
      expect(aside().dataset.collapsed).toBe('false')
      expect(ctx().sidebarCollapsed.value).toBe(false)
      wrapper.unmount()
    })

    it('dragging and keyboard collapse are reported through v-model:collapsed and the context', async () => {
      const { wrapper, ctx, collapsed } = mountWithContext({ resizable: true })
      layout(aside(), 150)
      await drag(150, 10) // within the collapse threshold of collapsedSize (0)
      await settle()
      expect(collapsed.value).toBe(true)
      expect(ctx().sidebarCollapsed.value).toBe(true)

      await key(handle(), 'Enter')
      await settle()
      expect(collapsed.value).toBe(false)
      expect(ctx().sidebarCollapsed.value).toBe(false)

      await key(handle(), 'Enter')
      await settle()
      expect(collapsed.value).toBe(true)
      expect(ctx().sidebarCollapsed.value).toBe(true)

      await key(handle(), 'Enter')
      await settle()
      expect(collapsed.value).toBe(false)
      expect(ctx().sidebars.left.collapsed.value).toBe(false)
      wrapper.unmount()
    })

    it('left and right sidebars have independent states; the aliases point at the left one', async () => {
      let ctx!: DashboardContext
      const Probe = defineComponent({ setup() { ctx = useDashboard()!; return () => null } })
      const wrapper = mount(DashboardGroup, {
        slots: {
          default: () => [
            h(Probe),
            h(DashboardSidebar, { id: 'l', collapsible: true }, { default: () => 'L' }),
            h(DashboardSidebar, { id: 'r', side: 'right', collapsible: true }, { default: () => 'R' }),
          ],
        },
        attachTo: document.body,
      })
      expect(ctx.sidebarOpen).toBe(ctx.sidebars.left.open)
      expect(ctx.sidebarCollapsed).toBe(ctx.sidebars.left.collapsed)

      ctx.sidebars.right.collapse(true)
      await nextTick()
      const [left, right] = document.querySelectorAll<HTMLElement>('[data-slot=dashboard-sidebar]')
      expect(left!.dataset.collapsed).toBe('false')
      expect(right!.dataset.collapsed).toBe('true')

      ctx.sidebars.right.toggle()
      expect(ctx.sidebars.right.open.value).toBe(true)
      expect(ctx.sidebars.left.open.value).toBe(false)
      wrapper.unmount()
    })

    it('works standalone, outside a group', async () => {
      const wrapper = mount(DashboardSidebar, { props: { id: 'solo', collapsible: true }, slots: { default: () => 'Body' }, attachTo: document.body })
      expect(aside().id).toBe('dashboard-sidebar-solo')
      wrapper.unmount()
    })
  })

  describe('mobile menu', () => {
    it('renders header/body/footer in a drawer and the toggle closes it', async () => {
      const open = ref(true)
      const wrapper = mount({
        render: () => h(DashboardGroup, null, {
          default: () => h(DashboardSidebar, { 'id': 'main', 'open': open.value, 'onUpdate:open': (v: boolean) => (open.value = v) }, {
            header: () => 'Header',
            default: () => 'Body',
            footer: () => 'Footer',
          }),
        }),
      }, { attachTo: document.body })
      await settle()

      const dialog = document.querySelector('[data-slot=drawer-dialog]')!
      expect(dialog).not.toBeNull()
      expect(dialog.getAttribute('data-placement')).toBe('left')
      expect(dialog.querySelector('[data-slot=dashboard-sidebar-header]')!.textContent).toContain('Header')
      expect(dialog.querySelector('[data-slot=dashboard-sidebar-body]')!.textContent).toBe('Body')
      expect(dialog.querySelector('[data-slot=dashboard-sidebar-footer]')!.textContent).toBe('Footer')

      dialog.querySelector<HTMLElement>('[data-slot=dashboard-sidebar-toggle]')!.click()
      await settle()
      expect(open.value).toBe(false)
      expect(document.querySelector('[data-slot=drawer-dialog]')).toBeNull()
      wrapper.unmount()
    })

    it('holds the close button\'s hover fill until the pointer moves over it, on every open', async () => {
      const open = ref(false)
      const wrapper = mount({
        render: () => h(DashboardGroup, null, {
          default: () => h(DashboardSidebar, { 'id': 'idle', 'side': 'right', 'open': open.value, 'onUpdate:open': (v: boolean) => (open.value = v) }, {
            default: () => 'Body',
          }),
        }),
      }, { attachTo: document.body })
      const close = () => document.querySelector<HTMLElement>('[data-slot=drawer-dialog] [data-slot=dashboard-sidebar-toggle]')!

      open.value = true
      await settle()
      expect(close().hasAttribute('data-idle')).toBe(true)
      close().dispatchEvent(new PointerEvent('pointermove', { bubbles: true }))
      await settle()
      expect(close().hasAttribute('data-idle')).toBe(false)

      close().click()
      await settle()
      open.value = true
      await settle()
      expect(close().hasAttribute('data-idle')).toBe(true)
      wrapper.unmount()
    })

    it('mode switches the overlay, toggleSide moves the toggle, toggle=false removes it', async () => {
      const modal = mount(DashboardGroup, {
        slots: { default: () => h(DashboardSidebar, { id: 'm', mode: 'modal', open: true, toggleSide: 'left' }, { header: () => 'Header', default: () => 'Body' }) },
        attachTo: document.body,
      })
      await settle()
      const dialog = document.querySelector('[data-slot=modal-dialog]')!
      expect(dialog).not.toBeNull()
      const header = dialog.querySelector('[data-slot=dashboard-sidebar-header]')!
      expect([...header.children].at(0)!.getAttribute('data-slot')).toBe('dashboard-sidebar-toggle')
      modal.unmount()
      await settle()

      const bottom = mount(DashboardGroup, {
        slots: { default: () => h(DashboardSidebar, { id: 'd', mode: 'drawer', open: true, toggle: false }, { header: () => 'Header', default: () => 'Body' }) },
        attachTo: document.body,
      })
      await settle()
      expect(document.querySelector('[data-slot=drawer-dialog]')!.getAttribute('data-placement')).toBe('bottom')
      expect(document.querySelector('[data-slot=dashboard-sidebar-toggle]')).toBeNull()
      bottom.unmount()
    })

    it('autoClose closes the menu when a link inside is clicked, unless disabled', async () => {
      const open = ref(true)
      // The default slot renders twice (desktop aside + menu): click the copy inside the menu.
      const link = () => h('a', { href: '#x', class: 'lnk', onClick: (e: Event) => e.preventDefault() }, 'Go')
      const menuLink = () => document.querySelector<HTMLElement>('[data-slot=drawer-dialog] .lnk')!
      const wrapper = mount({
        render: () => h(DashboardGroup, null, {
          default: () => h(DashboardSidebar, { 'id': 'main', 'open': open.value, 'onUpdate:open': (v: boolean) => (open.value = v), 'autoClose': false }, { default: link }),
        }),
      }, { attachTo: document.body })
      await settle()
      menuLink().click()
      await settle()
      expect(open.value).toBe(true)
      wrapper.unmount()
      await settle()

      const open2 = ref(true)
      const wrapper2 = mount({
        render: () => h(DashboardGroup, null, {
          default: () => h(DashboardSidebar, { 'id': 'main', 'open': open2.value, 'onUpdate:open': (v: boolean) => (open2.value = v) }, { default: link }),
        }),
      }, { attachTo: document.body })
      await settle()
      menuLink().click()
      await settle()
      expect(open2.value).toBe(false)
      wrapper2.unmount()
    })
  })

  describe('panel', () => {
    it('fills the space until sized; resizing persists under `${storageKey}-panel-${id}`', async () => {
      const wrapper = mount(DashboardGroup, {
        slots: {
          default: () => [
            h(DashboardSidebar, { id: 'main' }, { default: () => 'S' }),
            h(DashboardPanel, { id: 'inbox', resizable: true, minSize: 20, maxSize: 60 }, { body: () => 'P' }),
          ],
        },
        attachTo: document.body,
      })
      const panel = document.querySelector<HTMLElement>('#dashboard-panel-inbox')!
      expect(panel.className).toContain('flex-1')
      expect(width(panel)).toBe('')

      layout(panel, 400)
      press(handle(), 400)
      move(500)
      release()
      await nextTick()
      expect(width(panel)).toBe('50%')
      expect(panel.className).toContain('md:w-(--width)')
      expect(cookieValue('dashboard-panel-inbox')).toEqual({ size: 50, collapsed: false })

      await key(handle(), 'ArrowLeft', { shiftKey: true })
      expect(width(panel)).toBe('45%')
      await key(handle(), 'Home')
      expect(width(panel)).toBe('20%')
      wrapper.unmount()
    })
  })
})
