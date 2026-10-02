import type { VNode } from 'vue'
import { Disclosure, DisclosureGroup, Separator } from 'herouse'
import { h } from 'vue'

export const cases: Record<string, () => VNode> = {}

type Opts = { expanded?: string[], multiple?: boolean, disabled?: boolean, separator?: boolean }

const render = ({ expanded, multiple, disabled, separator }: Opts = {}) => h(DisclosureGroup, { defaultValue: expanded, multiple, disabled, class: 'w-[300px]' }, () => [
  h(Disclosure, { value: 'one', title: 'First section' }, () => h('p', 'Content of the first section.')),
  separator ? h(Separator, { class: 'my-2' }) : null,
  h(Disclosure, { value: 'two', title: 'Second section' }, () => h('p', 'Content of the second section.')),
])

cases['disclosure-group-basic'] = () => render({ expanded: ['one'] })
cases['disclosure-group-multiple'] = () => render({ expanded: ['one', 'two'], multiple: true })
cases['disclosure-group-disabled'] = () => render({ expanded: ['two'], disabled: true })
cases['disclosure-group-separator'] = () => render({ expanded: ['two'], separator: true })
