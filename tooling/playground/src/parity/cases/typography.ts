import type { VNode } from 'vue'
import { Typography } from '@hareui/vue'
import { h } from 'vue'

export const cases: Record<string, () => VNode> = {}

const headings = {
  h1: 'Build better interfaces',
  h2: 'Typography that stays semantic',
  h3: 'Composable by default',
  h4: 'Small heading',
  h5: 'Card titles',
  h6: 'Smaller feature headers',
} as const

for (const [type, text] of Object.entries(headings))
  cases[`typography-${type}`] = () => h(Typography, { type: type as keyof typeof headings, class: 'w-[420px]' }, () => text)

cases['typography-body'] = () => h(Typography, { class: 'w-[420px]' }, () => 'HareUI Typography renders semantic text elements, with typography types and an `as` prop for polymorphism.')
cases['typography-body-sm'] = () => h(Typography, { type: 'body-sm', color: 'muted', class: 'w-[420px]' }, () => 'Smaller muted body copy for secondary descriptions.')
cases['typography-body-xs'] = () => h(Typography, { type: 'body-xs', class: 'w-[420px]' }, () => 'Captions, badges, helper text, and fine print.')
cases['typography-code'] = () => h(Typography, { type: 'code' }, () => 'bun add @hareui/vue')

cases['typography-align-center'] = () => h(Typography, { align: 'center', class: 'w-[420px]' }, () => 'Centered body copy.')
cases['typography-align-end'] = () => h(Typography, { align: 'end', class: 'w-[420px]' }, () => 'End-aligned body copy.')
cases['typography-align-justify'] = () => h(Typography, { align: 'justify', class: 'w-[420px]' }, () => 'Justified body copy stretches each line so the left and right edges line up evenly across the paragraph.')

cases['typography-color-muted'] = () => h(Typography, { color: 'muted', class: 'w-[420px]' }, () => 'Muted secondary text.')

cases['typography-weight-normal'] = () => h(Typography, { type: 'h2', weight: 'normal', class: 'w-[420px]' }, () => 'Normal weight heading')
cases['typography-weight-medium'] = () => h(Typography, { weight: 'medium', class: 'w-[420px]' }, () => 'Medium weight body text')
cases['typography-weight-semibold'] = () => h(Typography, { weight: 'semibold', class: 'w-[420px]' }, () => 'Semibold weight body text')
cases['typography-weight-bold'] = () => h(Typography, { weight: 'bold', class: 'w-[420px]' }, () => 'Bold weight body text')

cases['typography-truncate'] = () => h(Typography, { truncate: true, class: 'w-48' }, () => 'This line of text is much longer than the container and must be truncated with an ellipsis.')

cases['typography-as-override'] = () => h(Typography, { as: 'h2', type: 'h1', class: 'w-[420px]' }, () => 'H1 visual style, h2 semantic element')

cases['typography-prose'] = () => h(Typography, { prose: true, class: 'w-[420px] flex flex-col gap-3' }, () => [
  h('h1', 'Prose title'),
  h('p', ['Prose is for authored content where the markup is already semantic and HareUI applies the default typography rhythm.']),
  h('h2', 'Section title'),
  h('p', ['Inline code like ', h('code', 'render'), ' receives the same code treatment as the Typography primitive.']),
])
