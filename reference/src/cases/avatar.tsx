import type { ReactElement } from 'react'
import { Avatar } from '@heroui/react'
import { avatarSrc } from '../../../parity/icons'

export const cases: Record<string, () => ReactElement> = {}

for (const color of ['accent', 'danger', 'default', 'success', 'warning'] as const) {
  cases[`avatar-${color}`] = () => <Avatar color={color}><Avatar.Fallback>JD</Avatar.Fallback></Avatar>
  cases[`avatar-soft-${color}`] = () => <Avatar color={color} variant="soft"><Avatar.Fallback>JD</Avatar.Fallback></Avatar>
}
for (const size of ['sm', 'lg'] as const)
  cases[`avatar-size-${size}`] = () => <Avatar size={size}><Avatar.Fallback>JD</Avatar.Fallback></Avatar>
cases['avatar-image'] = () => <Avatar><Avatar.Image alt="Blue" src={avatarSrc} /><Avatar.Fallback>B</Avatar.Fallback></Avatar>
cases['avatar-custom-image'] = () => (
  <Avatar>
    <Avatar.Image asChild height={40} src={avatarSrc} width={40}><img alt="John Doe" src={avatarSrc} /></Avatar.Image>
    <Avatar.Fallback>JD</Avatar.Fallback>
  </Avatar>
)
