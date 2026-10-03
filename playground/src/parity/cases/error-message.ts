import type { VNode } from 'vue'
import { ErrorMessage } from '@hareui/vue'
import { h } from 'vue'

export const cases: Record<string, () => VNode> = {
  'error-message-basic': () => h(ErrorMessage, null, () => 'Please select at least one category'),
  'error-message-custom': () => h(ErrorMessage, { class: 'font-medium text-danger' }, () => 'Choose at least one topic'),
  'error-message-long': () => h('div', { class: 'w-40' }, [h(ErrorMessage, null, () => 'Averyveryverylongwordthatmustbreakacrosslines and more')]),
}
