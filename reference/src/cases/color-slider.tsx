import type { ReactElement } from 'react'
import { ColorSlider, Label } from '@heroui/react'

export const cases: Record<string, () => ReactElement> = {}

const full = (channel: any, label: string, value: string, extra: Record<string, unknown> = {}) => () => (
  <ColorSlider channel={channel} className="w-[320px]" defaultValue={value} {...extra}>
    <Label>{label}</Label>
    <ColorSlider.Output />
    <ColorSlider.Track>
      <ColorSlider.Thumb />
    </ColorSlider.Track>
  </ColorSlider>
)

cases['color-slider-default'] = full('hue', 'Hue', 'hsl(0, 100%, 50%)')
cases['color-slider-focus'] = full('hue', 'Hue', 'hsl(200, 100%, 50%)')
cases['color-slider-saturation'] = full('saturation', 'Saturation', 'hsl(220, 70%, 50%)')
cases['color-slider-lightness'] = full('lightness', 'Lightness', 'hsl(220, 70%, 50%)')
cases['color-slider-alpha'] = full('alpha', 'Alpha', 'hsla(0, 100%, 50%, 0.5)')
cases['color-slider-red'] = full('red', 'Red', 'rgb(255, 100, 50)')
cases['color-slider-brightness'] = full('brightness', 'Brightness', 'hsb(220, 70%, 60%)', { colorSpace: 'hsb' })
cases['color-slider-disabled'] = full('hue', 'Hue', 'hsl(200, 100%, 50%)', { isDisabled: true })

cases['color-slider-no-label'] = () => (
  <ColorSlider aria-label="Hue" channel="hue" className="w-[320px]" defaultValue="hsl(120, 100%, 50%)">
    <ColorSlider.Track>
      <ColorSlider.Thumb />
    </ColorSlider.Track>
  </ColorSlider>
)

cases['color-slider-vertical'] = () => (
  <div className="flex h-48 gap-4">
    <ColorSlider aria-label="Hue" channel="hue" defaultValue="hsl(0, 100%, 50%)" orientation="vertical">
      <ColorSlider.Track>
        <ColorSlider.Thumb />
      </ColorSlider.Track>
    </ColorSlider>
    <ColorSlider aria-label="Saturation" channel="saturation" defaultValue="hsl(0, 100%, 50%)" orientation="vertical">
      <ColorSlider.Track>
        <ColorSlider.Thumb />
      </ColorSlider.Track>
    </ColorSlider>
    <ColorSlider aria-label="Lightness" channel="lightness" defaultValue="hsl(0, 100%, 50%)" orientation="vertical">
      <ColorSlider.Track>
        <ColorSlider.Thumb />
      </ColorSlider.Track>
    </ColorSlider>
  </div>
)

cases['color-slider-custom-styles'] = () => (
  <ColorSlider channel="hue" className="w-[320px]" defaultValue="hsl(220, 70%, 50%)">
    <Label className="font-medium text-foreground">Hue</Label>
    <ColorSlider.Output className="text-muted tabular-nums" />
    <ColorSlider.Track className="h-4! rounded-none! ring-1 ring-border [&::after]:rounded-r-sm! [&::before]:rounded-l-sm!">
      <ColorSlider.Thumb className="size-4 rounded-sm! border-2 border-background shadow-md ring-1 ring-black/10 dark:ring-white/20" />
    </ColorSlider.Track>
  </ColorSlider>
)
