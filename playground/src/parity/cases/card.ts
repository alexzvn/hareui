import type { VNode } from 'vue'
import { Button, Card } from '@hareui/vue'
import { h } from 'vue'
import { gear } from '../icons'

export const cases: Record<string, () => VNode> = {}

for (const variant of ['default', 'secondary', 'tertiary', 'transparent'] as const) {
  cases[`card-${variant}`] = () => h(Card, { variant, class: 'w-[400px]', title: 'Become an Acme Creator!', description: 'Visit the Acme Creator Hub to sign up today and start earning credits from your fans and followers.' }, {
    default: () => h('p', 'Content body'),
    footer: () => h(Button, null, () => 'Join'),
  })
}
cases['card-content-only'] = () => h(Card, { class: 'w-[300px]' }, () => h('p', 'Only content'))
cases['card-leading'] = () => h(Card, { class: 'w-[400px]', title: 'Become an Acme Creator!', description: 'Visit the Acme Creator Hub to sign up today.' }, {
  leading: () => h('div', { class: 'size-6' }, gear()),
  footer: () => h(Button, null, () => 'Join'),
})
cases['card-horizontal'] = () => h(Card, { class: 'w-[500px] items-stretch flex-row', ui: { content: 'gap-3' } }, {
  leading: () => h('div', { class: 'size-[120px] shrink-0 rounded-2xl bg-accent' }),
  default: () => [h('p', 'Content body'), h(Button, { class: 'mt-auto' }, () => 'Apply Now')],
})
