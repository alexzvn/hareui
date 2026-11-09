import { parseDate } from '@internationalized/date'
import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it } from 'vitest'
import { defineComponent, h, inject, nextTick, reactive, ref } from 'vue'

import App from '@/components/app/App.vue'
import Button from '@/components/button/Button.vue'
import buttonTheme from '@/components/button/theme'
import Calendar from '@/components/calendar/Calendar.vue'
import ChatLoader from '@/components/chat-loader/ChatLoader.vue'
import Description from '@/components/description/Description.vue'
import RichTable from '@/components/rich-table/RichTable.vue'
import SearchField from '@/components/search-field/SearchField.vue'
import Select from '@/components/select/Select.vue'
import Table from '@/components/table/Table.vue'
import { useComponentUI } from '@/composables/useComponentUI'
import type { HareUIConfig } from '@/config'
import { createHareUI, hareUIConfigKey } from '@/config'

const globals = globalThis as { __HAREUI_UI__?: HareUIConfig['ui'] }

const provideConfig = (config: HareUIConfig) => ({
  global: { provide: { [hareUIConfigKey as symbol]: config } },
})

const items = [
  { value: 'cat', label: 'Cat' },
  { value: 'dog', label: 'Dog' },
]

describe('unstyled: true', () => {
  afterEach(() => {
    delete globals.__HAREUI_UI__
  })

  it('drops the theme, keeping data attributes', () => {
    const wrapper = mount(Button, { global: { plugins: [createHareUI({ unstyled: true })] } })

    expect(wrapper.classes()).toEqual([])
    expect(wrapper.attributes('data-slot')).toBe('button')
  })

  it('drops the build-time and app `ui` overrides', () => {
    globals.__HAREUI_UI__ = { button: { slots: { base: 'px-1' } } }
    const plugin = createHareUI({ unstyled: true, ui: { button: { slots: { base: 'px-2' } } } })

    expect(mount(Button, { global: { plugins: [plugin] } }).classes()).toEqual([])
  })

  it('keeps the `ui` and `class` props, still merged', () => {
    const wrapper = mount(Button, {
      props: { ui: { base: 'px-5 py-1' }, class: 'px-6' },
      global: { plugins: [createHareUI({ unstyled: true })] },
    })

    expect(wrapper.classes()).toEqual(['py-1', 'px-6'])
  })

  it('keeps a slot call’s `class` and `override`', () => {
    const Probe = defineComponent(() => {
      const ui = useComponentUI('button', { theme: buttonTheme, variantProps: () => ({}) })

      return () => h('div', { class: ui.value.base({ class: 'px-3', override: 'py-2' }) })
    })

    const wrapper = mount(Probe, { global: { plugins: [createHareUI({ unstyled: true })] } })

    expect(wrapper.classes()).toEqual(['px-3', 'py-2'])
  })

  it('keeps the markup’s functional classes', () => {
    const wrapper = mount(ChatLoader, { global: { plugins: [createHareUI({ unstyled: true })] } })

    expect(wrapper.findAll('span').at(-1)?.classes()).toEqual(['sr-only'])
  })

  it('reaches components inside `App`', () => {
    const Host = defineComponent(() => () => h(App, null, () => h(Button)))
    const wrapper = mount(Host, { global: { plugins: [createHareUI({ unstyled: true })] } })

    expect(wrapper.get('[data-slot=button]').classes()).toEqual([])
  })
})

