import type { ReactElement } from 'react'
import { Avatar, AvatarGroup } from '@heroui/react'
import { avatarSrc } from '../../../parity/icons'

export const cases: Record<string, () => ReactElement> = {}

const four = [
  <Avatar key="a"><Avatar.Image alt="A" src={avatarSrc} /><Avatar.Fallback>JD</Avatar.Fallback></Avatar>,
  <Avatar key="b"><Avatar.Fallback>AB</Avatar.Fallback></Avatar>,
  <Avatar key="c"><Avatar.Image alt="C" src={avatarSrc} /><Avatar.Fallback>EC</Avatar.Fallback></Avatar>,
  <Avatar key="d"><Avatar.Fallback>SM</Avatar.Fallback></Avatar>,
]

cases['avatar-group-basic'] = () => <AvatarGroup>{four}</AvatarGroup>
cases['avatar-group-max'] = () => <AvatarGroup max={2}>{four}</AvatarGroup>
cases['avatar-group-count'] = () => <AvatarGroup size="sm">{four}<AvatarGroup.Count>+9</AvatarGroup.Count></AvatarGroup>
for (const size of ['sm', 'lg'] as const)
  cases[`avatar-group-size-${size}`] = () => <AvatarGroup size={size}>{four}</AvatarGroup>
cases['avatar-group-grid'] = () => <AvatarGroup isGrid max={3}>{four}</AvatarGroup>
cases['avatar-group-ring'] = () => <AvatarGroup overlap="ring" size="lg">{four}<AvatarGroup.Count>+2</AvatarGroup.Count></AvatarGroup>
cases['avatar-group-inherit'] = () => (
  <AvatarGroup color="accent" variant="soft">
    <Avatar><Avatar.Fallback>AB</Avatar.Fallback></Avatar>
    <Avatar color="danger"><Avatar.Fallback>CD</Avatar.Fallback></Avatar>
  </AvatarGroup>
)
cases['avatar-group-custom'] = () => <AvatarGroup className="[--avatar-group-overlap:0.7rem] [--avatar-group-seam:2px]" size="sm">{four}<AvatarGroup.Count>+3</AvatarGroup.Count></AvatarGroup>
