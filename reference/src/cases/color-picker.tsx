import type { ReactElement } from 'react'
import { Button, ColorArea, ColorField, ColorPicker, ColorSlider, ColorSwatch, ColorSwatchPicker, Label, ListBox, Select } from '@heroui/react'
import { useEffect } from 'react'
import { gear } from '../icons'

export const cases: Record<string, () => ReactElement> = {}

const presets = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899', '#f43f5e']
const spaces = ['hsb', 'hsl', 'rgb']

function Trigger({ label = 'Pick a color', className, labelClassName }: { label?: string, className?: string, labelClassName?: string }) {
  return (
    <ColorPicker.Trigger className={className}>
      <ColorSwatch size="lg" />
      <Label className={labelClassName}>{label}</Label>
    </ColorPicker.Trigger>
  )
}

const area = (label = true) => (
  <ColorArea aria-label={label ? 'Color area' : undefined} className="max-w-full" colorSpace="hsb" xChannel="saturation" yChannel="brightness">
    <ColorArea.Thumb />
  </ColorArea>
)

const hue = (ariaLabel?: string) => (
  <ColorSlider aria-label={ariaLabel} channel="hue" className="gap-1 px-1" colorSpace="hsb">
    <Label>Hue</Label>
    <ColorSlider.Output className="text-muted" />
    <ColorSlider.Track><ColorSlider.Thumb /></ColorSlider.Track>
  </ColorSlider>
)

const swatches = (className: string) => (
  <ColorSwatchPicker className={className} size="xs">
    {presets.map(p => (
      <ColorSwatchPicker.Item key={p} color={p}>
        <ColorSwatchPicker.Swatch />
        <ColorSwatchPicker.Indicator />
      </ColorSwatchPicker.Item>
    ))}
  </ColorSwatchPicker>
)

const spaceSelect = (className?: string) => (
  <Select aria-label="Color space" defaultValue="hsl" variant="secondary">
    <Select.Trigger>
      <Select.Value className={className} />
      <Select.Indicator />
    </Select.Trigger>
    <Select.Popover>
      <ListBox>
        {spaces.map(s => (
          <ListBox.Item key={s} className="uppercase" id={s} textValue={s}>
            {s}
            <ListBox.ItemIndicator />
          </ListBox.Item>
        ))}
      </ListBox>
    </Select.Popover>
  </Select>
)

// RAC's ColorPicker has no `defaultOpen` (its DialogTrigger isn't exposed), so open the popover by clicking the trigger.
function OpenOnMount({ children }: { children: ReactElement }) {
  useEffect(() => {
    const el = document.querySelector<HTMLElement>('[data-slot=color-picker-trigger]')
    if (el && el.getAttribute('aria-expanded') !== 'true')
      el.click()
  }, [])
  return children
}

const basic = (props: Record<string, unknown> = {}) => () => (
  <ColorPicker defaultValue="hsb(240, 60%, 100%)" {...props}>
    <Trigger />
    <ColorPicker.Popover>{area()}{hue()}</ColorPicker.Popover>
  </ColorPicker>
)

cases['color-picker-default'] = basic()
cases['color-picker-hover'] = basic()
cases['color-picker-focus'] = basic()
cases['color-picker-disabled'] = () => (
  <ColorPicker defaultValue="hsb(240, 60%, 100%)">
    <ColorPicker.Trigger isDisabled><ColorSwatch size="lg" /><Label>Pick a color</Label></ColorPicker.Trigger>
    <ColorPicker.Popover>{area()}{hue()}</ColorPicker.Popover>
  </ColorPicker>
)
cases['color-picker-open'] = () => <OpenOnMount>{basic()()}</OpenOnMount>

cases['color-picker-open-swatches'] = () => (
  <OpenOnMount>
  <ColorPicker defaultValue="hsb(0, 60%, 100%)">
    <Trigger label="Brand Color" />
    <ColorPicker.Popover>{area()}{hue('Hue slider')}{swatches('justify-center px-1')}</ColorPicker.Popover>
  </ColorPicker>
  </OpenOnMount>
)

cases['color-picker-open-fields'] = () => (
  <OpenOnMount>
  <ColorPicker defaultValue="hsl(240, 100%, 50%)">
    <Trigger />
    <ColorPicker.Popover className="max-w-62 gap-2">
      {area(false)}
      {hue()}
      {spaceSelect('uppercase')}
      <div className="grid w-full grid-cols-3 items-center gap-2">
        {['hue', 'saturation', 'lightness'].map(channel => (
          <ColorField key={channel} aria-label={channel} channel={channel as any} colorSpace="hsl">
            <ColorField.Group variant="secondary"><ColorField.Input /></ColorField.Group>
          </ColorField>
        ))}
      </div>
    </ColorPicker.Popover>
  </ColorPicker>
  </OpenOnMount>
)

cases['color-picker-open-sliders'] = () => (
  <OpenOnMount>
  <ColorPicker defaultValue="hsl(219, 58%, 93%)">
    <Trigger />
    <ColorPicker.Popover className="max-w-62 gap-2 px-2 py-3">
      {spaceSelect('uppercase')}
      <div className="flex flex-col gap-2">
        {['hue', 'saturation', 'lightness', 'alpha'].map(channel => (
          // @ts-expect-error dynamic channel
          <ColorSlider key={channel} aria-label={channel} channel={channel} className="gap-1 px-1" colorSpace="hsl">
            <Label className="capitalize">{channel}</Label>
            <ColorSlider.Output className="text-muted" />
            <ColorSlider.Track><ColorSlider.Thumb /></ColorSlider.Track>
          </ColorSlider>
        ))}
      </div>
    </ColorPicker.Popover>
  </ColorPicker>
  </OpenOnMount>
)

cases['color-picker-open-controlled'] = () => (
  <OpenOnMount>
  <ColorPicker defaultValue="hsb(120, 50%, 80%)">
    <Trigger />
    <ColorPicker.Popover className="gap-2">
      {swatches('justify-center pt-2')}
      {area()}
      <div className="flex items-center gap-2 px-1">
        <ColorSlider aria-label="Hue slider" channel="hue" className="flex-1" colorSpace="hsb">
          <ColorSlider.Track><ColorSlider.Thumb /></ColorSlider.Track>
        </ColorSlider>
        <Button isIconOnly aria-label="Shuffle color" size="sm" variant="tertiary">{gear()}</Button>
      </div>
      <ColorField aria-label="Color field">
        <ColorField.Group variant="secondary">
          <ColorField.Prefix><ColorSwatch size="xs" /></ColorField.Prefix>
          <ColorField.Input />
        </ColorField.Group>
      </ColorField>
    </ColorPicker.Popover>
  </ColorPicker>
  </OpenOnMount>
)

cases['color-picker-open-custom-styles'] = () => (
  <OpenOnMount>
  <ColorPicker defaultValue="hsb(240, 60%, 100%)">
    <Trigger className="rounded-xl bg-default-soft px-3 py-2" labelClassName="font-medium text-foreground" label="Theme color" />
    <ColorPicker.Popover className="bg-surface">{area()}{hue()}</ColorPicker.Popover>
  </ColorPicker>
  </OpenOnMount>
)
