import type { ReactElement } from 'react'
import { ColorArea } from '@heroui/react'

export const cases: Record<string, () => ReactElement> = {}

cases['color-area-default'] = () => (
  <div className="w-[300px]">
    <ColorArea defaultValue="rgb(116, 52, 255)">
      <ColorArea.Thumb />
    </ColorArea>
  </div>
)

cases['color-area-with-dots'] = () => (
  <div className="w-[300px]">
    <ColorArea showDots defaultValue="hsl(200, 100%, 50%)">
      <ColorArea.Thumb />
    </ColorArea>
  </div>
)

cases['color-area-disabled'] = () => (
  <div className="w-[300px]">
    <ColorArea isDisabled defaultValue="hsl(200, 100%, 50%)">
      <ColorArea.Thumb />
    </ColorArea>
  </div>
)

cases['color-area-rgb-channels'] = () => (
  <div className="w-[300px]">
    <ColorArea colorSpace="rgb" defaultValue="rgb(255, 100, 50)" xChannel="red" yChannel="green">
      <ColorArea.Thumb />
    </ColorArea>
  </div>
)

cases['color-area-hsl-channels'] = () => (
  <div className="w-[300px]">
    <ColorArea colorSpace="hsl" defaultValue="hsl(30, 100%, 50%)" xChannel="saturation" yChannel="lightness">
      <ColorArea.Thumb />
    </ColorArea>
  </div>
)

cases['color-area-user-overrides'] = () => (
  <div className="w-[300px]">
    <ColorArea className="size-44 rounded-3xl" defaultValue="rgb(116, 52, 255)">
      <ColorArea.Thumb className="size-5 rounded-full border-4" />
    </ColorArea>
  </div>
)

cases['color-area-hsb-channels'] = () => (
  <div className="w-[300px]">
    <ColorArea colorSpace="hsb" defaultValue="hsb(219, 58%, 93%)" xChannel="saturation" yChannel="brightness">
      <ColorArea.Thumb />
    </ColorArea>
  </div>
)
