import type { VNode } from 'vue'
import { Avatar } from '@hareui/vue'
import { h } from 'vue'
import { avatarSrc } from '../../../../parity/icons'

export const cases: Record<string, () => VNode> = {}

for (const color of ['accent', 'danger', 'default', 'success', 'warning'] as const) {
  cases[`avatar-${color}`] = () => h(Avatar, { color, fallback: 'JD' })
  cases[`avatar-soft-${color}`] = () => h(Avatar, { color, variant: 'soft', fallback: 'JD' })
}
for (const size of ['sm', 'lg'] as const)
  cases[`avatar-size-${size}`] = () => h(Avatar, { size, fallback: 'JD' })
cases['avatar-image'] = () => h(Avatar, { src: avatarSrc, alt: 'Blue', fallback: 'B' })
cases['avatar-custom-image'] = () => h(Avatar, { src: avatarSrc, fallback: 'JD' }, {
  image: () => h('img', { alt: 'John Doe', src: avatarSrc, width: 40, height: 40 }),
})
