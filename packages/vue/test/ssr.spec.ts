// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { createSSRApp, h } from 'vue'
import { renderToString } from 'vue/server-renderer'

import AlertDialog from '@/components/alert-dialog/AlertDialog.vue'
import DatePicker from '@/components/date-picker/DatePicker.vue'
import DateRangePicker from '@/components/date-range-picker/DateRangePicker.vue'
import Drawer from '@/components/drawer/Drawer.vue'
import Dropdown from '@/components/dropdown/Dropdown.vue'
import Input from '@/components/input/Input.vue'
import Modal from '@/components/modal/Modal.vue'
import Popover from '@/components/popover/Popover.vue'
import TextArea from '@/components/text-area/TextArea.vue'
import TextField from '@/components/text-field/TextField.vue'

// No DOM globals here (no `Element`, `document`), as in Nuxt or VitePress server rendering.
const trigger = { trigger: (): string => 'Open' }

describe('server rendering of overlays', () => {
  it.each([
    ['Popover', Popover, trigger],
    ['Dropdown', Dropdown, trigger],
    ['Modal', Modal, trigger],
    ['Drawer', Drawer, trigger],
    ['AlertDialog', AlertDialog, trigger],
    ['DatePicker', DatePicker, {}],
    ['DateRangePicker', DateRangePicker, {}],
  ])('%s renders to a string', async (_, component, slots) => {
    const html = await renderToString(
      createSSRApp({ render: () => h(component as never, { label: 'Field' }, slots) }),
    )

    expect(html).toMatch(/^</)
  })
})

describe('server rendering of text controls', () => {
  it.each([
    ['Input', Input, {}],
    ['Input with modifiers', Input, { modelModifiers: { trim: true, nullable: true } }],
    ['TextArea', TextArea, {}],
    ['TextField', TextField, { label: 'Name' }],
  ])('%s renders its value to a string', async (_, component, props) => {
    const html = await renderToString(
      createSSRApp({ render: () => h(component as never, { modelValue: 'Ada', ...props }) }),
    )

    expect(html).toContain('Ada')
  })

  it('renders a TextArea value as the element content', async () => {
    const html = await renderToString(
      createSSRApp({ render: () => h(TextArea as never, { modelValue: 'Ada' }) }),
    )

    expect(html).toMatch(/<textarea[^>]*>Ada<\/textarea>/)
  })
})
