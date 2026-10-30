import type { Component, VNode } from 'vue'
import { Button, Disclosure } from '@hareui/vue'
import { h } from 'vue'
import { gear } from '../icons'

export const cases: Record<string, () => VNode> = {}

type TriggerProps = { indicator: Component }

cases['disclosure-collapsed'] = () => h(Disclosure, { title: 'Toggle content', class: 'w-[300px]' }, {
  default: () => h('p', 'This disclosure is collapsed by default, revealed on click.'),
})

cases['disclosure-expanded'] = () => h(Disclosure, { title: 'Toggle content', defaultOpen: true, class: 'w-[300px]' }, {
  default: () => h('p', 'This disclosure is expanded by default.'),
})

cases['disclosure-disabled'] = () => h(Disclosure, { title: 'Toggle content', disabled: true, class: 'w-[300px]' }, {
  default: () => h('p', 'Disabled content.'),
})

cases['disclosure-basic'] = () => h(Disclosure, { defaultOpen: true, class: 'w-full max-w-md text-center' }, {
  trigger: ({ indicator }: TriggerProps) => h(Button, { variant: 'secondary' }, () => [
    h('div', { class: 'size-4' }, gear()),
    ' Preview the mobile app ',
    h(indicator),
  ]),
  default: () => [
    h('p', { class: 'text-sm text-muted' }, 'Scan this QR code with your camera app to preview the mobile components.'),
    h('div', { class: 'aspect-square w-full max-w-54 bg-surface-secondary' }),
    h('p', { class: 'text-sm text-muted' }, 'Expo must be installed on your device.'),
    h(Button, { class: 'mt-4', variant: 'primary' }, () => 'Download on App Store'),
  ],
})

cases['disclosure-custom-trigger'] = () => h(Disclosure, { class: 'w-full max-w-sm', ui: { bodyInner: 'mt-2 rounded-xl border border-border/70 bg-surface/50 p-4 text-sm leading-relaxed text-muted dark:bg-neutral-900/50' } }, {
  trigger: ({ indicator }: TriggerProps) => h(Button, {
    class: 'w-full justify-between rounded-xl border border-border/70 bg-linear-to-b from-neutral-50/90 to-white px-4 py-3 font-medium text-foreground shadow-sm ring-1 ring-black/5 hover:bg-muted/30 dark:from-neutral-900/80 dark:to-neutral-900 dark:ring-white/10',
    variant: 'ghost',
  }, () => [
    h('span', { class: 'flex items-center gap-2' }, [
      h('div', { class: 'size-4 text-muted' }, gear()),
      'Shipping details',
    ]),
    h(indicator, { class: 'text-muted' }),
  ]),
  default: () => h('p', 'Orders ship within 2 business days. Standard delivery takes 3–5 days; express is available at checkout.'),
})
