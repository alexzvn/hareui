import type { VNode } from 'vue'
import { EmptyState, TagGroup } from 'herouse'
import { h } from 'vue'

export const cases: Record<string, () => VNode> = {
  'empty-state-default': () => h(EmptyState),
  'empty-state-custom': () => h(EmptyState, { class: 'p-1' }, () => 'No team members'),
  'empty-state-tag-group': () => h('div', { class: 'w-sm' }, [
    h(TagGroup, { selectionMode: 'single', removable: true, label: 'Team Members', description: 'Select team members for your project', items: [] }, {
      empty: () => h(EmptyState, { class: 'p-1' }, () => 'No team members'),
    }),
  ]),
}
