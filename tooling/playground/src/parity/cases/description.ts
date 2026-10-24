import type { VNode } from 'vue'
import { Description } from '@hareui/vue'
import { h } from 'vue'

export const cases: Record<string, () => VNode> = {
  'description-default': () => h(Description, null, () => 'We\'ll never share your email with anyone else.'),
}
