import type { VNode } from 'vue'
import { CloseButton } from 'herouse'
import { h } from 'vue'

export const cases: Record<string, () => VNode> = {
  'close-button-default': () => h(CloseButton),
  'close-button-disabled': () => h(CloseButton, { disabled: true }),
}
