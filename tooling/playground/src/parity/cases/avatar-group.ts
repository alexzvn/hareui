import type { VNode } from 'vue'
import { Avatar, AvatarGroup } from '@hareui/vue'
import { h } from 'vue'
import { avatarSrc } from '../../../../parity/icons'

export const cases: Record<string, () => VNode> = {}

const four = () => [
  h(Avatar, { src: avatarSrc, alt: 'A', fallback: 'JD' }),
  h(Avatar, { fallback: 'AB' }),
  h(Avatar, { src: avatarSrc, alt: 'C', fallback: 'EC' }),
  h(Avatar, { fallback: 'SM' }),
]

cases['avatar-group-basic'] = () => h(AvatarGroup, null, { default: four })
cases['avatar-group-max'] = () => h(AvatarGroup, { max: 2 }, { default: four })
cases['avatar-group-count'] = () => h(AvatarGroup, { size: 'sm' }, { default: four, count: () => '+9' })
for (const size of ['sm', 'lg'] as const)
  cases[`avatar-group-size-${size}`] = () => h(AvatarGroup, { size }, { default: four })
cases['avatar-group-grid'] = () => h(AvatarGroup, { grid: true, max: 3 }, { default: four })
cases['avatar-group-ring'] = () => h(AvatarGroup, { overlap: 'ring', size: 'lg' }, { default: four, count: () => '+2' })
cases['avatar-group-inherit'] = () => h(AvatarGroup, { color: 'accent', variant: 'soft' }, {
  default: () => [h(Avatar, { fallback: 'AB' }), h(Avatar, { fallback: 'CD', color: 'danger' })],
})
cases['avatar-group-custom'] = () => h(AvatarGroup, { class: '[--avatar-group-overlap:0.7rem] [--avatar-group-seam:2px]', size: 'sm' }, { default: four, count: () => '+3' })
