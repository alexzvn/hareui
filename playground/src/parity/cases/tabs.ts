import type { VNode } from 'vue'
import { Tabs } from 'herouse'
import { h } from 'vue'

export const cases: Record<string, () => VNode> = {}

const items = [
  { label: 'Overview', value: 'overview', content: 'View your project overview and recent activity.' },
  { label: 'Analytics', value: 'analytics', content: 'Track your metrics and analyze performance data.' },
  { label: 'Reports', value: 'reports', content: 'Generate and download detailed reports.' },
]

cases['tabs-primary'] = () => h('div', { class: 'w-96' }, [h(Tabs, { items, defaultValue: 'overview', separator: true })])
cases['tabs-secondary'] = () => h('div', { class: 'w-96' }, [h(Tabs, { items, variant: 'secondary', defaultValue: 'overview', separator: true })])
cases['tabs-align-start'] = () => h('div', { class: 'w-96' }, [h(Tabs, { items, align: 'start', defaultValue: 'overview', separator: true })])
cases['tabs-align-end'] = () => h('div', { class: 'w-96' }, [h(Tabs, { items, align: 'end', defaultValue: 'overview', separator: true })])
cases['tabs-vertical'] = () => h('div', { class: 'w-96' }, [h(Tabs, { items, orientation: 'vertical', defaultValue: 'overview', separator: true })])
cases['tabs-vertical-secondary'] = () => h('div', { class: 'w-96' }, [h(Tabs, { items, orientation: 'vertical', variant: 'secondary', defaultValue: 'overview', separator: true })])
cases['tabs-disabled-tab'] = () => h('div', { class: 'w-96' }, [h(Tabs, { items: items.map((item, i) => i === 1 ? { ...item, disabled: true } : item), defaultValue: 'overview', separator: true })])
cases['tabs-selected-second'] = () => h('div', { class: 'w-96' }, [h(Tabs, { items, defaultValue: 'analytics', separator: true })])
cases['tabs-no-separator'] = () => h('div', { class: 'w-96' }, [h(Tabs, { items, defaultValue: 'overview' })])

const overflowItems = ['Overview', 'Analytics', 'Reports', 'Performance', 'Engagement', 'Audience', 'Acquisition', 'Retention', 'Settings']
  .map(label => ({ label, value: label.toLowerCase(), content: `${label} panel content.` }))
cases['tabs-overflow'] = () => h('div', { class: 'w-[400px]' }, [h(Tabs, { items: overflowItems })])
cases['tabs-overflow-vertical'] = () => h('div', { class: 'h-[160px]' }, [h(Tabs, { items: overflowItems, orientation: 'vertical', class: 'h-full' })])
