import type { VNode } from 'vue'
import { Tabs } from 'herouse'
import { h } from 'vue'

export const cases: Record<string, () => VNode> = {}

const items = [
  { label: 'Overview', value: 'overview', content: 'View your project overview and recent activity.' },
  { label: 'Analytics', value: 'analytics', content: 'Track your metrics and analyze performance data.' },
  { label: 'Reports', value: 'reports', content: 'Generate and download detailed reports.' },
]

cases['tabs-primary'] = () => h('div', { class: 'w-96' }, [h(Tabs, { items, defaultValue: 'overview' })])
cases['tabs-secondary'] = () => h('div', { class: 'w-96' }, [h(Tabs, { items, variant: 'secondary', defaultValue: 'overview' })])
cases['tabs-align-start'] = () => h('div', { class: 'w-96' }, [h(Tabs, { items, align: 'start', defaultValue: 'overview' })])
cases['tabs-align-end'] = () => h('div', { class: 'w-96' }, [h(Tabs, { items, align: 'end', defaultValue: 'overview' })])
cases['tabs-vertical'] = () => h('div', { class: 'w-96' }, [h(Tabs, { items, orientation: 'vertical', defaultValue: 'overview' })])
cases['tabs-vertical-secondary'] = () => h('div', { class: 'w-96' }, [h(Tabs, { items, orientation: 'vertical', variant: 'secondary', defaultValue: 'overview' })])
cases['tabs-disabled-tab'] = () => h('div', { class: 'w-96' }, [h(Tabs, { items: items.map((item, i) => i === 1 ? { ...item, disabled: true } : item), defaultValue: 'overview' })])
cases['tabs-selected-second'] = () => h('div', { class: 'w-96' }, [h(Tabs, { items, defaultValue: 'analytics' })])
