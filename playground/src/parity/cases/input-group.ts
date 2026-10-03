import type { VNode } from 'vue'
import { Button, InputGroup, TextField } from '@hareui/vue'
import { h } from 'vue'
import { gear } from '../icons'

function field(fieldProps: Record<string, unknown> = {}, slots: Record<string, () => VNode | VNode[] | string> = {}, groupProps: Record<string, unknown> = {}) {
  return h(TextField, { name: 'email', ...fieldProps }, { default: () => h(InputGroup, { placeholder: 'name@email.com', ...groupProps }, slots) })
}

export const cases: Record<string, () => VNode> = {
  'input-group-bare': () => field(),
  'input-group-with-prefix': () => field({}, { prefix: () => gear() }),
  'input-group-with-suffix': () => field({}, { suffix: () => gear() }),
  'input-group-with-prefix-and-suffix': () => field({ defaultValue: '10' }, { prefix: () => '$', suffix: () => 'USD' }),
  'input-group-secondary': () => field({ variant: 'secondary' }, { prefix: () => gear() }),
  'input-group-disabled': () => field({ disabled: true }, { prefix: () => gear() }),
  'input-group-invalid': () => field({ invalid: true }, { prefix: () => gear() }),
  'input-group-required': () => field({ required: true }),
  'input-group-full-width': () => h('div', { class: 'w-80' }, [field({ fullWidth: true }, { prefix: () => gear() })]),
  'input-group-readonly': () => field({ readonly: true, defaultValue: 'jane@example.com' }),
  'input-group-button-suffix': () => field({}, {
    suffix: () => h(Button, { 'iconOnly': true, 'size': 'sm', 'variant': 'ghost', 'aria-label': 'Copy' }, () => gear()),
  }, { ui: { suffix: 'pe-0' } }),
  'input-group-textarea': () => field({ fullWidth: true }, { prefix: () => gear() }, { textarea: true, rows: 3, fullWidth: true, ui: { input: 'resize-none' } }),
}