describe('unstyled: functional markup', () => {
  const plugins = [createHareUI({ unstyled: true })]

  it('Calendar: keeps the closed year picker grid out of the page', async () => {
    const wrapper = mount(Calendar, {
      props: { defaultValue: parseDate('2025-02-08'), yearPicker: true },
      global: { plugins },
    })

    const grid = wrapper.get('[data-slot=calendar-year-picker-grid]')
    expect(grid.attributes('aria-hidden')).toBe('true')
    expect((grid.element as HTMLElement).style.display).toBe('none')

    await wrapper.get('[data-slot=calendar-year-picker-trigger]').trigger('click')
    expect((grid.element as HTMLElement).style.display).toBe('')
  })

  it('Calendar: takes the nav buttons and day grid out of interaction while the year picker is open', async () => {
    const wrapper = mount(Calendar, {
      props: { defaultValue: parseDate('2025-02-08'), yearPicker: true },
      global: { plugins },
    })

    await wrapper.get('[data-slot=calendar-year-picker-trigger]').trigger('click')

    const covered = [
      ...wrapper.findAll('[data-slot=calendar-nav-button]'),
      wrapper.get('[data-slot=calendar-grid]'),
    ]

    expect(covered.map((node) => node.attributes('inert'))).toEqual(['', '', ''])
  })

  it('Calendar: gives the nav buttons and day grid back when the year picker closes', async () => {
    const wrapper = mount(Calendar, {
      props: { defaultValue: parseDate('2025-02-08'), yearPicker: true },
      global: { plugins },
    })

    const trigger = wrapper.get('[data-slot=calendar-year-picker-trigger]')

    await trigger.trigger('click')
    await trigger.trigger('click')

    expect(wrapper.find('[inert]').exists()).toBe(false)
  })

  // happy-dom has no layout and no Tailwind CSS, so this checks the structure the positioning relies on: the resizer
  // sits inside its header cell, which stays the positioned ancestor (`relative`) it is laid out against.
  it('Table: keeps the column resizer inside a positioned header cell', () => {
    const wrapper = mount(Table, {
      props: {
        columns: [{ key: 'name', label: 'Name', resizable: true }],
        rows: [{ id: 1, name: 'Ada' }],
      },
      global: { plugins },
    })

    const header = wrapper.get('[data-slot=table-column]')
    expect(header.find('[data-slot=table-column-resizer]').exists()).toBe(true)
    expect(header.classes()).toContain('relative')
  })

  const mountRichTable = (props: Record<string, unknown>) =>
    mount(RichTable as unknown as Parameters<typeof mount>[0], {
      props: {
        data: [{ name: 'Ada', role: 'Dev' }],
        columns: [
          { accessorKey: 'name', header: 'Name' },
          { accessorKey: 'role', header: 'Role' },
        ],
        ...props,
      },
      global: { plugins },
    })

  it('RichTable: keeps the root as the scroll container', () => {
    const wrapper = mountRichTable({})

    expect(wrapper.get('[data-slot=rich-table]').classes()).toEqual(
      expect.arrayContaining(['relative', 'overflow-auto']),
    )
  })

  it('RichTable: leaves the scrolling to an external scroll element', () => {
    const wrapper = mountRichTable({ virtualize: { getScrollElement: () => document.body } })

    expect(wrapper.get('[data-slot=rich-table]').classes()).not.toContain('overflow-auto')
  })

  it('RichTable: sticks pinned header and body cells to their side', () => {
    const wrapper = mountRichTable({ columnPinning: { left: ['name'] } })

    const stuck = [wrapper.findAll('th')[0]!, wrapper.findAll('td')[0]!]
    for (const cell of stuck) {
      expect(cell.classes()).toEqual(expect.arrayContaining(['sticky', 'left-(--rich-table-pin)']))
    }
  })

  it('RichTable: leaves unpinned cells in the flow', () => {
    const wrapper = mountRichTable({ columnPinning: { left: ['name'] } })

    expect(wrapper.findAll('th')[1]!.classes()).not.toContain('sticky')
    expect(wrapper.findAll('td')[1]!.classes()).not.toContain('sticky')
  })

  it('RichTable: sticks the sticky header', () => {
    const wrapper = mountRichTable({ sticky: 'header' })

    expect(wrapper.get('thead').classes()).toEqual(expect.arrayContaining(['sticky', 'top-0']))
  })

  it('SearchField: takes the hidden clear button out of interaction while empty', () => {
    const wrapper = mount(SearchField, { global: { plugins } })

    expect(wrapper.get('[data-slot=search-field-clear-button]').attributes('inert')).toBe('')
  })

  it('SearchField: makes the clear button interactive once there is text', () => {
    const wrapper = mount(SearchField, { props: { defaultValue: 'cat' }, global: { plugins } })

    expect(wrapper.get('[data-slot=search-field-clear-button]').attributes('inert')).toBeUndefined()
  })

  it('Select: takes the hidden clear button out of interaction without a value', () => {
    const wrapper = mount(Select, { props: { items, clearable: true }, global: { plugins } })

    expect(wrapper.get('[data-slot=select-clear-button]').attributes('inert')).toBe('')
  })

  it('Select: makes the clear button interactive with a value', () => {
    const wrapper = mount(Select, {
      props: { items, clearable: true, defaultValue: 'cat' },
      global: { plugins },
    })

    expect(wrapper.get('[data-slot=select-clear-button]').attributes('inert')).toBeUndefined()
  })
})

describe('unstyled: array of theme keys', () => {
  it('strips only the listed components', () => {
    const plugins = [createHareUI({ unstyled: ['button'] })]

    expect(mount(Button, { global: { plugins } }).classes()).toEqual([])
    expect(mount(Description, { global: { plugins } }).classes()).toContain('text-xs')
  })
})

describe('toggling unstyled', () => {
  it('restyles mounted instances both ways', async () => {
    const config: HareUIConfig = reactive({})
    const wrapper = mount(Button, provideConfig(config))
    expect(wrapper.classes()).toContain('h-button')

    config.unstyled = true
    await nextTick()
    expect(wrapper.classes()).toEqual([])

    config.unstyled = ['description']
    await nextTick()
    expect(wrapper.classes()).toContain('h-button')

    config.unstyled = ['button']
    await nextTick()
    expect(wrapper.classes()).toEqual([])
  })

  it('resolves the current variant when the theme comes back', async () => {
    const config: HareUIConfig = reactive({ unstyled: true })
    const size = ref<'sm' | 'lg'>('sm')
    const Host = defineComponent(() => () => h(Button, { size: size.value }))
    const wrapper = mount(Host, provideConfig(config))

    size.value = 'lg'
    await nextTick()
    expect(wrapper.classes()).toEqual([])

    config.unstyled = false
    await nextTick()
    expect(wrapper.classes()).toContain('h-button--lg')
  })

  it.each([
    ['with createHareUI()', [createHareUI()]],
    ['without createHareUI()', []],
  ])('restyles every App when set through a nested App’s config, %s', async (_, plugins) => {
    let config: HareUIConfig | undefined
    const Inner = defineComponent(() => {
      config = inject(hareUIConfigKey)

      return () => h(Button, { id: 'inner' })
    })

    const Host = defineComponent(
      () => () => h(App, null, () => [h(Button, { id: 'outer' }), h(App, null, () => h(Inner))]),
    )

    const wrapper = mount(Host, { global: { plugins } })
    const classes = () => [wrapper.get('#outer').classes(), wrapper.get('#inner').classes()]
    const styled = [expect.arrayContaining(['h-button']), expect.arrayContaining(['h-button'])]
    expect(classes()).toEqual(styled)

    config!.unstyled = true
    await nextTick()
    expect(classes()).toEqual([[], []])

    config!.unstyled = false
    await nextTick()
    expect(classes()).toEqual(styled)
  })
})
