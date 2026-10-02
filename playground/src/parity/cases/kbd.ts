import type { VNode } from 'vue'
import { Kbd } from 'herouse'
import { h } from 'vue'

export const cases: Record<string, () => VNode> = {
  'kbd-basic': () => h(Kbd, { keys: 'command' }, () => 'K'),
  'kbd-light': () => h(Kbd, { keys: 'command', variant: 'light' }, () => 'C'),
  'kbd-multi': () => h(Kbd, { keys: ['command', 'shift'] }, () => 'Z'),
  'kbd-key-only': () => h(Kbd, { keys: ['shift', 'tab'] }),
  'kbd-content-only': () => h(Kbd, null, () => 'Esc'),
  'kbd-custom': () => h(Kbd, { keys: 'command', class: 'rounded-lg bg-accent-soft px-2.5 text-accent-soft-foreground' }, () => 'K'),
  'kbd-inline': () => h('p', { class: 'text-sm' }, ['Press ', h(Kbd, { keys: 'enter' }), ' to confirm.']),
}
