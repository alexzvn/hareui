import type { ReactElement } from 'react'
import { ColorSwatchPicker } from '@heroui/react'

export const cases: Record<string, () => ReactElement> = {}

const colors = ['#F43F5E', '#D946EF', '#8B5CF6', '#3B82F6', '#06B6D4', '#10B981', '#84CC16']
const sizes = ['xs', 'sm', 'md', 'lg', 'xl'] as const

function Picker(props: Record<string, any> & { disabledItems?: boolean, indicator?: ReactElement }) {
  const { disabledItems, indicator, ...rest } = props
  return (
    <ColorSwatchPicker {...rest}>
      {colors.map(color => (
        <ColorSwatchPicker.Item key={color} color={color} isDisabled={disabledItems}>
          <ColorSwatchPicker.Swatch />
          {indicator ? <ColorSwatchPicker.Indicator>{indicator}</ColorSwatchPicker.Indicator> : <ColorSwatchPicker.Indicator />}
        </ColorSwatchPicker.Item>
      ))}
    </ColorSwatchPicker>
  )
}

cases['color-swatch-picker-basic'] = () => <Picker />

cases['color-swatch-picker-default-value'] = () => <Picker defaultValue="#8B5CF6" />

cases['color-swatch-picker-sizes'] = () => (
  <div className="flex flex-col gap-6">
    {sizes.map(size => (
      <div key={size} className="flex items-center gap-4">
        <span className="w-8 text-sm text-muted">{size}</span>
        <Picker defaultValue="#8B5CF6" size={size} />
      </div>
    ))}
  </div>
)

cases['color-swatch-picker-variants'] = () => (
  <div className="flex flex-col gap-6">
    <Picker defaultValue="#3B82F6" variant="circle" />
    <Picker defaultValue="#3B82F6" variant="square" />
  </div>
)

cases['color-swatch-picker-square-sizes'] = () => (
  <div className="flex flex-col gap-6">
    {sizes.map(size => <Picker key={size} defaultValue="#8B5CF6" size={size} variant="square" />)}
  </div>
)

cases['color-swatch-picker-disabled'] = () => <Picker disabledItems defaultValue="#8B5CF6" />

cases['color-swatch-picker-stack'] = () => <Picker defaultValue="#8B5CF6" layout="stack" />

cases['color-swatch-picker-custom-indicator'] = () => (
  <Picker
    defaultValue="#8B5CF6"
    indicator={<svg aria-hidden="true" fill="currentColor" viewBox="0 0 16 16"><circle cx="8" cy="8" r="6" /></svg>}
  />
)

cases['color-swatch-picker-hover'] = () => <Picker defaultValue="#8B5CF6" />

cases['color-swatch-picker-focus'] = () => <Picker defaultValue="#8B5CF6" />
