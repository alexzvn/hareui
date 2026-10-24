// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { createSSRApp, h } from 'vue'
import { renderToString } from 'vue/server-renderer'

import AlertDialog from '../src/components/alert-dialog/AlertDialog.vue'
import DatePicker from '../src/components/date-picker/DatePicker.vue'
import DateRangePicker from '../src/components/date-range-picker/DateRangePicker.vue'
import Drawer from '../src/components/drawer/Drawer.vue'
import Dropdown from '../src/components/dropdown/Dropdown.vue'
import Modal from '../src/components/modal/Modal.vue'
import Popover from '../src/components/popover/Popover.vue'

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
