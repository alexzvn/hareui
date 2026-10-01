import type { VNode } from 'vue'
import { Button, Card } from 'herouse'
import { h } from 'vue'

export const cases: Record<string, () => VNode> = {}

for (const variant of ['default', 'secondary', 'tertiary', 'transparent'] as const) {
  cases[`card-${variant}`] = () => h(Card, { variant, class: 'w-[400px]', title: 'Become an Acme Creator!', description: 'Visit the Acme Creator Hub to sign up today and start earning credits from your fans and followers.' }, {
    default: () => h('p', 'Content body'),
    footer: () => h(Button, null, () => 'Join'),
  })
}
cases['card-content-only'] = () => h(Card, { class: 'w-[300px]' }, () => h('p', 'Only content'))
