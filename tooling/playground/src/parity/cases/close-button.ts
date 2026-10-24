import type { VNode } from 'vue'
import { CloseButton } from '@hareui/vue'
import { h } from 'vue'

export const cases: Record<string, () => VNode> = {
  'close-button-default': () => h(CloseButton),
  'close-button-disabled': () => h(CloseButton, { disabled: true }),
}
