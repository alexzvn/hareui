import type { ReactElement } from 'react'
import { ToggleButton, ToggleButtonGroup } from '@heroui/react'

const icon = <svg aria-hidden="true" fill="currentColor" height="1em" viewBox="0 0 16 16" width="1em"><rect height={10} width={10} x={3} y={3} /></svg>
const keys = ['bold', 'italic', 'underline']
const group = (props: Record<string, unknown>, separator = true, button: (i: number) => Record<string, unknown> = () => ({})) => (
  <ToggleButtonGroup selectionMode="multiple" {...props}>
    {keys.map((k, i) => (
      <ToggleButton key={k} isIconOnly aria-label={k} id={k} {...button(i)}>
        {separator && i > 0 && <ToggleButtonGroup.Separator />}
        {icon}
      </ToggleButton>
    ))}
  </ToggleButtonGroup>
)

export const cases: Record<string, () => ReactElement> = {
  'toggle-button-group-basic': () => group({}),
  'toggle-button-group-selected': () => group({ defaultSelectedKeys: ['bold', 'italic'] }),
  'toggle-button-group-no-separator': () => group({}, false),
  'toggle-button-group-vertical': () => group({ orientation: 'vertical', defaultSelectedKeys: ['italic'] }),
  'toggle-button-group-detached': () => group({ isDetached: true, defaultSelectedKeys: ['bold'] }),
  'toggle-button-group-full-width': () => <div className="w-96">{group({ fullWidth: true })}</div>,
  'toggle-button-group-sm': () => group({ size: 'sm', defaultSelectedKeys: ['underline'] }),
  'toggle-button-group-disabled': () => group({ isDisabled: true, defaultSelectedKeys: ['bold'] }, true, i => (i === 2 ? { isDisabled: false } : {})),
  'toggle-button-group-single-text': () => (
    <ToggleButtonGroup defaultSelectedKeys={['center']} selectionMode="single">
      {['left', 'center', 'right'].map((k, i) => (
        <ToggleButton key={k} id={k}>
          {i > 0 && <ToggleButtonGroup.Separator />}
          {k}
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  ),
}
